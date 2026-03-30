# Clientpedia — Internal Client Knowledgebase (PRD)

## Overview

Clientpedia is an internal, wiki-inspired knowledgebase to store, organize, and surface institutional knowledge about clients we've worked with (past and present). It centralizes engagement history, contacts, delivery artifacts, playbooks, relationship notes, and relevant metadata to speed onboarding, reduce context loss, and enable better client-facing decisions.

## Goals

- Centralize client information in a searchable, structured repository.
- Make client context discoverable to any employee with need-to-know access.
- Preserve engagement history, lessons learned, and reusable assets.
- Enable analytics on client coverage, services, and outcomes.

## Success metrics

- Time-to-context: reduce new-engage onboarding time by X% (baseline to be measured).
- Search success rate: % of queries returning a relevant client document within first 3 results.
- Adoption: % of client-facing staff with active use in first 6 months.
- Coverage: % of accounts with baseline profile (contacts, engagements, artifacts).

## Stakeholders

- Product Owner: Client Knowledge Program Lead
- Primary Users: Engagement Leads, Sales, Delivery Managers, Practice Leads
- Secondary Users: People Ops, Recruiting, Finance, Executive Leadership
- Engineers & Data: Platform and Data teams
- Market / Regional Team: local go-to-market and delivery leads responsible for regional constraints, compliance, and local client relationships.

## Target Users & Personas

- Engagement Lead: needs quick history, contacts, and contractual constraints.
- Sales Rep: needs pitch history, success stories, and key contacts.
- New Hire: needs onboarding notes, org structure, and past engagements.
 - Consultant: individual contributors and consultants looking for new projects; need role listings, required skills, estimated duration, expected start dates, ability to bookmark/apply, and visibility into who owns the opportunity.

## Key Use Cases

- Lookup client summary and quick contacts prior to a meeting.
- Find past deliverables, templates, and playbooks used for a client.
- Record and surface postmortems / lessons learned from engagements.
- Tag and filter clients by industry, services, technologies, and outcomes.
- Export or share client profile snippets with permission controls.
 - Discover upcoming opportunities and pipeline details for the client (project type, roles needed, estimated duration, expected start date, and owner).
 - Allow consultants to browse open roles and submit interest or bookmark roles for staffing.

## Functional Requirements

1. Client Profiles
   - Structured fields: name, logo, industry, HQ, size, parent/affiliates, active status.
   - Contacts list with role, email, phone, and last touch-date.
   - Engagement history list (projects, dates, summary, outcomes, owners).

2. Documents & Artifacts
   - Upload and link deliverables (PDF, PPT, doc) with versioning.
   - Rich-text wiki pages for narrative notes, playbooks, and lessons learned.

3. Metadata & Taxonomy
   - Tags for services (e.g., Cloud, Analytics), technologies, sectors, regions.
   - Custom fields for finance codes, MSA status, NDAs, security classification.

4. Search & Discovery
   - Full-text search across pages and document content (attachments indexed).
   - Faceted filtering (industry, tags, status, owner).
   - Relevance ranking that boosts recent and frequently accessed pages.

5. Access Control & Auditing
   - Role-based access control with per-profile and per-document permissions.
   - Audit logs for viewing, editing, and downloads.

6. Integrations
   - CRM sync (e.g., Salesforce) for canonical account and contact data.
   - SSO / SAML for authentication and group-based access.
   - Optional Slack/Microsoft Teams notifications for updates.

7. Import & Migration
   - CSV/JSON import for bulk accounts and contacts.
   - Document import with metadata mapping.

8. Admin & Governance
   - Admin UI for taxonomy management, user roles, and retention policies.
   - Retention and archival settings for closed accounts.

9. Opportunities & Pipeline
   - Surface upcoming opportunities associated with the client: project type, role types needed, estimated duration, expected start date, stage, estimated value, and owner.
   - Link opportunities to CRM records and allow bi-directional sync for status and field updates.
   - Allow per-opportunity role definitions (skill tags, seniority, headcount, allocation) to aid staffing and resource planning.
   - Enable alerts and saved filters for opportunity lifecycle events (new, moved-to-stage, approaching start date).
   - Provide a consultant-facing view: browseable role listings, filtering by skills/seniority/location, bookmark/apply actions, and a simple expression-of-interest flow that notifies the opportunity owner.
   - Support availability/calendar linking on consultant profiles so owners can quickly assess fit and scheduling.
   - Optional role-matching service: score internal consultants against role requirements, surface high-fit profiles to opportunity owners.

## Non-Functional Requirements

- Availability: 99.9% SLA for read access.
- Performance: search results returned under 300ms for standard queries.
- Scalability: support up to N accounts and M documents (define after pilot).
- Security: encryption at rest and in transit; enterprise compliance controls.

- Localization & Regional Compliance: support localized language, time zones, data residency rules, and regulatory requirements per market; enable market-level visibility and controls.

## Data Model (high-level)

- Client
  - id, name, status, industry, description, tags, owners
- Contact
  - id, client_id, name, role, email, phone, last_touch
- Engagement
  - id, client_id, title, start_date, end_date, summary, outcomes, owners
- Document
  - id, client_id, title, type, uploaded_by, created_at, version, storage_location

See Appendix for sample schema snippet.

- Opportunity
   - id, client_id, title, type, roles_needed, estimated_duration_days, expected_start, stage, estimated_value, owner, linked_crm_id, linked_documents

## UX / UI

- Home dashboard: recent clients, saved searches, and trending pages.
- Client profile page: summary card, contacts, engagements timeline, documents, related tags.
- Quick actions: add note, upload artifact, link to opportunity (CRM).
- Mobile-responsive view for lightweight lookups.

## Permissions & Governance

- Default visibility: internal (company-wide) unless marked restricted.
- Restricted profiles require explicit group membership and additional NDA checks.
- Edit trails and ability to revert page versions.

## Privacy & Security Considerations

- PII minimization: prefer business emails; redact sensitive personal data where required.
- Data residency controls configurable per-tenant if needed.
- Regular access reviews and automated stale-content alerts.

## Analytics & Reporting

- Dashboard for coverage (accounts with profiles), activity (edits/uploads), and search trends.
- Exportable reports for leadership (e.g., top clients by number of engagements, content gaps).

## Implementation Roadmap (high level)

Phase 0 — Discovery (2–4 weeks)
- Stakeholder interviews, taxonomy definition, and pilot account selection.

Phase 1 — MVP (8–12 weeks)
- Core client profiles, contacts, engagements, uploadable documents, basic search, SSO.

Phase 2 — Enhancements (8–12 weeks)
- Advanced search indexing, CRM sync, RBAC, audit logging, analytics dashboard.

Phase 3 — Scale & polish (ongoing)
- Bulk import tooling, retention policies, mobile improvements, additional integrations.

## Pilot Scope

- Pilot clients: select 3–5 representative clients across two industries and two regions (e.g., Retail US, Financial Services UK, Healthcare AU). Choose a mix of active and recently-closed engagements.
- Pilot deliverables: basic client profiles, contacts, 1–2 engagements per client, 3–5 opportunities, and 5–10 documents/playbooks.
- Success KPIs for pilot:
  - Profile coverage: >= 90% of pilot clients have baseline profiles.
  - Search relevance: 80% of pilot search queries return a relevant result in top 3.
  - Consultant engagement: >= 30% of internal consultants view or express interest in at least one opportunity.
  - Sync integrity: CRM sync conflicts resolved with documented rules.
- Pilot duration: 8 weeks (4 weeks setup + 4 weeks validation and adjustments).
- Pilot owners: Product Owner + 1 Market Lead + 1 Platform Engineer + 1 People Ops/staffing contact.

## Consultant Flow (detailed)

Purpose: enable internal consultants to discover, evaluate, and express interest in upcoming roles on client opportunities while providing opportunity owners with a lightweight staffing pipeline.

1) Consultant profile requirements
   - Visible fields: name, primary skills (tags), seniority, location/timezone, availability window, hourly/day rate or grade, resume link, internal manager, calendar availability (optional).

2) Browse & discovery
   - Consultants access a `Roles` view filtered by client, skill tags, region, seniority, and start window.
   - Each role/opportunity card shows title, client, expected start, duration, roles needed, stage, owner, and a short description.

3) Bookmark / Express interest
   - Bookmark: saves role to consultant's watchlist and optionally sends reminder before start.
   - Express interest: consultant submits a short note and selects availability; an automated notification is sent to the opportunity owner and the staffing contact.
   - The system records timestamped expression-of-interest with consultant profile snapshot for audit.

4) Owner review & next steps
   - Opportunity owner receives a notification (email/Slack) with a link to a shortlist view showing all interested consultants with match scores and availability.
   - Owner can mark candidates as shortlisted, request further info, or schedule interviews. These actions update the opportunity activity log.

5) Matching & scoring (optional MVP)
   - Compute a simple match score based on skill tag overlap, seniority match, and availability overlap. Display score to owners; owners remain the source of truth.

6) Audit, reporting & metrics
   - Track metrics: number of expressions-of-interest, time-to-fill, shortlist rate, and conversion to placement.
   - Maintain audit log for all consultant actions (bookmark, express interest, withdraw interest).

7) Acceptance criteria for consultant flow
   - Consultants can view and filter roles, bookmark, and submit an expression-of-interest within the UI.
   - Opportunity owners receive notifications for new expressions-of-interest within 5 minutes.
   - Audit logs show a complete trace for each expression-of-interest with consultant snapshot and timestamp.

8) Data & integration notes
   - Link consultant profiles to HR/People systems where possible to sync employment status and manager.
   - Respect privacy and PII policies: consultant visibility may be limited for certain client-restricted opportunities.


## Risks & Mitigations

- Risk: Low adoption — Mitigation: embed into onboarding, provide templates, make CRM sync automatic.
- Risk: Sensitive data leakage — Mitigation: strict RBAC, review processes, DLP integration.

## Acceptance Criteria

- Users can create and view a client profile with contacts and at least one engagement.
- Full-text search returns documents that contain the query within 3 ranked results for test queries.
- Admin can set a tag and have it appear in the faceted filter.

## Appendix — Example schema (JSON sketch)

```json
{
  "client": {"id": "C123", "name": "Acme Corp", "industry": "Retail", "tags": ["Cloud","Analytics"]},
  "contacts": [{"id":"P1","name":"Jane Doe","role":"CIO","email":"jane@acme.com"}],
  "engagements": [{"id":"E1","title":"Cloud Migration","start":"2024-01-01","end":"2024-06-01","outcome":"Reduced infra costs"}]
}
```

---

If you'd like, I can (a) convert this into a template with checklist items per phase, (b) generate UI mockups, or (c) produce a CSV template for imports.
