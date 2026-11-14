import {createFileRoute,Outlet,redirect} from '@tanstack/react-router';
import {supabase} from '@/integrations/supabase/client';
import {useWorkspace} from '@/lib/workspace';
import {safeAuthDestination} from '@/lib/auth-navigation';
export const Route=createFileRoute('/_authenticated')({
 ssr:false,
 beforeLoad:async({location})=>{const {data,error}=await supabase.auth.getUser();if(error||!data.user)throw redirect({to:'/auth',search:{redirect:safeAuthDestination(location.href)},replace:true});},
 component:AuthenticatedWorkspace,
});
function AuthenticatedWorkspace(){const w=useWorkspace();if(!w.user||!w.accountType)return <div className="auth-loading" role="status">Opening your account…</div>;return <Outlet/>;}