import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  Package, 
  Layers, 
  Star, 
  Shield, 
  FileText,
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { MEDIA_CATEGORIES, MEDIA_LIBRARY_PRESETS } from '../data/mediaLibrary';

export default function MediaLibraryPickerModal({ isOpen, onClose, onSelect, currentImage = '' }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(48);

  // Filter presets based on category and search query
  const filteredPresets = useMemo(() => {
    let list = MEDIA_LIBRARY_PRESETS;
    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category === selectedCategory);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((item) => 
        item.title.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (preset) => {
    onSelect(preset.url);
    onClose();
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setVisibleCount(48);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-3 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Preset Product Media Library
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800">
                  {MEDIA_LIBRARY_PRESETS.length} Curated Photos
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any photo to instantly set it as the product packaging image
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by keyword (e.g. 'handbag', 'dress', 'jeans', 'perfume', 'coke', 'sugar', 'pen')..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(48);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {MEDIA_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-amber-800/40 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preset Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/40">
          {filteredPresets.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                No matching product photos found
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try searching with another word or pick another category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>
                  Showing {Math.min(visibleCount, filteredPresets.length)} of {filteredPresets.length} presets
                </span>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  Tap any image to select
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredPresets.slice(0, visibleCount).map((preset) => {
                  const isCurrent = currentImage === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelect(preset)}
                      className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 bg-white dark:bg-slate-800 ${
                        isCurrent
                          ? 'ring-2 ring-amber-500 border-amber-500 shadow-amber-500/20 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                        <img
                          src={preset.url}
                          alt={preset.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Selected Indicator */}
                        {isCurrent && (
                          <div className="absolute top-2 right-2 bg-amber-600 text-white rounded-full p-1 shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white rounded-lg text-[11px] font-bold shadow-sm">
                            Choose This Photo
                          </span>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-2 border-t border-slate-100 dark:border-slate-700/60">
                        <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {preset.title}
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[10px] text-slate-400 capitalize truncate">
                            {preset.category}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">
                            {preset.width}x{preset.height}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button if over visible count */}
              {visibleCount < filteredPresets.length && (
                <div className="pt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 48)}
                    className="px-6 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all"
                  >
                    Load More Presets ({filteredPresets.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Preset photos are hosted locally &mdash; zero external bandwidth costs</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-semibold rounded-lg text-slate-700 dark:text-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
