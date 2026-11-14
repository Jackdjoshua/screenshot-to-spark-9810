import os,requests,secrets
url=os.environ['SUPABASE_URL'];key=os.environ['SUPABASE_SERVICE_ROLE_KEY'];admin={'apikey':key,'Authorization':'Bearer '+key};users=[];club=None
try:
 def user(name):
  email='racqr-access-'+secrets.token_hex(5)+'@example.com';pw=secrets.token_urlsafe(24);r=requests.post(url+'/auth/v1/admin/users',headers=admin,json={'email':email,'password':pw,'email_confirm':True,'user_metadata':{'name':name}});r.raise_for_status();uid=r.json()['id'];users.append(uid);r=requests.post(url+'/auth/v1/token?grant_type=password',headers={'apikey':key},json={'email':email,'password':pw});r.raise_for_status();return uid,{'apikey':key,'Authorization':'Bearer '+r.json()['access_token'],'Prefer':'return=representation'}
 owner,oh=user('Staff verification');customer,ch=user('Customer verification');outsider,xh=user('Other club verification')
 requests.post(url+'/rest/v1/rpc/racqr_choose_account',headers=oh,json={'account_type':'stringer'}).raise_for_status()
 requests.post(url+'/rest/v1/rpc/racqr_choose_account',headers=ch,json={'account_type':'player'}).raise_for_status()
 r=requests.post(url+'/rest/v1/clubs',headers=ch,json={'name':'Forbidden','slug':'forbidden-'+secrets.token_hex(4),'owner_id':customer});assert r.status_code==403
 r=requests.post(url+'/rest/v1/rpc/racqr_choose_account',headers=ch,json={'account_type':'stringer'});r.raise_for_status();assert r.json()=='player'
 r=requests.patch(url+'/rest/v1/user_roles?user_id=eq.'+customer,headers=ch,json={'role':'stringer'});assert r.status_code==403
 r=requests.post(url+'/rest/v1/rackets',headers=ch,json={'user_id':customer,'name':'Player Blade','head_size':98,'mains_tension':52});r.raise_for_status();racket=r.json()[0]
 r=requests.patch(url+'/rest/v1/rackets?id=eq.'+racket['id'],headers=ch,json={'head_size':100,'mains_tension':54});r.raise_for_status();assert r.json()[0]['head_size']==100 and r.json()[0]['mains_tension']==54
 r=requests.get(url+'/rest/v1/rackets?id=eq.'+racket['id'],headers=xh);r.raise_for_status();assert r.json()==[]
 r=requests.patch(url+'/rest/v1/rackets?id=eq.'+racket['id'],headers=xh,json={'name':'Forged'});r.raise_for_status();assert r.json()==[]
 r=requests.patch(url+'/rest/v1/rackets?id=eq.'+racket['id'],headers=ch,json={'user_id':outsider});assert r.status_code==403
 r=requests.post(url+'/rest/v1/clubs',headers=oh,json={'name':'Access Verification','slug':'access-'+secrets.token_hex(4),'owner_id':owner});r.raise_for_status();club=r.json()[0];r=requests.post(url+'/rest/v1/rpc/racqr_join_club',headers=ch,json={'club_slug':club['slug'],'requested_role':'admin'});r.raise_for_status();r=requests.get(url+'/rest/v1/club_members?user_id=eq.'+customer,headers=ch);r.raise_for_status();assert r.json()[0]['role']=='customer'
 r=requests.post(url+'/rest/v1/rpc/racqr_join_club',headers=ch,json={'club_slug':club['slug'],'requested_role':'stringer'});assert r.status_code==400
 data={'club_id':club['id'],'customer_name':'Forged','racket':'Wilson Blade','mains_string':'ALU Power','mains_tension':52,'crosses_tension':52,'status':'collected','payment_status':'p','amount':999,'customer_id':owner}
 r=requests.post(url+'/rest/v1/jobs',headers=ch,json=data);r.raise_for_status();job=r.json()[0];assert job['customer_id']==customer and job['customer_name']=='Customer verification' and job['status']=='received' and job['payment_status']=='u' and job['amount']==0
 r=requests.patch(url+'/rest/v1/jobs?id=eq.'+job['id'],headers=ch,json={'status':'collected'});r.raise_for_status();assert r.json()==[]
 r=requests.get(url+'/rest/v1/jobs?id=eq.'+job['id'],headers=xh);r.raise_for_status();assert r.json()==[]
 r=requests.patch(url+'/rest/v1/jobs?id=eq.'+job['id'],headers=oh,json={'status':'ready'});r.raise_for_status();assert r.json()[0]['status']=='ready'
 r=requests.get(url+'/rest/v1/jobs?id=eq.'+job['id'],headers=ch);r.raise_for_status();assert r.json()[0]['status']=='ready'
 print('Verified: club creator approved admin; requested admin cannot self-promote; customer identity enforced; received/unpaid/zero amount forced; customers cannot update; outsiders cannot read; staff update reads back.')
finally:
 if club:requests.delete(url+'/rest/v1/clubs?id=eq.'+club['id'],headers=admin)
 for uid in users:requests.delete(url+'/auth/v1/admin/users/'+uid,headers=admin)
