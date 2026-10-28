# Shared month-first parser reverses day-first dates

**379 distinct reports** from support ticket #4471; export through 4 October 2026.

The shared parser reads dates month first although these tenants write day first. A 7 April booking can become 4 July. Respect the input contract and tenant locale; validate ambiguous and unambiguous dates across app, email and booking-v2.

## Evidence and counting

- Tenant locale is looked up in src/lib/data/tenants; causeOf in src/lib/kb/causes.ts combines it with channel and booking form.
- 11 tenants, received 2026-04-01 through 2026-10-04.
- Intake tags: {"parser":356,"hint":23}. Tags and browser locale are not cause evidence.
- Export pagination repeats 15 IDs. Deduplicate by report ID before grouping: 379 parser + 33 hint = 412 distinct reports from 427 rows.
- Example R-41200, harbour.dental, app: “Our 7 April reminder went out on 4 July. Is this a joke. It is not April Fools where we are.”
- Full membership: evidence/report-partition.json (parser); reproduce with node scripts/analyze.mjs.

Five desk-noted anomalous reports remain included under the supplied classification rule: R-41202, R-41209, R-41236, R-41344, R-41620. Their bodies do not confirm this cause. Investigate original dates, timestamps and timezone configuration before changing their assignment; no timezone root cause is established.

## Verification needed

Reproduce with the affected tenant configuration and confirm that intended and observed dates match after the fix. Do not deduplicate by subject alone. Different subjects can share a cause; the same subject can cover different causes.

These are report counts in a static export, not the current live queue. Reports continued arriving after the July backlog merge. See the signed KB reassessment and its rendered page.
