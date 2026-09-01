/* ── READING RESULT, SHARE URL & SHARE IMAGE ── */
(function(){
  var shareButton=document.getElementById('shareReading');
  var saveButton=document.getElementById('saveReadingImage');
  var shareDialog=document.getElementById('shareDialog');
  var confirmShareButton=document.getElementById('confirmShare');
  var readingDialog=document.getElementById('readingDetails');
  var readingTabs=document.getElementById('readingDetailTabs');
  var overviewSwitch=document.getElementById('overviewSwitch');
  var shareOverviewSwitch=document.getElementById('shareOverviewSwitch');
  var currentSummary=null;
  var overviewMode='main';

  function suitByCode(code){
    return (window.LOCALE.suits||[]).find(function(suit){return suit.code===code;});
  }

  function patternText(summary){
    if(S.pool==='major'||!summary.dominantSuit)return '';
    var suit=suitByCode(summary.dominantSuit);
    return suit?suit.n+' 카드가 가장 많이 나왔습니다. '+suit.guide:'';
  }

  function moneyContext(card){
    var guides={
      wands:'새로운 수입 가능성보다 실행 비용과 속도를 함께 계산해 보세요.',
      cups:'감정이나 관계가 소비 판단에 미치는 영향을 분리해서 살펴보세요.',
      swords:'계약, 조건, 숫자를 추측하지 말고 다시 확인해 보세요.',
      pentacles:'현재 가진 자원과 반복되는 수입·지출 흐름을 구체적으로 점검해 보세요.'
    };
    return guides[card.suitCode]||'기대하는 결과보다 현재 조정할 수 있는 선택과 자원을 먼저 살펴보세요.';
  }

  function cardMeaning(entry){
    var card=entry.card;
    var suit=suitByCode(card.suitCode);
    if(S.topic==='love'){
      return card.isRev
        ? card.rv+' '+(suit?suit.reverseLove:window.LOCALE.ui.modalMajorReverseLove)
        : card.up+' '+card.lv;
    }
    if(S.topic==='career'){
      return card.isRev
        ? card.rv+' '+(suit?suit.reverseCareer:window.LOCALE.ui.modalMajorReverseCareer)
        : card.up+' '+card.ca;
    }
    if(S.topic==='money')return (card.isRev?card.rv:card.up)+' 금전 흐름에서는 '+moneyContext(card);
    return card.isRev?card.rv:card.up;
  }

  function entryText(entry){
    var guide=(window.LOCALE.positionGuides||{})[entry.position];
    var context=guide?entry.position+' 자리의 '+cardName(entry.card)+' 카드는 '+guide+' ':'';
    return context+cardMeaning(entry);
  }

  function firstSentence(text){
    var match=String(text||'').match(/^[^.!?]+[.!?]?/);
    return match?match[0].trim():'';
  }

  function entryLabel(entry){
    return cardName(entry.card)+' '+(entry.card.isRev?'역방향':'정방향');
  }

  function meaningArc(entries){
    var anchors=entries.length<=3
      ?entries
      :[entries[0],entries[Math.floor(entries.length/2)],entries[entries.length-1]];
    return anchors.map(function(entry,index){
      var lead=index===0?'':index===anchors.length-1?'마지막으로 ':'이어서 ';
      return lead+entry.position+' 자리에서는 '+firstSentence(cardMeaning(entry));
    }).join(' ');
  }

  function legacyOverviewText(summary,withExtras){
    var first=summary.entries[0];
    var last=summary.entries[summary.entries.length-1];
    if(!first)return '';
    if(summary.entries.length===1){
      return '이번에 중심으로 나온 카드는 '+entryLabel(first)+'입니다. '+cardMeaning(first);
    }
    if(summary.entries.length===2){
      return '추가 카드까지 함께 보면 '+first.position+'의 '+cardName(first.card)+' 카드에 '+last.position+'의 '+cardName(last.card)+' 카드가 더해집니다. '+firstSentence(cardMeaning(first))+' '+firstSentence(cardMeaning(last))+(summary.pattern?' '+summary.pattern:'');
    }
    var middle=summary.entries[Math.floor(summary.entries.length/2)];
    var prefix=withExtras?'추가 카드까지 함께 보면 ':'';
    return prefix+'카드 흐름은 '+first.position+'의 '+cardName(first.card)+', '+middle.position+'의 '+cardName(middle.card)+', '+last.position+'의 '+cardName(last.card)+' 순서로 이어집니다. '+middle.position+'에서는 '+firstSentence(cardMeaning(middle))+' '+last.position+'에서는 '+firstSentence(cardMeaning(last))+(summary.pattern?' '+summary.pattern:'');
  }

  function overviewText(summary){
    var entries=summary.entries;
    if(!entries.length)return '';
    if(entries.length===1)return '이번에 중심으로 나온 카드는 '+entryLabel(entries[0])+'입니다. '+cardMeaning(entries[0]);
    var labels=entries.map(function(entry){return entry.position+'의 '+entryLabel(entry);});
    var flow='';
    if(entries.length===3){
      flow='과거에는 '+entryLabel(entries[0])+'이, 현재에는 '+entryLabel(entries[1])+'이, 미래에는 '+entryLabel(entries[2])+'이 놓였습니다.';
    }else if(entries.length===5){
      flow='현재의 '+entryLabel(entries[0])+'을 중심으로, 목표에는 '+entryLabel(entries[1])+', 근원에는 '+entryLabel(entries[2])+', 과거의 영향에는 '+entryLabel(entries[3])+', 예상 결과에는 '+entryLabel(entries[4])+'이 놓였습니다.';
    }else if(entries.length===7){
      flow='과거의 '+entryLabel(entries[0])+'에서 현재의 '+entryLabel(entries[1])+', 가까운 미래의 '+entryLabel(entries[2])+'로 이어집니다. 해결책은 '+entryLabel(entries[3])+', 주변 환경은 '+entryLabel(entries[4])+', 장애물은 '+entryLabel(entries[5])+', 예상 결과는 '+entryLabel(entries[6])+'입니다.';
    }else if(entries.length===10){
      flow='현재의 '+entryLabel(entries[0])+'에 '+entryLabel(entries[1])+'이 직접 맞물립니다. 목표는 '+entryLabel(entries[2])+', 기반은 '+entryLabel(entries[3])+', 지나가는 과거는 '+entryLabel(entries[4])+', 가까운 미래는 '+entryLabel(entries[5])+'입니다. 태도와 환경에는 '+entryLabel(entries[6])+'과 '+entryLabel(entries[7])+', 희망과 두려움에는 '+entryLabel(entries[8])+', 최종 결과에는 '+entryLabel(entries[9])+'이 놓였습니다.';
    }else{
      flow=labels.join(', ')+' 순서로 이어집니다.';
    }
    return flow+' '+meaningArc(entries)+(summary.pattern?' '+summary.pattern:'');
  }

  function extraOverviewText(main,summary){
    var extras=summary.extraEntries;
    var labels=extras.slice(0,4).map(entryLabel).join(', ');
    var remainder=extras.length>4?' 외 '+(extras.length-4)+'장':'';
    var pattern=summary.pattern&&summary.pattern!==main.pattern?' '+summary.pattern:'';
    var anchors=extras.length===1?extras:[extras[0],extras[extras.length-1]];
    return overviewText(main)+' 추가 카드로 '+labels+remainder+'이 더해졌습니다. '+meaningArc(anchors)+pattern;
  }

  function buildSummary(){
    var spread=window.LOCALE.spreads[S.count];
    var summary=window.NORU.core.summarizeReading(S.revealed,S.topic,spread.pos);
    var main=window.NORU.core.summarizeReading(S.revealed.slice(0,S.count),S.topic,spread.pos);
    summary.spread=spread;
    summary.topicInfo=window.LOCALE.topics[S.topic]||window.LOCALE.topics.general;
    summary.mainEntries=summary.entries.slice(0,S.count);
    summary.extraEntries=summary.entries.slice(S.count);
    main.pattern=patternText(main);
    summary.pattern=patternText(summary);
    var legacy=S.readingVersion===1;
    summary.overview=legacy?legacyOverviewText(main,false):overviewText(main);
    summary.extraOverview=summary.extraEntries.length
      ?(legacy?legacyOverviewText(summary,true):extraOverviewText(main,summary))
      :'';
    return summary;
  }

  function currentOverview(){
    return overviewMode==='all'&&currentSummary.extraOverview?currentSummary.extraOverview:currentSummary.overview;
  }

  function renderOverview(){
    document.getElementById('readingOverview').textContent=currentOverview();
    overviewSwitch.hidden=!currentSummary.extraEntries.length;
    overviewSwitch.querySelectorAll('[data-overview]').forEach(function(button){
      button.setAttribute('aria-pressed',String(button.dataset.overview===overviewMode));
    });
  }

  function selectReadingTab(name,focus){
    var active=name==='extra'&&!readingTabs.hidden?'extra':'main';
    readingTabs.querySelectorAll('[data-reading-tab]').forEach(function(tab){
      var selected=tab.dataset.readingTab===active;
      tab.classList.toggle('is-active',selected);
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden=!selected;
      document.getElementById(tab.getAttribute('aria-controls')).classList.toggle('is-active',selected);
      if(selected&&focus)tab.focus();
    });
  }

  function cardMarkup(entry,index){
    var name=cardName(entry.card);
    var position=entry.position.indexOf('추가 카드')===0?entry.position.replace('추가 카드','추가'):(index+1)+'. '+entry.position;
    var directionClass=entry.card.isRev?'result-badge result-direction is-reversed':'result-badge result-direction';
    var keywordBadges=(entry.card.keywords||[]).slice(0,2).map(function(keyword){return '<span class="result-badge">'+keyword+'</span>';}).join('');
    return '<article class="reading-card"><div class="reading-card-summary"><figure class="reading-card-art"><img src="'+cardImgUrl(entry.card)+'" alt="'+name+'" width="400" height="691" loading="lazy" class="'+(entry.card.isRev?'is-reversed':'')+'"><figcaption class="result-name">'+name+'</figcaption></figure></div><div class="reading-card-copy"><strong class="result-label">'+position+'</strong><span class="result-badges"><span class="'+directionClass+'">'+(entry.card.isRev?'역방향':'정방향')+'</span><span class="result-keywords">'+keywordBadges+'</span></span><p>'+entryText(entry)+'</p></div></article>';
  }

  function renderReadingSummary(){
    if(!S.revealed.length)return;
    var previousExtraCount=currentSummary?currentSummary.extraEntries.length:0;
    currentSummary=buildSummary();
    if(!currentSummary.extraEntries.length)overviewMode='main';
    else if(currentSummary.extraEntries.length>previousExtraCount)overviewMode='all';
    renderOverview();
    var cards=document.getElementById('readingCards');
    cards.className='reading-cards'+(currentSummary.mainEntries.length>3?' is-many':'');
    cards.innerHTML=currentSummary.mainEntries.map(cardMarkup).join('');
    var extraCards=document.getElementById('extraReadings');
    extraCards.className='reading-cards'+(currentSummary.extraEntries.length>3?' is-many':'');
    extraCards.innerHTML=currentSummary.extraEntries.map(cardMarkup).join('');
    document.getElementById('readingDetailsMeta').textContent=currentSummary.topicInfo.label+' / '+currentSummary.spread.title;
    readingTabs.hidden=!currentSummary.extraEntries.length;
    if(!currentSummary.extraEntries.length||!previousExtraCount)selectReadingTab('main');
  }

  function readingOverview(){
    if(!S.revealed.length)return '';
    var summary=buildSummary();
    return summary.extraOverview||summary.overview;
  }
  window.NORU.readingOverview=readingOverview;
  window.NORU.renderReadingSummary=renderReadingSummary;

  function createShareUrl(){
    var token=window.NORU.core.encodeReading({topic:S.topic,deck:S.pool,count:S.count,cards:S.revealed});
    if(!token)return '';
    var canonical=document.querySelector('link[rel="canonical"]');
    var url=new URL(canonical?canonical.href:location.href);
    url.search='';
    url.hash='';
    url.searchParams.set('reading',token);
    if(currentSummary&&currentSummary.extraEntries.length)url.searchParams.set('view',overviewMode);
    return url.toString();
  }
  window.NORU.createShareUrl=createShareUrl;

  function copyText(value){
    if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(value);
    var input=document.createElement('textarea');
    input.value=value;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';
    document.body.appendChild(input);input.select();document.execCommand('copy');input.remove();
    return Promise.resolve();
  }

  function previewCardMarkup(entry){
    var name=cardName(entry.card);
    return '<figure class="share-preview-card"><div><img src="'+cardImgUrl(entry.card)+'" alt="'+name+'" width="400" height="691" loading="lazy" class="'+(entry.card.isRev?'is-reversed':'')+'"></div><figcaption><strong>'+entry.position+'</strong><span>'+name+' '+(entry.card.isRev?'역방향':'정방향')+'</span></figcaption></figure>';
  }

  function renderSharePreview(){
    if(!currentSummary)renderReadingSummary();
    document.getElementById('shareDialogMeta').textContent=currentSummary.topicInfo.label;
    document.getElementById('shareDialogTitle').textContent=currentSummary.spread.title;
    document.getElementById('sharePreviewCards').innerHTML=currentSummary.mainEntries.map(previewCardMarkup).join('');
    document.getElementById('sharePreviewOverview').textContent=currentOverview();
    var extra=document.getElementById('sharePreviewExtra');
    document.getElementById('sharePreviewExtraCards').innerHTML=currentSummary.extraEntries.map(previewCardMarkup).join('');
    extra.style.display=currentSummary.extraEntries.length&&overviewMode==='all'?'block':'none';
    shareOverviewSwitch.hidden=!currentSummary.extraEntries.length;
    shareOverviewSwitch.querySelectorAll('[data-share-overview]').forEach(function(button){
      button.setAttribute('aria-pressed',String(button.dataset.shareOverview===overviewMode));
    });
  }

  function openShareDialog(){
    renderSharePreview();
    shareDialog.showModal();
    confirmShareButton.focus();
  }

  function openSharedResultPage(){
    renderSharePreview();
    document.body.classList.add('shared-result-page');
    shareDialog.classList.add('is-shared-page');
    document.getElementById('shareDialogBrand').hidden=false;
    document.getElementById('shareDialogClose').hidden=true;
    document.getElementById('startNewReading').hidden=false;
    confirmShareButton.hidden=true;
    shareDialog.show();
    document.getElementById('shareDialogTitle').focus();
  }

  function closeShareDialog(){if(shareDialog.open)shareDialog.close();}

  function openReadingDialog(dialog){dialog.showModal();dialog.querySelector('.reading-dialog-close').focus();}
  function closeReadingDialog(dialog){if(dialog.open)dialog.close();}

  async function shareReading(){
    var url=createShareUrl();
    if(!url)return;
    var original=confirmShareButton.textContent;
    confirmShareButton.disabled=true;confirmShareButton.textContent='공유 준비 중...';
    try{
      var text=currentSummary.topicInfo.label+' '+currentSummary.topicInfo.resultTitle+'\n'+currentOverview();
      if(navigator.share)await navigator.share({title:'NORU '+currentSummary.topicInfo.resultTitle,text:text,url:url});
      else{await copyText(url);showToast('결과 링크를 복사했습니다.');}
      closeShareDialog();
    }catch(error){
      if(error&&error.name!=='AbortError'){
        logger.error('결과 링크 공유 오류:',error);
        showToast('결과 링크를 공유하지 못했습니다.');
      }
    }finally{
      confirmShareButton.disabled=false;confirmShareButton.textContent=original;
    }
  }

  function textLines(ctx,text,maxWidth,maxLines){
    var words=String(text||'').split(/\s+/),line='',lines=[];
    words.forEach(function(word){
      var next=line?line+' '+word:word;
      if(line&&ctx.measureText(next).width>maxWidth){lines.push(line);line=word;}
      else line=next;
    });
    if(line)lines.push(line);
    return lines.slice(0,maxLines||lines.length);
  }

  function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines){
    var lines=textLines(ctx,text,maxWidth,maxLines);
    lines.forEach(function(value,index){ctx.fillText(value,x,y+index*lineHeight);});
    return y+lines.length*lineHeight;
  }

  function loadCardImage(card){
    return new Promise(function(resolve){
      var image=new Image();
      image.onload=function(){resolve(image);};
      image.onerror=function(){resolve(null);};
      image.src=cardImgUrl(card);
    });
  }

  async function makeShareImage(summary){
    if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    var canvas=document.createElement('canvas');canvas.width=1080;canvas.height=10;
    var ctx=canvas.getContext('2d');
    ctx.font='25px system-ui, sans-serif';
    var overviewLines=textLines(ctx,summary.overview,860);
    var gap=24;
    var columns=Math.min(5,summary.mainEntries.length);
    var cardWidth=summary.mainEntries.length===1?224:summary.mainEntries.length<=3?176:116;
    var cardHeight=Math.round(cardWidth*691/400);
    var rows=Math.ceil(summary.mainEntries.length/columns);
    var cardTop=238;
    var mainBottom=cardTop+rows*(cardHeight+58);
    var extraColumns=Math.max(1,Math.min(summary.extraEntries.length,Math.floor((908+gap)/(cardWidth+gap))));
    var extraRows=summary.extraEntries.length?Math.ceil(summary.extraEntries.length/extraColumns):0;
    var extraTop=summary.extraEntries.length?mainBottom+74:mainBottom;
    var extraBottom=summary.extraEntries.length?extraTop+extraRows*(cardHeight+58):mainBottom;
    var overviewBoxTop=extraBottom+42;
    var overviewHeight=overviewLines.length*36+104;
    canvas.height=Math.max(1350,overviewBoxTop+overviewHeight+86);
    ctx=canvas.getContext('2d');
    var gradient=ctx.createLinearGradient(0,0,1080,canvas.height);
    gradient.addColorStop(0,'#1b0f34');gradient.addColorStop(.48,'#10091f');gradient.addColorStop(1,'#07050d');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,canvas.height);
    ctx.strokeStyle='rgba(216,184,103,.3)';ctx.lineWidth=2;ctx.strokeRect(42,42,996,canvas.height-84);

    ctx.fillStyle='#f1dda2';ctx.font='600 48px Georgia, serif';ctx.fillText('NORU',86,124);
    ctx.fillStyle='#d8b867';ctx.font='700 21px system-ui, sans-serif';ctx.fillText(summary.topicInfo.label,86,170);
    ctx.fillStyle='#f7f0e3';ctx.font='500 34px Georgia, serif';ctx.fillText(summary.spread.title,86,208);
    var images=await Promise.all(summary.entries.map(function(entry){return loadCardImage(entry.card);}));

    function drawCard(entry,image,x,y){
      ctx.save();ctx.beginPath();ctx.roundRect(x,y,cardWidth,cardHeight,8);ctx.clip();
      if(image){
        if(entry.card.isRev){ctx.translate(x+cardWidth/2,y+cardHeight/2);ctx.rotate(Math.PI);ctx.drawImage(image,-cardWidth/2,-cardHeight/2,cardWidth,cardHeight);}
        else ctx.drawImage(image,x,y,cardWidth,cardHeight);
      }else{ctx.fillStyle='#21133b';ctx.fillRect(x,y,cardWidth,cardHeight);}
      ctx.restore();
      ctx.strokeStyle='rgba(241,221,162,.62)';ctx.lineWidth=2;ctx.strokeRect(x,y,cardWidth,cardHeight);
      ctx.textAlign='center';ctx.fillStyle=entry.card.isRev?'#f18b99':'#d8b867';ctx.font='700 18px system-ui, sans-serif';ctx.fillText(entry.position+(entry.card.isRev?' · 역':''),x+cardWidth/2,y+cardHeight+27);
      ctx.fillStyle='#f7f0e3';ctx.font='500 18px Georgia, serif';ctx.fillText(cardName(entry.card),x+cardWidth/2,y+cardHeight+51);ctx.textAlign='left';
    }

    summary.mainEntries.forEach(function(entry,index){
      var row=Math.floor(index/columns),inRow=index%columns;
      var rowCount=Math.min(columns,summary.mainEntries.length-row*columns);
      var rowWidth=rowCount*cardWidth+(rowCount-1)*gap;
      drawCard(entry,images[index],(1080-rowWidth)/2+inRow*(cardWidth+gap),cardTop+row*(cardHeight+58));
    });

    if(summary.extraEntries.length){
      ctx.fillStyle='#d8b867';ctx.font='700 21px system-ui, sans-serif';ctx.fillText('추가 카드',86,extraTop-30);
      summary.extraEntries.forEach(function(entry,index){
        var row=Math.floor(index/extraColumns),inRow=index%extraColumns;
        var rowCount=Math.min(extraColumns,summary.extraEntries.length-row*extraColumns);
        var rowWidth=rowCount*cardWidth+(rowCount-1)*gap;
        drawCard(entry,images[summary.mainEntries.length+index],(1080-rowWidth)/2+inRow*(cardWidth+gap),extraTop+row*(cardHeight+58));
      });
    }

    ctx.fillStyle='rgba(216,184,103,.09)';ctx.beginPath();ctx.roundRect(82,overviewBoxTop,916,overviewHeight,16);ctx.fill();
    ctx.strokeStyle='rgba(216,184,103,.34)';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#f1dda2';ctx.font='500 32px Georgia, serif';ctx.fillText('종합 평가',112,overviewBoxTop+46);
    ctx.fillStyle='#f7f0e3';ctx.font='25px system-ui, sans-serif';wrapText(ctx,summary.overview,112,overviewBoxTop+88,856,36);
    return new Promise(function(resolve,reject){canvas.toBlob(function(blob){blob?resolve(blob):reject(new Error('이미지를 만들지 못했습니다.'));},'image/png');});
  }

  async function saveReadingImage(){
    if(!currentSummary)renderReadingSummary();
    var original=saveButton.textContent;
    saveButton.disabled=true;saveButton.textContent='이미지 만드는 중...';
    try{
      var includeExtras=overviewMode==='all';
      var blob=await makeShareImage(Object.assign({},currentSummary,{overview:currentOverview(),entries:includeExtras?currentSummary.entries:currentSummary.mainEntries,extraEntries:includeExtras?currentSummary.extraEntries:[]}));
      var link=document.createElement('a');
      link.href=URL.createObjectURL(blob);link.download='noru-'+S.topic+'-'+Date.now()+'.png';link.click();
      setTimeout(function(){URL.revokeObjectURL(link.href);},1000);
      showToast('결과 이미지를 저장했습니다.');
    }catch(error){
      logger.error('결과 이미지 저장 오류:',error);
      showToast('결과 이미지를 만들지 못했습니다.');
    }finally{
      saveButton.disabled=false;saveButton.textContent=original;
    }
  }

  function restoreSharedReading(){
    var params=new URL(location.href).searchParams;
    var token=params.get('reading');
    if(!token)return;
    var shared=window.NORU.core.decodeReading(token);
    if(!shared){showToast('공유 결과 링크가 올바르지 않습니다.');return;}
    var byId={};
    window.LOCALE.allCards.forEach(function(card){byId[card.id]=card;});
    var revealed=shared.cards.map(function(value){
      return byId[value.id]?Object.assign({},byId[value.id],{isRev:value.isRev}):null;
    });
    if(revealed.some(function(card){return !card;})){showToast('공유 결과를 불러오지 못했습니다.');return;}
    Object.assign(S,{mode:'tarot',topic:shared.topic,deckId:'rws',pool:shared.deck,count:shared.count,shuffled:[],selected:[],revealed:revealed,adding:false,readingVersion:shared.version});
    var poolInput=document.querySelector('.pool-input[value="'+S.pool+'"]');
    var countInput=document.querySelector('.count-input[value="'+S.count+'"]');
    if(poolInput)poolInput.checked=true;
    if(countInput)countInput.checked=true;
    updateTopicButtons();renderSpInfo();
    renderReadingSummary();
    if(params.get('view')==='main'){
      overviewMode='main';
      renderOverview();
    }
    openSharedResultPage();
    document.title='NORU '+currentSummary.topicInfo.resultTitle;
  }

  shareButton.addEventListener('click',openShareDialog);
  confirmShareButton.addEventListener('click',shareReading);
  document.addEventListener('error',function(event){
    var image=event.target;
    if(!(image instanceof HTMLImageElement)||!image.closest('.reading-dialog,.share-dialog'))return;
    var placeholder=document.createElement('span');
    placeholder.className='card-placeholder';
    placeholder.textContent=image.alt||'카드 이미지';
    image.replaceWith(placeholder);
  },true);
  document.getElementById('shareDialogClose').addEventListener('click',closeShareDialog);
  shareDialog.addEventListener('click',function(event){if(event.target===shareDialog)closeShareDialog();});
  document.getElementById('openReadingDetails').addEventListener('click',function(){openReadingDialog(readingDialog);});
  readingTabs.querySelectorAll('[data-reading-tab]').forEach(function(tab,index,tabs){
    tab.addEventListener('click',function(){selectReadingTab(tab.dataset.readingTab);});
    tab.addEventListener('keydown',function(event){
      if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
      event.preventDefault();
      selectReadingTab(tabs[(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length].dataset.readingTab,true);
    });
  });
  overviewSwitch.querySelectorAll('[data-overview]').forEach(function(button){
    button.addEventListener('click',function(){overviewMode=button.dataset.overview;renderOverview();});
  });
  shareOverviewSwitch.querySelectorAll('[data-share-overview]').forEach(function(button){
    button.addEventListener('click',function(){overviewMode=button.dataset.shareOverview;renderOverview();renderSharePreview();});
  });
  document.getElementById('readingDetailsClose').addEventListener('click',function(){closeReadingDialog(readingDialog);});
  readingDialog.addEventListener('click',function(event){if(event.target===readingDialog)closeReadingDialog(readingDialog);});
  saveButton.addEventListener('click',saveReadingImage);
  window.addEventListener('DOMContentLoaded',restoreSharedReading);
})();
