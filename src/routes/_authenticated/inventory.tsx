import {createFileRoute} from '@tanstack/react-router';
import {RacqrShell} from '@/components/racqr-shell';
import {InventoryPage} from '@/components/racqr-inventory';
import {pageHead} from '@/lib/page-head';
export const Route=createFileRoute('/_authenticated/inventory')({head:()=>pageHead('Club inventory','Import and manage your club pro-shop stock in RacQr.'),component:()=> <RacqrShell><InventoryPage/></RacqrShell>});
