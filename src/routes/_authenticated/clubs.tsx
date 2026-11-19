import {useEffect,useMemo,useState} from 'react';
import {Link,createFileRoute} from '@tanstack/react-router';
import {Globe2,MapPin,Search,ExternalLink,Building2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {RacqrShell,PageHeading} from '@/components/racqr-shell';
import {useWorkspace} from '@/lib/workspace';
import {supabase} from '@/integrations/supabase/client';
import {toast} from 'sonner';

type PublicClub={id:string;name:string;slug:string;description:string;website:string;logo_url:string;cover_image_url:string;brand_color:string;city:string;country:string;created_at:string};
type RpcClient={rpc:(name:string,args?:Record<string,unknown>)=>Promise<{data:PublicClub[]|null,error:{message:string}|null}>};
export const Route=createFileRoute('/_authenticated/clubs')({component:WorldwideClubs});
function WorldwideClubs(){return <RacqrShell><WorldwideClubsContent/></RacqrShell>}
function WorldwideClubsContent(){
 const w=useWorkspace();const [clubs,setClubs]=useState<PublicClub[]>([]);const [search,setSearch]=useState('');const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 useEffect(()=>{let active=true;(async()=>{const db=supabase as unknown as RpcClient;const {data,error}=await db.rpc('racqr_public_clubs');if(!active)return;if(error){setError(error.message);setClubs([]);}else{setClubs(data||[]);setError('');}setLoading(false);})();return()=>{active=false}},[]);
 const visible=useMemo(()=>{const q=search.trim().toLowerCase();return clubs.filter(c=>!q||[c.name,c.description,c.city,c.country].filter(Boolean).join(' ').toLowerCase().includes(q))},[clubs,search]);
 async function join(club:PublicClub){const {error}=await supabase.rpc('racqr_join_club',{club_slug:club.slug,requested_role:w.accountType==='stringer'?'stringer':'customer'});if(error){toast.error(error.message);return;}toast.success('Join request sent. The club may need to approve your membership.');await w.refresh();}
 return <><PageHeading eyebrow="THE RACQR NETWORK" title="Clubs around the world" subtitle="Discover tennis clubs and stringing teams that have chosen to be listed on RacQr."><Globe2 size={20}/></PageHeading>
 <section className="settings-section">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2>Worldwide directory</h2><p className="text-xs text-muted-foreground mt-1">{clubs.length} public {clubs.length===1?'club':'clubs'} on RacQr</p></div><div className="relative w-full sm:max-w-xs"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input className="w-full pl-9" aria-label="Search clubs" placeholder="Search by club or location" value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
  {loading?<p className="py-8 text-sm text-muted-foreground">Loading the worldwide directory…</p>:error?<div className="alert-note mt-4"><strong>Directory is not available yet.</strong><p className="mt-1 text-sm">The worldwide directory database update needs to be applied before clubs can appear here.</p></div>:visible.length===0?<div className="py-10 text-center"><Building2 className="mx-auto mb-3 text-muted-foreground"/><p className="font-semibold">{clubs.length?'No clubs match your search yet.':'No clubs have made their listings public yet.'}</p><p className="mt-1 text-xs text-muted-foreground">Club administrators can enable public listings in Settings.</p></div>:<div className="mt-5 grid gap-4 md:grid-cols-2">{visible.map(club=><article key={club.id} className="overflow-hidden rounded-xl border bg-card">
   {club.cover_image_url?<img src={club.cover_image_url} alt="" className="h-32 w-full object-cover"/>:<div className="h-2" style={{backgroundColor:/^#[0-9a-f]{6}$/i.test(club.brand_color)?club.brand_color:'#0f766e'}}/>}
   <div className="p-4"><div className="flex items-start gap-3">{club.logo_url?<img src={club.logo_url} alt="" className="h-12 w-12 rounded-lg border object-contain"/>:<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted"><Building2/></div>}<div className="min-w-0 flex-1"><h3 className="font-semibold">{club.name}</h3><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={12}/>{[club.city,club.country].filter(Boolean).join(', ')||'Location not provided'}</p></div></div>
   {club.description&&<p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{club.description}</p>}
   <div className="mt-4 flex flex-wrap items-center gap-2"><Button size="sm" onClick={()=>void join(club)} disabled={w.memberships.some(m=>m.club_id===club.id)}> {w.memberships.some(m=>m.club_id===club.id)?'Already a member':'Request to join'}</Button>{club.website&&<a href={club.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline">Website <ExternalLink size={12}/></a>}</div>
   </div></article>)}</div>}
 </section><p className="mt-4 text-xs text-muted-foreground">Want your club listed? Club administrators can publish and customise their listing from <Link to="/settings" className="underline">Settings</Link>.</p>
 </>;
}
