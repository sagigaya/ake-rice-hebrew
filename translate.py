"""
HTML-aware translation for Ake Rice site.
Only translates text nodes (not JS/CSS). Preserves layout.
Injects RTL + Hebrew fonts (Heebo + Frank Ruhl Libre).
"""
import re, json
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Comment

ROOT = Path.home() / "Desktop" / "ake-rice-hebrew"
translations = json.loads((ROOT / "_translations.json").read_text(encoding="utf-8"))

# Extra UI translations likely missing from source
EXTRA = {
    "Facebook": "Facebook",
    "Twitter": "Twitter",
    "YouTube": "YouTube",
    "Instagram": "Instagram",
    "Line": "Line",
    "LINE": "Line",
    "Login": "התחברות",
    "Log in": "התחברות",
    "Logout": "התנתקות",
    "Register": "הרשמה",
    "Sign in": "התחברות",
    "Sign up": "הרשמה",
    "Search": "חיפוש",
    "Submit": "שלח",
    "Send": "שלח",
    "Send Message": "שלח הודעה",
    "Contact Us": "צור קשר",
    "Contact us": "צור קשר",
    "About Us": "אודותינו",
    "About us": "אודותינו",
    "Home": "בית",
    "Overview": "סקירה",
    "Our Product": "המוצרים שלנו",
    "Products": "מוצרים",
    "Product": "מוצר",
    "News & Activity": "חדשות ופעילות",
    "News": "חדשות",
    "Career": "קריירה",
    "Careers": "קריירה",
    "Read more": "קראו עוד",
    "Read More": "קראו עוד",
    "View all": "הצג הכל",
    "View All": "הצג הכל",
    "More": "עוד",
    "View Details": "פרטים",
    "Previous": "הקודם",
    "Next": "הבא",
    "First": "ראשון",
    "Last": "אחרון",
    "Share": "שתף",
    "Like": "אהבתי",
    "Comment": "תגובה",
    "Comments": "תגובות",
    "Name": "שם",
    "Email": "אימייל",
    "Phone": "טלפון",
    "Subject": "נושא",
    "Message": "הודעה",
    "Address": "כתובת",
    "Required": "חובה",
    "Please fill in all required fields": "אנא מלאו את כל שדות החובה",
    "Thank you": "תודה",
    "Thank You": "תודה",
    "Add to Cart": "הוסף לעגלה",
    "Buy Now": "קנה עכשיו",
    "Price": "מחיר",
    "Quantity": "כמות",
    "Total": "סה״כ",
    "In Stock": "במלאי",
    "Out of Stock": "אזל מהמלאי",
    "Loading...": "טוען…",
    "Loading": "טוען",
    "Please wait": "אנא המתינו",
    "Error": "שגיאה",
    "Success": "הצלחה",
    "Powered by": "מופעל ע״י",
    "All rights reserved": "כל הזכויות שמורות",
    "Copyright": "זכויות יוצרים",
    "Terms": "תנאים",
    "Privacy": "פרטיות",
    "Sitemap": "מפת האתר",
    "Follow us": "עקבו אחרינו",
    "Follow Us": "עקבו אחרינו",
}
for k, v in EXTRA.items():
    translations.setdefault(k, v)

(ROOT / "_translations.json").write_text(json.dumps(translations, indent=2, ensure_ascii=False))
print(f"Dict size (with UI additions): {len(translations)}")

# Build pair list — longest first, normalize whitespace
NBSP_RE = re.compile(r'\xa0')
WS_RE = re.compile(r'[ \t]+')

def normalize_ws(s):
    s = NBSP_RE.sub(' ', s)
    s = WS_RE.sub(' ', s)
    return s

SHORT_WORD_RE_CACHE = {}
def is_short_common_word(k):
    return len(k) < 10 and ' ' not in k and k.replace("'", '').isalpha()

def make_wb_regex(w):
    if w not in SHORT_WORD_RE_CACHE:
        SHORT_WORD_RE_CACHE[w] = re.compile(r'(?<![A-Za-z])' + re.escape(w) + r'(?![A-Za-z])')
    return SHORT_WORD_RE_CACHE[w]

pairs = []
for k, v in translations.items():
    if not v or v == k: continue
    pairs.append((k, normalize_ws(k), v))
pairs.sort(key=lambda x: -len(x[1]))
print(f"Translation pairs (en→he, excluding same-as-source): {len(pairs)}")

def apply_pairs(text):
    lead = ''
    trail = ''
    m = re.match(r'^(\s*)(.*?)(\s*)$', text, re.DOTALL)
    if m:
        lead, core, trail = m.group(1), m.group(2), m.group(3)
    else:
        core = text
    core_norm = normalize_ws(core)
    total = 0
    for _, en_norm, he in pairs:
        if is_short_common_word(en_norm):
            new, n = make_wb_regex(en_norm).subn(he, core_norm)
            if n:
                core_norm = new; total += n
        else:
            if en_norm in core_norm:
                n = core_norm.count(en_norm)
                core_norm = core_norm.replace(en_norm, he)
                total += n
    return lead + core_norm + trail, total

RTL_HEAD = """
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700;900&family=Heebo:wght@300;400;500;600;700;800;900&display=swap">
<style id="he-rtl-override">
  html, body { direction: rtl !important; }
  *, *::before, *::after {
    font-family: 'Heebo', 'Assistant', -apple-system, 'Segoe UI', Arial, sans-serif !important;
  }
  h1, h2, h3, h4 {
    font-family: 'Frank Ruhl Libre', 'Heebo', Georgia, serif !important;
    font-weight: 500 !important;
    letter-spacing: 0 !important;
  }
  body, body p, body li, body span, body td, body div, body a, body button, body label, body input, body textarea {
    font-weight: 400;
  }
  [lang="en"], .ltr-isolate { direction: ltr; unicode-bidi: isolate; }
  html, body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
</style>
"""

SKIP_PARENTS = {"script", "style", "noscript"}
TRANS_ATTRS = {"alt", "title", "placeholder", "aria-label"}
INPUT_VIS = {"submit", "button", "reset"}

PAGE_FILES = sorted(p.name for p in ROOT.glob("*.html"))
total_tx = 0

for fn in PAGE_FILES:
    p = ROOT / fn
    raw = p.read_text(encoding="utf-8")
    soup = BeautifulSoup(raw, "html.parser")
    if soup.html:
        soup.html["lang"] = "he"
        soup.html["dir"] = "rtl"
    count = 0
    for node in list(soup.find_all(string=True)):
        if isinstance(node, Comment): continue
        par = node.parent
        skip = False
        while par is not None:
            if getattr(par, "name", None) in SKIP_PARENTS:
                skip = True; break
            par = par.parent
        if skip: continue
        s = str(node)
        new, c = apply_pairs(s)
        if c or new != s:
            node.replace_with(NavigableString(new))
            count += max(c, 1 if new != s else 0)
    for tag in soup.find_all(True):
        for attr in TRANS_ATTRS:
            v = tag.get(attr)
            if isinstance(v, str):
                new, c = apply_pairs(v)
                if c:
                    tag[attr] = new; count += c
        if tag.name == "input" and tag.get("type", "").lower() in INPUT_VIS:
            v = tag.get("value")
            if isinstance(v, str):
                new, c = apply_pairs(v)
                if c:
                    tag["value"] = new; count += c
        if tag.name == "meta":
            prop = (tag.get("property") or tag.get("name") or "").lower()
            if any(x in prop for x in ["title", "description", "image:alt"]):
                v = tag.get("content")
                if isinstance(v, str):
                    new, c = apply_pairs(v)
                    if c:
                        tag["content"] = new; count += c
    head = soup.head
    if head and not head.find("style", {"id": "he-rtl-override"}):
        frag = BeautifulSoup(RTL_HEAD, "html.parser")
        for child in list(frag.contents):
            head.append(child)
    p.write_text(str(soup), encoding="utf-8")
    print(f"  {fn}: {count} translations")
    total_tx += count

print(f"\nTOTAL translations: {total_tx}")
