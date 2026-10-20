import re

path = r"D:\Projects\midevas-collection\src\components\AdminModal.jsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add imports
import_marker = "import { \n  getActiveUser,"
if import_marker not in content:
    import_marker = "import {\n  getActiveUser,"

library_import = """import MediaLibraryPickerModal from './MediaLibraryPickerModal';
import { 
  MEDIA_LIBRARY_PRESETS, 
  MEDIA_CATEGORIES 
} from '../data/mediaLibrary';
"""

if "MediaLibraryPickerModal" not in content:
    content = content.replace(import_marker, library_import + import_marker, 1)
    print("Added MediaLibraryPickerModal imports.")

# 2. Add state & handlers
state_marker = "const [editingProduct, setEditingProduct] = useState(null);"
library_state = """const [editingProduct, setEditingProduct] = useState(null);

  // Preset Media Library picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState('new'); // 'new' | 'edit'
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCat, setLibraryCat] = useState('all');
  const [libraryVisibleCount, setLibraryVisibleCount] = useState(60);

  const handleSelectLibraryPreset = (url) => {
    if (mediaPickerTarget === 'new') {
      setNewProdImg(url);
    } else if (mediaPickerTarget === 'edit' && editingProduct) {
      setEditingProduct((prev) => ({ ...prev, image: url }));
    }
    notifySuccess('Selected photo from preset library!');
  };

  const handleUsePresetForNewProduct = (preset) => {
    setNewProdImg(preset.url);
    const catMap = {
      bags: 'fashion',
      dresses: 'fashion',
      shoes: 'fashion',
      shirts: 'fashion',
      trousers: 'fashion',
      jeans: 'fashion',
      fashion: 'fashion',
      perfumes: 'beauty',
      hygiene: 'hygiene',
      groceries: 'groceries',
      snacks: 'snacks',
      stationery: 'stationery'
    };
    if (catMap[preset.category]) {
      setNewProdCat(catMap[preset.category]);
    }
    setNewProdName(preset.title);
    setShowAddProduct(true);
    setActiveTab('products');
    notifySuccess('Preset photo applied to new product draft!');
  };"""

if "mediaPickerOpen" not in content:
    content = content.replace(state_marker, library_state, 1)
    print("Added MediaPicker states and handlers.")

# 3. Add Tab in Admin Navigation
tab_marker = "{ id: 'products', label: 'Product Catalog', icon: Package, count: products.length },"
library_tab = """{ id: 'products', label: 'Product Catalog', icon: Package, count: products.length },
                  { id: 'library', label: '📸 Preset Photos', icon: Sparkles, count: MEDIA_LIBRARY_PRESETS.length },"""

if "{ id: 'library'" not in content:
    content = content.replace(tab_marker, library_tab, 1)
    print("Added Preset Photos tab to admin navigation.")

# 4. Update Edit Product Photo UI
edit_photo_old = """                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Upload Photo or Image Link</label>
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5 text-blue-600" />
                                <span>Upload File</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, 'edit')}
                                />
                              </label>
                              <input
                                type="url"
                                placeholder="Or paste image URL"
                                value={editingProduct.image}
                                onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
                              />
                            </div>
                          </div>"""

edit_photo_new = """                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Product Photo (Presets, Camera, or Link)</label>
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaPickerTarget('edit');
                                  setMediaPickerOpen(true);
                                }}
                                className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                                title="Pick from 420+ curated preset product photos"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Pick Preset ({MEDIA_LIBRARY_PRESETS.length})</span>
                              </button>
                              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5 text-blue-600" />
                                <span>Upload File</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, 'edit')}
                                />
                              </label>
                              <input
                                type="url"
                                placeholder="Or paste image URL"
                                value={editingProduct.image}
                                onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                className="flex-1 min-w-[130px] px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
                              />
                            </div>
                          </div>"""

if edit_photo_old in content:
    content = content.replace(edit_photo_old, edit_photo_new, 1)
    print("Updated Edit Product photo selection row.")
else:
    print("Warning: edit_photo_old pattern not matched directly.")

# 5. Update Add New Product Photo UI
add_photo_old = """                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Product Photo (Upload or Link)</label>
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5 text-amber-600" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, 'new')}
                                />
                              </label>
                              <input
                                type="url"
                                placeholder="Or paste image link"
                                value={newProdImg}
                                onChange={(e) => setNewProdImg(e.target.value)}
                                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 truncate"
                              />
                            </div>
                          </div>"""

add_photo_new = """                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Product Photo (Presets, Camera, or Link)</label>
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaPickerTarget('new');
                                  setMediaPickerOpen(true);
                                }}
                                className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                                title="Pick from 420+ curated preset product photos"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Pick Preset ({MEDIA_LIBRARY_PRESETS.length})</span>
                              </button>
                              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5 text-amber-600" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, 'new')}
                                />
                              </label>
                              <input
                                type="url"
                                placeholder="Or paste image link"
                                value={newProdImg}
                                onChange={(e) => setNewProdImg(e.target.value)}
                                className="flex-1 min-w-[130px] px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 truncate"
                              />
                            </div>
                          </div>"""

if add_photo_old in content:
    content = content.replace(add_photo_old, add_photo_new, 1)
    print("Updated Add New Product photo selection row.")
else:
    print("Warning: add_photo_old pattern not matched directly.")

# 6. Add Tab Panel for 'library'
panel_marker = "{/* TAB: WHATSAPP BOT AGENT & SIMULATOR         */}"
library_panel = """{/* ═══════════════════════════════════════════ */}
                {/* TAB: PRESET PRODUCT PHOTO LIBRARY          */}
                {/* ═══════════════════════════════════════════ */}
                {activeTab === 'library' && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-2xl border border-amber-200/80 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white">
                            Ready-To-Use Stock Library
                          </span>
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                            {MEDIA_LIBRARY_PRESETS.length} Curated High-Res Photos
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                          Preset Product Packaging Photos
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          Extracted from authentic product catalogs. Tap any photo to preview or click &quot;Use for New Product&quot; to launch a product in seconds!
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAddProduct(true);
                          setActiveTab('products');
                        }}
                        className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Go to Product Manager</span>
                      </button>
                    </div>

                    {/* Filter and Search */}
                    <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search preset library by keyword (e.g. 'handbag', 'dress', 'jeans', 'coke', 'perfume', 'pen')..."
                          value={librarySearch}
                          onChange={(e) => {
                            setLibrarySearch(e.target.value);
                            setLibraryVisibleCount(60);
                          }}
                          className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {librarySearch && (
                          <button
                            type="button"
                            onClick={() => setLibrarySearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                        {MEDIA_CATEGORIES.map((cat) => {
                          const isActive = libraryCat === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setLibraryCat(cat.id);
                                setLibraryVisibleCount(60);
                              }}
                              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                                isActive
                                  ? 'bg-amber-600 text-white shadow-sm'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              <span>{cat.label}</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                isActive ? 'bg-amber-800/40 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                              }`}>
                                {cat.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Presets Grid */}
                    {(() => {
                      let list = MEDIA_LIBRARY_PRESETS;
                      if (libraryCat !== 'all') {
                        list = list.filter((it) => it.category === libraryCat);
                      }
                      const q = librarySearch.trim().toLowerCase();
                      if (q) {
                        list = list.filter((it) => 
                          it.title.toLowerCase().includes(q) || 
                          it.category.toLowerCase().includes(q) ||
                          it.categoryLabel.toLowerCase().includes(q)
                        );
                      }

                      if (list.length === 0) {
                        return (
                          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-bold text-slate-600">No preset photos match your search.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                            <span>Showing {Math.min(libraryVisibleCount, list.length)} of {list.length} photos</span>
                            <span>Hosted locally in /public/library</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                            {list.slice(0, libraryVisibleCount).map((preset) => (
                              <div
                                key={preset.id}
                                className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between"
                              >
                                <div className="aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                                  <img
                                    src={preset.url}
                                    alt={preset.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900/70 text-white backdrop-blur-xs capitalize">
                                    {preset.category}
                                  </div>
                                </div>

                                <div className="p-2.5 flex flex-col justify-between flex-1 gap-2">
                                  <div>
                                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                      {preset.title}
                                    </h5>
                                    <p className="text-[10px] text-slate-400">
                                      {preset.width}x{preset.height} px
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleUsePresetForNewProduct(preset)}
                                    className="w-full py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold transition flex items-center justify-center gap-1 border border-amber-200 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Use For Product</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {libraryVisibleCount < list.length && (
                            <div className="text-center pt-4">
                              <button
                                type="button"
                                onClick={() => setLibraryVisibleCount((prev) => prev + 60)}
                                className="px-6 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 shadow-xs"
                              >
                                Load More Preset Photos ({list.length - libraryVisibleCount} remaining)
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                """

if "activeTab === 'library'" not in content:
    content = content.replace(panel_marker, library_panel + panel_marker, 1)
    print("Added Preset Photos tab panel content.")

# 7. Render MediaLibraryPickerModal before closing adminInnerContent
closing_marker = "    </div>\n  );\n\n  if (isPageView) {"
modal_render = """      {/* Preset Media Library Picker Modal */}
      <MediaLibraryPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleSelectLibraryPreset}
        currentImage={mediaPickerTarget === 'new' ? newProdImg : (editingProduct?.image || '')}
      />
"""

if "<MediaLibraryPickerModal" not in content:
    content = content.replace(closing_marker, modal_render + "\n" + closing_marker, 1)
    print("Added MediaLibraryPickerModal to adminInnerContent.")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("\nSuccessfully updated AdminModal.jsx with Media Preset Library!")
