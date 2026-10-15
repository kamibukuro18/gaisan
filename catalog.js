/* Display metadata only; original published content stays in content.js. */
(() => {
  const content = window.siteContent || {};
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const collections = [['games','game'],['aiGames','game'],['projects','tool'],['models3d','3d']];
  const works = collections.flatMap(([collection,kind]) => (content[collection] || []).map(item => ({...item,collection,kind})));
  const styles = {
    'crabhouse': {accent:'coral',caption:'CRABHOUSE',visual:'crab'},
    'crabhouse-opus': {accent:'violet',caption:'CRABHOUSE / WEB',visual:'crab'},
    'star-finch': {accent:'violet',caption:'STAR FINCH / 2 STAGES',visual:'star'},
    'potato-collection': {accent:'coral',caption:'POTATO COLLECTION',visual:'image'},
    'fantasy-dungeon': {accent:'blue',caption:'FANTASY DUNGEON',visual:'image'},
    'gourmet-hamburger': {accent:'coral',caption:'GOURMET HAMBURGER',visual:'image'},
    'showa-candy-shop': {accent:'mint',caption:'SHOWA CANDY SHOP',visual:'image'},
    'flow-switch': {accent:'mint',caption:'WORKSPACE SWITCH',visual:'windows'},
    'steam-image-exporter': {accent:'blue',caption:'ONE IMAGE → MANY SIZES',visual:'export'}
  };
  const entryHref = (item,collection=item.collection) => item.slug ? `entry.html?type=${encodeURIComponent(collection)}&slug=${encodeURIComponent(item.slug)}` : (item.href || '');
  function primaryAction(item) {
    if (item.href) return {href:item.href,label:item.collection === 'models3d' ? 'BOOTHで購入' : (item.collection === 'aiGames' ? '遊ぶ' : '開く')};
    const links = (item.page?.sections || []).flatMap(section => section.links || []);
    const store = links.find(link => /^https:\/\/apps\.apple\.com\//.test(link.href));
    if (store) return {href:store.href,label:'App Storeへ'};
    const download = links.find(link => /^https:\/\/[^/]*gumroad\.com\//.test(link.href));
    if (download) return {href:download.href,label:'配布ページへ'};
    return null;
  }
  function illustration(item) {
    const style = styles[item.slug] || {accent:'blue',caption:item.title,visual:'export'};
    if (style.visual === 'image' && item.cover) {
      return `<span class="visual-image-wrap"><img class="visual-image" src="${esc(item.cover)}" alt="" loading="lazy"><span class="visual-image-shade"></span></span><span class="visual-label">${esc(style.caption)}</span><span class="visual-source">BOOTH / 3D MODEL</span>`;
    }
    let art;
    if (style.visual === 'crab') {
      art = '<svg viewBox="0 0 320 180" aria-hidden="true"><path d="M0 145h320M0 159h320" stroke="currentColor" opacity=".18"/><g fill="currentColor"><path d="M116 88h88v43h-88zM102 73h16v22h-16zM86 61h15v29H86zM202 73h16v22h-16zM219 61h15v29h-15zM101 115h16v11h-16zM89 128h27v10H89zM204 115h16v11h-16zM204 128h27v10h-27zM128 70h12v18h-12zM180 70h12v18h-12z"/><rect x="128" y="70" width="12" height="6" fill="#111315"/><rect x="180" y="70" width="12" height="6" fill="#111315"/></g></svg>';
    } else if (style.visual === 'star') {
      art = '<svg viewBox="0 0 320 180" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3"><path d="M28 35h264M28 145h264" opacity=".3"/><path d="m160 35 15 34 37 3-28 24 9 36-33-19-33 19 9-36-28-24 37-3 15-34z"/><path d="M36 90h42m164 0h42M72 63l30 12m116 30 30 12M72 117l30-12m116-30 30-12" opacity=".65"/></g><circle cx="160" cy="90" r="7" fill="currentColor"/></svg>';
    } else if (style.visual === 'windows') {
      art = '<svg viewBox="0 0 320 180" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3"><rect x="35" y="32" width="146" height="98" rx="7" opacity=".45"/><rect x="123" y="68" width="160" height="91" rx="7"/><path d="M123 91h160M45 53h124M79 99h32m-8-8 8 8-8 8"/></g><g fill="currentColor"><rect x="139" y="106" width="28" height="28" rx="4"/><rect x="180" y="106" width="28" height="28" rx="4" opacity=".7"/><rect x="221" y="106" width="28" height="28" rx="4" opacity=".4"/></g></svg>';
    } else {
      art = '<svg viewBox="0 0 320 180" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3"><rect x="26" y="48" width="100" height="84" rx="4"/><path d="m34 118 26-30 21 20 17-18 20 28M143 90h34m-9-8 9 8-9 8"/><rect x="195" y="30" width="98" height="48" rx="3"/><rect x="195" y="92" width="52" height="57" rx="3"/><rect x="260" y="92" width="33" height="57" rx="3"/></g><circle cx="101" cy="69" r="9" fill="currentColor" opacity=".6"/></svg>';
    }
    return `<span class="visual-art">${art}</span><span class="visual-label">${esc(style.caption)}</span><span class="visual-source">コンセプトイラスト</span>`;
  }
  window.portfolioUI = {content,esc,works,styles,entryHref,primaryAction,illustration};
})();
