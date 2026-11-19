import {useState} from 'react';
import {useNavigate} from '@tanstack/react-router';
import {useQueryClient} from '@tanstack/react-query';
import {Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {AlertDialog,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle} from '@/components/ui/alert-dialog';
import {supabase} from '@/integrations/supabase/client';
import {toast} from 'sonner';

export function RacqrDeleteAccount(){
  const [open,setOpen]=useState(false);
  const [confirmation,setConfirmation]=useState('');
  const [deleting,setDeleting]=useState(false);
  const navigate=useNavigate();
  const queryClient=useQueryClient();

  async function deleteAccount(){
    setDeleting(true);

    // Remove the private profile photo through the Storage API. Do not delete
    // storage.objects directly in SQL; Storage manages its own object metadata.
    const {data:userData,error:userError}=await supabase.auth.getUser();
    if(userError||!userData.user){
      toast.error(userError?.message||'Please sign in again before deleting your account.');
      setDeleting(false);
      return;
    }
    const {data:profile,error:profileError}=await supabase
      .from('profiles')
      .select('avatar_path')
      .eq('id',userData.user.id)
      .maybeSingle();
    if(profileError){
      toast.error(profileError.message);
      setDeleting(false);
      return;
    }
    if(profile?.avatar_path){
      const {error:photoError}=await supabase.storage
        .from('profile-photos')
        .remove([profile.avatar_path]);
      if(photoError){
        toast.error(`Could not remove your profile photo: ${photoError.message}`);
        setDeleting(false);
        return;
      }
    }

    const {error}=await (supabase as any).rpc('racqr_delete_account');
    if(error){
      toast.error(error.message);
      setDeleting(false);
      return;
    }
    toast.success('Your RacQr account has been deleted.');
    await queryClient.cancelQueries();
    queryClient.clear();
    try{
      await supabase.auth.signOut({scope:'local'});
    }finally{
      setOpen(false);
      setDeleting(false);
      await navigate({to:'/auth',replace:true});
    }
  }

  return <>
    <Button
      variant="outline"
      className="mt-3 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={()=>{setConfirmation('');setOpen(true);}}
    >
      <Trash2/>Delete account
    </Button>
    <AlertDialog open={open} onOpenChange={value=>{if(!deleting){setOpen(value);if(!value)setConfirmation('');}}}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your RacQr account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes your account, profile and saved personal rackets.
            Any club you own will be transferred to another approved admin, or to an
            approved stringer if no other admin exists. Club jobs and other members'
            records will be kept. If a club has no eligible replacement, deletion will
            be blocked until one is appointed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <label htmlFor="delete-account-confirm" className="text-sm font-medium">Type DELETE to confirm</label>
          <input
            id="delete-account-confirm"
            value={confirmation}
            onChange={event=>setConfirmation(event.target.value)}
            autoComplete="off"
            placeholder="DELETE"
            className="w-full"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <Button variant="destructive" disabled={deleting||confirmation!=='DELETE'} onClick={deleteAccount}>
            {deleting?'Deleting…':'Permanently delete account'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>;
}
