import {useState,type FormEvent} from 'react';
import {UserRound,Wrench,Building2,ArrowRight,Plus,LogOut} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {supabase} from '@/integrations/supabase/client';
import {toast} from 'sonner';
import type {AccountType} from '@/lib/account-access';
import {generateClubCode} from '@/lib/account-access';

export function AccountTypeSelector({value,onChange}:{value:AccountType,onChange:(value:AccountType)=>void}) {
 return <div className="segment mb-5" aria-label="Account type">{(['player','stringer'] as const).map(type=><Button key={type} type="button" variant="ghost" aria-pressed={value===type} className={value===type?'selected flex-1':'flex-1'} onClick={()=>onChange(type)}>{type==='player'?<UserRound/>:<Wrench/>}{type==='player'?'Player':'Stringer'}</Button>)}</div>;
}

export function AccountChoice({accountType,onComplete}:{accountType:AccountType|null,onComplete:()=>void}) {
 const [type,setType]=useState<AccountType>(accountType||'player');
 const [busy,setBusy]=useState(false);
 async function chooseType(){
  setBusy(true);
  const {error}=await supabase.rpc('racqr_choose_account',{account_type:type});
  setBusy(false);
  if(error)toast.error(error.message);else onComplete();
 }
 async function joinClub(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  if(busy)return;
  const form=new FormData(e.currentTarget);
  const code=String(form.get('club_code')||'').trim().toLowerCase();
  if(!code){toast.error('Enter your club code.');return;}
  const role=accountType==='player'?'customer':'stringer';
  setBusy(true);
  try{
   const {error}=await (supabase as any).rpc('racqr_join_club',{club_slug:code,requested_role:role,invitation_code:code});
   if(error){toast.error(error.message.includes('Club not found')?'We could not find that club. Check the code and try again.':error.message);return;}
   toast.success(accountType==='player'?'You have joined the club.':'Your staff request has been sent.');
   onComplete();
  }catch(error){
   toast.error(error instanceof Error?error.message:'Could not join the club. Please try again.');
  }finally{setBusy(false);}
 }
 async function createClub(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(accountType!=='stringer')return;
  setBusy(true);const form=new FormData(e.currentTarget);const name=String(form.get('club_name')||'').trim();
  const slug=generateClubCode();
  const {error}=await supabase.from('clubs').insert({name,slug,owner_id:(await supabase.auth.getUser()).data.user?.id||'',default_unit:'lb',currency:'USD'});
  setBusy(false);
  if(error)toast.error(error.message);else{toast.success('Club workspace created. You are its admin.');onComplete();}
 }
 return <div className="modal-overlay"><section className="modal max-w-lg" role="dialog" aria-modal="true" aria-label={accountType?'Join a club':'Choose your account'}>
  {!accountType?<><div className="modal-head"><h2>How will you use RacQr?</h2></div><p className="text-sm text-muted-foreground mb-4">Choose the account that matches your role.</p><AccountTypeSelector value={type} onChange={setType}/><Button disabled={busy} className="w-full" onClick={chooseType}>Continue as {type} <ArrowRight/></Button></>:<>
   <div className="modal-head"><h2>Connect to a club</h2></div>
   <p className="text-sm text-muted-foreground mb-5">RacQr works through tennis clubs and pro shops. Join your club to finish setting up your account.</p>
   <form className="auth-form" onSubmit={joinClub}>
    <div className="field"><label htmlFor="onboarding-club-code">6-character club code</label><input id="onboarding-club-code" name="club_code" placeholder="e.g. 8K4P2M" autoCapitalize="characters" autoComplete="off" autoCorrect="off" spellCheck={false} inputMode="text" required/></div>
    <Button type="submit" disabled={busy} className="w-full">{busy?'Joining…':<><Building2/>Join club</>}</Button>
   </form>
   {accountType==='stringer'&&<><div className="divider">OR</div><form className="auth-form" onSubmit={createClub}><div className="field"><label htmlFor="onboarding-club-name">Create a pro shop workspace</label><input id="onboarding-club-name" name="club_name" placeholder="Your pro shop or club name" required/></div><Button type="submit" variant="outline" disabled={busy} className="w-full"><Plus/>Create workspace</Button></form></>}
  </>}
  <div className="mt-5 flex justify-end"><Button type="button" variant="ghost" size="sm" disabled={busy} onClick={async()=>{await supabase.auth.signOut();}}><LogOut/>Sign out</Button></div>
 </section></div>;
}
