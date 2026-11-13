import {createFileRoute} from '@tanstack/react-router';
import {handleRacqrAPI} from '@/lib/racqr-api-runtime';
export const Route=createFileRoute('/api/photo')({server:{handlers:{POST:({request})=>handleRacqrAPI(request,'photo')}}});
