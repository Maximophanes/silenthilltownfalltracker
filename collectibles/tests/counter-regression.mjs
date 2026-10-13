// Isolated DOM regression tests; no real browser storage or network access.
// Run: DENO_DIR=/private/tmp/townfall-v41-deno deno run --cached-only --allow-read --allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE collectibles/tests/counter-regression.mjs
// Happy DOM emulates DOM/media queries, not browser layout or painting.
import { Window } from 'npm:happy-dom@20.8.4';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html = await Deno.readTextFile(Deno.args[0] || new URL('../index.html', import.meta.url));
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
scripts.forEach(code => new vm.Script(code));
const storageKey = 'townfallCollectibles.v1';
const totals = { postcard: 15, phone: 13, signal: 19, container: 14 };
let passed = 0, failed = 0;

function app(width, reducedMotion, saved = null) {
  const window = new Window({ width, height: width < 650 ? 844 : 900,
    url: 'https://tracker.test/collectibles/',
    settings: { disableJavaScriptFileLoading: true, disableCSSFileLoading: true } });
  const document = window.document;
  // Happy DOM 20 lacks browser DOMString conversion for numeric textContent.
  const textContent = Object.getOwnPropertyDescriptor(window.Element.prototype, 'textContent');
  Object.defineProperty(window.Element.prototype, 'textContent', {
    configurable: true, get: textContent.get,
    set(value) { textContent.set.call(this, value == null ? '' : String(value)); }
  });
  document.write(html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, ''));
  if (saved) window.localStorage.setItem(storageKey, saved);
  const media = window.matchMedia.bind(window);
  window.matchMedia = query => query.includes('prefers-reduced-motion')
    ? { matches: reducedMotion, addEventListener() {}, removeEventListener() {} }
    : media(query);
  // Deterministic timers exercise deferred filter and navigation paths.
  let now = 0, nextId = 0;
  const timers = new Map();
  window.setTimeout = (fn, delay = 0) => {
    const id = ++nextId; timers.set(id, { fn, at: now + delay }); return id;
  };
  window.clearTimeout = id => timers.delete(id);
  window.requestAnimationFrame = fn => window.setTimeout(() => fn(now), 16);
  window.cancelAnimationFrame = window.clearTimeout;
  window.HTMLElement.prototype.scrollIntoView = function () {};
  window.HTMLElement.prototype.animate = function () { return { cancel() {} }; };
  window.Image = class { constructor() { this.complete = false; } decode() { return Promise.resolve(); } };
  const context = vm.createContext(window);
  const evaluate = code => vm.runInContext(code, context);
  scripts.forEach(code => evaluate(code));
  const $ = selector => {
    const el = document.querySelector(selector);
    assert.ok(el, `Missing element: ${selector}`); return el;
  };
  const click = selector => $(selector).click();
  const change = (selector, value) => {
    const el = $(selector); el.checked = value;
    el.dispatchEvent(new window.Event('change', { bubbles: true }));
  };
  const search = value => {
    $('#searchInput').value = value;
    $('#searchInput').dispatchEvent(new window.Event('input', { bubbles: true }));
  };
  const tick = (ms = 600) => {
    const end = now + ms;
    for (let n = 0; n < 1000; n++) {
      const entry = [...timers].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!entry) { now = end; return; }
      const [id, t] = entry; timers.delete(id); now = t.at; t.fn();
    }
    throw Error('Timer loop');
  };
  const checks = () => JSON.parse(evaluate('JSON.stringify(profile().checks)'));
  const items = JSON.parse(evaluate('JSON.stringify(ITEMS)'));
  const count = list => list.filter(x => checks()[x.id]).length;
  const categoryItems = part => {
    const filter = evaluate('filter');
    return items.filter(x => String(x.part) === String(part) &&
      (filter === 'all' || x.kind === filter || filter === 'container' && x.kind === 'key'));
  };
  const expectCounts = () => {
    for (const section of document.querySelectorAll('#categoryContent details.cat-part')) {
      const kind = section.dataset.kind;
      const list = items.filter(x => x.kind === kind || kind === 'container' && x.kind === 'key');
      assert.equal(section.querySelector('.countpill').textContent, `${count(list)} / ${totals[kind]}`, `Category ${kind}`);
      const all = section.querySelector('input[data-select-category]');
      assert.equal(all.checked, count(list) === totals[kind]);
      assert.equal(all.indeterminate, count(list) > 0 && count(list) < totals[kind]);
    }
    for (const section of document.querySelectorAll('#storyContent:not([hidden]) details.part')) {
      const list = categoryItems(section.dataset.part);
      assert.equal(section.querySelector('.countpill').textContent, `${count(list)} / ${list.length}`, `Story Part ${section.dataset.part}`);
    }
    const done = count(items);
    assert.equal($('#doneMain').textContent, String(done));
    assert.equal($('#routeTotal').textContent, `${done} / 61`);
    assert.equal($('#mainTotalCurrent').textContent, String(count(items.filter(x => x.kind !== 'key'))));
    assert.equal($('#keyTotalCurrent').textContent, String(count(items.filter(x => x.kind === 'key'))));
    assert.equal($('#overallBar').getAttribute('aria-valuenow'), String(done));
    assert.equal($('#discoveryBar').style.width, `${done / 61 * 100}%`);
    for (const card of document.querySelectorAll('#statGrid [data-category-kind]')) {
      const kind = card.dataset.categoryKind;
      assert.equal(card.querySelector('.category-count-current').textContent, String(count(items.filter(x => x.kind === kind))));
    }
    const stored = JSON.parse(window.localStorage.getItem(storageKey));
    assert.deepEqual(stored.profiles.find(p => p.id === stored.active).checks, checks(), 'Saved checkmarks');
  };
  const categories = () => {
    click('#tab-categories');
    assert.equal(document.querySelectorAll('#categoryContent details.cat-part').length, 4);
    expectCounts();
  };
  const confirm = () => click('#appDialogConfirm');
  const categoryFilter = value => { click('#categoryButton'); click(`#categoryOptions [data-value="${value}"]`); };
  return { window, document, $, click, change, search, tick, evaluate, items, checks,
    expectCounts, categories, confirm, categoryFilter, categoryItems, saved: () => window.localStorage.getItem(storageKey),
    close: async () => {
      timers.clear();
      await window.happyDOM.close();
      Object.defineProperty(window.Element.prototype, 'textContent', textContent);
    } };
}

const scenarios = {
  'Story Route category counters and All scope across all six Parts'(a) {
    for (const category of ['postcard', 'phone', 'signal', 'container', 'all']) {
      a.categoryFilter(category);
      for (let part = 1; part <= 6; part++) {
        const items = a.categoryItems(part);
        const section = a.document.querySelector(`#storyContent details[data-part="${part}"]`);
        if (!items.length) {
          assert.equal(!!section, category === 'all' && part === 5);
          if (section) assert.equal(section.querySelector('.countpill').textContent, '0 / 0');
          continue;
        }
        assert.ok(section); a.expectCounts();
        const before = a.checks();
        a.change(`[data-select-part="${part}"]`, true); a.expectCounts();
        for (const item of a.items) {
          assert.equal(!!a.checks()[item.id], items.some(x => x.id === item.id) || !!before[item.id], item.id);
        }
        a.change(`[data-select-part="${part}"]`, false); a.expectCounts();
        for (const item of a.items) {
          assert.equal(!!a.checks()[item.id], items.some(x => x.id === item.id) ? false : !!before[item.id], item.id);
        }
        a.change(`#storyContent input[data-item="${items[0].id}"]`, true); a.expectCounts();
        a.change(`#storyContent input[data-item="${items[0].id}"]`, false); a.expectCounts();
      }
    }
  },
  'Part counters ignore search while Part All obeys category and search'(a) {
    const target = a.items.find(x => x.kind === 'postcard');
    a.categoryFilter('postcard'); a.search(`postcard #${target.number}`); a.expectCounts();
    assert.equal(a.document.querySelectorAll('#storyContent input[data-item]').length, 1);
    const scope = a.categoryItems(target.part);
    assert.ok(scope.length > 1);
    a.change(`[data-select-part="${target.part}"]`, true); a.expectCounts();
    assert.equal(a.$(`[data-select-part="${target.part}"]`).checked, true);
    assert.equal(a.$(`#storyContent [data-part="${target.part}"] .countpill`).textContent, `1 / ${scope.length}`);
    assert.deepEqual(Object.keys(a.checks()).filter(id => a.checks()[id]), [target.id]);
    a.search('');
    assert.equal(a.$(`[data-select-part="${target.part}"]`).checked, false);
    assert.equal(a.$(`[data-select-part="${target.part}"]`).indeterminate, true);
    a.search(`postcard #${target.number}`);
    a.change(`[data-select-part="${target.part}"]`, false); a.expectCounts();
    assert.equal(Object.values(a.checks()).filter(Boolean).length, 0);
    a.search(''); a.expectCounts();
    a.search(`postcard #${target.number}`); a.categoryFilter('all');
    a.change(`[data-select-part="${target.part}"]`, true); a.expectCounts();
    assert.deepEqual(Object.keys(a.checks()).filter(id => a.checks()[id]), [target.id]);
    a.search('no matching collectible');
    assert.equal(a.document.querySelectorAll('#storyContent [data-select-part]').length, 0);
    assert.deepEqual(Object.keys(a.checks()).filter(id => a.checks()[id]), [target.id]);
  },
  'Show Missing Only keeps category totals stable and filtered All supports Undo'(a) {
    a.categoryFilter('postcard');
    const target = a.items.find(x => x.kind === 'postcard');
    const scope = a.categoryItems(target.part);
    a.change(`#storyContent input[data-item="${target.id}"]`, true);
    a.click('#missingOnly'); a.tick(); a.expectCounts();
    assert.equal(a.$(`[data-select-part="${target.part}"]`).indeterminate, true);
    assert.equal(a.document.querySelector(`#storyContent input[data-item="${target.id}"]`), null);
    const before = a.checks();
    a.change(`[data-select-part="${target.part}"]`, true); a.expectCounts();
    assert.equal(a.document.querySelector(`#storyContent [data-part="${target.part}"]`), null);
    for (const item of a.items) assert.equal(!!a.checks()[item.id], scope.some(x => x.id === item.id) || !!before[item.id]);
    a.click('#undoButton'); a.expectCounts(); assert.deepEqual(a.checks(), before);
    // Clearing the matching scope remains available while some missing items are visible.
    a.change(`[data-select-part="${target.part}"]`, false); a.expectCounts();
    assert.equal(a.document.querySelectorAll(`#storyContent [data-part="${target.part}"] input[data-item]`).length, scope.length);
    a.click('#undoButton'); a.expectCounts(); assert.deepEqual(a.checks(), before);
    a.search(`postcard #${target.number}`); a.expectCounts();
    assert.equal(a.document.querySelectorAll('#storyContent [data-select-part]').length, 0);
    a.click('#missingOnly'); a.tick(); a.expectCounts();
    assert.equal(a.$(`[data-select-part="${target.part}"]`).checked, true);
  },
  'Containers and Keys stay independent under search-scoped Part All'(a) {
    a.categoryFilter('container');
    for (const kind of ['key', 'container']) {
      const target = a.items.find(x => x.kind === kind && x.number === 1);
      a.search(`${kind === 'key' ? 'Lockbox Key' : 'Resource Container'} 1`); a.expectCounts();
      const before = a.checks();
      a.change(`[data-select-part="${target.part}"]`, true); a.expectCounts();
      for (const item of a.items) assert.equal(!!a.checks()[item.id], item.id === target.id || !!before[item.id]);
      a.change(`[data-select-part="${target.part}"]`, false); a.expectCounts();
      for (const item of a.items) assert.equal(!!a.checks()[item.id], item.id === target.id ? false : !!before[item.id]);
      a.click('#undoButton'); a.expectCounts();
      assert.equal(a.checks()[target.id], true);
    }
  },
  async 'Part Undo preserves later unrelated edits and profile/storage state'(a, width, motion) {
    const target = a.items.find(x => x.kind === 'postcard');
    const unrelated = a.items.find(x => x.kind === 'signal' && x.part === target.part);
    a.change(`#storyContent input[data-item="${unrelated.id}"]`, true);
    a.categoryFilter('postcard'); a.search(`postcard #${target.number}`);
    a.change(`[data-select-part="${target.part}"]`, true); a.expectCounts();
    a.search(''); a.categoryFilter('all');
    a.change(`#storyContent input[data-item="${unrelated.id}"]`, false);
    a.click('#undoButton'); a.expectCounts();
    assert.equal(a.checks()[target.id], undefined);
    assert.equal(a.checks()[unrelated.id], false, 'Undo must preserve the later unrelated edit');
    a.categoryFilter('container'); a.change('[data-select-part="1"]', true); a.expectCounts();
    const expected = a.checks();
    a.click('#addProfile'); a.$('#appDialogInput').value = 'Filtered Part test'; a.confirm();
    assert.equal(Object.values(a.checks()).filter(Boolean).length, 0);
    a.click('#profileButton'); a.click('#profileOptions [data-profile="default"]'); a.expectCounts();
    assert.deepEqual(a.checks(), expected);
    assert.equal(a.evaluate('filter'), 'container');
    const reloaded = app(width, motion, a.saved());
    try { reloaded.expectCounts(); assert.deepEqual(reloaded.checks(), expected); }
    finally { await reloaded.close(); }
  },
  'individual checkbox check and uncheck in all five types'(a) {
    a.categories();
    for (const kind of ['postcard', 'phone', 'signal', 'key', 'container']) {
      const item = a.items.find(x => x.kind === kind);
      const selector = `#categoryContent input[data-item="${item.id}"]`;
      a.change(selector, true); assert.equal(a.checks()[item.id], true); a.expectCounts();
      a.change(selector, false); assert.equal(a.checks()[item.id], false); a.expectCounts();
    }
  },
  'category Select All, dashboard All, and Undo'(a) {
    a.categories();
    for (const kind of Object.keys(totals)) {
      a.change(`[data-select-category="${kind}"]`, true); a.expectCounts();
      assert.equal(Object.values(a.checks()).filter(Boolean).length, totals[kind]);
      a.click('#undoButton'); a.expectCounts();
      assert.equal(Object.values(a.checks()).filter(Boolean).length, 0);
      a.change(`[data-select-category="${kind}"]`, true);
      a.change(`[data-select-category="${kind}"]`, false); a.expectCounts();
    }
    for (const kind of ['postcard', 'phone', 'signal', 'container', 'key']) {
      a.change(`[data-overview-all="${kind}"]`, true); a.expectCounts();
      a.change(`[data-overview-all="${kind}"]`, false); a.expectCounts();
    }
  },
  'Mark All, cancel, Clear All, and Undo'(a) {
    a.categories();
    a.change('#markAll', true); a.click('#appDialogCancel'); a.expectCounts();
    assert.equal(Object.values(a.checks()).filter(Boolean).length, 0);
    a.change('#markAll', true); a.confirm(); a.expectCounts();
    assert.equal(a.$('#doneMain').textContent, '61');
    a.click('#clearAll'); a.confirm(); a.expectCounts();
    assert.equal(a.$('#doneMain').textContent, '0');
    a.click('#undoButton'); a.expectCounts();
    assert.equal(a.$('#doneMain').textContent, '61');
    a.change('#markAll', false); a.expectCounts();
  },
  'search and category filters retain full category totals'(a) {
    a.categories();
    for (const [query, kind, number] of [['postcard #1', 'postcard', 1], ['Phone Call #1', 'phone', 1],
      ['CRTV 09', 'signal', 9], ['Lockbox Key 1', 'key', 1], ['Resource Container 1', 'container', 1]]) {
      const id = a.items.find(x => x.kind === kind && x.number === number).id;
      a.search(query); a.expectCounts();
      assert.equal(a.document.querySelectorAll('#categoryContent input[data-item]').length, 1);
      a.change(`#categoryContent input[data-item="${id}"]`, true); a.expectCounts();
      a.change(`#categoryContent input[data-item="${id}"]`, false); a.expectCounts();
    }
    const phone = a.items.find(x => x.kind === 'phone');
    for (const query of [phone.dial, phone.dial.replace(/\D/g, ''), phone.dial.replace(/\s+/g, '-')]) {
      a.search(query); assert.ok(a.document.querySelector(`#categoryContent input[data-item="${phone.id}"]`));
      a.expectCounts();
    }
    a.search('postcard arrival'); a.expectCounts();
    a.change('#categoryContent input[data-item]', true); a.expectCounts();
    a.search('');
    a.click('#categoryButton'); a.click('#categoryOptions [data-value="container"]'); a.expectCounts();
    a.change('#categoryContent input[data-item="key-01"]', true); a.expectCounts();
  },
  'Show Missing Only, filtered removal, Select All and Undo'(a) {
    a.categories(); a.click('#missingOnly'); a.tick(); a.expectCounts();
    a.change('#categoryContent input[data-item="postcard-01"]', true);
    a.expectCounts(); a.tick(); a.expectCounts();
    assert.equal(a.document.querySelector('#categoryContent input[data-item="postcard-01"]'), null);
    a.search('postcard'); a.change('[data-select-category="postcard"]', true); a.expectCounts();
    assert.ok(a.document.querySelector('#categoryContent .missing-only-empty'));
    a.click('#undoButton'); a.expectCounts();
    a.change('#markAll', true); a.confirm(); a.expectCounts();
    assert.equal(a.$('#doneMain').textContent, '61');
    a.click('#clearAll'); a.confirm(); a.expectCounts();
    assert.equal(a.$('#doneMain').textContent, '0');
    a.click('#undoButton'); a.expectCounts();
    assert.equal(a.$('#doneMain').textContent, '61');
    a.click('#undoButton'); // Single-use Undo is already consumed.
    a.click('#clearAll'); a.confirm();
    a.search(''); a.click('#missingOnly'); a.tick(); a.expectCounts();
    a.change('#categoryContent input[data-item="postcard-01"]', false); a.expectCounts();
  },
  'Story Route individual and Part Select All, then return'(a) {
    a.categories(); a.click('#tab-story');
    assert.equal(a.document.querySelectorAll('#storyContent details.part').length, 6);
    a.change('#storyContent input[data-item="postcard-01"]', true); a.expectCounts();
    a.change('[data-select-part="1"]', true); a.expectCounts();
    a.click('#undoButton'); a.expectCounts();
    a.categories();
    a.change('#categoryContent input[data-item="postcard-01"]', false); a.expectCounts();
  },
  async 'profile isolation, preferences, and reload'(a, width, motion) {
    a.categories(); a.change('#categoryContent input[data-item="postcard-01"]', true); a.expectCounts();
    a.click('#addProfile'); a.$('#appDialogInput').value = 'Regression profile'; a.confirm(); a.expectCounts();
    assert.equal(a.$('#doneMain').textContent, '0');
    a.categories(); a.change('#categoryContent input[data-item="signal-01"]', true); a.expectCounts();
    a.click('#profileButton'); a.click('#profileOptions [data-profile="default"]'); a.expectCounts();
    assert.equal(a.checks()['postcard-01'], true); assert.equal(a.checks()['signal-01'], undefined);
    a.click('#missingOnly'); a.tick(); a.expectCounts();
    const reloaded = app(width, motion, a.saved());
    try {
      reloaded.expectCounts();
      assert.equal(reloaded.evaluate('view'), 'categories');
      assert.equal(reloaded.evaluate('onlyMissing'), true);
      assert.equal(reloaded.checks()['postcard-01'], true);
      assert.equal(reloaded.evaluate('db.profiles.length'), 2);
    } finally { await reloaded.close(); }
  },
  async 'existing v40 profile at 13/15 postcards remains compatible'(a, width, motion) {
    const postcards = a.items.filter(x => x.kind === 'postcard').sort((x, y) => x.number - y.number);
    const checks = Object.fromEntries(postcards.slice(0, 13).map(x => [x.id, true]));
    const fixture = JSON.stringify({ active: 'existing', profiles: [{ id: 'existing', name: 'Existing v40 progress',
      checks, ui: { checklistView: 'categories', filter: 'all', onlyMissing: false,
        openedParts: ['1'], openedCategories: Object.keys(totals), achievementExpanded: false } }] });
    const restored = app(width, motion, fixture);
    try {
      restored.expectCounts();
      const counter = () => restored.$('#categoryContent [data-kind="postcard"] .countpill').textContent;
      assert.equal(counter(), '13 / 15');
      restored.change('#categoryContent input[data-item="postcard-14"]', true); restored.expectCounts();
      assert.equal(counter(), '14 / 15');
      restored.change('#categoryContent input[data-item="postcard-14"]', false); restored.expectCounts();
      assert.equal(counter(), '13 / 15');
      assert.equal(restored.$('#discoveryPercent').textContent, '21%');
      assert.deepEqual(Object.keys(restored.checks()).filter(id => restored.checks()[id]), Object.keys(checks));
    } finally { await restored.close(); }
  },
  'Gallery checkbox, Select All and Undo preserve thumbnail nodes'(a) {
    a.categories(); a.click('#tab-gallery');
    const image = a.document.querySelector('#galleryContent img');
    a.change('#galleryContent input[data-item="postcard-01"]', true); a.expectCounts();
    a.change('#gallerySelectAll', true); a.expectCounts();
    a.click('#undoButton'); a.expectCounts();
    assert.equal(a.document.querySelector('#galleryContent img'), image);
    assert.equal(a.$('#doneMain').textContent, '1');
    a.click('#galleryBack'); a.expectCounts();
  },
  'category/story Return preserves search and counters'(a) {
    a.categories(); a.search('postcard #1');
    a.click('#categoryContent [data-to-route="postcard-01"]'); a.expectCounts();
    a.change('#storyContent input[data-item="postcard-01"]', true); a.expectCounts();
    a.click('[data-return-category="postcard-01"]'); a.expectCounts();
    assert.equal(a.$('#searchInput').value, 'postcard #1');
    assert.ok(a.$('#categoryContent [data-entry-id="postcard-01"]').classList.contains('next-missing-hit'));
  }
};

for (const width of [1280, 390]) {
  for (const motion of [false, true]) {
    for (const [name, run] of Object.entries(scenarios)) {
      const a = app(width, motion);
      try {
        assert.equal(a.window.matchMedia('(max-width:650px)').matches, width < 650);
        await run(a, width, motion); passed++;
        console.log(`PASS ${width}px reduced-motion=${motion}: ${name}`);
      } catch (error) {
        failed++; console.error(`FAIL ${width}px reduced-motion=${motion}: ${name}\n${error.stack}`);
      } finally { await a.close(); }
    }
  }
}
console.log(`JavaScript syntax: PASS (${scripts.length} inline scripts). DOM scenarios: ${passed} passed, ${failed} failed.`);
if (failed) Deno.exit(1);
