// Run from repository root:
// DENO_DIR=/private/tmp/townfall-v41-deno deno run --cached-only --allow-read --allow-run=git --allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE collectibles/tests/accuracy-regression.mjs
// Isolated DOM/media-query tests. No real user storage, image decoding or browser painting.
import { Window } from 'npm:happy-dom@20.8.4';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { withApprovedSocialPreview } from '../../tests/social-preview-fixture.mjs';

const html = await Deno.readTextFile(Deno.args[0] || new URL('../index.html', import.meta.url));
const git = args => {
  const r = new Deno.Command('git', { args }).outputSync();
  assert.equal(r.code, 0, new TextDecoder().decode(r.stderr));
  return new TextDecoder().decode(r.stdout);
};
const baseline = git(['show', '7975cd1:collectibles/index.html']); // Clean v42 baseline.
const v43 = git(['show', 'b0d73c3:collectibles/index.html']); // Published v43.
const v44 = git(['show', 'fb3bf7d:collectibles/index.html']); // Published v44, with approved social metadata.
const v45 = git(['show', '72ef69b:collectibles/index.html']); // Published word-aware search baseline.
const headerBadges = ['15 STRANGE POSTCARDS','13 PHONE CALLS','19 CRTV SIGNALS','7 RESOURCE CONTAINERS','7 LOCK BOX KEYS'];
assert.equal(v44, withApprovedSocialPreview(v43
  .replace('<!-- Collectibles & Secrets Tracker v43: approved accuracy and presentation refinements. -->', '<!-- Collectibles & Secrets Tracker v44: complete header category badges. -->')
  .replace('<div class="headerline"><span class="tag">54 collectible objectives</span><span class="tag">7 Lock Box Keys</span><span class="tag">19 CRTV signals</span></div>', `<div class="headerline">${headerBadges.map(label=>`<span class="tag">${label}</span>`).join('')}</div>`), 'collectibles'),
  'Only the v44 version comment, header badges and exact social metadata may differ from v43');
// Keep the published v45 pin and all historical transitions; pin reviewed v46 separately.
assert.equal(createHash('sha256').update(v45).digest('hex'), '6c3707dabf7c32c40fc722800543f07ab3edeaf716eacff901fbd75caaa0df6f',
  'Published v45 search baseline must remain intact');
assert.equal(createHash('sha256').update(html).digest('hex'), 'aa075917ea0927e9fbeb0793f77abab34b799572f7ef753934ba96a408ccff51',
  'Only the reviewed v46 metadata helper, predicate and version comment may differ from v45');
for (const [name,digest] of [
  ['ending-progress-preview.png','5385ac02e1de9d3e98442af1bb34b419f39a48613929c88de2d52e5345aa8fc0'],
  ['collectibles-secrets-preview.png','398c088a39fff22040bf05d95c69801a0bacca66d31f449e22a3c3a546ac2849']
]) assert.equal(createHash('sha256').update(await Deno.readFile(new URL(`../../assets/social/${name}`,import.meta.url))).digest('hex'),digest,`Approved social image: ${name}`);
const scriptsFor = source => [...source.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const scripts = scriptsFor(html);
scripts.forEach(code => new vm.Script(code));
const dataset = source => JSON.parse(source.match(/const ITEMS = (\[.*?\]);/)[1]);
const items = dataset(html), oldItems = dataset(baseline);
assert.deepEqual(items,dataset(v44),'v45 preserves every v44 collectible field and its order');
assert.deepEqual(items,dataset(v45),'v46 preserves every v45 collectible field and its order');
// Execute the published matcher against its own data for exact compatibility sets.
const legacySearch = vm.createContext({});
vm.runInContext(['ITEMS','SOLVED','PARTS'].map(name=>v44.match(new RegExp(`const ${name} = ([^\\n]+);`))[0]).join('\n') +
  "\nlet query='';\n" + v44.slice(v44.indexOf('const SEARCH_CATEGORY_ALIASES='),v44.indexOf('const visible=item=>')), legacySearch);
const legacyMatches = value => {
  legacySearch.value=value;
  return JSON.parse(vm.runInContext('query=value; JSON.stringify(ITEMS.filter(inQuery).map(x=>x.id))',legacySearch));
};
const v45Search = vm.createContext({});
vm.runInContext(['ITEMS','SOLVED','PARTS'].map(name=>v45.match(new RegExp(`const ${name} = ([^\\n]+);`))[0]).join('\n') +
  "\nlet query='';\n" + v45.slice(v45.indexOf('const SEARCH_CATEGORY_ALIASES='),v45.indexOf('const visible=item=>')), v45Search);
const v45Matches = value => {
  v45Search.value=value;
  return JSON.parse(vm.runInContext('query=value; JSON.stringify(ITEMS.filter(inQuery).map(x=>x.id))',v45Search));
};
const storageKey = 'townfallCollectibles.v1';
const totals = { postcard: 15, phone: 13, signal: 19, container: 14 };
const spoilers = { 'phone-09': '3 → 2 → 2 → 1', 'postcard-07': '7103', 'signal-13': '575', 'signal-ceg-security': '4895' };
const warnings = {
  'key-02': 'Collect this key before dropping through the hole in the living-room floor of the second-floor flat. You cannot return to this area afterward.',
  'container-02': 'Open this container before dropping through the hole in the living-room floor of the second-floor flat. You cannot return to this area afterward.',
  'postcard-09': 'Collect this postcard before taking the Matthew Clark Blood Bag from Ward P Room 03. Collecting the blood bag triggers a lockdown that blocks access to Room 08.',
  'postcard-14': 'Collect this postcard before taking Barcode (Upper Brae) from the safe. Taking the barcode disables the tape player, preventing you from switching back to Tape: Tomorrow.'
};
// Final approved v43 wording, including the intentionally unchanged #7 and #23.
const finalDescriptions = {
  6: "In Haldane Hotel Room 204 (A Different Place), tune the CRTV to just under Channel 50. Store the signal when the tracking dot enters the target box.",
  7: "In Haldane Hotel Room 204 (A Different Place), tune the CRTV to just over Channel 60 and store the second transmission before leaving.",
  9: "Immediately after regaining control of Simon outside the Haldane Hotel, tune the CRTV to approximately Channel 45 and store the signal.",
  11: "As Simon approaches Town Square, tune the CRTV to approximately Channel 17 and store the signal.",
  16: "Obtain the 21 Farrow St. - Back Door Key from Apartment 1/2, use it to unlock the rear entrance to Jess’s house, then collect Lock Box Key #1 from the kitchen drawer.",
  21: "Immediately after exiting the Clinic as Simon, tune the CRTV to approximately Channel 63 and store the signal.",
  23: "In the apartment building south of the Medical Centre, go to the second floor and use the radio on the table. Complete the CRTV calibration and store the signal.",
  24: "In the same apartment building, cross the exterior scaffolding and re-enter through the window. In Apartment 1/1, collect Lock Box Key #2 from the bed in the bedroom containing an enemy.",
  25: "In the same apartment building, climb to the fourth-floor landing and open the Resource Container on the table using Lock Box Key #2.",
  26: "In the same apartment building, drop through the hole in the living-room floor of the second-floor flat to the ground floor. From the shared corridor between the flats, take the exit farther from the Medical Centre and collect the postcard from the last shed on the left.",
  31: "Enter Ward W Room 11 and open the key cabinet to collect Lock Box Key #3.",
  32: "Unlock Ward W Room 13 with the Ward W Master Key, climb the ladder to Ward S Room 13, and enter Ward S Room 12, where the Lesley Greer Blood Bag is found. Continue to Ward S Room 01 and open the Resource Container on the floor using Lock Box Key #3.",
  33: "In Ward P Room 08, open the wall-mounted medical cabinet to collect the postcard.",
  42: "At the Strange Gate at the end of Atlas Way, inspect the metal pipe structure. Once the transmission becomes available, adjust Simon’s position if necessary, tune the CRTV to approximately Channel 62, and store the signal.",
  43: "Enter the building immediately to the left of CEG Staff Parking on the map. Once inside, tune the CRTV to approximately Channel 67 and store the signal.",
  46: "After completing the South Brae computer puzzle, obtain Barcode (South Brae) and scan it at CEG Employee Lockers to reveal Locker 17’s PIN (code: 575). Open Locker 17 and collect its contents, then tune the CRTV to approximately Channel 59 and store the signal.",
  48: "At 5 Upper Brae, obtain the Back Door Key while using Tape: Do Not Play. Switch to Tape: Tomorrow, go downstairs and unlock the rear door. Follow the alley and crouch into the shed; the postcard is on the table.",
  49: "As you leave 5 Upper Brae after solving the tape puzzle, tune the CRTV to approximately Channel 29 and store the signal.",
  51: "Once all three Mechanical Parts have been acquired, tune the CRTV to approximately Channel 65 and store the signal.",
  54: "In the flare-stack control area, interact with the radio on the desk beside the Reference Sheet. Complete the CRTV calibration and store the signal.",
  55: "After completing the flare-stack puzzle and crawling through the first pipe labyrinth, enter the room on the left before descending the ladder. Interact with the radio, complete the CRTV calibration, and store the signal.",
  56: "In SWDP - Different, climb the short ladder and open the grated metal access hatch to enter the second pipe labyrinth. Turn right, then left at the four-way junction, and collect the postcard from the dead end.",
  58: "Obtain the JOE Key from the northeast office and unlock the southwest JOE room. Squeeze through the wall opening, interact with the radio beside the bed, complete the CRTV calibration, and store the signal.",
};
let passed = 0, failed = 0;

// Guard identity/order/relationships and every field unrelated to approved content edits.
assert.equal(items.length, 61);
assert.equal(new Set(items.map(x => x.id)).size, 61);
assert.deepEqual(items.map(x => x.id), oldItems.map(x => x.id));
for (const [kind, total] of Object.entries({ postcard: 15, phone: 13, signal: 19, key: 7, container: 7 })) {
  assert.equal(items.filter(x => x.kind === kind).length, total);
}
const changedWhere = new Set([3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,39,40,41,42,43,44,45,46,48,49,51,52,53,54,55,56,57,58,59,60,61]);
const changedTitles = new Set(['phone-06','phone-12','phone-04','phone-05','phone-09','signal-ceg-security','signal-16','signal-17','signal-18']);
for (const [i, item] of items.entries()) {
  const old = oldItems[i];
  for (const field of new Set([...Object.keys(old), ...Object.keys(item)])) {
    if (field === 'where' && changedWhere.has(i + 1) ||
        field === 'title' && (['postcard','key','container'].includes(item.kind) || changedTitles.has(item.id)) ||
        field === 'actor' && item.kind === 'postcard' || field === 'warning' && item.id in warnings ||
        field === 'note' && ['key-07','container-07'].includes(item.id)) continue;
    assert.deepEqual(item[field], old[field], `Unapproved data change: ${item.id}.${field}`);
  }
  if (item.kind === 'postcard') {
    assert.equal(item.title, `Strange Postcard - ${item.number}`); assert.equal(item.actor, 'Simon');
  }
  if (item.kind === 'key') assert.equal(item.title, `Lock Box Key (${item.number}/7)`);
  if (item.kind === 'container') {
    assert.equal(item.title, `Resource Container (${item.number}/7)`);
    assert.equal(item.requires, `key-${String(item.number).padStart(2,'0')}`);
  }
}
assert.deepEqual(items.filter(x => x.title === 'Unknown').map(x => [x.id,x.number,x.dial]),
  [['phone-06',1,'496 0842'],['phone-12',12,'496 0112']]);
assert.equal(items[0].ngplus, true); assert.equal(items[0].chapter, 1);
assert.deepEqual(items.filter(x => x.warning).map(x => x.id).sort(), Object.keys(warnings).sort());
for (const item of items.filter(x => x.warning)) assert.equal(item.warning, warnings[item.id]);
assert.equal(html.includes('[CONCEALED'), false);
for (const [routeNumber,text] of Object.entries(finalDescriptions)) {
  assert.equal(items[Number(routeNumber)-1].where,text,`Approved final wording #${routeNumber}`);
}
assert.deepEqual(items.flatMap((item,i)=>item.method==='Tuning'?[i+1]:[]),[6,7,9,11,21,42,43,46,49,51]);
assert.equal(items.filter(x=>x.method==='Radio calibration').length,9);

// Source-level guards cover the actual image/cache/navigation functions, not a reimplementation.
const slice = (source, from, to) => {
  const start=source.indexOf(from),end=source.indexOf(to,start);
  assert.ok(start>=0 && end>start, `Source boundaries: ${from} to ${to}`);
  return source.slice(start,end);
};
const gallery = source => slice(source, 'const originalImage=', 'function render()');
assert.equal(gallery(html), gallery(baseline)
  .replace('View Strange Postcard ${x.number} at full resolution','View ${escapeHTML(x.title)} at full resolution')
  .replace('Strange Postcard ${formatNo(x.number)} — original artwork','${escapeHTML(x.title)} — original artwork')
  .replace('<h3>Strange Postcard ${formatNo(x.number)}</h3>','<h3>${escapeHTML(x.title)}</h3>'));
const viewer = source => slice(source, 'function openPostcard(n)', "$('profileButton').addEventListener");
assert.equal(viewer(html), viewer(baseline).replace("$('viewerTitle').textContent=`Strange Postcard ${formatNo(n)}`;", "$('viewerTitle').textContent=store.get('postcard-'+formatNo(n)).title;"));
assert.equal(slice(html, 'function progressUpdate()', 'const formatNo='), slice(baseline, 'function progressUpdate()', 'const formatNo='));
assert.equal(slice(html, 'function captureParts()', 'function pairHTML('), slice(baseline, 'function captureParts()', 'function pairHTML(').replace('Resource Containers and Lockbox Keys','Resource Containers and Lock Box Keys'));
assert.equal(slice(html, 'function render()', 'function profileSelectRender()'), slice(baseline, 'function render()', 'function profileSelectRender()'));
assert.equal(git(['diff','7975cd1','--','collectibles/assets','collectibles/site.webmanifest','collectibles/apple-touch-icon.png','collectibles/icon-192.png','collectibles/icon-512.png']), '');
for (const item of items.filter(x => x.kind === 'postcard')) {
  const n=String(item.number).padStart(2,'0');
  for (const path of [`assets/postcards/postcard-${n}-original.webp`, `assets/thumbs/postcard-${n}.webp`,
    ...([1,2,4,5,6,7,10,11,12].includes(item.number) ? [`assets/postcards/postcard-${n}-solved.webp`] : [])]) {
    assert.ok((await Deno.stat(new URL(`../${path}`,import.meta.url))).size > 0, path);
  }
}
console.log('PASS syntax, 61 records, all stable data, 39 image assets, and unchanged Gallery/cache/progress logic');

function app(width, reducedMotion, saved = null, source = html) {
  const window = new Window({ width, height: width < 650 ? 844 : 900,
    url: 'https://tracker.test/collectibles/',
    settings: { disableJavaScriptFileLoading: true, disableCSSFileLoading: true,
      device: { prefersReducedMotion: reducedMotion ? 'reduce' : 'no-preference' } } });
  const document = window.document;
  // Happy DOM 20 lacks browser DOMString conversion for numeric textContent.
  const textContent = Object.getOwnPropertyDescriptor(window.Element.prototype, 'textContent');
  Object.defineProperty(window.Element.prototype, 'textContent', {
    configurable: true, get: textContent.get,
    set(value) { textContent.set.call(this, value == null ? '' : String(value)); }
  });
  document.write(source.replace(/<script[^>]*>[\s\S]*?<\/script>/g, ''));
  if (saved) window.localStorage.setItem(storageKey, saved);
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
  // Decoding is a stub: this tests viewer DOM/labels, not image loading or painting.
  window.Image = function () {
    const img = document.createElement('img');
    Object.defineProperties(img, { complete: { value: true }, naturalWidth: { value: 2048 } });
    img.decode = () => Promise.resolve();
    return img;
  };
  const context = vm.createContext(window);
  const evaluate = code => vm.runInContext(code, context);
  scriptsFor(source).forEach(code => evaluate(code));
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

const json = (a, expression) => JSON.parse(a.evaluate(`JSON.stringify(${expression})`));
const activeRoot = a => a.evaluate('view') === 'categories' ? '#categoryContent' : '#storyContent';
const row = (a, id) => a.$(`${activeRoot(a)} input[data-item="${id}"]`).closest('.entry,.pair-step');
const matches = a => [...a.document.querySelectorAll(`${activeRoot(a)} input[data-item]`)].map(x => x.dataset.item);
const settle = async () => { for (let i=0; i<20; i++) await Promise.resolve(); };
// Fixed stable identities, independent of the new parser and matching implementation.
const partIds = {
  1:['phone-06','phone-01','phone-02','phone-03','phone-04','signal-01','signal-02','phone-05','signal-03','postcard-01','signal-04','signal-05','postcard-02','postcard-03','postcard-04','key-01','container-01'],
  2:['phone-07','phone-08','phone-09','signal-06','postcard-05','signal-07','key-02','container-02','postcard-06'],
  3:['phone-10','postcard-07','signal-08','postcard-08','key-03','container-03','postcard-09'],
  4:['postcard-10','signal-09','phone-11','phone-12','key-04','container-04','postcard-11','postcard-12','signal-10','signal-11','phone-13','signal-12','signal-13','postcard-13','postcard-14','signal-14','key-05','signal-15','container-05','signal-ceg-security'],
  5:[],6:['signal-16','signal-17','postcard-15','key-06','signal-18','container-06','key-07','container-07']
};
const scenarios = {
  'v46 exact metadata, approved separators and mixed remainders in both views'(a) {
    const cases = [
      ...Object.entries(partIds).map(([part,ids])=>[`Part ${part}`,ids]),
      ['Part 7',[]],['Part 0',[]],['Chapter 1',partIds[1].slice(0,5)],
      ['Chapter 8',partIds[3].slice(1)],['Chapter 11',['signal-ceg-security']],
      ['Chapter 16',[]],['Chapter 18',[]],['Chapter 0',[]],['Part 999999999999999999999',[]],
      ['part 03',partIds[3]],['  PART   3  ',partIds[3]],['PART 6',partIds[6]],
      ['chapter 011',['signal-ceg-security']],['ＣＨＡＰＴＥＲ　０１１',['signal-ceg-security']],
      ['Ｐａｒｔ　０３',partIds[3]],['Part #03',partIds[3]],
      ['Part 3 Part 3',partIds[3]],['Part 3 Part 4',[]],['Chapter 8 Chapter 11',[]],
      ['Part 3 Chapter 11',[]],['Part 3 Chapter 8',partIds[3].slice(1)],
      ['Part 3 postcard',['postcard-07','postcard-08','postcard-09']],
      ['Part 3 ward',['postcard-08','key-03','container-03','postcard-09']],
      ['Chapter 10 tuning',['signal-10','signal-11','signal-13','signal-14','signal-15']],
      ['Chapter 11 CRTV',['signal-ceg-security']],['Chapter 11 postcard',[]],
      ['Part 4 CRTV',['signal-09','signal-10','signal-11','signal-12','signal-13','signal-14','signal-15','signal-ceg-security']],
      ['Part 2 phone',['phone-07','phone-08','phone-09','postcard-05']],
      ['Part 3 postcard #08',['postcard-08']],['postcard #08 Part 3',['postcard-08']],
      ['Part 4 postcard #08',[]],['Chapter 8 Lock Box Key (3/7)',['key-03']],
      ['Chapter 8 Resource Container 3',['container-03']],
      ['Part 3 afterward',[]],['Part 2 afterward',['key-02','container-02']],
      ['Part 4 4895',['signal-ceg-security']],['Part 1 0842',['phone-06']]
    ];
    for (const separator of [' ',' · ', ', ', '·',',']) {
      for (const fields of [`Part 4${separator}Chapter 11`,`Chapter 11${separator}Part 4`]) {
        for (const rest of ['',' CRTV',' phone']) cases.push([fields+rest,['signal-ceg-security']]);
        cases.push([`${fields} CRTV 16`,['signal-ceg-security']]);
      }
      cases.push([`Part 3${separator}Part 3`,partIds[3]],[`Part 3${separator}Part 4`,[]]);
    }
    for (const view of ['story','categories']) {
      a.click(`#tab-${view}`);
      for (const [query,expected] of cases) {
        a.search(query); assert.deepEqual(matches(a).sort(),[...expected].sort(),`${view}: ${query}`);
      }
      a.search('Part 4 · Chapter 11 4895');
      assert.equal(row(a,'signal-ceg-security').querySelector('.discovery-spoiler').getAttribute('aria-pressed'),'false');
    }
  },
  'v46 strict boundaries and local separators preserve literal v45 searches'(a) {
    const malformed = ['Part','Chapter','Part three','Part -3','Part 3a','Part 3.5','Part 3-4',
      'Part 3/4','Part 3\u0301','Part3','Part: 3','Chapter: 11','counterpart 3','apart 3','éPart 3',
      'Part 4;Chapter 11','Part 4,,Chapter 11','Part 3, ward','Part 3 · ward','ward, Part 3',
      'Part 3 ward,','Part 3 · Chapter 8 · ward','Part 3, Chapter 8, ward',
      'postcard,#01','496,0842','496·0842','St.·Amelia'];
    for (const query of malformed.slice(0,16)) {
      assert.deepEqual(json(a,`structuredSearchFor(normalizeSearchText(${JSON.stringify(query)})).restrictions`),[],query);
    }
    for (const view of ['story','categories']) {
      a.click(`#tab-${view}`);
      for (const query of malformed) {
        a.search(query); assert.deepEqual(matches(a).sort(),v45Matches(query).sort(),`${view}: ${query}`);
      }
      for (const query of ['P','Pa','Par','Part','Part ','Part 3','Part 3a','Part 3','Part','']) {
        a.search(query);
        const expected=query.trim()==='Part 3'?partIds[3]:v45Matches(query);
        assert.deepEqual(matches(a).sort(),[...expected].sort(),`typing: ${query}`);
      }
      a.search(''); assert.equal(matches(a).length,61);
    }
  },
  'v45 Unicode word starts preserve prefixes and reject incidental infixes'(a) {
    for (const [term,text,expected] of [
      ['ward','Ward',true],['war','Ward',true],['war','Warning',true],['war','Stewart’s',false],
      ...['afterward','toward','backward','forward'].flatMap(word=>[['ward',word,false],[word,word,true]]),
      ['ward','éward',false],['ward','x\u0301ward',false],['ward','𐐀ward',false],['ward','中ward',false],
      ['ward','—Ward',true],['é','Étage',true],['ward','afterward Ward',true],
      ['0842','4960842',true],['~61','Ch. ~61',true],['ng+','NG+ only',true],
      ['.*','Ward',false],['[','Ward',false]
    ]) assert.equal(a.evaluate(`searchTermMatches(normalizeSearchText(${JSON.stringify(text)}),normalizeSearchText(${JSON.stringify(term)}))`),expected,`${term} / ${text}`);
  },
  'v45 exact Ward results and audited semantic aliases in both checklist views'(a) {
    const routeIds = numbers => numbers.map(n=>items[n-1].id);
    const expected = {
      ward:routeIds([30,31,32,33]),war:routeIds([18,30,31,32,33]),
      'ward key':routeIds([30,31,32]),'ward barcode':[],
      card:[...items.filter(x=>x.kind==='postcard').map(x=>x.id),'container-06'],
      phone:routeIds([1,2,3,4,5,8,18,19,20,22,27,36,37,44,53]),
      room:routeIds([6,7,12,15,17,18,24,25,26,28,30,31,32,33,40,45,53,55,57,58,59,60,61]),
      stereo:routeIds([10,13,15,22,26,28,34,40,41]),
      stereogram:routeIds([10,13,15,22,26,28,34,40,41])
    };
    assert.deepEqual(legacyMatches('ward'),routeIds([24,25,30,31,32,33,34]));
    for (const query of ['card','phone','room','stereo','stereogram'])
      assert.deepEqual(legacyMatches(query).sort(),[...expected[query]].sort(),`v44 ${query}`);
    for (const view of ['story','categories']) {
      a.click(`#tab-${view}`);
      for (const [query,ids] of Object.entries(expected)) {
        a.search(query); assert.deepEqual(matches(a).sort(),[...ids].sort(),`${view}: ${query}`);
      }
      a.search('cards'); assert.deepEqual(matches(a).sort(),items.filter(x=>x.kind==='postcard').map(x=>x.id).sort());
    }
  },
  'v45 numeric suffixes, exact identifiers, warning searches and existing normalization'(a) {
    const exact = [
      ...['496 0842','496-0842','4960842','0842'].map(q=>[q,'phone-06']),
      ['7103','postcard-07'],['575','signal-13'],['4895','signal-ceg-security'],
      ['ch. 45','signal-03'],['channel 45','signal-03'],['CRTV 09','signal-09'],
      ['Lock Box Key (2/7)','key-02'],['Resource Container 2','container-02'],
      ['postcard #01','postcard-01'],['Phone Call 1','phone-06'],
      ['POSTCARD   #01','postcard-01'],['Ｐｏｓｔｃａｒｄ　＃０１','postcard-01']
    ];
    const unchanged = ['postcard','post','telephone','container','key','lockbox','medical','CRTV',
      'radio calibration','tuning','standard postcard','autostereogram','Simon','Zoe','NG+','new-game-plus',
      'St. Amelia','st amelia','before','hole','lockdown','barcode','afterward','toward','61','~61',
      'card 1','phone 1','signal 9','postcard arrival','Saturn',
      '496.0842','60–62','60-62','Jess’s',"Jess's",'new game+','postcard#1','CRTV9'];
    for (const view of ['story','categories']) {
      a.click(`#tab-${view}`);
      for (const [query,id] of exact) {
        a.search(query); assert.deepEqual(matches(a),[id],`${view}: ${query}`);
      }
      for (const query of unchanged) {
        a.search(query); assert.deepEqual(matches(a).sort(),legacyMatches(query).sort(),`${view}: ${query}`);
        assert.deepEqual(matches(a).sort(),v45Matches(query).sort(),`v45 ${view}: ${query}`);
      }
      for (const [query,expected] of [['Part 2',partIds[2]],['Part 5',[]],['chapter 6',partIds[2].slice(3)]]) {
        a.search(query); assert.deepEqual(matches(a).sort(),[...expected].sort(),`${view}: ${query}`);
      }
      a.search('afterward'); assert.deepEqual(matches(a).sort(),['container-02','key-02']);
      a.search('4895'); assert.equal(row(a,'signal-ceg-security').querySelector('.discovery-spoiler').getAttribute('aria-pressed'),'false');
      for (const query of ['','   ']) { a.search(query); assert.equal(matches(a).length,61); }
    }
  },
  'v44 five fixed header badges retain exact labels, order and styling across progress and profiles'(a) {
    const header=a.$('header .headerline');
    const labels=()=>[...header.children].map(x=>x.textContent);
    assert.deepEqual(labels(),headerBadges);
    assert.equal(header.children.length,5);
    assert.ok([...header.children].every(x=>x.matches('span.tag')));
    assert.equal(headerBadges.reduce((sum,label)=>sum+parseInt(label,10),0),61);
    for (const [i,kind] of ['postcard','phone','signal','container','key'].entries()) {
      assert.equal(parseInt(headerBadges[i],10),items.filter(x=>x.kind===kind).length);
    }
    assert.equal(a.window.getComputedStyle(header).display,'flex');
    assert.equal(a.window.getComputedStyle(header).flexWrap,'wrap');
    a.change('#storyContent input[data-item="postcard-01"]',true); a.expectCounts();
    assert.deepEqual(labels(),headerBadges);
    a.change('#markAll',true); a.confirm(); a.expectCounts();
    assert.equal(a.$('#doneMain').textContent,'61'); assert.deepEqual(labels(),headerBadges);
    a.click('#undoButton'); a.expectCounts(); assert.deepEqual(labels(),headerBadges);
    a.click('#addProfile'); a.$('#appDialogInput').value='Header badge check'; a.confirm(); a.expectCounts();
    assert.equal(a.$('#doneMain').textContent,'0'); assert.deepEqual(labels(),headerBadges);
    a.click('#profileButton'); a.click('#profileOptions [data-profile="default"]'); a.expectCounts();
    assert.equal(a.$('#doneMain').textContent,'1'); assert.deepEqual(labels(),headerBadges);
  },
  'final approved wording in both views; tuning and calibration retain their identities'(a) {
    for (const view of ['story','categories']) {
      a.click(`#tab-${view}`);
      for (const [routeNumber,text] of Object.entries(finalDescriptions)) {
        const item=items[Number(routeNumber)-1],el=row(a,item.id);
        const description=el.querySelector('.entry-where').cloneNode(true);
        description.querySelectorAll('.discovery-warning').forEach(x=>x.remove());
        // Reconstruct text only for comparison; independently test concealed markup below.
        description.querySelectorAll('.discovery-spoiler').forEach(button=>
          button.replaceWith(a.document.createTextNode(button.querySelector('.discovery-spoiler-code').textContent)));
        assert.equal(description.textContent.trim(),text,`${view} #${routeNumber}`);
        if(item.method) assert.ok([...el.querySelectorAll('.entry-meta .chip')].some(x=>x.textContent===item.method));
      }
      a.expectCounts();
    }
    // Prefix removals are limited to the specifically approved records.
    for (const n of [57,59,60,61]) assert.ok(items[n-1].where.startsWith('SWDP - Different:'));
    for (const n of [28,29,30]) assert.ok(items[n-1].where.startsWith('Medical Centre - Different:'));
  },
  'all 61 titles, fixed ordinals, view-specific metadata and 15 Simon badges'(a) {
    const parts = json(a, 'PARTS');
    for (const view of ['story','categories']) {
      a.click(`#tab-${view}`);
      assert.equal(matches(a).length,61);
      for (const item of items) {
        const el=row(a,item.id);
        if (el.classList.contains('entry')) {
          assert.equal(el.querySelector('.entry-title').firstChild.textContent,item.title);
          assert.equal(el.querySelector('.entry-kind').textContent, item.kind==='phone' ? `Phone call #${item.number}` :
            `${{postcard:'Postcard',signal:'CRTV',key:'Key',container:'Container'}[item.kind]} ${String(item.number).padStart(2,'0')}`);
          assert.equal(el.querySelector('.entry-meta .chip').textContent,view==='story' ?
            `Chapter ${item.chapter} · ${parts[item.part][0]}` : `Part ${item.part} · Chapter ${item.chapter}`);
          assert.ok([...el.querySelectorAll('.entry-meta .chip')].some(x=>x.textContent===item.actor));
        } else {
          assert.equal(el.querySelector('.entry-meta .chip').textContent,item.title);
          assert.equal(el.closest('.pair-card').querySelector('.pair-head small').textContent,`Part ${item.part} · Chapter ${item.chapter}`);
        }
      }
      const before=a.items.map(x=>x.title);
      a.change(`${activeRoot(a)} input[data-item="key-01"]`,true);
      a.change(`${activeRoot(a)} input[data-item="container-01"]`,true);
      assert.deepEqual(json(a,'ITEMS.map(x=>x.title)'),before,'Ordinal titles are not completion counters');
      a.expectCounts();
    }
    assert.equal(a.$('#categoryContent [data-entry-id="postcard-05"] .entry-meta .chip').textContent,'Part 2 · Chapter 6');
    const chip=a.$('#categoryContent [data-entry-id="postcard-05"] .part-location');
    assert.equal(a.window.getComputedStyle(chip).whiteSpace,'normal');
    assert.equal(a.window.getComputedStyle(chip).maxWidth,'100%');
    assert.ok([...row(a,'postcard-05').querySelectorAll('.chip')].some(x=>x.textContent==='Simon'));
  },
  'four native reveal controls: checked/unchecked, both views, focus, labels, CSS and independent checkboxes'(a,width,motion) {
    for (const view of ['story','categories']) {
      a.click(`#tab-${view}`);
      assert.equal(a.document.querySelectorAll(`${activeRoot(a)} .discovery-spoiler`).length,4);
      for (const [id,code] of Object.entries(spoilers)) {
        for (const checked of [false,true]) {
          a.change(`${activeRoot(a)} input[data-item="${id}"]`,checked);
          const el=row(a,id), button=el.querySelector('button.discovery-spoiler');
          const codeEl=button.querySelector('.discovery-spoiler-code'), prompt=button.querySelector('.discovery-spoiler-prompt');
          assert.equal(button.type,'button'); assert.equal(button.tabIndex,0);
          assert.equal(button.closest('label'),null); assert.equal(button.getAttribute('aria-pressed'),'false');
          assert.equal(codeEl.textContent,code); assert.equal(codeEl.getAttribute('aria-hidden'),'true');
          const outside=el.cloneNode(true);
          outside.querySelectorAll('.discovery-spoiler').forEach(x=>x.remove());
          assert.equal(outside.textContent.includes(code),false,'No duplicate solution outside the spoiler control');
          assert.match(button.getAttribute('aria-label'),/^Reveal /); assert.equal(button.getAttribute('aria-label').includes(code),false);
          const style = x=>a.window.getComputedStyle(x);
          assert.equal(style(codeEl).visibility,'hidden'); assert.equal(style(codeEl).opacity,'0');
          assert.equal(style(button).display,'inline-grid'); assert.equal(style(button).minWidth,'7ch');
          assert.equal(style(button).touchAction,'manipulation');
          assert.equal(style(codeEl).gridArea,'1/1'); assert.equal(style(prompt).gridArea,'1/1');
          assert.equal(style(codeEl).transition,motion?'none':'opacity .18s ease');
          const before=a.checks(), saved=a.saved(), viewBefore=a.evaluate('view');
          let bubbled=0; const spy=()=>bubbled++;
          a.document.addEventListener('click',spy);
          button.focus(); assert.equal(a.document.activeElement,button);
          // Happy DOM does not synthesize native button activation; ensure key defaults are not intercepted.
          for (const key of ['Enter',' ']) {
            const event=new a.window.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});
            button.dispatchEvent(event); assert.equal(event.defaultPrevented,false);
          }
          button.click();
          assert.equal(button.getAttribute('aria-pressed'),'true'); assert.equal(codeEl.getAttribute('aria-hidden'),'false');
          assert.equal(style(codeEl).visibility,'visible'); assert.equal(style(codeEl).opacity,'1');
          assert.equal(style(prompt).visibility,'hidden'); assert.match(button.getAttribute('aria-label'),/^Hide /);
          assert.ok(button.getAttribute('aria-label').endsWith(code));
          assert.equal(a.document.activeElement,button); assert.equal(a.evaluate('view'),viewBefore);
          button.click();
          a.document.removeEventListener('click',spy);
          assert.equal(bubbled,0); assert.equal(button.getAttribute('aria-pressed'),'false');
          assert.equal(codeEl.getAttribute('aria-hidden'),'true'); assert.equal(style(codeEl).visibility,'hidden');
          assert.deepEqual(a.checks(),before); assert.equal(a.saved(),saved); a.expectCounts();
          if(id==='phone-09') {
            assert.match(el.querySelector('.entry-note').textContent,/Note · Menu selections:/);
            assert.ok([...el.querySelectorAll('.chip')].some(x=>x.textContent==='496 0556'));
          }
        }
      }
      assert.equal(a.document.querySelectorAll(`${activeRoot(a)} .discovery-spoiler`).length,4);
    }
  },
  'spoiler search, category filters, missing-only removal, and rerender defaults'(a) {
    for (const view of ['story','categories']) {
      a.click(`#tab-${view}`);
      for (const [id,code] of Object.entries(spoilers)) {
        const item=items.find(x=>x.id===id);
        a.categoryFilter(item.kind); a.search(code); a.tick();
        assert.deepEqual(matches(a),[id]);
        assert.equal(row(a,id).querySelector('.discovery-spoiler').getAttribute('aria-pressed'),'false');
        row(a,id).querySelector('.discovery-spoiler').click();
        a.change(`${activeRoot(a)} input[data-item="${id}"]`,true); a.expectCounts();
        a.click('#missingOnly'); a.tick();
        assert.deepEqual(matches(a),[]); assert.equal(a.checks()[id],true);
        a.click('#missingOnly'); a.tick();
        assert.deepEqual(matches(a),[id]);
        assert.equal(row(a,id).querySelector('.discovery-spoiler').getAttribute('aria-pressed'),'false');
        a.change(`${activeRoot(a)} input[data-item="${id}"]`,false);
        a.search(''); a.categoryFilter('all');
      }
    }
  },
  'four exact inline warnings in ordinary and paired cards; console Notes remain ordinary'(a) {
    for (const view of ['story','categories']) {
      a.click(`#tab-${view}`);
      assert.equal(a.document.querySelectorAll(`${activeRoot(a)} .discovery-warning`).length,4);
      assert.equal(a.document.querySelectorAll(`${activeRoot(a)} .entry-note.caution`).length,0);
      for (const [id,text] of Object.entries(warnings)) {
        const el=row(a,id), warning=el.querySelector('.entry-where > span.discovery-warning');
        assert.ok(warning); assert.equal(warning.textContent,text);
        assert.equal(a.window.getComputedStyle(warning).color,'#cf737e');
        assert.equal(el.querySelector('.entry-note'),null);
      }
      assert.equal(row(a,'postcard-04').querySelector('.discovery-warning'),null);
      for (const [id,roomNo] of [['key-07','047'],['container-07','621']]) {
        const el=row(a,id), note=el.querySelector('.entry-note');
        assert.ok(note); assert.equal(note.querySelector('.discovery-warning,.discovery-spoiler'),null);
        assert.ok(note.textContent.endsWith(`Control Room console: UNLOCK (open padlock) + DOOR (door symbol) + ${roomNo} → ENTER`));
        assert.ok(el.querySelector('.entry-where').textContent.includes(`Door ${roomNo}`));
      }
    }
    a.search('Matthew Clark'); assert.deepEqual(matches(a),['postcard-09']);
    a.search('hole living-room floor');
    assert.deepEqual(matches(a).sort(),['key-02','container-02','postcard-06'].sort());
  },
  async 'v42 fixture: all 61 stored identities, two Unknown states, profiles, reload, transient disclosure'(a,width,motion) {
    const checks=Object.fromEntries(oldItems.map((x,i)=>[x.id,i%3===0]));
    checks['phone-06']=true; checks['phone-12']=false; checks['key-02']=true; checks['container-02']=false;
    const other=Object.fromEntries(oldItems.map(x=>[x.id,!checks[x.id]]));
    const ui={checklistView:'story',filter:'all',onlyMissing:false,openedParts:['1','2','3','4','5','6'],openedCategories:Object.keys(totals),achievementExpanded:false};
    const fixture=JSON.stringify({active:'legacy',profiles:[{id:'legacy',name:'v42 profile',checks,ui}, {id:'other',name:'Other route',checks:other,ui}]});
    const old=app(width,motion,fixture,baseline);
    let saved;
    try { old.expectCounts(); saved=old.saved(); } finally { await old.close(); }
    const restored=app(width,motion,saved);
    let reloadData;
    try {
      assert.deepEqual(restored.checks(),checks); restored.expectCounts();
      assert.equal(restored.$('#storyContent input[data-item="phone-06"]').checked,true);
      assert.equal(restored.$('#storyContent input[data-item="phone-12"]').checked,false);
      assert.equal(restored.saved(),saved,'No schema migration on v43 load');
      restored.click('#tab-categories'); restored.search('Unknown');
      assert.deepEqual(matches(restored),['phone-06','phone-12']);
      restored.change('#categoryContent input[data-item="phone-12"]',true);
      assert.equal(restored.checks()['phone-06'],true);
      restored.search('');
      row(restored,'signal-13').querySelector('.discovery-spoiler').click();
      restored.click('#profileButton'); restored.click('#profileOptions [data-profile="other"]');
      assert.deepEqual(restored.checks(),other); restored.expectCounts();
      assert.equal(row(restored,'signal-13').querySelector('.discovery-spoiler').getAttribute('aria-pressed'),'false');
      restored.click('#profileButton'); restored.click('#profileOptions [data-profile="legacy"]');
      assert.deepEqual(restored.checks(),{...checks,'phone-12':true}); restored.expectCounts();
      assert.equal(row(restored,'signal-13').querySelector('.discovery-spoiler').getAttribute('aria-pressed'),'false');
      assert.equal(restored.window.localStorage.length,1); assert.equal(restored.window.localStorage.key(0),storageKey);
      const current=JSON.parse(restored.saved()),previous=JSON.parse(saved);
      assert.deepEqual(Object.keys(current),Object.keys(previous));
      for (const profile of current.profiles) {
        assert.deepEqual(Object.keys(profile),Object.keys(previous.profiles[0]));
        assert.deepEqual(Object.keys(profile.ui),Object.keys(previous.profiles[0].ui));
      }
      reloadData=restored.saved();
    } finally { await restored.close(); }
    const reload=app(width,motion,reloadData);
    try {
      assert.deepEqual(reload.checks(),{...checks,'phone-12':true}); reload.expectCounts();
      assert.equal(reload.evaluate('db.profiles.length'),2);
    } finally { await reload.close(); }
  },
  'new and legacy numbered search aliases, phone normalization, and postcard actor search'(a) {
    for (const view of ['story','categories']) {
      a.click(`#tab-${view}`);
      for (const item of items.filter(x=>['key','container','postcard'].includes(x.kind))) {
        for (const query of [item.title,...(item.kind==='key' ? [`Lockbox Key #${item.number}`,`Lock Box Key #${item.number}`] : [])]) {
          a.search(query); assert.deepEqual(matches(a),[item.id],query);
        }
      }
      for (const [query,id] of [['4960842','phone-06'],['496-0112','phone-12'],['0163  296  0595','phone-07'],['496 0496','phone-04']]) {
        a.search(query); assert.deepEqual(matches(a),[id],query);
      }
      a.categoryFilter('postcard'); a.search('Simon'); assert.equal(matches(a).length,15);
      a.search('Simon Wynds'); assert.deepEqual(matches(a),['postcard-05']);
      a.search('Zoe'); assert.deepEqual(matches(a),['postcard-05','postcard-06'],'Part name is still searchable separately from actor');
      a.search(''); a.categoryFilter('all');
    }
  },
  'paired cards retain independent states, missing-only paired display and category-wide bulk semantics'(a) {
    a.categories(); a.categoryFilter('container');
    a.change('#categoryContent input[data-item="key-02"]',true);
    a.click('#missingOnly'); a.tick();
    assert.ok(a.$('#categoryContent input[data-item="key-02"]').checked);
    assert.equal(a.$('#categoryContent input[data-item="container-02"]').checked,false);
    a.search('Lock Box Key 2'); a.tick(); assert.deepEqual(matches(a),[]);
    a.click('#missingOnly'); a.tick(); assert.deepEqual(matches(a),['key-02']);
    a.change('#categoryContent [data-select-category="container"]',true); a.expectCounts();
    assert.equal(items.filter(x=>['key','container'].includes(x.kind)&&a.checks()[x.id]).length,14);
    a.click('#undoButton'); a.expectCounts();
    assert.equal(a.checks()['key-02'],true); assert.equal(!!a.checks()['container-02'],false);
    a.search(''); a.click('#tab-story'); a.search('Lock Box Key 2');
    a.change('[data-select-part="2"]',false); a.expectCounts();
    assert.equal(!!a.checks()['key-02'],false); assert.equal(!!a.checks()['container-02'],false);
    a.click('#undoButton'); assert.equal(a.checks()['key-02'],true); a.expectCounts();
  },
  async 'Gallery 15 full titles, padded mappings, bounded cache, viewer navigation and stable thumbnails'(a) {
    a.click('#tab-gallery');
    const cards=[...a.document.querySelectorAll('#galleryContent .postcard-card')];
    assert.equal(cards.length,15); const images=cards.map(x=>x.querySelector('img'));
    for (const item of items.filter(x=>x.kind==='postcard')) {
      const card=a.$(`#galleryContent [data-entry-id="${item.id}"]`), n=String(item.number).padStart(2,'0');
      assert.equal(card.querySelector('h3').textContent,item.title);
      assert.equal(card.querySelector('img').getAttribute('src'),`assets/thumbs/postcard-${n}.webp`);
      assert.ok(card.querySelector('.postcard-art').getAttribute('aria-label').includes(item.title));
      assert.equal(card.querySelector('[data-to-route]').dataset.toRoute,item.id);
      a.click(`#galleryContent [data-entry-id="${item.id}"] .postcard-art`); await settle();
      assert.equal(a.$('#viewerTitle').textContent,item.title);
      assert.equal(a.evaluate('viewerDisplayedPostcard'),item.number);
      assert.equal(a.$('#viewerImages img').getAttribute('src'),`assets/postcards/postcard-${n}-original.webp`);
      a.tick(40); await settle(); assert.ok(a.evaluate('viewerImageCache.size')<=12);
      a.click('#closeViewer');
    }
    a.click('#galleryContent [data-entry-id="postcard-15"] .postcard-art'); await settle();
    a.click('#nextCard'); await settle(); assert.equal(a.$('#viewerTitle').textContent,'Strange Postcard - 1');
    a.click('#prevCard'); await settle(); assert.equal(a.$('#viewerTitle').textContent,'Strange Postcard - 15');
    a.click('#closeViewer');
    a.change('#galleryContent input[data-item="postcard-01"]',true); a.expectCounts();
    a.change('#gallerySelectAll',true); a.click('#undoButton');
    assert.deepEqual([...a.document.querySelectorAll('#galleryContent img')],images,'Retain actual thumbnail nodes');
    assert.equal(json(a,'Object.keys(SOLVED)').length,9);
  },
  async 'all 15 postcard checklist-to-viewer links and contextual category Return'(a) {
    for (const view of ['story','categories']) {
      a.click(`#tab-${view}`);
      for (const item of items.filter(x=>x.kind==='postcard')) {
        a.click(`${activeRoot(a)} [data-open-postcard="${item.number}"]`); await settle();
        assert.equal(a.evaluate('viewerPostcard'),item.number);
        assert.equal(a.$('#viewerTitle').textContent,item.title); a.click('#closeViewer');
      }
    }
    a.search('Strange Postcard - 7'); a.click('#categoryContent [data-to-route="postcard-07"]');
    assert.equal(a.evaluate('view'),'story'); assert.ok(a.$('[data-return-category="postcard-07"]'));
    row(a,'postcard-07').querySelector('.discovery-spoiler').click();
    a.click('[data-return-category="postcard-07"]'); a.tick();
    assert.equal(a.evaluate('view'),'categories'); assert.equal(a.$('#searchInput').value,'Strange Postcard - 7');
    assert.deepEqual(matches(a),['postcard-07']);
    assert.ok(row(a,'postcard-07').classList.contains('next-missing-hit'));
    a.expectCounts();
  }
};

for (const width of [1280,390]) {
  for (const motion of [false,true]) {
    for (const [name,run] of Object.entries(scenarios)) {
      const a=app(width,motion);
      try {
        assert.equal(a.window.matchMedia('(max-width:650px)').matches,width<650);
        assert.equal(a.window.matchMedia('(prefers-reduced-motion:reduce)').matches,motion);
        await run(a,width,motion); passed++;
        console.log(`PASS ${width}px reduced-motion=${motion}: ${name}`);
      } catch (error) {
        failed++; console.error(`FAIL ${width}px reduced-motion=${motion}: ${name}\n${error.stack}`);
      } finally { await a.close(); }
    }
  }
}
console.log(`JavaScript syntax: PASS (${scripts.length} inline scripts). Collectibles DOM scenarios: ${passed} passed, ${failed} failed.`);
if (failed) Deno.exit(1);
