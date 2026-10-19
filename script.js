const { content, esc, works, styles, entryHref, primaryAction, illustration } = window.portfolioUI;
function card(item) {
  const action = primaryAction(item);
  const accent = styles[item.slug]?.accent || 'blue';
  return `<article class="work-card" data-type="${item.kind}">
    <a class="visual ${accent}" href="${esc(entryHref(item))}" aria-label="${esc(item.title)}の詳細">${illustration(item)}</a>
    <div class="work-info"><div class="work-top"><span class="work-label">${esc(item.meta || 'WORK')}</span><span class="status">${esc(item.status || item.year || '')}</span></div>
    <h3><a href="${esc(entryHref(item))}">${esc(item.title)}</a></h3><p>${esc(item.summary)}</p>
    <div class="work-actions"><a class="primary-action" href="${esc(entryHref(item))}">詳細を見る</a>
    ${action ? `<a class="external-action" href="${esc(action.href)}" target="_blank" rel="noreferrer">${esc(action.label)} ↗</a>` : ''}</div></div></article>`;
}
const selected = ['crabhouse','star-finch','flow-switch'].map(slug => works.find(item => item.slug === slug)).filter(Boolean);
document.getElementById('featured-grid').innerHTML = selected.map(card).join('');
const grid = document.getElementById('works-grid'), empty = document.getElementById('empty-state');
const filterRow = document.querySelector('.filter-row');
if (filterRow && !filterRow.querySelector('[data-filter="site"]')) {
  const siteFilter = document.createElement('button');
  siteFilter.className = 'filter';
  siteFilter.dataset.filter = 'site';
  siteFilter.textContent = 'サイト制作';
  siteFilter.type = 'button';
  filterRow.append(siteFilter);
}
const filters = [...document.querySelectorAll('.filter')];
function render(filter='all') {
  const items = filter === 'all' ? works : works.filter(item => item.kind === filter);
  grid.innerHTML = items.map(card).join(''); empty.hidden = items.length > 0;
  filters.forEach(button => { const active = button.dataset.filter === filter; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)); });
}
filters.forEach(button => { const filter = button.dataset.filter; button.hidden = filter !== 'all' && !works.some(item => item.kind === filter); button.addEventListener('click',()=>render(filter)); });
render();
function memoCard(item,collection) {
  const href = entryHref(item,collection);
  return `<article class="memo"><span>${esc(item.date || item.year || collection)}</span><h3>${href ? `<a href="${esc(href)}">${esc(item.title)} ↗</a>` : esc(item.title)}</h3><p>${esc(item.summary || '')}</p></article>`;
}
document.getElementById('memo-grid').innerHTML = (content.timeline || []).slice(0,3).map(item=>memoCard(item,'timeline')).join('');
document.getElementById('ideas-grid').innerHTML = (content.ideas || []).map(item=>memoCard(item,'ideas')).join('');
document.getElementById('notes-grid').innerHTML = (content.notes || []).map(item=>memoCard(item,'notes')).join('');
document.getElementById('timeline-grid').innerHTML = (content.timeline || []).map(item=>memoCard(item,'timeline')).join('');
document.getElementById('archive-link').addEventListener('click',()=>{document.getElementById('memo-archive').open=true;});
if (['#memo-archive','#ideas','#notes','#timeline'].includes(window.location.hash)) document.getElementById('memo-archive').open=true;
