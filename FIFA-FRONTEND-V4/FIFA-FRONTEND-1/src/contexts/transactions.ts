import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Transaction = {
  id: string;
  type: 'expense' | 'income';
  category: string;
  amount: number;
  description: string;
  date: Date;
};

interface TransactionsState {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteByCategory: (category: string) => void;
  initializeStore: () => void;
}

// Helper function to save transactions to AsyncStorage
const saveTransactions = async (transactions: Transaction[]) => {
  try {
    // Convert Date objects to strings for storage
    const transactionsToSave = transactions.map(t => ({
      ...t,
      date: t.date.toISOString() // Ensure date is properly serialized
    }));
    const jsonValue = JSON.stringify(transactionsToSave);
    await AsyncStorage.setItem('transactions', jsonValue);
  } catch (error) {
    console.error('Error saving transactions:', error);
    throw error; // Re-throw to handle in the component
  }
};

// Helper function to load transactions from AsyncStorage
const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactionsString = await AsyncStorage.getItem('transactions');
    if (transactionsString) {
      const parsed = JSON.parse(transactionsString);
      if (!Array.isArray(parsed)) {
        console.warn('Invalid transactions data format');
        return [];
      }
      // Safely convert date strings back to Date objects
      return parsed.map((t: any) => ({
        ...t,
        date: t.date ? new Date(t.date) : new Date(),
        amount: typeof t.amount === 'number' ? t.amount : 0
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

// Create and export the store with proper type
export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  
  // Add a new transaction
  addTransaction: async (t) => {
    try {
      const newTransaction = { 
        ...t, 
        id: nanoid(),
        date: new Date(t.date) // Ensure date is a fresh Date object
      };
      
      // Update local state optimistically
      set((state) => {
        const newTransactions = [...state.transactions, newTransaction];
        // Don't await here to keep the UI responsive
        saveTransactions(newTransactions).catch(console.error);
        return { transactions: newTransactions };
      });
      
      return true;
    } catch (error) {
      console.error('Error in addTransaction:', error);
      throw error;
    }
  },
  
  // Delete transactions by category
  deleteByCategory: async (category) => {
    try {
      set((state) => {
        const newTransactions = state.transactions.filter((tr) => tr.category !== category);
        // Don't await here to keep the UI responsive
        saveTransactions(newTransactions).catch(console.error);
        return { transactions: newTransactions };
      });
      return true;
    } catch (error) {
      console.error('Error in deleteByCategory:', error);
      throw error;
    }
  },
  
  // Initialize the store by loading transactions from AsyncStorage
  initializeStore: async () => {
    try {
      const transactions = await loadTransactions();
      set({ transactions });
      return true;
    } catch (error) {
      console.error('Error initializing store:', error);
      return false;
    }
  }
}));
