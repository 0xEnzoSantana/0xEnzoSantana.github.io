import json
import re
import subprocess
import unicodedata
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS = ROOT / "posts"

FOLDERS = {"ctfs": "ctf", "ctf": "ctf", "artigos": "artigo", "artigo": "artigo"}

DATE_KEYS = ("date", "data", "created", "created time", "criado", "criado em", "publicado", "published")
TAG_KEYS = ("tags", "tag", "categoria", "categorias", "category", "categories", "etiquetas")
KNOWN_KEYS = set(DATE_KEYS) | set(TAG_KEYS) | {
    "status", "type", "tipo", "ctf", "plataforma", "platform", "dificuldade", "difficulty",
    "last edited time", "ultima edicao", "created by", "criado por", "owner", "autor", "author",
}
PLATFORM_KEYS = ("platform", "plataforma")
PLATFORMS = {
    "tryhackme": "TryHackMe", "thm": "TryHackMe",
    "hackthebox": "Hack The Box", "htb": "Hack The Box", "hack the box": "Hack The Box",
}
DRAFT_VALUES = {"draft", "rascunho", "private", "privado"}

MONTHS = {
    "january": 1, "jan": 1, "janeiro": 1,
    "february": 2, "feb": 2, "fevereiro": 2, "fev": 2,
    "march": 3, "mar": 3, "marco": 3,
    "april": 4, "apr": 4, "abril": 4, "abr": 4,
    "may": 5, "maio": 5, "mai": 5,
    "june": 6, "jun": 6, "junho": 6,
    "july": 7, "jul": 7, "julho": 7,
    "august": 8, "aug": 8, "agosto": 8, "ago": 8,
    "september": 9, "sep": 9, "sept": 9, "setembro": 9, "set": 9,
    "october": 10, "oct": 10, "outubro": 10, "out": 10,
    "november": 11, "nov": 11, "novembro": 11,
    "december": 12, "dec": 12, "dezembro": 12, "dez": 12,
}

PROP = re.compile(r"^([\w .\-]{1,40}):(?:\s+(.*))?$")


def fold(s):
    s = unicodedata.normalize("NFKD", s)
    return "".join(c for c in s if not unicodedata.combining(c)).lower().strip()


def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()


def clean_stem(stem):
    return re.sub(r"\s+[0-9a-f]{32}$", "", stem, flags=re.I).strip()


def mk_date(y, m, d):
    try:
        return datetime(int(y), int(m), int(d)).strftime("%Y-%m-%d")
    except ValueError:
        return None


def parse_date(raw):
    s = fold(raw).lstrip("@ ").strip()
    m = re.search(r"(\d{4})-(\d{1,2})-(\d{1,2})", s)
    if m:
        return mk_date(*m.groups())
    m = re.search(r"(\d{1,2})/(\d{1,2})/(\d{4})", s)
    if m:
        d, mo, y = m.groups()
        return mk_date(y, mo, d)
    m = re.search(r"(\d{1,2}) de ([a-z]+)\.? de (\d{4})", s)
    if m and m.group(2) in MONTHS:
        return mk_date(m.group(3), MONTHS[m.group(2)], m.group(1))
    m = re.search(r"([a-z]+)\.? (\d{1,2}),? (\d{4})", s)
    if m and m.group(1) in MONTHS:
        return mk_date(m.group(3), MONTHS[m.group(1)], m.group(2))
    m = re.search(r"(\d{1,2}) ([a-z]+)\.? (\d{4})", s)
    if m and m.group(2) in MONTHS:
        return mk_date(m.group(3), MONTHS[m.group(2)], m.group(1))
    return None


def split_lines(path):
    text = path.read_text(encoding="utf-8-sig", errors="replace")
    return re.split(r"\r?\n", text)


def parse_post(path):
    lines = split_lines(path)
    n = len(lines)

    i = 0
    while i < n and not lines[i].strip():
        i += 1

    title = None
    if i < n and re.match(r"^#\s+\S", lines[i]):
        title = re.sub(r"^#\s+", "", lines[i]).strip()
        i += 1

    skip = i
    j = i
    while j < n and not lines[j].strip():
        j += 1

    block, k = [], j
    while k < n and lines[k].strip():
        m = PROP.match(lines[k].strip())
        if not m:
            block = None
            break
        block.append((fold(m.group(1)), (m.group(2) or "").strip()))
        k += 1

    props = {}
    if block and (len(block) >= 2 or block[0][0] in KNOWN_KEYS):
        props = dict(block)
        skip = k
    return title, props, skip


def platform_name(raw):
    key = fold(raw).replace("-", " ").replace("_", " ")
    return PLATFORMS.get(key) or PLATFORMS.get(key.replace(" ", ""))


def parse_tags(value):
    tags = []
    for t in value.split(","):
        t = t.strip().lstrip("#").strip()
        if t and t not in tags:
            tags.append(t)
    return tags


def git_date(path):
    try:
        out = subprocess.run(
            ["git", "log", "--diff-filter=A", "--format=%cs", "--", path.relative_to(ROOT).as_posix()],
            cwd=ROOT, capture_output=True, text=True, check=True,
        ).stdout.split()
        return out[-1] if out else None
    except Exception:
        return None


def file_date(path):
    return datetime.fromtimestamp(path.stat().st_mtime).strftime("%Y-%m-%d")


def collect():
    entries, used, hidden = [], set(), []

    folders = sorted(p for p in POSTS.iterdir() if p.is_dir()) if POSTS.exists() else []
    for folder in folders:
        ptype = FOLDERS.get(folder.name.lower())
        if not ptype:
            continue
        for md in sorted(folder.rglob("*.md")):
            if md.name.startswith(("_", ".")) or md.name.lower() == "readme.md":
                continue

            title, props, skip = parse_post(md)
            rel = md.relative_to(ROOT).as_posix()

            if fold(props.get("status", "")) in DRAFT_VALUES:
                hidden.append(rel)
                continue

            stem = clean_stem(md.stem)
            title = title or stem.replace("_", " ") or md.stem

            slug = slugify(stem) or slugify(title) or "post"
            base, n = slug, 2
            while slug in used:
                slug = f"{base}-{n}"
                n += 1
            used.add(slug)

            date = None
            for key in DATE_KEYS:
                if key in props:
                    date = parse_date(props[key])
                    if date:
                        break
            date = date or git_date(md) or file_date(md)

            tags = []
            for key in TAG_KEYS:
                if key in props:
                    tags = parse_tags(props[key])
                    break

            entry = {
                "type": ptype, "slug": slug, "title": title,
                "date": date, "tags": tags, "path": rel, "skip": skip,
            }
            if ptype == "ctf":
                group = None
                for key in PLATFORM_KEYS:
                    if key in props:
                        group = platform_name(props[key]) or props[key].strip()
                        break
                if not group:
                    parts = md.relative_to(folder).parts
                    group = platform_name(parts[0]) if len(parts) > 1 else None
                if group:
                    entry["group"] = group
            entries.append(entry)
    return entries, hidden


def collect_external():
    path = POSTS / "externos.json"
    if not path.exists():
        return []
    out = []
    for item in json.loads(path.read_text(encoding="utf-8-sig") or "[]"):
        if not (item.get("title") and item.get("url")):
            print("aviso: item de externos.json precisa de title e url:", item)
            continue
        out.append({
            "type": item.get("type", "artigo"), "slug": None, "title": item["title"],
            "date": item.get("date", "0000-00-00"), "tags": item.get("tags", []), "url": item["url"],
        **({"group": item["group"]} if item.get("group") else {}),
        })
    return out


def main():
    entries, hidden = collect()
    entries += collect_external()
    entries.sort(key=lambda e: (e["date"], e["title"]), reverse=True)

    body = "const POSTS = " + json.dumps(entries, ensure_ascii=False, indent=2) + ";\n"
    (POSTS / "index.js").write_text(body, encoding="utf-8")

    ctf = sum(1 for e in entries if e["type"] == "ctf")
    print(f"posts/index.js: {len(entries)} itens ({ctf} ctf, {len(entries) - ctf} artigo)")
    for h in hidden:
        print("  escondido (rascunho):", h)


if __name__ == "__main__":
    main()
