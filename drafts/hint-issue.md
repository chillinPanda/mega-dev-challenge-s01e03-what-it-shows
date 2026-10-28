# booking-v3 date hint disagrees with day-first input interpretation

**33 distinct reports** from support ticket #4471; export through 4 October 2026.

booking-v3 prints MM/DD/YYYY but interprets input according to the tenant’s day-first locale. Users who follow the hint get month and day reversed. Align the displayed format and input interpretation for Alder Physio (de-DE), Copper Studio (es-ES), and Pale Harbour (pt-PT). A shared-parser fix alone does not repair the hint.

## Evidence and counting

- Tenant locale is looked up in src/lib/data/tenants; causeOf in src/lib/kb/causes.ts combines it with channel and booking form.
- 3 tenants, received 2026-04-17 through 2026-09-22.
- Intake tags: {"parser":15,"hint":18}. Tags and browser locale are not cause evidence.
- Export pagination repeats 15 IDs. Deduplicate by report ID before grouping: 379 parser + 33 hint = 412 distinct reports from 427 rows.
- Example R-41230, copper.studio, form: “My client came on 1 June instead of 6 January. We sorted it out.”
- Full membership: evidence/report-partition.json (hint); reproduce with node scripts/analyze.mjs.

## Verification needed

Reproduce with the affected tenant configuration and confirm that intended and observed dates match after the fix. Do not deduplicate by subject alone. Different subjects can share a cause; the same subject can cover different causes.

These are report counts in a static export, not the current live queue. Reports continued arriving after the July backlog merge. See the signed KB reassessment and its rendered page.
