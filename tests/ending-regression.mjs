// Run from the repository root:
// DENO_DIR=/private/tmp/townfall-v41-deno deno run --cached-only --allow-read --allow-run=git --allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE tests/ending-regression.mjs
// Isolated DOM/media-query tests; no real browser storage, networking or painting.
import { Window } from 'npm:happy-dom@20.8.4';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { withApprovedSocialPreview } from './social-preview-fixture.mjs';

// An optional input fixture exercises rejection guards through this same entry point.
const html = await Deno.readTextFile(Deno.args[0] || new URL('../index.html', import.meta.url));
const baselineResult = new Deno.Command('git', { args: ['show', 'cb0f17a:index.html'] }).outputSync();
assert.equal(baselineResult.code, 0, 'v113 baseline must be available');
const baseline = new TextDecoder().decode(baselineResult.stdout);
const v114Result = new Deno.Command('git', { args: ['show', 'b0d73c3:index.html'] }).outputSync();
assert.equal(v114Result.code, 0, 'Published v114 baseline must be available');
const v114 = new TextDecoder().decode(v114Result.stdout);
const scriptsFor = source => [...source.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const scripts = scriptsFor(html);
scripts.forEach(code => new vm.Script(code));
const dataset = (source, name) => JSON.parse(source.match(new RegExp(`const ${name} = (\\[.*?\\]);`))[1]);
const items = dataset(html, 'COLLECTIBLES'), oldItems = dataset(baseline, 'COLLECTIBLES');
const ngItems = dataset(html, 'NG_ITEMS'), oldNG = dataset(baseline, 'NG_ITEMS');
const storageKey = 'townfallEndingTracker.v2';
const codes = { 21: '2896', 26: '1993', 59: '4895', 63: '486' }; // Stable ID 21 is displayed Discovery 18.
const v115Descriptions = {
  26: 'In the Community Gardens, unlock the Jane’s Garden shed using code 1993, found on Jane Chalmers’ commemorative plaque. Read the obituary on the middle shelf.',
  83: 'SWDP - Different: in the AUX room, insert the AUX Disk into the computer and read “Auxiliary Lines”.',
  bronzeCoin: 'Follow the main road to VIDEO STAR (the Video Rental Store marked 1 on the Shorefront map). Enter the shop and collect the Bronze Coin from the shelf in the small back room.'
};
let passed = 0, failed = 0;

// Assert classifications, IDs, Parts and every unrelated data field remain intact.
assert.equal(items.length, 85); assert.equal(ngItems.length, 11);
assert.equal(new Set(items.map(x => x.id)).size, 85);
assert.equal(new Set(ngItems.map(x => x.id)).size, 11);
assert.deepEqual(items.map(x => x.id).sort((a, b) => a - b), oldItems.map(x => x.id).sort((a, b) => a - b));
assert.deepEqual(ngItems.map(x => x.id), oldNG.map(x => x.id));
assert.equal(items.filter(x => x.type === 'Document').length, 52);
assert.equal(items.filter(x => x.type === 'Clue').length, 33);
assert.deepEqual(items.slice(11, 13).map(x => x.id), [13, 12]);
const expectedOrder = oldItems.map(x => x.id);
[expectedOrder[11], expectedOrder[12]] = [expectedOrder[12], expectedOrder[11]];
assert.deepEqual(items.map(x => x.id), expectedOrder);
const titleChanges = new Set([6, 26, 38, 40, 68]);
const whereChanges = new Set([1, 2, 7, 8, 9, 11, 12, 13, 15, 16, 17, 21, 23, 25, 26, 30, 32, 36, 37, 38, 39, 40, 42, 47, 49,
  56, 57, 58, 59, 61, 62, 63, 66, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83]);
for (const old of oldItems) {
  const current = items.find(x => x.id === old.id);
  for (const key of Object.keys(old)) {
    if (key === 'name' && titleChanges.has(old.id) || key === 'where' && whereChanges.has(old.id)) continue;
    assert.deepEqual(current[key], old[key], `Unapproved change: Discovery ID ${old.id} ${key}`);
  }
  assert.deepEqual(Object.keys(current), Object.keys(old));
}
for (const old of oldNG) {
  const current = ngItems.find(x => x.id === old.id);
  for (const key of Object.keys(old)) {
    if (key === 'name' && ['book1', 'book2', 'book3'].includes(old.id) ||
      key === 'where' && ['book1', 'book3', 'goldCoin', 'bronzeCoin'].includes(old.id)) continue;
    assert.deepEqual(current[key], old[key], `Unapproved change: NG ${old.id} ${key}`);
  }
}
// Calculation, storage, dependency, navigation and animation functions must be byte-identical.
for (const name of ['blankSave', 'loadDB', 'saveDB', 'updateNGState', 'chooseProfile', 'compute',
  'renderNG', 'focusNextMissing', 'animateDiscoveryFilterMode', 'updateNGProgressUI']) {
  const pattern = new RegExp(`function ${name}\\([^]*?\\n\\}`);
  assert.ok(baseline.match(pattern), `Baseline function ${name}`);
  assert.equal(html.match(pattern)?.[0], baseline.match(pattern)[0], name);
}
const styles = source => source.match(/<style>([\s\S]*?)<\/style>/)[1];
assert.equal(styles(html).replace(/\.discovery-spoiler\{[^]*?(?=\.guide\{)/, ''), styles(baseline), 'Only spoiler CSS was added');
console.log('PASS static inventory, approved change scope, stable IDs, existing logic and CSS');

// v115 is strictly three description edits, a version comment and one existing code-map entry.
for (const [name, current] of [['COLLECTIBLES', items], ['NG_ITEMS', ngItems]]) {
  const previous = dataset(v114, name);
  assert.deepEqual(current.map(x => x.id), previous.map(x => x.id), `${name} ordering`);
  for (const old of previous) {
    const item = current.find(x => x.id === old.id);
    assert.deepEqual(item, old.id in v115Descriptions ? { ...old, where: v115Descriptions[old.id] } : old);
  }
}
const withoutDatasets = source => source.replace(/const (COLLECTIBLES|NG_ITEMS) = (\[.*?\]);/g, 'const $1 = [];');
assert.equal(withoutDatasets(html), withApprovedSocialPreview(withoutDatasets(v114)
  .replace('<!-- Ending & Progress Tracker v114 -->', '<!-- Ending & Progress Tracker v115 -->')
  .replace('const DISCOVERY_ACCESS_CODES={21:"2896",59:"4895",63:"486"};', 'const DISCOVERY_ACCESS_CODES={21:"2896",26:"1993",59:"4895",63:"486"};'), 'ending'),
  'Only approved v115 changes and exact social metadata may differ from v114');
// Retain historical social-metadata and v45 baselines; pin reviewed v46 separately.
const collectiblesV44 = new Deno.Command('git', { args: ['show', '8a4c10e:collectibles/index.html'] }).outputSync();
assert.equal(collectiblesV44.code, 0, 'Published Collectibles v44 baseline must be available');
const publishedSocialV44 = new Deno.Command('git', { args: ['show', 'fb3bf7d:collectibles/index.html'] }).outputSync();
assert.equal(publishedSocialV44.code, 0, 'Published social-preview baseline must be available');
assert.equal(new TextDecoder().decode(publishedSocialV44.stdout),
  withApprovedSocialPreview(new TextDecoder().decode(collectiblesV44.stdout), 'collectibles'),
  'Collectibles v44 HTML may differ only by the exact approved social metadata');
const collectiblesV45 = new Deno.Command('git', { args: ['show', '72ef69b:collectibles/index.html'] }).outputSync();
assert.equal(collectiblesV45.code, 0, 'Published Collectibles v45 baseline must be available');
assert.equal(createHash('sha256').update(collectiblesV45.stdout).digest('hex'),
  '6c3707dabf7c32c40fc722800543f07ab3edeaf716eacff901fbd75caaa0df6f', 'Published v45 baseline must remain intact');
assert.equal(createHash('sha256').update(await Deno.readTextFile(new URL('../collectibles/index.html', import.meta.url))).digest('hex'),
  'aa075917ea0927e9fbeb0793f77abab34b799572f7ef753934ba96a408ccff51', 'Collectibles must match the complete reviewed v46 HTML, including approved social metadata');
// Keep the directory guard; allow only the strictly checked HTML and this
// task's accuracy/counter tests and Collectibles release notes, not other files or assets.
const collectiblesDiff = new Deno.Command('git', { args: ['diff', '--exit-code', '8a4c10e', '--',
  'collectibles/', ':(exclude)collectibles/index.html',
  ':(exclude)collectibles/tests/accuracy-regression.mjs',
  ':(exclude)collectibles/tests/counter-regression.mjs', ':(exclude)collectibles/README.md'] }).outputSync();
assert.equal(collectiblesDiff.code, 0, 'All other published Collectibles files must remain untouched');
console.log('PASS exact v115/v46 application scope and approved static sharing metadata');

function app(width, reducedMotion, saved = null, source = html) {
  const window = new Window({ width, height: width < 650 ? 844 : 900, url: 'https://ending.test/',
    settings: { disableJavaScriptFileLoading: true, disableCSSFileLoading: true,
      device: { prefersReducedMotion: reducedMotion ? 'reduce' : 'no-preference' } } });
  const document = window.document;
  const textContent = Object.getOwnPropertyDescriptor(window.Element.prototype, 'textContent');
  Object.defineProperty(window.Element.prototype, 'textContent', { configurable: true, get: textContent.get,
    set(value) { textContent.set.call(this, value == null ? '' : String(value)); } });
  document.write(source.replace(/<script[^>]*>[\s\S]*?<\/script>/g, ''));
  if (saved) window.localStorage.setItem(storageKey, saved);
  let now = 0, nextId = 0;
  const timers = new Map();
  window.setTimeout = (fn, delay = 0) => {
    const id = ++nextId; timers.set(id, { fn, at: now + delay }); return id;
  };
  window.clearTimeout = id => timers.delete(id);
  window.requestAnimationFrame = fn => window.setTimeout(() => fn(now), 16);
  window.cancelAnimationFrame = window.clearTimeout;
  const scrollTargets = [];
  window.HTMLElement.prototype.scrollIntoView = function () { scrollTargets.push(this.id); };
  window.HTMLElement.prototype.animate = function () { return { cancel() {} }; };
  const context = vm.createContext(window);
  const evaluate = code => vm.runInContext(code, context);
  scriptsFor(source).forEach(evaluate);
  const $ = selector => { const el = document.querySelector(selector); assert.ok(el, `Missing ${selector}`); return el; };
  const click = selector => $(selector).click();
  const change = (selector, value) => {
    const el = $(selector); el.checked = value;
    el.dispatchEvent(new window.Event('change', { bubbles: true }));
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
  const json = expression => JSON.parse(evaluate(`JSON.stringify(${expression})`));
  const checks = () => json('active().discoveries');
  const savedState = () => window.localStorage.getItem(storageKey);
  const expectCounts = () => {
    const done = items.filter(x => checks()[x.id]).length;
    assert.equal($('#discoveryCount').textContent, `${done} / 85`);
    assert.equal($('#discoveryBar').style.width, `${Math.round(done / 85 * 100)}%`);
    if (done < 85) assert.equal($('#discoveryPercent').textContent, `${Math.round(done / 85 * 100)}%`);
    for (const section of document.querySelectorAll('#parts details.part')) {
      const list = items.filter(x => x.part === Number(section.dataset.part));
      const count = list.filter(x => checks()[x.id]).length;
      assert.equal(section.querySelector('.partcount').textContent, `${count} / ${list.length}`);
    }
    assert.deepEqual(JSON.parse(savedState()).saves.find(s => s.id === json('db.active')).discoveries, checks());
  };
  return { window, document, $, click, change, tick, evaluate, json, checks, saved: savedState, expectCounts, scrollTargets,
    close: async () => { timers.clear(); await window.happyDOM.close();
      Object.defineProperty(window.Element.prototype, 'textContent', textContent); } };
}

function fixture(discoveries = {}) {
  const profile = { id: 'existing', name: 'Existing v113', targetEnding: 'Justice', ngPlus: true,
    kills: 2, refills: 1, mistakes: 3, discoveries, ng: { book1: true },
    openParts: [1, 2, 3, 4, 5, 6], ngChecklistOpen: true, showMissingOnly: false, achievementExpanded: true };
  return JSON.stringify({ active: 'existing', saves: [profile,
    { ...profile, id: 'second', name: 'Second profile', discoveries: { 13: true }, ng: { book2: true } }], discoveryListVersion: 2 });
}

const scenarios = {
  'v115 exact wording, shared spoiler markup and preserved metadata'(a) {
    const where = a.$('#discovery-26 .where');
    const reconstructed = where.cloneNode(true);
    const button = reconstructed.querySelector('.discovery-spoiler');
    button.replaceWith(a.document.createTextNode(button.querySelector('.discovery-spoiler-code').textContent));
    assert.equal(reconstructed.textContent, v115Descriptions[26]);
    const outside = where.cloneNode(true);
    outside.querySelector('.discovery-spoiler').remove();
    assert.equal(outside.textContent.includes('1993'), false, 'No duplicate plaintext code outside the control');
    assert.equal(where.querySelector('.entry-note,.discovery-warning'), null);
    assert.equal(a.$('#discovery-83 .where').textContent, v115Descriptions[83]);
    for (const id of [26, 83]) assert.equal(a.$(`#discovery-${id} .meta`).textContent,
      `${items.find(x => x.id === id).type} · Part ${items.find(x => x.id === id).part}`);
    assert.equal(a.$('#discovery-26 .discovery-spoiler').className, a.$('#discovery-21 .discovery-spoiler').className);
    a.change('#ngPlus', true);
    assert.equal(a.$('#ngList [data-ng-id="bronzeCoin"] .where').textContent, v115Descriptions.bronzeCoin);
    assert.equal(ngItems.find(x => x.id === 'bronzeCoin').chapter, 'Chapter 1 · Cold Open');
  },
  async 'v114 saved corrected entries, Bronze Coin, profiles and reload remain compatible'(a, width, motion) {
    const legacy = app(width, motion, fixture({ 26: true, 83: true }), v114);
    let saved;
    try {
      legacy.change('#ngList input[data-ng-id="bronzeCoin"]', true);
      legacy.change('#ngList input[data-ng-id="bronzeInserted"]', true);
      saved = legacy.saved();
    } finally { await legacy.close(); }
    const restored = app(width, motion, saved);
    let reloadData;
    try {
      assert.deepEqual(restored.json('db'), JSON.parse(saved), 'No saved schema migration');
      assert.equal(restored.$('#discovery-26 > input').checked, true);
      assert.equal(restored.$('#discovery-83 > input').checked, true);
      assert.equal(restored.$('#ngList input[data-ng-id="bronzeCoin"]').checked, true);
      assert.equal(restored.$('#ngList input[data-ng-id="bronzeInserted"]').checked, true);
      restored.click('#discovery-26 .discovery-spoiler');
      restored.click('#saveSelectButton'); restored.click('#saveSelectOptions [data-id="second"]');
      assert.equal(restored.$('#discovery-26 > input').checked, false);
      assert.equal(restored.$('#discovery-26 .discovery-spoiler').getAttribute('aria-pressed'), 'false');
      restored.click('#saveSelectButton'); restored.click('#saveSelectOptions [data-id="existing"]');
      assert.deepEqual(restored.json('db'), JSON.parse(saved)); restored.expectCounts();
      restored.click('#discovery-26 .discovery-spoiler'); reloadData = restored.saved();
    } finally { await restored.close(); }
    const reloaded = app(width, motion, reloadData);
    try {
      assert.deepEqual(reloaded.json('db'), JSON.parse(saved)); reloaded.expectCounts();
      assert.equal(reloaded.$('#discovery-26 .discovery-spoiler').getAttribute('aria-pressed'), 'false');
    } finally { await reloaded.close(); }
  },
  'approved text, numbering, inventory and exact subjects'(a) {
    const titles = { 6: 'Vigil & Protest Flyer', 26: 'Jane Chalmers Obituary', 38: 'Unrealistic Expectations (number 1098512....)',
      40: 'Records Room Code', 68: 'Facilities: “DONTREAD.DOC”' };
    for (const [id, title] of Object.entries(titles)) assert.equal(a.$(`#discovery-${id} .itemname`).textContent, `${id}. ${title}`);
    assert.match(a.$('#discovery-13 .itemname').textContent, /^12\./);
    assert.match(a.$('#discovery-12 .itemname').textContent, /^13\./);
    assert.equal(a.document.querySelectorAll('#parts .item').length, 85);
    assert.ok(a.$('#discovery-38 .where').textContent.includes('“Unrealistic Expectations (number 1098512....)”.'));
    assert.ok(a.$('#discovery-75 .where').textContent.includes('“Might as well pack his things. He\'s done.”'));
    assert.ok(a.$('#discovery-77 .where').textContent.includes('“whatdidyoudo?”'));
    assert.ok(a.$('#discovery-79 .where').textContent.includes('“RE: Ordell Site Visit”'));
    const descriptions = [...items, ...ngItems].map(x => x.where).join('\n');
    assert.doesNotMatch(descriptions, /(?:Chapman|Victoria) Ward \d+F|CEG HQ(?: \(Different\))? \d+F|CEG HQ - First Floor|CEG HQ Ground Floor|(?:SWDP|Medical Centre) [–—] Different|(?:Zoe|Jess)[’']s House|e-mail|Room 593/);
    assert.equal(items.filter(x => [58, 59, 60, 82, 83, 84].includes(x.id) && x.type === 'Clue').length, 6);
    a.change('#ngPlus', true);
    for (const id of ['book1', 'book2', 'book3']) assert.equal(a.$(`#ngList .item[data-ng-id="${id}"] .itemname`).firstChild.textContent.trim(), ngItems.find(x => x.id === id).name);
  },
  'final Clinic wording, room names and Ground Floor corrections'(a) {
    const expected = {
      15: 'Inside the Clinic, enter Z Ellis’s room through the second door at the end of the hallway, then inspect the paper to the left of the scales.',
      16: 'Inside the Clinic, use the computer in Z Ellis’s room to open “Where Are You?”.',
      17: 'Inside the Clinic, use the computer in Z Ellis’s room to open “Answer Phone Message”.',
      30: 'On a bed inside the tent at the back-left corner of the parking lot.',
      36: 'Victoria Ward Ground Floor: go to the end of the hallway past Reception and enter Consult Room B; use the computer and open “Supply Situation Update”.',
      37: 'Victoria Ward Ground Floor: go to the end of the hallway past Reception and enter Consult Room B; use the computer and open “RE: Supply Situation Update”.',
      42: 'Medical Centre - Different: take the right-hand hallway to the last door, crouch through the vent, and check the table beside the tape player.',
      59: 'CEG HQ - Ground Floor: unlock the Security room (code: 4895), then check the trash can inside.',
      66: 'CEG HQ Exterior: in the second building, go upstairs and left into the Managers Office; the memo is on the desk to the left.'
    };
    for (const [id, where] of Object.entries(expected)) {
      assert.equal(items.find(x => x.id === Number(id)).where, where, `Discovery ${id}`);
      if (id !== '59') assert.equal(a.$(`#discovery-${id} .where`).textContent, where);
    }
    const lobby = items.filter(x => x.where.startsWith('CEG HQ - Ground Floor:'));
    assert.deepEqual(lobby.map(x => x.id), [56, 57, 58, 59, 61, 62, 63]);
    for (const id of [56, 57, 58, 61, 62, 63]) {
      const original = oldItems.find(x => x.id === id).where;
      const expectedWhere = id === 63
        ? 'CEG HQ - Ground Floor: in the main hall seating area, unlock the metal lockbox labeled 36 (code: 486) and collect the Employee File Cover Note.'
        : original.replace('CEG HQ Ground Floor:', 'CEG HQ - Ground Floor:');
      assert.equal(items.find(x => x.id === id).where, expectedWhere);
    }
    assert.equal(a.$('#discovery-59 .discovery-spoiler').getAttribute('aria-pressed'), 'false');
    assert.equal(a.$('#discovery-59 .discovery-spoiler-code').textContent, '4895');
    assert.equal(a.window.getComputedStyle(a.$('#discovery-59 .discovery-spoiler-code')).visibility, 'hidden');
  },
  'concealed codes, activation, focus and checkbox independence'(a) {
    assert.equal(a.document.querySelectorAll('.discovery-spoiler').length, Object.keys(codes).length);
    for (const [id, code] of Object.entries(codes)) {
      const selector = `#discovery-${id} .discovery-spoiler`;
      let button = a.$(selector);
      assert.equal(button.tagName, 'BUTTON'); assert.equal(button.type, 'button');
      assert.equal(button.getAttribute('aria-pressed'), 'false');
      assert.ok(!button.getAttribute('aria-label').includes(code));
      assert.equal(button.querySelector('.discovery-spoiler-code').getAttribute('aria-hidden'), 'true');
      assert.equal(a.window.getComputedStyle(button.querySelector('.discovery-spoiler-code')).visibility, 'hidden');
      const before = a.saved(); let bubbled = 0;
      a.$(`#discovery-${id}`).addEventListener('click', () => bubbled++);
      button.focus(); button.click();
      assert.equal(a.document.activeElement, button);
      assert.equal(button.getAttribute('aria-pressed'), 'true');
      assert.equal(button.querySelector('.discovery-spoiler-code').textContent, code);
      assert.equal(button.querySelector('.discovery-spoiler-code').getAttribute('aria-hidden'), 'false');
      assert.equal(a.window.getComputedStyle(button.querySelector('.discovery-spoiler-code')).visibility, 'visible');
      assert.ok(button.getAttribute('aria-label').endsWith(code));
      assert.equal(bubbled, 0); assert.equal(a.saved(), before);
      // Native buttons provide Enter/Space activation. Synthetic keyboard events in
      // Happy DOM do not execute browser default actions; verify they are not cancelled,
      // then invoke the activation click. Real keyboard/touch defaults need browser QA.
      for (const key of ['Enter', ' ']) {
        const event = new a.window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
        assert.equal(button.dispatchEvent(event), true);
        const prior = button.getAttribute('aria-pressed'); button.click();
        assert.notEqual(button.getAttribute('aria-pressed'), prior);
        assert.equal(a.document.activeElement, button);
      }
      a.change(`#discovery-${id} > input`, true); a.expectCounts();
      button = a.$(selector);
      assert.equal(button.getAttribute('aria-pressed'), 'false');
      button.dispatchEvent(new a.window.Event('touchstart', { bubbles: true })); button.click();
      assert.equal(button.getAttribute('aria-pressed'), 'true'); assert.equal(a.checks()[id], true);
      a.change(`#discovery-${id} > input`, false); a.expectCounts();
      assert.equal(a.$(selector).getAttribute('aria-pressed'), 'false');
      // Both overlapping spans remain in the grid; disclosure changes no sizing rules.
      assert.equal(a.window.getComputedStyle(a.$(selector)).display, 'inline-grid');
      assert.equal(a.window.getComputedStyle(a.$(`${selector} > span`)).gridArea.replaceAll(' ', ''), '1/1');
      const transition = a.window.getComputedStyle(a.$(`${selector} > span`)).transition;
      if (a.window.matchMedia('(prefers-reduced-motion:reduce)').matches) assert.equal(transition, 'none');
      else assert.match(transition, /opacity.*\.18s/);
    }
  },
  async 'v113 saved emails, renamed entries, profiles and reload'(a, width, motion) {
    const saved = fixture({ 12: true, 6: true, 26: true, 38: true, 40: true, 68: true, 21: true,
      15: true, 16: true, 17: true, 30: true, 36: true, 37: true, 42: true, 59: true, 66: true });
    const b = app(width, motion, saved);
    try {
      b.expectCounts();
      assert.equal(b.$('#discovery-12 > input').checked, true);
      assert.equal(b.$('#discovery-13 > input').checked, false);
      assert.deepEqual(b.checks(), JSON.parse(saved).saves[0].discoveries);
      assert.equal(b.$('#achievementDetails').open, true);
      b.click('#discovery-21 .discovery-spoiler');
      b.click('#saveSelectButton'); b.click('#saveSelectOptions [data-id="second"]'); b.expectCounts();
      assert.equal(b.$('#discovery-12 > input').checked, false);
      assert.equal(b.$('#discovery-13 > input').checked, true);
      assert.equal(b.$('#discovery-21 .discovery-spoiler').getAttribute('aria-pressed'), 'false');
      b.click('#saveSelectButton'); b.click('#saveSelectOptions [data-id="existing"]'); b.expectCounts();
      assert.deepEqual(b.checks(), JSON.parse(saved).saves[0].discoveries);
      const reloaded = app(width, motion, b.saved());
      try { reloaded.expectCounts(); assert.deepEqual(reloaded.json('db'), b.json('db'));
        assert.equal(reloaded.$('#discovery-21 .discovery-spoiler').getAttribute('aria-pressed'), 'false');
        assert.equal(reloaded.window.localStorage.length, 1);
      } finally { await reloaded.close(); }
    } finally { await b.close(); }
  },
  'warning suffixes reuse unchanged inline treatment'(a) {
    const oldWarnings = Object.fromEntries([43, 67, 68, 85].map(id => [id, oldItems.find(x => x.id === id).where]));
    const warningMap = a.json('DISCOVERY_WARNING_SUFFIXES');
    assert.equal(a.document.querySelectorAll('#parts .discovery-warning').length, 5);
    for (const id of [43, 67, 68, 75, 85]) {
      const where = a.$(`#discovery-${id} .where`), warning = where.querySelector('.discovery-warning');
      assert.equal(warning.tagName, 'SPAN'); assert.equal(warning.parentElement, where);
      assert.equal(warning.textContent, warningMap[id]); assert.equal(where.querySelectorAll('.discovery-warning').length, 1);
      assert.equal(a.window.getComputedStyle(warning).color, '#cf737e');
      assert.equal(where.textContent.split(warning.textContent).length, 2);
      if (id !== 75) assert.equal(where.textContent, oldWarnings[id]);
    }
  },
  'individual, Part All, Mark All, Clear All and Undo counters'(a) {
    for (const id of [12, 13, 21, 59, 63, 75, 85]) { a.change(`#discovery-${id} > input`, true); a.expectCounts(); }
    a.change('#parts [data-part="4"] summary input', true); a.expectCounts();
    a.change('#parts [data-part="4"] summary input', false); a.expectCounts();
    const before = a.checks();
    a.change('#allDiscoveries', true); a.click('#appDialogConfirm'); a.expectCounts();
    assert.equal(Object.values(a.checks()).filter(Boolean).length, 85);
    a.click('#undoDiscoveries'); a.expectCounts(); assert.deepEqual(a.checks(), Object.fromEntries(Object.entries(before).filter(([, v]) => v)));
    const partial = a.checks();
    a.click('#clearDiscoveries'); a.click('#appDialogConfirm'); a.expectCounts(); assert.deepEqual(a.checks(), {});
    a.click('#undoDiscoveries'); a.expectCounts(); assert.deepEqual(a.checks(), partial);
  },
  'missing-only, section expansion and Next Missing numbering'(a) {
    a.click('#collapseParts'); assert.equal(a.json('active().openParts').length, 0);
    a.click('#expandParts'); assert.equal(a.json('active().openParts').length, 6);
    const button = a.$('#discovery-21 .discovery-spoiler'); button.click();
    const part = a.$('#parts [data-part="1"]'); part.open = false;
    part.dispatchEvent(new a.window.Event('toggle')); part.open = true;
    part.dispatchEvent(new a.window.Event('toggle'));
    assert.equal(a.$('#discovery-21 .discovery-spoiler'), button);
    assert.equal(button.getAttribute('aria-pressed'), 'true');
    a.change('#discovery-21 > input', true); a.expectCounts();
    a.click('#showMissingOnly'); a.tick(); a.expectCounts();
    assert.equal(a.document.querySelector('#discovery-21'), null);
    a.change('#discovery-59 > input', true); a.tick(); a.expectCounts();
    assert.equal(a.document.querySelector('#discovery-59'), null);
    a.click('#showMissingOnly'); a.tick(); a.expectCounts();
    assert.equal(a.$('#discovery-21 .discovery-spoiler').getAttribute('aria-pressed'), 'false');
    a.evaluate('COLLECTIBLES.slice(0,11).forEach(x=>active().discoveries[x.id]=true); saveDB(); renderAll();');
    a.click('#nextMissing'); a.tick();
    assert.ok(a.$('#discovery-13').classList.contains('next-missing-hit'));
  },
  'NG dependencies and special-ending branches'(a) {
    a.change('#ngPlus', true);
    for (const [dependent, required] of [['bronzeInserted', 'bronzeCoin'], ['silverInserted', 'silverCoin'], ['goldInserted', 'goldCoin'], ['accessCardUsed', 'accessCard']]) {
      a.change(`#ngList input[data-ng-id="${dependent}"]`, true);
      assert.equal(a.json('active().ng')[required], true);
      a.change(`#ngList input[data-ng-id="${required}"]`, false);
      assert.equal(a.json('active().ng')[dependent], false);
    }
    a.click('#markDogNG'); a.click('#appDialogConfirm');
    assert.equal(a.$('#ending').textContent, 'Dog');
    for (const id of ['book1', 'book2', 'book3', 'accessCard']) a.change(`#ngList input[data-ng-id="${id}"]`, true);
    assert.equal(a.$('#ending').textContent, 'Dog / Sci-Fi');
    a.change('#ngList input[data-ng-id="accessCardUsed"]', true);
    assert.equal(a.$('#ending').textContent, 'Sci-Fi');
    a.evaluate('chooseTargetEnding("Dog")'); assert.match(a.$('#notice').textContent, /no longer reachable/);
    a.click('#clearNG'); assert.deepEqual(a.json('active().ng'), {});
    a.click('#markSciFiNG'); a.click('#appDialogConfirm'); assert.equal(a.$('#ending').textContent, 'Sci-Fi');
  },
  async 'calculation parity with v113 at score boundaries and all special routes'(a, width, motion) {
    const b = app(width, motion, null, baseline);
    try {
      const routes = [{ ngPlus: false, ng: {} }, { ngPlus: true, ng: {} },
        { ngPlus: true, ng: { bronzeInserted: true, silverInserted: true, goldInserted: true } },
        { ngPlus: true, ng: { book1: true, book2: true, book3: true, accessCard: true } },
        { ngPlus: true, ng: { book1: true, book2: true, book3: true, accessCardUsed: true } },
        { ngPlus: true, ng: { book1: true, book2: true, book3: true, accessCard: true, bronzeInserted: true, silverInserted: true, goldInserted: true } },
        { ngPlus: true, ng: { book1: true, book2: true, book3: true, accessCardUsed: true, bronzeInserted: true, silverInserted: true, goldInserted: true } }];
      for (const [count, kills, refills, mistakes] of [[0, 0, 0, 0], [19, 0, 0, 0], [20, 0, 0, 0], [85, 32, 0, 0], [85, 33, 0, 0], [85, 43, 0, 0], [1, 0, 1, 0], [10, 40, 3, 2]]) {
        for (const route of routes) for (const targetEnding of ['Justice', 'Forever', 'Abandoned', 'Dog', 'Sci-Fi']) {
          const state = { discoveries: Object.fromEntries(oldItems.slice(0, count).map(x => [x.id, true])), kills, refills, mistakes, targetEnding, ...route };
          for (const instance of [a, b]) instance.evaluate(`Object.assign(active(),${JSON.stringify(state)}); compute();`);
          for (const id of ['ending', 'score', 'bDisc', 'bKills', 'bRefills', 'bMistakes', 'notice']) assert.equal(a.$(`#${id}`).innerHTML, b.$(`#${id}`).innerHTML, `${id}: ${JSON.stringify(state)}`);
        }
      }
    } finally { await b.close(); }
  },
  'unique DOM IDs and local resources'(a) {
    for (const ngPlus of [false, true]) {
      a.change('#ngPlus', ngPlus);
      const ids = [...a.document.querySelectorAll('[id]')].map(x => x.id);
      assert.equal(ids.length, new Set(ids).size);
    }
    for (const el of a.document.querySelectorAll('[src],link[href]')) {
      const ref = el.getAttribute('src') || el.getAttribute('href');
      if (/^(?:data:|https?:|#)/.test(ref)) continue;
      assert.ok(Deno.statSync(new URL(`../${ref}`, import.meta.url)).isFile, ref);
    }
    assert.equal(a.document.querySelectorAll('.achievement-icon').length, 7);
  }
};

for (const width of [1280, 390]) for (const motion of [false, true]) {
  for (const [name, run] of Object.entries(scenarios)) {
    const a = app(width, motion);
    try {
      assert.equal(a.window.matchMedia('(max-width:650px)').matches, width < 650);
      await run(a, width, motion); passed++;
      console.log(`PASS ${width}px reduced-motion=${motion}: ${name}`);
    } catch (error) { failed++; console.error(`FAIL ${width}px reduced-motion=${motion}: ${name}\n${error.stack}`); }
    finally { await a.close(); }
  }
}
console.log(`JavaScript syntax: PASS (${scripts.length} inline scripts). DOM scenarios: ${passed} passed, ${failed} failed.`);
if (failed) Deno.exit(1);
