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
