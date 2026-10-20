import subprocess
import os

cwd = r"D:\Projects\midevas-collection"

def run_cmd(cmd):
    print(f"\n>> {cmd}")
    res = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if res.stdout:
        print(res.stdout.strip()[:300])
    if res.stderr:
        print("STDERR:", res.stderr.strip()[:300])
    return res.returncode == 0

print("Step 1: Soft reset to unbundle the large commit...")
run_cmd("git reset --soft HEAD~1")
run_cmd("git reset")

print("\nStep 2: Commit core code and UI components first...")
run_cmd("git add src/data/mediaLibrary.js src/components/MediaLibraryPickerModal.jsx src/components/AdminModal.jsx handover/ scripts/")
run_cmd('git commit -m "feat(ui): add media preset library picker and admin preset browser"')
print("Pushing core code...")
run_cmd("git push origin master")

# Now commit library categories in small batches
library_cats = [
    ["bags", "dresses"],
    ["shoes", "shirts"],
    ["trousers", "jeans"],
    ["fashion"],
    ["perfumes", "hygiene"],
    ["groceries", "snacks", "stationery"]
]

for batch in library_cats:
    paths = " ".join([f"public/library/{cat}" for cat in batch])
    names = ", ".join(batch)
    print(f"\nStep: Staging and committing [{names}]...")
    run_cmd(f"git add {paths}")
    run_cmd(f'git commit -m "feat(assets): add preset photos for {names}"')
    print(f"Pushing [{names}]...")
    success = run_cmd("git push origin master")
    if not success:
        print(f"Retrying push for [{names}]...")
        run_cmd("git push origin master")

print("\nFinal Git Status:")
run_cmd("git status")
