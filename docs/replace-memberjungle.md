# Move from Member Jungle

Checked 7 October 2026. Member Jungle documents [Export Members to CSV](https://support.memberjungle.com/exporting-your-member-data) for demographics, a separate form-data export and [custom report exports](https://support.memberjungle.com/membership-custom-report). Select the members you need, export them and preserve the original file. Include inactive members deliberately if their history belongs in your new register.

## One import command

After installing and migrating a fresh database without the demo seed:

```bash
node scripts/association.mjs import memberjungle members.csv --date-order=DMY --dry-run
node scripts/association.mjs import memberjungle members.csv --date-order=DMY
```

The first command checks the file and rolls back all changes. The second imports the same file. Review member counts, sample expiry dates and level names before using the records. Importing again updates on the exact source member identifier, without creating duplicates.

The vendor help page does not publish a fixed export header specification. The included fixture is a synthetic example of supported columns, not a captured customer export. If your column labels differ, supply `--mapping=column-map.json` to map canonical names to your actual export labels, for example `{"Member Number":"Membership No.","First Name":"Given Name"}`. Unknown mapped columns fail before changes are made. No email matching: family members can share an address.

| Supported columns | Destination |
|---|---|
| Member Number, Membership Number, Member ID, Username or User ID | Stable external identifier, stored as text with leading zeros |
| First Name / Firstname and Last Name / Surname | Display name |
| Organisation / Organization / Company | Organisation and fallback display name |
| Email / Email Address | Email, not a consent claim |
| Membership Level / Member Level | Level name. Imported levels start with zero fee and zero learning target pending operator configuration. |
| Membership Status / Status | Active, pending, expired/lapsed, inactive/suspended or archived. Unknown values fail. Missing status becomes contact. |
| Join Date / Date Joined / Member since | Joining date when supplied |
| Expiry Date / Membership Expiry Date / Renewal due | Renewal date when supplied |
| Marketing Consent | Only an explicitly mapped affirmative consent field sets permission. Do not map newsletter subscription to consent. |
| All original columns including card numbers | source_data, preserved as text |

Dates accept YYYY-MM-DD or an explicit DMY/MDY choice for slash/dot dates. Impossible dates, duplicate identifiers, duplicate headers and malformed CSV fail atomically. Files with several memberships per person need reviewed mapping before import: duplicate identifiers fail rather than silently overwriting a second membership. Demographic-only exports leave missing membership dates and status unknown. Reimports replace imported fields, so use an export with the same field coverage and review the dry run.

## Records to map separately

Membership forms, family and corporate links, event bookings, CPD activities, certificates, balances, receipts, store orders and attachment files are not imported by this member command. Original extra columns are preserved, not treated as operational history. Member Jungle [documents CPD CSV audit reports](https://support.memberjungle.com/cpd-module); export those separately and agree the categories, review evidence and reporting period before loading them. Passwords, app access, website pages, payment tokens and automatic messages are not transferred.

Membership consent is not inferred from an imported active status. Add the real consent date and reference after checking evidence. Set actual fees, currency and annual CPD targets, reconcile dues separately, and test a renewal, draft, event roll and CPD statement. Keep Member Jungle until the committee has checked the new records and any required member-facing services are ready. Enterprise DNA maps history and builds the member portal or provider connections into your custom version.
