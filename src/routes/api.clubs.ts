import {createFileRoute} from '@tanstack/react-router';
import {handleRacqrAPI} from '@/lib/racqr-api-runtime';
export const Route=createFileRoute('/api/clubs')({server:{handlers:{GET:({request})=>handleRacqrAPI(request,'clubs'),POST:({request})=>handleRacqrAPI(request,'clubs')}}});
