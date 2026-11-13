import {createFileRoute} from '@tanstack/react-router';
import {RacqrShell} from '@/components/racqr-shell';
import {RacqrCalendar} from '@/components/racqr-calendar';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/calendar')({head:()=>pageHead('Stringing calendar','Plan racket drop-offs and pickup due dates.'),component:()=> <RacqrShell><RacqrCalendar/></RacqrShell>});
