# Command reference

Run `npm run association -- <command>`. Human tables are default; --json returns structured results. Quote names containing spaces. Names are case-insensitive, IDs accept prefixes, and ambiguous matches list candidates and exit 1. ISO dates use YYYY-MM-DD. Empty command invokes help.

| Command | Arguments |
|---|---|
| members | No arguments |
| levels | No arguments |
| renewals-due | No arguments |
| attention | No arguments |
| arrears | No arguments |
| events | No arguments |
| registrations | No arguments |
| invoices | No arguments |
| payments | No arguments |
| donations | No arguments |
| cpd-gaps | No arguments |
| cpd | No arguments |
| engagement | No arguments |
| level-summary | No arguments |
| cash-summary | No arguments |
| donor-summary | No arguments |
| officers | No arguments |
| obligations | No arguments |
| activity | No arguments |
| audit | No arguments |
| consent-review | No arguments |
| renewal-risk | No arguments |
| member | member <name-or-id> |
| event | event <name-or-id> |
| compliance | No arguments |
| weekly-review | No arguments |
| add | add <type> '{"name":"..."}' |
| set | set <type> <name-or-id> '{"field":"value"}' |
| renew | renew <member> YYYY-MM-DD |
| register | register <member> <event> |
| check-in | check-in <registration> |
| cancel-registration | cancel-registration <registration> |
| payment | payment <invoice> <amount> <unique-reference> |
| log | log <member> "contact note" |
| draft-renewal | draft-renewal <member> |
| draft-invitation | draft-invitation <member> <event> |
| import | import memberjungle <file.csv> [--dry-run] [--date-order=DMY|MDY] |
| export | export <file.json> |
| help | No arguments |

## Write examples

```bash
npm run association -- add levels '{"name":"Student","annual_fee":60,"currency":"NZD","cpd_hours":0}'
npm run association -- add members '{"name":"Alex Smith","email":"alex@example.org","level_id":"Student","status":"pending"}'
npm run association -- add invoices '{"name":"DUES-010","member_id":"Alex Smith","amount":60,"currency":"NZD","due_on":"2027-02-01"}'
npm run association -- payment DUES-010 60 bank-reference-010
npm run association -- log "Alex Smith" "Confirmed application details"
npm run association -- set members "Alex Smith" '{"consent_on":"2027-01-20","consent_ref":"signed-form-010","joined_on":"2027-01-20"}'
npm run association -- renew "Alex Smith" 2028-02-01
```

The JSON examples use POSIX shell quoting. PowerShell accepts the same single-quoted JSON argument; Windows cmd.exe requires escaped inner double quotes. Node scripts and tests use portable filesystem paths and process calls.

## Required fields and types

- levels: name; annual_fee, currency and cpd_hours have defaults.
- members: name. level_id resolves a level; email, organisation, joining and renewal dates are optional. A missing date remains unknown.
- events: name, starts_on, capacity. Optional fee, currency, venue, status (open, closed, cancelled).
- invoices: name (unique), member_id, positive amount, due_on. Currency defaults NZD. Kind defaults dues. A void invoice remains in history. Invoices with receipts cannot change amount, currency, member or void status.
- donations: name, member_id, positive amount, purpose, reference (unique). Optional currency and received_on. Records a gift; creates no tax receipt or deductibility claim.
- cpd: name, member_id, completed_on, positive hours, evidence_ref.
- officers: name, role, appointed_on. Optional member_id, ends_on, consent_ref, eligibility_ref.
- obligations: name, jurisdiction, due_on, source_url. Optional notice_days, notice_sent_on, completed_on, evidence_ref. Source may be a public URL or a controlled constitution reference.

Allowed fields live in scripts/lib/fields.json. No direct arbitrary SQL or deletion command. Every CLI mutation is transactional and writes an audit record. Import has its own batch audit record.

## Calculations and workflows

- renew: Confirm the new renewal date from the operator. Requires membership consent evidence, a level and no outstanding non-void invoices. Does not generate an invoice or charge a card.
- register: A full event puts the member on its waitlist. Duplicate registrations fail. Cancellation releases a place; waitlist promotion is a reviewed custom workflow, not automatic.
- payment: Record only money already received. Amount uses the invoice currency. Overpayments and repeated references fail. No card processing or refunds.
- set: Read the record first. Allowed fields are in scripts/lib/fields.json. References accept unique names or partial IDs. Financial identity of an invoice with receipts cannot be changed. Do not use a status edit to imply payment or consent.
- add: Writable types: levels, members, events, invoices, donations, cpd, officers, obligations. Required fields are in docs/cli.md. Reference fields accept unique names or partial IDs.
- compliance: Read docs/compliance.md. Report each rule, record and evidence gap. NZ labels scope the NZ checks. Recorded constitutional deadlines must be verified for the association. This is a record check, not certification.
- weekly-review: Run attention, renewals-due and events, then write a Monday review with the next action and named record for each issue. The weekly-review command combines those three reads.
- import: Read docs/replace-memberjungle.md. Run a dry run, compare totals, then import. Never infer dates or join consent. Preserve the source file.
- export: Writes a consistent portable JSON snapshot of every domain record. Treat the result as private. It is not an automatic restore command.
- draft-renewal: Read the current member and invoice records. Save the draft path. Review dates and language before giving it to the operator. Never send.
- draft-invitation: Requires recorded marketing consent. Read the event and member first. Save the draft path. Never send.

Renewals due includes active and lapsed members due within 60 days, including overdue dates. Attention includes unpaid invoices, past renewals and missing or older-than-60-day contact dates. Unknown renewal dates need review on the member record. CPD counts approved calendar-year completions up to today; attendance counts attended events in the last 365 days. Member health counts unpaid invoices, never combines amounts across currencies. Cash and donation summaries keep currencies separate and report all recorded history. An empty result is not evidence of complete imported history.

Member detail includes raw source fields. Event detail includes its registration list. Check-in requires a registered place at a non-cancelled event that has started. Drafts write unique files in drafts/ and never send. Export writes every domain record as JSON.

## Documents and snapshots

`npm run docs` renders member statements, renewal letters, attendance rolls and committee notices. Optional document name and ID prefix filter the output. Each document filename uses the record ID to avoid collisions. `npm run view` renders membership-week and committee-review from views.json. Both use brand.json and write under OUTPUT_DIR when set. Protect output as personal data.

## CPD review

`cpd-review` lists pending submissions. `cpd-evidence` lists pending items without evidence. `cpd-categories` shows approved hours by category in the current calendar year. `approve-cpd "Ethics seminar" "Secretary"` requires an existing pending activity, a completion date no later than today, nonblank evidence and a named reviewer. Approved activities are locked against generic edits. Add a reviewed correction workflow before handling reversals; do not replace evidence silently.

`add cpd` accepts name, member_id, completed_on, hours, evidence_ref and category. New records remain pending. Only approved hours count towards cpd-gaps and renewal-risk. Read docs/compliance.md: category labels and annual targets are association policy, not professional certification. CPD statements show approved and pending work separately.

Member Jungle import supports `--mapping=column-map.json` for variable report headers. Read docs/replace-memberjungle.md. Extra columns are retained without claiming that separate histories were imported.
