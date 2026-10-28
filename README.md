# S01E03 · what it shows

Reassessment of the course support desk's #4471. The original KB export is preserved in `support-kb/`; this repository adds a signed reassessment and a reproducible rendering setup.

- [Signed source page](support-kb/src/routes/kb/incidents/4471-reassessment/+page.svx)
- [Standalone rendered page](rendered/4471-reassessment.html) (download and open directly; frozen desk view)
- [Interactive rendered site](rendered/kb/incidents/4471-reassessment/index.html) (serve the complete `rendered` directory)
- [Report partition](evidence/report-partition.json)
- [Parser issue draft](drafts/parser-issue.md)
- [Hint issue draft](drafts/hint-issue.md)

Published issues: [parser #1](https://github.com/chillinPanda/mega-dev-challenge-s01e03-what-it-shows/issues/1), [hint #2](https://github.com/chillinPanda/mega-dev-challenge-s01e03-what-it-shows/issues/2).

## Reproduce

Requires Node 24 (native TypeScript imports are used for the analysis).

```sh
node scripts/analyze.mjs
cd support-kb
npm ci
npm run build
cd ..
cp -R support-kb/build/. rendered/
node scripts/snapshot.mjs
```

The static site is generated under `support-kb/build`. The repository's `rendered/` directory holds a checked copy. To serve it:

```sh
python3 -m http.server 2323 --bind 0.0.0.0 --directory rendered
```

Open `/kb/incidents/4471-reassessment/`. Counts are computed by the original KB functions from 427 export rows: 412 unique report IDs, classified as 379 parser and 33 hint. Five anomalous bodies are explicitly retained and flagged for investigation. No third root cause is asserted.

The original accepted decision 0001 is unchanged. The new page proposes a replacement rule and marks owner acceptance as pending.
