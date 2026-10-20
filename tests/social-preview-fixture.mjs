// Exact approved static sharing additions. Historical snapshots stay unchanged.
// Whole-file guards insert this fixture into their expected HTML; they never
// strip or ignore arbitrary metadata, scripts, styles or application content.
import assert from 'node:assert/strict';

const approvedHeads = {
  ending: `<!-- Social sharing previews -->
<link rel="canonical" href="https://maximophanes.github.io/silenthilltownfalltracker/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Silent Hill: Townfall Trackers">
<meta property="og:title" content="Silent Hill: Townfall — Ending &amp; Progress Tracker">
<meta property="og:description" content="Track all 85 scoring Discoveries, manage New Game+ requirements, and calculate your projected ending with separate playthrough profiles.">
<meta property="og:url" content="https://maximophanes.github.io/silenthilltownfalltracker/">
<meta property="og:image" content="https://maximophanes.github.io/silenthilltownfalltracker/assets/social/ending-progress-preview.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:image:alt" content="Silent Hill: Townfall Ending &amp; Progress Tracker showing its Discoveries checklist, Target Ending selector and projected-ending interface.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Silent Hill: Townfall — Ending &amp; Progress Tracker">
<meta name="twitter:description" content="Track all 85 scoring Discoveries, manage New Game+ requirements, and calculate your projected ending with separate playthrough profiles.">
<meta name="twitter:image" content="https://maximophanes.github.io/silenthilltownfalltracker/assets/social/ending-progress-preview.png">
<meta name="twitter:image:alt" content="Silent Hill: Townfall Ending &amp; Progress Tracker showing its Discoveries checklist, Target Ending selector and projected-ending interface.">
<!-- End social sharing previews -->
`,
  collectibles: `<!-- Social sharing previews -->
<link rel="canonical" href="https://maximophanes.github.io/silenthilltownfalltracker/collectibles/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Silent Hill: Townfall Trackers">
<meta property="og:title" content="Silent Hill: Townfall — Collectibles &amp; Secrets Tracker">
<meta property="og:description" content="Track 61 collectible entries, including Strange Postcards, phone calls, CRTV signals, Resource Containers, and Lock Box Keys. Includes a searchable checklist and Strange Postcard Gallery.">
<meta property="og:url" content="https://maximophanes.github.io/silenthilltownfalltracker/collectibles/">
<meta property="og:image" content="https://maximophanes.github.io/silenthilltownfalltracker/assets/social/collectibles-secrets-preview.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:image:alt" content="Silent Hill: Townfall Collectibles &amp; Secrets Tracker showing the Strange Postcards checklist and Strange Postcard Gallery artwork.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Silent Hill: Townfall — Collectibles &amp; Secrets Tracker">
<meta name="twitter:description" content="Track 61 collectible entries, including Strange Postcards, phone calls, CRTV signals, Resource Containers, and Lock Box Keys. Includes a searchable checklist and Strange Postcard Gallery.">
<meta name="twitter:image" content="https://maximophanes.github.io/silenthilltownfalltracker/assets/social/collectibles-secrets-preview.png">
<meta name="twitter:image:alt" content="Silent Hill: Townfall Collectibles &amp; Secrets Tracker showing the Strange Postcards checklist and Strange Postcard Gallery artwork.">
<!-- End social sharing previews -->
`
};

export function withApprovedSocialPreview(source, page) {
  assert.ok(Object.hasOwn(approvedHeads, page), 'Known social-preview page');
  const anchor = '</title>\n';
  assert.equal(source.split(anchor).length, 2, 'Exactly one title insertion point');
  assert.equal(source.includes('<!-- Social sharing previews -->'), false,
    'Historical expected HTML must not already contain sharing metadata');
  return source.replace(anchor, anchor + approvedHeads[page]);
}
