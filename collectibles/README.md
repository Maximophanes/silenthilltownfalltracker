# Silent Hill: Townfall — Collectibles & Secrets Tracker v43 (proposed release)

## v43: Approved accuracy, wording and presentation refinements

Starting point: clean Collectibles v42 at `7975cd1`. Ending & Progress Tracker remains v114; none of its files are modified. No commit, push or deployment is included.

- Reviewed all 61 descriptions. Applied the supplied gameplay-review decisions for map buildings, flats, document names, access routes, blood-bag navigation, Upper Brae, and SWDP - Different. These are user-verified corrections; no independent gameplay verification is claimed.
- All 15 full postcard titles are `Strange Postcard - n`, without leading zeros, and all 15 records carry the separate `Simon` badge. Gallery headings use the same full titles. Category/index labels, IDs and image paths retain their padded numbers.
- All seven key titles use `Lock Box Key (n/7)` and all seven container titles use `Resource Container (n/7)`. Fractions are fixed ordinals. Both callbacks are titled `Unknown`; their different IDs, numbers, dial strings and completion states remain separate. Corrected Tourist Centre, The Haldane Hotel and Dr. Glenn.
- Ordinary By Category cards show `Part N · Chapter N`, without the Part name or colon; Story Route retains `Chapter N · Name`. Existing chip styling and wrapping are preserved. Paired key/container cards retain their combined layout and matching Part/chapter header.
- Added four temporary reveal buttons matching Ending v114: Dr. Glenn’s entire `3 → 2 → 2 → 1` menu sequence, X-Ray code `7103`, Locker 17 PIN `575`, and Security room code `4895`. Native buttons provide focus and activation semantics, reveal/hide labels and `aria-pressed`; concealed code is hidden from assistive technology. Overlaid grid spans reserve the solution’s space, with the existing subtle opacity transition and reduced-motion override. Revealing stops click propagation and does not save or change checkmarks. Rerendering, profile changes and reload conceal solutions again.
- The four approved warnings (#24, #25, #33, #48) are coloured inline within descriptions in both views, including the paired card. Upper Brae’s separate CAUTION block is removed. No warning was added to postcard 4. Console Notes for #60/#61 remain ordinary Notes, using `UNLOCK (open padlock) + DOOR (door symbol) + room → ENTER`.
- Search recognises new postcard titles with the spaced hyphen, the fixed `(n/7)` key/container titles, and both `Lock Box Key` and legacy `Lockbox Key` numbered queries. Existing full-text AND matching and telephone normalisation are retained.
- Exactly 61 stable IDs remain in their original order: 15 postcards, 13 calls, 19 signals, seven keys and seven containers. All seven `requires` relationships, Parts, chapters, phone numbers, frequencies, methods and existing non-postcard actors are unchanged. `townfallCollectibles.v1` and its saved schema are unchanged.
- The v41/v42 counters, category/search-scoped Part All, category-wide All semantics, missing-only paired display, Undo, contextual Return and profile preferences are preserved. Gallery/cache/navigation source is unchanged except its full-title/accessible-name substitutions; all 39 image assets and their mappings are unchanged.

### Final approved editorial corrections (still v43)

Built upon the intentional uncommitted v43 implementation. This focused pass changes 21 main descriptions: #6, #9, #11, #16, #21, #24, #25, #26, #31, #32, #33, #42, #43, #46, #48, #49, #51, #54, #55, #56 and #58. It also updates warning text at #24, #25 and #48 and shortens the By Category metadata expression. No other application code or styling changes in this pass.

- The By Category location chip is now `Part N · Chapter N`. Story Route remains `Chapter N · Part name`, and Simon/Zoe badges and section headings are preserved. Paired cards already use the shortened format; no duplicate labels were added.
- #23 still establishes the full apartment location. #24–#26 intentionally use “In the same apartment building”. The key/container warnings identify the hole in the living-room floor of the second-floor flat. #26 now states that the drop lands on the ground floor and directs players to the shared corridor exit farther from the Medical Centre.
- Removed inventory-name quotation marks only at #16 and #48, including the Upper Brae warning. Removed the repeated Medical Centre prefix only at #31–#33; the Matthew Clark Blood Bag lockout warning is unchanged.
- Removed the repeated SWDP description prefix at #54, #55 and #58 because their titles identify the area. Added `In SWDP - Different` to postcard #56. Prefixes at #57/#59/#60/#61 and both console Notes are unchanged.
- Checked all ten Tuning descriptions (#6, #7, #9, #11, #21, #42, #43, #46, #49, #51) against the final approved wording. #7 is intentionally unchanged, including “just over Channel 60” and its `~60–62` frequency field. #6 keeps “just under Channel 50”. #42 places positioning advice before tuning/storage. #46 changes only “near” to “to approximately”, retaining the working PIN 575 spoiler control and every prerequisite.
- #23 is unchanged. All nine Radio calibration records retain their methods; only the three explicitly approved SWDP prefix removals affect their descriptions in this pass. No new general editorial sweep was performed.
- All titles, Parts, chapters, actors, frequencies, stable IDs, key/container pairings, storage code, Gallery, spoiler logic, colours and animations are unchanged from the preceding uncommitted v43 implementation.

### All CRTV wording changes

Reviewed all 19 signals across the two approved v43 passes. All 19 final descriptions differ from v42, as listed below by Story Route position; frequency, method, chapter and character fields are unchanged for every signal. The ten Tuning descriptions now use the final approved wording, with #7 unchanged during the final pass. The nine Radio calibration descriptions retain their approved interactions, including the Pharmacy’s detailed alignment explanation.

The four approved CRTV title corrections are:

- #53: `CEG HQ — Security Room radio` → `CEG HQ — Security room radio`.
- #54: `Altered CEG HQ — main-room radio` → `SWDP (Different) — flare-stack control area radio`.
- #55: `Altered CEG HQ — side pipe room` → `SWDP (Different) — pipe-labyrinth side room`.
- #58: `SWDP — JOE-room radio` → `SWDP (Different) — JOE room radio`.

The numerical solutions shown in this review table are concealed by the application’s interactive buttons.

| Route item | v42 description | v43 description | Basis |
| --- | --- | --- | --- |
| #6 | In Haldane Hotel Room 204 (A Different Place), sweep to just under Channel 50. Store the transmission when the tracking dot enters the target box. | In Haldane Hotel Room 204 (A Different Place), tune the CRTV to just under Channel 50. Store the signal when the tracking dot enters the target box. | Final approved Tuning wording. |
| #7 | Still in the altered hotel room, tune to just over Channel 60 and store the second transmission before leaving. | In Haldane Hotel Room 204 (A Different Place), tune the CRTV to just over Channel 60 and store the second transmission before leaving. | Initial editorial clarification; intentionally unchanged in the final pass. |
| #9 | Immediately after regaining control of Simon outside the hotel, tune the CRTV to approximately Channel 45. | Immediately after regaining control of Simon outside the Haldane Hotel, tune the CRTV to approximately Channel 45 and store the signal. | Final approved Tuning wording. |
| #11 | As Simon approaches Town Square, sweep the CRTV around Channel 17 and store the transmission. | As Simon approaches Town Square, tune the CRTV to approximately Channel 17 and store the signal. | Final approved Tuning wording. |
| #12 | Enter the Pharmacy back room and interact with the radio on the table. Steady the CRTV picture and align the colored shapes to complete calibration. | Use the Scalpel to enter the Pharmacy, then interact with the radio on the back-room table. Steady the CRTV picture and align the coloured shapes to complete calibration. | Verified Scalpel prerequisite and British “coloured”; unchanged in the final pass. |
| #21 | Immediately after exiting the Clinic as Simon, tune to approximately Channel 63. | Immediately after exiting the Clinic as Simon, tune the CRTV to approximately Channel 63 and store the signal. | Final approved Tuning wording. |
| #23 | In the apartment building south of the Medical Centre, go upstairs to the radio on the table and complete its picture-alignment calibration. | In the apartment building south of the Medical Centre, go to the second floor and use the radio on the table. Complete the CRTV calibration and store the signal. | Explicitly approved radio replacement; unchanged in the final pass. |
| #29 | After squeezing through the wall opening, interact with the radio on the table and complete CRTV calibration. | Medical Centre - Different: squeeze through the wall opening, interact with the radio on the table, complete the CRTV calibration, and store the signal. | Explicitly approved radio replacement; unchanged in the final pass. |
| #35 | Before leaving the opening Clara Woods area, enter the Locals shop and calibrate the radio on the central table. | Before leaving the opening Clara Woods area, enter the Locals shop and interact with the radio on the central table. Complete the CRTV calibration and store the signal. | Explicitly approved radio replacement; unchanged in the final pass. |
| #42 | At the Strange Gate at the end of Atlas Way, inspect the metal pipe structure. After the transmission becomes available, sweep near Channel 62; you may need to adjust where Simon stands. | At the Strange Gate at the end of Atlas Way, inspect the metal pipe structure. Once the transmission becomes available, adjust Simon’s position if necessary, tune the CRTV to approximately Channel 62, and store the signal. | Final approved Tuning wording. |
| #43 | Enter the building immediately to the left of CEG Staff Parking on the map. Once inside, tune near Channel 67. | Enter the building immediately to the left of CEG Staff Parking on the map. Once inside, tune the CRTV to approximately Channel 67 and store the signal. | Final approved Tuning wording. |
| #45 | Obtain the South Brae House Key, enter 5 South Brae, turn right into the living room, and calibrate the radio beside the television. | Obtain the South Brae House Key and enter 5 South Brae. Turn right into the living room, interact with the radio beside the television, complete the CRTV calibration, and store the signal. | Explicitly approved radio replacement; unchanged in the final pass. |
| #46 | After completing the South Brae computer puzzle, return to CEG Employee Lockers and open Locker 17. Once its items are collected, tune near Channel 59. | After completing the South Brae computer puzzle, obtain Barcode (South Brae) and scan it at CEG Employee Lockers to reveal Locker 17’s PIN (code: 575). Open Locker 17 and collect its contents, then tune the CRTV to approximately Channel 59 and store the signal. | Final approved Tuning wording. |
| #49 | As you leave 5 Upper Brae after solving the tape puzzle, tune the CRTV around Channel 29. | As you leave 5 Upper Brae after solving the tape puzzle, tune the CRTV to approximately Channel 29 and store the signal. | Final approved Tuning wording. |
| #51 | Once all three Mechanical Parts have been acquired, tune the CRTV around Channel 65. | Once all three Mechanical Parts have been acquired, tune the CRTV to approximately Channel 65 and store the signal. | Final approved Tuning wording. |
| #53 | CEG HQ Ground Floor: enter the Security Room near the front entrance using door code 4895 (clued by the Maintenance room whiteboard). Interact with the radio to the right of the telephone and complete the CRTV picture-and-color calibration. | CEG HQ - Ground Floor: unlock the Security room near the front entrance (code: 4895, indicated on the Maintenance room whiteboard). Interact with the radio beside the telephone, complete the CRTV calibration, and store the signal. | Explicitly approved radio replacement; unchanged in the final pass. |
| #54 | In CEG HQ (Different), enter the main room with the tower puzzle. On the desk to the right, interact with the radio beside the Reference Sheet and calibrate it. | In the flare-stack control area, interact with the radio on the desk beside the Reference Sheet. Complete the CRTV calibration and store the signal. | Approved radio wording; final pass removes the repeated SWDP prefix. |
| #55 | After the rotating-tower puzzle and first pipe section, go into the left-hand room instead of descending the ladder. Calibrate the radio there. | After completing the flare-stack puzzle and crawling through the first pipe labyrinth, enter the room on the left before descending the ladder. Interact with the radio, complete the CRTV calibration, and store the signal. | Approved radio wording; final pass removes the repeated SWDP prefix. |
| #58 | Obtain the JOE Key from the northeast office, unlock the southwest JOE room, and squeeze through the wall gap. Calibrate the radio beside the bed. | Obtain the JOE Key from the northeast office and unlock the southwest JOE room. Squeeze through the wall opening, interact with the radio beside the bed, complete the CRTV calibration, and store the signal. | Approved radio wording; final pass removes the repeated SWDP prefix. |

### Other wording beyond the exact supplied replacements

The additional CRTV changes are #7 and #12 in the table above. The following table records the other deviations beyond the exact replacement sentences. All remaining description changes follow the explicit replacements, including the final correction pass above. Curly apostrophes are retained consistently with the existing text.

| Route item | v42 description | v43 description | Reason |
| --- | --- | --- | --- |
| #13 | Enter St. Amelia Park from the south and turn left. Follow the alley behind the building marked 3 on the district map; the postcard is on the ground beside a dumpster. | Use the Scalpel to enter St. Amelia Park from the south and turn left. Follow the alley behind St. Amelia Bank (marked 3 on the Shorefront map); the postcard is on the ground beside a dumpster. | Uses the approved named-bank/map wording, with the requested short Scalpel prerequisite at the southern entrance. |
| #14 | Continue toward Farrow Street, then inspect the postcard attached to the wall at its western end. | At the western end of Farrow Street, inspect the postcard attached to the wall. | Removes “Continue toward” so the location stands alone in search; no repeated park-access instructions are needed. |
| #52 | Return to CEG Employee Lockers and enter the back office. Open the container on the table with Lockbox Key #5. | Return to CEG Employee Lockers and enter the back office. Open the Resource Container on the table using Lock Box Key #5. | Applies Lock Box Key spelling and Resource Container terminology consistently; retains the same location and key requirement. |

The Pharmacy and southern St. Amelia Park Scalpel requirements, plus the second-floor radio interaction for #23, are supported by the linked [Part 1 walkthrough](https://www.powerpyx.com/silent-hill-townfall-part-1-arrival-collectible-locations/) and [CRTV walkthrough](https://www.powerpyx.com/silent-hill-townfall-all-crtv-signal-locations/). These are walkthrough checks, not independent gameplay tests. User-approved corrections take precedence over contradictory guide labels, including the late-game SWDP area and Ward W Room 04.

### Validation and manual review

The existing `tests/counter-regression.mjs` covers individual toggles, category/dashboard All, Mark All, Clear All, Undo, filtered counters, missing-only behavior, both key/container identities, contextual Return, profiles and reloads. New `tests/accuracy-regression.mjs` adds inventory/source/asset guards, full titles and aliases, both metadata formats, all four spoilers and warnings in both views, a real v42-app save fixture using all 61 identities and two profiles, Gallery/viewer DOM navigation, and the final approved wording. The spoiler tests also check that no duplicate solution appears outside its reveal control.

Run from the repository root, using the cached dependency:

```sh
DENO_DIR=/private/tmp/townfall-v41-deno deno run --cached-only --allow-read --allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE collectibles/tests/counter-regression.mjs
DENO_DIR=/private/tmp/townfall-v41-deno deno run --cached-only --allow-read --allow-run=git --allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE collectibles/tests/accuracy-regression.mjs
git diff --check
```

Executed results: **60/60 existing scenarios and 40/40 v43 accuracy scenarios passed**. Both inline scripts passed JavaScript syntax checks. The initial pass compared all 40 supplied replacements. Final-correction fixtures now check the 21 revised descriptions plus unchanged #7/#23 exactly in both views, retaining established curly apostrophes. An exact comparison with the preceding uncommitted v43 source confirms the limited patch scope. Inventory/identity/asset/source guards and `git diff --check` passed. A CSS comparison confirmed that only the spoiler component and category-location wrapping were added; existing styles are unchanged.

Both suites use isolated Happy DOM windows at 1280px and 390px, with normal and reduced motion. The new suite evaluates spoiler CSS visibility, transitions, grid reservation and wrapping rules. Image decoding and scrolling are stubbed. It checks focus, native button semantics and non-intercepted Enter/Space events; Happy DOM does not perform native keyboard activation, physical taps, screen-reader output, real line wrapping or painting. Actual Safari/Firefox and physical mobile validation remains manual.

Before release, check in desktop Safari/Firefox and iPhone Safari:

1. Inspect the longest By Category Part/chapter chips, fixed key/container titles and inline warnings at narrow widths. Confirm no clipping or horizontal overflow.
2. Tab to each of the four reveal controls; use Enter/Space, then tap them on mobile. Confirm no checkbox changes, no layout jump and useful reveal/hide announcements. Repeat with completed rows and reduced motion.
3. Combine category, search and missing-only filters. Exercise Part All and Undo, then category All. Confirm progress totals and the established selection scopes.
4. Switch profiles and reload; verify saved completion, preferences and concealed spoiler defaults.
5. Browse original/solved/compare postcard modes and Previous/Next, use View location and contextual Return, and confirm image loading and scroll behavior.

### Questions deliberately left unchanged

- The first callback keeps its user-selected Chapter 1/NG+ placement despite conflicting guide interpretations.
- Save Yourself retains Simon route metadata; first collectible registration across characters remains unproven.
- No assumption is made about interchangeable keys; all seven existing pairings remain intact.
- All 19 CRTV signals remain, including the Security radio omitted by some 18-signal guides. The final Tuning storage wording follows the user’s explicit approval; acquisition methods and frequencies remain unchanged.
- By Category All still acts on the whole category; a paired card can retain its completed half under missing-only. These established semantics remain a separate future discussion.
- Safari Dock web-app refresh/scroll restoration remains an accepted limitation.

Only `collectibles/index.html`, this existing README, and the new Collectibles test file are part of v43. No root Ending files, assets, manifest or other application files changed. The HTML is the application update; the README and tests support review and development.

# Silent Hill: Townfall — Collectibles & Secrets Tracker v42 (proposed bug fix)

## v42: Story Route category progress and scoped Part All

- Each Part counter now uses the active category: All categories counts every item, while Containers & Keys counts both individual types. Search and Show Missing Only do not change this progress numerator or denominator.
- A Part's All checkbox affects only items matching the active category and search. Its checked/partial state follows that selection scope, which can be smaller than the counter's category scope. The tooltip reports the selection count and identifies search-matching items.
- Show Missing Only hides completed rows without changing either scope. Selecting All can remove a completed Part from the filtered view; Undo restores its changed checkmarks and visible rows. Clearing All affects the same category/search scope, including completed matches hidden by Show Missing Only.
- Parts without visible matches remain omitted under filters, as before. Unfiltered Part 5 retains its established 0 / 0 notice and no All checkbox.
- Undo for Part All restores only items changed by that operation, preserving later unrelated edits. Other bulk controls retain their established Undo behavior.
- Preserves the v41 By Category correction, overall 61-item statistics, profile preferences, item identifiers, and `townfallCollectibles.v1`. Styling, Gallery code/navigation, image assets, and the Ending Tracker are unchanged.
- Focused DOM tests cover all six Parts, category/search combinations, both container/key identities, Show Missing Only, scoped Undo, profiles, and reload persistence, alongside the v41 regression cases. They use desktop/mobile media queries and both motion preferences, without validating real browser layout or painting.
- Application update: replace only `collectibles/index.html`; README and tests are documentation/development files. No commit, push, or deployment has been performed for this proposed fix.

# Silent Hill: Townfall — Collectibles & Secrets Tracker v41 (proposed bug fix)

## v41: Preserve By Category completion counters

- Restricts the Story Route counter update in `redrawProgress()` to sections with `data-part`. Category sections use `data-kind`; including them in the Story Route update incorrectly overwrote their counters with `0 / 0` after individual checkbox changes.
- Keeps the existing category counter calculations, including the combined 14-item Resource Containers / Lockbox Keys group.
- Preserves search, filters, navigation, Gallery behavior, animations, item identifiers, profiles, and the `townfallCollectibles.v1` storage key. The Ending Tracker is unchanged.
- This bug predates v40's expanded search. The same counter update is present in the repository's original Collectibles commit.
- Automated DOM regression tests are in `tests/counter-regression.mjs`. They exercise desktop/mobile media-query settings and both motion preferences; they do not verify real browser layout or painting. Safari, Firefox, and physical mobile browser validation remain pending.
- For an existing GitHub Pages installation, the application fix requires replacing only `collectibles/index.html`; the README is documentation and the tests are development-only. This proposed version has not been committed or deployed.

# Silent Hill: Townfall — Collectibles & Secrets Tracker v40

## v40: Search index and formatting refinements

- Searches collectible titles, descriptions, warnings, notes, chapters, Parts, methods, actors, phone numbers, CRTV frequencies, solutions, and the meaningful category/pill labels.
- Case-insensitive multi-keyword **AND** search, with normalized whitespace and targeted aliases for St. Amelia, New Game Plus/NG+, category names, and numbered identifiers (e.g., "Phone Call #1" or "CRTV 09").
- Telephone-number searches accept spaces or hyphens, repeated spaces, or no separators (e.g., `496 0842`, `496-0842`, and `4960842`).
- Category+number queries target the exact item. Active search in By Category displays only the matching portion of a paired Lockbox Key / Resource Container card; ordinary unfiltered pairs remain unchanged.
- Preserves category filters, Show Missing Only, saved profiles/progress, and v39 immediate Return navigation, as well as all Gallery image behavior.
- For existing GitHub Pages installs, replace only the **individual** `collectibles/index.html` and `collectibles/README.md` files. Do not replace their containing folder.

# Silent Hill: Townfall — Collectibles & Secrets Tracker v39 (Transition Experiment)

## v39: Experimental direct cross-view positioning

- Changes only the **By Category → Find in story route → Story Route → Return to [item]** navigation pair to **immediate destination positioning with the existing highlight animation**.
- The destination is rendered and positioned synchronously in the triggering click task to avoid showing a frame of the wrong checklist position. There is **no full-page overlay, flash, or intentionally blank intermediary state**.
- Retains all v38 return context, filters, search, per-profile preferences, missing-only and paired-item fallbacks.
- **Does not change** the Postcard Gallery's modal navigation or return sequencing, Next Missing smooth scrolling, other navigation, images, saved progress, or storage keys.
- This is a **trial release**. Keep v38 as the proven fallback until Safari, Firefox, and iPhone testing confirms the feel and behavior.
- To install the GitHub Update, replace only `collectibles/index.html` and `collectibles/README.md` in the existing repo folder; do not replace the whole `collectibles/` directory.

## v38: Consistent Return-button text color

- Corrects the new By Category → Story Route **Return to [item]** button's default text color to match the existing pale-pink **Return to Postcard** button (`#e9c4ca`), while preserving the white hover text.
- A single shared CSS declaration was added to `.entry-return`. All JavaScript, navigation timing, highlighting, state management, postcard viewer behavior, and saved progress remain exactly as in v37.
- For an existing GitHub Pages installation, replace only `collectibles/index.html` and (optionally) `collectibles/README.md` from the smaller GitHub Update ZIP. Copy these **individual files** into the existing `collectibles/` folder: **do not replace the whole folder**, which holds the Gallery artwork.



## v37: Contextual return from Story Route to By Category

- When **Find in story route →** is used from By Category, the Story Route item now displays a contextual **← Return to [collectible name and number]** button.
- Returning restores the previous category filter, search, Show Missing Only preference, and expanded categories; it scrolls to and briefly highlights the originating item.
- For Lockbox Keys and Resource Containers, the highlight targets the appropriate half of their paired card.
- If the original item has become excluded by Show Missing Only, the return keeps that filter enabled and scrolls to the relevant category heading or the completion/empty message instead.
- The button is temporary and clears after use, manual view changes, next-missing navigation, and profile changes. The postcard Gallery's existing Return to Postcard behavior is unchanged.
- Progress identifiers, browser storage key (`townfallCollectibles.v1`), postcard images, artwork loading and caching, and other application behavior are preserved.

## v36: Fresh achievement artwork

- Replaced the four `assets/achievements/*.png` images with clean, consistently framed extractions from the original PlayStation screenshots. No additional asset edits are required for v37.

## Preview locally

Keep the entire `collectibles/` directory together. Open `index.html` in Safari or Firefox to preview the tracker. The browser may limit web-app installation features when the page is opened as a local `file://` document; publish it to GitHub Pages to test installation.

## Publish alongside the Ending & Progress Tracker

Upload the complete `collectibles/` directory to the **root** of the existing `Maximophanes/silenthilltownfalltracker` repository. Do **not** replace the original root-level `index.html` or its existing icons and manifest.

- Ending & Progress Tracker: https://maximophanes.github.io/silenthilltownfalltracker/
- Collectibles & Secrets Tracker: https://maximophanes.github.io/silenthilltownfalltracker/collectibles/

## Contents

- `index.html` — the standalone Collectibles Tracker webpage, including its styles and scripts.
- `site.webmanifest` — the Collectibles-specific web-app identity, launch URL, and oxblood theme.
- `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` — the original Nine Red Squares icon files supplied for v109.
- `assets/postcards/` — 15 original postcards and nine solved images used by the viewer.
- `assets/thumbs/` — 15 gallery preview thumbnails.
- `assets/postcards/source-jpeg-mattes/` and `source-solved-mattes/` — archived original versions retained for comparison, not loaded by the webpage.

The tracker relies on relative asset references; moving `index.html` outside its directory will break its images and web-app icon links. The original favicon remains embedded in the HTML; the browser theme uses `#120507`.

## Installation

From the published Collectibles URL, choose Safari → File → Add to Dock on a compatible Mac. Other supported browsers may offer Install App or Add to Home Screen. `standalone` in the manifest requests an app-like window; it does **not** automatically enable offline access. The two trackers have separate manifest scopes but the same icons by design.

## Progress and compatibility

The 61 checklist entries, 19 CRTV signals, postcard collection, and saved-progress identifiers remain unchanged. The v17 gallery completion-update logic is preserved; v18 changes only the border-color variable used by the six dashboard subcards and empty-state panel. Progress remains in the browser's `localStorage` under the existing key `townfallCollectibles.v1`. Local previews and the published website do not automatically share progress; uninstalling a web app or clearing site data may remove saved progress. The two trackers are separate applications that happen to share one GitHub repository.

## v18 changes: Dashboard subcard borders

- Defined the previously missing `--hair` oxblood border variable as `rgba(204,83,96,.16)`.
- This restores subtle consistent outlines around the four category indicators and the Collectibles and Lockbox Keys indicators (six subcards total).
- The same variable also restores the intended border on generic empty-state information panels.
- All JavaScript, collectible records, asset URLs, gallery interactions, storage, and animations remain identical to v17.

## Updating from v17 with GitHub Desktop

In your locally cloned repository, replace only `collectibles/index.html` with this version's `index.html`. The root-level `index.html` belongs to the separate Ending & Progress Tracker and must not be replaced. Commit the `collectibles/index.html` modification and Push origin. No need to reupload images, icons, or the manifest.

The archival `source-jpeg-mattes/` and `source-solved-mattes/` folders are retained in this complete backup package, but are **not needed** in a published website. If they were previously excluded from GitHub, leave them excluded. Do not copy these archival folders into your repository when updating v17.

## Notes

This fan-made guide is independent of the game and does not read game saves. Use the in-page external reference links when checking collectible descriptions.

## v22: mobile layout refinements

Mobile-only improvements: checklist Guide action row; stable postcard viewer header and solution line; Gallery shortcut navigation; readable Story Route / By Category labels; floating Next Missing hidden in the Gallery; and a separate Reference Guides heading. Desktop dashboard and tracker logic remain unchanged.


## v24: profile-specific checklist view and expansion preferences

- The selected Story Route/By Category view, each Part and category's expand/collapse state, category filter, and Show missing only setting now persist independently for each playthrough profile.
- Search terms, transient dialogs, and Gallery overlay are intentionally not restored on page reload.
- The existing `townfallCollectibles.v1` localStorage key and all previously saved checkmarks are preserved; v23 and older profiles are upgraded non-destructively on first use.
- The floating Next Missing button now uses a smaller arrow and a tighter 5px gap from the centered, emphasized text block.
- All responsive refinements from v21, the v22 typography work, the v17 Safari gallery reconstruction fix, and the v19/v20 dashboard refinements remain intact.
- After initial installation on GitHub Pages, only `collectibles/index.html` needs updating. The archive also includes an updated README.


## v25: floating navigation label alignment

- Centered the Next missing / CHECKLIST ITEM text block to the button itself, while placing the decorative arrow 5px to the left without affecting the text position.
- Preserved all v24 profile-specific checklist persistence, v21 mobile styling and gallery navigation, all collectible records, and all image assets.
- To update an existing published installation, replace only `collectibles/index.html`.


## v26: floating Next Missing appearance rollback

- Restores the exact floating Next Missing button CSS from the original v20 design, including its larger arrow, left-aligned two-line copy, grid spacing, and mobile sizing.
- Keeps all v25 functionality, including v24 per-profile interface persistence and v21 mobile Gallery refinements.
- Only `collectibles/index.html` needs replacing on an existing GitHub Pages site.


## v27: Mobile refinements and postcard viewer scroll lock

- Mobile Guide row spacing reduced while right-aligned.
- Mobile category All checkboxes remain in upper-right corners.
- Gallery shortcut touch hover no longer remains visually selected after returning to checklist.
- Postcard viewer locks background scrolling on mobile and desktop; View postcard location retains intentional checklist navigation.
- All per-profile saved settings, postcard images and other resources retained.
- For an existing Pages installation, replace collectibles/index.html only.


## v35: postcard type labels in Gallery

- Ordinary postcards now display **Standard Postcard** rather than **Strange Postcard** in the Gallery thumbnail subtitle.
- The nine autostereograms continue to display **Autostereogram**.
- Standardized the capitalization in the postcard viewer subtitle to **Standard Postcard** for consistency.
- No changes to card titles, checklists, profiles, progress, viewer controls, image assets, image caching, or browser storage.
- To update an existing GitHub Pages installation, replace only `collectibles/index.html`. The root Ending & Progress Tracker is unchanged.
