---
description: Membership set workflow
---
# set

Read CLAUDE.md. Run:

```bash
npm run association -- set <type> <name-or-id> '{"field":"value"}'
```

Read the record first. Allowed fields are in scripts/lib/fields.json. References accept unique names or partial IDs. Financial identity of an invoice with receipts cannot be changed. Do not use a status edit to imply payment or consent.

Use --json when composing analysis. Ambiguous names list candidates and exit 1; resolve the candidate before continuing. Drafts never send.
