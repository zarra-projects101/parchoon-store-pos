import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useInventoryStore = create(
  persist(
    (set, get) => ({
      products: [
        { id: '1', name: 'Chini (Sugar) 1kg', price: 150, category: 'RATION', image: null },
        { id: '2', name: 'Dal Chana 1kg', price: 280, category: 'RATION', image: null },
        { id: '3', name: 'Surf Excel 500g', price: 350, category: 'CLEANING', image: null },
      ],
      cart: [],
      khata: [],
      salesHistory: [],

      // Product actions
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, { ...product, id: Date.now().toString() }],
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // Cart actions
      addToCart: (product) =>
        set((state) => {
          const existingIndex = state.cart.findIndex((item) => item.id === product.id);
          if (existingIndex > -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingIndex].quantity += 1;
            return { cart: updatedCart };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      updateCartQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item.id !== id) };
          }
          return {
            cart: state.cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
          };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ cart: [] }),

      // Sales actions
      addSaleRecord: (sale) =>
        set((state) => ({
          salesHistory: [sale, ...state.salesHistory],
        })),

      // Khata actions
      addKhataEntry: (entry) =>
        set((state) => ({
          khata: [entry, ...state.khata],
        })),
      markKhataPaid: (id) =>
        set((state) => ({
          khata: state.khata.map((item) =>
            item.id === id ? { ...item, status: 'PAID' } : item
          ),
        })),
    }),
    {
      name: 'parchoon-store-storage',
    }
  )
);
