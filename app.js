const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function getPosts() {
  const list = typeof POSTS !== "undefined" ? POSTS : [];
  return list.slice().sort((a, b) => b.date.localeCompare(a.date));
}

function postLink(p) {
  if (p.url) return `<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.title)}</a>`;
  return `<a href="post.html?p=${encodeURIComponent(p.slug)}">${esc(p.title)}</a>`;
}

function listItems(posts) {
  if (!posts.length) return '<li class="empty muted">nada por aqui ainda.</li>';
  return posts
    .map(
      (p) => `<li>
        ${postLink(p)}
        <span class="tags">${(p.tags || []).map((t) => "#" + esc(t)).join(" ")}</span>
      </li>`
    )
    .join("");
}

function renderList(el, posts) {
  el.innerHTML = listItems(posts);
}

const CTF_GROUPS = ["Hack The Box", "TryHackMe"];

function renderCtfs(el, posts) {
  const names = CTF_GROUPS.slice();
  posts.forEach((p) => {
    const g = p.group || "Outros";
    if (!names.includes(g)) names.push(g);
  });
  el.innerHTML = names
    .map(
      (g) => `<section class="group">
        <h2 class="group-title"><span>${esc(g)}</span></h2>
        <ul class="posts">${listItems(posts.filter((p) => (p.group || "Outros") === g))}</ul>
      </section>`
    )
    .join("");
}

function setupTabs() {
  const tabs = [...document.querySelectorAll(".tabs button")];
  const panels = [...document.querySelectorAll(".panel")];

  function show(name) {
    if (!panels.some((p) => p.id === "tab-" + name)) name = "sobre";
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
    panels.forEach((p) => (p.hidden = p.id !== "tab-" + name));
    history.replaceState(null, "", "#" + name);
  }

  tabs.forEach((t) => t.addEventListener("click", () => show(t.dataset.tab)));
  show(location.hash.slice(1) || "sobre");
  window.addEventListener("hashchange", () => show(location.hash.slice(1) || "sobre"));
}

async function checkCv() {
  const links = [...document.querySelectorAll(".cv-link")];
  if (!links.length || location.protocol === "file:") return;

  const found = await Promise.all(
    links.map(async (a) => {
      try {
        const res = await fetch(a.getAttribute("href"), { method: "HEAD" });
        return res.ok;
      } catch (e) {
        return false;
      }
    })
  );

  links.forEach((a, i) => { if (!found[i]) a.remove(); });

  if (!found.some(Boolean)) {
    const box = document.querySelector(".cv-links");
    if (box) box.innerHTML = '<span class="muted">currículo em breve.</span>';
  }
}

function renderHome() {
  setupTabs();
  checkCv();
  const posts = getPosts();
  renderCtfs(document.getElementById("list-ctf"), posts.filter((p) => p.type === "ctf"));
  renderList(document.getElementById("list-artigo"), posts.filter((p) => p.type === "artigo"));
}

const ABSOLUTE = /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i;

function fixLinks(root, mdUrl, posts) {
  const siteRoot = new URL(".", location.href).pathname;

  root.querySelectorAll("[src], [href]").forEach((el) => {
    const attr = el.hasAttribute("src") ? "src" : "href";
    const val = el.getAttribute(attr);
    if (!val || ABSOLUTE.test(val)) return;

    const url = new URL(val, mdUrl);

    if (attr === "href" && /\.md$/i.test(url.pathname)) {
      const rel = decodeURIComponent(url.pathname.slice(siteRoot.length));
      const target = posts.find((p) => p.path === rel);
      if (target) {
        el.setAttribute("href", "post.html?p=" + encodeURIComponent(target.slug));
        return;
      }
    }
    el.setAttribute(attr, url.href);
  });

  root.querySelectorAll("img").forEach((img) => (img.loading = "lazy"));
}

async function renderPost() {
  const content = document.getElementById("content");
  const slug = new URLSearchParams(location.search).get("p") || "";
  const posts = getPosts();
  const info = posts.find((p) => p.slug === slug && p.path);

  if (!info) {
    content.textContent = "post nao encontrado.";
    return;
  }

  document.title = info.title;
  document.getElementById("title").textContent = info.title;
  const tags = [info.group, ...(info.tags || []).map((t) => "#" + t)].filter(Boolean).join(" · ");
  const meta = document.getElementById("meta");
  if (tags) meta.textContent = tags;
  else meta.remove();
  document.getElementById("back").href = "index.html#" + (info.type === "artigo" ? "artigos" : "ctfs");

  const mdUrl = new URL(info.path.split("/").map(encodeURIComponent).join("/"), location.href);

  try {
    const res = await fetch(mdUrl);
    if (!res.ok) throw new Error("not found");
    const text = (await res.text()).replace(/^﻿/, "");
    const body = text.split(/\r?\n/).slice(info.skip || 0).join("\n");

    content.innerHTML = marked.parse(body);
    fixLinks(content, mdUrl, posts);
    content.querySelectorAll("pre code").forEach((el) => hljs.highlightElement(el));
  } catch (e) {
    content.textContent =
      location.protocol === "file:"
        ? "pra ler os posts localmente, rode um servidor: python3 -m http.server"
        : "nao consegui carregar este post.";
  }
}

if (document.body.classList.contains("home")) renderHome();
if (document.body.classList.contains("post")) renderPost();
