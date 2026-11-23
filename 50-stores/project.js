const $ = (id) => document.getElementById(id);
const count = (value) => String(value).padStart(2, '0');
const make = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (className) node.className = className;
  return node;
};

function publicPhoto(value) {
  if (typeof value !== 'string' || !/^photos\/[a-zA-Z0-9_-]+\.(?:avif|webp|jpe?g|png)$/i.test(value)) return '';
  const url = new URL(value, location.href);
  if (url.origin !== location.origin || !url.pathname.startsWith(new URL('photos/', location.href).pathname)) return '';
  return url.href;
}

function publicLink(value, directions = false) {
  if (typeof value !== 'string' || !value.startsWith('https://')) return '';
  try {
    const url = new URL(value);
    if (url.username || url.password || (directions && url.hostname !== 'maps.app.goo.gl')) return '';
    return url.href;
  } catch { return ''; }
}

function linkTo(label, href, className) {
  const link = make('a', label, className);
  link.href = href;
  return link;
}

function publicRecord(input) {
  if (!input || input.approved !== true || !Number.isInteger(input.number) || input.number < 1 ||
      !['name','area','alt'].every((key) => typeof input[key] === 'string' && input[key].trim())) return null;
  const photo = publicPhoto(input.photo);
  if (!photo) return null;
  const { number, name, area, alt, lat, lng } = input;
  const art = typeof input.art === 'string' ? input.art.trim() : '';
  const date = typeof input.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input.date) ? input.date : '';
  const website = publicLink(input.website);
  const directions = publicLink(input.directions, true);
  return { number, name, area, art, date, alt, photo, lat, lng, website, directions };
}

function image(venue, lazy = true) {
  const img = make('img');
  img.src = venue.photo;
  img.alt = venue.alt;
  if (lazy) img.loading = 'lazy';
  img.decoding = 'async';
  return img;
}

function renderVenues(venues) {
  if (!venues.length) return;
  $('gallery-empty').hidden = true;
  $('stores-empty').hidden = true;
  $('store-table-wrap').hidden = false;
  for (const venue of venues) {
    const fig = make('figure');
    fig.id = 'store-' + venue.number;
    const cap = make('figcaption');
    cap.append(make('span', 'STORE ' + count(venue.number)), make('strong', venue.name),
      make('span', venue.area + (venue.art ? ' / ' + venue.art : '')));
    const links = make('span', null, 'store-links');
    if (venue.website) links.append(linkTo('店舗情報', venue.website));
    if (venue.directions) links.append(linkTo('Google マップで見る', venue.directions));
    if (links.childElementCount) cap.append(links);
    fig.append(image(venue), cap);
    $('venue-gallery').append(fig);

    const row = make('tr');
    const name = make('th');
    name.scope = 'row';
    const link = make('a', venue.name);
    link.href = '#' + fig.id;
    name.append(link);
    const date = make('td', venue.date ? null : '—');
    if (venue.date) {
      const when = make('time', venue.date.split('-').join('.'));
      when.dateTime = venue.date;
      date.append(when);
    }
    row.append(name, make('td', venue.area), make('td', venue.art || '—'), date);
    $('venue-table').append(row);
  }
}

function loadLeaflet(kind, url, integrity) {
  return new Promise((resolve, reject) => {
    const node = document.createElement(kind);
    if (kind === 'link') { node.rel = 'stylesheet'; node.href = url; }
    else node.src = url;
    node.integrity = integrity;
    node.crossOrigin = 'anonymous';
    node.onload = resolve;
    node.onerror = reject;
    document.head.append(node);
  });
}

function renderMap(venues) {
  if (!venues.length) return;
  const locations = venues.filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng) &&
    item.lat >= 20 && item.lat <= 46 && item.lng >= 122 && item.lng <= 154);
  $('map-list-link').hidden = false;
  if (!locations.length) {
    $('map-empty').textContent = '地図で公開できる位置情報は、まだありません。';
    return;
  }
  const trigger = $('map-open');
  trigger.hidden = false;
  $('map-empty').hidden = true;
  trigger.addEventListener('click', async () => {
    if (trigger.disabled) return;
    trigger.disabled = true;
    $('map-status').textContent = '地図を読み込んでいます。';
    const target = $('venue-map');
    try {
      const base = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.';
      await Promise.all([
        loadLeaflet('link', base + 'css', 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='),
        loadLeaflet('script', base + 'js', 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=')
      ]);
      const L = window.L;
      target.hidden = false;
      const map = L.map(target, { scrollWheelZoom: false, minZoom: 5, maxZoom: 18 });
      const tiles = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
        attribution: '出典：<a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院（淡色地図）</a>',
        maxNativeZoom: 18, noWrap: true
      });
      tiles.on('tileerror', () => {
        $('map-status').textContent = '背景地図の一部を取得できません。展示場所は店舗一覧でも確認できます。';
      });
      const layer = L.featureGroup();
      for (const venue of locations) {
        const badge = make('span', count(venue.number));
        const icon = L.divIcon({ className: 'map-pin', html: badge, iconSize: [32, 32] });
        const pin = L.marker([venue.lat, venue.lng], { icon, title: venue.name, alt: venue.name });
        const details = make('div', null, 'map-popup');
        const photo = image(venue, false);
        photo.width = 192;
        photo.height = 144;
        const link = make('a', '展示写真へ');
        link.href = '#store-' + venue.number;
        details.append(photo, make('b', venue.name), make('span', venue.art || '作品名未記載'), link);
        if (venue.directions) details.append(make('br'), linkTo('Google マップで見る', venue.directions));
        layer.addLayer(pin.bindPopup(details));
      }
      tiles.addTo(map);
      layer.addTo(map);
      map.fitBounds(layer.getBounds(), { padding: [30, 30], maxZoom: 15 });
      trigger.hidden = true;
      target.tabIndex = 0;
      target.focus({ preventScroll: true });
      $('map-status').textContent = '地図を表示しました。ピンを選ぶと展示店舗を確認できます。';
    } catch (error) {
      target.hidden = true;
      trigger.disabled = false;
      $('map-status').textContent = '地図を読み込めませんでした。公開店舗は一覧から確認できます。';
    }
  });
}

async function init() {
  try {
    const response = await fetch(new URL('stores.json', import.meta.url));
    if (!response.ok) throw new Error('Store data unavailable');
    const data = await response.json();
    const used = new Set();
    const venues = (Array.isArray(data.stores) ? data.stores : []).map(publicRecord).filter((venue) => {
      if (!venue || used.has(venue.number)) return false;
      used.add(venue.number);
      return true;
    }).sort((a, b) => a.number - b.number);
    const current = Number.isInteger(data.displayed) && data.displayed >= 0 ? data.displayed : 5;
    const target = Number.isInteger(data.target) && data.target > 0 ? data.target : 50;
    $('venue-count').textContent = count(current);
    $('target-count').textContent = count(target);
    $('public-count').textContent = '公開店舗 ' + venues.length;
    const progress = $('venue-progress');
    progress.max = target;
    progress.value = Math.min(current, target);
    progress.setAttribute('aria-label', '展示店舗数：目標' + target + '店舗のうち' + current + '店舗');
    renderVenues(venues);
    renderMap(venues);
  } catch (error) {
    console.warn('50 STORES PROJECT: display data fallback', error);
  }
}

init();
