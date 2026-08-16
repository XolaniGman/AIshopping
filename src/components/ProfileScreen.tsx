import React, { useState } from 'react';
import { User, School, Wallet, CreditCard, Bell, Shield, Check, Save } from 'lucide-react';
import { Currency, UserProfile } from '../types';
import { formatPrice } from '../data/mockData';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  currency: Currency;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  currency,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  const saUniversities = [
    'University of Cape Town (UCT)',
    'University of the Witwatersrand (Wits)',
    'University of Johannesburg (UJ)',
    'Stellenbosch University (Maties)',
    'University of Pretoria (Tuks)',
    'University of KwaZulu-Natal (UKZN)',
    'Rhodes University',
    'Nelson Mandela University',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const toggleLoyalty = (key: keyof UserProfile['loyaltyCards']) => {
    setFormData((prev) => ({
      ...prev,
      loyaltyCards: {
        ...prev.loyaltyCards,
        [key]: !prev.loyaltyCards[key],
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-[#135d38]" />
          Student Profile & Budget Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Customize your monthly budget limits, campus location, and retail loyalty programs.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Student Info Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <School className="w-5 h-5 text-[#135d38]" />
            Student & Campus Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Student Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:border-[#135d38] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Student Email (.ac.za)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:border-[#135d38] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-gray-700">South African University</label>
              <select
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:border-[#135d38] focus:outline-hidden cursor-pointer"
              >
                {saUniversities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Monthly Budget Settings Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#135d38]" />
            Monthly Budget Target
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Monthly Living & Grocery Allowance:</span>
              <span className="text-xl font-black text-gray-900">
                {formatPrice(formData.monthlyBudgetZar, currency)}
              </span>
            </div>

            <input
              type="range"
              min="1500"
              max="15000"
              step="250"
              value={formData.monthlyBudgetZar}
              onChange={(e) => setFormData({ ...formData, monthlyBudgetZar: Number(e.target.value) })}
              className="w-full accent-[#135d38] cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-gray-400 font-medium">
              <span>Min: R1,500</span>
              <span>Average Student: R5,000</span>
              <span>Max: R15,000</span>
            </div>
          </div>
        </div>

        {/* Loyalty Programs Integration */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#135d38]" />
            Connected South African Retail Rewards
          </h2>

          <p className="text-xs text-gray-500">
            SmartShopper AI automatically applies your card discounts and calculates points when finding deals.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                id: 'checkersXtra' as const,
                title: 'Checkers & Shoprite Xtra Savings',
                desc: 'Instant discount swipe at Sixty60 & in-store',
                color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
              },
              {
                id: 'pnpSmartShopper' as const,
                title: 'Pick n Pay Smart Shopper',
                desc: 'Earn cashback points & personalized 10% switches',
                color: 'bg-blue-50 text-blue-800 border-blue-200',
              },
              {
                id: 'wooliesWRewards' as const,
                title: 'Woolworths WRewards',
                desc: 'Tiered 10-20% discounts on green band items',
                color: 'bg-stone-50 text-stone-800 border-stone-200',
              },
              {
                id: 'sparRewards' as const,
                title: 'SPAR Rewards Card',
                desc: 'Instant till coupon redemption',
                color: 'bg-green-50 text-green-800 border-green-200',
              },
            ].map((loyalty) => {
              const active = formData.loyaltyCards[loyalty.id];
              return (
                <div
                  key={loyalty.id}
                  onClick={() => toggleLoyalty(loyalty.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                    active
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-gray-900">{loyalty.title}</h4>
                    <p className="text-[11px] text-gray-500">{loyalty.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      active ? 'bg-[#135d38] text-white' : 'border border-gray-300 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4" /> Changes saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="bg-[#135d38] hover:bg-[#0f4d2e] text-white px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
