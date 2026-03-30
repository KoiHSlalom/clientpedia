Clientpedia design-system — local dev

Quick start

1. From the `design-system` folder install dependencies:

```bash
cd design-system
npm install
```

2. Run the Next.js example app (serves pages under `src/pages`):

```bash
npm run dev
```

3. Open http://localhost:3000 (will redirect to `/clients`).

Storybook

```bash
npm run storybook
```

Notes

- This is a minimal starter. Install exact package versions you prefer and run `npm install` before starting.
Design System Starter — Clientpedia

This folder contains a lightweight starter scaffold for a design system using Tailwind CSS and shadcn-style components (Radix-ready primitives). It includes 3 example components and Storybook stories.

How to use

1. From this folder, install dependencies:

```bash
npm install
# or
yarn
```

2. Run Storybook for component development:

```bash
npx storybook dev -p 6006
```

3. Integrate components into your app by importing from `src/components`.

Notes
- This scaffold is minimal and intended as a starting point. Replace/extend with `shadcn` or Radix primitives as you adopt them.
