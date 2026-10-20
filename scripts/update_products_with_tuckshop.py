import re

products_file = r"D:\Projects\midevas-collection\src\data\products.js"

with open(products_file, "r", encoding="utf-8") as f:
    content = f.read()

# Map product ID to real tuckshop local image path
replacements = {
    # Beauty & Personal
    'id: "bty-13"': ('image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/clere-men.jpg"'),
    'id: "bty-14"': ('image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/Hair_Remover.jpg"'),
    
    # Hygiene
    'id: "hyg-15"': ('image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/spads.webp"'),
    'id: "hyg-16"': ('image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/always-pads.jpg"'),
    'id: "hyg-17"': ('image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/tissue.jpg"'),
    'id: "hyg-19"': ('image: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/colgate.jpg"'),
    'id: "hyg-21"': ('image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/vaseline.jpg"'),
    'id: "hyg-22"': ('image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/lux.jpg"'),
    'id: "hyg-23"': ('image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/boom-powder.jpg"'),
    'id: "hyg-25"': ('image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/fun-n-fresh.jpg"'),

    # Snacks & Drinks
    'id: "snk-26"': ('image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/lays.jpg"'),
    'id: "snk-27"': ('image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/coke-500ml.jpg"'),
    'id: "snk-28"': ('image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/coke-2l.jpg"'),
    'id: "snk-29"': ('image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/mazoe.jpg"'),
    'id: "snk-30"': ('image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/minute-maid.jpg"'),
    'id: "snk-31"': ('image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/irish-biscuits.jpg"'),
    'id: "snk-32"': ('image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/maputi.jpg"'),
    'id: "snk-33"': ('image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/polony.jpg"'),

    # Groceries & Kitchen
    'id: "grc-34"': ('image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/sugar.jpg"'),
    'id: "grc-35"': ('image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/cerevita.jpg"'),
    'id: "grc-36"': ('image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/sun-jam.png"'),
    'id: "grc-37"': ('image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/tinned-fish.jpg"'),
    'id: "grc-38"': ('image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/beans.jpg"'),
    'id: "grc-39"': ('image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/ricoffy.jpg"'),
    'id: "grc-40"': ('image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/rooibos-tea.jpg"'),
    'id: "grc-41"': ('image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/mayonnaise.jpg"'),

    # Stationery
    'id: "stn-42"': ('image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/2-quire-book.jpg"'),
    'id: "stn-43"': ('image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/pen.jpg"'),
    'id: "stn-44"': ('image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/pen.jpg"'),
    'id: "stn-45"': ('image: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/pencils.jpg"'),
    'id: "stn-46"': ('image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/ruler.jpg"'),

    # Essentials
    'id: "ess-50"': ('image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/water.jpg"'),
    'id: "ess-51"': ('image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/panado.jpg"'),
    'id: "ess-52"': ('image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80"', 'image: "/tuckshop/shaving-razors.jpg"'),
}

count = 0
for pid_marker, (old_img, new_img) in replacements.items():
    idx = content.find(pid_marker)
    if idx != -1:
        # Search for old_img in the surrounding 500 characters
        block = content[idx:idx+600]
        if old_img in block:
            new_block = block.replace(old_img, new_img, 1)
            content = content[:idx] + new_block + content[idx+600:]
            count += 1
            print(f"[REPLACED] {pid_marker} -> {new_img}")
        else:
            print(f"[SKIP] Old image not in block for {pid_marker}")
    else:
        print(f"[NOT FOUND] {pid_marker}")

with open(products_file, "w", encoding="utf-8") as f:
    f.write(content)

print(f"\nSuccessfully updated {count} products in products.js with real Tuckshop images!")
