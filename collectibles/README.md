# Silent Hill: Townfall — Collectibles & Secrets Tracker v16

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

The 61 checklist entries, 19 CRTV signals, postcard collection, identifiers, and JavaScript logic are unchanged from v15. Progress remains in the browser's `localStorage` under the existing key `townfallCollectibles.v1`. Local previews and the published website do not automatically share progress; uninstalling a web app or clearing site data may remove saved progress. The two trackers are separate applications that happen to share one GitHub repository.

## v16 changes and conservative code audit

- Added exact user-supplied icons and a dedicated manifest with relative scope and start URL.
- Kept the embedded SVG favicon and oxblood theme-color declaration unchanged.
- Removed the header's Ending & Progress Tracker shortcut and placed a reference-pill-styled companion link beneath Reference Guides.
- Removed confirmed obsolete styling for the old header shortcut, an unused legacy inline Undo component, and unused inline Undo layout rules. No game data, script logic, or shared v109 animation code was removed. Dynamic or uncertain rules were deliberately retained.
- No replacement or recoloring of artwork.

## Notes

This fan-made guide is independent of the game and does not read game saves. Use the in-page external reference links when checking collectible descriptions.
