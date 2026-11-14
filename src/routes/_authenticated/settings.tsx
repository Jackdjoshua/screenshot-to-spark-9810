import {createFileRoute} from '@tanstack/react-router';
import {RacqrShell} from '@/components/racqr-shell';
import {RacqrSettings} from '@/components/racqr-settings';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/_authenticated/settings')({head:()=>pageHead('Workspace settings','Create your club, approve stringers, and set printing and stringing defaults.'),component:()=> <RacqrShell><RacqrSettings/></RacqrShell>});
