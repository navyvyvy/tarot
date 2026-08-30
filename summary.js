/* ── READING SUMMARY & SHARE IMAGE ── */
(function(){
  var dialog=document.getElementById('summaryDialog');
  var shareButton=document.getElementById('summaryShare');
  var currentSummary=null;

  function suitByCode(code){
    return (window.LOCALE.suits||[]).find(function(suit){return suit.code===code;});
  }

  function patternText(summary){
    var parts=[];
    if(S.deck!=='major'&&summary.dominantSuit){
      var suit=suitByCode(summary.dominantSuit);
      if(suit)parts.push(suit.n+'의 흐름이 두드러집니다. '+suit.guide);
    }
    return parts.join(' ');
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

  function entryText(entry){
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
    if(S.topic==='money'){
      return (card.isRev?card.rv:card.up)+' 금전 흐름에서는 '+moneyContext(card);
    }
    return card.isRev?card.rv:card.up;
  }

  function buildSummary(){
    var spread=window.LOCALE.spreads[S.count];
    var summary=window.NORU.core.summarizeReading(S.revealed,S.topic,spread.pos);
    var topic=window.LOCALE.topics[S.topic]||window.LOCALE.topics.general;
    summary.spread=spread;
    summary.topicInfo=topic;
    summary.pattern=patternText(summary);
    summary.headline=topic.summary;
    return summary;
  }

  function readingOverview(){
    var summary=buildSummary();
    var first=summary.entries[0],last=summary.entries[summary.entries.length-1];
    if(!first)return '';
    if(summary.entries.length===1){
      return '이번 리딩의 중심은 '+cardName(first.card)+' '+(first.card.isRev?'역방향':'정방향')+'입니다. '+entryText(first);
    }
    return '전체 흐름은 '+first.position+'의 '+cardName(first.card)+'에서 '+last.position+'의 '+cardName(last.card)+'로 이어집니다. '+entryText(last)+(summary.pattern?' '+summary.pattern:'');
  }

  window.NORU.readingOverview=readingOverview;

  function renderSummary(summary){
    document.getElementById('summaryMeta').textContent=summary.topicInfo.label+' · '+summary.spread.title;
    document.getElementById('summaryTitle').textContent=summary.topicInfo.resultTitle;
    var cards=summary.entries.map(function(entry){
      var name=cardName(entry.card);
      var keywords=(entry.card.keywords||[]).slice(0,3).join(', ');
      return '<article class="summary-card"><figure class="summary-card-art"><img src="'+cardImgUrl(entry.card)+'" alt="" class="'+(entry.card.isRev?'is-reversed':'')+'"></figure><div class="summary-card-copy"><div class="summary-card-meta"><strong>'+entry.position+'</strong><small>'+(entry.card.isRev?'역방향':'정방향')+'</small></div><h3>'+name+'</h3>'+(keywords?'<p class="summary-keywords">'+keywords+'</p>':'')+'<p>'+entryText(entry)+'</p></div></article>';
    }).join('');
    document.getElementById('summaryBody').innerHTML=
      '<section class="summary-overview"><p class="summary-lead">'+summary.headline+'</p>'+
      (summary.pattern?'<p>'+summary.pattern+'</p>':'')+'</section>'+
      '<section class="summary-cards" aria-label="카드별 결과">'+cards+'</section>'+
      '<p class="summary-disclaimer">이 요약은 선택을 대신하는 결론이 아니라, 현재 상황을 여러 각도에서 정리하기 위한 참고입니다.</p>';
  }

  function openSummary(){
    if(!S.revealed.length)return;
    currentSummary=buildSummary();
    renderSummary(currentSummary);
    dialog.showModal();
    document.getElementById('summaryClose').focus();
  }

  function closeSummary(){if(dialog.open)dialog.close();}

  function textLines(ctx,text,maxWidth,maxLines){
    var words=text.split(/\s+/),line='',lines=[];
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
    var canvas=document.createElement('canvas');
    canvas.width=1080;canvas.height=1;
    var ctx=canvas.getContext('2d');
    var cards=summary.entries;
    var columns=Math.min(5,cards.length);
    var cardWidth=cards.length===1?180:cards.length<=3?150:104;
    var cardHeight=Math.round(cardWidth*691/400);
    var gap=22;
    var rows=Math.ceil(cards.length/columns);
    var cardTop=260;
    var resultTop=cardTop+rows*(cardHeight+44)+58;
    var resultHeight=cards.reduce(function(total,entry,index){
      ctx.font='700 26px system-ui, sans-serif';
      var titleHeight=textLines(ctx,(index+1)+'. '+entry.position,860).length*36;
      ctx.font='23px system-ui, sans-serif';
      var bodyHeight=textLines(ctx,entryText(entry),860).length*34;
      return total+titleHeight+74+bodyHeight+22+(index<cards.length-1?28:0);
    },0);
    canvas.height=Math.max(1350,resultTop+resultHeight+150);
    ctx=canvas.getContext('2d');
    var gradient=ctx.createLinearGradient(0,0,1080,canvas.height);
    gradient.addColorStop(0,'#1b0f34');gradient.addColorStop(1,'#07050d');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,canvas.height);
    ctx.fillStyle='rgba(216,184,103,.2)';ctx.fillRect(70,56,4,canvas.height-112);
    ctx.strokeStyle='rgba(216,184,103,.22)';ctx.lineWidth=2;ctx.strokeRect(36,36,1008,canvas.height-72);

    ctx.fillStyle='#f1dda2';ctx.font='600 52px Georgia, serif';ctx.fillText('NORU',94,124);
    ctx.fillStyle='#c7bbac';ctx.font='26px system-ui, sans-serif';
    ctx.fillText(summary.topicInfo.label+' · '+summary.spread.title,94,174);
    ctx.fillStyle='#f7f0e3';ctx.font='700 40px system-ui, sans-serif';
    ctx.fillText(summary.topicInfo.resultTitle,94,224);

    var images=await Promise.all(cards.map(function(entry){return loadCardImage(entry.card);}));
    cards.forEach(function(entry,index){
      var row=Math.floor(index/columns),inRow=index%columns;
      var rowCount=Math.min(columns,cards.length-row*columns);
      var rowWidth=rowCount*cardWidth+(rowCount-1)*gap;
      var x=(1080-rowWidth)/2+inRow*(cardWidth+gap);
      var y=cardTop+row*(cardHeight+42);
      ctx.save();
      ctx.beginPath();ctx.roundRect(x,y,cardWidth,cardHeight,8);ctx.clip();
      if(images[index]){
        if(entry.card.isRev){ctx.translate(x+cardWidth/2,y+cardHeight/2);ctx.rotate(Math.PI);ctx.drawImage(images[index],-cardWidth/2,-cardHeight/2,cardWidth,cardHeight);}
        else ctx.drawImage(images[index],x,y,cardWidth,cardHeight);
      }else{
        ctx.fillStyle='#21133b';ctx.fillRect(x,y,cardWidth,cardHeight);
      }
      ctx.restore();
      ctx.strokeStyle='rgba(241,221,162,.55)';ctx.lineWidth=2;ctx.strokeRect(x,y,cardWidth,cardHeight);
      ctx.fillStyle=entry.card.isRev?'#f18b99':'#d8b867';ctx.font='600 19px system-ui, sans-serif';ctx.textAlign='center';ctx.fillText(String(index+1),x+cardWidth/2,y+cardHeight+28);ctx.textAlign='left';
    });

    ctx.fillStyle='#d8b867';ctx.font='700 24px system-ui, sans-serif';ctx.fillText('카드 결과',94,resultTop);
    var resultY=resultTop+50;
    cards.forEach(function(entry,index){
      ctx.fillStyle='#f7f0e3';ctx.font='700 26px system-ui, sans-serif';
      resultY=wrapText(ctx,(index+1)+'. '+entry.position,94,resultY,860,36,2);
      ctx.fillStyle=entry.card.isRev?'#f18b99':'#d8b867';ctx.font='600 21px system-ui, sans-serif';
      ctx.fillText(cardName(entry.card)+' · '+(entry.card.isRev?'역방향':'정방향'),94,resultY+4);
      ctx.fillStyle='#9f93ae';ctx.font='19px system-ui, sans-serif';
      ctx.fillText((entry.card.keywords||[]).slice(0,3).join(' · '),94,resultY+36);
      ctx.fillStyle='#c7bbac';ctx.font='23px system-ui, sans-serif';
      resultY=wrapText(ctx,entryText(entry),94,resultY+74,860,34)+22;
      if(index<cards.length-1){ctx.strokeStyle='rgba(216,184,103,.18)';ctx.beginPath();ctx.moveTo(94,resultY);ctx.lineTo(954,resultY);ctx.stroke();resultY+=28;}
    });
    ctx.fillStyle='#9a8faa';ctx.font='21px system-ui, sans-serif';
    wrapText(ctx,'오락과 자기 성찰을 위한 카드 해석입니다.',94,canvas.height-72,892,32,2);
    return new Promise(function(resolve,reject){canvas.toBlob(function(blob){blob?resolve(blob):reject(new Error('이미지를 만들지 못했습니다.'));},'image/png');});
  }

  async function shareSummary(){
    if(!currentSummary)return;
    var original=shareButton.textContent;
    shareButton.disabled=true;shareButton.textContent='공유 이미지 만드는 중...';
    try{
      var blob=await makeShareImage(currentSummary);
      var filename='noru-'+S.topic+'-'+Date.now()+'.png';
      var file=new File([blob],filename,{type:'image/png'});
      var shareText=currentSummary.topicInfo.label+' · '+currentSummary.spread.title+'\n'+currentSummary.entries.map(function(entry){return entry.position+': '+cardName(entry.card)+' '+(entry.card.isRev?'역방향':'정방향')+'\n'+entryText(entry);}).join('\n\n');
      if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
        await navigator.share({title:'NORU '+currentSummary.topicInfo.label+' 결과',text:shareText,files:[file]});
      }else{
        var link=document.createElement('a');
        link.href=URL.createObjectURL(blob);link.download=filename;link.click();
        setTimeout(function(){URL.revokeObjectURL(link.href);},1000);
        showToast('공유 이미지를 저장했습니다.');
      }
    }catch(error){
      if(error&&error.name!=='AbortError'){
        logger.error('결과 공유 오류:',error);
        showToast('공유 이미지를 만드는 중 문제가 생겼습니다.');
      }
    }finally{
      shareButton.disabled=false;shareButton.textContent=original;
    }
  }

  document.getElementById('btnSummary').addEventListener('click',openSummary);
  document.getElementById('summaryClose').addEventListener('click',closeSummary);
  shareButton.addEventListener('click',shareSummary);
  dialog.addEventListener('click',function(event){if(event.target===dialog)closeSummary();});
})();
