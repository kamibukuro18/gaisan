const content = window.siteContent;

const introText = document.getElementById("intro-text");
const footerText = document.getElementById("footer-text");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getEntryHref(collectionName, item) {
  if (item.href) {
    return item.href;
  }

  if (item.slug) {
    return `entry.html?type=${encodeURIComponent(collectionName)}&slug=${encodeURIComponent(item.slug)}`;
  }

  return "#";
}

introText.textContent = content.intro || "";
footerText.textContent = content.footer;

function renderCardGrid(targetId, collectionName, items, emptyMessage) {
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

    const href = getEntryHref(collectionName, item);
    const hasHref = href !== "#";
    const isExternal = /^https?:\/\//.test(href);
    const targetAttr = isExternal ? ' target="_blank" rel="noreferrer"' : "";
    const details = (item.details || [])
      .map((detail) => `<li>${escapeHtml(detail)}</li>`)
      .join("");
    const linkMarkup = hasHref
      ? `<a class="card-link" href="${escapeHtml(href)}"${targetAttr}>${escapeHtml(item.cta || "Open")}</a>`
      : "";

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

renderCardGrid("featured-grid", "featured", content.featured, "");
renderCardGrid("projects-grid", "projects", content.projects, content.emptyStates.projects);
renderCardGrid("ideas-grid", "ideas", content.ideas, content.emptyStates.ideas);
renderCardGrid("notes-grid", "notes", content.notes, content.emptyStates.notes);
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
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});
