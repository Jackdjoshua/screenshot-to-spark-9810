import {createFileRoute,useNavigate} from '@tanstack/react-router';
import {useEffect} from 'react';
import {AuthDialog} from '@/components/racqr-auth';
import {useWorkspace} from '@/lib/workspace';
import {pageHead} from '@/lib/page-head';
import {safeAuthDestination} from '@/lib/auth-navigation';
export const Route=createFileRoute('/auth')({
 head:()=>pageHead('Sign in','Sign in to RacQr as a player or stringer to access your private racket workspace.'),
 validateSearch:(search:Record<string,unknown>):{redirect?:string}=>({redirect:typeof search.redirect==='string'?safeAuthDestination(search.redirect):undefined}),
 component:SignIn,
});
function SignIn(){const w=useWorkspace();const navigate=useNavigate();const {redirect}=Route.useSearch();
 useEffect(()=>{if(w.user&&w.accountType){const target=safeAuthDestination(redirect||sessionStorage.getItem('racqr-auth-destination'));sessionStorage.removeItem('racqr-auth-destination');void navigate({to:target,replace:true});}},[w.user,w.accountType,redirect,navigate]);
 return <AuthDialog standalone onClose={()=>{void w.refresh();}}/>;
}