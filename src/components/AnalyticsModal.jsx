import React from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { X, TrendingUp } from 'lucide-react';

export default function AnalyticsModal({ isOpen, onClose }) {
  const salesHistory = useInventoryStore((state) => state.salesHistory);

  if (!isOpen) return null;

  const totalSales = salesHistory.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalProfit = salesHistory.reduce((acc, s) => acc + s.profit, 0);
  const cashSales = salesHistory.filter(s => s.type === 'CASH').reduce((acc, s) => acc + s.totalAmount, 0);
  const khataSales = salesHistory.filter(s => s.type === 'KHATA').reduce((acc, s) => acc + s.totalAmount, 0);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3">
      <div className="bg-white border border-[#e1dfdd] rounded-lg w-full max-w-md p-4 relative shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-3 border-b border-[#e1dfdd] pb-2">
          <h2 className="text-sm font-semibold text-[#11100f] flex items-center gap-2">
            <TrendingUp size={16} className="text-[#107c41]" /> Daily Sales & Profit Summary
          </h2>
          <button onClick={onClose} className="text-[#605e5c] hover:text-[#11100f] p-1">
            <X size={18} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#faf9f8] p-2.5 rounded border border-[#e1dfdd]">
            <span className="text-[10px] text-[#605e5c] font-semibold block mb-0.5">Total Sales (Kul Bikri)</span>
            <span className="text-base font-bold text-[#11100f]">Rs {totalSales}</span>
          </div>
          <div className="bg-[#f2f9f5] p-2.5 rounded border border-[#bad8c7]">
            <span className="text-[10px] text-[#107c41] font-semibold block mb-0.5">Estimated Net Profit</span>
            <span className="text-base font-bold text-[#107c41]">Rs {totalProfit}</span>
          </div>
          <div className="bg-[#faf9f8] p-2.5 rounded border border-[#e1dfdd]">
            <span className="text-[10px] text-[#605e5c] font-semibold block mb-0.5">Cash in Counter</span>
            <span className="text-xs font-bold text-[#0078d4]">Rs {cashSales}</span>
          </div>
          <div className="bg-[#faf9f8] p-2.5 rounded border border-[#e1dfdd]">
            <span className="text-[10px] text-[#605e5c] font-semibold block mb-0.5">Khata Sales (Udhaar)</span>
            <span className="text-xs font-bold text-[#d13438]">Rs {khataSales}</span>
          </div>
        </div>

        {/* Sales Log */}
        <h4 className="text-[10px] font-semibold text-[#605e5c] uppercase tracking-wider mb-2">Today's Transactions</h4>
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-0">
          {salesHistory.length === 0 ? (
            <p className="text-xs text-[#a19f9d] text-center py-6">Aaj ki koi sale record nahi hui.</p>
          ) : (
            salesHistory.map((s) => (
              <div key={s.id} className="bg-[#faf9f8] p-2 rounded border border-[#e1dfdd] flex justify-between items-center text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${s.type === 'CASH' ? 'bg-[#eff6fc] text-[#0078d4]' : 'bg-[#fde8e8] text-[#d13438]'}`}>
                      {s.type}
                    </span>
                    <span className="text-[#605e5c] text-[10px]">{s.date}</span>
                  </div>
                  <p className="text-[10px] text-[#a19f9d] mt-0.5">{s.itemCount} items sold</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#11100f] block">Rs {s.totalAmount}</span>
                  <span className="text-[9px] text-[#107c41] font-medium">+Rs {s.profit} Profit</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
