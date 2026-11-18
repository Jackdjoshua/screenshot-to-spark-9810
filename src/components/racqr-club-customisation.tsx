import {useEffect,useState,type FormEvent} from 'react';
import {Palette,Save,Image as ImageIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Field} from './racqr-new';
import {useWorkspace} from '@/lib/workspace';
import {supabase} from '@/integrations/supabase/client';
import {toast} from 'sonner';

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
  const [availableStrings,setAvailableStrings]=useState('');
  const [saving,setSaving]=useState(false);

  useEffect(()=>{
    setDescription(club?.description||'');
    setWebsite(club?.website||'');
    setContactEmail(club?.contact_email||'');
    setWelcomeMessage(club?.welcome_message||'');
    setLogoUrl(club?.logo_url||'');
    setBrandColor(club?.brand_color||'#0f766e');
    setDefaultPrice(String(club?.default_price??0));
    setAvailableStrings(club?.available_strings||'');
  },[club]);

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
    const price=Number(defaultPrice);
    if(!Number.isFinite(price)||price<0){toast.error('Default stringing price must be zero or greater.');return;}
    setSaving(true);
    const {error}=await supabase.from('clubs').update({
      description:description.trim(),website:website.trim(),contact_email:contactEmail.trim(),
      welcome_message:welcomeMessage.trim(),logo_url:logoUrl.trim(),brand_color:brandColor,
      default_price:price,available_strings:availableStrings.trim()
    }).eq('id',club.id);
    setSaving(false);
    if(error){toast.error(error.message);return;}
    toast.success('Club customisation saved.');
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
          <Field id="club-default-price" label="Default stringing price"><input id="club-default-price" type="number" min="0" step="0.01" value={defaultPrice} onChange={e=>setDefaultPrice(e.target.value)}/></Field>
          <Field id="club-available-strings" label="Available strings (one per line)"><textarea id="club-available-strings" value={availableStrings} onChange={e=>setAvailableStrings(e.target.value)} rows={5} placeholder={'Wilson NXT\nLuxilon ALU Power\nRPM Blast'}/></Field>
        </div>
        <p className="text-xs text-muted-foreground mt-2">These are club defaults for now; they won't change existing jobs.</p>
      </div>
      <Button type="submit" disabled={saving}>{saving?'Saving…':<><Save size={15}/>Save customisation</>}</Button>
    </form>
  </section>;
}
