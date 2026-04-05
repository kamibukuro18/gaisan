const content = window.siteContent;

const footerText = document.getElementById("footer-text");
const entryEyebrow = document.getElementById("entry-eyebrow");
const entryTitle = document.getElementById("entry-title");
const entryIntro = document.getElementById("entry-intro");
const highlightsList = document.getElementById("entry-highlights");
const sectionsRoot = document.getElementById("entry-sections");
const backLink = document.getElementById("back-link");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getEntryData(type, slug) {
  const collection = content[type];

  if (!Array.isArray(collection)) {
    return null;
  }

  return collection.find((item) => item.slug === slug) || null;
}

function getBackHref(type) {
  if (type === "projects") {
    return "index.html#projects";
  }

  if (type === "notes") {
    return "index.html#notes";
  }

  if (type === "featured") {
    return "index.html#featured";
  }

  return "index.html#ideas";
}

function renderNotFound() {
  entryEyebrow.textContent = "Not Found";
  entryTitle.textContent = "ページが見つかりません";
  entryIntro.textContent =
    "指定された詳細ページが存在しないか、まだデータが追加されていません。";
  sectionsRoot.innerHTML = `
    <article class="entry-block">
      <h2>確認ポイント</h2>
      <ul class="entry-list">
        <li>URL の type と slug が正しいか</li>
        <li>content.js に対象のデータがあるか</li>
      </ul>
    </article>
  `;
}

function renderEntry(entry) {
  const page = entry.page || {};

  document.title = `gaisan | ${entry.title}`;
  entryEyebrow.textContent = page.eyebrow || entry.meta || "Entry";
  entryTitle.textContent = entry.title;
  entryIntro.textContent = page.intro || entry.summary || "";

  const highlights = page.highlights || [];
  if (highlights.length) {
    highlightsList.innerHTML = highlights
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
  } else {
    highlightsList.innerHTML = `<li>${escapeHtml(entry.summary || "")}</li>`;
  }

  const sections = page.sections || [];
  sectionsRoot.innerHTML = sections
    .map((section) => {
      const paragraphs = (section.paragraphs || [])
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join("");
      const bullets = (section.bullets || [])
        .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
        .join("");

      return `
        <article class="entry-block">
          <h2>${escapeHtml(section.title || "")}</h2>
          ${paragraphs}
          ${bullets ? `<ul class="entry-list">${bullets}</ul>` : ""}
        </article>
      `;
    })
    .join("");
}

footerText.textContent = content.footer;

const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const slug = params.get("slug");
const entry = type && slug ? getEntryData(type, slug) : null;

backLink.href = getBackHref(type);

if (entry) {
  renderEntry(entry);
} else {
  renderNotFound();
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entryItem) => {
      if (entryItem.isIntersecting) {
        entryItem.target.classList.add("is-visible");
        observer.unobserve(entryItem.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});
