import React, { useState } from 'react';
import { Sparkles, Search, ArrowUpRight, TrendingDown, ShoppingBag, ShieldCheck, Heart, Bell } from 'lucide-react';
import { Currency, ScreenId, Product } from '../types';
import { formatPrice } from '../data/mockData';

interface HomeScreenProps {
  currency: Currency;
  remainingBudgetZar: number;
  totalBudgetZar: number;
  spentBudgetZar: number;
  onNavigate: (screen: ScreenId, query?: string, budget?: number) => void;
  featuredProducts: Product[];
  onToggleTrack: (product: Product) => void;
  trackedProductIds: Set<string>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currency,
  remainingBudgetZar,
  totalBudgetZar,
  onNavigate,
  featuredProducts,
  onToggleTrack,
  trackedProductIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxBudgetInput, setMaxBudgetInput] = useState('');

  const handleFindDeals = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = maxBudgetInput ? Number(maxBudgetInput) : undefined;
    onNavigate('search', searchQuery.trim(), budgetNum);
  };

  // Donut chart calculation
  const percentRemaining = Math.max(0, Math.min(100, Math.round((remainingBudgetZar / totalBudgetZar) * 100)));
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentRemaining / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* Top Hero & Monthly Budget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Hero Card */}
        <div className="lg:col-span-8 bg-linear-to-br from-[#f2f8f5] via-[#f7fbf9] to-[#ffffff] border border-emerald-100/70 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xs relative overflow-hidden">
          {/* Subtle decorative background blur glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10">
            {/* AI Powered Shopping Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf3d5] text-[#855302] text-xs font-semibold mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>AI Powered Shopping</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
              Shop Smarter, <br />
              <span className="text-[#135d38]">Not Harder.</span>
            </h1>

            {/* Subtext */}
            <p className="text-gray-600 text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
              Tell us what you need and your budget. SmartShopper AI will find the best student deals across South African retail stores instantly.
            </p>

            {/* Interactive Search & Budget Form */}
            <form
              onSubmit={handleFindDeals}
              className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-2xl border border-gray-200/80 shadow-sm max-w-xl"
              id="hero-deal-search-form"
            >
              {/* Optional Search Query */}
              <div className="flex-1 flex items-center px-3 w-full border-b sm:border-b-0 sm:border-r border-gray-100 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="What item? (e.g. Milk, Jacket, Shoes)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-hidden"
                />
              </div>

              {/* Set Max Budget */}
              <div className="flex items-center px-3 w-full sm:w-44 py-2">
                <span className="text-gray-400 font-semibold mr-1 text-sm">
                  {currency === 'ZAR' ? 'R' : '$'}
                </span>
                <input
                  type="number"
                  placeholder="Set max budget..."
                  value={maxBudgetInput}
                  onChange={(e) => setMaxBudgetInput(e.target.value)}
                  className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-hidden"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                id="hero-find-deals-button"
                className="w-full sm:w-auto bg-[#135d38] hover:bg-[#0f4d2e] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Find Deals</span>
              </button>
            </form>
          </div>

          {/* Quick Category Badges */}
          <div className="relative z-10 mt-8 pt-6 border-t border-emerald-100/60 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium mr-1">Popular in SA:</span>
            {[
              { label: 'Checkers Grocery Staples', q: 'staples', b: 300 },
              { label: 'Pick n Pay Dairy', q: 'milk bread eggs', b: 200 },
              { label: 'Takealot Tech Deals', q: 'tech cables', b: 400 },
              { label: 'Superbalist Sneakers', q: 'sneakers', b: 1500 },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => onNavigate('search', chip.q, chip.b)}
                className="text-xs bg-white hover:bg-emerald-50 text-gray-600 hover:text-emerald-800 border border-gray-200/60 rounded-full px-3 py-1 font-medium transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Monthly Budget Card (Matching Screenshot 1) */}
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Monthly Budget</h2>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                July 2026
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-8">You're on track this month.</p>

            {/* Circular Progress Ring */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e6edf0"
                    strokeWidth="9"
                    fill="transparent"
                  />
                  {/* Active Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#135d38"
                    strokeWidth="9"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-gray-900 leading-none">
                    {formatPrice(remainingBudgetZar, currency)}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">
                    Remaining
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-3 pt-6 border-t border-gray-100 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#135d38]"></span>
                <span className="text-gray-600 font-medium">Groceries</span>
              </div>
              <span className="font-bold text-gray-900">{formatPrice(1500, currency)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-gray-600 font-medium">Tech & Clothing</span>
              </div>
              <span className="font-bold text-gray-900">{formatPrice(1100, currency)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-gray-600 font-medium">Transport & Books</span>
              </div>
              <span className="font-bold text-gray-900">{formatPrice(1150, currency)}</span>
            </div>

            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full mt-4 text-center text-xs font-semibold text-[#135d38] hover:text-emerald-800 py-2 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer block"
            >
              View Full Budget Analytics →
            </button>
          </div>
        </div>
      </div>

      {/* Featured Deals & Price Drops Across SA Retail Stores */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
              Live Student Price Drops
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Verified daily deals across Checkers Sixty60, Pick n Pay, Woolworths & Takealot
            </p>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs font-semibold text-[#135d38] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Deals</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => {
            const isTracked = trackedProductIds.has(product.id);
            return (
              <div
                key={product.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Badges row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase tracking-wide">
                      {product.store}
                    </span>
                    {product.discountPercent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
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
                      title={isTracked ? 'Tracking item' : 'Track price drop'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isTracked ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Title & info */}
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1" title={product.title}>
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{product.unit || product.brand}</p>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-base text-gray-900">
                        {formatPrice(product.priceZar, currency)}
                      </span>
                      {product.originalPriceZar && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(product.originalPriceZar, currency)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleTrack(product)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      isTracked
                        ? 'bg-emerald-100 text-[#135d38] font-bold'
                        : 'bg-gray-100 hover:bg-[#135d38] hover:text-white text-gray-700'
                    }`}
                  >
                    <Bell className="w-3 h-3" />
                    <span>{isTracked ? 'Tracking' : 'Track'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grocery Basket Callout Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
            <span>Student Staple Basket Index</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Compare 10 Essential Groceries Across Checkers, PnP & Woolies
          </h3>
          <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl">
            See exactly which South African supermarket gives you the cheapest total cart for bread, milk, eggs, rice, chicken and coffee this week.
          </p>
        </div>
        <button
          onClick={() => onNavigate('pricewatch')}
          className="bg-white text-[#135d38] hover:bg-emerald-50 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-xs shrink-0 cursor-pointer"
        >
          View Basket Comparison →
        </button>
      </div>

      {/* Footer (Matching Screenshot 1) */}
      <footer className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© 2026 SmartShopper AI. Built for South African students.</p>
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate('pricewatch')} className="hover:text-gray-900 cursor-pointer">
            Student Resources
          </button>
          <button onClick={() => onNavigate('dashboard')} className="hover:text-gray-900 cursor-pointer">
            Budget Guides
          </button>
          <span className="hover:text-gray-900 cursor-pointer">Terms of Service</span>
          <span className="hover:text-gray-900 cursor-pointer">Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
};
