import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],
  
  addToCart: (item) => {
    const currentCart = get().cart;
    const existingIndex = currentCart.findIndex((i) => i.id === item.id);

    if (existingIndex > -1) {
      const updated = [...currentCart];
      updated[existingIndex].quantity += 1;
      set({ cart: updated });
    } else {
      set({ cart: [...currentCart, { ...item, quantity: 1 }] });
    }
  },

  addLooseToCart: (item, looseQty) => {
    const currentCart = get().cart;
    const existingIndex = currentCart.findIndex((i) => i.id === item.id);

    if (existingIndex > -1) {
      const updated = [...currentCart];
      updated[existingIndex].quantity = Number((updated[existingIndex].quantity + looseQty).toFixed(3));
      set({ cart: updated });
    } else {
      set({ cart: [...currentCart, { ...item, quantity: Number(looseQty.toFixed(3)) }] });
    }
  },

  updateQuantity: (id, qty) => {
    if (qty <= 0) {
      get().removeFromCart(id);
      return;
    }
    const currentCart = get().cart;
    const updated = currentCart.map((item) =>
      item.id === id ? { ...item, quantity: Number(Number(qty).toFixed(3)) } : item
    );
    set({ cart: updated });
  },

  removeFromCart: (id) => {
    set({ cart: get().cart.filter((item) => item.id !== id) });
  },

  clearCart: () => set({ cart: [] }),

  getTotal: () => {
    return Math.round(
      get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
  },
}));
