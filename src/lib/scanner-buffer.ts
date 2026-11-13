export const SCANNER_BUFFER_MS=250;
export function createScannerBuffer(read:(value:string)=>void){let timer:ReturnType<typeof setTimeout>|undefined;return {push(value:string){if(timer)clearTimeout(timer);timer=setTimeout(()=>read(value),SCANNER_BUFFER_MS);},cancel(){if(timer)clearTimeout(timer);}};}
