import { create } from 'zustand';
import type { Ingredient } from '../shared/types';

interface IngredientStore {
  ingredients: Ingredient[];
  setIngredients: (ingredients: Ingredient[]) => void;
  updateIngredientPrice: (id: string, newPrice: number) => void;
  markIngredientInactive: (id: string) => void;
}

const dummyIngredients: Ingredient[] = [
  {
    id: 'ing-001',
    name: 'Bawang Merah',
    unit: 'g',
    pricePerUnit: 35,
    lastUpdated: '2024-11-01T08:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-002',
    name: 'Bawang Putih',
    unit: 'g',
    pricePerUnit: 28,
    lastUpdated: '2024-11-01T08:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-003',
    name: 'Cabai Merah',
    unit: 'g',
    pricePerUnit: 45,
    lastUpdated: '2024-11-10T09:30:00Z',
    isActive: true,
  },
  {
    id: 'ing-004',
    name: 'Tomat',
    unit: 'g',
    pricePerUnit: 12,
    lastUpdated: '2024-10-28T10:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-005',
    name: 'Ayam Potong',
    unit: 'kg',
    pricePerUnit: 38000,
    lastUpdated: '2024-11-12T07:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-006',
    name: 'Tepung Terigu',
    unit: 'g',
    pricePerUnit: 10,
    lastUpdated: '2024-10-15T08:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-007',
    name: 'Gula Pasir',
    unit: 'g',
    pricePerUnit: 14,
    lastUpdated: '2024-10-20T08:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-008',
    name: 'Garam',
    unit: 'g',
    pricePerUnit: 5,
    lastUpdated: '2024-09-01T08:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-009',
    name: 'Minyak Goreng',
    unit: 'ml',
    pricePerUnit: 18,
    lastUpdated: '2024-11-05T08:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-010',
    name: 'Telur Ayam',
    unit: 'butir',
    pricePerUnit: 2500,
    lastUpdated: '2024-11-08T08:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-011',
    name: 'Santan Kara',
    unit: 'ml',
    pricePerUnit: 20,
    lastUpdated: '2024-10-30T10:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-012',
    name: 'Kemiri',
    unit: 'butir',
    pricePerUnit: 1200,
    lastUpdated: '2024-10-10T08:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-013',
    name: 'Lengkuas',
    unit: 'g',
    pricePerUnit: 8,
    lastUpdated: '2024-10-25T08:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-014',
    name: 'Daun Salam',
    unit: 'lembar',
    pricePerUnit: 500,
    lastUpdated: '2024-11-01T08:00:00Z',
    isActive: true,
  },
  {
    id: 'ing-015',
    name: 'Kencur',
    unit: 'g',
    pricePerUnit: 30,
    lastUpdated: '2024-11-03T08:00:00Z',
    isActive: true,
  },
];

export const useIngredientStore = create<IngredientStore>((set) => ({
  ingredients: dummyIngredients,

  setIngredients: (ingredients) => set({ ingredients }),

  updateIngredientPrice: (id, newPrice) =>
    set((state) => ({
      ingredients: state.ingredients.map((ing) =>
        ing.id === id
          ? { ...ing, pricePerUnit: newPrice, lastUpdated: new Date().toISOString() }
          : ing
      ),
    })),

  markIngredientInactive: (id) =>
    set((state) => ({
      ingredients: state.ingredients.map((ing) =>
        ing.id === id ? { ...ing, isActive: false } : ing
      ),
    })),
}));
