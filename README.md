# Silent Hill: Townfall — Ending & Progress Tracker v115 (proposed release)

## v115: Three targeted corrections

Starting point: clean working tree at `b0d73c3`, with Ending v114 and published Collectibles v43. This update changes only root `index.html`, this README and the existing Ending regression test. Collectibles v43 is untouched. No commit, push or deployment is included.

- Discovery 83 (stable ID 83) now uses `AUX room`, preserving AUX Disk, the SWDP - Different prefix and the quoted document title “Auxiliary Lines”. No direct in-game evidence in the repository establishes `AUX Room` as a proper name, so this follows the approved generic-room convention.
- Bronze Coin (`bronzeCoin`) now identifies `VIDEO STAR (the Video Rental Store marked 1 on the Shorefront map)` and explicitly directs collection from the small back-room shelf. Chapter 1, all metadata, acquired/inserted identities and NG+ dependencies are unchanged.
- Discovery 26 (stable ID 26) now explains opening the Jane’s Garden shed with the year from Jane Chalmers’ commemorative plaque before reading the obituary on the middle shelf. [VGC’s shed guide](https://www.videogameschronicle.com/guide/silent-hill-townfall-community-gardens-shed-combination-lock-puzzle-solution/) identifies the Jane’s Garden sign and plaque; the existing [PowerPyx Part 2 reference](https://www.powerpyx.com/silent-hill-townfall-part-2-zoe-collectible-locations/) supports code 1993 and the middle-shelf location. Jane’s Garden identifies the sign on the shed; no new official room-name claim is introduced.
- Code 1993 is added only to the existing `DISCOVERY_ACCESS_CODES` map. The same spoiler formatter, native button, reveal/hide listener, CSS, animation and accessibility labels handle it. It is concealed by default, independent of its checkbox and never persisted. No separate warning/Note block or new state field is added.
- Exact comparison with v114 permits only those three descriptions, the added code-map entry and the version comment. All 85 Discoveries, 11 NG+ steps, IDs, positions, classifications, warnings, profiles, storage, ending calculations, navigation and existing styles remain unchanged.

Validation: **48/48 DOM scenarios passed, zero failures**, at 1280px and 390px with both motion preferences, including 1,120 ending-calculation comparisons. Inline JavaScript syntax, exact v114 patch scope, stable data, existing resources, untouched Collectibles v43 and `git diff --check` passed. Tests emulate DOM/CSS/media behavior; actual Safari/Firefox painting, touch and native keyboard activation remain manual checks.

## v114: Accuracy corrections and concealed access codes

- Corrects the Discovery titles **Vigil & Protest Flyer**, **Jane Chalmers Obituary**, **Unrealistic Expectations (number 1098512....)**, **Records Room Code**, and **Facilities: “DONTREAD.DOC”**. The four ordinary periods in Unrealistic Expectations are intentional.
- Clarifies the Harbourmaster, Clinic entrance/Reception, Building 16, Handwritten Note building, Gaming Magazine room, numbered metal lockbox, Meeting Room and Media Department/Storeroom instructions. Adds the verified subjects for Coming Back, He's Done, whatdidyoudo? and RE: Ordell Site Visit, and quotes the CEG Employee Locker List entry.
- Uses written Chapman Ward floor names without hyphens, `CEG HQ - Ground Floor` for the lobby entries, written CEG upper-floor names, `CEG HQ (Different) - Tenth Floor`, `SWDP - Different`, and `Medical Centre - Different`. Corrects Reference Sheet's location to SWDP and lowercases “house” in Zoe's location descriptions. Existing Victoria Ward floors are retained.
- Gives Discovery 15 the full Clinic room directions and Discoveries 16/17 shorter, parallel descriptions identifying the Clinic, Z Ellis’s room, computer and exact email subjects. Clarifies Exhausted Supplies' back-left corner, capitalizes Reception in 36/37, and preserves the verified names “Security room” and “Managers Office”. The Ground Floor designation supersedes the initial v114 First Floor wording.
- Places **For Attending…** at displayed Discovery 12 and **Please Report In** at 13. Their stable IDs remain 13 and 12 respectively, preserving each email's saved checkmark and classification. Vigil & Protest Flyer remains in its established position.
- Updates the Strange Book labels to **History of Space Flight, 1952 - 1992**, **Freeze Me / Wake Me - Elias Fisher**, and **A Map of Nowhere Else - The Future of Interstellar Travel**. Clarifies the optional Room 793/Gold Coin and Room 621/Book 3 routes after unlocking Room 592 (Valve F), without adding a mechanical dependency.
- Conceals only codes **2896**, **4895** and **486** in displayed Discoveries 18, 59 and 63. Small inline native buttons reveal/hide the code independently of the checkbox, expose an accessible label, retain focus, and respect reduced motion. Overlapping grid spans reserve the same space before and after disclosure. Reveal state stays in the rendered row: collapsing a Part retains it; rerendering, changing profiles or reloading conceals it again. No storage fields or keys were added.
- Adds the office-door/Part 6 missability warning to Discovery 75 through the existing warning-suffix map, renderer and `.discovery-warning` style. Warnings 43, 67, 68 and 85 are unchanged.
- Retains all **85 Discoveries (52 Documents / 33 Clues)**, **11 NG+ steps**, item IDs, profiles, ending calculations, route dependencies, achievements, assets and `townfallEndingTracker.v2`. The existing endings are Justice, Forever, Abandoned, Dog and Sci-Fi. The Collectibles Tracker is unchanged.

For an existing installation, the application update is **root `index.html` only**. This README and the regression test are development documentation. No commit, push or deployment has been performed.

## Automated verification

`tests/ending-regression.mjs` executes the real inline application script in isolated Happy DOM windows. It checks approved data changes against commit `cb0f17a` (Ending v113), preserved IDs/classifications, saved email states, profiles/reload, counters, individual/Part/global selection, Clear All/Undo, Show missing only, Next missing, NG+ dependencies, concealed codes/focus/event isolation, reduced-motion CSS, unchanged warnings, DOM IDs and local resources.

The suite runs at 1280px and 390px with normal and reduced motion. Its 48 scenarios include the three v115 corrections, all four spoiler controls, v114 saved-progress/profile/reload compatibility, the final Clinic/room-name/Ground Floor wording checks and 1,120 comparisons of ending scores/notices against v113 across score boundaries, penalties, targets and special routes. Existing calculation, storage, navigation, animation and NG+ rendering functions are also compared byte-for-byte; only spoiler CSS is added to the existing stylesheet.

Run with Deno and Happy DOM 20.8.4 available in the existing dependency cache:

```sh
DENO_DIR=/private/tmp/townfall-v41-deno deno run --cached-only --allow-read --allow-run=git --allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE tests/ending-regression.mjs
```

These tests emulate DOM events, CSS/media queries and timers. They do not verify browser painting, actual text wrapping, physical touch, native keyboard default activation or measured layout stability. Safari, Firefox and physical mobile validation remain manual.

The v114 dataset review found no additional exposed numerical access codes; v115 adds the previously omitted shed-access instruction with its code concealed. Optional editorial candidates left unchanged outside the explicit corrections: unquoted computer-entry labels in Discoveries 34 and 35. No additional factual correction was inferred from these wording differences.

## Manual browser review

In Safari, Firefox and a mobile browser:

1. Load existing profiles; confirm each reordered email keeps its own checkmark. Switch profiles and reload.
2. Reveal/hide all four codes (2896, 1993, 4895 and 486) with mouse/tap and Tab + Enter/Space. Confirm the code stays concealed when its checkbox is changed, focus remains on the reveal control during disclosure, and neither surrounding text nor row width jumps. Repeat with reduced motion and a completed row.
3. Check the new shed instructions, Auxiliary Lines and Bronze Coin wording at narrow widths. Inspect Discovery 75's inline warning alongside warnings 43, 67, 68 and 85; confirm no horizontal overflow.
4. Check Part expansion, Next missing, Show missing only, individual/Part/global checkboxes, Clear All/Undo, NG+ route controls and achievement artwork. Confirm counts and saved progress after reload.
