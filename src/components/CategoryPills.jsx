import React from 'react';
import { CATEGORIES } from '../data/products';
import { Sparkles, Shirt, ShoppingBag, Droplets, Package, Tag, Filter, Heart, Coffee, UtensilsCrossed, BookOpen } from 'lucide-react';

const ICON_MAP = {
  Sparkles,
  Shirt,
  ShoppingBag,
  Droplets,
  Package,
  Heart,
  Coffee,
  UtensilsCrossed,
  BookOpen
};

export default function CategoryPills({
  activeCategory,
  onSelectCategory,
  priceFilter,
  onSelectPriceFilter,
  comradeDealsOnly,
  onToggleComradeDeals,
  totalMatching
}) {
  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Sparkles;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-xs ${
                isActive
                  ? 'bg-amber-600 text-white shadow-amber-500/25 shadow-md scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-800 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-slate-400'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-filters Bar: Quick Price Range & Comrade Deals */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200/60 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Price Filter:
          </span>
          {[
            { id: 'all', label: 'All Prices' },
            { id: 'under-4', label: 'Under $4' },
            { id: 'under-5', label: 'Under $5' },
            { id: 'under-10', label: 'Under $10' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => onSelectPriceFilter(pill.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                priceFilter === pill.id
                  ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {pill.label}
            </button>
          ))}
          
          {/* Comrade Deals Toggle */}
          <button
            onClick={onToggleComradeDeals}
            className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
              comradeDealsOnly
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>🔥 Comrade Specials</span>
          </button>
        </div>

        {/* Count Indicator */}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing <span className="font-bold text-slate-900 dark:text-white">{totalMatching}</span> items
        </div>
      </div>
    </div>
  );
}
