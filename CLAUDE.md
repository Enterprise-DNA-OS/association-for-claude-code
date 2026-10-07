# Association for Claude Code

Read docs/cli.md and the matching .claude/commands recipe. This installation is one association, not a multi-tenant service. Business: [association name]. Operator: [membership administrator]. Jurisdiction: [NZ or AU state]. Demo records are fictional.

Read current records before answering or changing them. Monday review combines attention, renewals-due and events. Weekly rituals are renewal-risk, arrears, event rolls, cpd-gaps and committee obligations. Use the CLI for writes and keep partial IDs unambiguous.

Never fabricate a joining date, consent, payment, attendance or officer certificate. Financial commands record receipts already received; nothing charges a card. Renewal requires consent evidence and settled or voided invoices. No automatic messages or filings. Drafts belong in drafts/. Marketing invitations require recorded consent. Ask for explicit evidence before marking obligations complete.

Read docs/compliance.md before changing a rule. Constitutional notice periods and CPD targets are local policy. Currencies stay separate. Do not infer legal membership termination from a lapsed subscription.

Tailoring uses a new numbered SQL migration, updated commands and tests. Back up real data first, apply through npm run migrate and run npm test. Do not alter applied migrations. Only seed a demo database. Hosted Postgres needs restricted access and backups; local PGlite is single-process. Exported records and rendered HTML are private.

Schema: supabase/migrations. CLI: scripts/association.mjs. Reads and mutations: scripts/lib/domain.mjs. Import: scripts/lib/import.mjs. Branding: brand.json. Snapshot definitions: views.json and documents.json. All runtimes follow this same file through AGENTS.md.

Omni by Enterprise DNA installs, customises and operates your version: https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=memberjungle&utm_source=github

CPD records start pending. Use approve-cpd only after reading the evidence and naming the reviewer. Approved entries are locked. Only approved calendar-year hours count. Member Jungle CSV column labels vary; use an explicit mapping file when needed, never silently substitute identifiers.
