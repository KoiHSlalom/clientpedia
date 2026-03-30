**Color Primitives & Semantics**

This document records the design-system color primitives (scales) and semantic tokens for Clientpedia.

Primitives
- `primary[50..900]` — brand primary scale (navy-based). Use `primary.900` for primary text/brand mark, lighter values for backgrounds and accents.
- `secondary[50..900]` — secondary brand/accent scale.
- `accent-01/02/03[50..900]` — supporting accents for illustrations, badges, or secondary actions.
- `neutral[50..900]` — grayscale scale for UI surfaces, borders, and disabled states.

Semantic tokens (examples)
- `bg` / `background` — use `background` (#FFFFFF) for page background.
- `surface` — use `surface` (#F5F5F5) for cards and panels.
- `text-default` — `text.default` (primary 900).
- `text-muted` — `text.muted` (neutral 400).
- `interactive` — `primary.500` for primary interactive elements.
- `muted-border` — `neutral.200` for low-contrast borders.

Status / Intent tokens
- `error[50..900]` — error states and backgrounds; `error.500` is primary error color.
- `danger[50..900]` — orange danger palette for warnings that require attention.
- `pending[50..900]` — yellow/pending states and banners.
- `success[50..900]` — green success states.
- `info[50..900]` — blue informative states.

Component-specific tokens (suggested)
- `btn-bg-primary` -> `primary.500`
- `btn-text-primary` -> `surface` or `white` depending on contrast
- `card-bg` -> `surface`
- `card-border` -> `neutral.200`
- `link` -> `primary.600`
- `badge-success-bg` -> `success.100`, `badge-success-text` -> `success.700`

Accessibility notes
- Always verify contrast ratios (WCAG 2.1 AA) for text on background colors. Prefer `primary.900` for large text and `primary.700` or darker for small text on light backgrounds.

Next steps
- Generate semantic token mapping for Tailwind (`--tw` tokens) and/or Style Dictionary outputs for platforms (web, iOS, Android).
- Define component token list (buttons, inputs, cards, badges) and produce a JSON mapping file.
