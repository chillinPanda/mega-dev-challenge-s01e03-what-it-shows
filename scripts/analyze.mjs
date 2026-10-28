import fs from 'node:fs';
import {uniqueById,groupByCause} from '../support-kb/src/lib/kb/causes.ts';
const root = 'support-kb/src/lib/data/';
const raw = JSON.parse(fs.readFileSync(root+'reports-4471.json'));
const tenants = fs.readdirSync(root+'tenants').map(f=>JSON.parse(fs.readFileSync(root+'tenants/'+f)));
const rs = uniqueById(raw).filter(r=>r.mergedInto===4471);
const groups = groupByCause(rs,r=>tenants.find(t=>t.handle===r.tenant));
const result = {sourceRows:raw.length,uniqueReports:rs.length,duplicateRows:raw.length-uniqueById(raw).length,groups:groups.map(g=>({...g,reports:g.reports.map(r=>r.id)})),oneDayMove:JSON.parse(fs.readFileSync(root+'desk-notes.json')).oneDayMove};
fs.writeFileSync('evidence/report-partition.json',JSON.stringify(result,null,2)+'\n');
for(const g of groups){
 const title=g.cause==='parser'?'Shared month-first parser reverses day-first dates':'booking-v3 date hint disagrees with day-first input interpretation';
 const explanation=g.cause==='parser'?'The shared parser reads dates month first although these tenants write day first. A 7 April booking can become 4 July. Respect the input contract and tenant locale; validate ambiguous and unambiguous dates across app, email and booking-v2.':'booking-v3 prints MM/DD/YYYY but interprets input according to the tenant’s day-first locale. Users who follow the hint get month and day reversed. Align the displayed format and input interpretation for Alder Physio (de-DE), Copper Studio (es-ES), and Pale Harbour (pt-PT). A shared-parser fix alone does not repair the hint.';
 const example=g.reports.find(r=>!result.oneDayMove.includes(r.id));
 const body=`# ${title}\n\n**${g.reports.length} distinct reports** from support ticket #4471; export through 4 October 2026.\n\n${explanation}\n\n## Evidence and counting\n\n- Tenant locale is looked up in src/lib/data/tenants; causeOf in src/lib/kb/causes.ts combines it with channel and booking form.\n- ${g.tenants} tenants, received ${g.firstSeen} through ${g.lastSeen}.\n- Intake tags: ${JSON.stringify(g.taggedAs)}. Tags and browser locale are not cause evidence.\n- Export pagination repeats 15 IDs. Deduplicate by report ID before grouping: 379 parser + 33 hint = 412 distinct reports from 427 rows.\n- Example ${example.id}, ${example.tenant}, ${example.channel}: “${example.body}”\n- Full membership: evidence/report-partition.json (${g.cause}); reproduce with node scripts/analyze.mjs.\n\n${g.cause==='parser'?'Five desk-noted anomalous reports remain included under the supplied classification rule: '+result.oneDayMove.join(', ')+'. Their bodies do not confirm this cause. Investigate original dates, timestamps and timezone configuration before changing their assignment; no timezone root cause is established.\n\n':''}## Verification needed\n\nReproduce with the affected tenant configuration and confirm that intended and observed dates match after the fix. Do not deduplicate by subject alone. Different subjects can share a cause; the same subject can cover different causes.\n\nThese are report counts in a static export, not the current live queue. Reports continued arriving after the July backlog merge. See the signed KB reassessment and its rendered page.\n`;
 fs.writeFileSync(`drafts/${g.cause}-issue.md`,body);
}
console.log(groups.map(g=>({cause:g.cause,count:g.reports.length})));
