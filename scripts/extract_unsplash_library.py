import os
import glob
import email
import io
import re
from PIL import Image

DOWNLOADS_DIR = r"C:\Users\BRIAN LUPAO\Downloads"
OUTPUT_BASE_DIR = r"D:\Projects\midevas-collection\public\library"
DATA_OUTPUT_FILE = r"D:\Projects\midevas-collection\src\data\mediaLibrary.js"

CATEGORY_MAP = [
    (r"Ladies' Bags", "bags", "Ladies' Bags & Handbags"),
    (r"Men Shoes", "shoes", "Men's & Unisex Shoes"),
    (r"Men Shirts", "shirts", "Men's Shirts & Tops"),
    (r"Men Trousers", "trousers", "Men's Trousers & Pants"),
    (r"Wide Leg Jeans", "jeans", "Jeans & Denim"),
    (r"Ladies Jeans", "jeans", "Jeans & Denim"),
    (r"500\+ Dress", "dresses", "Ladies' Dresses & Outfits"),
    (r"Men's Fashion", "fashion", "Men's Fashion & Outerwear"),
    (r"Men Clothe Collection", "fashion", "Men's Clothing Collection"),
    (r"Clothe Collection", "fashion", "Fashion & Clothing Collection"),
    (r"100\+ Clothing", "fashion", "General Clothing"),
    (r"Stationery & Study", "stationery", "Stationery & Study Supplies"),
    (r"Groceries & Kitchen", "groceries", "Groceries & Kitchen Essentials"),
    (r"Snacks & Drinks", "snacks", "Snacks & Refreshments"),
    (r"Hygiene & Care", "hygiene", "Hygiene & Personal Care"),
    (r"Perfumes & Beauty", "perfumes", "Perfumes & Beauty Care"),
]

def get_category_info(filename):
    for pattern, cat_key, cat_label in CATEGORY_MAP:
        if re.search(pattern, filename, re.IGNORECASE):
            return cat_key, cat_label
    return "general", "General Presets"

def extract_all():
    os.makedirs(OUTPUT_BASE_DIR, exist_ok=True)
    mhtml_files = glob.glob(os.path.join(DOWNLOADS_DIR, "*.mhtml"))
    print(f"Processing {len(mhtml_files)} MHTML archives...")

    library_items = []
    seen_hashes = set()
    category_counts = {}

    for fpath in sorted(mhtml_files):
        fname = os.path.basename(fpath)
        cat_key, cat_label = get_category_info(fname)
        cat_dir = os.path.join(OUTPUT_BASE_DIR, cat_key)
        os.makedirs(cat_dir, exist_ok=True)

        print(f"\nScanning: {fname} -> [{cat_key}]")
        try:
            with open(fpath, "rb") as f:
                msg = email.message_from_binary_file(f)
        except Exception as e:
            print(f"Error opening {fname}: {e}")
            continue

        item_index = 0
        for part in msg.walk():
            ctype = part.get_content_type()
            if not ctype.startswith("image/"):
                continue

            loc = part.get("Content-Location", "")
            # Filter out profile photos, avatars, tiny SVGs, tracking
            if any(term in loc.lower() for term in ["profile-", "avatar", "plus_", "favicon", ".svg"]):
                continue

            payload = part.get_payload(decode=True)
            if not payload or len(payload) < 8000: # Skip tiny images/thumbnails
                continue

            # Check if duplicate by hash
            img_hash = hash(payload[:1000] + payload[-1000:])
            if img_hash in seen_hashes:
                continue
            seen_hashes.add(img_hash)

            try:
                img = Image.open(io.BytesIO(payload))
                w, h = img.size
                if w < 220 or h < 220:
                    continue # Skip very small thumbnails

                # Convert to RGB if needed
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")

                # Resize if excessively large to keep bundle fast (max 800px)
                MAX_DIM = 800
                if max(w, h) > MAX_DIM:
                    scale = MAX_DIM / max(w, h)
                    img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)

                item_index += 1
                out_filename = f"{cat_key}_{item_index:02d}.webp"
                out_path = os.path.join(cat_dir, out_filename)

                # Save as lightweight high-efficiency webp
                img.save(out_path, format="WEBP", quality=82)

                rel_url = f"/library/{cat_key}/{out_filename}"
                item_id = f"lib-{cat_key}-{item_index:02d}"
                clean_title = f"{cat_label.split('&')[0].strip()} Preset {item_index}"

                library_items.append({
                    "id": item_id,
                    "title": clean_title,
                    "category": cat_key,
                    "categoryLabel": cat_label,
                    "url": rel_url,
                    "width": img.width,
                    "height": img.height,
                    "originalUrl": loc if loc.startswith("http") else ""
                })

                category_counts[cat_key] = category_counts.get(cat_key, 0) + 1

            except Exception as err:
                # Pillow could not decode or bad image part
                continue

        print(f" -> Extracted {item_index} valid product photos for '{cat_key}'")

    # Also handle standalone avif file: premium_photo-1679415150926-a22cda822350.avif
    avif_path = os.path.join(DOWNLOADS_DIR, "premium_photo-1679415150926-a22cda822350.avif")
    if os.path.exists(avif_path):
        try:
            img = Image.open(avif_path)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            out_filename = "fashion_premium_01.webp"
            out_path = os.path.join(OUTPUT_BASE_DIR, "fashion", out_filename)
            img.save(out_path, format="WEBP", quality=85)
            library_items.append({
                "id": "lib-fashion-premium-01",
                "title": "Premium Fashion Outfit Preset",
                "category": "fashion",
                "categoryLabel": "Fashion & Clothing Collection",
                "url": "/library/fashion/" + out_filename,
                "width": img.width,
                "height": img.height,
                "originalUrl": ""
            })
            category_counts["fashion"] = category_counts.get("fashion", 0) + 1
            print("Extracted standalone premium_photo AVIF -> /library/fashion/fashion_premium_01.webp")
        except Exception as e:
            print(f"Error handling standalone avif: {e}")

    print(f"\n==========================================")
    print(f"TOTAL PRESET IMAGES EXTRACTED: {len(library_items)}")
    print(f"Category Breakdown: {category_counts}")
    print(f"==========================================")

    # Generate mediaLibrary.js
    categories_meta = [
        {"id": "all", "label": "All Presets", "icon": "Sparkles"},
        {"id": "bags", "label": "Ladies' Bags", "icon": "ShoppingBag"},
        {"id": "dresses", "label": "Dresses & Outfits", "icon": "Sparkles"},
        {"id": "shoes", "label": "Shoes & Footwear", "icon": "Package"},
        {"id": "shirts", "label": "Shirts & Tops", "icon": "Layers"},
        {"id": "trousers", "label": "Trousers & Pants", "icon": "Layers"},
        {"id": "jeans", "label": "Jeans & Denim", "icon": "Layers"},
        {"id": "fashion", "label": "Men's & General Fashion", "icon": "Sparkles"},
        {"id": "perfumes", "label": "Perfumes & Beauty", "icon": "Star"},
        {"id": "hygiene", "label": "Hygiene & Personal Care", "icon": "Shield"},
        {"id": "groceries", "label": "Groceries & Kitchen", "icon": "Package"},
        {"id": "snacks", "label": "Snacks & Drinks", "icon": "ShoppingBag"},
        {"id": "stationery", "label": "Stationery & Study", "icon": "FileText"},
    ]

    for cat in categories_meta:
        if cat["id"] == "all":
            cat["count"] = len(library_items)
        else:
            cat["count"] = category_counts.get(cat["id"], 0)

    import json
    js_content = f"""// =========================================================================
// MIDEVA'S COLLECTION — PRESET MEDIA LIBRARY
// Extracted and categorized from authentic product catalogs
// Allows Monica to pick product photos directly from presets without code or manual URLs
// =========================================================================

export const MEDIA_CATEGORIES = {json.dumps(categories_meta, indent=2)};

export const MEDIA_LIBRARY_PRESETS = {json.dumps(library_items, indent=2)};

export function getMediaPresetsByCategory(category = 'all') {{
  if (!category || category === 'all') return MEDIA_LIBRARY_PRESETS;
  return MEDIA_LIBRARY_PRESETS.filter(item => item.category === category);
}}

export function searchMediaPresets(query = '', category = 'all') {{
  let list = getMediaPresetsByCategory(category);
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(item => 
    item.title.toLowerCase().includes(q) || 
    item.category.toLowerCase().includes(q) ||
    item.categoryLabel.toLowerCase().includes(q)
  );
}}
"""
    with open(DATA_OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"Saved media library index to: {DATA_OUTPUT_FILE}")

if __name__ == "__main__":
    extract_all()
