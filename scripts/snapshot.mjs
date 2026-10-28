import fs from 'node:fs';
import path from 'node:path';
const build='support-kb/build';
let html=fs.readFileSync(build+'/kb/incidents/4471-reassessment/index.html','utf8');
html=html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g,tag=>{
 const href=tag.match(/href="([^"]+)"/)[1];
 return '<style>'+fs.readFileSync(path.resolve(build+'/kb/incidents/4471-reassessment',href),'utf8')+'</style>';
});
// Frozen desk view: preserve SSR output and styling; use the full site for interactive controls.
html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g,'');
fs.writeFileSync('rendered/4471-reassessment.html',html);
console.log('Saved self-contained SSR snapshot');
