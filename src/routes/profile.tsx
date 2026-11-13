import {createFileRoute} from '@tanstack/react-router';
import {RacqrShell} from '@/components/racqr-shell';
import {RacqrProfile} from '@/components/racqr-profile';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/profile')({head:()=>pageHead('Your profile','Your private pickup pass, profile photo, and racket stringing history.'),component:()=> <RacqrShell><RacqrProfile/></RacqrShell>});
