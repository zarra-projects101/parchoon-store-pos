import React, { useState } from 'react';
import { UserCheck, Phone, CheckCircle, Clock } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

export default function KhataView({ khata }) {
  const markKhataPaid = useInventoryStore((state) => state.markKhataPaid);
  const [filter, setFilter] = useState('ALL');

  const filteredKhata = khata.filter((entry) => {
    if (filter === 'UNPAID') return entry.status === 'UNPAID';
    if (filter === 'PAID') return entry.status === 'PAID';
    return true;
  });

  const totalUnpaid = khata
    .filter((e) => e.status === 'UNPAID')
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  return (
    <div className="p-3 max-w-2xl mx-auto space-y-3">
      {/* Summary Box */}
      <div className="bg-[#fff4ce] border border-[#fde68a] p-3.5 rounded-xl flex justify-between items-center shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-[#795e00] uppercase tracking-wider block">
            Kul Wusool Talab Udhaar
          </span>
          <h2 className="text-lg font-black text-[#8a6d00]">Rs {totalUnpaid}</h2>
        </div>
        <Clock size={24} className="text-[#b58d00]" />
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#605e5c]">
          Khata Records
        </h2>
        <div className="flex gap-1 bg-[#e1dfdd] p-0.5 rounded-lg text-[10px] font-bold">
          {['ALL', 'UNPAID', 'PAID'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-md transition ${
                filter === f ? 'bg-white text-[#11100f] shadow-xs' : 'text-[#605e5c]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filteredKhata.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-[#e1dfdd] text-center text-xs text-[#a19f9d]">
          Koi Khata Record Nahi Mila.
        </div>
      ) : (
        filteredKhata.map((entry) => {
          const isPaid = entry.status === 'PAID';
          return (
            <div
              key={entry.id}
              className={`bg-white p-3 rounded-xl border shadow-xs space-y-2.5 transition ${
                isPaid ? 'border-[#bad80a] bg-[#f7fbe6]/30' : 'border-[#e1dfdd]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xs text-[#11100f] flex items-center gap-1">
                    <UserCheck size={14} className={isPaid ? 'text-[#107c41]' : 'text-[#0078d4]'} />
                    {entry.customerName}
                  </h3>
                  {entry.customerPhone && (
                    <p className="text-[10px] text-[#605e5c] flex items-center gap-1 mt-0.5">
                      <Phone size={10} /> {entry.customerPhone}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black block ${isPaid ? 'text-[#107c41]' : 'text-[#d13438]'}`}>
                    Rs {entry.amount}
                  </span>
                  <span
                    className={`inline-block px-1.5 py-0.2 mt-0.5 text-[9px] font-bold rounded ${
                      isPaid ? 'bg-[#dff6dd] text-[#107c41]' : 'bg-[#fde8e8] text-[#d13438]'
                    }`}
                  >
                    {isPaid ? 'PAID' : 'UNPAID'}
                  </span>
                </div>
              </div>

              {/* Items Detail Summary */}
              {entry.items && entry.items.length > 0 && (
                <div className="bg-[#faf9f8] p-2 rounded-lg border border-[#f3f2f1] text-[10px] text-[#605e5c] space-y-0.5">
                  {entry.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span>Rs {(item.price || 0) * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-[#f3f2f1] pt-2 flex justify-between items-center text-[10px] text-[#a19f9d]">
                <span>Date: {entry.date}</span>
                {!isPaid && (
                  <button
                    onClick={() => markKhataPaid(entry.id)}
                    className="bg-[#107c41] active:bg-[#0b582e] text-white px-2.5 py-1 rounded-md font-bold text-[10px] flex items-center gap-1 transition"
                  >
                    <CheckCircle size={12} /> Mark as Paid
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
