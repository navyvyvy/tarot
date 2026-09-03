/* ── CARD DICTIONARY ── */
(function(){
  var query='';
  var filter='all';

  function suitName(card){
    if(card.type==='major')return '메이저 아르카나';
    return card.suitName||'';
  }

  function cardOrder(card){
    var number=Number(card.number);
    return Number.isFinite(number)?number:card.id;
  }

  function groupKey(card){
    if(activeDeck().id==='etteilla' && card.type==='major' && cardOrder(card)===78)return 'major-last';
    return card.type==='major'?'major':card.suitCode;
  }

  function groupTitle(card,key,cards){
    if(key==='major-last')return '마지막 트럼프 · 78번';
    if(activeDeck().id==='etteilla' && key==='major')return '트럼프 · 1-21번';
    var count=cards.filter(function(item){return groupKey(item)===key;}).length;
    return suitName(card)+' · '+count+'장';
  }

  function matches(card){
    var kind=card.type==='major'?'major':card.suitCode;
    if(filter==='minor' && card.type==='major')return false;
    if(filter!=='all' && filter!=='minor' && filter!==kind)return false;
    if(!query)return true;
    var text=[card.number,cardName(card),suitName(card)].concat(card.keywords||[],card.reversedKeywords||[]).join(' ').replace(/\s/g,'').toLowerCase();
    return text.includes(query);
  }

  function renderDictionary(){
    try{
      var cards=activeDeck().cards('all').filter(matches).sort(function(a,b){return cardOrder(a)-cardOrder(b);});
      var grid=document.getElementById('dictionaryGrid');
      var empty=document.getElementById('dictionaryEmpty');
      var fragment=document.createDocumentFragment();
      var lastGroup='';
      grid.innerHTML='';

      cards.forEach(function(card){
        var key=groupKey(card);
        if(key!==lastGroup){
          lastGroup=key;
          var group=document.createElement('h3');
          group.className='dictionary-group-title';
          group.textContent=groupTitle(card,key,cards);
          fragment.appendChild(group);
        }
        var button=document.createElement('button');
        var name=cardName(card);
        var label=card.type==='major'?card.number+' · '+name:name;
        button.type='button';
        button.className='dictionary-card';
        button.setAttribute('aria-label',label+' 카드 해석 보기');
        button.innerHTML='<span class="dictionary-frame"></span><strong>'+label+'</strong>';
        button.querySelector('.dictionary-frame').appendChild(makeImg(card,false));
        button.addEventListener('click',function(){openModal(card);});
        fragment.appendChild(button);
      });

      grid.appendChild(fragment);
      document.getElementById('dictionaryCount').textContent='총 '+cards.length+'장';
      empty.hidden=cards.length!==0;
    }catch(e){
      logger.error('카드 사전 렌더링 오류:',e);
      showToast(window.LOCALE&&window.LOCALE.ui.errorRender||'화면을 표시하는 중 문제가 생겼습니다.');
    }
  }

  document.getElementById('mD').addEventListener('click',function(){
    S.mode='dictionary';
    document.getElementById('mB').classList.remove('is-selected');
    document.getElementById('mD').classList.add('is-selected');
    renderDictionary();
    show('s6');
  });
  document.getElementById('bk6').addEventListener('click',resetAll);
  document.getElementById('dictionarySearch').addEventListener('input',function(){
    query=this.value.trim().replace(/\s/g,'').toLowerCase();
    renderDictionary();
  });
  document.getElementById('dictionaryFilter').addEventListener('change',function(){
    filter=this.value;
    renderDictionary();
  });
  document.addEventListener('noru:deckchange',function(){
    if(document.getElementById('s6').classList.contains('ON'))renderDictionary();
  });
})();
