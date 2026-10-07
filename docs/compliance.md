# Membership and governance record checks

NZ record, officer and meeting sources checked 7 October 2026. These are evidence checks for an operator, not a legal opinion or certification. The demo is a fictional NZ society under the 2022 Act. Set your own jurisdiction and constitutional deadlines before using real records. The CLI does not decide eligibility, lodge returns or send notices.

| Check | What it flags | Source and scope |
|---|---|---|
| MEMBER-CONSENT | Active members without both a consent date and reference | [NZ records guidance](https://www.is-register.companiesoffice.govt.nz/help-centre/running-your-incorporated-society/records-you-should-keep/). Membership consent is separate from marketing permission. |
| REGISTER-DETAILS | Missing joining date or email | Same guidance. Email is this base's chosen contact channel; another valid contact method needs a field and rule change. A lapsed subscription does not itself establish the legal date membership ended. |
| OFFICER-EVIDENCE | Current officer missing consent or eligibility certificate reference | [NZ committees and officers](https://www.is-register.companiesoffice.govt.nz/help-centre/running-your-incorporated-society/committees-and-officers/). The operator checks age and disqualification; the software checks evidence references only. |
| DUE-RECORD | Incomplete obligation past its recorded due date | [NZ annual filings](https://is-register.companiesoffice.govt.nz/help-centre/meeting-your-annual-filing-requirements/filing-annual-financial-statements-and-annual-returns/): filings are due within six months of balance date. Enter the actual due date after reviewing the applicable rules. |
| NOTICE-RECORD | Notice missing when due or recorded after the required notice date | [NZ meetings guidance](https://www.is-register.companiesoffice.govt.nz/help-centre/running-your-incorporated-society/holding-meetings/). The constitution supplies notice days. The demo's 14 days is fictional policy, not a universal statutory period. |
| COMPLETION-EVIDENCE | Completed obligation without a reference | Local record policy. Evidence must identify the actual notice, minutes or filing acknowledgement. |

NZ-specific checks appear with NZ labels. Australian associations must adapt these evidence checks to their state or territory and constitution; they are not represented as a national association compliance package. For ACNC-registered charities, [ACNC due dates](https://www.acnc.gov.au/for-charities/annual-information-statement/annual-information-statement-due-dates) generally use six months after the reporting period, with published extensions. Check the current published deadline before recording an obligation. No automatic calculation overrides an extension.

CPD targets are association policy and use the calendar year. They are not statutory professional certification. Configure a different reporting year before relying on that calculation. Consent references are pointers, not uploaded evidence files. Keep evidence in your controlled document store.

The base has no member login, application authorisation layer or tenant isolation. Use a restricted database role, protected host and tested backups for shared operation. Local PGlite supports one process at a time. Export files contain personal records and require the same access controls as the database.

## CPD evidence policy

CPD-EVIDENCE flags pending learning with an empty evidence reference. Approval requires a completed activity, an evidence pointer and a reviewer. These are explicit local record policies. They do not assert a universal legal learning requirement. Member Jungle's [CPD help](https://support.memberjungle.com/cpd-module), read 7 October 2026, documents categories, points or hours, member records and audit reports. This base uses hours and a calendar year, with only approved learning counted. An association using points, another year or category minima must configure those rules before import.
