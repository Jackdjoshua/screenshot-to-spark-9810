import {useState} from 'react';
import {UserRound,Wrench} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {supabase} from '@/integrations/supabase/client';
import {toast} from 'sonner';
import type {AccountType} from '@/lib/account-access';
export function AccountTypeSelector({value,onChange}:{value:AccountType,onChange:(value:AccountType)=>void}) {
 return <div className="segment mb-5" aria-label="Account type">{(['player','stringer'] as const).map(type=><Button key={type} type="button" variant="ghost" aria-pressed={value===type} className={value===type?'selected flex-1':'flex-1'} onClick={()=>onChange(type)}>{type==='player'?<UserRound/>:<Wrench/>}{type==='player'?'Player':'Stringer'}</Button>)}</div>;
}
export function AccountChoice({onComplete}:{onComplete:()=>void}) {
 const [type,setType]=useState<AccountType>('player');const [busy,setBusy]=useState(false);
 return <div className="modal-overlay"><section className="modal" role="dialog" aria-modal="true" aria-label="Choose your account"><div className="modal-head"><h2>Your RacQr account</h2></div><AccountTypeSelector value={type} onChange={setType}/><Button disabled={busy} className="w-full" onClick={async()=>{setBusy(true);const {error}=await supabase.rpc('racqr_choose_account',{account_type:type});setBusy(false);if(error)toast.error(error.message);else onComplete();}}>Continue as {type}</Button></section></div>;
}