# Silent Hill: Townfall — Collectibles & Secrets Tracker v35

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
