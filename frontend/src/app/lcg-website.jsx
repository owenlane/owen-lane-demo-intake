import { useState, useEffect, useRef, createContext, useContext } from "react";

/*
 * LANE CAMPOS GROUP — v4: Screenshot-Optimized Premium Website
 * Fonts: Playfair Display + Outfit
 * Palette: #040404 · whites · #2DD4A0
 */

const SH = {
  intake: "/mnt/user-data/uploads/Screenshot_2026-03-09_183652.png",
  dash: "/mnt/user-data/uploads/Screenshot_2026-03-09_183756.png",
  detail: "/mnt/user-data/uploads/Screenshot_2026-03-09_183854.png",
  confirm: "/mnt/user-data/uploads/Screenshot_2026-03-09_184046.png",
  login: "/mnt/user-data/uploads/Screenshot_2026-03-09_184131.png",
};

const EM="#2DD4A0",ED="rgba(45,212,160,0.06)",EG="rgba(45,212,160,0.13)",ES="rgba(45,212,160,0.22)";
const SF="rgba(255,255,255,0.016)",SFH="rgba(255,255,255,0.032)",BD="rgba(255,255,255,0.05)",BDH="rgba(255,255,255,0.1)",BK="#040404";

const _f=document.createElement("link");_f.rel="stylesheet";
_f.href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Outfit:wght@200;300;400;500;600&display=swap";
document.head.appendChild(_f);
const SE="'Playfair Display',Georgia,serif",SA="'Outfit',-apple-system,sans-serif";

const Ctx=createContext({pg:"home"});
const usePg=()=>useContext(Ctx);
function Router({children}){
  const[pg,sP]=useState(()=>(window.location.hash.replace("#/","").replace("#",""))||"home");
  useEffect(()=>{const fn=()=>{sP((window.location.hash.replace("#/","").replace("#",""))||"home");window.scrollTo(0,0);};window.addEventListener("hashchange",fn);return()=>window.removeEventListener("hashchange",fn);},[]);
  return<Ctx.Provider value={{pg}}>{children}</Ctx.Provider>;
}

function useVis(t=0.06){const r=useRef(null);const[v,sV]=useState(false);useEffect(()=>{const el=r.current;if(!el)return;const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){sV(true);o.unobserve(el);}},{threshold:t});o.observe(el);return()=>o.disconnect();},[t]);return[r,v];}
function V({children,d=0,className:c="",y=26}){const[r,v]=useVis();return<div ref={r} className={c} style={{opacity:v?1:0,transform:v?"translateY(0)":`translateY(${y}px)`,transition:`opacity 0.95s cubic-bezier(.16,1,.3,1) ${d}s, transform 0.95s cubic-bezier(.16,1,.3,1) ${d}s`}}>{children}</div>;}

function Tag({t,center:c}){return<div className={`flex items-center gap-3 mb-7 ${c?"justify-center":""}`}><div className="w-10 h-px" style={{background:`linear-gradient(90deg,transparent,${EM})`}}/><span className="text-[10px] font-medium tracking-[0.3em] uppercase" style={{color:EM,fontFamily:SA}}>{t}</span>{c&&<div className="w-10 h-px" style={{background:`linear-gradient(90deg,${EM},transparent)`}}/>}</div>;}
function D2({children,c=""}){return<h2 className={`text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.08] tracking-[-0.015em] ${c}`} style={{fontFamily:SE,fontWeight:400}}>{children}</h2>;}
function D3({children,c=""}){return<h3 className={`text-[clamp(1.4rem,3.2vw,2.2rem)] leading-[1.12] tracking-[-0.01em] ${c}`} style={{fontFamily:SE,fontWeight:400}}>{children}</h3>;}
function Tx({children,c=""}){return<p className={`text-[14px] leading-[1.8] ${c}`} style={{fontFamily:SA,fontWeight:300,color:"rgba(255,255,255,0.46)"}}>{children}</p>;}
function Btn({children,href,sec,sm,onClick}){const sz=sm?"px-5 py-2.5 text-[11px]":"px-7 py-3.5 text-[12.5px]";const st=sec?{color:"rgba(255,255,255,0.48)",fontFamily:SA,border:`1px solid ${BD}`}:{background:EM,color:BK,fontFamily:SA,boxShadow:`0 0 28px ${ED}`};const cl=`inline-flex items-center gap-2 font-medium tracking-[0.03em] rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] ${sec?"hover:bg-white/[0.02] hover:border-white/[0.09]":""} ${sz}`;if(href)return<a href={href} className={cl} style={st}>{children}</a>;return<button onClick={onClick} className={cl} style={st}>{children}</button>;}
function Crd({children,em}){return<div className="p-6 rounded-2xl h-full transition-all duration-500" style={{background:SF,border:`1px solid ${BD}`}} onMouseEnter={e=>{e.currentTarget.style.borderColor=em?EG:BDH;e.currentTarget.style.background=SFH;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=BD;e.currentTarget.style.background=SF;}}>{children}</div>;}
function Sec({children,id,c=""}){return<section id={id} className={`relative py-28 md:py-36 ${c}`} style={{background:BK}}>{children}</section>;}
function W({children,c=""}){return<div className={`max-w-[1200px] mx-auto px-6 md:px-8 ${c}`}>{children}</div>;}
function Hr(){return<div className="max-w-[1200px] mx-auto px-8"><div style={{height:"1px",background:`linear-gradient(90deg,transparent 5%,${BD} 50%,transparent 95%)`}}/></div>;}
function Ic({d,s=21}){return<svg width={s} height={s} fill="none" stroke={EM} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={d}/></svg>;}
const I={clip:"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 3h6v4H9z",clk:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2",alrt:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",db:"M12 2C6.5 2 3 3.3 3 5v14c0 1.7 3.5 3 9 3s9-1.3 9-3V5c0-1.7-3.5-3-9-3zM3 12c0 1.7 3.5 3 9 3s9-1.3 9-3",fl:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8",sh:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",mn:"M2 3h20v14H2zM8 21h8M12 17v4",st:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",dl:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",us:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",pr:"M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z",ck:"M20 6L9 17l-5-5",ar:"M5 12h14M12 5l7 7-7 7",qr:"M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM17 14h4v3h-4zM14 17h3v4h-3zM17 20h4",bl:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",ly:"M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"};

/* ─── PREMIUM SCREENSHOT FRAME ─── */
function Shot({src,label,cap,badge,tilt,hero}){
  return(
    <div className={`group relative ${hero?"":""}`.trim()}>
      {/* Ambient glow */}
      <div className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{background:`radial-gradient(ellipse at center, ${ED}, transparent 70%)`}}/>
      <div className={`relative overflow-hidden transition-all duration-500 group-hover:translate-y-[-2px] ${hero?"rounded-2xl":"rounded-xl"}`}
        style={{
          border:`1px solid ${BD}`,
          background:`linear-gradient(170deg,#0a0a0a 0%,${BK} 100%)`,
          boxShadow:`0 8px 60px rgba(0,0,0,0.6), 0 2px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.015) inset`,
          ...(tilt?{transform:"perspective(1200px) rotateX(2deg)",transformOrigin:"bottom center"}:{}),
        }}>
        {/* Chrome */}
        <div className={`flex items-center justify-between ${hero?"px-6 py-3.5":"px-4 py-2.5"}`} style={{borderBottom:`1px solid ${BD}`,background:"rgba(255,255,255,0.006)"}}>
          <div className="flex items-center gap-3">
            <div className="flex gap-[5px]">
              {[0,1,2].map(i=><div key={i} className={`${hero?"w-[9px] h-[9px]":"w-[7px] h-[7px]"} rounded-full`} style={{background:"rgba(255,255,255,0.055)"}}/>)}
            </div>
            {label&&<div className="flex items-center gap-2 ml-2"><div className="w-[5px] h-[5px] rounded-full" style={{background:EM,opacity:0.6}}/><span className={`${hero?"text-[10px]":"text-[9px]"} tracking-[0.18em] uppercase font-medium`} style={{color:"rgba(255,255,255,0.2)",fontFamily:SA}}>{label}</span></div>}
          </div>
          {badge&&<div className="px-2.5 py-1 rounded-md" style={{background:ED,border:`1px solid ${EG}`}}><span className="text-[9px] tracking-[0.12em] uppercase font-medium" style={{color:EM,fontFamily:SA}}>{badge}</span></div>}
        </div>
        {/* Image */}
        <div className="relative bg-white">
          <img src={src} alt={label||"System"} className="w-full h-auto block" loading="lazy"/>
          <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{background:`linear-gradient(to top,rgba(4,4,4,0.15),transparent)`}}/>
        </div>
      </div>
      {/* Reflection */}
      {hero&&<div className="mt-px overflow-hidden rounded-b-2xl h-[40px] opacity-[0.04] pointer-events-none" style={{transform:"scaleY(-1)",filter:"blur(2px)"}}><img src={src} alt="" className="w-full h-auto block" style={{marginTop:"-100%"}}/></div>}
      {cap&&<p className={`${hero?"mt-5":"mt-3"} text-[10.5px] tracking-[0.05em] text-center`} style={{color:"rgba(255,255,255,0.2)",fontFamily:SA,fontWeight:300}}>{cap}</p>}
    </div>
  );
}

/* ─── Form ─── */
function Form({compact}){
  const[f,sF]=useState({n:"",p:"",e:"",ph:"",i:""});const[ok,sO]=useState(false);
  const u=k=>e=>sF(x=>({...x,[k]:e.target.value}));
  const iS={background:"rgba(255,255,255,0.022)",border:`1px solid ${BD}`,fontFamily:SA,fontWeight:300,fontSize:"13px",color:"white",letterSpacing:"0.01em"};
  if(ok)return<div className={`${compact?"p-8":"p-10 md:p-12"} rounded-2xl text-center`} style={{background:ED,border:`1px solid ${EG}`}}><div className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{background:EG}}><Ic d={I.ck} s={22}/></div><h3 className="text-white text-xl mb-2" style={{fontFamily:SE}}>Demo Requested</h3><Tx>We'll reach out within one business day.</Tx></div>;
  return(
    <div className={`${compact?"p-6 md:p-8":"p-7 md:p-10"} rounded-2xl`} style={{background:SF,border:`1px solid ${BD}`,boxShadow:`0 8px 40px rgba(0,0,0,0.3)`}}>
      <h3 className="text-white text-lg mb-1.5" style={{fontFamily:SE}}>Book a Private Demo</h3>
      <p className="text-[11.5px] mb-6" style={{color:"rgba(255,255,255,0.25)",fontFamily:SA,fontWeight:300}}>20-minute walkthrough · No commitment</p>
      <div className="space-y-3">
        {[{k:"n",p:"Full Name",t:"text"},{k:"p",p:"Practice Name",t:"text"},{k:"e",p:"Email Address",t:"email"},{k:"ph",p:"Phone Number",t:"tel"}].map(x=>(<input key={x.k} type={x.t} placeholder={x.p} value={f[x.k]} onChange={u(x.k)} className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300" style={iS} onFocus={e=>e.target.style.borderColor=EG} onBlur={e=>e.target.style.borderColor=BD}/>))}
        <select value={f.i} onChange={u("i")} className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300" style={{...iS,appearance:"none",color:f.i?"white":"rgba(255,255,255,0.25)"}}>
          <option value="" disabled>Current Intake Setup</option><option value="paper">Paper Forms</option><option value="pdf">Downloadable PDFs</option><option value="3p">Third-Party Platform</option><option value="mix">Mixed Methods</option><option value="none">No Formal Process</option>
        </select>
        <button onClick={()=>sO(true)} className="w-full py-3.5 rounded-xl text-[12.5px] font-medium tracking-[0.03em] transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] mt-1" style={{background:EM,color:BK,fontFamily:SA,boxShadow:`0 0 24px ${ED}`}}>Request Private Demo</button>
      </div>
    </div>
  );
}

/* ━━━ NAV ━━━ */
function Nav(){
  const[sc,sSc]=useState(false);const[mo,sMo]=useState(false);const{pg}=usePg();
  useEffect(()=>{const h=()=>sSc(window.scrollY>50);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);
  const lk=[{l:"Home",k:"home"},{l:"System",k:"system"},{l:"About",k:"about"},{l:"Contact",k:"contact"}];
  return<>
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-700" style={{background:sc?"rgba(4,4,4,0.92)":"rgba(4,4,4,0.45)",backdropFilter:"blur(28px) saturate(1.3)",borderBottom:`1px solid ${sc?BD:"transparent"}`}}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 h-[68px] flex items-center justify-between">
        <a href="#/home" className="flex items-center gap-3 group" onClick={()=>sMo(false)}><div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105" style={{background:EM}}><span className="text-[9px] font-semibold tracking-tight" style={{color:BK,fontFamily:SA}}>LCG</span></div><span className="text-white text-[13px] font-medium hidden sm:block" style={{fontFamily:SA}}>Lane Campos Group</span></a>
        <div className="hidden md:flex items-center gap-10">{lk.map(l=><a key={l.k} href={`#/${l.k}`} className="text-[11px] font-medium tracking-[0.05em] transition-colors duration-300 hover:text-white" style={{color:pg===l.k?"white":"rgba(255,255,255,0.32)",fontFamily:SA}}>{l.l}</a>)}<Btn href="#/demo" sm>Book Demo</Btn></div>
        <button className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px]" onClick={()=>sMo(!mo)}><div className="w-5 h-px bg-white/50 transition-all duration-300" style={{transform:mo?"rotate(45deg) translate(1.5px,3px)":"none"}}/><div className="w-5 h-px bg-white/50 transition-all duration-300" style={{opacity:mo?0:1}}/><div className="w-5 h-px bg-white/50 transition-all duration-300" style={{transform:mo?"rotate(-45deg) translate(1.5px,-3px)":"none"}}/></button>
      </div>
    </nav>
    {mo&&<div className="fixed inset-0 z-40 pt-[68px]" style={{background:"rgba(4,4,4,0.98)"}}><div className="p-8 space-y-6">{lk.map(l=><a key={l.k} href={`#/${l.k}`} className="block text-2xl" style={{fontFamily:SE,color:pg===l.k?"white":"rgba(255,255,255,0.3)"}} onClick={()=>sMo(false)}>{l.l}</a>)}<a href="#/demo" onClick={()=>sMo(false)} className="block mt-6 px-6 py-3 rounded-xl text-center text-[13px] font-medium" style={{background:EM,color:BK,fontFamily:SA}}>Book a Private Demo</a></div></div>}
  </>;
}

/* ━━━ FOOTER ━━━ */
function Footer(){
  return<footer style={{borderTop:`1px solid ${BD}`,background:BK}} className="py-14"><W><div className="grid grid-cols-1 md:grid-cols-12 gap-10"><div className="md:col-span-4"><div className="flex items-center gap-3 mb-3"><div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:EM}}><span className="text-[8.5px] font-semibold" style={{color:BK,fontFamily:SA}}>LCG</span></div><span className="text-white text-[13px] font-medium" style={{fontFamily:SA}}>Lane Campos Group</span></div><p className="text-[11.5px] leading-[1.7]" style={{color:"rgba(255,255,255,0.18)",fontFamily:SA,fontWeight:300}}>Digital intake infrastructure<br/>for private practices.</p></div><div className="md:col-span-3"><p className="text-[9.5px] tracking-[0.22em] uppercase font-medium mb-4" style={{color:"rgba(255,255,255,0.18)",fontFamily:SA}}>Navigation</p>{["home","system","demo","about","contact"].map(p=><a key={p} href={`#/${p}`} className="block text-[11.5px] capitalize mb-2 transition-colors hover:text-white/35" style={{color:"rgba(255,255,255,0.18)",fontFamily:SA,fontWeight:300}}>{p}</a>)}</div><div className="md:col-span-5 md:text-right"><p className="text-[9.5px] tracking-[0.22em] uppercase font-medium mb-4" style={{color:"rgba(255,255,255,0.18)",fontFamily:SA}}>Contact</p><a href="mailto:lanecamposgroup@gmail.com" className="text-[12px] transition-colors hover:text-white/35 block mb-5" style={{color:"rgba(255,255,255,0.22)",fontFamily:SA,fontWeight:300}}>lanecamposgroup@gmail.com</a><p className="text-[10px]" style={{color:"rgba(255,255,255,0.08)",fontFamily:SA}}>© {new Date().getFullYear()} Lane Campos Group</p></div></div></W></footer>;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HOME
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Home(){
  return<>
    {/* HERO */}
    <section className="relative overflow-hidden pt-16" style={{background:BK}}>
      <div className="absolute inset-0"><div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,backgroundSize:"180px"}}/><div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1100px] h-[900px] opacity-[0.05]" style={{background:`radial-gradient(ellipse,${EM},transparent 60%)`}}/></div>
      <W c="relative pt-20 pb-8 md:pt-28 md:pb-12 w-full">
        <V><Tag t="Digital Intake Infrastructure"/></V>
        <V d={0.05}><h1 className="text-[clamp(2.4rem,6.2vw,5rem)] leading-[1.04] tracking-[-0.025em] text-white max-w-[800px]" style={{fontFamily:SE}}>Replace outdated patient intake with <span style={{color:EM}}>digital infrastructure.</span></h1></V>
        <V d={0.09}><p className="mt-3 text-[1.05rem] italic" style={{fontFamily:SE,color:"rgba(255,255,255,0.24)"}}>Built for private practices.</p></V>
        <V d={0.13}><Tx c="mt-6 max-w-[500px]">HIPAA-aware intake systems that eliminate manual form handling, reduce front-desk processing, and modernize patient onboarding.</Tx></V>
        <V d={0.18}><div className="mt-9 flex flex-wrap gap-4"><Btn href="#/demo"><span>Book a Private Demo</span><Ic d={I.ar} s={13}/></Btn><Btn href="#/system" sec>View System Walkthrough</Btn></div></V>

        {/* Hero product showcase — perspective tilt */}
        <V d={0.32} y={40}>
          <div className="mt-20 md:mt-24 relative">
            <div className="absolute -inset-10 rounded-3xl opacity-[0.04]" style={{background:`radial-gradient(ellipse at top center,${EM},transparent 50%)`}}/>
            <div className="relative">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-[7px] h-[7px] rounded-full" style={{background:EM,boxShadow:`0 0 8px ${ES}`}}><div className="w-full h-full rounded-full animate-pulse" style={{background:EM}}/></div>
                <span className="text-[9.5px] tracking-[0.25em] uppercase font-medium" style={{color:EM,fontFamily:SA}}>Live System Preview</span>
              </div>
              <Shot src={SH.dash} label="Submission Command Center" badge="System Live" cap="Real-time practice overview — 20 loaded records, 16 new submissions awaiting review, QR patient access, and live intake URL." hero tilt/>
            </div>
          </div>
        </V>
      </W>

      {/* Trust metrics */}
      <div className="relative mt-8 md:mt-12 pb-12" style={{borderTop:`1px solid ${BD}`}}>
        <W><V d={0.4}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
            {[{n:"100%",l:"Digital intake"},{n:"<2 min",l:"Average completion"},{n:"Instant",l:"Office notification"},{n:"0",l:"Manual re-entry"}].map((m,j)=>(
              <div key={j} className="text-center"><p className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-1" style={{fontFamily:SE}}>{m.n}</p><p className="text-[10.5px] tracking-[0.1em] uppercase" style={{color:"rgba(255,255,255,0.2)",fontFamily:SA,fontWeight:300}}>{m.l}</p></div>
            ))}
          </div>
        </V></W>
      </div>
    </section>

    <Hr/>

    {/* PROBLEM */}
    <Sec><W>
      <div className="max-w-[600px]">
        <V><Tag t="The Problem"/></V>
        <V d={0.04}><D2><span className="text-white">Most practices still run intake</span> <span className="italic" style={{color:"rgba(255,255,255,0.18)"}}>like it's 2005.</span></D2></V>
      </div>
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[{i:I.clip,t:"Paper Forms",d:"Clipboards in the lobby. Every patient. Every visit."},{i:I.fl,t:"Downloadable PDFs",d:"Website PDFs patients rarely complete."},{i:I.db,t:"Manual Re-Entry",d:"Staff re-types form data. Errors multiply."},{i:I.clk,t:"Wasted Time",d:"15–20 minutes per patient at the desk."},{i:I.alrt,t:"Scattered Records",d:"Data across paper, email, and fax."}].map((p,j)=>(<V key={j} d={j*0.04}><Crd><div className="mb-3.5"><Ic d={p.i} s={19}/></div><h4 className="text-white text-[13px] font-medium mb-1" style={{fontFamily:SA}}>{p.t}</h4><p className="text-[12px] leading-[1.6]" style={{color:"rgba(255,255,255,0.3)",fontFamily:SA,fontWeight:300}}>{p.d}</p></Crd></V>))}
      </div>
    </W></Sec>

    <Hr/>

    {/* SOLUTION */}
    <Sec>
      <div className="absolute inset-0 opacity-[0.008]" style={{backgroundImage:`linear-gradient(rgba(45,212,160,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(45,212,160,0.6) 1px,transparent 1px)`,backgroundSize:"72px 72px"}}/>
      <W c="relative"><div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
        <div className="lg:col-span-5">
          <V><Tag t="The Solution"/></V>
          <V d={0.04}><D2><span className="text-white">A modern intake workflow.</span><br/><span className="italic" style={{color:"rgba(255,255,255,0.2)"}}>Installed for you.</span></D2></V>
          <V d={0.08}><Tx c="mt-5 max-w-[360px]">LCG replaces your entire intake process with structured digital infrastructure — branded to your practice, operational from day one.</Tx></V>
        </div>
        <div className="lg:col-span-6 lg:col-start-7"><V d={0.1}>
          <div className="p-6 md:p-8 rounded-2xl" style={{background:SF,border:`1px solid ${BD}`}}>
            {[{n:"01",t:"Patient scans QR or receives a secure link."},{n:"02",t:"Completes branded digital intake on their device."},{n:"03",t:"Office receives structured submission instantly."},{n:"04",t:"Staff reviews in the dashboard — zero re-entry."},{n:"05",t:"Record is printable, exportable, workflow-ready."},{n:"06",t:"Office receives instant email notification."}].map((s,j)=>(<div key={j} className="flex gap-4 items-start"><div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10.5px] font-medium" style={{background:ED,color:EM,fontFamily:SA,border:`1px solid rgba(45,212,160,0.08)`}}>{s.n}</div>{j<5&&<div className="w-px flex-1 min-h-[16px] my-1" style={{background:BD}}/>}</div><div className={`pt-1.5 ${j<5?"pb-4":""}`}><p className="text-[12.5px] leading-[1.7] text-white/70" style={{fontFamily:SA,fontWeight:300}}>{s.t}</p></div></div>))}
          </div>
        </V></div>
      </div></W>
    </Sec>

    <Hr/>

    {/* WHAT'S INCLUDED */}
    <Sec><W>
      <div className="text-center max-w-[540px] mx-auto">
        <V><Tag t="What's Included" center/></V>
        <V d={0.04}><D2 c="text-center"><span className="text-white">Everything your practice needs.</span><br/><span className="italic" style={{color:"rgba(255,255,255,0.18)"}}>Nothing it doesn't.</span></D2></V>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-16">
        {[{i:I.fl,t:"Branded Digital Intake",d:"Custom multi-step form — personal info, insurance, medical history, consent."},{i:I.sh,t:"Secure Submission Workflow",d:"HIPAA-aware encrypted handling from patient device to office."},{i:I.mn,t:"Internal Office Dashboard",d:"Submission Command Center with live counts, QR codes, and status overview."},{i:I.ly,t:"Submission Status Tracking",d:"New → Reviewed → Completed. Every intake tracked through your process."},{i:I.qr,t:"QR Patient Access",d:"Front-desk-ready scannable codes for lobby and appointment cards."},{i:I.dl,t:"Exportable Intake Data",d:"CSV export for integration with your practice management tools."},{i:I.pr,t:"Printable Patient Records",d:"Formatted print-ready records generated from any submission."},{i:I.st,t:"Installation & Configuration",d:"Full setup, branding, deployment, and staff onboarding by LCG."},{i:I.bl,t:"Instant Office Notifications",d:"Email alerts the moment a new patient intake is submitted."}].map((f,j)=>(<V key={j} d={j*0.03}><Crd em><div className="mb-3.5"><Ic d={f.i} s={19}/></div><h4 className="text-white text-[13px] font-medium mb-1" style={{fontFamily:SA}}>{f.t}</h4><p className="text-[12px] leading-[1.6]" style={{color:"rgba(255,255,255,0.3)",fontFamily:SA,fontWeight:300}}>{f.d}</p></Crd></V>))}
      </div>
    </W></Sec>

    <Hr/>

    {/* PLATFORM — Bento screenshot showcase */}
    <Sec>
      <W>
        <div className="max-w-[540px] mx-auto text-center mb-14">
          <V><Tag t="The Platform" center/></V>
          <V d={0.04}><D2 c="text-center">See the system in use.</D2></V>
          <V d={0.07}><Tx c="mt-4 text-center">Real screenshots from a live installed system — patient intake, office dashboard, submission review, and confirmation.</Tx></V>
        </div>
        {/* Bento layout — featured + supporting */}
        <div className="space-y-4">
          <V d={0.05}><Shot src={SH.dash} label="Office Dashboard" badge="Command Center" cap="Practice overview with 20 loaded records, live status metrics, QR patient access code, and intake URL management." hero/></V>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <V d={0.1}><Shot src={SH.intake} label="Patient Intake" badge="Step 1 of 4" cap="Multi-step branded form — personal info, insurance, medical history, consent."/></V>
            <V d={0.14}><Shot src={SH.detail} label="Submission Review" badge="New" cap="Patient data, workflow status tracking, print access — Owen Lane, Feb 23, 2026."/></V>
            <V d={0.18}><Shot src={SH.confirm} label="Patient Confirmation" cap="Secure confirmation with unique ID and office contact information."/></V>
          </div>
        </div>
      </W>
    </Sec>

    <Hr/>

    {/* WHY LCG */}
    <Sec>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.025]" style={{background:`radial-gradient(ellipse,${EM},transparent 60%)`}}/>
      <W c="relative"><div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <V><Tag t="Why LCG"/></V>
          <V d={0.04}><D2><span className="text-white">Why practices choose</span> <span className="italic" style={{color:EM}}>Lane Campos Group.</span></D2></V>
        </div>
        <div className="lg:col-span-7 lg:col-start-6 space-y-3">
          {[{i:I.us,t:"Built for private practice",d:"Designed around front-desk teams and practice staff — not adapted from enterprise."},{i:I.st,t:"Branded to your practice",d:"Patients see your name and identity. Not a third-party portal."},{i:I.sh,t:"No feature bloat",d:"Focused infrastructure. Patient intake — nothing more."},{i:I.mn,t:"Installed for your office",d:"Configured, deployed, and handed to your team as a working system."}].map((r,j)=>(<V key={j} d={j*0.04}><div className="flex gap-5 p-5 rounded-2xl transition-all duration-500" style={{background:SF,border:`1px solid ${BD}`}} onMouseEnter={e=>{e.currentTarget.style.borderColor=BDH;e.currentTarget.style.background=SFH;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=BD;e.currentTarget.style.background=SF;}}><div className="shrink-0 mt-0.5"><Ic d={r.i} s={19}/></div><div><h4 className="text-white text-[13.5px] font-medium mb-0.5" style={{fontFamily:SA}}>{r.t}</h4><p className="text-[12.5px] leading-[1.6]" style={{color:"rgba(255,255,255,0.33)",fontFamily:SA,fontWeight:300}}>{r.d}</p></div></div></V>))}
        </div>
      </div></W>
    </Sec>

    <Hr/>

    {/* CTA */}
    <Sec>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] opacity-[0.03]" style={{background:`radial-gradient(ellipse,${EM},transparent 60%)`}}/>
      <W c="relative"><div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
        <div className="lg:col-span-5">
          <V><Tag t="Get Started"/></V>
          <V d={0.04}><D2><span className="text-white">See it running</span><br/><span className="italic" style={{color:"rgba(255,255,255,0.2)"}}>for your practice.</span></D2></V>
          <V d={0.08}><Tx c="mt-5 max-w-[340px]">Request a private demo. We'll walk through the system customized to your specialty.</Tx></V>
          <V d={0.12}><div className="mt-9 space-y-3.5">{["Live system walkthrough","Current workflow review","Custom implementation plan","Notification workflow demo"].map((x,j)=>(<div key={j} className="flex items-center gap-3"><Ic d={I.ck} s={14}/><span className="text-[12.5px]" style={{color:"rgba(255,255,255,0.4)",fontFamily:SA,fontWeight:300}}>{x}</span></div>))}</div></V>
        </div>
        <div className="lg:col-span-6 lg:col-start-7"><V d={0.1}><Form/></V></div>
      </div></W>
    </Sec>
  </>;
}

/* ━━━ SYSTEM ━━━ */
function SystemPg(){
  const secs=[
    {lb:"Patient Experience",ti:"Branded intake on any device.",ds:"A 4-step digital form — Personal Info, Insurance, Medical History, and Consent — branded with your practice name and compliant with HIPAA requirements. Patients complete it on their phone before arrival.",im:SH.intake,cp:"Step 1 of 4 — Personal Information capture with practice branding.",bd:"Step 1 of 4",rv:false},
    {lb:"Submission Confirmation",ti:"Instant confirmation for patients.",ds:"After submission, patients see a confirmation screen with a unique ID (e.g. 9f538e03...) and direct office contact. The record is securely stored and your office is immediately notified.",im:SH.confirm,cp:"Secure confirmation with unique submission ID and office contact.",bd:"Confirmed",rv:true},
    {lb:"Office Dashboard",ti:"Your Submission Command Center.",ds:"Live metrics at a glance — loaded records, new submissions needing review, in-workflow count, and completed intakes. Plus QR code access and the live intake URL your patients use.",im:SH.dash,cp:"20 records loaded, 16 new submissions, QR patient access, system live.",bd:"System Live",rv:false},
    {lb:"Submission Review",ti:"Full detail on every intake.",ds:"Open any submission to see patient identity, contact info, address, date of birth — plus a workflow tracker (New → Reviewed → Completed) and one-click print access. Real data from Owen Lane, submitted Feb 23, 2026.",im:SH.detail,cp:"Patient detail, workflow status, print-ready — submission f327e0a0.",bd:"New",rv:true},
    {lb:"Secure Access",ti:"Encrypted, staff-only admin login.",ds:"Protected behind secure authentication with encrypted connection. Only authorized office staff access patient submissions. Practice-branded login screen with HIPAA compliance badge.",im:SH.login,cp:"Staff-only admin access with encrypted connection.",bd:"Encrypted",rv:false},
  ];
  return<>
    <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden" style={{background:BK}}>
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] opacity-[0.05]" style={{background:`radial-gradient(ellipse,${EM},transparent 60%)`}}/>
      <W c="relative">
        <V><Tag t="System Overview"/></V>
        <V d={0.04}><h1 className="text-[clamp(2.2rem,5.2vw,4.2rem)] leading-[1.06] tracking-[-0.02em] text-white max-w-[660px]" style={{fontFamily:SE}}>The complete digital intake platform.</h1></V>
        <V d={0.08}><Tx c="mt-5 max-w-[460px]">Every screen, every workflow, every notification — structured, secure, and branded to your practice.</Tx></V>
        <V d={0.12}><div className="mt-8"><Btn href="#/demo">Book a Private Demo</Btn></div></V>
      </W>
    </section>
    <Hr/>
    {secs.map((s,j)=><div key={j}><Sec><W><div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"><div className={s.rv?"lg:col-span-5 lg:col-start-8 lg:order-2":"lg:col-span-5"}><V><Tag t={s.lb}/></V><V d={0.04}><D3 c="text-white">{s.ti}</D3></V><V d={0.08}><Tx c="mt-4">{s.ds}</Tx></V></div><div className={s.rv?"lg:col-span-6 lg:col-start-1 lg:order-1":"lg:col-span-6 lg:col-start-7"}><V d={0.1}><Shot src={s.im} label={s.lb} badge={s.bd} cap={s.cp}/></V></div></div></W></Sec>{j<secs.length-1&&<Hr/>}</div>)}
    <Hr/>

    {/* Notifications */}
    <Sec><W>
      <div className="text-center max-w-[500px] mx-auto">
        <V><Tag t="Instant Notifications" center/></V>
        <V d={0.04}><D2 c="text-center"><span className="text-white">Know the moment</span> <span className="italic" style={{color:EM}}>a patient submits.</span></D2></V>
        <V d={0.08}><Tx c="mt-4 text-center">Instant email to your staff. No refresh. No checking.</Tx></V>
      </div>
      <V d={0.12}><div className="mt-12 max-w-[560px] mx-auto"><div className="p-6 rounded-2xl" style={{background:SF,border:`1px solid ${BD}`,boxShadow:`0 8px 40px rgba(0,0,0,0.3)`}}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:ED,border:`1px solid ${EG}`}}><Ic d={I.bl}/></div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1"><p className="text-white text-[13px] font-medium" style={{fontFamily:SA}}>New Patient Intake Received</p><span className="text-[9.5px] tracking-wide" style={{color:"rgba(255,255,255,0.18)",fontFamily:SA}}>Just now</span></div>
            <p className="text-[12px] mb-3.5" style={{color:"rgba(255,255,255,0.3)",fontFamily:SA,fontWeight:300}}>A new digital intake has been submitted to your office.</p>
            <div className="p-3.5 rounded-xl" style={{background:"rgba(255,255,255,0.015)",border:`1px solid ${BD}`}}>
              <div className="grid grid-cols-2 gap-2.5">
                {[{l:"Patient",v:"Owen Lane"},{l:"Submitted",v:"Feb 23, 2026"},{l:"Status",v:"New — Needs Review",em:true},{l:"Action",v:"Open in Dashboard →"}].map((x,j)=>(<div key={j}><p className="text-[9.5px] tracking-wider uppercase mb-0.5" style={{color:"rgba(255,255,255,0.18)",fontFamily:SA}}>{x.l}</p><p className="text-[12px]" style={{color:x.em?EM:"rgba(255,255,255,0.6)",fontFamily:SA,fontWeight:x.em?500:300}}>{x.v}</p></div>))}
              </div>
            </div>
          </div>
        </div>
      </div></div></V>
    </W></Sec>

    <Hr/>

    {/* Implementation */}
    <Sec><W>
      <div className="text-center max-w-[480px] mx-auto mb-12"><V><Tag t="Implementation" center/></V><V d={0.04}><D2 c="text-center">How we install it.</D2></V></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-[900px] mx-auto">
        {[{n:"01",t:"Discovery",d:"We review your intake workflow, practice branding, and clinical requirements."},{n:"02",t:"Build & Configure",d:"We build your branded system, configure the dashboard, set up notifications, and test every workflow."},{n:"03",t:"Deploy & Support",d:"We deploy the live system, provide QR materials, train staff, and support your launch."}].map((s,j)=>(<V key={j} d={j*0.05}><Crd em><div className="text-[10px] font-medium tracking-[0.22em] mb-3.5" style={{color:EM,fontFamily:SA}}>{s.n}</div><h4 className="text-white text-[14px] font-medium mb-1.5" style={{fontFamily:SA}}>{s.t}</h4><p className="text-[12px] leading-[1.7]" style={{color:"rgba(255,255,255,0.32)",fontFamily:SA,fontWeight:300}}>{s.d}</p></Crd></V>))}
      </div>
    </W></Sec>

    <Hr/>

    <Sec><W><div className="text-center max-w-[440px] mx-auto"><V><D2 c="text-center text-white">Ready to see the full system?</D2></V><V d={0.05}><Tx c="mt-4 text-center">Every screen. Every workflow. Every notification.</Tx></V><V d={0.09}><div className="mt-7"><Btn href="#/demo">Book a Private Demo</Btn></div></V></div></W></Sec>
  </>;
}

/* ━━━ DEMO ━━━ */
function DemoPg(){
  return<>
    <section className="relative pt-36 pb-12 md:pt-44 md:pb-16 overflow-hidden" style={{background:BK}}>
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] opacity-[0.05]" style={{background:`radial-gradient(ellipse,${EM},transparent 60%)`}}/>
      <W c="relative">
        <V><Tag t="Private Demo"/></V>
        <V d={0.04}><h1 className="text-[clamp(2.2rem,5.2vw,4.2rem)] leading-[1.06] tracking-[-0.02em] text-white max-w-[600px]" style={{fontFamily:SE}}>See the system running <span className="italic" style={{color:EM}}>for your practice.</span></h1></V>
        <V d={0.08}><Tx c="mt-5 max-w-[440px]">20-minute private walkthrough. Full patient intake experience, office dashboard, and notification workflow — customized to your specialty.</Tx></V>
      </W>
    </section>
    <Hr/>
    <Sec><W><div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
      <div className="lg:col-span-5">
        <V><D3 c="text-white">What you'll see.</D3></V>
        <V d={0.04}><div className="mt-7 space-y-3.5">{["Live 4-step patient intake form on your device","Submission Command Center with real metrics","Individual submission review and workflow tracking","Instant notification demo — email to your inbox","QR code and intake URL for your lobby","Implementation and branding discussion"].map((x,j)=>(<div key={j} className="flex items-start gap-3"><div className="mt-1"><Ic d={I.ck} s={13}/></div><span className="text-[13px] leading-relaxed" style={{color:"rgba(255,255,255,0.42)",fontFamily:SA,fontWeight:300}}>{x}</span></div>))}</div></V>
        <V d={0.08}><div className="mt-10"><Shot src={SH.dash} label="System Preview" badge="System Live" cap="The Submission Command Center you'll see in the walkthrough."/></div></V>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <V d={0.06}><Form/></V>
        <V d={0.12}><div className="mt-6 grid grid-cols-2 gap-3"><Shot src={SH.intake} label="Patient Intake" badge="Step 1 of 4"/><Shot src={SH.detail} label="Submission Detail" badge="New"/></div></V>
      </div>
    </div></W></Sec>
  </>;
}

/* ━━━ ABOUT ━━━ */
function AboutPg(){
  return<>
    <section className="relative pt-36 pb-12 md:pt-44 md:pb-16 overflow-hidden" style={{background:BK}}>
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] opacity-[0.05]" style={{background:`radial-gradient(ellipse,${EM},transparent 60%)`}}/>
      <W c="relative">
        <V><Tag t="About LCG"/></V>
        <V d={0.04}><h1 className="text-[clamp(2.2rem,5.2vw,4.2rem)] leading-[1.06] tracking-[-0.02em] text-white max-w-[660px]" style={{fontFamily:SE}}>Infrastructure, not software. <span className="italic" style={{color:"rgba(255,255,255,0.22)"}}>Built for practices that operate.</span></h1></V>
      </W>
    </section>
    <Hr/>
    <Sec><W><div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
      <div className="lg:col-span-6">
        <V><D3 c="text-white mb-7">Why Lane Campos Group exists.</D3>
          <div className="space-y-5">
            <Tx>Most private practices still run intake on paper, PDFs, or portals patients ignore. The front desk absorbs the cost — re-entering data, chasing information, managing clipboards.</Tx>
            <Tx>LCG was built to fix this. Not with a subscription. Not with bloated software. With installed infrastructure — a digital intake system configured, branded, and deployed for your practice.</Tx>
            <Tx>We build the form. Configure the dashboard. Set up notifications. Deploy QR access. Your team receives a working system — not a login to figure out.</Tx>
          </div>
        </V>
      </div>
      <div className="lg:col-span-5 lg:col-start-8 space-y-4">
        <V d={0.08}><Shot src={SH.dash} label="Office Dashboard" badge="System Live" cap="Real operational infrastructure — not a mockup."/></V>
        <V d={0.12}><Shot src={SH.intake} label="Patient Intake" badge="Step 1 of 4" cap="Branded. Structured. Mobile-first."/></V>
      </div>
    </div></W></Sec>
    <Hr/>
    <Sec><W>
      <V><Tag t="Our Position"/></V>
      <V d={0.04}><D2 c="max-w-[560px]"><span className="text-white">What makes LCG different</span> <span className="italic" style={{color:"rgba(255,255,255,0.2)"}}>from everything else.</span></D2></V>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-3">
        {[{t:"Infrastructure, not subscriptions",d:"We install a system — configured, deployed, operational. Not seats or tiers."},{t:"Focused on one workflow",d:"We solve patient intake. Not EHR. Not scheduling. Not marketing."},{t:"Built for private practice",d:"Ground-up for how dental and medical offices actually operate."},{t:"Your brand, not ours",d:"Patients see your name, your colors. LCG stays invisible."},{t:"Instant operational visibility",d:"Staff notified the moment a patient submits. No missed intakes."},{t:"No feature bloat",d:"One thing, done completely. No training — just a working workflow."}].map((x,j)=>(<V key={j} d={j*0.04}><Crd em><h4 className="text-white text-[13px] font-medium mb-1.5" style={{fontFamily:SA}}>{x.t}</h4><p className="text-[12px] leading-[1.7]" style={{color:"rgba(255,255,255,0.32)",fontFamily:SA,fontWeight:300}}>{x.d}</p></Crd></V>))}
      </div>
    </W></Sec>
    <Hr/>
    <Sec><W><div className="text-center max-w-[420px] mx-auto"><V><D2 c="text-center text-white">See what we build.</D2></V><V d={0.05}><Tx c="mt-4 text-center">Book a private demo — a live system identical to what we install.</Tx></V><V d={0.09}><div className="mt-7"><Btn href="#/demo">Book a Private Demo</Btn></div></V></div></W></Sec>
  </>;
}

/* ━━━ CONTACT ━━━ */
function ContactPg(){
  return<>
    <section className="relative pt-36 pb-12 md:pt-44 md:pb-16 overflow-hidden" style={{background:BK}}>
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-[0.05]" style={{background:`radial-gradient(ellipse,${EM},transparent 60%)`}}/>
      <W c="relative">
        <V><Tag t="Contact"/></V>
        <V d={0.04}><h1 className="text-[clamp(2.2rem,5.2vw,4.2rem)] leading-[1.06] tracking-[-0.02em] text-white max-w-[500px]" style={{fontFamily:SE}}>Let's discuss your practice.</h1></V>
        <V d={0.08}><Tx c="mt-5 max-w-[400px]">Ready for a demo or have questions — we respond within one business day.</Tx></V>
      </W>
    </section>
    <Hr/>
    <Sec><W><div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
      <div className="lg:col-span-5"><V><div className="space-y-8">
        <div><p className="text-[9.5px] tracking-[0.22em] uppercase font-medium mb-2" style={{color:EM,fontFamily:SA}}>Email</p><a href="mailto:lanecamposgroup@gmail.com" className="text-white text-[14.5px] hover:underline underline-offset-4 decoration-white/20" style={{fontFamily:SA,fontWeight:300}}>lanecamposgroup@gmail.com</a></div>
        <div><p className="text-[9.5px] tracking-[0.22em] uppercase font-medium mb-2" style={{color:EM,fontFamily:SA}}>Inquiries</p><p className="text-[13px] leading-[1.7]" style={{color:"rgba(255,255,255,0.38)",fontFamily:SA,fontWeight:300}}>Demo requests, implementation questions, partnership inquiries.</p></div>
        <div><p className="text-[9.5px] tracking-[0.22em] uppercase font-medium mb-2" style={{color:EM,fontFamily:SA}}>Company</p><p className="text-white text-[13.5px] mb-0.5" style={{fontFamily:SA}}>Lane Campos Group</p><p className="text-[12px]" style={{color:"rgba(255,255,255,0.28)",fontFamily:SA,fontWeight:300}}>Digital Intake Infrastructure for Private Practices</p></div>
      </div></V></div>
      <div className="lg:col-span-6 lg:col-start-7"><V d={0.06}><Form compact/></V></div>
    </div></W></Sec>
  </>;
}

/* ━━━ APP ━━━ */
function Pages(){const{pg}=usePg();switch(pg){case"system":return<SystemPg/>;case"demo":return<DemoPg/>;case"about":return<AboutPg/>;case"contact":return<ContactPg/>;default:return<Home/>;}}

export default function LCG(){
  return<Router><div className="min-h-screen antialiased" style={{background:BK,color:"white"}}>
    <style>{`
      *{box-sizing:border-box}html{scroll-behavior:smooth}
      ::selection{background:rgba(45,212,160,0.2);color:white}
      input::placeholder{color:rgba(255,255,255,0.25);font-family:'Outfit',sans-serif;font-weight:300}
      select option{background:#0a0a0a;color:white}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#040404}
      ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.05);border-radius:3px}
      ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.1)}
      img{max-width:100%}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}.animate-pulse{animation:pulse 2.5s ease-in-out infinite}
    `}</style>
    <Nav/><Pages/><Footer/>
  </div></Router>;
}
