'use client';
import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { CartItem } from '@/types';
import { products } from '@/lib/catalog';

interface CartState {
  items: CartItem[]; isOpen: boolean; hydrated: boolean;
  open: () => void; close: () => void; toggle: () => void;
  add: (item: Omit<CartItem, 'id'>) => void;
  remove: (id: string) => void;
  update: (id: string, partial: Partial<Pick<CartItem, 'qty' | 'message'>>) => void;
  clear: () => void; count: () => number;
}
// Access storage lazily: SSR has no browser, and browsers can deny storage access.
const browserStorage: StateStorage = {
  getItem: name => {
    try { return typeof window === 'undefined' ? null : window.localStorage.getItem(name); }
    catch { return null; }
  },
  setItem: (name, value) => {
    try { if (typeof window !== 'undefined') window.localStorage.setItem(name, value); }
    catch { /* Keep the cart usable in memory when storage is blocked or full. */ }
  },
  removeItem: name => {
    try { if (typeof window !== 'undefined') window.localStorage.removeItem(name); }
    catch { /* Storage may be unavailable in private or restricted contexts. */ }
  }
};
function validItem(item: CartItem): boolean {
  const product = products.find(p => p._id === item?.productId);
  return !!product?.inStock && !!product.variants.some(v => v.id === item.variantId) && Number.isInteger(item.qty) && item.qty > 0 && item.qty <= 99 && (item.message === undefined || (typeof item.message === 'string' && item.message.length <= 180));
}
export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: [], isOpen: false, hydrated: false,
  open: () => set({ isOpen: true }), close: () => set({ isOpen: false }), toggle: () => set(s => ({ isOpen: !s.isOpen })),
  add: item => {
    if (!validItem(item as CartItem)) return;
    const existing = get().items.find(i => i.productId === item.productId && i.variantId === item.variantId && (i.message || '') === (item.message || ''));
    if (existing) set({ items: get().items.map(i => i.id === existing.id ? { ...i, qty: Math.min(99, i.qty + item.qty) } : i), isOpen: true });
    else if (get().items.length < 50) set({ items: [...get().items, { ...item, id: crypto.randomUUID() }], isOpen: true });
  },
  remove: id => set({ items: get().items.filter(i => i.id !== id) }),
  update: (id, partial) => set({ items: get().items.map(i => i.id === id ? { ...i, ...(partial.qty !== undefined ? { qty: Math.min(99, Math.max(1, Math.floor(partial.qty))) } : {}), ...(partial.message !== undefined ? { message: partial.message.slice(0, 180) } : {}) } : i) }),
  clear: () => set({ items: [] }), count: () => get().items.reduce((sum, i) => sum + i.qty, 0)
}), {
  name: 'petalo-cart-v1', version: 2, storage: createJSONStorage(() => browserStorage),
  skipHydration: true,
  partialize: state => ({ items: state.items }),
  migrate: persisted => ({ items: Array.isArray((persisted as { items?: CartItem[] })?.items) ? (persisted as { items: CartItem[] }).items.filter(validItem).map(i => ({ id: crypto.randomUUID(), productId: i.productId, variantId: i.variantId, qty: i.qty, message: i.message?.slice(0, 180) })) : [] }),
  merge: (persisted, current) => ({ ...current, items: Array.isArray((persisted as { items?: CartItem[] })?.items) ? (persisted as { items: CartItem[] }).items.filter(validItem).slice(0, 50).map(i => ({ ...i, id: typeof i.id === 'string' ? i.id : crypto.randomUUID() })) : [] }),
}));

export async function hydrateCart() {
  if (typeof window === 'undefined' || useCartStore.getState().hydrated) return;
  try {
    await useCartStore.persist.rehydrate();
  } finally {
    // Also release the loading state when saved JSON is invalid.
    useCartStore.setState({ hydrated: true });
  }
}
