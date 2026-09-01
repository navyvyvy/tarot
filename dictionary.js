/* ── CARD DICTIONARY ── */
(function(){
  var query='';
  var filter='all';

  function suitName(card){
    if(card.type==='major')return '메이저 아르카나';
    return card.suitName||'';
  }

  function groupKey(card){return card.type==='major'?'major':card.suitCode;}

  function matches(card){
    var kind=card.type==='major'?'major':card.suitCode;
    if(filter==='minor' && card.type==='major')return false;
    if(filter!=='all' && filter!=='minor' && filter!==kind)return false;
    if(!query)return true;
    var text=[cardName(card),suitName(card)].concat(card.keywords||[]).join(' ').replace(/\s/g,'').toLowerCase();
    return text.includes(query);
  }

  function renderDictionary(){
    try{
      var cards=activeDeck().cards('all').filter(matches);
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
          var count=cards.filter(function(item){return groupKey(item)===key;}).length;
          group.className='dictionary-group-title';
          group.textContent=suitName(card)+' · '+count+'장';
          fragment.appendChild(group);
        }
        var button=document.createElement('button');
        var name=cardName(card);
        button.type='button';
        button.className='dictionary-card';
        button.setAttribute('aria-label',name+' 카드 해석 보기');
        button.innerHTML='<span class="dictionary-frame"></span><strong>'+name+'</strong>';
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
})();
