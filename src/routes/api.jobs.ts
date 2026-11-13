import {createFileRoute} from '@tanstack/react-router';
import {handleRacqrAPI} from '@/lib/racqr-api-runtime';
export const Route=createFileRoute('/api/jobs')({server:{handlers:{GET:({request})=>handleRacqrAPI(request,'jobs'),POST:({request})=>handleRacqrAPI(request,'jobs')}}});
