---
description: Membership renew workflow
---
# renew

Read CLAUDE.md. Run:

```bash
npm run association -- renew <member> YYYY-MM-DD
```

Confirm the new renewal date from the operator. Requires membership consent evidence, a level and no outstanding non-void invoices. Does not generate an invoice or charge a card.

Use --json when composing analysis. Ambiguous names list candidates and exit 1; resolve the candidate before continuing. Drafts never send.
