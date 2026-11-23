import {useEffect,useState,type FormEvent} from 'react';
import {Palette,Save,Globe2,KeyRound,RefreshCw} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Field} from './racqr-new';
import {useWorkspace} from '@/lib/workspace';
import {supabase} from '@/integrations/supabase/client';
import {toast} from 'sonner';

const currencies = [
  {value:'$',label:'US Dollar ($)'},
  {value:'£',label:'British Pound (£)'},
  {value:'€',label:'Euro (€)'},
  {value:'C$',label:'Canadian Dollar (C$)'},
  {value:'A$',label:'Australian Dollar (A$)'},
  {value:'CHF',label:'Swiss Franc (CHF)'},
  {value:'¥',label:'Japanese Yen (¥)'},
];

export function RacqrClubCustomisation(){
  const w=useWorkspace();
  const club=w.club;
  const [description,setDescription]=useState('');
  const [website,setWebsite]=useState('');
  const [contactEmail,setContactEmail]=useState('');
  const [welcomeMessage,setWelcomeMessage]=useState('');
  const [logoUrl,setLogoUrl]=useState('');
  const [brandColor,setBrandColor]=useState('#0f766e');
  const [defaultPrice,setDefaultPrice]=useState('0');
  const [currency,setCurrency]=useState('$');
  const [availableStrings,setAvailableStrings]=useState('');
  const [saving,setSaving]=useState(false);
  const [publicListing,setPublicListing]=useState(false);
  const [city,setCity]=useState('');
  const [country,setCountry]=useState('');
  const [coverImageUrl,setCoverImageUrl]=useState('');
  const [invitationCode,setInvitationCode]=useState('');
  const [codeLoading,setCodeLoading]=useState(false);
  const [hiddenNavigation,setHiddenNavigation]=useState<string[]>([]);
  const [navigationLabels,setNavigationLabels]=useState<Record<string,string>>({});
  const [savingNavigation,setSavingNavigation]=useState(false);

  useEffect(()=>{
    setDescription(club?.description||'');
    setWebsite(club?.website||'');
    setContactEmail(club?.contact_email||'');
    setWelcomeMessage(club?.welcome_message||'');
    setLogoUrl(club?.logo_url||'');
    setBrandColor(club?.brand_color||'#0f766e');
    setDefaultPrice(String(club?.default_price??0));
    setCurrency(club?.currency||'$');
    setAvailableStrings(club?.available_strings||'');
    const extra=club as typeof club & {public_listing?:boolean;city?:string;country?:string;cover_image_url?:string};
    setPublicListing(extra?.public_listing??false);
    setCity(extra?.city||'');
    setCountry(extra?.country||'');
    setCoverImageUrl(extra?.cover_image_url||'');
    const workspace=(club as typeof club & {workspace_settings?:{hiddenNavigation?:string[];navigationLabels?:Record<string,string>}})?.workspace_settings;
    setHiddenNavigation(workspace?.hiddenNavigation||[]);
    setNavigationLabels(workspace?.navigationLabels||{});
    setInvitationCode('');
  },[club]);

  useEffect(()=>{let active=true;if(!club||!w.isAdmin)return;setCodeLoading(true);(supabase as any).from('club_invitation_codes').select('code').eq('club_id',club.id).maybeSingle().then(({data,error}:{data:{code:string}|null,error:unknown})=>{if(!active)return;if(!error)setInvitationCode(data?.code||'');setCodeLoading(false);});return()=>{active=false};},[club?.id,w.isAdmin]);

  if(!w.isAdmin||!club)return null;

  async function save(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(!club)return;
    if(logoUrl.trim()){
      try{const u=new URL(logoUrl.trim());if(!['http:','https:'].includes(u.protocol))throw new Error();}
      catch{toast.error('Enter a valid logo URL beginning with https://');return;}
    }
    if(website.trim()){
      try{const u=new URL(website.trim());if(!['http:','https:'].includes(u.protocol))throw new Error();}
      catch{toast.error('Enter a valid website URL beginning with https://');return;}
    }
    if(coverImageUrl.trim()){try{const u=new URL(coverImageUrl.trim());if(!['http:','https:'].includes(u.protocol))throw new Error();}catch{toast.error('Enter a valid cover image URL beginning with https://');return;}}
    const price=Number(defaultPrice);
    if(!Number.isFinite(price)||price<0){toast.error('Default stringing price must be zero or greater.');return;}
    setSaving(true);
    const {error}=await supabase.from('clubs').update({
      description:description.trim(),
      website:website.trim(),
      contact_email:contactEmail.trim(),
      welcome_message:welcomeMessage.trim(),
      logo_url:logoUrl.trim(),
      brand_color:brandColor,
      default_price:price,
      currency,
      available_strings:availableStrings.trim(),
    }).eq('id',club.id);
    if(error){setSaving(false);toast.error(error.message);return;}
    const directoryResult=await (supabase as any).from('clubs').update({
      public_listing:publicListing,
      city:city.trim(),
      country:country.trim(),
      cover_image_url:coverImageUrl.trim(),
    }).eq('id',club.id);
    setSaving(false);
    if(directoryResult.error){toast.warning('Your existing customisation was saved, but worldwide listing settings need the RacQr Worldwide database update.');}
    else toast.success('Club customisation saved.');
    await w.refresh();
  }

  return <section className="settings-section">
    <h2><Palette size={17} className="inline mr-2"/>Club customisation</h2>
    <p className="text-xs text-muted-foreground mb-4">Give your club its own identity and set the defaults your stringing team uses. These settings belong only to {club.name}.</p>
    <form onSubmit={save} className="space-y-5">
      <div>
        <h3 className="font-bold text-sm mb-3">Brand identity</h3>
        <div className="field-grid">
          <Field id="club-description" label="Club description"><textarea id="club-description" value={description} onChange={e=>setDescription(e.target.value)} rows={3} maxLength={500} placeholder="A short introduction to your club"/></Field>
          <Field id="club-website" label="Website"><input id="club-website" type="url" value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://yourclub.com"/></Field>
          <Field id="club-contact-email" label="Contact email"><input id="club-contact-email" type="email" value={contactEmail} onChange={e=>setContactEmail(e.target.value)} placeholder="hello@yourclub.com"/></Field>
          <Field id="club-logo-url" label="Logo image URL"><input id="club-logo-url" type="url" value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} placeholder="https://..."/></Field>
        </div>
        {logoUrl.trim()&&<div className="mt-3 flex items-center gap-3"><img src={logoUrl} alt="Club logo preview" className="h-14 w-14 rounded-lg border object-contain" onError={e=>{e.currentTarget.style.display='none'}}/><span className="text-xs text-muted-foreground">Logo preview</span></div>}
        <div className="mt-4 flex items-center gap-3">
          <label htmlFor="club-brand-color" className="text-sm font-medium">Brand colour</label>
          <input id="club-brand-color" aria-label="Brand colour" type="color" value={brandColor} onChange={e=>setBrandColor(e.target.value)} className="h-10 w-14 cursor-pointer rounded border p-1"/>
          <span className="font-mono text-xs text-muted-foreground">{brandColor}</span>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-sm mb-3">Player welcome message</h3>
        <Field id="club-welcome-message" label="Message shown to your club members"><textarea id="club-welcome-message" value={welcomeMessage} onChange={e=>setWelcomeMessage(e.target.value)} rows={3} maxLength={500} placeholder="Welcome to our club's RacQr space…"/></Field>
      </div>
      <div>
        <h3 className="font-bold text-sm mb-3">Stringing preferences</h3>
        <div className="field-grid">
          <Field id="club-default-price" label={`Default stringing price (${currency})`}><input id="club-default-price" type="number" min="0" step="0.01" inputMode="decimal" value={defaultPrice} onChange={e=>setDefaultPrice(e.target.value)}/></Field>
          <Field id="club-currency" label="Currency"><select id="club-currency" value={currency} onChange={e=>setCurrency(e.target.value)}>{currencies.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
          <Field id="club-available-strings" label="Available strings (one per line)"><textarea id="club-available-strings" value={availableStrings} onChange={e=>setAvailableStrings(e.target.value)} rows={5} placeholder={'Wilson NXT\nLuxilon ALU Power\nRPM Blast'}/></Field>
        </div>
        <p className="text-xs text-muted-foreground mt-2">These are club defaults for now; they won't change existing jobs.</p>
      </div>
      <div className="border-t pt-5">
        <h3 className="font-bold text-sm mb-2">Workspace layout</h3>
        <p className="text-xs text-muted-foreground mb-4">Choose which tools appear in this club's main navigation and give them names that match how your team works.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([{key:'newJob',label:'New job',defaultName:'New'},{key:'scan',label:'QR scanner',defaultName:'Scan'},{key:'jobs',label:'Job list',defaultName:'Jobs'},{key:'calendar',label:'Calendar',defaultName:'Calendar'},{key:'profile',label:'Profile',defaultName:'Profile'},{key:'worldwide',label:'Worldwide directory',defaultName:'Worldwide'}] as const).map(item=><div key={item.key} className="rounded-md border p-3 space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-4 w-4 min-h-0" checked={!hiddenNavigation.includes(item.key)} onChange={e=>setHiddenNavigation(current=>e.target.checked?current.filter(key=>key!==item.key):[...current,item.key])}/>{item.label}</label>
            <input aria-label={item.label+' navigation label'} value={navigationLabels[item.key]||''} onChange={e=>setNavigationLabels(current=>({...current,[item.key]:e.target.value}))} placeholder={item.defaultName+' (default)'}/>
          </div>)}
        </div>
        <Button type="button" className="mt-4" disabled={savingNavigation} onClick={async()=>{
          if(!club)return;
          setSavingNavigation(true);
          const {error}=await supabase.from('clubs').update({workspace_settings:{hiddenNavigation,navigationLabels:Object.fromEntries(Object.entries(navigationLabels).map(([key,value])=>[key,value.trim()]).filter(([,value])=>value))}}).eq('id',club.id);
          setSavingNavigation(false);
          if(error){toast.error(error.message);return;}
          await w.refresh();
          toast.success('Workspace layout saved.');
        }}>{savingNavigation?'Saving…':<><Save size={15}/>Save workspace layout</>}</Button>
      </div>
      <Button type="submit" disabled={saving}>{saving?'Saving…':<><Save size={15}/>Save customisation</>}</Button>
    </form>
  </section>;
}
