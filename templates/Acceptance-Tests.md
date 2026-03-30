## Acceptance Tests — Clientpedia (Pilot)

List of testable acceptance criteria and test cases for pilot.

1) Client profile creation
- Test: create a client profile with required fields. Verify it displays and is searchable.
- Expected: profile appears in search and client page shows contacts and engagements.

2) Opportunity CRUD
- Test: create opportunity and role entries, link to client. Edit stage and verify history.
- Expected: changes saved, history shows edits, linked documents accessible.

3) Consultant flow
- Test: consultant filters roles, bookmarks one, submits expression-of-interest. Owner receives notification.
- Expected: bookmark saved, EoI recorded (timestamp + profile snapshot), owner notification received within 5 minutes.

4) Import validation
- Test: bulk import clients and contacts via CSV with one intentional error.
- Expected: import fails for erroneous rows with helpful error; valid rows imported.

5) RBAC & restricted profiles
- Test: user without permission attempts to view restricted client. Verify access denied and audit log entry.

6) Search relevance
- Test: run 20 representative queries; measure percent with correct result in top 3.
- Expected: >= 80% for pilot.

7) CRM sync sanity
- Test: update owner in CRM and verify sync updates Clientpedia owner according to conflict rules.
