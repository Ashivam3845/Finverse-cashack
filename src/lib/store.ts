import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StockHolding = {
  symbol: string;
  name: string;
  priceBought: number;
  quantity: number;
};

export type AuthUser = {
  name: string;
  email: string;
};

type AppState = {
  // Auth
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;

  // Financial State
  totalBalance: number;
  rdBalance: number;
  totalWealth: number;
  digitalCoins: number;
  trustScore: number;
  holdings: StockHolding[];
  setBalances: (balance: number, rd: number, wealth: number) => void;
  setDigitalCoins: (coins: number) => void;
  setTrustScore: (score: number) => void;
  setHoldings: (holdings: StockHolding[]) => void;
  addHolding: (holding: StockHolding) => void;
  resetFinancials: () => void;
};

const DEFAULT_BALANCE = 5000;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (user) => set({
        user,
        isAuthenticated: true,
        totalBalance: DEFAULT_BALANCE,
        rdBalance: 0,
        totalWealth: DEFAULT_BALANCE,
        digitalCoins: 0,
        trustScore: 100,
        holdings: [],
      }),
      logout: () => set({
        user: null,
        isAuthenticated: false,
        totalBalance: 0,
        rdBalance: 0,
        totalWealth: 0,
        digitalCoins: 0,
        holdings: [],
      }),

      // Financial State
      totalBalance: DEFAULT_BALANCE,
      rdBalance: 0,
      totalWealth: DEFAULT_BALANCE,
      digitalCoins: 0,
      trustScore: 100,
      holdings: [],
      setBalances: (balance, rd, wealth) => set({ totalBalance: balance, rdBalance: rd, totalWealth: wealth }),
      setDigitalCoins: (coins) => set({ digitalCoins: coins }),
      setTrustScore: (score) => set({ trustScore: score }),
      setHoldings: (holdings) => set({ holdings }),
      addHolding: (holding) => set((state) => ({ holdings: [...state.holdings, holding] })),
      resetFinancials: () => set({
        totalBalance: DEFAULT_BALANCE,
        rdBalance: 0,
        totalWealth: DEFAULT_BALANCE,
        digitalCoins: 0,
        holdings: [],
      }),
    }),
    {
      name: 'finflow-store', // localStorage key
    }
  )
);
