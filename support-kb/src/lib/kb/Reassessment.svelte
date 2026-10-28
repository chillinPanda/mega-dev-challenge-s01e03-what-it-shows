<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const all = reports as Report[];
  const merged = uniqueById(all).filter(r => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const mismatch = groups.reduce((n,g) => n + g.reports.filter(r=>r.meta.intakeTag !== g.cause).length,0);
  const unusual = merged.filter(r=>notes.oneDayMove.includes(r.id));
  const months = [...new Set(merged.map(r=>r.receivedAt.slice(0,7)))].sort();
  const julyBatch = merged.filter(r=>r.mergedAt?.startsWith('2026-07-02'));
  const backlog = julyBatch.filter(r=>r.receivedAt.slice(0,10) < '2026-07-02');
</script>

<p><strong>{all.length}</strong> export rows − <strong>{all.length - uniqueById(all).length}</strong> repeated IDs = <strong>{merged.length}</strong> distinct reports in #4471. Each ID counts once.</p>
<p><strong>{mismatch}</strong> intake tags disagree with the tenant-based classification. Browser locale and intake tags are not the cause.</p>
<table>
  <caption>Distinct reports received by month</caption>
  <thead><tr><th>Month</th><th>Received</th></tr></thead>
  <tbody>{#each months as month}<tr><td>{month}</td><td>{merged.filter(r=>r.receivedAt.startsWith(month)).length}</td></tr>{/each}</tbody>
</table>
<p>On 2 July, <strong>{julyBatch.length}</strong> reports were merged; <strong>{backlog.length}</strong> had arrived earlier. The merge spike is a backlog operation, not an arrival spike or proof of a fix.</p>
<details open>
  <summary>{unusual.length} reports need follow-up before claiming a third cause</summary>
  <p>These remain in the parser count under the supplied rule. Their bodies describe one-day shifts or timing anomalies. Do not present a timezone cause as established.</p>
  <ul>{#each unusual as r}<li><code>{r.id}</code> · {r.tenant} · {r.channel}: {r.body}</li>{/each}</ul>
</details>
