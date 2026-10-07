---
description: Membership weekly-review workflow
---
# weekly-review

Read CLAUDE.md. Run:

```bash
npm run association -- weekly-review
```

Run attention, renewals-due and events, then write a Monday review with the next action and named record for each issue. The weekly-review command combines those three reads.

Use --json when composing analysis. Ambiguous names list candidates and exit 1; resolve the candidate before continuing. Drafts never send.
