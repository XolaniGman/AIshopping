import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, Heart, Bell, Check, RotateCcw, ArrowRight, Loader2, ExternalLink } from 'lucide-react';
import { Currency, Product } from '../types';
import { formatPrice } from '../data/mockData';
import { searchRealtimePrices } from '../services/geminiService';

interface SearchScreenProps {
  currency: Currency;
  remainingBudgetZar: number;
  initialQuery?: string;
  initialMaxBudget?: number;
  products: Product[];
  onToggleTrack: (p: Product) => void;
  trackedProductIds: Set<string>;
  onAddProducts: (newProds: Product[]) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  currency,
  remainingBudgetZar,
  initialQuery = '',
  initialMaxBudget,
  products,
  onToggleTrack,
  trackedProductIds,
  onAddProducts,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>(initialMaxBudget || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'discount'>('relevance');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  const availableStores = [
    { name: 'Superbalist', code: 'S', color: 'bg-indigo-100 text-indigo-800' },
    { name: 'Takealot', code: 'T', color: 'bg-blue-100 text-blue-800' },
    { name: 'Checkers', code: 'C', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Pick n Pay', code: 'P', color: 'bg-sky-100 text-sky-800' },
    { name: 'Woolworths', code: 'W', color: 'bg-stone-100 text-stone-800' },
    { name: 'Shoprite', code: 'S', color: 'bg-red-100 text-red-800' },
    { name: 'SPAR', code: 'S', color: 'bg-green-100 text-green-800' },
    { name: 'Mr Price', code: 'M', color: 'bg-amber-100 text-amber-800' },
  ];

  const availableCategories = [
    'Groceries',
    'Footwear',
    'Clothing',
    'Tech',
    'Essentials',
  ];

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAiSearching(true);
    try {
      const res = await searchRealtimePrices({
        query: query.trim(),
        maxBudget: typeof maxPrice === 'number' ? maxPrice : undefined,
        storeFilter: selectedStores.length > 0 ? selectedStores : undefined,
      });

      if (res.results && res.results.length > 0) {
        onAddProducts(res.results);
      }
      if (res.summary || res.savingsTip) {
        setAiTip(res.savingsTip || res.summary || null);
      }
    } catch (err) {
      console.error('AI search failed', err);
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategories([]);
    setSelectedStores([]);
    setSortBy('relevance');
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleStore = (storeName: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeName) ? prev.filter((s) => s !== storeName) : [...prev, storeName]
    );
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Query match
        if (query.trim()) {
          const q = query.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchStore = p.store.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchCategory && !matchStore) return false;
        }

        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
          return false;
        }

        // Store filter
        if (selectedStores.length > 0 && !selectedStores.includes(p.store)) {
          return false;
        }

        // Price range
        if (minPrice !== '' && p.priceZar < Number(minPrice)) return false;
        if (maxPrice !== '' && p.priceZar > Number(maxPrice)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceZar - b.priceZar;
        if (sortBy === 'price-desc') return b.priceZar - a.priceZar;
        if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
        return 0;
      });
  }, [products, query, selectedCategories, selectedStores, minPrice, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Top Search Input Bar (Matching Screenshot 2) */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-3xl">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-4" />
          <input
            type="text"
            id="deals-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items across South African retail stores (e.g. sneakers, bread, milk, jacket)..."
            className="w-full bg-white text-gray-900 text-sm py-3.5 pl-12 pr-14 rounded-full border border-gray-200 focus:border-[#135d38] focus:ring-2 focus:ring-emerald-100 focus:outline-hidden shadow-xs transition-all"
          />
          <button
            type="submit"
            disabled={isAiSearching}
            className="absolute right-2 p-2.5 rounded-full bg-[#135d38] hover:bg-[#0f4d2e] text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            title="Search with Gemini AI"
          >
            {isAiSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {/* AI Grounding Tip banner if available */}
      {aiTip && (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900 shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-950">SmartShopper AI Retail Tip: </span>
            <span>{aiTip}</span>
          </div>
        </div>
      )}

      {/* 2-Column Layout: Filters Column & Product Grid Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Column (Matching Screenshot 2) */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />
              <h3 className="font-bold text-base text-gray-900">Filters</h3>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#135d38] hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Price Range</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 flex items-center">
                <span className="text-xs text-gray-400 mr-1 font-semibold">{currency === 'ZAR' ? 'R' : '$'}</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full text-xs text-gray-900 bg-transparent focus:outline-hidden"
                />
              </div>
              <span className="text-gray-400 text-xs">-</span>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 flex items-center">
                <span className="text-xs text-gray-400 mr-1 font-semibold">{currency === 'ZAR' ? 'R' : '$'}</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full text-xs text-gray-900 bg-transparent focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Category Checkboxes */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Category</h4>
            {availableCategories.map((cat) => {
              const isChecked = selectedCategories.includes(cat);
              const count = products.filter((p) => p.category === cat).length;
              return (
                <label
                  key={cat}
                  className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 rounded border-gray-300 text-[#135d38] focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className={isChecked ? 'font-semibold text-gray-900' : ''}>{cat}</span>
                  </div>
                  <span className="text-gray-400 text-[11px]">({count})</span>
                </label>
              );
            })}
          </div>

          {/* Store Checkboxes with Badges (Matching Screenshot 2) */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Store</h4>
            {availableStores.map((store) => {
              const isChecked = selectedStores.includes(store.name);
              return (
                <label
                  key={store.name}
                  className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleStore(store.name)}
                      className="w-4 h-4 rounded border-gray-300 text-[#135d38] focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className={isChecked ? 'font-semibold text-gray-900' : ''}>{store.name}</span>
                  </div>
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${store.color}`}
                  >
                    {store.code}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Pro Tip Card */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 text-xs text-emerald-950 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-[#135d38] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pro Tip</span>
            </div>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Set a price alert on items above your budget to get notified when they drop across Checkers, Pick n Pay, Woolworths, and Takealot.
            </p>
          </div>
        </div>

        {/* Right Results Grid Column */}
        <div className="lg:col-span-9 space-y-6">
          {/* Results Header with Title, Count, AI Quick Action, and Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight capitalize">
                {query.trim() || 'All Student Deals'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Showing {filteredProducts.length} results sorted by {sortBy}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* AI Quick Filter Pill */}
              <button
                type="button"
                onClick={() => {
                  setSortBy('price-asc');
                  if (!query) setQuery('staples');
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#135d38] text-xs font-semibold border border-emerald-200/60 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Find cheapest option</span>
              </button>

              {/* Sort Dropdown */}
              <select
                id="search-sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-hidden focus:border-[#135d38] cursor-pointer shadow-2xs"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          {/* Products Grid (Matching Screenshot 2) */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#135d38] mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No items match your exact filters</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Try widening your price range, clearing store filters, or click below to have Gemini search live South African retail stores online.
              </p>
              <button
                onClick={handleSearchSubmit}
                disabled={isAiSearching}
                className="bg-[#135d38] text-white px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                {isAiSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Search Live Retail Stores with Gemini</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isTracked = trackedProductIds.has(product.id);
                const fitsBudget = product.priceZar <= remainingBudgetZar;
                const budgetPercent = Math.min(100, Math.round((product.priceZar / remainingBudgetZar) * 100));

                return (
                  <div
                    key={product.id}
                    className={`bg-white border rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative ${
                      product.isGreatValue
                        ? 'border-emerald-300 ring-2 ring-emerald-100/50'
                        : 'border-gray-100'
                    }`}
                  >
                    {/* Top Value Banner (Matching Screenshot 2) */}
                    {product.isGreatValue && (
                      <div className="bg-[#e6f7ee] text-[#0f5431] text-[11px] font-bold px-3 py-1 -mx-4 -mt-4 mb-3 rounded-t-2xl flex items-center gap-1.5 border-b border-emerald-100">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Great value for your budget</span>
                      </div>
                    )}

                    <div>
                      {/* Store & Discount Badges Row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded bg-gray-100 text-gray-800 text-[10px] font-bold flex items-center justify-center">
                            {product.storeCode}
                          </span>
                          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                            {product.store}
                          </span>
                        </div>

                        {product.discountPercent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                            -{product.discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Product Image */}
                      <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-50 mb-3">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => onToggleTrack(product)}
                          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all cursor-pointer ${
                            isTracked
                              ? 'bg-red-50 text-red-500 shadow-xs'
                              : 'bg-white/80 backdrop-blur-xs text-gray-400 hover:text-red-500'
                          }`}
                          title="Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isTracked ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>

                      {/* Title & info */}
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1" title={product.title}>
                        {product.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">{product.unit || product.brand}</p>
                    </div>

                    {/* Price & Budget Indicator Bar */}
                    <div className="pt-3 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-black text-lg text-gray-900">
                              {formatPrice(product.priceZar, currency)}
                            </span>
                            {product.originalPriceZar && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(product.originalPriceZar, currency)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Track Button */}
                        <button
                          onClick={() => onToggleTrack(product)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isTracked
                              ? 'bg-emerald-100 text-[#135d38] font-bold'
                              : 'bg-gray-100 hover:bg-[#135d38] hover:text-white text-gray-700'
                          }`}
                        >
                          <Bell className="w-3 h-3" />
                          <span>{isTracked ? 'Tracking' : 'Track'}</span>
                        </button>
                      </div>

                      {/* "Fits budget" progress bar indicator */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              fitsBudget ? 'bg-[#135d38]' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, budgetPercent)}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 shrink-0">
                          {fitsBudget ? 'Fits budget' : 'Over budget'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          <div className="pt-6 text-center">
            <button
              onClick={handleSearchSubmit}
              disabled={isAiSearching}
              className="px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl shadow-2xs hover:shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAiSearching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#135d38]" />
                  <span>Searching South African retailers with Gemini AI...</span>
                </>
              ) : (
                <>
                  <span>Load More Results</span>
                  <span className="text-gray-400">▾</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
