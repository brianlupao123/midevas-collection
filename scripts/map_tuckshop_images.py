import os
import re
import shutil

src_goods = r"C:\Users\BRIAN LUPAO\Desktop\latest working project\Tuckshop\goods"
src_images = r"C:\Users\BRIAN LUPAO\Desktop\latest working project\Tuckshop\images"
dest_dir = r"D:\Projects\midevas-collection\public\tuckshop"

os.makedirs(dest_dir, exist_ok=True)

# 1. Define clean normalized filenames and copy mapping
# Map product keywords to normalized image filenames
file_mapping = {
    "colgate": ("Colgate $1.jfif", "colgate.jpg"),
    "colgate_alt": ("Colgate.jpg", "colgate-triple.jpg"),
    "lays": ("Lays $0.5.jfif", "lays.jpg"),
    "mazoe": ("Mazoe $4.5.jfif", "mazoe.jpg"),
    "spads": ("Spads $0.5.webp", "spads.webp"),
    "sun_jam": ("Sun-Jam Sun Jam $1.5.png", "sun-jam.png"),
    "tinned_fish": ("Tinned Fish.jpg", "tinned-fish.jpg"),
    "coke_2l": ("Coke 2ltrs.jpg", "coke-2l.jpg"),
    "coke_can": ("Can Coke.jpg", "coke-can.jpg"),
    "coke_500ml": ("Cohe_500ml.jpg", "coke-500ml.jpg"),
    "coke_bottle": ("Coke.jpg", "coke.jpg"),
    "beans": ("Beans.jpg", "beans.jpg"),
    "bisco_biscuits": ("Bisco Biscuits.jpg", "bisco-biscuits.jpg"),
    "irish_biscuits": ("Irish Biscuits.jpg", "irish-biscuits.jpg"),
    "boom_liquid": ("Boom liquid.jpg", "boom-liquid.jpg"),
    "boom_powder": ("Boom Powder.jpg", "boom-powder.jpg"),
    "cascade": ("Cascade.jpg", "cascade.jpg"),
    "cerevita": ("Cerevita.jpg", "cerevita.jpg"),
    "clere_men": ("Clere_for_Men.jpg", "clere-men.jpg"),
    "coffee_break": ("Coffee Break.jpg", "coffee-break.jpg"),
    "cookies": ("Cookies.jpg", "cookies.jpg"),
    "dovi": ("Dovi.jpg", "dovi.jpg"),
    "fruto": ("Fruto.jpg", "fruto.jpg"),
    "fun_n_fresh": ("Fun_n_Fresh.jpg", "fun-n-fresh.jpg"),
    "happy_pads": ("Happy_Pads.jpg", "happy-pads.jpg"),
    "always_pads": ("Always Pads.jpg", "always-pads.jpg"),
    "always_pads_b": ("Always Pads (B).jpg", "always-pads-b.jpg"),
    "lux": ("Lux.jpg", "lux.jpg"),
    "mayonnaise": ("Mayonnaise.jpg", "mayonnaise.jpg"),
    "maputi": ("Kete_Maputi.jpg", "maputi.jpg"),
    "minute_maid": ("Minute_Maid_B.jpg", "minute-maid.jpg"),
    "panado": ("Panado.jpg", "panado.jpg"),
    "pen": ("Pen.jpg", "pen.jpg"),
    "pencils": ("Pencils.jpg", "pencils.jpg"),
    "ruler": ("Ruler.jpg", "ruler.jpg"),
    "polony": ("Polony.jpg", "polony.jpg"),
    "ricoffy": ("Ricofty.jpg", "ricoffy.jpg"),
    "rooibos_tea": ("Raibos_Tea.jpg", "rooibos-tea.jpg"),
    "sugar": ("Sugar.jpg", "sugar.jpg"),
    "tissue": ("Tissue.jpg", "tissue.jpg"),
    "vaseline": ("Vaseline.jpg", "vaseline.jpg"),
    "water": ("Water.jpg", "water.jpg"),
    "water_1": ("Water (1).jpg", "water-pure.jpg"),
    "two_quire": ("2 Quire book.jpg", "2-quire-book.jpg"),
    "shaving": ("Shaving_Stich.jpg", "shaving-razors.jpg"),
}

# Copy and rename cleanly
for key, (orig_name, clean_name) in file_mapping.items():
    found = False
    for folder in [src_goods, src_images]:
        sp = os.path.join(folder, orig_name)
        if os.path.exists(sp):
            dp = os.path.join(dest_dir, clean_name)
            shutil.copy2(sp, dp)
            found = True
            break
    if found:
        print(f"[OK] {orig_name} -> tuckshop/{clean_name}")
    else:
        print(f"[WARN] Not found: {orig_name}")

print("\nAll clean normalized Tuckshop images are ready in public/tuckshop/")
