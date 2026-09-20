import React, { useState } from 'react';
import { X, Scale } from 'lucide-react';

export default function LooseQtyModal({ isOpen, onClose, item, onAddLooseItem }) {
  const [rupees, setRupees] = useState('');

  if (!isOpen || !item) return null;

  const handleQuickWeight = (qtyFraction) => {
    onAddLooseItem(item, qtyFraction);
    setRupees('');
    onClose();
  };

  const handleCustomRupeesSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(rupees);
    if (!amount || amount <= 0) return;
    const qtyFraction = amount / item.price;
    onAddLooseItem(item, qtyFraction);
    setRupees('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3">
      <div className="bg-white border border-[#e1dfdd] rounded-lg w-full max-w-sm p-4 relative shadow-xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-1 border-b border-[#e1dfdd] pb-2">
          <h2 className="text-sm font-semibold text-[#11100f] flex items-center gap-2">
            <Scale size={16} className="text-[#0078d4]" /> Loose Qty / Custom Rs
          </h2>
          <button onClick={onClose} className="text-[#605e5c] hover:text-[#11100f] p-1">
            <X size={18} />
          </button>
        </div>
        <p className="text-[11px] text-[#605e5c] mb-3">{item.name} @ Rs {item.price}/{item.unit}</p>

        {/* Quick Weight Presets */}
        <span className="text-[10px] font-semibold text-[#605e5c] uppercase tracking-wider block mb-1.5">Quick Weight Select</span>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleQuickWeight(0.25)}
            className="py-2 bg-[#faf9f8] hover:bg-[#eff6fc] border border-[#e1dfdd] hover:border-[#0078d4] text-[#11100f] text-xs font-semibold rounded transition cursor-pointer"
          >
            250g (Paao)
          </button>
          <button
            type="button"
            onClick={() => handleQuickWeight(0.5)}
            className="py-2 bg-[#faf9f8] hover:bg-[#eff6fc] border border-[#e1dfdd] hover:border-[#0078d4] text-[#11100f] text-xs font-semibold rounded transition cursor-pointer"
          >
            500g (Aadha Kg)
          </button>
          <button
            type="button"
            onClick={() => handleQuickWeight(0.75)}
            className="py-2 bg-[#faf9f8] hover:bg-[#eff6fc] border border-[#e1dfdd] hover:border-[#0078d4] text-[#11100f] text-xs font-semibold rounded transition cursor-pointer"
          >
            750g (Teen Paao)
          </button>
          <button
            type="button"
            onClick={() => handleQuickWeight(1.5)}
            className="py-2 bg-[#faf9f8] hover:bg-[#eff6fc] border border-[#e1dfdd] hover:border-[#0078d4] text-[#11100f] text-xs font-semibold rounded transition cursor-pointer"
          >
            1.5 kg
          </button>
        </div>

        {/* Custom Amount Form */}
        <form onSubmit={handleCustomRupeesSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold text-[#605e5c] uppercase tracking-wider block mb-1">
              Dukaan Par Kitne Rupey Ka Item Chahiye?
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-[#605e5c] font-semibold">Rs</span>
              <input
                type="number"
                step="any"
                placeholder="e.g. 50"
                className="w-full pl-9 pr-3 py-1.5 bg-[#faf9f8] border border-[#8a8886] rounded text-xs text-[#242424] focus:outline-none focus:border-[#0078d4]"
                value={rupees}
                onChange={(e) => setRupees(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0078d4] hover:bg-[#106ebe] text-white py-2 rounded text-xs font-semibold shadow-sm active:scale-98 transition cursor-pointer"
          >
            ADD CALCULATED QTY TO BILL
          </button>
        </form>
      </div>
    </div>
  );
}
