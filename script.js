const content = window.siteContent;

const heroEyebrow = document.getElementById("hero-eyebrow");
const heroTitle = document.getElementById("hero-title");
const heroSummary = document.getElementById("hero-summary");
const heroNote = document.getElementById("hero-note");
const heroLinks = document.getElementById("hero-links");
const statsGrid = document.getElementById("stats-grid");
const footerText = document.getElementById("footer-text");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

heroEyebrow.textContent = content.hero.eyebrow;
heroTitle.textContent = content.hero.title;
heroSummary.textContent = content.hero.summary;
heroNote.textContent = content.hero.note;
footerText.textContent = content.footer;

content.hero.links.forEach((link) => {
  const anchor = document.createElement("a");
  anchor.className = `action-link action-link-${link.style}`;
  anchor.href = link.href;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.textContent = link.label;
  heroLinks.appendChild(anchor);
});

content.stats.forEach((stat) => {
  const value = Array.isArray(content[stat.key]) ? content[stat.key].length : stat.value;
  const item = document.createElement("article");
  item.className = "stat-card";
  item.innerHTML = `
    <span class="stat-value">${escapeHtml(value)}</span>
    <span class="stat-label">${escapeHtml(stat.label)}</span>
  `;
  statsGrid.appendChild(item);
});

function renderCardGrid(targetId, items, emptyMessage) {
  const target = document.getElementById(targetId);

  if (!items.length) {
    const empty = document.createElement("article");
    empty.className = "empty-card";
    empty.innerHTML = `<p>${escapeHtml(emptyMessage)}</p>`;
    target.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";

    const tags = (item.tags || [])
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join("");

    const href = item.href || "#";
    const hasHref = Boolean(item.href);
    const isExternal = /^https?:\/\//.test(href);
    const targetAttr = isExternal ? ' target="_blank" rel="noreferrer"' : "";
    const details = (item.details || [])
      .map((detail) => `<li>${escapeHtml(detail)}</li>`)
      .join("");
    const linkMarkup = hasHref
      ? `<a class="card-link" href="${escapeHtml(href)}"${targetAttr}>${escapeHtml(item.cta || "Open")}</a>`
      : `<span class="card-link card-link-muted">${escapeHtml(item.cta || "Concept")}</span>`;

    card.innerHTML = `
      <p class="card-meta">${escapeHtml(item.meta || "Entry")}</p>
      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <p class="card-summary">${escapeHtml(item.summary)}</p>
      ${details ? `<ul class="card-details">${details}</ul>` : ""}
      <div class="card-tags">${tags}</div>
      <div class="card-footer">
        <span class="card-year">${escapeHtml(item.year || "")}</span>
        ${linkMarkup}
      </div>
    `;

    target.appendChild(card);
  });
}

function renderTimeline() {
  const list = document.getElementById("timeline-list");

  content.timeline.forEach((item) => {
    const entry = document.createElement("li");
    entry.innerHTML = `
      <span class="timeline-date">${escapeHtml(item.date)}</span>
      <p class="timeline-title">${escapeHtml(item.title)}</p>
      <p class="timeline-summary">${escapeHtml(item.summary)}</p>
    `;
    list.appendChild(entry);
  });
}

renderCardGrid("featured-grid", content.featured, "");
renderCardGrid("projects-grid", content.projects, content.emptyStates.projects);
renderCardGrid("ideas-grid", content.ideas, content.emptyStates.ideas);
renderCardGrid("notes-grid", content.notes, content.emptyStates.notes);
renderTimeline();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});
