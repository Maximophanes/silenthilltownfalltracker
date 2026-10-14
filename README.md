# Silent Hill: Townfall — Ending & Progress Tracker v114 (proposed release)

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

The suite runs at 1280px and 390px with normal and reduced motion. Its 40 scenarios include the final Clinic/room-name/Ground Floor wording checks and 1,120 comparisons of ending scores/notices against v113 across score boundaries, penalties, targets and special routes. Existing calculation, storage, navigation, animation and NG+ rendering functions are also compared byte-for-byte; only spoiler CSS is added to the existing stylesheet.

Run with Deno and Happy DOM 20.8.4 available in the existing dependency cache:

```sh
DENO_DIR=/private/tmp/townfall-v41-deno deno run --cached-only --allow-read --allow-run=git --allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE tests/ending-regression.mjs
```

These tests emulate DOM events, CSS/media queries and timers. They do not verify browser painting, actual text wrapping, physical touch, native keyboard default activation or measured layout stability. Safari, Firefox and physical mobile validation remain manual.

The targeted dataset review found no additional exposed numerical access codes. Optional editorial candidates left unchanged outside the explicit corrections: unquoted computer-entry labels in Discoveries 34 and 35. No additional factual correction was inferred from these wording differences.

## Manual browser review

In Safari, Firefox and a mobile browser:

1. Load existing profiles; confirm each reordered email keeps its own checkmark. Switch profiles and reload.
2. Reveal/hide all three codes with mouse/tap and Tab + Enter/Space. Confirm the code stays concealed when its checkbox is changed, focus remains on the reveal control during disclosure, and neither surrounding text nor row width jumps. Repeat with reduced motion and a completed row.
3. Inspect Discovery 75's inline warning alongside warnings 43, 67, 68 and 85. Check longer instructions for wrapping and horizontal overflow.
4. Check Part expansion, Next missing, Show missing only, individual/Part/global checkboxes, Clear All/Undo, NG+ route controls and achievement artwork. Confirm counts and saved progress after reload.
