import {createFileRoute} from '@tanstack/react-router';
import {handleRacqrAPI} from '@/lib/racqr-api-runtime';
export const Route=createFileRoute('/api/jobs/$id')({server:{handlers:{GET:({request,params})=>handleRacqrAPI(request,'jobs',params.id),PATCH:({request,params})=>handleRacqrAPI(request,'jobs',params.id),DELETE:({request,params})=>handleRacqrAPI(request,'jobs',params.id)}}});
