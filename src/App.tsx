import React, { useState } from 'react';
import { ScreenId, Currency, Product, ExpenseItem, UserProfile } from './types';
import { INITIAL_USER_PROFILE, INITIAL_PRODUCTS, INITIAL_EXPENSES } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { AssistantScreen } from './components/AssistantScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { GroceryWatchScreen } from './components/GroceryWatchScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { LogExpenseModal } from './components/LogExpenseModal';
import { NotificationsDrawer, AppNotification } from './components/NotificationsDrawer';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [currency, setCurrency] = useState<Currency>('ZAR');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [trackedProductIds, setTrackedProductIds] = useState<Set<string>>(
    new Set(['prod-sneakers-3', 'prod-groc-1', 'prod-clothing-1'])
  );

  // Search parameters when navigated from hero or header
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBudget, setSearchBudget] = useState<number | undefined>(undefined);

  // Modals & Drawers
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'price_drop',
      title: 'Checkers White Bread dropped by 20%',
      message: 'Albany Superior White Bread 700g is now R20.99 (was R25.99) at Campus Square.',
      timeAgo: '15m ago',
      read: false,
      savingsZar: 5.00,
      targetScreen: 'pricewatch',
    },
    {
      id: 'notif-2',
      type: 'deal_match',
      title: 'Winter Jacket Alert under R800',
      message: 'K-Way Elements Parka at Takealot dropped to R650 (28% off).',
      timeAgo: '2h ago',
      read: false,
      savingsZar: 249.00,
      targetScreen: 'search',
    },
    {
      id: 'notif-3',
      type: 'budget_warning',
      title: 'Monthly Budget Health Check',
      message: 'You have reached 75% of your July allowance with 15 days remaining.',
      timeAgo: '1d ago',
      read: true,
      targetScreen: 'dashboard',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Calculate live budget math
  const spentBudgetZar = expenses.reduce((sum, exp) => sum + exp.amountZar, 0);
  const remainingBudgetZar = Math.max(0, userProfile.monthlyBudgetZar - spentBudgetZar);

  // Navigation handlers
  const handleNavigate = (screen: ScreenId, query?: string, budget?: number) => {
    if (query !== undefined) setSearchQuery(query);
    if (budget !== undefined) setSearchBudget(budget);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setCurrentScreen('search');
  };

  const handleToggleTrack = (product: Product) => {
    setTrackedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast(`Removed "${product.title}" from price tracking`);
      } else {
        next.add(product.id);
        showToast(`Tracking price drops for "${product.title}"`);
        // Add notification
        const newNotif: AppNotification = {
          id: `notif-${Date.now()}`,
          type: 'price_drop',
          title: `Price Watch active: ${product.title}`,
          message: `We'll alert you if ${product.store} drops the price below R${product.priceZar}.`,
          timeAgo: 'Just now',
          read: false,
          targetScreen: 'pricewatch',
        };
        setNotifications((prevNotifs) => [newNotif, ...prevNotifs]);
      }
      return next;
    });
  };

  const handleAddExpense = (newExpense: ExpenseItem) => {
    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`Recorded expense: -R${newExpense.amountZar.toFixed(2)} (${newExpense.title})`);
  };

  const handleAddProducts = (newProds: Product[]) => {
    setProducts((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const filtered = newProds.filter((p) => !existingIds.has(p.id));
      return [...filtered, ...prev];
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Left Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        onSelectScreen={(screen) => handleNavigate(screen)}
        showProTip={currentScreen === 'search' || currentScreen === 'pricewatch'}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          currentScreen={currentScreen}
          currency={currency}
          remainingBudgetZar={remainingBudgetZar}
          onCurrencyToggle={(curr) => setCurrency(curr)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onSelectScreen={(screen) => handleNavigate(screen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleGlobalSearchSubmit}
          notificationCount={unreadCount}
          userName={userProfile.name}
        />

        {/* Screen Views */}
        <main className="flex-1 pb-16">
          {currentScreen === 'home' && (
            <HomeScreen
              currency={currency}
              remainingBudgetZar={remainingBudgetZar}
              totalBudgetZar={userProfile.monthlyBudgetZar}
              spentBudgetZar={spentBudgetZar}
              onNavigate={handleNavigate}
              featuredProducts={products}
              onToggleTrack={handleToggleTrack}
              trackedProductIds={trackedProductIds}
            />
          )}

          {currentScreen === 'search' && (
            <SearchScreen
              currency={currency}
              remainingBudgetZar={remainingBudgetZar}
              initialQuery={searchQuery}
              initialMaxBudget={searchBudget}
              products={products}
              onToggleTrack={handleToggleTrack}
              trackedProductIds={trackedProductIds}
              onAddProducts={handleAddProducts}
            />
          )}

          {currentScreen === 'assistant' && (
            <AssistantScreen
              currency={currency}
              remainingBudgetZar={remainingBudgetZar}
              onToggleTrack={handleToggleTrack}
              trackedProductIds={trackedProductIds}
            />
          )}

          {currentScreen === 'dashboard' && (
            <DashboardScreen
              currency={currency}
              userName={userProfile.name}
              totalBudgetZar={userProfile.monthlyBudgetZar}
              spentBudgetZar={spentBudgetZar}
              remainingBudgetZar={remainingBudgetZar}
              expenses={expenses}
              onOpenLogModal={() => setIsLogModalOpen(true)}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'pricewatch' && (
            <GroceryWatchScreen
              currency={currency}
              onToggleTrack={handleToggleTrack}
              trackedProductIds={trackedProductIds}
              priceDropProducts={products.filter((p) => p.category === 'Groceries')}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              profile={userProfile}
              onUpdateProfile={(updated) => {
                setUserProfile(updated);
                showToast('Budget settings updated successfully');
              }}
              currency={currency}
            />
          )}
        </main>
      </div>

      {/* Log Expense Modal */}
      <LogExpenseModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        currency={currency}
        onAddExpense={handleAddExpense}
      />

      {/* Notifications Flyout Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onClearAll={() => setNotifications([])}
        onNavigate={(screen) => handleNavigate(screen)}
        currency={currency}
      />

      {/* Toast Notification Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-gray-800 flex items-center gap-2.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
