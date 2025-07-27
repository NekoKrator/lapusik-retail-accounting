import type { ExpenseItem } from '@/types/types';

export interface LocalStorageData {
  additionalBalances: number
  totalCashRegister: number;
  actualEveningBalance: string;
  expenseItems: ExpenseItem[];
  lastSaved: string;
  date: string;
}

const LOCAL_STORAGE_KEY = 'sales-page-draft';

export const saveDraft = (data: LocalStorageData) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Ошибка при сохранении в localStorage', e);
    return false;
  }
};

export const loadDraft = (): LocalStorageData | null => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const data: LocalStorageData = JSON.parse(raw);

    const today = new Date().toISOString().split('T')[0];
    if (data.date !== today) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return null;
    }

    return data;
  } catch (e) {
    console.error('Ошибка при загрузке из localStorage', e);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return null;
  }
};

export const clearDraft = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};