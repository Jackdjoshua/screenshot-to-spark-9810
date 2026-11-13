import {createFileRoute} from '@tanstack/react-router';
import {RacqrShell} from '@/components/racqr-shell';
import {Scanner} from '@/components/racqr-scan';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/scan')({head:()=>pageHead('Scan a tag','Scan racket tags and customer pickup passes with a camera, scanner, or image.'),component:()=> <RacqrShell><Scanner/></RacqrShell>});
