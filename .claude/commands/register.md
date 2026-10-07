---
description: Membership register workflow
---
# register

Read CLAUDE.md. Run:

```bash
npm run association -- register <member> <event>
```

A full event puts the member on its waitlist. Duplicate registrations fail. Cancellation releases a place; waitlist promotion is a reviewed custom workflow, not automatic.

Use --json when composing analysis. Ambiguous names list candidates and exit 1; resolve the candidate before continuing. Drafts never send.
