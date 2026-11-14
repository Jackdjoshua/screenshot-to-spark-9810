import { createFileRoute } from "@tanstack/react-router";
import { RacqrShell } from '@/components/racqr-shell';
import { NewJob } from '@/components/racqr-new';
import { pageHead } from '@/lib/page-head';
import { useEffect, useState } from 'react';
import { decodeTag, type Job } from '@/lib/racqr';
import { JobDialog } from '@/components/racqr-jobs';
export const Route = createFileRoute("/_authenticated/")({
  head: () => pageHead('Racket stringing requests', 'Request your next racket setup or create a club stringing job with precise tensions and open-standard QR tags.'),
  component: Index,
});
function Index() {
  const [tag,setTag]=useState<Partial<Job>|null>(null);
  useEffect(()=>{const read=()=>{if(window.location.hash.startsWith('#/j?'))setTag(decodeTag(window.location.href));else {const path=window.location.hash.slice(1);if(['/new','/scan','/jobs','/calendar','/profile','/settings'].includes(path))window.location.replace(path==='/new'?'/':path);}};read();window.addEventListener('hashchange',read);return()=>window.removeEventListener('hashchange',read)},[]);
  return <RacqrShell><NewJob/>{tag&&<JobDialog job={tag} onClose={()=>{setTag(null);history.replaceState(null,'',window.location.pathname)}}/>}</RacqrShell>;
}
