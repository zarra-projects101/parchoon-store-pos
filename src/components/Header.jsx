import React from 'react';
import { ShoppingBag, BookOpen, Package, History } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, khataCount, onOpenInventory }) {
  return (
    <div className="bg-white border-b border-[#e1dfdd] sticky top-0 z-30 px-3 py-2.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#0078d4] text-white rounded-lg flex items-center justify-center font-bold text-xs">
          POS
        </div>
        <div>
          <h1 className="font-bold text-sm leading-tight text-[#11100f]">Parchoon Store</h1>
          <p className="text-[10px] text-[#605e5c]">Counter — Karachi</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex bg-[#f3f2f1] p-1 rounded-lg border border-[#e1dfdd]">
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
              activeTab === 'pos' ? 'bg-white shadow-xs text-[#0078d4]' : 'text-[#605e5c]'
            }`}
          >
            <ShoppingBag size={13} /> Counter
          </button>

          <button
            onClick={() => setActiveTab('khata')}
            className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
              activeTab === 'khata' ? 'bg-white shadow-xs text-[#d13438]' : 'text-[#605e5c]'
            }`}
          >
            <BookOpen size={13} /> Khata ({khataCount})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
              activeTab === 'history' ? 'bg-white shadow-xs text-[#107c41]' : 'text-[#605e5c]'
            }`}
          >
            <History size={13} /> Sales
          </button>
        </div>

        <button
          onClick={onOpenInventory}
          className="p-2 text-[#605e5c] hover:text-[#0078d4] bg-[#f3f2f1] hover:bg-white border border-[#e1dfdd] rounded-lg transition"
          title="Manage Inventory"
        >
          <Package size={15} />
        </button>
      </div>
    </div>
  );
}
