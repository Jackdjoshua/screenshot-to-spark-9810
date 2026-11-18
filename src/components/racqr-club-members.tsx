import {useMemo,useState} from 'react';
import {Search,Trash2,Users} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useWorkspace} from '@/lib/workspace';
import {supabase} from '@/integrations/supabase/client';
import {toast} from 'sonner';

export function RacqrClubMembers(){
  const w=useWorkspace();
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('all');
  const members=w.clubMembers||[];
  const visible=useMemo(()=>members.filter((m:any)=>{
    const name=m.profiles?.name||'';
    const email=m.profiles?.email||'';
    const matches=(name+' '+email+' '+m.role).toLowerCase().includes(search.toLowerCase());
    return matches&&(filter==='all'||(filter==='pending'?!m.approved:filter==='approved'?m.approved:m.role===filter));
  }),[members,search,filter]);
  async function removeMember(member:any){
    if(!w.club||!w.isAdmin)return;
    if(member.user_id===w.user?.id){toast.error('You cannot remove your own admin account here.');return;}
    const adminCount=members.filter((m:any)=>m.role==='admin'&&m.approved).length;
    if(member.role==='admin'&&member.approved&&adminCount<=1){toast.error('A club must keep at least one approved admin.');return;}
    const label=member.profiles?.name||member.profiles?.email||'this member';
    if(!window.confirm('Remove '+label+' from '+w.club.name+'? Their RacQr account will not be deleted.'))return;
    const {error}=await supabase.from('club_members').delete().eq('id',member.id).eq('club_id',w.club.id);
    if(error)toast.error(error.message);else{toast.success('Member removed from club.');await w.refresh();}
  }
  if(!w.isAdmin)return null;
  return <section className="settings-section">
    <h2><Users size={17} className="inline mr-2"/>Club members</h2>
    <p className="text-xs text-muted-foreground mb-4">View everyone connected to this club and manage their membership. Removing someone here does not delete their RacQr account.</p>
    <div className="flex flex-wrap gap-3 mb-4">
      <div className="relative flex-1 min-w-[180px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input className="pl-9" aria-label="Search members" placeholder="Search name, email or role" value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <select aria-label="Filter members" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Everyone</option><option value="admin">Admins</option><option value="stringer">Stringers</option><option value="customer">Players</option><option value="pending">Pending approval</option><option value="approved">Approved</option></select>
    </div>
    {w.membersLoading?<p className="text-xs text-muted-foreground">Loading members…</p>:w.membersError?<p className="text-xs text-destructive">Could not load members. Check your connection and try again.</p>:visible.length===0?<p className="text-xs text-muted-foreground">No members match this search.</p>:visible.map((m:any)=><div className="settings-row gap-3" key={m.id}>
      <div className="min-w-0 flex-1"><strong className="block truncate">{m.profiles?.name||'Unnamed member'}</strong><p className="text-xs text-muted-foreground truncate">{m.profiles?.email||m.user_id.slice(0,8)}</p><p className="text-xs text-muted-foreground capitalize mt-1">{m.role} · {m.approved?'Approved':'Pending approval'}</p></div>
      <Button type="button" size="sm" variant="outline" onClick={()=>void removeMember(m)} disabled={m.user_id===w.user?.id|| (m.role==='admin'&&m.approved&&members.filter((x:any)=>x.role==='admin'&&x.approved).length<=1)}><Trash2 size={14}/>Remove</Button>
    </div>)}
    <p className="text-xs text-muted-foreground mt-3">{members.length} {members.length===1?'member':'members'} in this club</p>
  </section>;
}
