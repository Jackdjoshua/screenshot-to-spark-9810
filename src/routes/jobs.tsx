import {createFileRoute} from '@tanstack/react-router';
import {RacqrShell} from '@/components/racqr-shell';
import {JobsBoard} from '@/components/racqr-jobs';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/jobs')({head:()=>pageHead('Jobs board','Track received, in-progress, ready, and collected rackets in your club.'),component:()=> <RacqrShell><JobsBoard/></RacqrShell>});
