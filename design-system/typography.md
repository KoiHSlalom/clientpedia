## Typography Tokens — Clientpedia

This document describes the typography primitives and semantic tokens included in `design-tokens.json` and how to use them.

Primitives
- `type.family.sans` — primary sans stack for UI text.
- `type.family.mono` — monospace stack for code and tabular values.
- `type.weight.*` — numeric weights (light, regular, medium, semibold, bold).
- `type.leading.*` — line-height presets (tight, snug, normal, loose).
- `type.tracking.*` — letter-spacing options.

Sizes
- Base sizes are in `fontSizes` (xs..8xl). Use semantic aliases where possible.

Semantic tokens (examples)
- `type.semantic.body.md` — application body text (maps to `fontSizes.base`, regular weight).
- `type.semantic.heading.h1` — page H1 (size, weight, leading).
- `type.semantic.display.display-1` — large hero/display text.
- `type.semantic.caption` — small caption text with normal leading.
- `type.semantic.label` — UI labels (smaller + medium weight).

Usage examples
- Button label
  - font-family: `type.family.sans`
  - font-size: `type.semantic.label.size`
  - font-weight: `type.semantic.label.weight`
  - line-height: `type.semantic.label.leading`

- Card title
  - font-size: `type.semantic.heading.h4.size`
  - font-weight: `type.semantic.heading.h4.weight`

- Page H1
  - font-size: `type.semantic.heading.h1.size`
  - font-weight: `type.semantic.heading.h1.weight`

Accessibility
- Always verify contrast for text tokens.
- Use `type.leading` values to ensure readable line lengths and spacing.

Next steps
- Map these tokens into component styles (buttons, headings, cards) and Storybook examples.
