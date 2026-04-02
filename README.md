# Clientpedia — Internal Client Knowledgebase

Clientpedia is an internal, wiki-inspired knowledgebase that centralizes client knowledge, engagement history, and staffing opportunities across the firm.

## Quick Start (Development)

Prerequisites: Node.js 18+ and npm.

```bash
cd app
npm install
npm run dev
```

Open http://localhost:3000 to preview the app.

## Storybook (Component Explorer)

```bash
cd app
npm run storybook
```

Open http://localhost:6006 to browse components in isolation.

## Build & Production

```bash
cd app
npm run build
npm run start
```

## Project Layout

```
app/
  data/               — Sample/mock data (sampleClients.json)
  docs/               — Design reference (colors.md, typography.md)
  src/
    components/       — Shared React components (Button, Card, ProfileCard, StatusBadge, etc.)
    pages/            — Next.js pages (clients, consultants, leads, API routes)
    stories/          — Storybook stories co-located with source
    styles/           — Global CSS
  tokens/             — Design tokens (design-tokens.json)
templates/            — Process templates (client profile, opportunity, pilot checklist, etc.)
PRD-clientpedia.md    — Full product requirements document
```

---

## Consultant Flow

Purpose: allow internal consultants to discover upcoming roles and express interest in opportunities they want to pursue.

1. **Browse roles** — Consultants visit the `/consultants` view and filter open roles by client, skill tags, seniority, region, and expected start window.
2. **Evaluate a role** — Each role card shows the client, project type, required skills, estimated duration, expected start date, and opportunity owner.
3. **Bookmark** — Save a role to a personal watchlist; optionally receive a reminder as the start date approaches.
4. **Express interest** — Submit a short note and confirm availability. The system records a timestamped expression-of-interest and notifies the opportunity owner and staffing contact.
5. **Owner follow-up** — The opportunity owner reviews a shortlist of interested consultants (with match scores and availability), then marks candidates as shortlisted, requests more info, or schedules interviews. Activity is logged on the opportunity.

Key acceptance criteria:
- Consultants can filter, bookmark, and submit an expression-of-interest entirely within the UI.
- Opportunity owners receive a notification within 5 minutes of a new expression-of-interest.
- A full audit trail (consultant snapshot + timestamp) is kept for every action.

---

## Lead Flow

Purpose: give Engagement Leads and Sales a single view to manage client opportunities, track pipeline stage, and match available consultants to open roles.

1. **Select a client** — Choose a client from the sidebar to load their opportunity pipeline.
2. **View the pipeline** — Opportunities are listed with stage (Prospecting → Closed), expected start date, estimated duration, and estimated value.
3. **Add an opportunity** — Use the inline form to create a new opportunity with a title, stage, and estimated value. It is immediately appended to the client's pipeline.
4. **Filter consultants** — Use the skill and availability filters to narrow the consultant roster to candidates who fit the role requirements. Each consultant card shows skills, experience, location, and a match score.
5. **Assign a consultant** — Click "Assign" on a consultant card to designate them to an opportunity. The assignment is recorded and reflected in the opportunity activity log.
6. **Track progress** — Review the opportunity's shortlist, notes, and stage changes over time to manage the staffing pipeline through to placement.

---

## Contributing

Create a branch, make changes, and open a pull request. Keep component changes small and include a Storybook story when adding or modifying a component.
