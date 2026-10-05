import { Service } from "./servicesData";

const KIT_CSS = `*{box-sizing:border-box;margin:0}html{-webkit-text-size-adjust:100%}
body{font:500 14px/1.5 "Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--bg,#fff);color:var(--tx,#0B1220);-webkit-font-smoothing:antialiased}
button,input,select,textarea{font:inherit;color:inherit}button{cursor:pointer;border:0;background:none}
:focus-visible{outline:2px solid #22D3EE;outline-offset:2px}
.k-toasts{position:fixed;z-index:99;left:50%;bottom:20px;transform:translateX(-50%);display:grid;gap:8px;justify-items:center;pointer-events:none;width:max-content;max-width:92vw}
.k-toast{background:#0B1220;color:#fff;padding:11px 16px;border-radius:12px;font-weight:600;font-size:13.5px;box-shadow:0 16px 40px -12px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.12);display:flex;gap:9px;align-items:center;animation:kt .35s cubic-bezier(.22,.8,.26,1)}
.k-toast::before{content:"";width:8px;height:8px;border-radius:50%;background:#10B981;flex:none}
@keyframes kt{from{opacity:0;transform:translateY(12px)}}
.k-ov{position:fixed;inset:0;z-index:90;background:rgba(5,8,22,.55);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:grid;place-items:center;padding:16px;opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s}
.k-ov.s{opacity:1;visibility:visible}
.k-modal{position:relative;width:min(440px,100%);max-height:90vh;overflow:auto;background:#fff;color:#0B1220;border-radius:20px;padding:24px;transform:translateY(14px) scale(.98);transition:transform .35s cubic-bezier(.22,.8,.26,1);box-shadow:0 40px 80px -30px rgba(0,0,0,.6)}
.k-ov.s .k-modal{transform:none}
#kd{place-items:stretch end;padding:0}
.k-drawer{position:relative;width:min(380px,100vw);background:#fff;color:#0B1220;padding:24px;overflow:auto;transform:translateX(100%);transition:transform .4s cubic-bezier(.22,.8,.26,1)}
.k-ov.s .k-drawer{transform:none}
.k-x{position:absolute;right:14px;top:12px;width:34px;height:34px;border-radius:10px;font-size:20px;color:#64748B;z-index:2}.k-x:hover{background:#F1F5F9}
.k-modal h3,.k-drawer h3{font-size:19px;letter-spacing:-.02em;margin-bottom:6px;padding-right:34px}
.k-modal p,.k-drawer p{color:#64748B;margin-bottom:14px}
.k-f{display:grid;gap:10px}.k-f label{font-size:12.5px;font-weight:700;color:#64748B;display:grid;gap:5px}
.k-f input,.k-f select{height:44px;border-radius:12px;border:1px solid #E2E8F0;padding:0 12px;background:#fff;color:#0B1220;width:100%}
.k-b{height:44px;padding:0 18px;border-radius:12px;background:linear-gradient(110deg,var(--a1,#3B82F6),var(--a2,#7C3AED));color:#fff;font-weight:700;transition:transform .25s,filter .25s}.k-b:hover{transform:translateY(-1px);filter:brightness(1.08)}
.k-g{height:44px;padding:0 18px;border-radius:12px;border:1px solid #E2E8F0;font-weight:700;color:#0B1220;background:#fff}
.k-e{color:#DC2626;font-size:13px;font-weight:600;min-height:1.2em}
.k-dl{display:grid;gap:0;margin:14px 0 18px}.k-dl div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #EEF2F7}.k-dl span{color:#64748B}
.ava{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;font-size:12px;font-weight:800;color:#fff;flex:none;font-style:normal}
.skb{border-radius:12px;background:linear-gradient(90deg,rgba(148,163,184,.22) 25%,rgba(148,163,184,.08) 50%,rgba(148,163,184,.22) 75%) 0 0/200% 100%;animation:sk 1s linear infinite}
@keyframes sk{to{background-position:-200% 0}}`;

export function getDemoSrcDoc(service: Service): string {
  const m = service.m;
  const isLanding = /Landing|SaaS Website|Framer/.test(service.t);

  // Return HTML document with embedded CSS and simulated app logic
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<style>
${KIT_CSS}
${getDemoSpecificCSS(m)}
</style>
</head>
<body>
<div id="demo-root"></div>
<script>
${getKitJs()}
${getDemoRunnerJs(m, service.t, isLanding)}
</script>
</body>
</html>`;
}

function getKitJs(): string {
  return `
  const d=document,HUE=[217,262,188,24,330,158,43];
  window.$=(s,r=d)=>r.querySelector(s);window.$$=(s,r=d)=>[...r.querySelectorAll(s)];
  window.h=x=>d.getElementById('demo-root').insertAdjacentHTML("beforeend",x);
  window.fmt=(n,dec=0)=>Number(n).toLocaleString("en-US",{minimumFractionDigits:dec,maximumFractionDigits:dec});
  d.body.insertAdjacentHTML("beforeend",'<div class="k-toasts" id="kt" aria-live="polite"></div><div class="k-ov" id="ko"><div class="k-modal" role="dialog" aria-modal="true"><button class="k-x" aria-label="Close" data-close>×</button><div id="km"></div></div></div><div class="k-ov" id="kd"><aside class="k-drawer" role="dialog" aria-modal="true"><button class="k-x" data-close aria-label="Close">×</button><div id="kdb"></div></aside></div>');
  window.toast=m=>{const t=d.createElement("div");t.className="k-toast";t.textContent=m;$("#kt").append(t);setTimeout(()=>t.remove(),2800)};
  window.modal=x=>{$("#km").innerHTML=x;$("#ko").classList.add("s");const f=$("#km input,#km button");f&&f.focus()};
  window.drawer=x=>{$("#kdb").innerHTML=x;$("#kd").classList.add("s")};
  window.shut=()=>{$("#ko").classList.remove("s");$("#kd").classList.remove("s")};
  d.addEventListener("click",e=>{if(e.target.dataset.close!=null||e.target.classList.contains("k-ov"))shut()});
  d.addEventListener("keydown",e=>{if(e.key=="Escape")shut()});
  window.count=(el,to,pre="",suf="",dec=0)=>{const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/900),v=to*(1-Math.pow(1-k,3));el.textContent=pre+fmt(v,dec)+suf;if(k<1)requestAnimationFrame(f)})(t0)};
  window.spline=p=>p.map((a,i)=>{if(!i)return"M"+a[0]+" "+a[1];const b=p[i-1],m=(a[0]+b[0])/2;return"C"+m+" "+b[1]+" "+m+" "+a[1]+" "+a[0]+" "+a[1]}).join("");
  window.ava=(n,i=0,sz=34)=>'<i class="ava" style="width:'+sz+"px;height:"+sz+"px;background:linear-gradient(135deg,hsl("+HUE[i%7]+",80%,56%),hsl("+HUE[(i+2)%7]+',75%,48%))">'+n.split(" ").map(w=>w[0]).slice(0,2).join("")+"</i>";
  window.sk=(n,ht)=>Array(n).fill('<div class="skb" style="height:'+ht+'px"></div>').join("");
`;
}

function getDemoSpecificCSS(m: string): string {
  if (m === "store") {
    return `
body{--bg:#FFF8EE;--tx:#1B1410;--a1:#FF7A18;--a2:#EC4899}
.hd{position:sticky;top:0;z-index:6;display:flex;gap:10px;align-items:center;padding:14px 24px;background:rgba(255,248,238,.9);backdrop-filter:blur(12px);border-bottom:1px solid #F0E4D2}
.hd b{font-size:22px;font-weight:800;letter-spacing:-.04em;margin-right:auto}
.hd input{height:42px;border-radius:99px;border:1px solid #E9DCC7;background:#fff;padding:0 16px;width:min(260px,40vw)}
.ct{height:42px;padding:0 16px;border-radius:99px;background:#1B1410;color:#fff;font-weight:700;display:flex;gap:8px;align-items:center}
.ct i{font-style:normal;background:#FF7A18;border-radius:99px;min-width:22px;height:22px;display:grid;place-items:center;font-size:12px}
.wr{max-width:1180px;margin:0 auto;padding:22px 24px 50px}
.bn{position:relative;overflow:hidden;border-radius:28px;padding:clamp(26px,5vw,56px);color:#fff;background:linear-gradient(110deg,#FF7A18,#EC4899 70%,#C026D3);display:grid;grid-template-columns:1.2fr 1fr;align-items:center;gap:20px}
.bn em{font-style:normal;display:inline-block;background:#fff;color:#1B1410;font-weight:800;font-size:13px;padding:6px 12px;border-radius:99px;margin-bottom:14px}
.bn h1{font-size:clamp(34px,6vw,68px);line-height:.95;letter-spacing:-.045em;font-weight:800}
.bn p{margin:14px 0 20px;font-size:16px;opacity:.95;max-width:34ch}
.bn button{height:50px;padding:0 24px;border-radius:99px;background:#1B1410;color:#fff;font-weight:800}
.bn svg{width:100%;max-height:240px;filter:drop-shadow(0 30px 30px rgba(0,0,0,.3))}
.cs{display:flex;gap:8px;margin:26px 0 18px;overflow-x:auto}
.cs button{flex:none;height:42px;padding:0 18px;border-radius:99px;border:1.5px solid #E9DCC7;font-weight:700;background:#fff}
.cs button.on{background:#1B1410;color:#fff;border-color:#1B1410}
.gr{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}
.pc{background:#fff;border-radius:22px;padding:12px;box-shadow:0 10px 30px -15px rgba(0,0,0,.1)}
.im{position:relative;height:200px;border-radius:16px;display:grid;place-items:center;cursor:pointer;overflow:hidden}
.im svg{width:62%}
.tg{position:absolute;left:10px;top:10px;padding:5px 10px;border-radius:99px;font-size:12px;font-weight:800;background:#1B1410;color:#fff}
.hr{position:absolute;right:10px;top:10px;width:36px;height:36px;border-radius:50%;background:#fff;font-size:17px;display:grid;place-items:center}
.hr.on{color:#EC4899}
.pc h3{font-size:17px;letter-spacing:-.02em;margin:12px 4px 2px}.pc small{color:#8A7868;margin:0 4px;font-weight:600}
.pf{display:flex;justify-content:space-between;align-items:center;margin:10px 4px 4px}.pf b{font-size:19px;letter-spacing:-.03em}
.pf button{height:40px;padding:0 16px;border-radius:99px;background:linear-gradient(110deg,#FF7A18,#EC4899);color:#fff;font-weight:800}
.li{display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid #EEF2F7}.li .im{width:60px;height:60px;border-radius:12px;flex:none}
.qt{display:flex;gap:6px;align-items:center}.qt button{width:30px;height:30px;border-radius:9px;border:1px solid #E2E8F0;font-weight:800}`;
  }

  if (m === "mob") {
    return `
body{min-height:100vh;display:grid;place-items:center;background:radial-gradient(50% 50% at 20% 20%,rgba(236,72,153,.55),transparent 70%),radial-gradient(50% 50% at 85% 80%,rgba(124,58,237,.6),transparent 70%),#12082B;--a1:#EC4899;--a2:#A855F7;padding:20px 0}
.ph{position:relative;width:390px;height:min(800px,calc(100vh - 40px));border-radius:54px;background:#0B0714;padding:12px;box-shadow:0 60px 120px -30px rgba(0,0,0,.8),0 0 0 2px rgba(255,255,255,.14)}
.ph::before{content:"";position:absolute;z-index:5;top:22px;left:50%;width:110px;height:30px;margin-left:-55px;border-radius:20px;background:#0B0714}
.sc{height:100%;border-radius:43px;overflow:hidden;background:#FBF8FF;color:#1A1230;display:flex;flex-direction:column;position:relative}
.pg{flex:1;overflow:auto;padding:64px 20px 20px}
.pg h2{font-size:28px;letter-spacing:-.04em;line-height:1.1}.pg>small{color:#7A7391;font-weight:600}
.hc{margin:18px 0;border-radius:26px;padding:20px;color:#fff;background:linear-gradient(135deg,#EC4899,#A855F7);display:flex;gap:16px;align-items:center}
.rg{position:relative;width:104px;height:104px;flex:none}.rg svg{transform:rotate(-90deg)}.rg circle{fill:none;stroke-width:10;stroke-linecap:round}
.rg .fg{stroke:#fff;stroke-dasharray:264;stroke-dashoffset:70}
.rg b{position:absolute;inset:0;display:grid;place-items:center;font-size:22px;font-weight:800}
.hc strong{display:block;font-size:30px;letter-spacing:-.04em;line-height:1.1}
.tl2{display:grid;grid-template-columns:1fr 1fr;gap:12px}.tl2 div{background:#fff;border-radius:20px;padding:14px}.tl2 b{font-size:22px}
.sh{display:flex;justify-content:space-between;align-items:center;margin:20px 0 10px}.sh b{font-size:17px}.sh button{font-weight:800;color:#A855F7}
.rw{display:flex;gap:12px;align-items:center;background:#fff;border-radius:18px;padding:12px;margin-bottom:10px}.rw i{width:42px;height:42px;border-radius:14px;flex:none;background:linear-gradient(135deg,var(--x,#EC4899),var(--y,#FF7A18))}
.nv{position:relative;display:grid;grid-template-columns:repeat(4,1fr);background:#fff;padding:8px 10px 18px;border-top:1px solid #EFEAF9}
.nv button{height:50px;font-size:11.5px;font-weight:700;color:#9A93B2;display:grid;justify-items:center;gap:3px}
.nv button.on{color:#A855F7}`;
  }

  if (m === "ai") {
    return `
body{--bg:#07051A;--tx:#EDEBFF;background:#07051A;min-height:100vh}
.app{display:grid;grid-template-columns:270px minmax(0,1fr);height:100vh}
.sb{padding:20px 14px;border-right:1px solid rgba(255,255,255,.09);display:flex;flex-direction:column;gap:10px;overflow:auto}
.lg{font-weight:800;font-size:18px;display:flex;gap:10px;align-items:center;padding:0 6px 10px}
.ag{display:flex;gap:12px;align-items:center;padding:12px;border-radius:16px;text-align:left;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.03);color:#fff;width:100%}
.ag i{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,var(--x),var(--y));flex:none}
.ag.on{border-color:#A855F7;background:rgba(168,85,247,.15)}
main{display:flex;flex-direction:column;height:100vh;min-width:0}
.tp{display:flex;gap:10px;align-items:center;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,.08);color:#fff}.tp b{font-size:16px;margin-right:auto}
.cv{flex:1;overflow:auto;padding:28px 24px;display:flex;flex-direction:column;gap:16px}
.hi{margin:auto;text-align:center;display:grid;gap:18px;justify-items:center;max-width:560px}
.orb{width:130px;height:130px;border-radius:50%;background:conic-gradient(from 0deg,var(--x,#A855F7),var(--y,#22D3EE),#3B82F6,var(--x,#A855F7));box-shadow:0 0 70px #A855F7;animation:sp 9s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.cps{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.cp{padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#fff;font-weight:600;font-size:13.5px}
.ms{max-width:720px;width:100%;margin:0 auto;display:flex;gap:12px}
.ms.u{justify-content:flex-end}.ms.u div{background:linear-gradient(110deg,#7C3AED,#3B82F6);border-radius:18px 18px 4px 18px;padding:11px 16px;max-width:80%;font-weight:600;color:#fff}
.ms .bb{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:4px 18px 18px 18px;padding:14px 16px;line-height:1.65;color:#fff}
.cmi{max-width:720px;margin:0 auto;display:flex;gap:8px;padding:8px;border-radius:18px;background:#0F0B26;border:1px solid #7C3AED;width:100%}
.cmi input{flex:1;min-width:0;height:44px;border:0;background:none;outline:0;padding:0 10px;font-size:15px;color:#fff}
.cmi button{height:44px;padding:0 18px;border-radius:12px;background:linear-gradient(110deg,#7C3AED,#22D3EE);color:#fff;font-weight:700}`;
  }

  // Standard Dashboard & Web apps
  return `
.app{display:grid;grid-template-columns:224px minmax(0,1fr);min-height:100vh;background:var(--bg,#F4F7FB);color:var(--tx,#0B1220)}
.sb{background:var(--side,#0B1220);color:var(--stx,#fff);padding:20px 14px;display:flex;flex-direction:column;gap:22px;border-right:1px solid rgba(255,255,255,.1)}
.lg{display:flex;gap:10px;align-items:center;font-weight:800;font-size:17px}.lg i{width:28px;height:28px;border-radius:9px;background:linear-gradient(135deg,var(--a1,#3B82F6),var(--a2,#7C3AED))}
.sb nav{display:grid;gap:3px}.sb nav button{display:flex;gap:10px;align-items:center;height:40px;padding:0 10px;border-radius:11px;font-weight:600;color:inherit;opacity:.7;text-align:left}
.sb nav button.on{opacity:1;background:linear-gradient(110deg,var(--a1,#3B82F6),var(--a2,#7C3AED));color:#fff}
main{padding:22px 26px 40px;display:grid;gap:18px;align-content:start;min-width:0}
.tb{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.tb h1{font-size:24px;margin-right:auto;font-weight:800}
.pri{height:40px;padding:0 16px;border-radius:11px;background:linear-gradient(110deg,var(--a1,#3B82F6),var(--a2,#7C3AED));color:#fff;font-weight:700}
.ks{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px}
.cd,.kp{background:var(--card,#fff);border:1px solid rgba(0,0,0,.08);border-radius:18px;padding:18px}
.kp small{color:#64748B;font-weight:600;font-size:12.5px;display:block}
.kp b{display:block;font-size:30px;letter-spacing:-.04em;line-height:1.15;margin:4px 0 6px;font-weight:800}
.r2{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:18px}
.ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.ch b{font-size:16px}
.tw{overflow-x:auto}table{width:100%;border-collapse:collapse;min-width:480px}
th{font-size:12px;color:#64748B;font-weight:700;text-align:left;padding:10px}td{padding:11px 10px;border-top:1px solid rgba(0,0,0,.06)}
.st{font-size:12px;font-weight:700;padding:4px 10px;border-radius:99px;background:rgba(16,185,129,.14);color:#10B981}`;
}

function getDemoRunnerJs(m: string, title: string, isLanding: boolean): string {
  if (m === "store") {
    return `
    const P=[["Studio Headphones",24900,"Audio","#FF7A18","#FFE7D1"],["Pulse Smart Watch",18500,"Wearables","#EC4899","#FDE3F0"],["Arc Desk Lamp",6900,"Home","#FBBF24","#FFF3CF"],["Boom Speaker",12900,"Audio","#7C3AED","#EDE5FF"]];
    let cart={};
    h('<header class="hd"><b>aurelia</b><input placeholder="Search products"><button class="ct" id="cb">Cart <i id="cn">0</i></button></header><div class="wr"><div class="bn"><div><em>New season</em><h1>Sound that fills the room.</h1><p>Premium lifestyle and audio gear crafted to convert.</p></div></div><div class="gr" id="gr"></div></div>');
    function R(){
      $("#gr").innerHTML=P.map((p,i)=>'<div class="pc"><h3>'+p[0]+'</h3><small>'+p[2]+'</small><div class="pf"><b>Rs '+fmt(p[1])+'</b><button onclick="add('+i+')">Add to cart</button></div></div>').join('');
    }
    window.add=i=>{cart[i]=(cart[i]||0)+1;$('#cn').textContent=Object.values(cart).reduce((a,b)=>a+b,0);toast(P[i][0]+' added to cart')};
    R();
    `;
  }

  if (m === "mob") {
    return `
    h('<div class="ph"><div class="sc"><div class="pg"><small>PlayBeat Digital</small><h2>Pulse App</h2><div class="hc"><div class="rg"><svg width="104" height="104"><circle cx="52" cy="52" r="42" stroke="rgba(255,255,255,.2)"/><circle class="fg" cx="52" cy="52" r="42"/></svg><b>84%</b></div><div><small>Steps today</small><strong>9,240</strong></div></div><div class="tl2"><div><small>Heart Rate</small><b>72 bpm</b></div><div><small>Calories</small><b>620 kcal</b></div></div><div class="sh"><b>Recent Sessions</b></div><div class="rw"><i></i><div><b>Morning Run</b><small>5.2 km · 28 min</small></div></div><div class="rw"><i></i><div><b>HIIT Workout</b><small>45 min</small></div></div></div><nav class="nv"><button class="on">Home</button><button>Stats</button><button>Goals</button><button>Profile</button></nav></div></div>');
    `;
  }

  if (m === "ai") {
    return `
    h('<div class="app"><aside class="sb"><div class="lg">Cortex AI</div><button class="ag on"><i></i><b>Analyst Agent</b></button><button class="ag"><i></i><b>Growth Agent</b></button></aside><main><div class="tp"><b>Cortex Workspace</b></div><div class="cv" id="cv"><div class="hi"><div class="orb"></div><h1>Ask your custom AI Agent</h1><div class="cps"><button class="cp" onclick="send(this.textContent)">Summarize quarterly revenue</button><button class="cp" onclick="send(this.textContent)">Draft landing page copy</button></div></div></div><div style="padding:16px"><div class="cmi"><input id="in" placeholder="Ask anything..."><button onclick="send()">Send</button></div></div></main></div>');
    window.send=txt=>{
      const q=txt||$('#in').value;
      if(!q)return;
      $('#cv').innerHTML+='<div class="ms u"><div>'+q+'</div></div><div class="ms"><div class="bb"><small>Analyst Agent</small><p>Analyzing your query for: "'+q+'". Here is the synthesized output with high performance metrics.</p></div></div>';
      if($('#in'))$('#in').value='';
    };
    `;
  }

  // Default Dashboard
  return `
  h('<div class="app"><aside class="sb"><div class="lg"><i></i>PlayBeat</div><nav><button class="on">Dashboard</button><button>Analytics</button><button>Reports</button><button>Settings</button></nav></aside><main><header class="tb"><h1>${title} Demo</h1><button class="pri" onclick="toast(\\'Action confirmed!\\')">+ New Item</button></header><div class="ks"><div class="kp"><small>Total Volume</small><b>$124,500</b></div><div class="kp"><small>Active Accounts</small><b>1,420</b></div><div class="kp"><small>Efficiency Rate</small><b>99.4%</b></div></div><div class="cd"><div class="ch"><b>Recent Records</b></div><div class="tw"><table><thead><tr><th>Name</th><th>Status</th><th>Value</th></tr></thead><tbody><tr><td>Acme Corp</td><td><span class="st">Active</span></td><td>$4,500</td></tr><tr><td>Zenith Global</td><td><span class="st">Active</span></td><td>$12,000</td></tr><tr><td>NovaTech Ltd</td><td><span class="st">Active</span></td><td>$8,200</td></tr></tbody></table></div></div></main></div>');
  `;
}
