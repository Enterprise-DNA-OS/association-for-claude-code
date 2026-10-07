---
description: Membership export workflow
---
# export

Read CLAUDE.md. Run:

```bash
npm run association -- export <file.json>
```

Writes a consistent portable JSON snapshot of every domain record. Treat the result as private. It is not an automatic restore command.

Use --json when composing analysis. Ambiguous names list candidates and exit 1; resolve the candidate before continuing. Drafts never send.
