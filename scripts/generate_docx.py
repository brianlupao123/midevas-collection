import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()
    
    # Page setup - 0.75 in margins
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
        # Add Header & Footer
        footer = section.footer
        f_p = footer.paragraphs[0]
        f_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        f_run = f_p.add_run("Mideva's Collection — Owner Guide • WhatsApp: +254 748 094795")
        f_run.font.size = Pt(8.5)
        f_run.font.color.rgb = RGBColor(140, 140, 140)

    # Base styling
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(30, 41, 59)

    screenshots_dir = r"C:\Users\BRIAN LUPAO\Desktop\Midevas-Collection-Handover-Package\screenshots"

    # Title Banner Box (Table)
    banner_table = doc.add_table(rows=1, cols=1)
    banner_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    banner_table.autofit = False
    banner_table.columns[0].width = Inches(7.0)
    
    cell = banner_table.cell(0, 0)
    set_cell_background(cell, "92400E") # Warm Amber / Cinnamon
    set_cell_margins(cell, top=260, bottom=260, left=260, right=260)
    
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run_sub = p.add_run("OFFICIAL OWNER HANDBOOK • WHATSAPP EDITION\n")
    run_sub.font.size = Pt(9.5)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(254, 243, 199)
    
    run_title = p.add_run("🛍️ MIDEVA'S COLLECTION\nStore Owner Guide for Mona Lisa Mideva")
    run_title.font.size = Pt(20)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(255, 255, 255)

    doc.add_paragraph() # Spacing

    # Metadata Card
    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.columns[0].width = Inches(2.2)
    meta_table.columns[1].width = Inches(4.8)
    
    rows_data = [
        ("🌐 Public Storefront Link:", "https://midevas-collection.vercel.app"),
        ("🔒 Private Admin Dashboard:", "https://midevas-collection.vercel.app/#admin"),
        ("📱 WhatsApp Order Hotline:", "+254 748 094795 | EcoCash: 0774809479"),
        ("🔑 Secret Admin Passcode:", "mideva2026 (Email: monalisamideva@gmail.com)")
    ]
    
    for i, (k, v) in enumerate(rows_data):
        r_k = meta_table.cell(i, 0).paragraphs[0].add_run(k)
        r_k.bold = True
        r_k.font.size = Pt(10)
        set_cell_margins(meta_table.cell(i, 0), top=80, bottom=80, left=120, right=120)
        set_cell_background(meta_table.cell(i, 0), "F1F5F9")
        
        r_v = meta_table.cell(i, 1).paragraphs[0].add_run(v)
        r_v.font.size = Pt(10)
        if "http" in v or "2026" in v:
            r_v.bold = True
            r_v.font.color.rgb = RGBColor(180, 83, 9)
        set_cell_margins(meta_table.cell(i, 1), top=80, bottom=80, left=120, right=120)
        set_cell_background(meta_table.cell(i, 1), "FFFFFF")

    doc.add_paragraph()

    # Welcome Section
    h1 = doc.add_heading("🌟 Welcome, Mona Lisa!", level=1)
    h1.runs[0].font.color.rgb = RGBColor(180, 83, 9)

    doc.add_paragraph(
        "Welcome to your brand-new campus digital store! If you have never run a website before, "
        "do not worry at all. This system was custom-built to be as simple to use as WhatsApp and Instagram. "
        "You do not need any coding or computer science knowledge."
    )
    doc.add_paragraph(
        "This guide walks you through every single step with high-resolution visual screenshots: "
        "how to unlock your admin desk, how to receive and fulfill student orders, how to add new clothes "
        "or perfumes right from your phone camera, how to change prices, and how to do hostel delivery runs."
    )

    # Tip Box
    tip_table = doc.add_table(rows=1, cols=1)
    tip_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tip_table.columns[0].width = Inches(7.0)
    tip_cell = tip_table.cell(0, 0)
    set_cell_background(tip_cell, "FEF3C7")
    set_cell_margins(tip_cell, top=140, bottom=140, left=180, right=180)
    tip_p = tip_cell.paragraphs[0]
    tip_run = tip_p.add_run("💡 Pro Tip — Put Your Store on Your Phone Home Screen:\n")
    tip_run.bold = True
    tip_run.font.color.rgb = RGBColor(146, 64, 14)
    tip_body = tip_p.add_run(
        "1. Open https://midevas-collection.vercel.app on your phone in Chrome or Safari.\n"
        "2. Tap the browser Menu (three dots or Share button) and select 'Add to Home Screen'.\n"
        "3. An app icon named Mideva's will appear on your phone screen just like WhatsApp or TikTok!"
    )
    tip_body.font.size = Pt(9.5)

    doc.add_paragraph()

    # Chapter 1
    h2 = doc.add_heading("🔑 CHAPTER 1: How to Log Into Your Admin Workspace", level=1)
    h2.runs[0].font.color.rgb = RGBColor(180, 83, 9)

    doc.add_paragraph("You can manage your entire store from your smartphone or laptop at any time:")
    
    steps = [
        ("Step 1", "Open https://midevas-collection.vercel.app on your phone."),
        ("Step 2", "Tap the Sign In / Profile icon in the top header bar."),
        ("Step 3", "Select 'Store Staff & Admin Sign In'."),
        ("Step 4", "Enter Email: monalisamideva@gmail.com and Passcode: mideva2026"),
        ("Step 5", "Tap 'Unlock Workspace'. You are immediately in your master command dashboard!")
    ]
    for s_title, s_desc in steps:
        sp = doc.add_paragraph()
        sp.paragraph_format.left_indent = Inches(0.25)
        r_num = sp.add_run(f"• {s_title}: ")
        r_num.bold = True
        r_num.font.color.rgb = RGBColor(180, 83, 9)
        sp.add_run(s_desc)

    img_signin = os.path.join(screenshots_dir, "handover-13-admin-signin.png")
    if os.path.exists(img_signin):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        doc.add_picture(img_signin, width=Inches(5.5))
        p_cap = doc.add_paragraph("Figure 1: The Secure Admin Passcode Screen on Phone & Laptop")
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.runs[0].font.size = Pt(8.5)
        p_cap.runs[0].font.italic = True

    doc.add_paragraph()

    # Chapter 2
    h3 = doc.add_heading("🧭 CHAPTER 2: Tour of Your Storefront & Admin Dashboard", level=1)
    h3.runs[0].font.color.rgb = RGBColor(180, 83, 9)

    doc.add_paragraph("What students see when they visit your shop:")
    img_hero = os.path.join(screenshots_dir, "handover-01-storefront-hero.png")
    if os.path.exists(img_hero):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        doc.add_picture(img_hero, width=Inches(5.8))
        p_cap = doc.add_paragraph("Figure 2: The Modern Campus Storefront with Live Deals & Currency Switcher")
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.runs[0].font.size = Pt(8.5)
        p_cap.runs[0].font.italic = True

    doc.add_paragraph(
        "Your Master Admin workspace gives you complete control over orders, stock, and prices:"
    )
    img_admin = os.path.join(screenshots_dir, "handover-14-admin-dashboard.png")
    if os.path.exists(img_admin):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        doc.add_picture(img_admin, width=Inches(5.8))
        p_cap = doc.add_paragraph("Figure 3: Admin Command Strip and Performance Metrics")
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.runs[0].font.size = Pt(8.5)
        p_cap.runs[0].font.italic = True

    doc.add_paragraph()

    # Chapter 3: A Day in the Life
    h4 = doc.add_heading("☀️ CHAPTER 3: A Day in the Life — Your Daily Routine", level=1)
    h4.runs[0].font.color.rgb = RGBColor(180, 83, 9)

    doc.add_paragraph(
        "Here is the simple, stress-free routine you can follow every day to run your business like a pro:"
    )

    routines = [
        ("🌅 08:00 AM — Morning Routine: Open the Store & Post Flyer", 
         "1. Open https://midevas-collection.vercel.app/#admin on your phone.\n"
         "2. Check that the top status button is green: '🟢 Store Open for Orders'.\n"
         "3. Tap '🎨 Flyers', pick 2 hot items, and tap 'Download PNG Poster'.\n"
         "4. Share the poster to your WhatsApp Status with the link: https://midevas-collection.vercel.app\n"
         "5. Students start browsing and adding items to their bag!"),
        
        ("💬 12:00 PM — Daytime Routine: Receive Student Orders",
         "1. Students view products, pick sizes/colors, and tap 'Send Order via WhatsApp'.\n"
         "2. Your WhatsApp will buzz with an itemized message showing their name, hostel room number, items, and total price.\n"
         "3. Reply: 'Hi! Order received! I have both in stock. I will drop them off to your hostel at 4:30 PM.'\n"
         "4. All orders are automatically logged in your '📦 Orders & Quotes' tab!"),

        ("🚶‍♀️ 04:00 PM — Afternoon Routine: Hostel Delivery Run",
         "1. In your Admin dashboard, tap the status button to '🟡 Out on Delivery Run'.\n"
         "2. Tap '📋 WhatsApp Delivery Roster' — your complete packing and delivery checklist is instantly copied to your clipboard!\n"
         "3. Paste it in your personal WhatsApp chat, pack your tote bag, and walk to the hostels.\n"
         "4. Hand over the items, collect the cash or EcoCash/M-Pesa payment!"),

        ("🌙 08:00 PM — Evening Routine: Updating Stock & Resting",
         "1. In '📦 Orders & Quotes', mark delivered orders as 'Delivered' (or tap ⚡ Confirm All).\n"
         "2. In '📊 Live Stock & Pricing', reduce stock or set 0 for any item you sold out of.\n"
         "3. Switch the status button to '🔴 Store Closed' when you want to study or sleep peacefully.")
    ]

    for title, text in routines:
        p_t = doc.add_paragraph()
        r = p_t.add_run(title)
        r.bold = True
        r.font.size = Pt(12)
        r.font.color.rgb = RGBColor(15, 23, 42)
        
        p_body = doc.add_paragraph(text)
        p_body.paragraph_format.left_indent = Inches(0.25)

    # Cart & Orders Screenshots
    doc.add_paragraph("How student orders look when they add to cart:")
    img_cart = os.path.join(screenshots_dir, "handover-05-cart-drawer.png")
    if os.path.exists(img_cart):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        doc.add_picture(img_cart, width=Inches(5.5))
        p_cap = doc.add_paragraph("Figure 4: The WhatsApp Slide-Out Checkout Cart")
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.runs[0].font.size = Pt(8.5)
        p_cap.runs[0].font.italic = True

    img_orders = os.path.join(screenshots_dir, "handover-16-admin-orders.png")
    if os.path.exists(img_orders):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        doc.add_picture(img_orders, width=Inches(5.8))
        p_cap = doc.add_paragraph("Figure 5: The Orders & Hostel Delivery Manager")
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.runs[0].font.size = Pt(8.5)
        p_cap.runs[0].font.italic = True

    doc.add_paragraph()

    # Chapter 4: Step-by-Step Guides
    h5 = doc.add_heading("🛠️ CHAPTER 4: Step-by-Step 'How-To' Guides", level=1)
    h5.runs[0].font.color.rgb = RGBColor(180, 83, 9)

    guides = [
        ("Guide 1: How to Add a New Item with Your Phone Camera",
         "1. In your Admin, tap the '🛍️ Product Catalog' tab.\n"
         "2. Tap the blue '+ Add New Product' button.\n"
         "3. Type the product name, select category, and enter regular price + student price.\n"
         "4. Tap 'Upload Photo' -> your phone lets you snap a photo with your camera!\n"
         "5. Tap 'Save Product' — it goes live on your store instantly!"),

        ("Guide 2: How to Change Prices or Mark an Item 'Sold Out'",
         "1. Tap '📊 Live Stock & Pricing'.\n"
         "2. To change a price: Tap into the Reg ($) or Comrade ($) box, type the new price, and tap away — it saves automatically!\n"
         "3. To adjust stock: Tap [+1], [+5], or [-1] buttons.\n"
         "4. To mark Sold Out: Type 0 in the stock box. The website will immediately show a red 'Sold Out' badge so students cannot order it."),

        ("Guide 3: How to Edit the Moving Announcement at the Top",
         "1. Tap '🎨 CMS Content'.\n"
         "2. Under 'Top Announcement Ticker', edit the text (e.g. '🔥 WEEKEND SALE: FREE HOSTEL DROP-OFF TODAY!').\n"
         "3. Tap 'Save Announcement'. Refresh your store to see it scrolling across the top!"),

        ("Guide 4: How to Change Your Secret Admin Passcode",
         "1. Tap '👤 Profile & Security'.\n"
         "2. Enter your current passcode (default: mideva2026), type your new secret code, and confirm.\n"
         "3. Tap 'Update Passcode'. Only you will know the new passcode!")
    ]

    for g_title, g_desc in guides:
        p_g = doc.add_paragraph()
        r = p_g.add_run(g_title)
        r.bold = True
        r.font.size = Pt(11.5)
        r.font.color.rgb = RGBColor(180, 83, 9)
        p_gbody = doc.add_paragraph(g_desc)
        p_gbody.paragraph_format.left_indent = Inches(0.25)

    img_stock = os.path.join(screenshots_dir, "handover-15-admin-livestock.png")
    if os.path.exists(img_stock):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        doc.add_picture(img_stock, width=Inches(5.8))
        p_cap = doc.add_paragraph("Figure 6: Live Stock and Fast Price Steppers")
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.runs[0].font.size = Pt(8.5)
        p_cap.runs[0].font.italic = True

    doc.add_paragraph()

    # Chapter 5: FAQ
    h6 = doc.add_heading("❓ CHAPTER 5: Frequently Asked Questions (FAQ)", level=1)
    h6.runs[0].font.color.rgb = RGBColor(180, 83, 9)

    faqs = [
        ("Q: How do students pay me?",
         "A: Students pay via Cash on Hostel Delivery when you hand them their bag, or via EcoCash / M-Pesa to your phone number (+254 748 094795 / 0774809479). You collect the money directly!"),

        ("Q: Can a student see how much money I make or change my prices?",
         "A: Never! Student accounts are locked to customer mode only. Only you have the secret passcode to open the admin workspace."),

        ("Q: What if I make a mistake in a product price or name?",
         "A: Go to 'Product Catalog', tap the yellow 'Edit' button on that product, correct it, and tap 'Update'. It updates immediately."),

        ("Q: What if I accidentally mess up my catalog?",
         "A: There is a red button in 'Product Catalog' called 'Reset to Factory Catalog'. Tapping it safely restores all 52 original items with clean photos and prices.")
    ]

    for q, a in faqs:
        p_q = doc.add_paragraph()
        rq = p_q.add_run(q)
        rq.bold = True
        rq.font.color.rgb = RGBColor(15, 23, 42)
        p_a = doc.add_paragraph(a)
        p_a.paragraph_format.left_indent = Inches(0.25)

    doc.add_paragraph()

    # Cheat Sheet Table
    h7 = doc.add_heading("📋 CHAPTER 6: Quick Reference Pocket Cheat Sheet", level=1)
    h7.runs[0].font.color.rgb = RGBColor(180, 83, 9)

    cheat_table = doc.add_table(rows=8, cols=2)
    cheat_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cheat_table.columns[0].width = Inches(2.5)
    cheat_table.columns[1].width = Inches(4.5)

    cheat_data = [
        ("Public Store Website", "https://midevas-collection.vercel.app"),
        ("Admin Direct Link", "https://midevas-collection.vercel.app/#admin"),
        ("Admin Login Email", "monalisamideva@gmail.com"),
        ("Secret Admin Passcode", "mideva2026"),
        ("WhatsApp Order Hotline", "+254 748 094795"),
        ("EcoCash Merchant Line", "0774809479"),
        ("Default KSh Currency Rate", "130 KSh per 1 USD"),
        ("Default EcoCash ZiG Rate", "28 ZiG per 1 USD")
    ]

    for i, (k, v) in enumerate(cheat_data):
        c0 = cheat_table.cell(i, 0)
        c1 = cheat_table.cell(i, 1)
        
        rk = c0.paragraphs[0].add_run(k)
        rk.bold = True
        rk.font.size = Pt(9.5)
        set_cell_background(c0, "F8FAFC" if i % 2 == 0 else "FFFFFF")
        set_cell_margins(c0, top=70, bottom=70, left=100, right=100)

        rv = c1.paragraphs[0].add_run(v)
        rv.font.size = Pt(9.5)
        if "http" in v or "2026" in v:
            rv.bold = True
            rv.font.color.rgb = RGBColor(180, 83, 9)
        set_cell_background(c1, "F8FAFC" if i % 2 == 0 else "FFFFFF")
        set_cell_margins(c1, top=70, bottom=70, left=100, right=100)

    # Save to locations
    dest1 = r"C:\Users\BRIAN LUPAO\Desktop\Midevas-Collection-Handover-Package\Midevas_Collection_Owner_Guide.docx"
    dest2 = r"C:\Users\BRIAN LUPAO\Desktop\Midevas_Collection_Owner_Guide.docx"
    
    doc.save(dest1)
    doc.save(dest2)
    print(f"Successfully generated Word documents:\n1. {dest1}\n2. {dest2}")

if __name__ == "__main__":
    create_document()
