# Clientpedia — Design System

This workspace contains the Clientpedia design system and examples used for local development and component preview.

## Quick Start (Development)

Prerequisites: Node.js (18+ recommended) and npm.

1. Install dependencies:

```bash
cd design-system
npm install
```

2. Run the dev server (Next.js):

```bash
npm run dev
```

Open your browser to http://localhost:3000 to preview the site.

## Storybook (Component Explorer)

From the `design-system` folder run:

```bash
npm run storybook
```

Then open http://localhost:6006 to view Storybook.

## Build & Production

From `design-system`:

```bash
npm run build
npm run start
```

## Project Layout

- `design-system/` — Next.js app, components, pages, and Storybook config.
- `design-system/src/components/` — React components (Button, Card, ProfileCard, etc.).
- `tokens/design-tokens.json` — Design tokens (colors, spacing, etc.).

## Contributing

Create a branch, add changes, and open a pull request. Keep component changes small and include Storybook examples when possible.

## Notes

- The dev server runs on port 3000 by default (see `design-system/package.json`).
- If you want, I can commit this `README.md` and push it to your GitHub remote — tell me to proceed.
