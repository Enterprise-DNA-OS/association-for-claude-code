import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {REPO_ROOT} from './db.mjs';
import {importMembers} from './import.mjs';
const fields=JSON.parse(readFileSync(new URL('./fields.json',import.meta.url),'utf8'));
export const reads={
 'cpd-review':'select * from cpd_review_queue order by completed_on',
 'cpd-categories':'select * from cpd_category_summary order by member,category',
 'cpd-evidence':"select name,member,category,hours from cpd_review_queue where nullif(trim(evidence_ref),'') is null order by member", 
 members:'select id,name,email,status,renewal_due from members order by name',
 levels:'select * from levels order by name',
 'renewals-due':"select name,status,level,renewal_due,cpd_hours,cpd_target from member_health where status in ('active','lapsed') and renewal_due<=current_date+60 order by renewal_due",
 attention:"select name,status,renewal_due,last_contact_on,unpaid_invoices,attendances from member_health where status in ('active','lapsed','pending') and (renewal_due<current_date or last_contact_on is null or last_contact_on<current_date-60 or unpaid_invoices>0) order by renewal_due nulls last",
 arrears:'select name,member,currency,balance,due_on from invoice_balances where not void and balance>0 and due_on<current_date order by due_on',
 events:'select name,starts_on,capacity,booked,attended,waiting,status from event_summary order by starts_on',
 registrations:'select r.id,r.name,m.name as member,e.name as event,r.status from registrations r join members m on m.id=r.member_id join events e on e.id=r.event_id order by e.starts_on,m.name',
 invoices:'select id,name,member,amount,currency,balance,due_on,void from invoice_balances order by due_on',
 payments:'select p.id,p.name,i.name as invoice,p.amount,i.currency,p.paid_on,p.reference from payments p join invoices i on i.id=p.invoice_id order by p.paid_on',
 donations:'select d.name,m.name as member,d.amount,d.currency,d.purpose,d.received_on from donations d join members m on m.id=d.member_id order by d.received_on',
 'cpd-gaps':"select name,level,cpd_hours,cpd_target from member_health where status='active' and cpd_hours<cpd_target order by name",
 cpd:'select c.id,c.name,m.name as member,c.completed_on,c.hours,c.category,c.review_status,c.evidence_ref from cpd c join members m on m.id=c.member_id order by c.completed_on',
 engagement:"select name,status,attendances,last_contact_on from member_health where status='active' and attendances=0 order by last_contact_on nulls first",
 'level-summary':'select l.name,l.currency,l.annual_fee,count(m.id) as members,count(m.id) filter(where m.status=\'active\') as active from levels l left join members m on m.level_id=l.id group by l.id order by l.name',
 'cash-summary':'select i.currency,sum(p.amount) as recorded_receipts from payments p join invoices i on i.id=p.invoice_id group by i.currency order by i.currency',
 'donor-summary':'select d.currency,d.purpose,sum(d.amount) as received,count(*) as gifts from donations d group by d.currency,d.purpose order by d.currency,d.purpose',
 officers:'select o.id,o.name,m.name as member,o.role,o.appointed_on,o.ends_on,o.consent_ref,o.eligibility_ref from officers o left join members m on m.id=o.member_id order by o.ends_on',
 obligations:'select * from obligations order by due_on',
 activity:'select a.id,m.name as member,a.happened_on,a.note from activity a join members m on m.id=a.member_id order by a.created_at desc',
 audit:'select * from audit order by created_at desc',
 'consent-review':"select name,status,consent_on,consent_ref,marketing_consent from members where status='active' and (consent_on is null or nullif(trim(consent_ref),'') is null) order by name",
 'renewal-risk':"select name,level,renewal_due,unpaid_invoices,attendances,cpd_hours,cpd_target from member_health where status='active' and renewal_due<=current_date+60 and (attendances=0 or unpaid_invoices>0 or cpd_hours<cpd_target) order by renewal_due"
};
export const commands=[...Object.keys(reads),'member','event','compliance','weekly-review','add','set','renew','register','check-in','cancel-registration','payment','log','draft-renewal','draft-invitation','import','export','approve-cpd','help'];
export async function resolve(db,t,q){
 if(!q)throw Error(`Supply a ${t} name or ID`);
 if(![...Object.keys(fields),'registrations','payments','activity'].includes(t))throw Error('Unknown record type');
 const rows=await db.query(`select * from ${t} where id::text ilike $1 or name ilike $2 order by name`,[q+'%','%'+q+'%']);
 if(rows.length!==1)throw Error(rows.length?`Ambiguous ${t}:\n${rows.map(r=>r.id+'  '+r.name).join('\n')}`:`No ${t} matched ${q}`);
 return rows[0];
}
async function audit(db,name,record_id,detail){await db.query('insert into audit(name,record_id,detail) values($1,$2,$3)',[name,record_id,JSON.stringify(detail)]);}
export async function transaction(db,fn){await db.exec('BEGIN');try{const out=await fn();await db.exec('COMMIT');return out;}catch(e){await db.exec('ROLLBACK');throw e;}}
function date(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s||'')||new Date(s+'T00:00:00Z').toISOString().slice(0,10)!==s)throw Error('Use a valid YYYY-MM-DD date');return s;}
function amount(s){if(!/^\d+(\.\d{1,2})?$/.test(String(s))||Number(s)<=0)throw Error('Use a positive amount with at most two decimals');return s;}
export async function run(db,cmd,args=[],opts={}){
 if(cmd==='help')return commands.map(command=>({command}));
 if(reads[cmd])return db.query(reads[cmd]);
 if(cmd==='member'){const m=await resolve(db,'members',args[0]);return {member:m,health:await db.query('select * from member_health where id=$1',[m.id]),invoices:await db.query('select * from invoice_balances where member_id=$1',[m.id]),activity:await db.query('select * from activity where member_id=$1 order by happened_on desc',[m.id])};}
 if(cmd==='event'){const e=await resolve(db,'events',args[0]);return {event:e,registrations:await db.query('select m.name,r.status from registrations r join members m on m.id=r.member_id where event_id=$1 order by m.name',[e.id])};}
 if(cmd==='weekly-review')return {attention:await run(db,'attention'),renewals:await run(db,'renewals-due'),events:await run(db,'events')};
 if(cmd==='compliance')return compliance(db);
 if(cmd==='import'){if(args[0]!=='memberjungle'||!args[1])throw Error('import memberjungle <file.csv> [--dry-run] [--date-order=DMY|MDY]');return importMembers(db,args[1],opts);}
 if(cmd==='export'){
  if(!args[0])throw Error('export <file.json>');const out={format:'membership-v1',exported_at:new Date().toISOString()};
  await transaction(db,async()=>{await db.exec('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY');for(const t of [...Object.keys(fields),'registrations','payments','activity','audit'])out[t]=await db.query(`select * from ${t} order by id`);});
  writeFileSync(args[0],JSON.stringify(out,null,2));return [{file:path.resolve(args[0]),records:Object.values(out).filter(Array.isArray).reduce((n,a)=>n+a.length,0)}];
 }
 if(cmd.startsWith('draft-')){
  const m=await resolve(db,'members',args[0]);let body;
  if(cmd==='draft-renewal')body=`Dear ${m.name},\n\nOur records show your membership renewal date as ${m.renewal_due?new Date(m.renewal_due).toISOString().slice(0,10):'not recorded'}. Please review your membership details with our team.\n\nDraft for operator review. No payment link has been added.`;
  else if(cmd==='draft-invitation'){if(!m.marketing_consent)throw Error('Recorded marketing consent required for a promotional invitation');const e=await resolve(db,'events',args[1]);body=`Dear ${m.name},\n\nWe invite you to ${e.name} on ${new Date(e.starts_on).toISOString().slice(0,10)} at ${e.venue||'a venue to be confirmed'}. Please contact our team to register.\n\nDraft for operator review.`;}
  else throw Error('Unknown draft command');
  const dir=path.join(process.env.OUTPUT_DIR||REPO_ROOT,'drafts');mkdirSync(dir,{recursive:true});const file=path.join(dir,`${cmd}-${m.id}-${randomUUID()}.md`);writeFileSync(file,body+'\n');return [{file}];
 }
 return transaction(db,async()=>{
  let rows;
  if(cmd==='approve-cpd'){
   const c=await resolve(db,'cpd',args[0]);
   if(!args[1]?.trim())throw Error('Reviewer name required');
   const [check]=await db.query("select *,completed_on>current_date as future from cpd where id=$1 for update",[c.id]);
   if(check.review_status!=='pending'||check.future||!check.evidence_ref.trim())throw Error('Approval requires a pending completed activity with evidence');
   rows=await db.query("update cpd set review_status='approved',reviewer=$1,reviewed_on=current_date where id=$2 returning *",[args[1],c.id]);
  }else if(cmd==='add'||cmd==='set'){
   const [t,...rest]=args;if(!fields[t])throw Error('Writable types: '+Object.keys(fields).join(', '));
   const record=cmd==='set'?await resolve(db,t,rest.shift()):null;
   let value;try{value=JSON.parse(rest.join(' '));}catch{throw Error('Supply one JSON object of field values');}
   if(!value||Array.isArray(value)||typeof value!=='object'||!Object.keys(value).length)throw Error('Supply a non-empty object');
   for(const k of Object.keys(value)){
    if(!fields[t].includes(k))throw Error(`Field ${k} is not writable on ${t}`);
    if(k.endsWith('_id')&&value[k]){const target={member_id:'members',level_id:'levels'}[k];if(target)value[k]=(await resolve(db,target,value[k])).id;}
    if((k.endsWith('_on')||k==='renewal_due')&&value[k]!==null)date(value[k]);
   }
   if(t==='events'&&record&&value.capacity!==undefined){await db.query('select id from events where id=$1 for update',[record.id]);const [x]=await db.query("select count(*)::int n from registrations where event_id=$1 and status in ('registered','attended')",[record.id]);if(value.capacity<x.n)throw Error('Capacity is below existing bookings');}
   if(t==='invoices'&&record){
    await db.query('select id from invoices where id=$1 for update',[record.id]);
    const [p]=await db.query('select count(*)::int n from payments where invoice_id=$1',[record.id]);
    if(p.n&&['amount','currency','member_id','void'].some(k=>k in value))throw Error('An invoice with receipts cannot change amount, currency, member or void status');
   }
   if(t==='cpd'&&record&&record.review_status==='approved')throw Error('Approved CPD is locked; record a correction separately');
   const keys=Object.keys(value),vals=Object.values(value);
   if(record){rows=await db.query(`update ${t} set ${keys.map((k,i)=>k+'=$'+(i+1)).join(',')} where id=$${vals.length+1} returning *`,[...vals,record.id]);}
   else rows=await db.query(`insert into ${t}(${keys.join(',')}) values(${vals.map((_,i)=>'$'+(i+1)).join(',')}) returning *`,vals);
  }else if(cmd==='renew'){
   const m=await resolve(db,'members',args[0]);date(args[1]);await db.query('select id from members where id=$1 for update',[m.id]);
   if(!m.level_id||!m.consent_on||!m.consent_ref)throw Error('Level and membership consent evidence required');
   const [d]=await db.query('select $1::date>current_date and ($2::date is null or $1::date>$2::date) as valid',[args[1],m.renewal_due]);if(!d.valid)throw Error('Renewal must advance to a future date');
   const [debt]=await db.query('select count(*)::int n from invoice_balances where member_id=$1 and not void and balance>0',[m.id]);if(debt.n)throw Error('Settle or explicitly void outstanding invoices before renewal');
   rows=await db.query("update members set renewal_due=$1,status='active' where id=$2 returning id,name,status,renewal_due",[args[1],m.id]);
  }else if(cmd==='register'){
   const m=await resolve(db,'members',args[0]),e=await resolve(db,'events',args[1]);await db.query('select id from events where id=$1 for update',[e.id]);
   const [current]=await db.query('select *,starts_on<current_date as past from events where id=$1',[e.id]);if(current.status!=='open'||current.past)throw Error('Event is closed, cancelled or in the past');
   const [n]=await db.query("select count(*)::int n from registrations where event_id=$1 and status in ('registered','attended')",[e.id]);
   rows=await db.query('insert into registrations(name,member_id,event_id,status) values($1,$2,$3,$4) returning *',[m.name+' / '+e.name,m.id,e.id,n.n>=current.capacity?'waitlisted':'registered']);
  }else if(cmd==='check-in'||cmd==='cancel-registration'){
   const rr=await resolve(db,'registrations',args[0]);
   if(cmd==='check-in'){const [e]=await db.query('select status,starts_on>current_date as future from events where id=$1',[rr.event_id]);if(rr.status!=='registered'||e.status==='cancelled'||e.future)throw Error('Check-in requires a registered place at an event that has started');}
   rows=await db.query('update registrations set status=$1 where id=$2 returning *',[cmd==='check-in'?'attended':'cancelled',rr.id]);
  }else if(cmd==='payment'){
   const i=await resolve(db,'invoices',args[0]);amount(args[1]);if(!args[2]?.trim())throw Error('A unique bank reference is required');
   await db.query('select id from invoices where id=$1 for update',[i.id]);const [b]=await db.query('select * from invoice_balances where id=$1',[i.id]);
   if(b.void||Number(args[1])>Number(b.balance))throw Error('Payment exceeds the remaining balance or invoice is void');
   rows=await db.query('insert into payments(name,invoice_id,amount,reference) values($1,$2,$3,$4) returning *',['Receipt '+args[2],i.id,args[1],args[2]]);
  }else if(cmd==='log'){
   const m=await resolve(db,'members',args[0]);if(!args[1]?.trim())throw Error('Supply a contact note');rows=await db.query('insert into activity(name,member_id,note) values($1,$2,$3) returning *',['Contact with '+m.name,m.id,args.slice(1).join(' ')]);await db.query('update members set last_contact_on=current_date where id=$1',[m.id]);
  }else throw Error('Unknown command. Use help.');
  await audit(db,cmd,rows[0].id,{arguments:args});return rows;
 });
}
export async function compliance(db){
 const rules=[
  ['CPD-EVIDENCE',"select name from cpd where review_status='pending' and nullif(trim(evidence_ref),'') is null",'Association policy: learning evidence missing','docs/compliance.md'],
  ['MEMBER-CONSENT',"select name from members where status='active' and (consent_on is null or nullif(trim(consent_ref),'') is null)",'NZ incorporated society: verify membership consent evidence','https://www.is-register.companiesoffice.govt.nz/help-centre/running-your-incorporated-society/records-you-should-keep/'],
  ['REGISTER-DETAILS',"select name from members where status in ('active','lapsed') and (joined_on is null or nullif(trim(email),'') is null)",'NZ register: review joining date and contact details','https://www.is-register.companiesoffice.govt.nz/help-centre/running-your-incorporated-society/records-you-should-keep/'],
  ['OFFICER-EVIDENCE',"select name from officers where (ends_on is null or ends_on>=current_date) and (nullif(trim(consent_ref),'') is null or nullif(trim(eligibility_ref),'') is null)",'NZ officer: consent or eligibility certificate missing','https://www.is-register.companiesoffice.govt.nz/help-centre/running-your-incorporated-society/committees-and-officers/'],
  ['DUE-RECORD',"select name from obligations where completed_on is null and due_on<current_date",'Recorded governance deadline overdue','docs/compliance.md'],
  ['NOTICE-RECORD',"select name from obligations where notice_days is not null and ((notice_sent_on is null and due_on-notice_days<=current_date) or notice_sent_on>due_on-notice_days)",'Notice missing or late against your recorded constitution rule','docs/compliance.md'],
  ['COMPLETION-EVIDENCE',"select name from obligations where completed_on is not null and nullif(trim(evidence_ref),'') is null",'Completed obligation has no evidence reference','docs/compliance.md']
 ];const out=[];for(const [rule,sql,issue,source] of rules)for(const r of await db.query(sql))out.push({rule,record:r.name,issue,source});return out;
}
