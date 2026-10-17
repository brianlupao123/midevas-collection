import React from 'react';
import ProductCard from './ProductCard';
import { PackageOpen, Sparkles } from 'lucide-react';

export default function ProductGrid({ products, onAddToCart, currency, onResetFilters }) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 max-w-lg mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No items found matching your filter</h3>
        <p className="text-sm text-slate-500 mb-6">
          Try clearing your search terms or picking another category like Men's Wear, Bags, or Perfumes.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          currency={currency}
        />
      ))}
    </div>
  );
}
