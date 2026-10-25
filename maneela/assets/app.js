/* Maneela — data & komponen bersama. Harga di bawah masih CONTOH: ganti dengan harga modal supplier. */
(function(){
const CZ = window.CZ = {};
const rp = CZ.rp = n => 'Rp' + Math.round(n).toLocaleString('id-ID');
const fmt = n => n.toLocaleString('id-ID');

/* ---------- ikon (inline SVG garis) ---------- */
const P = {
  phone:'<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  wifi:'<path d="M2.5 9a14 14 0 0 1 19 0"/><path d="M5.5 12.5a9.5 9.5 0 0 1 13 0"/><path d="M8.7 16a5 5 0 0 1 6.6 0"/><circle cx="12" cy="19.3" r=".6"/>',
  wallet:'<path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12v3"/><rect x="3.5" y="8" width="17" height="11.5" rx="2.5"/><path d="M16.5 13.75h.5"/>',
  bolt:'<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
  drop:'<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z"/>',
  tv:'<rect x="2.5" y="5.5" width="19" height="12.5" rx="2.5"/><path d="M8 21h8M9 2.5l3 3 3-3"/>',
  game:'<path d="M7 7h10a5 5 0 0 1 4.9 6l-.6 3a2.6 2.6 0 0 1-4.5 1.2L15 15H9l-1.8 2.2a2.6 2.6 0 0 1-4.5-1.2l-.6-3A5 5 0 0 1 7 7z"/><path d="M7.5 10v3M6 11.5h3M15.5 11h.01M17.5 13h.01"/>',
  shield:'<path d="M12 2.5 4.5 5.5v6c0 4.5 3.2 8.4 7.5 10 4.3-1.6 7.5-5.5 7.5-10v-6z"/><path d="M12 8.5v6M9 11.5h6"/>',
  car:'<path d="M5 16.5h14M3.5 16.5v-4l2-5a2 2 0 0 1 1.9-1.4h9.2a2 2 0 0 1 1.9 1.4l2 5v4"/><circle cx="7.5" cy="16.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/><path d="M3.5 12h17"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  receipt:'<path d="M5.5 3h13v18l-2.2-1.5L14 21l-2-1.5L10 21l-2.3-1.5L5.5 21z"/><path d="M9 8h6M9 12h6"/>',
  chat:'<path d="M20.5 11.5a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.4-4.4A8.5 8.5 0 1 1 20.5 11.5z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  refund:'<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4.5h4.5"/>',
  qr:'<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1"/><path d="M14 14h2.5v2.5H14zM18 18h2.5v2.5H18zM14 18.5v2M18.5 14h2"/>',
  bank:'<path d="M3 9.5 12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3.5 20.5h17"/>',
  store:'<path d="M4 9.5V20h16V9.5M3 9.5 5 4h14l2 5.5a2.5 2.5 0 0 1-4.5 1.3 2.5 2.5 0 0 1-4.5 0 2.5 2.5 0 0 1-4.5 0A2.5 2.5 0 0 1 3 9.5z"/><path d="M10 20v-5h4v5"/>',
  tag:'<path d="M3.5 12.5V4h8.5l9 9-8.5 8.5z"/><circle cx="8" cy="8.5" r="1.3"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  copy:'<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5"/>'
};
const ico = CZ.ico = (n, c='') => `<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n]||''}</svg>`;

CZ.logo = (s=34) => `<a href="/" class="flex items-center gap-2" aria-label="Maneela beranda">
<svg width="${s}" height="${s}" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2C30 2 38 8 38 20s-8 18-18 18S2 32 2 20 10 2 20 2z" fill="#228B22"/><path d="M11 28v-8.5a3.75 3.75 0 0 1 7.5 0V28m0-8.5a3.75 3.75 0 0 1 7.5 0V28" fill="none" stroke="#FEFFF1" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 13c0-4.5 3.5-7.5 8.5-7.5 0 5-3.5 8-8.5 7.5z" fill="#FFDB59" stroke="#228B22" stroke-width="1.6" stroke-linejoin="round"/></svg>
<span class="fh font-extrabold text-[22px]" style="letter-spacing:-.045em">maneela</span></a>`;

/* ---------- operator ---------- */
const OPS = {
  Telkomsel:['0811','0812','0813','0821','0822','0823','0851','0852','0853'],
  Indosat:['0814','0815','0816','0855','0856','0857','0858'],
  XL:['0817','0818','0819','0859','0877','0878'],
  Axis:['0831','0832','0833','0838'],
  Tri:['0895','0896','0897','0898','0899'],
  Smartfren:['0881','0882','0883','0884','0885','0886','0887','0888','0889']
};
CZ.normPhone = v => { v=(v||'').replace(/\D/g,''); if(v.startsWith('62')) v='0'+v.slice(2); else if(v.startsWith('8')) v='0'+v; return v; };
CZ.detectOp = v => { const p=CZ.normPhone(v).slice(0,4); if(p.length<4) return null; for(const k in OPS) if(OPS[k].includes(p)) return k; return null; };

/* ---------- harga ---------- */
const pulsaBase=[[5,6200],[10,11000],[20,20900],[25,25800],[50,50800],[100,100200]];
const opAdj={Telkomsel:0,Indosat:-150,XL:-100,Axis:-200,Tri:-250,Smartfren:-300};
const pulsa = op => pulsaBase.map(([k,p])=>({n:`Pulsa ${k}rb`,p:p+opAdj[op]*(k>=50?2:1)}));
const dataBase=[['Data 3GB · 7 hari',15000],['Data 8GB · 30 hari',38000],['Data 15GB · 30 hari',62000],['Data 25GB · 30 hari',88000],['Data 50GB · 30 hari',135000],['Unlimited Harian · 30 hari',99000]];
const paket = op => dataBase.map(([n,p])=>({n,p:p+opAdj[op]*10}));
const nominal=(list,admin,label='Saldo')=>list.map(v=>({n:`${label} ${fmt(v)}`,p:v+admin,sub:`Admin ${rp(admin)}`}));
const ops=Object.keys(OPS);
const ewal=['DANA','OVO','GoPay','ShopeePay','LinkAja'];
const fill=(list,fn)=>Object.fromEntries(list.map(x=>[x,fn(x)]));

CZ.S = {
  'pulsa':{name:'Pulsa',cat:'isi',catL:'Isi ulang',icon:'phone',desc:'Isi pulsa semua operator, masuk dalam hitungan detik.',label:'Nomor HP',ph:'0812 3456 7890',phone:true,prov:ops,items:fill(ops,pulsa)},
  'paket-data':{name:'Paket Data',cat:'isi',catL:'Isi ulang',icon:'wifi',desc:'Kuota internet harian sampai bulanan, langsung aktif.',label:'Nomor HP',ph:'0812 3456 7890',phone:true,prov:ops,items:fill(ops,paket)},
  'e-wallet':{name:'E-Wallet',cat:'isi',catL:'Isi ulang',icon:'wallet',desc:'Top up saldo DANA, OVO, GoPay, ShopeePay & LinkAja.',label:'Nomor HP terdaftar',ph:'0812 3456 7890',prov:ewal,items:fill(ewal,()=>nominal([10000,20000,25000,50000,100000,200000],1500))},
  'pln':{name:'Token PLN',cat:'tagihan',catL:'Tagihan',icon:'bolt',desc:'Beli token listrik prabayar, kode token langsung muncul.',label:'Nomor meter / ID pelanggan',ph:'5123 4567 8901',prov:['PLN Prabayar'],items:{'PLN Prabayar':nominal([20000,50000,100000,200000,500000],2500,'Token')}},
  'pdam':{name:'PDAM',cat:'tagihan',catL:'Tagihan',icon:'drop',desc:'Bayar tagihan air PDAM se-Indonesia tanpa antre.',label:'ID pelanggan PDAM',ph:'0123456789',bill:true,admin:2500,prov:['PDAM Jakarta','PDAM Surabaya','PDAM Bandung','PDAM Medan']},
  'tv-internet':{name:'TV & Internet',cat:'tagihan',catL:'Tagihan',icon:'tv',desc:'IndiHome, Biznet, First Media, MyRepublic, semua bisa.',label:'Nomor pelanggan',ph:'1234 5678 90',bill:true,admin:2500,prov:['IndiHome','Biznet','First Media','MyRepublic']},
  'game':{name:'Voucher Game',cat:'hiburan',catL:'Hiburan',icon:'game',desc:'Diamond, UC, dan voucher game favoritmu.',label:'User ID (dan Zone ID)',ph:'12345678 (1234)',prov:['Mobile Legends','Free Fire','PUBG Mobile'],items:{
    'Mobile Legends':[['86 Diamonds',24500],['172 Diamonds',48500],['257 Diamonds',72000],['344 Diamonds',97000],['706 Diamonds',198000],['Weekly Diamond Pass',34900]].map(([n,p])=>({n,p})),
    'Free Fire':[['70 Diamonds',10900],['140 Diamonds',21500],['355 Diamonds',51000],['720 Diamonds',101000],['1450 Diamonds',196000]].map(([n,p])=>({n,p})),
    'PUBG Mobile':[['60 UC',17500],['325 UC',80500],['660 UC',167000]].map(([n,p])=>({n,p}))}},
  'bpjs':{name:'BPJS Kesehatan',cat:'tagihan',catL:'Tagihan',icon:'shield',desc:'Iuran BPJS Kesehatan per kelas, bisa bayar beberapa bulan.',label:'Nomor VA / No. BPJS',ph:'8888 8012 3456 7890',prov:['Kelas 1','Kelas 2','Kelas 3'],items:fill(['Kelas 1','Kelas 2','Kelas 3'],k=>{const b={'Kelas 1':150000,'Kelas 2':100000,'Kelas 3':35000}[k];return [1,2,3,6,12].map(m=>({n:`${m} bulan`,p:b*m+2500,sub:`${rp(b)}/bln + admin`}))})},
  'multifinance':{name:'Multifinance',cat:'tagihan',catL:'Tagihan',icon:'car',desc:'Cicilan motor & mobil: Adira, FIF, BAF, WOM.',label:'Nomor kontrak',ph:'010203040506',bill:true,admin:3000,prov:['Adira Finance','FIF Group','BAF','WOM Finance']}
};
CZ.order=['pulsa','paket-data','e-wallet','pln','pdam','tv-internet','game','bpjs','multifinance'];

/* tagihan simulasi: deterministik dari ID */
CZ.bill=(slug,prov,id)=>{const s=CZ.S[slug];let h=0;for(const c of id+prov)h=(h*31+c.charCodeAt(0))%100000;
  const base={pdam:85000,'tv-internet':330000,multifinance:780000}[slug]; const amt=Math.round((base+h*(slug==='multifinance'?3:1.5))/100)*100;
  const names=['Budi Santoso','Siti Rahma','Andi Wijaya','Dewi Lestari','Rizky Pratama','Nur Aini'];
  const months=['Okt 2026','Sep–Okt 2026']; return {nama:names[h%names.length],periode:months[h%2?0:0],tagihan:amt,admin:s.admin,total:amt+s.admin};};

/* ---------- header & footer ---------- */
const NAV=[['/','Beranda'],['/produk','Produk'],['/invoice','Cek Invoice'],['/bantuan','Bantuan']];
const path=location.pathname.replace(/\/index\.html$/,'').replace(/\/$/,'')||'/';
const active=h=> h==='/'?path==='/':path.startsWith(h);
function header(){
  const el=document.createElement('header'); el.className='hdr';
  el.innerHTML=`<div class="wrap flex items-center justify-between h-[68px] gap-4">
    ${CZ.logo()}
    <nav class="navcap hidden lg:flex absolute left-1/2 -translate-x-1/2">${NAV.map(([h,t])=>`<a href="${h}" class="${active(h)?'on':''}">${t}</a>`).join('')}</nav>
    <div class="flex items-center gap-2">
      <a href="/produk?s=pulsa" class="btn btn-red hidden lg:inline-flex !py-2.5 !min-h-0">Top up ${ico('arrow','!w-4 !h-4')}</a>
      <button id="hb" class="lg:hidden w-11 h-11 rounded-full bg-white grid place-items-center" style="border:1px solid var(--line)" aria-label="Buka menu" aria-expanded="false">${ico('menu')}</button>
    </div></div>
    <div id="mm" class="mmenu lg:hidden wrap pb-6">
      ${NAV.map(([h,t])=>`<a class="ml ${active(h)?'on':''}" href="${h}">${t}${ico('arrow')}</a>`).join('')}
      <a href="/produk?s=pulsa" class="btn btn-red w-full mt-5 !text-lg !py-4">Top up sekarang</a>
    </div>`;
  document.body.prepend(el);
  const hb=el.querySelector('#hb'),mm=el.querySelector('#mm');
  hb.onclick=()=>{const o=mm.classList.toggle('open');hb.setAttribute('aria-expanded',o);hb.innerHTML=ico(o?'x':'menu');};
  addEventListener('scroll',()=>el.classList.toggle('scrolled',scrollY>8),{passive:true});
}
function footer(){
  const el=document.createElement('footer'); el.className='mt-20';
  const prods=CZ.order.slice(0,6).map(s=>`<li><a class="hover:text-[#228B22]" href="/produk?s=${s}">${CZ.S[s].name}</a></li>`).join('');
  el.innerHTML=`<div class="wrap"><div class="card p-7 md:p-10 grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
    <div>${CZ.logo()}<p class="c-mut mt-4 max-w-xs leading-relaxed">Semua kebutuhan digital dalam satu tempat. Pulsa, kuota, e-wallet, game, sampai tagihan, beres sekejap.</p></div>
    <div><h4 class="font-bold mb-3">Layanan</h4><ul class="space-y-2 c-mut">${prods}</ul></div>
    <div><h4 class="font-bold mb-3">Butuh bantuan?</h4><ul class="space-y-2 c-mut"><li><a href="/bantuan" class="hover:text-[#228B22]">Pusat bantuan</a></li><li><a href="/invoice" class="hover:text-[#228B22]">Cek invoice</a></li><li><a href="/bantuan#kontak" class="hover:text-[#228B22]">Ngobrol sama CS</a></li></ul></div>
    </div><p class="text-sm c-mut py-6 text-center">© ${new Date().getFullYear()} Maneela. Dibuat biar urusan digitalmu nggak ribet.</p></div>`;
  document.body.append(el);
}
CZ.reveal=()=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(n=>io.observe(n));};
CZ.qs=k=>new URLSearchParams(location.search).get(k);
CZ.orders=()=>{try{return JSON.parse(localStorage.getItem('mnl_orders')||'[]')}catch(e){return []}};
document.addEventListener('DOMContentLoaded',()=>{header();footer();CZ.reveal();});
})();
