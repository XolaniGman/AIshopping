import React from 'react';
import { Wallet, Sparkles, Plus, AlertTriangle, ArrowRight, Utensils, Bus, ShoppingBag, BookOpen, Laptop, Coffee } from 'lucide-react';
import { Currency, ScreenId, ExpenseItem } from '../types';
import { formatPrice } from '../data/mockData';

interface DashboardScreenProps {
  currency: Currency;
  userName: string;
  totalBudgetZar: number;
  spentBudgetZar: number;
  remainingBudgetZar: number;
  expenses: ExpenseItem[];
  onOpenLogModal: () => void;
  onNavigate: (screen: ScreenId, query?: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currency,
  userName,
  totalBudgetZar,
  spentBudgetZar,
  remainingBudgetZar,
  expenses,
  onOpenLogModal,
  onNavigate,
}) => {
  const percentSpent = Math.min(100, Math.round((spentBudgetZar / totalBudgetZar) * 100));

  // Category sums
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amountZar;
    return acc;
  }, {} as Record<string, number>);

  const categoryConfigs: Record<string, { color: string; barBg: string }> = {
    Groceries: { color: 'text-emerald-700', barBg: 'bg-[#135d38]' },
    Transport: { color: 'text-blue-700', barBg: 'bg-blue-600' },
    Clothing: { color: 'text-amber-700', barBg: 'bg-amber-500' },
    Textbooks: { color: 'text-purple-700', barBg: 'bg-purple-600' },
    Tech: { color: 'text-indigo-700', barBg: 'bg-indigo-600' },
    Entertainment: { color: 'text-rose-700', barBg: 'bg-rose-500' },
    Dining: { color: 'text-orange-700', barBg: 'bg-orange-500' },
  };

  const getExpenseIcon = (type: string) => {
    switch (type) {
      case 'dining':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      case 'transit':
        return <Bus className="w-4 h-4 text-blue-600" />;
      case 'clothing':
        return <ShoppingBag className="w-4 h-4 text-amber-600" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'tech':
        return <Laptop className="w-4 h-4 text-indigo-600" />;
      default:
        return <Coffee className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Top Welcome & Actions Header (Matching Screenshot 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Here is your financial overview for July 2026.
          </p>
        </div>

        <button
          onClick={onOpenLogModal}
          id="dashboard-log-expense-btn"
          className="bg-[#135d38] hover:bg-[#0f4d2e] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Expense</span>
        </button>
      </div>

      {/* Top 2 Cards: Budget Card & AI Insights Card (Matching Screenshot 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Available Budget Card */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Available for July
              </span>
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#135d38] flex items-center justify-center">
                <Wallet className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                {formatPrice(remainingBudgetZar, currency)}
              </span>
              <span className="text-sm font-semibold text-gray-500">left</span>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              Spent: <strong>{formatPrice(spentBudgetZar, currency)}</strong> / Total Budget:{' '}
              {formatPrice(totalBudgetZar, currency)}
            </p>

            {/* Segmented / Gradient Progress Bar */}
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6 flex">
              <div
                className="h-full bg-linear-to-r from-[#135d38] via-amber-500 to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${percentSpent}%` }}
              ></div>
            </div>
          </div>

          {/* Warning Note Banner (Matching Screenshot 4) */}
          <div className="bg-[#fff9ea] border border-amber-200/70 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="font-medium">
              You've used <strong>{percentSpent}%</strong> of your monthly budget. Slow down on 'Clothing'.
            </p>
          </div>
        </div>

        {/* Right AI Insights Card (Matching Screenshot 4) */}
        <div className="lg:col-span-5 bg-linear-to-br from-[#f2f8f5] to-white border border-emerald-100 rounded-3xl p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf3d5] text-[#855302] text-xs font-semibold mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>AI Insights</span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
              SmartShopper found a textbook alternative saving you {currency === 'ZAR' ? 'R350' : '$20'}.
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              Checkers Sixty60 and Pick n Pay are running 2-for-1 grocery specials on eggs and dairy this week near campus.
            </p>
          </div>

          <div className="pt-4 border-t border-emerald-100/80 flex items-center justify-between">
            <span className="text-[11px] text-emerald-800 font-semibold">2 new deals matched</span>
            <button
              onClick={() => onNavigate('search', 'textbooks')}
              className="px-4 py-2 bg-white hover:bg-emerald-50 border border-emerald-200 text-[#135d38] rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>Review Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 2 Cards: Spending by Category & Recent Purchases (Matching Screenshot 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Spending by Category Card */}
        <div className="lg:col-span-6 bg-white border border-gray-100 rounded-3xl p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">Spending by Category</h3>
            <span className="text-xs text-gray-400 font-medium">{expenses.length} transactions</span>
          </div>

          <div className="space-y-4">
            {(Object.entries(categoryTotals) as [string, number][]).map(([cat, total]) => {
              const config = categoryConfigs[cat] || { color: 'text-gray-700', barBg: 'bg-gray-600' };
              const categoryPercent = Math.min(100, Math.round(((total as number) / spentBudgetZar) * 100)) || 0;

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800">{cat}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-[11px]">{categoryPercent}%</span>
                      <span className="font-bold text-gray-900">{formatPrice(total, currency)}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${config.barBg} transition-all duration-500`}
                      style={{ width: `${categoryPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Purchases Card (Matching Screenshot 4) */}
        <div className="lg:col-span-6 bg-white border border-gray-100 rounded-3xl p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">Recent Purchases</h3>
            <button
              onClick={onOpenLogModal}
              className="text-xs font-semibold text-[#135d38] hover:underline cursor-pointer"
            >
              + Add Purchase
            </button>
          </div>

          <div className="space-y-3.5">
            {expenses.slice(0, 5).map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-2xs">
                    {getExpenseIcon(exp.iconType)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{exp.title}</h4>
                    <p className="text-[11px] text-gray-400">
                      {exp.store ? `${exp.store} • ` : ''}
                      {exp.formattedDate}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-gray-900">
                  -{formatPrice(exp.amountZar, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
