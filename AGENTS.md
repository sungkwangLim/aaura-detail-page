# Project CSS Rules

- Write every CSS selector rule on one physical line.
- Use this exact declaration spacing: `.selector { property : value; property : value; }`
- Keep one space after each semicolon and no extra space before the closing brace.
- Keep `@media`, `@supports`, and `@keyframes` braces on separate lines; rules inside them still stay one rule per line.
- Order declarations by these groups:
  1. Custom properties
  2. Positioning and layout
  3. Box model
  4. Typography
  5. Visual styling and media
  6. Transform, transition, animation, and interaction
  7. Remaining properties
- Within the same group, preserve the existing order unless changing it improves readability.
- Run `node tools/format-css.mjs` after editing CSS.
- Implement and verify one Figma section at a time. Do not change later sections while working on the current section.
- For the 1200px desktop layout, keep headings, paragraphs, lists, cards, and section groups in normal document flow using block, flex, or grid.
- Use `margin`, `padding`, and `gap` for vertical and horizontal spacing so content can grow or shrink without breaking the section.
- Use `position : absolute` only for unavoidable visual overlays such as decorative lines, floating artwork, slider dots, or explicitly approved annotations.
- Prefer `height : auto` with a design-based `min-height` over a fixed height when text or groups may expand.
- Provide responsive rules at `max-width:1200px` and `max-width:760px` for every completed section.
- Write the base 1200px desktop layout with the pixel values reported by Figma Dev Mode.
- Keep the exact 1200px layout in pixels; introduce proportional units only below the desktop design width and use fluid units for mobile layouts.
- Prefix every project class, including utility and JavaScript state classes, with `aaura-` to prevent Cafe24 theme collisions.
- Scope element selectors and shared layout rules under `.aaura-detail-page`; do not add unscoped `body`, heading, paragraph, or universal selectors.
- Keep `tools/cafe24-isolation.test.mjs` passing whenever classes or files under `assets/` change.
