# Association for Claude Code

Your members, renewals, events, receipts and committee records in a database you own. Free MIT-licensed software for association administrators. Works with Claude Code, Codex, OpenCode or Cursor.

| Do it yourself | We customise it | We run it for you |
|---|---|---|
| Free. Clone, run the demo, import members. | Your fields, rules, Member Jungle data, web front end or different stack. | Installed, connected and operated through Omni by Enterprise DNA. Setup fee, then retainer. |
| [Quick start](#quick-start) | [Get your version built](https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=memberjungle&utm_source=github&utm_medium=customise) | [Book a call](https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=memberjungle&utm_source=github&utm_medium=managed) |

## What the membership team does each week

Chase renewals, reconcile recorded dues, check event numbers, review learning records and prepare committee paperwork. The fictional Harbour Professional Association includes an overdue renewal with a partial receipt, a quiet member missing joining consent, a lapsed subscription, an upcoming event and an officer missing eligibility evidence. Seed dates move with the first demo run; reseeding does not reset records.

## Quick start

Node 20 or later on Windows or Linux:

```bash
git clone https://github.com/Enterprise-DNA-OS/association-for-claude-code.git
cd association-for-claude-code
npm install
npm run demo
npm test
npm run view
npm run docs
```

PGlite stores local records under .data/db without a database server. Set DATABASE_URL for hosted Postgres; TLS verification is enabled. Real imports belong in a fresh DATA_DIR after npm run migrate, without demo seed data. The installation serves one association. Shared operation needs restricted database access, host security and backups. Local PGlite is single-process.

Open the folder in your coding agent and ask: "Which renewals need attention?" AGENTS.md routes every runtime to CLAUDE.md and the same .claude/commands recipes.

## Commands

43 executable commands, including help, and 44 recurring slash recipes including customise and new-view:

- /members
- /levels
- /renewals-due
- /attention
- /arrears
- /events
- /registrations
- /invoices
- /payments
- /donations
- /cpd-review
- /cpd-categories
- /cpd-evidence
- /approve-cpd
- /cpd-gaps
- /cpd
- /engagement
- /level-summary
- /cash-summary
- /donor-summary
- /officers
- /obligations
- /activity
- /audit
- /consent-review
- /renewal-risk
- /member
- /event
- /compliance
- /weekly-review
- /add
- /set
- /renew
- /register
- /check-in
- /cancel-registration
- /payment
- /log
- /draft-renewal
- /draft-invitation
- /import
- /export
- /customise
- /new-view

See [the CLI guide](docs/cli.md) for arguments, fields and calculations. Human tables and --json are supported. Partial IDs and case-insensitive names work; ambiguous matches list candidates and exit 1. Payments only record receipts already received, and nothing sends or charges a card.

## Ten questions beyond a fixed dashboard

These are working queries you can change. Member Jungle also supports reporting and exports; this list makes no unsupported claim that it cannot answer them.

- Which renewals combine unpaid dues, no attendance and a learning gap? `renewal-risk`
- Which members have gone quiet for more than two months? `attention`
- Whose invoice is overdue after partial receipts? `arrears`
- Which upcoming events have a waiting list? `events`
- Which active members have no recorded attendance in the past year? `engagement`
- Who is below our calendar-year approved learning target? `cpd-gaps`
- Which active members lack joining consent evidence? `consent-review`
- Which committee records have missing certificates or late notices? `compliance`
- What have we actually received, separated by currency? `cash-summary`
- Which learning activities still need supporting evidence? `cpd-evidence`

## Your first hour: ten things to ask for

1. Put our association name, logo and colours on the statements.
2. Test an import of our Member Jungle member export.
3. Set our actual level fees and currencies.
4. Show overdue renewals with unpaid invoices.
5. Draft a renewal note for a named member.
6. Show members who have not attended an event this year.
7. Record our constitution's meeting notice period.
8. Add our branch as a field through a new migration.
9. Show missing officer consent and eligibility evidence.
10. Add a read-only view for our committee's Monday meeting.

## Documents, evidence and moving across

Change brand.json once. Documents render as draft branded HTML under docs-out/: member statements, renewal letters, event rolls, CPD evidence statements and committee notices. Read-only views render under views/. No web application or message delivery is included. Protect all rendered files as personal data.

[Compliance checks](docs/compliance.md) cite NZ society guidance and distinguish constitutional policy from legal rules. AU obligations use explicitly recorded local deadlines, including ACNC extensions where applicable. A clean record check does not certify compliance.

[Moving from Member Jungle](docs/replace-memberjungle.md) covers the one-command member CSV import with explicit column mapping when report labels differ, explicit date order, repeat imports and preserved original columns. Event histories, CPD, invoices, gifts, family links and attachments require separate mapping. Importing a member is not evidence of join consent.

[Why no front end](docs/why-no-front-end.md) explains self-service, mobile, offline, website and provider connections. Enterprise DNA builds those into a custom version. The base is an administrator's membership database. Member login, mobile access and provider connections are custom work.

## Verification

Tests use a temporary database and cover all commands, partial receipts, overpayments, duplicate references, capacity, waitlisting, consent, date validation, ambiguous names, import idempotence and rollback, drafts, exports and HTML. The suite validates shared SQL through PGlite and supports a disposable Postgres database through TEST_DATABASE_URL. CI runs Windows, Linux and Postgres. Installation-specific access and backup checks remain necessary.

MIT licence. Not affiliated with Member Jungle or Anthropic. Hosting and agent usage have separate costs. [Book 30 minutes with Sam](https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=memberjungle&utm_source=github&utm_medium=readme).

## Provenance

The membership domain builds on Enterprise DNA's MIT-licensed membership-for-claude-code project. This version adds Member Jungle export mapping, CPD review, approved-hour summaries and evidence statements. Shared scaffold components come from the Command Centre rebuild template.
