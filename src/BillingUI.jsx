import React, { useState } from 'react';
import { useInventoryStore } from './store/useInventoryStore';
import { Search, ShoppingBag } from 'lucide-react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import KhataView from './components/KhataView';
import SalesHistoryView from './components/SalesHistoryView';
import CartModal from './components/CartModal';
import InventoryModal from './components/InventoryModal';

export default function BillingUI() {
  const store = useInventoryStore();
  const products = store?.products || [];
  const cart = store?.cart || [];
  const khata = store?.khata || [];
  const addToCart = store?.addToCart;
  const updateCartQuantity = store?.updateCartQuantity;
  const removeFromCart = store?.removeFromCart;
  const clearCart = store?.clearCart;
  const addKhataEntry = store?.addKhataEntry;

  const [activeTab, setActiveTab] = useState('pos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  const categories = ['ALL', 'RATION', 'CLEANING', 'GENERAL'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || p.category?.toUpperCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalBill = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-[#f3f2f1] text-[#11100f] pb-24 font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        khataCount={khata.length}
        onOpenInventory={() => setIsInventoryOpen(true)}
      />

      {activeTab === 'pos' && (
        <div className="p-3 max-w-2xl mx-auto space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a19f9d]" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold shrink-0 transition ${
                  selectedCategory === cat
                    ? 'bg-[#0078d4] text-white'
                    : 'bg-white text-[#605e5c] border border-[#e1dfdd]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'khata' && <KhataView khata={khata} />}

      {activeTab === 'history' && <SalesHistoryView />}

      {activeTab === 'pos' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e1dfdd] p-3 z-30 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#605e5c] block font-bold uppercase">Total Bill</span>
              <span className="text-sm font-black text-[#11100f]">Rs {totalBill}</span>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-[#0078d4] active:bg-[#005a9e] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs"
            >
              <ShoppingBag size={16} />
              <span>View Cart ({cart.reduce((s, i) => s + (i.quantity || 1), 0)})</span>
            </button>
          </div>
        </div>
      )}

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        totalBill={totalBill}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        addKhataEntry={addKhataEntry}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
      />
    </div>
  );
}
