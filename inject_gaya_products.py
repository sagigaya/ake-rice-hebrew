"""
Inject a 'GAYA Vacuum Rice' section into Ake products.html — showing
the 3 GAYA-branded vacuum-packed jasmine rice SKUs from the Gaya catalog.
"""
from pathlib import Path

GAYA_SECTION = '''
<!-- GAYA VACUUM RICE PRODUCTS — Hebrew market importer products -->
<div style="margin: 60px 0 40px; padding: 50px 30px; background: linear-gradient(135deg, #faf6ed 0%, #f0e9d6 100%); border-radius: 12px; border: 2px solid #c9a66b;">
  <div style="text-align: center; max-width: 1100px; margin: 0 auto;">
    <div style="display: inline-block; padding: 6px 20px; background: #8b6914; color: #fff; border-radius: 20px; font-size: 13px; letter-spacing: 1.5px; margin-bottom: 20px; font-family: 'Frank Ruhl Libre', 'Heebo', serif;">
      IMPORTED BY GAYA FOODS · ISRAEL
    </div>
    <h2 style="font-family: 'Frank Ruhl Libre', 'Heebo', Georgia, serif !important; font-size: 42px !important; color: #3d2817; margin: 0 0 15px; font-weight: 700; letter-spacing: 0.5px;">
      האורז של גאיה — יסמין בוואקום
    </h2>
    <p style="color: #5c4a2e; font-size: 18px; max-width: 700px; margin: 0 auto 45px; line-height: 1.7; font-family: 'Heebo', sans-serif !important;">
      גאיה פודס מייבאת לישראל את האורז התאילנדי של Ake Rice Mill ושותפיה
      — ארוז בשקיות וואקום, שומר על טריות וארומה לאורך זמן.
      שלוש אפשרויות לכל צורך של מטבח מקצועי.
    </p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-top: 30px;">

      <!-- G2009 — 2kg GAYA -->
      <div style="background: #fff; border-radius: 10px; padding: 25px; box-shadow: 0 4px 20px rgba(139, 105, 20, 0.15); transition: transform 0.3s;">
        <div style="height: 240px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; overflow: hidden;">
          <img src="/images/gaya-products/G2009-gaya-jasmine-vacuum-2kg.png" alt="אורז יסמין GAYA 2 ק״ג וואקום" style="max-height: 100%; max-width: 100%; object-fit: contain;">
        </div>
        <div style="font-size: 11px; color: #8b6914; letter-spacing: 1.5px; margin-bottom: 8px;">G2009 · GAYA</div>
        <h3 style="font-family: 'Frank Ruhl Libre', 'Heebo', serif !important; font-size: 22px !important; color: #3d2817; margin: 0 0 10px; font-weight: 600;">
          אורז יסמין<br>שקית וואקום
        </h3>
        <p style="color: #5c4a2e; font-size: 15px; line-height: 1.6; margin: 10px 0;">
          <strong>2 ק״ג</strong> · 100% הומאלי<br>
          מתאים גם למטבחים ביתיים ורוזטות מסעדה
        </p>
        <div style="display: inline-block; padding: 4px 12px; background: #e8d5a3; color: #5c4a2e; border-radius: 12px; font-size: 12px; margin-top: 8px;">
          כשר בד״צ לנדא
        </div>
      </div>

      <!-- G2008 — 5kg GAYA -->
      <div style="background: #fff; border-radius: 10px; padding: 25px; box-shadow: 0 4px 20px rgba(139, 105, 20, 0.15); position: relative;">
        <div style="position: absolute; top: 15px; left: 15px; background: #c9a66b; color: #fff; padding: 4px 10px; border-radius: 10px; font-size: 11px; font-weight: 700; letter-spacing: 1px;">
          הכי נמכר
        </div>
        <div style="height: 240px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; overflow: hidden;">
          <img src="/images/gaya-products/G2008-gaya-jasmine-vacuum-5kg.png" alt="אורז יסמין GAYA 5 ק״ג וואקום" style="max-height: 100%; max-width: 100%; object-fit: contain;">
        </div>
        <div style="font-size: 11px; color: #8b6914; letter-spacing: 1.5px; margin-bottom: 8px;">G2008 · GAYA</div>
        <h3 style="font-family: 'Frank Ruhl Libre', 'Heebo', serif !important; font-size: 22px !important; color: #3d2817; margin: 0 0 10px; font-weight: 600;">
          אורז יסמין<br>מבורר בוואקום
        </h3>
        <p style="color: #5c4a2e; font-size: 15px; line-height: 1.6; margin: 10px 0;">
          <strong>5 ק״ג</strong> · 100% הומאלי<br>
          אריזה מקצועית למסעדות ומטבחי מוסדות
        </p>
      </div>

      <!-- G2018 — Golden Calf -->
      <div style="background: #fff; border-radius: 10px; padding: 25px; box-shadow: 0 4px 20px rgba(139, 105, 20, 0.15);">
        <div style="height: 240px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; overflow: hidden;">
          <img src="/images/gaya-products/G2018-golden-calf-jasmine-vacuum-5kg.png" alt="אורז יסמין Golden Calf 5 ק״ג וואקום עדה חרדית" style="max-height: 100%; max-width: 100%; object-fit: contain;">
        </div>
        <div style="font-size: 11px; color: #8b6914; letter-spacing: 1.5px; margin-bottom: 8px;">G2018 · Golden Calf</div>
        <h3 style="font-family: 'Frank Ruhl Libre', 'Heebo', serif !important; font-size: 22px !important; color: #3d2817; margin: 0 0 10px; font-weight: 600;">
          אורז יסמין<br>100% וואקום
        </h3>
        <p style="color: #5c4a2e; font-size: 15px; line-height: 1.6; margin: 10px 0;">
          <strong>5 ק״ג</strong> · מותג Golden Calf<br>
          כשרות המחמירה ביותר במגזר
        </p>
        <div style="display: inline-block; padding: 4px 12px; background: #d4b56a; color: #3d2817; border-radius: 12px; font-size: 12px; font-weight: 600; margin-top: 8px;">
          כשר עדה החרדית
        </div>
      </div>

    </div>

    <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #c9a66b;">
      <p style="color: #5c4a2e; font-size: 15px; margin: 0 0 20px;">
        לפרטים, קטלוג מלא, ולהצעת מחיר למסעדתך או למטבח המוסדי
      </p>
      <a href="/contact.html" style="display: inline-block; padding: 14px 40px; background: #8b6914; color: #fff; text-decoration: none; border-radius: 30px; font-family: 'Heebo', sans-serif !important; font-weight: 600; letter-spacing: 1px; font-size: 15px;">
        צור קשר עם גאיה פודס
      </a>
    </div>
  </div>
</div>
'''

p = Path("/Users/sagie/Desktop/ake-rice-hebrew/products.html")
h = p.read_text(encoding="utf-8")

# Guard against re-injection
if 'GAYA VACUUM RICE PRODUCTS' in h:
    print("Already injected, skipping")
else:
    # Inject just before the first </section> (which closes the content area)
    import re
    # The first </section> around line 479 closes content; inject before it
    new_h = h.replace(
        '<p> </p>\n</div>\n</section>\n</div>',
        '<p> </p>\n' + GAYA_SECTION + '\n</div>\n</section>\n</div>',
        1
    )
    if new_h == h:
        # Fallback - find any </div>\n</section> pattern
        new_h = re.sub(
            r'(<p>\s*</p>\s*)(</div>\s*</section>\s*</div>)',
            r'\1' + GAYA_SECTION.replace('\\', '\\\\') + r'\n\2',
            h, count=1
        )
    p.write_text(new_h, encoding="utf-8")
    print(f"Injected {len(GAYA_SECTION)}B into products.html")
    print(f"File size: {len(h)} → {len(new_h)}")
