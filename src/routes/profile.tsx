import {createFileRoute} from '@tanstack/react-router';
import {RacqrShell} from '@/components/racqr-shell';
import {RacqrProfile} from '@/components/racqr-profile';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/profile')({head:()=>pageHead('Your profile and rackets','Manage your racket specifications, private pickup pass, profile photo, and stringing history.'),component:()=> <RacqrShell><RacqrProfile/></RacqrShell>});
