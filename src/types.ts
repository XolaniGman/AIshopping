export type Currency = 'ZAR' | 'USD';

export type ScreenId = 'home' | 'dashboard' | 'assistant' | 'search' | 'pricewatch' | 'profile';

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: 'Groceries' | 'Footwear' | 'Clothing' | 'Tech' | 'Essentials' | 'Snacks';
  store: 'Checkers' | 'Pick n Pay' | 'Woolworths' | 'Shoprite' | 'SPAR' | 'Takealot' | 'Superbalist' | 'Mr Price' | 'Makro' | 'Boxer';
  storeCode: 'C' | 'P' | 'W' | 'S' | 'T' | 'M' | 'B';
  priceZar: number;
  originalPriceZar?: number;
  discountPercent?: number;
  imageUrl: string;
  inStock: boolean;
  rating?: number;
  unit?: string;
  location?: string;
  distanceKm?: number;
  studentTag?: string;
  description?: string;
  isGreatValue?: boolean;
  tracked?: boolean;
  expiryNotice?: string;
}

export interface BasketComparison {
  staples: string[];
  retailers: {
    name: string;
    code: string;
    basketTotalZar: number;
    status: string;
    differenceZar: number;
    deliveryFeeZar: number;
    loyaltyProgram: string;
    highlights: string[];
    itemPrices: Record<string, number>;
  }[];
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'Groceries' | 'Transport' | 'Clothing' | 'Textbooks' | 'Tech' | 'Entertainment' | 'Dining';
  amountZar: number;
  date: string;
  formattedDate: string;
  iconType: 'dining' | 'transit' | 'clothing' | 'book' | 'tech' | 'grocery';
  store?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  products?: Product[];
  quickSuggestions?: string[];
  groundingSources?: { web?: { uri?: string; title?: string } }[];
}

export interface PriceAlert {
  id: string;
  productId: string;
  productTitle: string;
  store: string;
  targetPriceZar: number;
  currentPriceZar: number;
  alertDate: string;
  active: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  university: string;
  campus: string;
  currency: Currency;
  monthlyBudgetZar: number;
  loyaltyCards: {
    checkersXtra: boolean;
    pnpSmartShopper: boolean;
    wooliesWRewards: boolean;
    sparRewards: boolean;
  };
}
