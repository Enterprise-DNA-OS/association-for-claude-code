---
description: Membership payment workflow
---
# payment

Read CLAUDE.md. Run:

```bash
npm run association -- payment <invoice> <amount> <unique-reference>
```

Record only money already received. Amount uses the invoice currency. Overpayments and repeated references fail. No card processing or refunds.

Use --json when composing analysis. Ambiguous names list candidates and exit 1; resolve the candidate before continuing. Drafts never send.
