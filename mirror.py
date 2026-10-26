"""
Mirror www.akericemill.com (iGetWeb.com Thai CMS, static HTML).
"""
import os, re, hashlib, urllib.parse, urllib.request, ssl, json
from pathlib import Path

ROOT = Path.home() / "Desktop" / "ake-rice-hebrew"
BASE = "https://www.akericemill.com"
IMG_DIR = ROOT / "images"
CSS_DIR = ROOT / "css"
JS_DIR = ROOT / "js"
RAW_DIR = ROOT / "_raw_html"
for d in (ROOT, IMG_DIR, CSS_DIR, JS_DIR, RAW_DIR):
    d.mkdir(parents=True, exist_ok=True)

PAGES = {
    "/en/": "index.html",
    "/en/pages/17068-Overview": "overview.html",
    "/en/pages/17066-Our Product": "products.html",
    "/en/galleries": "news-activity.html",
    "/en/galleries/21814-ประวัติความเป็นมา": "about-us.html",
    "/en/contact-us": "contact.html",
    "/en/pages/17072-Career": "career.html",
    "/en/products/351057": "product-351057.html",
    "/en/products/351123": "product-351123.html",
    "/en/products/351124": "product-351124.html",
    "/en/products/351126": "product-351126.html",
    "/en/products/351127": "product-351127.html",
    "/en/products/351128": "product-351128.html",
    "/en/products/351129": "product-351129.html",
    "/en/products/351130": "product-351130.html",
    "/en/products/351132": "product-351132.html",
    "/en/products/361542": "product-361542.html",
    "/en/galleries/37737": "gallery-37737.html",
    "/en/galleries/37739": "gallery-37739.html",
    "/en/galleries/85457": "gallery-85457.html",
    "/en/galleries/85459": "gallery-85459.html",
    "/en/articles/126930": "article-126930.html",
    "/en/articles/126932": "article-126932.html",
    "/en/articles/126936": "article-126936.html",
    "/en/articles/126937": "article-126937.html",
    "/en/articles/126938": "article-126938.html",
    "/en/articles/126939": "article-126939.html",
    "/en/articles/126940": "article-126940.html",
    "/en/articles/126941": "article-126941.html",
    "/en/articles/126942": "article-126942.html",
}

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
HDR = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15"}
downloaded = {}

def safe_name(url, ext_hint=None):
    p = urllib.parse.urlparse(url)
    base = os.path.basename(p.path.rstrip("/")) or "asset"
    base = base.split("?")[0]
    h = hashlib.md5(url.encode()).hexdigest()[:8]
    name, ext = os.path.splitext(base)
    if not ext:
        ext = ext_hint or ".bin"
    return f"{name[:60]}_{h}{ext}"

def download(url, target_dir, ext_hint=None):
    if url in downloaded:
        return downloaded[url]
    try:
        req = urllib.request.Request(url, headers=HDR)
        with urllib.request.urlopen(req, context=CTX, timeout=30) as r:
            data = r.read()
            ct = r.headers.get("content-type", "").lower()
        hint = ext_hint
        if not hint:
            if "jpeg" in ct or "jpg" in ct: hint = ".jpg"
            elif "png" in ct: hint = ".png"
            elif "gif" in ct: hint = ".gif"
            elif "webp" in ct: hint = ".webp"
            elif "svg" in ct: hint = ".svg"
            elif "css" in ct: hint = ".css"
            elif "javascript" in ct: hint = ".js"
        name = safe_name(url, ext_hint=hint)
        target_dir.mkdir(parents=True, exist_ok=True)
        (target_dir / name).write_bytes(data)
        rel = f"{target_dir.name}/{name}"
        downloaded[url] = rel
        return rel
    except Exception as e:
        print(f"  ✗ FAIL {url[:70]}: {e}")
        downloaded[url] = None
        return None

IMG_RE = re.compile(r'(?:src|data-src|data-original)=["\']([^"\'\s>]+\.(?:jpg|jpeg|png|gif|webp|svg)[^"\'\s>]*)["\']', re.IGNORECASE)
SRCSET_RE = re.compile(r'srcset=["\']([^"\']+)["\']')
CSS_RE = re.compile(r'<link[^>]+href=["\']([^"\']+\.css[^"\']*)["\']', re.IGNORECASE)
JS_RE = re.compile(r'<script[^>]+src=["\']([^"\']+\.js[^"\']*)["\']', re.IGNORECASE)
BG_RE = re.compile(r'url\(["\']?([^")]+\.(?:jpg|jpeg|png|gif|webp|svg)[^")]*)["\']?\)', re.IGNORECASE)

def abs_url(src, page_url):
    if not src or src.startswith("data:"): return None
    if src.startswith("//"): return "https:" + src
    if src.startswith("http"): return src
    if src.startswith("/"): return BASE + src
    return urllib.parse.urljoin(page_url, src)

def mirror_page(route, filename):
    url = BASE + urllib.parse.quote(route, safe="/:")
    print(f"→ {url}")
    try:
        req = urllib.request.Request(url, headers=HDR)
        with urllib.request.urlopen(req, context=CTX, timeout=45) as r:
            html = r.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"  ✗ page fail: {e}")
        return
    (RAW_DIR / filename.replace(".html", ".raw.html")).write_text(html, encoding="utf-8")

    img_urls = set(IMG_RE.findall(html))
    for m in SRCSET_RE.finditer(html):
        for item in m.group(1).split(","):
            u = item.strip().split()[0]
            if u: img_urls.add(u)
    for m in BG_RE.finditer(html):
        img_urls.add(m.group(1))
    css_urls = set(CSS_RE.findall(html))
    js_urls = set(JS_RE.findall(html))

    url_map = {}
    for u in img_urls:
        au = abs_url(u, url)
        if au:
            local = download(au, IMG_DIR)
            if local: url_map[u] = "/" + local
    for u in css_urls:
        au = abs_url(u, url)
        if au:
            local = download(au, CSS_DIR, ext_hint=".css")
            if local: url_map[u] = "/" + local
    for u in js_urls:
        au = abs_url(u, url)
        if au:
            local = download(au, JS_DIR, ext_hint=".js")
            if local: url_map[u] = "/" + local

    for orig, local in sorted(url_map.items(), key=lambda x: -len(x[0])):
        html = html.replace(f'"{orig}"', f'"{local}"').replace(f"'{orig}'", f"'{local}'")

    nav_map = {
        '/en/pages/17068-Overview': '/overview.html',
        '/en/pages/17066-Our%20Product': '/products.html',
        '/en/pages/17066-Our Product': '/products.html',
        '/en/galleries': '/news-activity.html',
        '/en/galleries/21814-ประวัติความเป็นมา': '/about-us.html',
        '/en/contact-us': '/contact.html',
        '/en/pages/17072-Career': '/career.html',
    }
    for src, dst in nav_map.items():
        html = html.replace(f'href="{src}"', f'href="{dst}"')
    for n in [351057, 351123, 351124, 351126, 351127, 351128, 351129, 351130, 351132, 361542]:
        html = re.sub(rf'href="/en/products/{n}[^"]*"', f'href="/product-{n}.html"', html)
    for n in [126930, 126932, 126936, 126937, 126938, 126939, 126940, 126941, 126942]:
        html = re.sub(rf'href="/en/articles/{n}[^"]*"', f'href="/article-{n}.html"', html)
    for n in [37737, 37739, 85457, 85459]:
        html = re.sub(rf'href="/en/galleries/{n}[^"]*"', f'href="/gallery-{n}.html"', html)

    (ROOT / filename).write_text(html, encoding="utf-8")
    print(f"  ✓ saved {filename} ({len(html)//1024}KB · imgs:{len(img_urls)} css:{len(css_urls)} js:{len(js_urls)})")

for route, fn in PAGES.items():
    mirror_page(route, fn)

print(f"\nTotal assets downloaded: {len([v for v in downloaded.values() if v])}")
print(f"  Images: {len(list(IMG_DIR.glob('*')))}")
print(f"  CSS: {len(list(CSS_DIR.glob('*')))}")
print(f"  JS: {len(list(JS_DIR.glob('*')))}")

(ROOT / "_asset_manifest.json").write_text(json.dumps(downloaded, indent=2, ensure_ascii=False))
