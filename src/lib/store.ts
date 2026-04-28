import { create } from 'zustand';

export type StockHolding = {
  symbol: string;
  name: string;
  priceBought: number;
  quantity: number;
};

type AppState = {
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
};

export const useAppStore = create<AppState>((set) => ({
  totalBalance: 0,
  rdBalance: 0,
  totalWealth: 0,
  digitalCoins: 0,
  trustScore: 100,
  holdings: [],
  setBalances: (balance, rd, wealth) => set({ totalBalance: balance, rdBalance: rd, totalWealth: wealth }),
  setDigitalCoins: (coins) => set({ digitalCoins: coins }),
  setTrustScore: (score) => set({ trustScore: score }),
  setHoldings: (holdings) => set({ holdings }),
  addHolding: (holding) => set((state) => ({ holdings: [...state.holdings, holding] })),
}));
