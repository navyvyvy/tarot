
/* ═══ STARFIELD ═══ */
(function(){
  var c=document.getElementById('cvs'),X=c.getContext('2d'),stars=[];
  function rsz(){c.width=innerWidth;c.height=innerHeight}
  function ini(){stars=[];for(var i=0;i<100;i++)stars.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.2+.2,a:Math.random(),da:(Math.random()-.5)*.006,g:Math.random()<.1})}
  function drw(){if(document.hidden)return requestAnimationFrame(drw);X.clearRect(0,0,c.width,c.height);stars.forEach(function(s){s.a+=s.da;if(s.a<0||s.a>1)s.da*=-1;X.beginPath();X.arc(s.x,s.y,s.r,0,Math.PI*2);X.fillStyle=s.g?'rgba(200,164,72,'+s.a+')':'rgba(255,255,255,'+(s.a*.72)+')';X.fill()});requestAnimationFrame(drw)}
  rsz();ini();drw();addEventListener('resize',function(){rsz();ini()});
})();

function cardImgUrl(card) {
  const key = card.type === 'major'
    ? `major_${card.id}`
    : `minor_${card.suitCode}_${card.numCode}`;

  const filename = window.CARD_CONFIG[key] || 'default.webp';
  return `./assets/${filename}`;
}


/* Card back — ornate crescent moon design */
var CARD_BACK_SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 600" preserveAspectRatio="xMidYMid slice">'
+'<defs>'
+'<linearGradient id="cb" x1="0.2" y1="0" x2="0.8" y2="1">'
+'<stop offset="0%" stop-color="#100538"/>'
+'<stop offset="40%" stop-color="#1c0a4e"/>'
+'<stop offset="100%" stop-color="#06021a"/>'
+'</linearGradient>'
+'<pattern id="dp" width="22" height="22" patternUnits="userSpaceOnUse">'
+'<circle cx="11" cy="11" r="0.7" fill="#c8a448" fill-opacity="0.14"/>'
+'</pattern>'
+'<pattern id="dg" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">'
+'<rect x="0" y="0" width="40" height="40" fill="none" stroke="#c8a448" stroke-width="0.3" stroke-opacity="0.1"/>'
+'</pattern>'
+'<mask id="bm"><circle cx="175" cy="255" r="72" fill="white"/><circle cx="205" cy="236" r="57" fill="black"/></mask>'
+'<radialGradient id="mg" cx="38%" cy="38%" r="62%">'
+'<stop offset="0%" stop-color="#f6ecb4" stop-opacity="0.95"/>'
+'<stop offset="55%" stop-color="#e8d07a" stop-opacity="0.65"/>'
+'<stop offset="100%" stop-color="#c8a448" stop-opacity="0.2"/>'
+'</radialGradient>'
+'</defs>'
+'<rect width="350" height="600" fill="url(#cb)"/>'
+'<rect width="350" height="600" fill="url(#dp)"/>'
+'<rect width="350" height="600" fill="url(#dg)"/>'
+'<rect x="10" y="10" width="330" height="580" rx="12" fill="none" stroke="#c8a448" stroke-width="1.6" stroke-opacity="0.5"/>'
+'<rect x="17" y="17" width="316" height="566" rx="9" fill="none" stroke="#c8a448" stroke-width="0.7" stroke-opacity="0.22"/>'
+'<rect x="24" y="24" width="302" height="552" rx="6" fill="none" stroke="#c8a448" stroke-width="0.3" stroke-opacity="0.12"/>'
+'<g fill="none" stroke="#c8a448" stroke-opacity="0.35" stroke-width="1">'
+'<path d="M28,28 L50,28 M28,28 L28,50"/>'
+'<path d="M322,28 L300,28 M322,28 L322,50"/>'
+'<path d="M28,572 L50,572 M28,572 L28,550"/>'
+'<path d="M322,572 L300,572 M322,572 L322,550"/>'
+'</g>'
+'<line x1="55" y1="100" x2="295" y2="100" stroke="#c8a448" stroke-width="0.5" stroke-opacity="0.2"/>'
+'<circle cx="175" cy="100" r="2.5" fill="#c8a448" fill-opacity="0.3"/>'
+'<circle cx="175" cy="255" r="88" fill="none" stroke="#c8a448" stroke-width="0.4" stroke-opacity="0.1"/>'
+'<circle cx="175" cy="255" r="80" fill="none" stroke="#c8a448" stroke-width="0.3" stroke-opacity="0.08"/>'
+'<circle cx="175" cy="255" r="75" fill="#c8a448" fill-opacity="0.04" mask="url(#bm)"/>'
+'<circle cx="175" cy="255" r="72" fill="url(#mg)" mask="url(#bm)"/>'
+'<circle cx="175" cy="255" r="72" fill="none" stroke="#e8d07a" stroke-width="1.3" stroke-opacity="0.6" mask="url(#bm)"/>'
+'<circle cx="104" cy="198" r="2" fill="#e8d07a" fill-opacity="0.65"/>'
+'<circle cx="118" cy="178" r="1.2" fill="#c8a448" fill-opacity="0.45"/>'
+'<circle cx="248" cy="188" r="1.8" fill="#e8d07a" fill-opacity="0.6"/>'
+'<circle cx="263" cy="212" r="1" fill="#c8a448" fill-opacity="0.4"/>'
+'<circle cx="94" cy="292" r="1.4" fill="#c8a448" fill-opacity="0.45"/>'
+'<circle cx="260" cy="310" r="2" fill="#e8d07a" fill-opacity="0.55"/>'
+'<circle cx="136" cy="348" r="1.2" fill="#c8a448" fill-opacity="0.35"/>'
+'<circle cx="226" cy="156" r="1.2" fill="#c8a448" fill-opacity="0.4"/>'
+'<g stroke="#e8d07a" stroke-opacity="0.4" stroke-width="0.9">'
+'<line x1="104" y1="194" x2="104" y2="202"/><line x1="100" y1="198" x2="108" y2="198"/>'
+'<line x1="248" y1="184" x2="248" y2="192"/><line x1="244" y1="188" x2="252" y2="188"/>'
+'<line x1="260" y1="306" x2="260" y2="314"/><line x1="256" y1="310" x2="264" y2="310"/>'
+'</g>'
+'<line x1="55" y1="490" x2="295" y2="490" stroke="#c8a448" stroke-width="0.5" stroke-opacity="0.2"/>'
+'<circle cx="175" cy="490" r="2.5" fill="#c8a448" fill-opacity="0.3"/>'
+'<line x1="128" y1="546" x2="222" y2="546" stroke="#c8a448" stroke-width="0.4" stroke-opacity="0.22"/>'
+'</svg>';

/* Header moon SVG */
(function injectHeaderMoon(){
  var el=document.getElementById('logoMoon');
  if(!el)return;
  el.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">'
    +'<defs>'
    +'<radialGradient id="hmg" cx="35%" cy="35%" r="65%">'
    +'<stop offset="0%" stop-color="#f6ecb4" stop-opacity="0.95"/>'
    +'<stop offset="60%" stop-color="#e8d07a" stop-opacity="0.7"/>'
    +'<stop offset="100%" stop-color="#c8a448" stop-opacity="0.3"/>'
    +'</radialGradient>'
    +'<mask id="hm"><circle cx="38" cy="40" r="26" fill="white"/><circle cx="52" cy="30" r="21" fill="black"/></mask>'
    +'</defs>'
    +'<circle cx="38" cy="40" r="34" fill="#c8a448" fill-opacity="0.04"/>'
    +'<circle cx="38" cy="40" r="29" fill="#c8a448" fill-opacity="0.04"/>'
    +'<circle cx="38" cy="40" r="26" fill="url(#hmg)" mask="url(#hm)"/>'
    +'<circle cx="38" cy="40" r="26" fill="none" stroke="#e8d07a" stroke-width="1" stroke-opacity="0.65" mask="url(#hm)"/>'
    +'<circle cx="14" cy="20" r="1.8" fill="#e8d07a" fill-opacity="0.7"/>'
    +'<circle cx="64" cy="16" r="1.2" fill="#e8d07a" fill-opacity="0.6"/>'
    +'<circle cx="8" cy="54" r="1.2" fill="#e8d07a" fill-opacity="0.5"/>'
    +'<circle cx="70" cy="60" r="1.8" fill="#e8d07a" fill-opacity="0.65"/>'
    +'<circle cx="22" cy="68" r="1" fill="#e8d07a" fill-opacity="0.45"/>'
    +'<g stroke="#e8d07a" stroke-opacity="0.5" stroke-width="0.9">'
    +'<line x1="14" y1="16" x2="14" y2="24"/><line x1="10" y1="20" x2="18" y2="20"/>'
    +'<line x1="70" y1="56" x2="70" y2="64"/><line x1="66" y1="60" x2="74" y2="60"/>'
    +'</g>'
    +'</svg>';
})();

function makeImg(card, isRev, isCeltic) {
  try {
    const img = document.createElement('img');
    img.src = cardImgUrl(card);
    img.alt = cardName(card);
    img.loading = 'lazy';
    img.crossOrigin = 'anonymous';

    let classes = ['card-image'];
    if (isRev) classes.push('is-reversed');
    if (isCeltic) classes.push('card-image-celtic');
    img.className = classes.join(' ');

    img.onerror = function() {
      const colors = {
        'major': ['#1a0840','#3a1870'], 'wands': ['#3a1200','#6a2800'],
        'cups': ['#001840','#003070'], 'swords': ['#181828','#303048'], 'pentacles': ['#0a1e00','#183200']
      };
      const c = colors[card.type === 'major' ? 'major' : card.suitCode] || colors['major'];
      const ph = document.createElement('div');
      ph.className = 'card-placeholder' + (isCeltic ? ' card-image-celtic' : '');
      ph.style.background = `linear-gradient(145deg, ${c[0]}, ${c[1]})`;
      ph.innerHTML = `
        <div class="card-placeholder-num">${card.number || ''}</div>
        <div class="card-placeholder-name">${cardName(card)}</div>
      `;
      if (img.parentNode) img.parentNode.replaceChild(ph, img);
    };
    return img;
  } catch(e) { logger.error('카드 이미지 생성 오류:', e); }
}

function makeBackSVG(){
  var div=document.createElement('div');
  div.style.cssText='width:100%;height:100%;overflow:hidden';
  div.innerHTML=CARD_BACK_SVG;
  var svg=div.querySelector('svg');
  if(svg)svg.style.cssText='width:100%;height:100%;display:block';
  return div;
}

/* ── SPREAD PREVIEW (Mini Map) ── */
function buildPreview(n, pos) {
  const sl = (i) => `<div class="spread-col"><div class="spread-slot">${i+1}</div><div class="spread-label">${pos[i]}</div></div>`;
  const bl = () => `<span class="spread-blank"></span>`;

  let html = '<div class="spread-map">';
  if (n === 1) {
    html += `<div class="preview-row-flex">${sl(0)}</div>`;
  } else if (n === 3) {
    html += `<div class="preview-row-flex">${sl(0)}${sl(1)}${sl(2)}</div>`;
  } else if (n === 5) {
    html += `<div class="preview-grid-cross">${bl()}${sl(1)}${bl()}${sl(3)}${sl(0)}${sl(4)}${bl()}${sl(2)}${bl()}</div>`;
  } else if (n === 7) {
    const CS7 = 42, RS7 = 68;
    html += `<div style="position:relative;width:122px;height:${RS7*2+70}px;margin:0 auto">`;
    const sp7 = (col, row, i) => `<div class="spread-col" style="position:absolute;left:${col*CS7}px;top:${Math.round(row*RS7)}px"><div class="spread-slot">${i+1}</div><div class="spread-label">${pos[i]}</div></div>`;
    html += sp7(1,0,0) + sp7(0,0.5,4) + sp7(2,0.5,5) + sp7(1,1,6) + sp7(0,1.5,2) + sp7(2,1.5,1) + sp7(1,2,3);
    html += '</div>';
  } else if (n === 10) {
    html += `<div class="preview-grid-celtic">
               ${bl()}${sl(4)}${bl()}${bl()}${sl(9)}
               ${sl(2)}${sl(0)}${sl(1)}${sl(3)}${sl(8)}
               ${bl()}${sl(5)}${bl()}${bl()}${sl(7)}
               ${bl()}${bl()}${bl()}${bl()}${sl(6)}
             </div>`;
  }
  return html + '</div>';
}

/* ── NORU 네임스페이스 ── */
window.NORU = window.NORU || {};
var ANIM = window.NORU.anim = {
  SHUFFLE: 1800, REVEAL: 1550, BIRTH: 1400, SCROLL: 340, ARR_UPD: 120
};

var _toastTimer=null;
function showToast(msg, duration){
  var el=document.getElementById('toast');
  if(!el)return;
  el.textContent=msg;
  el.classList.add('ON');
  if(_toastTimer)clearTimeout(_toastTimer);
  _toastTimer=setTimeout(function(){el.classList.remove('ON');},duration||3000);
}

var _DEV = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
var logger = {
  error: function(msg, err) { if(_DEV) console.error('[NORU]', msg, err||''); },
  log:   function(msg, val) { if(_DEV) console.log('[NORU]', msg, val||''); }
};

var ROOT=getComputedStyle(document.documentElement);
var CARD_W=parseInt(ROOT.getPropertyValue('--cw'))||100;
var CARD_H=parseInt(ROOT.getPropertyValue('--ch'))||170;
var M7_CS=CARD_W+20;
var M7_RS=CARD_H+40;
var M7_W=M7_CS*2+CARD_W;
var M7_H=M7_RS*2+CARD_H+40;

function cardName(card){
  if(!window.LOCALE) return '';
  if(card.type==='major'){
    var maj=window.LOCALE.major[card.id];
    return maj?maj.name:'';
  }
  var suit=window.LOCALE.suits.find(function(s){return s.code===card.suitCode;});
  var num=window.LOCALE.numbers.find(function(n){return n.code===card.numCode;});
  if(!suit||!num) return '';
  var fmt=window.LOCALE.ui.minorNameFmt||'{suit}의 {num}';
  return fmt.replace('{suit}',suit.n).replace('{num}',num.label);
}

var S=window.NORU.state={mode:'',deck:'major',count:1,shuffled:[],selected:[],revealed:[],adding:false,revProb:0.5};

function show(id){
  ['s0','s1','s2','s3','s4','s5'].forEach(function(s){
    document.getElementById(s).classList.toggle('ON',s===id);
  });
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderSpInfo(){
  try{
    if(!window.LOCALE) return;
    var SP=window.LOCALE.spreads;
    var sp=SP[S.count];if(!sp)return;
    var tags=sp.pos.map(function(p,i){return '<span class="sp-tag">'+(i+1)+'. '+p+'</span>';}).join('');
    var el=document.getElementById('spInfo');
    el.className='sp-info ON';
    el.innerHTML='<h3>'+sp.title+'</h3><p>'+sp.desc+'</p><div class="sp-tags">'+tags+'</div>'+buildPreview(S.count,sp.pos);
  }catch(e){logger.error('스프레드 정보 렌더링 오류:',e);}
}

function selMode(m){
  S.mode=m;
  document.getElementById('mT').classList.toggle('is-selected',m==='tarot');
  document.getElementById('mB').classList.toggle('is-selected',m==='birth');
  show(m==='tarot'?'s1':'s5');
}

document.getElementById('mT').addEventListener('click',function(){selMode('tarot');});
document.getElementById('mB').addEventListener('click',function(){selMode('birth');});

document.querySelectorAll('.deck-btn').forEach(function(b){
  b.addEventListener('click',function(){
    document.querySelectorAll('.deck-btn').forEach(function(x){
      x.classList.remove('is-active');
      x.setAttribute('aria-checked','false');
    });
    b.classList.add('is-active');
    b.setAttribute('aria-checked','true');
    S.deck=b.dataset.deck;
  });
});

document.getElementById('revSlider').addEventListener('input',function(){
  S.revProb=parseInt(this.value)/100;
  document.getElementById('revVal').textContent=this.value+'%';
  this.setAttribute('aria-valuetext',this.value+'%');
});
document.querySelectorAll('.count-btn').forEach(function(e){
  e.addEventListener('click',function(){
    document.querySelectorAll('.count-btn').forEach(function(x){
      x.classList.remove('is-active');
      x.setAttribute('aria-checked','false');
    });
    e.classList.add('is-active');
    e.setAttribute('aria-checked','true');
    S.count=parseInt(e.dataset.n);
    renderSpInfo();
  });
});

document.getElementById('bk1').addEventListener('click',function(){show('s0');});
document.getElementById('bk2').addEventListener('click',function(){show('s1');});
document.getElementById('bk3').addEventListener('click',function(){
  if(S.adding){S.adding=false;S.selected=[];show('s4');}
  else{S.selected=[];S.shuffled=[];show('s2');}
});
document.getElementById('bk4').addEventListener('click',function(){
  S.selected=[];
  S.reversed=[];
  S.adding=false;
  var MAJ=window.LOCALE.major; var MIN=window.LOCALE.minorDataArray||[]; var ALL=window.LOCALE.allCards||[];
  var pool=(S.deck==='major'?MAJ:S.deck==='minor'?MIN:ALL).slice();
  for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=pool[i];pool[i]=pool[j];pool[j]=t;}
  S.shuffled=pool.map(function(c){var o=Object.assign({},c);o.isRev=Math.random()<S.revProb;return o;});
  document.getElementById('btnRev').className='btn-rev';
  document.getElementById('btnRev').textContent='❆  선택한 카드 펼쳐보기  ❆';
  document.getElementById('hint').innerHTML=window.LOCALE.ui.hint;
  buildTrack();show('s3');
});
document.getElementById('bk5').addEventListener('click',function(){show('s0');});

document.getElementById('toS2').addEventListener('click',function(){renderSpInfo();show('s2');});
document.getElementById('toS3').addEventListener('click',function() {
  if (document.getElementById('ovSh').classList.contains('ON')) return; // 연타 방지
  doShuffle();
});

function resetAll(){
  S={mode:'',deck:'major',count:1,shuffled:[],selected:[],revealed:[],adding:false,revProb:0.5};
  document.querySelectorAll('.deck-btn').forEach(function(b){b.classList.remove('is-active');});
  document.querySelector('.deck-btn[data-deck="major"]').classList.add('is-active');
  document.querySelectorAll('.count-btn').forEach(function(e){e.classList.remove('is-active');});
  document.querySelector('.count-btn[data-n="1"]').classList.add('is-active');
  document.getElementById('revSlider').value=50;
  document.getElementById('revVal').textContent='50%';
  document.getElementById('spInfo').className='sp-info';
  document.getElementById('spInfo').innerHTML='';
  document.getElementById('ctrack').innerHTML='';
  document.getElementById('s4grid').innerHTML='';
  document.getElementById('extraGrid').innerHTML='';
  document.getElementById('extra').style.display='none';
  document.getElementById('btnRev').className='btn-rev';
  if(window.LOCALE) document.getElementById('btnRev').textContent=window.LOCALE.ui.revealBtn;
  if(window.LOCALE) document.getElementById('hint').innerHTML=window.LOCALE.ui.hint;
  document.getElementById('btnMore').className='btn-more';
  document.getElementById('pFill').style.width='0%';
  document.getElementById('pTxt').textContent='0 / 0';
  document.getElementById('mT').classList.remove('is-selected');
  document.getElementById('mB').classList.remove('is-selected');
  document.getElementById('birthRes').className='birth-res';
  document.getElementById('birthRes').innerHTML='';
  document.getElementById('bYear').value='';
  document.getElementById('bMonth').value='';
  document.getElementById('bDay').value='';
  show('s0');
}
document.getElementById('rst4').addEventListener('click',resetAll);
document.getElementById('rst5').addEventListener('click',resetAll);

function doShuffle(){
  var ov=document.getElementById('ovSh');ov.classList.add('ON');
  setTimeout(function(){
    try{
      var MAJ=window.LOCALE.major; var MIN=window.LOCALE.minorDataArray||[]; var ALL=window.LOCALE.allCards||[];
      var pool=(S.deck==='major'?MAJ:S.deck==='minor'?MIN:ALL).slice();
      for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=pool[i];pool[i]=pool[j];pool[j]=t;}
      S.shuffled=pool.map(function(c){var o=Object.assign({},c);o.isRev=Math.random()<S.revProb;return o;});
      S.selected=[];S.revealed=[];S.adding=false;
      document.getElementById('btnRev').className='btn-rev';
      document.getElementById('s4grid').innerHTML='';
      document.getElementById('extraGrid').innerHTML='';
      document.getElementById('extra').style.display='none';
      buildTrack();show('s3');
    } catch(e){
      logger.error('셔플 오류:',e);
      showToast(window.LOCALE&&window.LOCALE.ui.errorShuffle||'카드를 섞는 중 오류가 발생했습니다.');
    } finally {
      ov.classList.remove('ON');
    }
  },ANIM.SHUFFLE);
}

/* ── TRACK BUILD ── */
function buildTrack() {
  try {
    if (!S.adding) {
      S.selected = [];
      document.getElementById('btnRev').className = 'btn-rev';
      updProg();
    }

    const tr = document.getElementById('ctrack');
    tr.innerHTML = ''; tr.scrollLeft = 0;
    const fragment = document.createDocumentFragment();

    S.shuffled.forEach(function(card, idx) {
      const el = document.createElement('div');
      el.className = 'track-card';
      el.dataset.i = idx;

      const back = makeBackSVG();
      back.style.cssText = 'position:absolute;inset:0;pointer-events:none';

      el.innerHTML = `<span class="track-card-num">#${('00'+(idx+1)).slice(-3)}</span>`;
      el.appendChild(back);

      setTimeout(function() {
        el.classList.add('show');
      }, 15 + idx * 4);

      el.addEventListener('click', function() { pick(idx, el); });
      fragment.appendChild(el);
    });

    tr.appendChild(fragment);
    setTimeout(updArr, ANIM.ARR_UPD);
  } catch(e) { logger.error('카드 트랙 빌드 오류:', e); }
}

(function initTrackEvents(){
  var tr=document.getElementById('ctrack');
  tr.addEventListener('wheel',function(e){
    if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){
      e.preventDefault();
      tr.scrollBy({left:e.deltaY*2,behavior:'smooth'});
      setTimeout(updArr,200);
    }
  },{passive:false});
  tr.addEventListener('scroll',updArr);
  setupDrag(tr);
})();

function pick(idx,el){
  if(S.adding){
    var p=S.selected.indexOf(idx);
    if(p>-1){S.selected.splice(p,1);el.classList.remove('is-selected');}
    else{S.selected.push(idx);el.classList.add('is-selected');}
    var n=S.selected.length;
    var pct=n===0?0:100;
    document.getElementById('pFill').style.width=pct+'%';
    document.getElementById('pTxt').textContent=n+window.LOCALE.ui.cardCountSelected;
    document.getElementById('btnRev').classList.toggle('ON',n>0);
    return;
  }
  var p=S.selected.indexOf(idx);
  if(p>-1){
    S.selected.splice(p,1);
    el.classList.remove('is-selected');
  } else {
    if(S.selected.length>=S.count) return;
    S.selected.push(idx);
    el.classList.add('is-selected');
  }
  updProg();
  document.getElementById('btnRev').classList.toggle('ON',S.selected.length===S.count);
}

function updProg(){
  var pct=S.count>0?(S.selected.length/S.count)*100:0;
  document.getElementById('pFill').style.width=pct+'%';
  document.getElementById('pTxt').textContent=S.selected.length+' / '+S.count;
  var pb=document.querySelector('[role="progressbar"]');
  if(pb)pb.setAttribute('aria-valuenow',Math.round(pct));
}

document.getElementById('arrL').addEventListener('click',function(){scrollTr(-1);});
document.getElementById('arrR').addEventListener('click',function(){scrollTr(1);});
function scrollTr(d){
  var t=document.getElementById('ctrack');
  t.scrollBy({left:d*340,behavior:'smooth'});setTimeout(updArr,ANIM.SCROLL);
}
function updArr(){
  var t=document.getElementById('ctrack'),L=document.getElementById('arrL'),R=document.getElementById('arrR');
  if(!t)return;
  L.classList.toggle('H',t.scrollLeft<=3);
  R.classList.toggle('H',t.scrollLeft+t.clientWidth>=t.scrollWidth-3);
}

function setupDrag(tr){
  var dn=false,sx=0,sl=0,dr=false;
  tr.addEventListener('mousedown',function(e){dn=true;dr=false;sx=e.pageX-tr.offsetLeft;sl=tr.scrollLeft;tr.style.cursor='grabbing';});
  document.addEventListener('mouseup',function(){dn=false;tr.style.cursor='grab';});
  tr.addEventListener('mousemove',function(e){
    if(!dn)return;e.preventDefault();
    var dx=(e.pageX-tr.offsetLeft)-sx;if(Math.abs(dx)>4)dr=true;
    tr.scrollLeft=sl-dx*1.3;updArr();
  });
  tr.addEventListener('click',function(e){if(dr){e.stopPropagation();dr=false;}},true);
}

document.getElementById('btnRev').addEventListener('click',function(){
  if (document.getElementById('ovRv').classList.contains('ON')) return; // 연타 방지
  if(S.adding){
    if(!S.selected.length)return;
    var SP=window.LOCALE.spreads;
    var nc=S.selected.map(function(i){return S.shuffled[i];});
    var base=S.revealed.length;
    nc.forEach(function(c){S.revealed.push(c);});
    S.adding=false;S.selected=[];
    document.getElementById('hint').innerHTML=window.LOCALE.ui.hint;
    document.getElementById('btnRev').textContent='❆  선택한 카드 펼쳐보기  ❆';
    var ex=document.getElementById('extra');ex.style.display='block';
    var eg=document.getElementById('extraGrid');
    nc.forEach(function(c,i){eg.appendChild(mkCard(c,'추가 #'+(base+i-SP[S.count].pos.length+1),base+i));});
    show('s4');refreshMore();
    setTimeout(function(){ex.scrollIntoView({behavior:'smooth',block:'nearest'});},200);
  } else {
    if(S.selected.length<S.count)return;
    var ov=document.getElementById('ovRv');ov.classList.add('ON');
    setTimeout(function(){ov.classList.remove('ON');doReveal();},ANIM.REVEAL);
  }
});

function doReveal(){
  try{
    var SP=window.LOCALE.spreads;
    S.revealed=S.selected.map(function(i){return S.shuffled[i];});
    var sp=SP[S.count];
    document.getElementById('s4title').textContent=sp.title;
    document.getElementById('s4desc').textContent=sp.desc;
    var g=document.getElementById('s4grid');g.innerHTML='';
    buildGrid(S.revealed,sp,g);
    show('s4');refreshMore();
  }catch(e){
    logger.error('카드 공개 오류:',e);
    showToast(window.LOCALE&&window.LOCALE.ui.errorReveal||'카드를 공개하는 중 오류가 발생했습니다.');
  }
}

function blankPC(isCeltic) {
  const d = document.createElement('div');
  d.className = 'result-card-blank' + (isCeltic ? ' is-celtic' : '');
  return d;
}

function mkCard(card, lbl, idx, isCeltic) {
  try {
    const el = document.createElement('div');
    el.className = 'result-card' + (isCeltic ? ' is-celtic' : '');

    const numPrefix = typeof idx === 'number' ? `${idx + 1}. ` : '';
    const revSuffix = card.isRev ? ` · ${window.LOCALE.ui.reversedShort}` : '';
    const labelClass = card.isRev ? 'result-label is-reversed' : 'result-label';

    el.innerHTML = `
      <div class="result-frame"></div>
      <div class="${labelClass}">${numPrefix}${lbl || '카드 ' + (idx + 1)}${revSuffix}</div>
      <div class="result-name">${cardName(card)}</div>
    `;

    const frame = el.querySelector('.result-frame');
    frame.appendChild(makeImg(card, card.isRev, isCeltic));

    el.addEventListener('click', () => openModal(card));

    const delay = Math.min(idx, 8) * 80;
    setTimeout(() => {
      el.classList.add('show');
      setTimeout(() => frame.classList.add('flip-in'), 120);
    }, delay + 10);

    return el;
  } catch(e) {
    logger.error('카드 생성 오류:', e);
    return document.createElement('div');
  }
}

function buildGrid(cards, sp, con) {
  try {
    var L = sp.lay;
    if (L === 'flex') {
      var row = document.createElement('div'); row.className = 'result-grid-flex';
      cards.forEach(function(c, i) { row.appendChild(mkCard(c, sp.pos[i] || '', i)); });
      con.appendChild(row);
      return;
    }
    if (L === 'cross5') {
      var g = document.createElement('div'); g.className = 'result-grid-cross';
      var bl = blankPC.bind(null, false);
      g.appendChild(bl()); g.appendChild(mkCard(cards[1], sp.pos[1], 1)); g.appendChild(bl());
      g.appendChild(mkCard(cards[3], sp.pos[3], 3));
      g.appendChild(mkCard(cards[0], sp.pos[0], 0));
      g.appendChild(mkCard(cards[4], sp.pos[4], 4));
      g.appendChild(bl()); g.appendChild(mkCard(cards[2], sp.pos[2], 2)); g.appendChild(bl());
      con.appendChild(g);
      return;
    }
    if (L === 'seven') {
      var g = document.createElement('div'); g.className = 'result-grid-seven';
      var CS = M7_CS, RS = M7_RS;
      g.style.width = M7_W + 'px'; g.style.height = M7_H + 'px';
      var pos7 = [
        [0, 1, 0  ], [4, 0, 0.5], [5, 2, 0.5], [6, 1, 1  ],
        [2, 0, 1.5], [1, 2, 1.5], [3, 1, 2  ]
      ];
      pos7.forEach(function(p) {
        var cardIdx = p[0], col = p[1], row = p[2];
        var pc = mkCard(cards[cardIdx], sp.pos[cardIdx], cardIdx);
        pc.style.position = 'absolute';
        pc.style.left = (col * CS) + 'px';
        pc.style.top = (row * RS) + 'px';
        g.appendChild(pc);
      });
      con.appendChild(g);
      return;
    }
    if (L === 'celtic') {
      var g = document.createElement('div'); g.className = 'result-grid-celtic';
      var bl = blankPC.bind(null, true);
      g.appendChild(bl()); g.appendChild(mkCard(cards[4], sp.pos[4], 4, true));
      g.appendChild(bl()); g.appendChild(bl()); g.appendChild(mkCard(cards[9], sp.pos[9], 9, true));

      g.appendChild(mkCard(cards[2], sp.pos[2], 2, true)); g.appendChild(mkCard(cards[0], sp.pos[0], 0, true));
      g.appendChild(mkCard(cards[1], sp.pos[1], 1, true)); g.appendChild(mkCard(cards[3], sp.pos[3], 3, true));
      g.appendChild(mkCard(cards[8], sp.pos[8], 8, true));

      g.appendChild(bl()); g.appendChild(mkCard(cards[5], sp.pos[5], 5, true));
      g.appendChild(bl()); g.appendChild(bl()); g.appendChild(mkCard(cards[7], sp.pos[7], 7, true));

      g.appendChild(bl()); g.appendChild(bl()); g.appendChild(bl()); g.appendChild(bl());
      g.appendChild(mkCard(cards[6], sp.pos[6], 6, true));
      con.appendChild(g);
      return;
    }
  } catch(e) {
    logger.error('결과 그리드 렌더링 오류:', e);
    showToast(window.LOCALE && window.LOCALE.ui.errorGrid || '결과를 표시하는 중 오류가 발생했습니다.');
  }
}

function getRemaining(){
  var MAJ=window.LOCALE.major; var MIN=window.LOCALE.minorDataArray||[]; var ALL=window.LOCALE.allCards||[];
  var used={};S.revealed.forEach(function(c){used[c.id]=true;});
  return(S.deck==='major'?MAJ:S.deck==='minor'?MIN:ALL).filter(function(c){return !used[c.id];});
}
function refreshMore(){
  document.getElementById('btnMore').classList.toggle('ON',getRemaining().length>0);
}
document.getElementById('btnMore').addEventListener('click',function(){
  var pool=getRemaining();if(!pool.length)return;
  for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=pool[i];pool[i]=pool[j];pool[j]=t;}
  S.shuffled=pool.map(function(c){var o=Object.assign({},c);o.isRev=Math.random()<S.revProb;return o;});
  S.adding=true;
  S.selected=[];
  document.getElementById('pFill').style.width='0%';
  document.getElementById('pTxt').textContent='0장 선택';
  document.getElementById('btnRev').className='btn-rev';
  document.getElementById('btnRev').textContent='❆  결과에 추가하기  ❆';
  document.getElementById('hint').innerHTML=window.LOCALE.ui.hintAdd;
  buildTrack();
  show('s3');
});

/* ── BIRTH CARD CALCULATOR ── */
(function initBirthSelects(){
  var ySel=document.getElementById('bYear');
  var mSel=document.getElementById('bMonth');
  var dSel=document.getElementById('bDay');
  ySel.innerHTML='<option value="">연도</option>';
  var thisYear=new Date().getFullYear();
  for(var y=thisYear;y>=1924;y--){
    var op=document.createElement('option');op.value=y;op.textContent=y+'년';ySel.appendChild(op);
  }
  function updateDays(){
    var m=parseInt(mSel.value)||0,yr=parseInt(ySel.value)||2000,prev=parseInt(dSel.value)||0;
    var maxD=31;
    if(m){
      if([4,6,9,11].indexOf(m)>-1)maxD=30;
      else if(m===2)maxD=(yr%4===0&&(yr%100!==0||yr%400===0))?29:28;
    }
    dSel.innerHTML='<option value="">일</option>';
    for(var d=1;d<=maxD;d++){
      var op=document.createElement('option');op.value=d;op.textContent=d+'일';
      if(d===prev)op.selected=true;dSel.appendChild(op);
    }
  }
  mSel.addEventListener('change',updateDays);
  ySel.addEventListener('change',updateDays);
  updateDays();
})();

document.getElementById('calcBtn').addEventListener('click',function(){
  var yr=parseInt(document.getElementById('bYear').value)||0;
  var mo=parseInt(document.getElementById('bMonth').value)||0;
  var dy=parseInt(document.getElementById('bDay').value)||0;
  var res=document.getElementById('birthRes');
  if(!yr||!mo||!dy){
    res.innerHTML='<p style="color:var(--acc);text-align:center;font-size:.85rem;padding:12px">'+window.LOCALE.ui.birthError+'</p>';
    res.className='birth-res ON';return;
  }
  var ov=document.getElementById('ovRv');
  ov.classList.add('ON');
  setTimeout(function(){
    ov.classList.remove('ON');
    try{
      var BP=window.LOCALE.birthPairs;
      var mm=mo, dd=dy, cc=Math.floor(yr/100), yy=yr%100;
      if(isNaN(mm+dd+cc+yy)) throw new Error('날짜 값이 올바르지 않습니다.');
      var total=mm+dd+cc+yy;
      var first=total;
      while(first>21){
        var s=String(first);
        if(s.length>=3){first=parseInt(s.slice(0,2))+parseInt(s.slice(2));}
        else{first=Math.floor(first/10)+(first%10);}
      }
      var second=Math.floor(first/10)+(first%10);
      if(second===0||second===first)second=first%10||first;
      var bp=BP[first]||{c:[first,second],d:'두 카드의 에너지가 함께합니다.'};
      renderBirth(bp);
    } catch(e){
      logger.error('탄생카드 계산 오류:',e);
      var res=document.getElementById('birthRes');
      res.innerHTML='<p style="color:var(--acc);text-align:center;padding:12px;font-size:.85rem">'+window.LOCALE.ui.birthCalcError+'</p>';
      res.className='birth-res ON';
    }
  },ANIM.BIRTH);
});

function renderBirth(bp){
  var res=document.getElementById('birthRes');
  try{
    var MAJ=window.LOCALE.major;
    var cards=bp.c.map(function(id){return MAJ[id];}).filter(Boolean);
    if(!cards.length) throw new Error('카드 데이터를 찾을 수 없습니다.');

    var H='';
    if(bp.trio)H+='<div class="trio-note">'+window.LOCALE.ui.birthTrioNote+'</div>';
    H+='<div class="birth-cards">';
    cards.forEach(function(c,i){
      H+=`<div class="result-card show" id="bpc${i}" style="cursor:pointer;">
            <div class="result-frame flip-in" id="bpf${i}"></div>
            <div class="result-label">${window.LOCALE.ui.majorNumPrefix || 'No.'}${c.number}</div>
            <div class="result-name">${c.name}</div>
          </div>`;
    });
    H+='</div>';
    H+='<div class="birth-desc-box"><h4>'+window.LOCALE.ui.birthDescTitle+'</h4><p>'+bp.d+'</p></div>';
    res.innerHTML=H;res.className='birth-res ON';

    cards.forEach(function(c,i){
      var f=document.getElementById('bpf'+i);if(!f)return;
      f.appendChild(makeImg(c, false, false));
      var w=document.getElementById('bpc'+i);
      if(w)(function(card){
        w.addEventListener('click',function(){openModal(card);});
        var frame=w.querySelector('.result-frame');
        if(frame){
          frame.style.cursor='zoom-in';
          frame.addEventListener('click',function(e){
            e.stopPropagation();
            openImgZoom(card);
          });
        }
      })(c);
    });
  }catch(e){
    logger.error('탄생카드 렌더링 오류:',e);
    res.innerHTML='<p style="color:var(--acc);text-align:center;padding:12px">표시 중 오류가 발생했습니다.</p>';
    res.className='birth-res ON';
  }
}

/* ── MODAL ── */
function openModal(card) {
  try {
    const ALL=window.LOCALE.allCards||[];
    const full = ALL.find(c => c.id === card.id) || card;
    const box = document.getElementById('mImgBox');

    box.innerHTML = `
      <div class="modal-img-wrapper" style="width:120px;height:205px;border-radius:9px;overflow:hidden;border:2px solid rgba(200,164,72,.38);flex-shrink:0;${card.isRev ? 'transform:rotate(180deg)' : ''}">
      </div>
    `;
    const wrap = box.querySelector('.modal-img-wrapper');
    wrap.appendChild(makeImg(card, false, false));
    wrap.addEventListener('click', (e) => { e.stopPropagation(); openImgZoom(card); });

    const L = window.LOCALE.ui;
    const suitObj = window.LOCALE.suits ? window.LOCALE.suits.find(s => s.code === full.suitCode) : null;
    document.getElementById('mArc').textContent = (full.type === 'major' || !full.suitCode)
      ? `${L.modalArcMajor} · ${L.majorNumPrefix || 'No.'}${full.number}`
      : `${L.modalArcMinor} · ${suitObj ? suitObj.n : ''}`;
    document.getElementById('mName').textContent = cardName(full);
    document.getElementById('mRevTag').innerHTML = card.isRev ? `<span class="m-rev">${L.modalReversed}</span>` : '';
    document.getElementById('mKws').innerHTML = full.keywords.map(k => `<span class="modal-kw">${k}</span>`).join('');

    const body = document.getElementById('mBody');
    body.innerHTML = `
      <div class="modal-section">
        <div class="modal-section-title">${card.isRev ? L.modalSectionReversed : L.modalSectionUpright}</div>
        <div class="modal-highlight"><p>${card.isRev ? full.rv : full.up}</p></div>
        ${!card.isRev && full.rv ? `<div class="modal-rev-note"><em>${L.modalReversedPrefix} </em>${full.rv}</div>` : ''}
      </div>
      <div class="modal-section">
        <div class="modal-section-title">${L.modalSectionLove}</div>
        <p>${full.lv || ''}</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">${L.modalSectionCareer}</div>
        <p>${full.ca || ''}</p>
      </div>
    `;

    document.getElementById('mbg').classList.add('OPEN');
    document.body.style.overflow = 'hidden';

    _modalPrevFocus = document.activeElement;
    setTimeout(() => {
      const closeBtn = document.getElementById('mClose');
      if(closeBtn) closeBtn.focus();
    }, 50);
  } catch(e) { logger.error('모달 오류:', e); }
}

document.getElementById('mbg').addEventListener('keydown',function(e){
  if(!this.classList.contains('OPEN')) return;
  if(e.key!=='Tab') return;
  var focusable=this.querySelectorAll('button,a,[href],[tabindex]:not([tabindex="-1"]),[role="button"]');
  if(!focusable.length)return;
  var first=focusable[0], last=focusable[focusable.length-1];
  if(e.shiftKey){ if(document.activeElement===first){e.preventDefault();last.focus();} }
  else          { if(document.activeElement===last) {e.preventDefault();first.focus();} }
});

document.getElementById('mbg').addEventListener('click',function(e){if(e.target===this)closeModal();});
document.getElementById('mClose').addEventListener('click',closeModal);
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    if(document.getElementById('imgZoom').classList.contains('OPEN'))closeImgZoom();
    else closeModal();
  }
});

var _modalPrevFocus=null;
function closeModal(){
  document.getElementById('mbg').classList.remove('OPEN');
  document.body.style.overflow='';
  if(_modalPrevFocus&&_modalPrevFocus.focus){
    try{_modalPrevFocus.focus();}catch(e){}
    _modalPrevFocus=null;
  }
}

/* ── IMAGE ZOOM ── */
function openImgZoom(card){
  var zw=document.getElementById('imgZoomWrap');
  zw.innerHTML='';
  var img=makeImg(card, card.isRev, false);
  img.style.cssText='width:100%;height:auto;border-radius:12px;display:block;max-height:88vh;object-fit:contain;'
    +(card.isRev?'transform:rotate(180deg)':'');
  zw.appendChild(img);
  document.getElementById('imgZoom').classList.add('OPEN');
}
function closeImgZoom(){document.getElementById('imgZoom').classList.remove('OPEN');}
document.getElementById('imgZoom').addEventListener('click',closeImgZoom);


/* ── i18n Data Load Setup ── */
function initializeData(){
  if(!window.LOCALE) {
    logger.error("locale 로드 실패");
    return;
  }
  var MAJ=window.LOCALE.major;
  var SDS=window.LOCALE.suits;
  var NK=window.LOCALE.numbers;
  var MINOR_DATA=window.LOCALE.minorData;

  function buildMinor(){
    var c=[],id=MAJ.length;
    SDS.forEach(function(s){
      NK.forEach(function(num,ni){
        var key=s.code+'.'+num.code;
        var fb=window.LOCALE.ui.minorFallback||{};
        var d=MINOR_DATA[key]||{
          up:(fb.up||'').replace('{suit}',s.n).replace('{elem}',s.e).replace('{num}',num.label).replace('{theme}',s.t),
          rv:(fb.rv||'').replace('{suit}',s.n),
          lv:(fb.lv||'').replace('{elem}',s.e),
          ca:(fb.ca||'').replace('{theme}',s.t)
        };
        var kws=[s.e,s.n,num.label];
        c.push({id:id++,type:'minor',suitCode:s.code,numCode:num.code,keywords:kws,up:d.up,rv:d.rv,lv:d.lv,ca:d.ca});
      });
    });
    return c;
  }

  window.LOCALE.minorDataArray = buildMinor();
  window.LOCALE.allCards = MAJ.concat(window.LOCALE.minorDataArray);

  renderSpInfo();
  applyLocale();
  handleStartUrl();
}

function handleStartUrl(){
  var params=new URLSearchParams(window.location.search);
  var mode=params.get('mode');
  if(mode==='tarot') selMode('tarot');
  else if(mode==='birth') selMode('birth');
}

function applyLocale(){
  var L=window.LOCALE;
  if(!L)return;
  if(L.lang) document.documentElement.lang=L.lang;
  if(L.dir)  document.documentElement.dir=L.dir;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var key=el.getAttribute('data-i18n');
    var parts=key.split('.');
    var val=L;
    for(var i=0;i<parts.length;i++){
      val=val&&val[parts[i]];
    }
    if(val&&typeof val==='string') el.textContent=val;
  });
}

// Ensure data is built once script is parsed
window.addEventListener('DOMContentLoaded', initializeData);

/* Service Worker 등록 */
if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    var verMeta=document.querySelector('meta[name="app-version"]');
    var appVer=verMeta?verMeta.getAttribute('content'):'1.0.0';
    navigator.serviceWorker.register('./sw.js')
      .then(function(reg){
        if(reg.active){
          reg.active.postMessage({type:'SET_VERSION',version:appVer});
        }
        reg.addEventListener('updatefound',function(){
          var sw=reg.installing;
          if(sw) sw.addEventListener('statechange',function(){
            if(sw.state==='installed'&&navigator.serviceWorker.controller){
              sw.postMessage({type:'SET_VERSION',version:appVer});
            }
          });
        });
      })
      .catch(function(err){
        logger.error('SW 등록 실패:', err);
      });
  });
}