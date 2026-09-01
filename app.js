
/* ═══ STARFIELD ═══ */
(function(){
  var c=document.getElementById('cvs'),X=c.getContext('2d'),stars=[];
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var running=false;
  function rsz(){c.width=innerWidth;c.height=innerHeight}
  function ini(){stars=[];for(var i=0;i<100;i++)stars.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.2+.2,a:Math.random(),da:(Math.random()-.5)*.006,g:Math.random()<.1})}
  function drw(){if(document.hidden){running=false;return;}running=true;X.clearRect(0,0,c.width,c.height);stars.forEach(function(s){s.a+=s.da;if(s.a<0||s.a>1)s.da*=-1;X.beginPath();X.arc(s.x,s.y,s.r,0,Math.PI*2);X.fillStyle=s.g?'rgba(200,164,72,'+s.a+')':'rgba(255,255,255,'+(s.a*.72)+')';X.fill()});requestAnimationFrame(drw)}
  rsz();ini();drw();addEventListener('resize',function(){rsz();ini()});
  document.addEventListener('visibilitychange',function(){if(!document.hidden&&!running)drw();});
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
+'<mask id="bm"><circle cx="175" cy="300" r="72" fill="white"/><circle cx="205" cy="281" r="57" fill="black"/></mask>'
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
+'<circle cx="175" cy="300" r="88" fill="none" stroke="#c8a448" stroke-width="0.4" stroke-opacity="0.1"/>'
+'<circle cx="175" cy="300" r="80" fill="none" stroke="#c8a448" stroke-width="0.3" stroke-opacity="0.08"/>'
+'<circle cx="175" cy="300" r="75" fill="#c8a448" fill-opacity="0.04" mask="url(#bm)"/>'
+'<circle cx="175" cy="300" r="72" fill="url(#mg)" mask="url(#bm)"/>'
+'<circle cx="175" cy="300" r="72" fill="none" stroke="#e8d07a" stroke-width="1.3" stroke-opacity="0.6" mask="url(#bm)"/>'
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

function makeImg(card, isRev) {
  try {
    const img = document.createElement('img');
    img.src = cardImgUrl(card);
    img.alt = cardName(card);
    img.loading = 'lazy';

    let classes = ['card-image'];
    if (isRev) classes.push('is-reversed');
    img.className = classes.join(' ');

    img.onerror = function() {
      const colors = {
        'major': ['#1a0840','#3a1870'], 'wands': ['#3a1200','#6a2800'],
        'cups': ['#001840','#003070'], 'swords': ['#181828','#303048'], 'pentacles': ['#0a1e00','#183200']
      };
      const c = colors[card.type === 'major' ? 'major' : card.suitCode] || colors['major'];
      const ph = document.createElement('div');
      ph.className = 'card-placeholder';
      ph.style.background = `linear-gradient(145deg, ${c[0]}, ${c[1]})`;
      ph.innerHTML = `
        <div class="card-placeholder-num">${card.number || ''}</div>
        <div class="card-placeholder-name">${cardName(card)}</div>
      `;
      if (img.parentNode) img.parentNode.replaceChild(ph, img);
    };
    return img;
  } catch(e) {
    logger.error('카드 이미지 생성 오류:', e);
    return document.createElement('span');
  }
}

var CARD_BACK_URL='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(CARD_BACK_SVG);
function makeBackSVG(){
  var img=document.createElement('img');
  img.className='card-back-image';
  img.src=CARD_BACK_URL;
  img.alt='';
  img.setAttribute('aria-hidden','true');
  return img;
}

document.querySelectorAll('.sh-c,.rv-c').forEach(function(el){el.appendChild(makeBackSVG());});

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
    const CS7 = 60, RS7 = 78;
    html += `<div style="position:relative;width:176px;height:${RS7*2+84}px;margin:0 auto">`;
    const sp7 = (col, row, i) => `<div class="spread-col spread-col-seven" style="position:absolute;left:${col*CS7}px;top:${Math.round(row*RS7)}px"><div class="spread-slot">${i+1}</div><div class="spread-label">${pos[i]}</div></div>`;
    html += sp7(1,0,0) + sp7(0,0.5,4) + sp7(2,0.5,5) + sp7(1,1,6) + sp7(0,1.5,2) + sp7(2,1.5,1) + sp7(1,2,3);
    html += '</div>';
  } else if (n === 10) {
    html += `<div class="preview-grid-celtic">
               ${bl()}${sl(2)}${bl()}${bl()}${sl(9)}
               ${sl(4)}${sl(0)}${sl(1)}${sl(5)}${sl(8)}
               ${bl()}${sl(3)}${bl()}${bl()}${sl(7)}
               ${bl()}${bl()}${bl()}${bl()}${sl(6)}
             </div>`;
  }
  return html + '</div>';
}

/* ── NORU 네임스페이스 ── */
window.NORU = window.NORU || {};
var CORE=window.NORU.core;
var REDUCED_MOTION=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var ANIM = window.NORU.anim = {
  SHUFFLE: REDUCED_MOTION?0:1800,
  REVEAL: REDUCED_MOTION?0:1550,
  BIRTH: REDUCED_MOTION?0:1400,
  SCROLL: REDUCED_MOTION?0:340,
  ARR_UPD: REDUCED_MOTION?0:120
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

var logger = {
  error: function(msg, err) { console.error('[NORU]', msg, err||''); }
};

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

var S=window.NORU.state={mode:'',topic:'general',deck:'major',count:1,shuffled:[],selected:[],revealed:[],adding:false,revProb:0.5};

function deckCards(){
  return S.deck==='major'
    ? window.LOCALE.major
    : S.deck==='minor'
      ? window.LOCALE.minorDataArray||[]
      : window.LOCALE.allCards||[];
}

function reshuffle(cards){
  S.shuffled=CORE.shuffleDeck(cards||deckCards(),S.revProb);
}

var _historyReady=false;
var _historyDepth=0;
var _historySilent=false;

function clearReadingParam(){
  var url=new URL(location.href);
  if(!url.searchParams.has('reading'))return;
  url.searchParams.delete('reading');
  history.replaceState(history.state,'',url);
}

function show(id,historyMode){
  if(id==='s0')clearMainSelections();
  ['s0','s1','s2','s3','s4','s5','s6'].forEach(function(s){
    var step=document.getElementById(s);
    var active=s===id;
    step.hidden=!active;
    step.classList.toggle('ON',active);
  });
  window.scrollTo({top:0,behavior:REDUCED_MOTION?'auto':'smooth'});
  requestAnimationFrame(function(){
    var title=document.querySelector('#'+id+' h2[tabindex="-1"]');
    if(title)title.focus({preventScroll:true});
  });
  if(_historyReady&&!_historySilent){
    if(historyMode==='replace'){
      if(id==='s0'&&!S.mode)_historyDepth=0;
      history.replaceState({noruStep:id,noruDepth:_historyDepth},'',location.href);
    }else if(!history.state||history.state.noruStep!==id){
      _historyDepth+=1;
      history.pushState({noruStep:id,noruDepth:_historyDepth},'',location.href);
    }
  }
}

function goBack(fallback){
  if(_historyReady&&history.state&&history.state.noruDepth>0)history.back();
  else show(fallback,'replace');
}

function initHistory(){
  var current=document.querySelector('.step.ON');
  _historyDepth=0;
  history.replaceState({noruStep:current?current.id:'s0',noruDepth:0},'',location.href);
  _historyReady=true;
  window.addEventListener('popstate',function(event){
    var id=event.state&&event.state.noruStep||'s0';
    if(!S.mode&&id!=='s0')id='s0';
    _historyDepth=event.state&&event.state.noruDepth||0;
    _historySilent=true;
    show(id);
    _historySilent=false;
  });
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
  }catch(e){
    logger.error('스프레드 정보 렌더링 오류:',e);
    showToast(window.LOCALE&&window.LOCALE.ui.errorRender||'화면을 표시하는 중 문제가 생겼습니다.');
  }
}

function selMode(m){
  S.mode=m;
  document.getElementById('mB').classList.toggle('is-selected',m==='birth');
  document.getElementById('mD').classList.remove('is-selected');
  show(m==='tarot'?'s1':'s5');
}

function topicInfo(){
  return window.LOCALE.topics[S.topic]||window.LOCALE.topics.general;
}
function updateTopicButtons(){
  document.querySelectorAll('.topic-btn').forEach(function(button){
    var active=button.dataset.topic===S.topic;
    button.classList.toggle('is-selected',active);
    button.setAttribute('aria-pressed',String(active));
  });
}
function clearMainSelections(){
  document.querySelectorAll('.mode-card, .topic-btn').forEach(function(button){
    button.classList.remove('is-selected');
    if(button.classList.contains('topic-btn'))button.setAttribute('aria-pressed','false');
  });
}
function selectTopic(topic){
  S.topic=window.LOCALE.topics[topic]?topic:'general';
  updateTopicButtons();
  selMode('tarot');
}

document.getElementById('mB').addEventListener('click',function(){selMode('birth');});
document.querySelectorAll('.topic-btn').forEach(function(button){
  button.addEventListener('click',function(){selectTopic(button.dataset.topic);});
});

document.querySelectorAll('.deck-input').forEach(function(input){
  input.addEventListener('change',function(){
    if(input.checked)S.deck=input.value;
  });
});

document.getElementById('revSlider').addEventListener('input',function(){
  S.revProb=parseInt(this.value)/100;
  document.getElementById('revVal').textContent=this.value+'%';
  this.setAttribute('aria-valuetext',this.value+'%');
});
document.querySelectorAll('.count-input').forEach(function(input){
  input.addEventListener('change',function(){
    if(!input.checked)return;
    S.count=parseInt(input.value,10);
    renderSpInfo();
  });
});

document.getElementById('bk1').addEventListener('click',resetAll);
document.getElementById('bk2').addEventListener('click',function(){goBack('s1');});
document.getElementById('bk3').addEventListener('click',function(){
  if(S.adding){S.adding=false;S.selected=[];goBack('s4');}
  else{S.selected=[];S.shuffled=[];goBack('s2');}
});
document.getElementById('bk4').addEventListener('click',function(){
  clearReadingParam();
  S.selected=[];
  S.revealed=[];
  S.adding=false;
  reshuffle();
  document.getElementById('btnRev').className='btn-rev';
  document.getElementById('btnRev').textContent='선택한 카드 펼치기';
  document.getElementById('hint').innerHTML=window.LOCALE.ui.hint;
  buildTrack();goBack('s3');
});
document.getElementById('bk5').addEventListener('click',resetAll);

document.getElementById('toS2').addEventListener('click',function(){renderSpInfo();show('s2');});
document.getElementById('toS3').addEventListener('click',function() {
  if (document.getElementById('ovSh').classList.contains('ON')) return; // 연타 방지
  doShuffle();
});

function resetAll(){
  history.replaceState(history.state,'',new URL('.',location.href));
  Object.assign(S,{mode:'',topic:'general',deck:'major',count:1,shuffled:[],selected:[],revealed:[],adding:false,revProb:0.5});
  document.querySelector('.deck-input[value="major"]').checked=true;
  document.querySelector('.count-input[value="1"]').checked=true;
  document.getElementById('revSlider').value=50;
  document.getElementById('revVal').textContent='50%';
  document.getElementById('spInfo').className='sp-info';
  document.getElementById('spInfo').innerHTML='';
  document.getElementById('ctrack').innerHTML='';
  document.getElementById('s4grid').innerHTML='';
  document.getElementById('s4extraGrid').innerHTML='';
  document.getElementById('resultExtras').hidden=true;
  document.getElementById('readingOverview').textContent='';
  document.getElementById('readingCards').innerHTML='';
  document.getElementById('extraReadings').innerHTML='';
  document.getElementById('openExtraDetails').hidden=true;
  ['readingDetails','extra'].forEach(function(id){var dialog=document.getElementById(id);if(dialog.open)dialog.close();});
  document.getElementById('btnRev').className='btn-rev';
  if(window.LOCALE) document.getElementById('btnRev').textContent=window.LOCALE.ui.revealBtn;
  if(window.LOCALE) document.getElementById('hint').innerHTML=window.LOCALE.ui.hint;
  document.getElementById('btnMore').className='btn-more';
  document.getElementById('pFill').style.width='0%';
  document.getElementById('pTxt').textContent='0 / 0';
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow','0');
  clearMainSelections();
  document.getElementById('birthRes').className='birth-res';
  document.getElementById('birthRes').innerHTML='';
  document.getElementById('bYear').value='';
  document.getElementById('bMonth').value='';
  document.getElementById('bDay').value='';
  show('s0','replace');
}
document.getElementById('rst4').addEventListener('click',resetAll);
document.getElementById('rst5').addEventListener('click',resetAll);

function doShuffle(){
  clearReadingParam();
  var ov=document.getElementById('ovSh');ov.classList.add('ON');
  setTimeout(function(){
    try{
      reshuffle();
      S.selected=[];S.revealed=[];S.adding=false;
      document.getElementById('btnRev').className='btn-rev';
      document.getElementById('s4grid').innerHTML='';
      document.getElementById('readingCards').innerHTML='';
      document.getElementById('extraReadings').innerHTML='';
      document.getElementById('openExtraDetails').hidden=true;
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
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'track-card';
      el.dataset.i = idx;
      el.setAttribute('aria-pressed','false');
      el.setAttribute('aria-label','뒷면 카드 선택');

      const back = makeBackSVG();
      back.style.cssText = 'position:absolute;inset:0;pointer-events:none';

      el.innerHTML = '<span class="track-card-order" aria-hidden="true"></span>';
      el.appendChild(back);

      setTimeout(function() {
        el.classList.add('show');
      }, 15 + idx * 4);

      el.addEventListener('click', function() { pick(idx, el); });
      fragment.appendChild(el);
    });

    tr.appendChild(fragment);
    setTimeout(updArr, ANIM.ARR_UPD);
  } catch(e) {
    logger.error('카드 트랙 빌드 오류:', e);
    showToast(window.LOCALE&&window.LOCALE.ui.errorRender||'화면을 표시하는 중 문제가 생겼습니다.');
  }
}

(function initTrackEvents(){
  var tr=document.getElementById('ctrack');
  var arrTimer;
  tr.addEventListener('wheel',function(e){
    if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){
      e.preventDefault();
      tr.scrollBy({left:e.deltaY*2,behavior:'auto'});
    }
  },{passive:false});
  tr.addEventListener('scroll',function(){clearTimeout(arrTimer);arrTimer=setTimeout(updArr,80);},{passive:true});
})();

function pick(idx,el){
  el.scrollIntoView({behavior:REDUCED_MOTION?'auto':'smooth',block:'nearest',inline:'center'});
  if(S.adding){
    var p=S.selected.indexOf(idx);
    if(p>-1){S.selected.splice(p,1);el.classList.remove('is-selected');el.setAttribute('aria-pressed','false');}
    else{S.selected.push(idx);el.classList.add('is-selected');el.setAttribute('aria-pressed','true');}
    syncPickOrder();
    var n=S.selected.length;
    var pct=n===0?0:100;
    document.getElementById('pFill').style.width=pct+'%';
    document.getElementById('pTxt').textContent=n+window.LOCALE.ui.cardCountSelected;
    document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',String(pct));
    document.getElementById('btnRev').classList.toggle('ON',n>0);
    return;
  }
  var p=S.selected.indexOf(idx);
  if(p>-1){
    S.selected.splice(p,1);
    el.classList.remove('is-selected');
    el.setAttribute('aria-pressed','false');
  } else {
    if(S.selected.length>=S.count) return;
    S.selected.push(idx);
    el.classList.add('is-selected');
    el.setAttribute('aria-pressed','true');
  }
  syncPickOrder();
  updProg();
  document.getElementById('btnRev').classList.toggle('ON',S.selected.length===S.count);
}

function syncPickOrder(){
  var cards=document.querySelectorAll('.track-card');
  cards.forEach(function(card){
    card.querySelector('.track-card-order').textContent='';
    card.setAttribute('aria-label','뒷면 카드 선택');
  });
  S.selected.forEach(function(idx,order){
    var card=cards[idx];
    if(!card)return;
    card.querySelector('.track-card-order').textContent=(order+1)+'번째 카드';
    card.setAttribute('aria-label','스프레드 '+(order+1)+'번째 카드 선택 취소');
  });
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
  t.scrollBy({left:d*340,behavior:'auto'});updArr();
}
function updArr(){
  var t=document.getElementById('ctrack'),L=document.getElementById('arrL'),R=document.getElementById('arrR');
  if(!t)return;
  L.classList.toggle('H',t.scrollLeft<=3);
  R.classList.toggle('H',t.scrollLeft+t.clientWidth>=t.scrollWidth-3);
}

document.getElementById('btnRev').addEventListener('click',function(){
  if (document.getElementById('ovRv').classList.contains('ON')) return; // 연타 방지
  if(S.adding){
    if(!S.selected.length)return;
    var nc=S.selected.map(function(i){return S.shuffled[i];});
    nc.forEach(function(c){S.revealed.push(c);});
    S.adding=false;S.selected=[];
    renderResultCards();
    renderReadingOverview();
    ['readingDetails','extra'].forEach(function(id){var dialog=document.getElementById(id);if(dialog.open)dialog.close();});
    document.getElementById('hint').innerHTML=window.LOCALE.ui.hint;
    document.getElementById('btnRev').textContent='선택한 카드 펼치기';
    show('s4');refreshMore();
    document.getElementById('s4').classList.remove('is-shared');
    var ex=document.getElementById('resultExtras');
    setTimeout(function(){ex.scrollIntoView({behavior:REDUCED_MOTION?'auto':'smooth',block:'nearest'});},200);
  } else {
    if(S.selected.length<S.count)return;
    var ov=document.getElementById('ovRv');ov.classList.add('ON');
    setTimeout(function(){ov.classList.remove('ON');doReveal();},ANIM.REVEAL);
  }
});

function doReveal(){
  try{
    S.revealed=S.selected.map(function(i){return S.shuffled[i];});
    renderResultScreen(false);
  }catch(e){
    logger.error('카드 공개 오류:',e);
    showToast(window.LOCALE&&window.LOCALE.ui.errorReveal||'카드를 공개하는 중 오류가 발생했습니다.');
  }
}

function renderReadingOverview(){
  var el=document.getElementById('readingOverview');
  if(window.NORU.renderReadingSummary)window.NORU.renderReadingSummary();
  else el.textContent=window.NORU.readingOverview?window.NORU.readingOverview():'';
}

function renderResultScreen(shared){
  var sp=window.LOCALE.spreads[S.count];
  document.getElementById('s4topic').textContent='결과';
  document.getElementById('readingOverviewTopic').textContent=topicInfo().label;
  document.getElementById('s4title').textContent=sp.title;
  document.getElementById('s4desc').textContent=sp.desc;
  document.getElementById('resultInfo').open=false;
  ['readingDetails','extra'].forEach(function(id){var dialog=document.getElementById(id);if(dialog.open)dialog.close();});
  renderResultCards();
  renderReadingOverview();
  document.getElementById('s4').classList.toggle('is-shared',!!shared);
  show('s4',shared?'replace':undefined);
  refreshMore();
}
window.NORU.renderResultScreen=renderResultScreen;

function mkCard(card, lbl, idx, revealIndex) {
  try {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'result-card';
    el.setAttribute('aria-label',(lbl||cardName(card))+' 카드 해석 보기');

    const numPrefix = typeof idx === 'number' ? `${idx + 1}. ` : '';
    const directionClass = card.isRev ? 'result-badge result-direction is-reversed' : 'result-badge result-direction';
    const keywordBadges = (card.keywords || []).slice(0, 2).map(function(keyword) {
      return `<span class="result-badge">${keyword}</span>`;
    }).join('');

    el.innerHTML = `
      <span class="result-label">${numPrefix}${lbl || '카드 ' + (idx + 1)}</span>
      <span class="result-frame"></span>
      <span class="result-name">${cardName(card)}</span>
      <span class="result-badges"><span class="${directionClass}">${card.isRev ? '역방향' : '정방향'}</span><span class="result-keywords">${keywordBadges}</span></span>
    `;

    const frame = el.querySelector('.result-frame');
    frame.appendChild(makeImg(card, card.isRev));

    el.addEventListener('click', () => openModal(card));

    const order = Number.isInteger(revealIndex) ? revealIndex : (Number.isInteger(idx) ? idx : 0);
    const delay = REDUCED_MOTION ? 0 : Math.min(order, 8) * 145;
    setTimeout(() => {
      el.classList.add('show');
      setTimeout(() => frame.classList.add('flip-in'), REDUCED_MOTION?0:70);
    }, delay + (REDUCED_MOTION ? 0 : 90));

    return el;
  } catch(e) {
    logger.error('카드 생성 오류:', e);
    return document.createElement('span');
  }
}

function placeCard(grid,cards,sp,index,column,row,rowSpan){
  var card=mkCard(cards[index],sp.pos[index],index);
  card.style.gridColumn=column;
  card.style.gridRow=row+(rowSpan?' / span '+rowSpan:'');
  grid.appendChild(card);
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
      placeCard(g,cards,sp,0,2,2);
      placeCard(g,cards,sp,1,2,1);
      placeCard(g,cards,sp,2,2,3);
      placeCard(g,cards,sp,3,1,2);
      placeCard(g,cards,sp,4,3,2);
      con.appendChild(g);
      return;
    }
    if (L === 'seven') {
      var g = document.createElement('div'); g.className = 'result-grid-seven';
      var pos7 = [
        [0,2,1], [4,1,2], [5,3,2], [6,2,3],
        [2,1,4], [1,3,4], [3,2,5]
      ];
      pos7.forEach(function(p) {
        placeCard(g,cards,sp,p[0],p[1],p[2],2);
      });
      con.appendChild(g);
      return;
    }
    if (L === 'celtic') {
      var g = document.createElement('div'); g.className = 'result-grid-celtic';
      [[2,2,1],[9,5,1],[4,1,2],[0,2,2],[1,3,2],[5,4,2],[8,5,2],[3,2,3],[7,5,3],[6,5,4]].forEach(function(p){
        placeCard(g,cards,sp,p[0],p[1],p[2]);
      });
      con.appendChild(g);
      return;
    }
  } catch(e) {
    logger.error('결과 그리드 렌더링 오류:', e);
    showToast(window.LOCALE && window.LOCALE.ui.errorGrid || '결과를 표시하는 중 오류가 발생했습니다.');
  }
}

function renderResultCards(){
  var spread=window.LOCALE.spreads[S.count];
  var grid=document.getElementById('s4grid');
  var extra=S.revealed.slice(S.count);
  var extraWrap=document.getElementById('resultExtras');
  var extraGrid=document.getElementById('s4extraGrid');
  grid.innerHTML='';
  extraGrid.innerHTML='';
  buildGrid(S.revealed.slice(0,S.count),spread,grid);
  extra.forEach(function(card,index){extraGrid.appendChild(mkCard(card,'추가 '+(index+1),undefined,S.count+index));});
  extraWrap.hidden=!extra.length;
}

function getRemaining(){
  var used={};S.revealed.forEach(function(c){used[c.id]=true;});
  return deckCards().filter(function(c){return !used[c.id];});
}
function refreshMore(){
  document.getElementById('btnMore').classList.toggle('ON',getRemaining().length>0);
}
document.getElementById('btnMore').addEventListener('click',function(){
  var pool=getRemaining();if(!pool.length)return;
  reshuffle(pool);
  S.adding=true;
  S.selected=[];
  document.getElementById('pFill').style.width='0%';
  document.getElementById('pTxt').textContent='0장 선택';
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow','0');
  document.getElementById('btnRev').className='btn-rev';
  document.getElementById('btnRev').textContent='결과에 추가하기';
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
    res.innerHTML='<p style="color:var(--danger);text-align:center;font-size:.85rem;padding:12px">'+window.LOCALE.ui.birthError+'</p>';
    res.className='birth-res ON';return;
  }
  var ov=document.getElementById('ovRv');
  ov.classList.add('ON');
  setTimeout(function(){
    ov.classList.remove('ON');
    try{
      renderBirth(CORE.calculateBirthCard(yr,mo,dy,window.LOCALE.birthPairs));
    } catch(e){
      logger.error('탄생카드 계산 오류:',e);
      var res=document.getElementById('birthRes');
      res.innerHTML='<p style="color:var(--danger);text-align:center;padding:12px;font-size:.85rem">'+window.LOCALE.ui.birthCalcError+'</p>';
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
      H+=`<button class="result-card show" id="bpc${i}" type="button" aria-label="${c.name} 카드 해석 보기">
            <span class="result-frame flip-in" id="bpf${i}"></span>
            <span class="result-label">${window.LOCALE.ui.majorNumPrefix || 'No.'}${c.number}</span>
            <span class="result-name">${c.name}</span>
          </button>`;
    });
    H+='</div>';
    H+='<div class="birth-desc-box"><h4>'+window.LOCALE.ui.birthDescTitle+'</h4><p>'+bp.d+'</p></div>';
    res.innerHTML=H;res.className='birth-res ON';

    cards.forEach(function(c,i){
      var f=document.getElementById('bpf'+i);if(!f)return;
      f.appendChild(makeImg(c, false));
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
    res.innerHTML='<p style="color:var(--danger);text-align:center;padding:12px">표시 중 오류가 발생했습니다.</p>';
    res.className='birth-res ON';
  }
}

/* ── i18n Data Load Setup ── */
function initializeData(){
  if(!window.LOCALE) {
    logger.error("locale 로드 실패");
    showToast('카드 데이터를 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
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
        var kws=(window.LOCALE.minorKeywords||{})[key]||[s.e,s.n,num.label];
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
  initHistory();
}

function handleStartUrl(){
  var params=new URLSearchParams(window.location.search);
  var mode=params.get('mode');
  if(mode==='tarot') selMode('tarot');
  else if(mode==='birth') selMode('birth');
  else if(mode==='dictionary') document.getElementById('mD').click();
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
    navigator.serviceWorker.register('./sw.js')
      .catch(function(err){
        logger.error('SW 등록 실패:', err);
        showToast(window.LOCALE&&window.LOCALE.ui.errorOffline||'오프라인 저장 기능을 시작하지 못했습니다.');
      });
  });
}
