import type { Database } from '@/integrations/supabase/types';
export type Job = Database['public']['Tables']['jobs']['Row'];
export type Club = Database['public']['Tables']['clubs']['Row'];
export const statuses = ['received','in_progress','ready','collected'] as const;
export const statusLabel = (s:string) => ({received:'Received',in_progress:'In progress',ready:'Ready',collected:'Collected'}[s] || s);
export const paymentLabel = (s:string) => ({u:'Unpaid',d:'Deposit paid',p:'Paid'}[s] || s);
export const convertTension = (n:number,u:string) => u==='kg' ? n*2.20462 : n/2.20462;
export const convertHead = (n:number) => n*6.4516;
export function repeatSetup(job:Job) { const {racket,head_size,pattern,mains_string,crosses_string,unit,mains_tension,crosses_tension,pre_stretch,knots,customer_name,customer_phone,customer_email,customer_id}=job; return {racket,head_size,pattern,mains_string,crosses_string,unit,mains_tension,crosses_tension,pre_stretch,knots,customer_name,customer_phone,customer_email,customer_id,status:'received',payment_status:'u',amount:0,date_in:new Date().toISOString().slice(0,10),ready_by:'',notes:''}; }
const keys:Record<string,keyof Job>={i:'job_number',n:'customer_name',p:'customer_phone',e:'customer_email',r:'racket',h:'head_size',pt:'pattern',ms:'mains_string',cs:'crosses_string',u:'unit',tm:'mains_tension',tc:'crosses_tension',pre:'pre_stretch',kn:'knots',pay:'payment_status',am:'amount',cu:'currency',pm:'payment_method',d:'date_in',du:'ready_by',nt:'notes'};
const labels:Record<string,keyof Job>={'Name':'customer_name','Phone':'customer_phone','Email':'customer_email','Racket':'racket','Head':'head_size','Pattern':'pattern','Mains':'mains_string','Crosses':'crosses_string','Mains tension':'mains_tension','Crosses tension':'crosses_tension','Pre-stretch':'pre_stretch','Knots':'knots','Payment':'payment_status','Amount':'amount','Method':'payment_method','In':'date_in','Ready by':'ready_by','Notes':'notes'};
export function encodeTag(j:Job,origin:string,plain=false,compact=false,shop='') { if(plain) return `RACQR/1 ${j.job_number}\n`+Object.entries(labels).filter(([,k])=>!compact||!['customer_phone','customer_email'].includes(k)).map(([l,k])=>{let v=String(j[k]??'');if(k.includes('tension'))v+=` ${j.unit} (${convertTension(Number(j[k]),j.unit).toFixed(1)} ${j.unit==='lb'?'kg':'lb'})`;if(k==='head_size')v+=' sq in';if(k==='payment_status')v=paymentLabel(v);if(k==='amount')v=(j.currency||'$')+v;return `${l}: ${v.replace(/\n/g,' ')}`;}).join('\n'); const q=new URLSearchParams({v:'1'}); if(shop&&!compact)q.set('s',shop);Object.entries(keys).forEach(([k,f])=>{if(compact&&['p','e'].includes(k))return;if(j[f]!=null&&j[f]!=='')q.set(k,String(j[f]));});return `${origin}/#/j?${q}`; }
export function decodeTag(text:string):Partial<Job>|null {const data:Record<string,unknown>={status:'received'};if(text.includes('#/j?')){new URLSearchParams(text.split('#/j?')[1]).forEach((v,k)=>{if(keys[k])data[keys[k]]=v;});}else if(/^RACQR\/1 /i.test(text)){const lines=text.split('\n');data['job_number']=(lines[0]||'').split(' ').slice(1).join(' ');for(const line of lines.slice(1)){const p=line.indexOf(':');const k=labels[line.slice(0,p).trim()];if(!k)continue;const v=line.slice(p+1).trim();data[k]=v;if(k.includes('tension')){data[k]=parseFloat(v);data['unit']=v.includes('kg')&&v.indexOf('kg')<v.indexOf('(')?'kg':'lb';}if(k==='payment_status')data[k]=v==='Paid'?'p':v==='Deposit paid'?'d':'u';if(k==='amount'){data['currency']=v[0];data['amount']=parseFloat(v.slice(1));}}}else return null;for(const k of ['head_size','mains_tension','crosses_tension','amount','knots'])if(data[k]!=null)data[k]=parseFloat(String(data[k]));return data as Partial<Job>; }
export const csvCell=(v:unknown)=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"';
export function download(name:string,content:string,type='text/csv'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href);}

// Permanent racket QR codes identify the physical racket, never a stringing job.
// The token is an opaque UUID stored on the club's racket record; it contains no PII.
const racketQrPattern = /^RACQR\/RACKET\/1 ([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;
export function encodeRacketTag(qrToken:string) {
  if (!racketQrPattern.test(`RACQR/RACKET/1 ${qrToken}`)) throw new Error('Invalid racket QR token');
  return `RACQR/RACKET/1 ${qrToken.toLowerCase()}`;
}
export function decodeRacketTag(value:string):string|null {
  const match=value.trim().match(racketQrPattern);
  return match?.[1]?.toLowerCase() ?? null;
}
