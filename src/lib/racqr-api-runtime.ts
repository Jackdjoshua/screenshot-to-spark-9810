import {createServerOnlyFn} from '@tanstack/react-start';
import {createClient,type SupabaseClient} from '@supabase/supabase-js';
import {z} from 'zod';
import type {Database} from '@/integrations/supabase/types';
import {clubInput,jobInput,jobPatch,toLegacy,toJobInsert,toJobPatch} from './racqr-api';
type Client=SupabaseClient<Database>;
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
const uuid=z.string().uuid();
export const handleRacqrAPI=createServerOnlyFn(async(request:Request,kind:'clubs'|'jobs'|'photo',id?:string)=>{
 try{
  const token=request.headers.get('Authorization')?.match(/^Bearer (.+)$/i)?.[1];if(!token)return json({error:'Unauthorized'},401);
  const url=process.env['SUPABASE_URL'];const key=process.env['SUPABASE_PUBLISHABLE_KEY'];if(!url||!key)return json({error:'Service unavailable'},503);
  const client:Client=createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{Authorization:`Bearer ${token}`}}});
  const {data:auth,error:authError}=await client.auth.getUser(token);if(authError||!auth.user)return json({error:'Unauthorized'},401);
  const userId=auth.user.id;
  if(kind==='clubs'){
   if(request.method==='GET'){const {data,error}=await client.from('club_members').select('role,approved,clubs(*)').eq('user_id',userId);if(error)throw error;return json({memberships:data.map(m=>({club:toLegacy(m.clubs),role:m.role,approved:m.approved}))});}
   const b=clubInput.parse(await request.json());const slug=b.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+crypto.randomUUID().slice(0,8);const {data,error}=await client.from('clubs').insert({name:b.name,slug,owner_id:userId,default_unit:b.defaultUnit||'lb',currency:b.currency||'$'}).select().single();if(error)throw error;return json({club:toLegacy(data)},201);
  }
  if(kind==='photo'){
   if(request.method==='POST'){const form=await request.formData();const photo=form.get('photo');if(!(photo instanceof File)||!['image/jpeg','image/png','image/webp'].includes(photo.type)||photo.size>5*1024*1024||photo.size===0)return json({error:'Upload a JPEG, PNG or WebP photo under 5 MB'},400);const path=`${userId}/${crypto.randomUUID()}.${photo.type.split('/')[1]}`;const {error}=await client.storage.from('profile-photos').upload(path,photo);if(error)throw error;const {error:profileError}=await client.from('profiles').update({avatar_path:path}).eq('id',userId);if(profileError)throw profileError;return json({ok:true,key:path});}
   const target=uuid.parse(id);const {data,error}=await client.from('profiles').select('avatar_path').eq('id',target).maybeSingle();if(error||!data?.avatar_path)return json({error:'Photo not found'},404);const file=await client.storage.from('profile-photos').download(data.avatar_path);if(file.error||!file.data)return json({error:'Photo not found'},404);return new Response(file.data,{headers:{'Content-Type':file.data.type,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
  }
  const clubId=uuid.parse(request.headers.get('X-Club-Id'));const {data:membership,error:membershipError}=await client.from('club_members').select('role,approved').eq('club_id',clubId).eq('user_id',userId).maybeSingle();if(membershipError||!membership)return json({error:'Forbidden'},403);
  const staff=membership.approved&&['admin','stringer'].includes(membership.role);
  if(id)uuid.parse(id);
  if(request.method==='GET'){let rows:Database['public']['Tables']['jobs']['Row'][]=[];for(let offset=0;;offset+=1000){let q=client.from('jobs').select('*').eq('club_id',clubId).order('created_at',{ascending:false}).range(offset,offset+999);if(id)q=q.eq('id',id);const {data,error}=await q;if(error)throw error;rows.push(...data);if(data.length<1000)break;}if(id)return rows[0]?json({job:toLegacy(rows[0])}):json({error:'Job not found'},404);return json({jobs:rows.map(toLegacy),role:membership.role,approved:membership.approved});}
  if(request.method==='POST'){const b=jobInput.parse(await request.json());const {data,error}=await client.from('jobs').insert(toJobInsert(b,clubId)).select().single();if(error)throw error;return json({job:toLegacy(data)},201);}
  if(!staff)return json({error:'Staff access required'},403);
  if(request.method==='PATCH'){const patch=jobPatch.parse(await request.json());const {data,error}=await client.from('jobs').update(toJobPatch(patch)).eq('id',id||'').eq('club_id',clubId).select().maybeSingle();if(error)throw error;return data?json({job:toLegacy(data)}):json({error:'Job not found'},404);}
  const {data,error}=await client.from('jobs').delete().eq('id',id||'').eq('club_id',clubId).select('id');if(error)throw error;return data.length?json({ok:true}):json({error:'Job not found'},404);
 }catch(error){if(error instanceof z.ZodError||error instanceof SyntaxError)return json({error:'Invalid request'},400);console.error('RacQr API request failed');return json({error:'Request could not be completed'},400);}
});
