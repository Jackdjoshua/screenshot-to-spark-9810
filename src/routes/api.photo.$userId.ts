import {createFileRoute} from '@tanstack/react-router';
import {handleRacqrAPI} from '@/lib/racqr-api-runtime';
export const Route=createFileRoute('/api/photo/$userId')({server:{handlers:{GET:({request,params})=>handleRacqrAPI(request,'photo',params.userId)}}});
