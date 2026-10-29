/* Public display metadata only. This page never requests model/source files. */
(() => {
  'use strict';
  const normalize = value => String(value ?? '').normalize('NFKC').toLocaleLowerCase('ja').trim();
  const searchText = model => normalize([model.id, model.name, model.nameEn, model.category, model.categoryEn, model.description, ...(model.tags || []), ...(model.formats || [])].join(' '));
  const matches = (model, query, category = '') => (!category || model.category === category) && normalize(query).split(/\s+/u).filter(Boolean).every(term => searchText(model).includes(term));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  // Keep pure search helpers testable without a browser or a build tool.
  if (typeof module !== 'undefined' && module.exports) module.exports = {normalize, searchText, matches};
  if (typeof document === 'undefined') return;

  const input = document.getElementById('model-search');
  const categoriesEl = document.getElementById('model-categories');
  const grid = document.getElementById('model-grid');
  const count = document.getElementById('model-result-count');
  const reset = document.getElementById('model-reset');
  const empty = document.getElementById('model-empty');
  const error = document.getElementById('model-error');
  let models = [], categories = [], state = {q:'', category:''};
  let searchHistoryStarted = false;
  let composing = false;

  function readUrl() {
    const params = new URLSearchParams(location.search);
    return {q:params.get('q') || '', category:categories.includes(params.get('category')) ? params.get('category') : ''};
  }
  function writeUrl(mode = 'pushState') {
    const url = new URL(location.href);
    state.q ? url.searchParams.set('q',state.q) : url.searchParams.delete('q');
    state.category ? url.searchParams.set('category',state.category) : url.searchParams.delete('category');
    if (url.href !== location.href) history[mode]({},'',url);
  }
  function card(model) {
    const tags = (model.tags || []).map(tag => `<li>${esc(tag)}</li>`).join('');
    const notes = (model.notes || []).map(note => `<li>${esc(note)}</li>`).join('');
    return `<article class="model-card" id="${esc(model.id)}" data-model-id="${esc(model.id)}">
      <figure class="model-preview"><img src="${esc(model.image)}" alt="${esc(model.name)}の実モデルレンダー" width="640" height="480" loading="lazy" decoding="async"></figure>
      <div class="model-body"><div class="model-meta"><a class="model-id" href="#${esc(model.id)}" aria-label="${esc(model.id)} ${esc(model.name)}へのリンク">${esc(model.id)}</a><span class="model-category">${esc(model.category)}</span></div>
      <h3>${esc(model.name)}</h3>${model.nameEn ? `<p class="model-name-en" lang="en">${esc(model.nameEn)}</p>` : ''}
      <p class="model-description">${esc(model.description)}</p><ul class="model-tags" aria-label="検索タグ">${tags}</ul>
      <p class="model-formats">保存形式<strong>${esc((model.formats || []).join(' / '))}</strong></p>
      ${notes ? `<ul class="model-notes" aria-label="注意事項">${notes}</ul>` : ''}</div>
    </article>`;
  }
  function render() {
    const visible = models.filter(model => matches(model,state.q,state.category));
    grid.innerHTML = visible.map(card).join('');
    grid.setAttribute('aria-busy','false');
    empty.hidden = visible.length !== 0;
    const conditions = [state.category, state.q ? `「${state.q}」` : ''].filter(Boolean);
    count.textContent = `${visible.length} / ${models.length} 件${conditions.length ? ' · ' + conditions.join(' / ') : ' · すべて表示'}`;
    categoriesEl.querySelectorAll('button').forEach(button => {
      const selected = button.dataset.category === state.category;
      button.setAttribute('aria-pressed',String(selected));
      const total = models.filter(model => matches(model,state.q,button.dataset.category)).length;
      button.querySelector('span').textContent = total;
    });
  }
  function change(next, mode = 'pushState') {
    state = next;
    if (input.value !== state.q) input.value = state.q;
    writeUrl(mode);
    render();
  }
  function resetAll() {
    searchHistoryStarted = false;
    change({q:'',category:''});
    input.focus();
  }
  function searchInput() {
    change({...state,q:input.value},searchHistoryStarted ? 'replaceState' : 'pushState');
    searchHistoryStarted = true;
  }
  // Leave in-progress Japanese IME composition untouched.
  input.addEventListener('compositionstart',() => { composing = true; });
  input.addEventListener('compositionend',() => { composing = false; searchInput(); });
  input.addEventListener('input',event => { if (!composing && !event.isComposing) searchInput(); });
  input.addEventListener('blur',() => { searchHistoryStarted = false; });
  document.getElementById('model-search-form').addEventListener('submit',event => {event.preventDefault(); searchHistoryStarted = false;});
  categoriesEl.addEventListener('click',event => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    searchHistoryStarted = false;
    change({...state,category:button.dataset.category});
  });
  reset.addEventListener('click',resetAll);
  document.getElementById('model-empty-reset').addEventListener('click',resetAll);
  window.addEventListener('popstate',() => {
    searchHistoryStarted = false;
    state = readUrl();
    input.value = state.q;
    render();
  });
  async function load() {
    error.hidden = true;
    count.textContent = '読み込み中…';
    grid.setAttribute('aria-busy','true');
    document.getElementById('model-retry').disabled = true;
    try {
      const response = await fetch('assets/models/index.json?v=20261029-1');
      if (!response.ok) throw new Error('Catalog unavailable');
      const data = await response.json();
      if (!Array.isArray(data.models) || !data.models.length || new Set(data.models.map(model => model.id)).size !== data.models.length) throw new Error('Invalid catalog');
      models = data.models;
      categories = [...new Set(models.map(model => model.category))];
      categoriesEl.innerHTML = ['',...categories].map(category => `<button type="button" class="models-category" data-category="${esc(category)}" aria-pressed="false">${esc(category || 'すべて')}<span aria-hidden="true">0</span></button>`).join('');
      document.getElementById('model-total').textContent = models.length;
      if (/^\d{4}-\d{2}-\d{2}$/.test(data.updated)) {
        const updated = document.getElementById('model-updated');
        updated.dateTime = data.updated;
        updated.textContent = data.updated.replaceAll('-','.');
      }
      state = readUrl();
      input.value = state.q;
      input.disabled = false;
      reset.disabled = false;
      render();
      if (/^#M300-\d{3}$/.test(location.hash)) document.getElementById(location.hash.slice(1))?.scrollIntoView();
    } catch (_) {
      grid.setAttribute('aria-busy','false');
      error.hidden = false;
      count.textContent = '読み込みエラー';
    } finally {
      document.getElementById('model-retry').disabled = false;
    }
  }
  document.getElementById('model-retry').addEventListener('click',load);
  load();
})();
