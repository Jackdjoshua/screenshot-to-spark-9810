export function safeAuthDestination(value: unknown): string {
 if(typeof value!=='string')return '/';
 const path=value.split(/[?#]/)[0];
 return ['/','/jobs','/scan','/calendar','/profile','/settings'].includes(path)?value:'/';
}