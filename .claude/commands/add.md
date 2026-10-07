---
description: Membership add workflow
---
# add

Read CLAUDE.md. Run:

```bash
npm run association -- add <type> '{"name":"..."}'
```

Writable types: levels, members, events, invoices, donations, cpd, officers, obligations. Required fields are in docs/cli.md. Reference fields accept unique names or partial IDs.

Use --json when composing analysis. Ambiguous names list candidates and exit 1; resolve the candidate before continuing. Drafts never send.
