#!/usr/bin/env node
import {getDb} from './lib/db.mjs';
import {run} from './lib/domain.mjs';
import {table} from './lib/format.mjs';
const argv=process.argv.slice(2),opts={},args=[];
for(const a of argv){if(a==='--json')opts.json=true;else if(a==='--dry-run')opts.dryRun=true;else if(a.startsWith('--mapping='))opts.mapping=a.slice(10);else if(a.startsWith('--date-order='))opts.dateOrder=a.slice(13);else if(a.startsWith('--')){console.error('Unknown option '+a);process.exit(1);}else args.push(a);}
function show(value){if(Array.isArray(value)){const rows=value.map(r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k,v instanceof Date?v.toISOString().slice(0,10):typeof v==='object'&&v!==null?JSON.stringify(v):v])));console.log(table(rows,Object.keys(rows[0]||{}).map(key=>({key,label:key,width:60}))));}else for(const [k,v]of Object.entries(value)){console.log('\n'+k);show(Array.isArray(v)?v:[v]);}}
let db;try{db=await getDb();const result=await run(db,args.shift()||'help',args,opts);if(opts.json)console.log(JSON.stringify(result,null,2));else show(result);}catch(e){console.error(e.message);process.exitCode=1;}finally{await db?.close();}
