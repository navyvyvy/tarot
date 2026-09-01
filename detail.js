/* ── CARD DETAIL ── */
function openModal(card) {
  try {
    const full = activeDeck().card(card.id) || card;
    const box = document.getElementById('mImgBox');

    box.innerHTML = `
      <button class="modal-img-wrapper${card.isRev ? ' is-reversed-image' : ''}" type="button" aria-label="카드 이미지 확대"></button>
    `;
    const wrap = box.querySelector('.modal-img-wrapper');
    wrap.appendChild(makeImg(card, false));
    wrap.addEventListener('click', (e) => { e.stopPropagation(); openImgZoom(card); });

    const L = window.LOCALE.ui;
    const symbolism = full.symbolism;
    const readingKey = full.readingKey;
    const reflection = full.reflection;
    const reverseLove = full.reverseLove || L.modalMajorReverseLove;
    const reverseCareer = full.reverseCareer || L.modalMajorReverseCareer;
    document.getElementById('mArc').textContent = (full.type === 'major' || !full.suitCode)
      ? `${L.modalArcMajor} · ${L.majorNumPrefix || 'No.'}${full.number}`
      : `${L.modalArcMinor} · ${full.suitName || ''}`;
    document.getElementById('mName').textContent = cardName(full);
    document.getElementById('mRevTag').innerHTML = card.isRev ? `<span class="m-rev">${L.modalReversed}</span>` : '';
    document.getElementById('mKws').innerHTML = full.keywords.map(k => `<span class="modal-kw">${k}</span>`).join('');

    const reverseNote = (context) => card.isRev ? `<div class="modal-context-note">
      <strong>${L.modalReversedContext}</strong>
      <span class="modal-reverse-label">${L.modalCardReverseMeaning}</span>
      <p>${full.rv}</p><p>${context}</p>
    </div>` : '';
    const body = document.getElementById('mBody');
    body.innerHTML = `
      <div class="modal-tabs" role="tablist" aria-label="${L.modalTabsLabel}" data-active="0">
        <button class="modal-tab is-active" id="mTabSummary" type="button" role="tab" aria-selected="true" aria-controls="mPanelSummary" data-index="0">${L.modalTabSummary}</button>
        <button class="modal-tab" id="mTabDirections" type="button" role="tab" aria-selected="false" aria-controls="mPanelDirections" data-index="1" tabindex="-1">${L.modalTabDirections}</button>
        <button class="modal-tab" id="mTabContexts" type="button" role="tab" aria-selected="false" aria-controls="mPanelContexts" data-index="2" tabindex="-1">${L.modalTabContexts}</button>
      </div>
      <div class="modal-tab-stage">
        <section class="modal-tab-panel is-active" id="mPanelSummary" role="tabpanel" aria-labelledby="mTabSummary">
          ${symbolism ? `<section class="modal-read-section">
            <h3 class="modal-section-title">${L.modalSectionSymbolism}</h3>
            <p>${symbolism}</p>
          </section>` : ''}
          <section class="modal-read-section">
            <h3 class="modal-section-title">${L.modalSectionReadingKey}</h3>
            <p>${readingKey}</p>
          </section>
          <section class="modal-read-section">
            <h3 class="modal-section-title">${L.modalSectionReflection}</h3>
            <p class="modal-reflection">${reflection}</p>
          </section>
        </section>
        <section class="modal-tab-panel" id="mPanelDirections" role="tabpanel" aria-labelledby="mTabDirections" hidden>
          <div class="modal-direction-list">
            <section class="modal-direction${card.isRev ? '' : ' is-current'}">
              <div class="modal-direction-head"><strong>${L.modalSectionUpright}</strong>${card.isRev ? '' : `<span>${L.modalCurrentDirection}</span>`}</div>
              <p>${full.up}</p>
            </section>
            <section class="modal-direction${card.isRev ? ' is-current is-reversed' : ''}">
              <div class="modal-direction-head"><strong>${L.modalSectionReversed}</strong>${card.isRev ? `<span>${L.modalCurrentDirection}</span>` : ''}</div>
              <p>${full.rv}</p>
            </section>
          </div>
        </section>
        <section class="modal-tab-panel" id="mPanelContexts" role="tabpanel" aria-labelledby="mTabContexts" hidden>
          <section class="modal-context-card">
            <h3 class="modal-section-title">${L.modalSectionLove}</h3>
            ${card.isRev ? '' : `<p>${full.lv || ''}</p>`}
            ${reverseNote(reverseLove)}
          </section>
          <section class="modal-context-card">
            <h3 class="modal-section-title">${L.modalSectionCareer}</h3>
            ${card.isRev ? '' : `<p>${full.ca || ''}</p>`}
            ${reverseNote(reverseCareer)}
          </section>
        </section>
      </div>
    `;

    const tabs = Array.from(body.querySelectorAll('.modal-tab'));
    const panels = Array.from(body.querySelectorAll('.modal-tab-panel'));
    const tabList = body.querySelector('.modal-tabs');
    function selectTab(index, focus) {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].classList.toggle('is-active', active);
        panels[i].hidden = !active;
      });
      tabList.dataset.active = String(index);
      if(focus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(index, false));
      tab.addEventListener('keydown', (e) => {
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
        e.preventDefault();
        const next = e.key === 'Home' ? 0
          : e.key === 'End' ? tabs.length - 1
          : (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        selectTab(next, true);
      });
    });

    document.getElementById('mbg').showModal();
  } catch(e) {
    logger.error('모달 오류:', e);
    showToast(window.LOCALE&&window.LOCALE.ui.errorDetail||'카드 상세 내용을 여는 중 문제가 생겼습니다.');
  }
}

document.getElementById('mbg').addEventListener('click',function(e){if(e.target===this)closeModal();});
document.getElementById('mbg').addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();closeModal();}});
document.getElementById('mClose').addEventListener('click',closeModal);
function closeModal(){
  var dialog=document.getElementById('mbg');
  if(dialog.open)dialog.close();
}

function openImgZoom(card){
  var zw=document.getElementById('imgZoomWrap');
  zw.innerHTML='';
  var img=makeImg(card, card.isRev);
  img.style.cssText='width:100%;height:auto;border-radius:12px;display:block;max-height:88vh;object-fit:contain;'
    +(card.isRev?'transform:rotate(180deg)':'');
  zw.appendChild(img);
  document.getElementById('imgZoom').showModal();
}
function closeImgZoom(){
  var dialog=document.getElementById('imgZoom');
  if(dialog.open)dialog.close();
}
document.getElementById('imgZoom').addEventListener('click',function(e){if(e.target===this)closeImgZoom();});
document.getElementById('imgZoom').addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();closeImgZoom();}});
document.getElementById('imgZoomClose').addEventListener('click',closeImgZoom);
