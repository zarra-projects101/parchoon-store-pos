import React from 'react';
import { DollarSign, TrendingUp, CreditCard, MessageSquare, Clock } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

export default function SalesHistoryView() {
  const salesHistory = useInventoryStore((state) => state.salesHistory);

  const totalSales = salesHistory.reduce((sum, s) => sum + (s.total || 0), 0);
  const cashSales = salesHistory
    .filter((s) => s.type === 'CASH')
    .reduce((sum, s) => sum + (s.total || 0), 0);
  const khataSales = salesHistory
    .filter((s) => s.type === 'KHATA')
    .reduce((sum, s) => sum + (s.total || 0), 0);

  const sendWhatsAppBill = (sale) => {
    let text = `*--- PARCHOON STORE RECEIPT ---*\n`;
    text += `*Date:* ${sale.date} | ${sale.time}\n`;
    text += `*Customer:* ${sale.customerName}\n`;
    text += `*Payment Type:* ${sale.type}\n`;
    text += `-------------------------------\n`;

    sale.items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.name} × ${item.quantity} = Rs ${(item.price || 0) * item.quantity}\n`;
    });

    text += `-------------------------------\n`;
    text += `*TOTAL BILL: Rs ${sale.total}*\n`;

    const encodedText = encodeURIComponent(text);
    const phoneNum = sale.customerPhone ? sale.customerPhone.replace(/[^0-9]/g, '') : '';
    const whatsappUrl = phoneNum 
      ? `https://wa.me/${phoneNum}?text=${encodedText}` 
      : `https://wa.me/?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-3 max-w-2xl mx-auto space-y-3">
      {/* Sales Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-2.5 rounded-xl border border-[#e1dfdd] shadow-xs">
          <div className="text-[10px] text-[#605e5c] font-bold uppercase flex items-center gap-1">
            <TrendingUp size={12} className="text-[#0078d4]" /> Total Sales
          </div>
          <div className="text-sm font-black text-[#11100f] mt-1">Rs {totalSales}</div>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-[#e1dfdd] shadow-xs">
          <div className="text-[10px] text-[#605e5c] font-bold uppercase flex items-center gap-1">
            <DollarSign size={12} className="text-[#107c41]" /> Cash Total
          </div>
          <div className="text-sm font-black text-[#107c41] mt-1">Rs {cashSales}</div>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-[#e1dfdd] shadow-xs">
          <div className="text-[10px] text-[#605e5c] font-bold uppercase flex items-center gap-1">
            <CreditCard size={12} className="text-[#d13438]" /> Khata Total
          </div>
          <div className="text-sm font-black text-[#d13438] mt-1">Rs {khataSales}</div>
        </div>
      </div>

      {/* Sales History List */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-[#605e5c] uppercase">Recent Transactions ({salesHistory.length})</p>

        {salesHistory.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-[#e1dfdd] text-center text-xs text-[#a19f9d]">
            Abhi tak koi sale record nahi hua.
          </div>
        ) : (
          salesHistory.map((sale) => (
            <div key={sale.id} className="bg-white p-3 rounded-xl border border-[#e1dfdd] shadow-xs space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-xs text-[#11100f]">{sale.customerName}</h4>
                  <p className="text-[10px] text-[#605e5c] flex items-center gap-1 mt-0.5">
                    <Clock size={11} /> {sale.date} • {sale.time}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#11100f] block">Rs {sale.total}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      sale.type === 'CASH'
                        ? 'bg-[#dff6dd] text-[#107c41]'
                        : 'bg-[#fde8e8] text-[#a4262c]'
                    }`}
                  >
                    {sale.type}
                  </span>
                </div>
              </div>

              {/* Items Detail */}
              <div className="bg-[#faf9f8] p-2 rounded-lg text-[10px] text-[#605e5c] space-y-1">
                {sale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold">Rs {(item.price || 0) * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => sendWhatsAppBill(sale)}
                  className="text-[10px] font-bold text-[#25D366] flex items-center gap-1 hover:underline"
                >
                  <MessageSquare size={12} /> Resend WhatsApp Bill
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
