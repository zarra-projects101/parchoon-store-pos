import React, { useState } from 'react';
import { X, Trash2, ShoppingCart, User, Phone, Check, MessageSquare, FileText } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { generateReceiptPDF } from '../utils/generatePdfReceipt';

export default function CartModal({
  isOpen,
  onClose,
  cart,
  totalBill,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  addKhataEntry,
}) {
  const addSaleRecord = useInventoryStore((state) => state.addSaleRecord);

  const [saleType, setSaleType] = useState('CASH');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [lastSale, setLastSale] = useState(null);

  if (!isOpen) return null;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (saleType === 'KHATA' && !customerName.trim()) {
      alert('Khata entry ke liye Customer ka Naama zaroori hai!');
      return;
    }

    const saleData = {
      id: Date.now().toString(),
      items: [...cart],
      total: totalBill,
      type: saleType,
      customerName: customerName.trim() || 'Gahak (Cash)',
      customerPhone: customerPhone.trim(),
      date: new Date().toLocaleDateString('en-PK'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (saleType === 'KHATA') {
      addKhataEntry({
        id: saleData.id,
        customerName: saleData.customerName,
        customerPhone: saleData.customerPhone,
        amount: totalBill,
        items: cart,
        status: 'UNPAID',
        date: saleData.date,
      });
    }

    addSaleRecord(saleData);
    setLastSale(saleData);
    clearCart();
  };

  const handlePdfDownloadAndWhatsApp = (sale) => {
    if (!sale) return;

    // 1. Download PDF File
    generateReceiptPDF(sale);

    // 2. Open WhatsApp with message
    let text = `*--- PARCHOON STORE RECEIPT ---*\n`;
    text += `*Date:* ${sale.date} | ${sale.time}\n`;
    text += `*Customer:* ${sale.customerName}\n`;
    text += `*Payment Type:* ${sale.type}\n`;
    text += `-------------------------------\n`;

    sale.items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.name} × ${item.quantity} = Rs ${(item.price || 0) * item.quantity}\n`;
    });

    text += `-------------------------------\n`;
    text += `*TOTAL BILL: Rs ${sale.total}*\n\n`;
    text += `📄 *PDF Invoice download ho gayi hai.* (Paperclip 📎 button dabayein aur attach karein).\n\n`;
    text += `Shukriya! Dobara Tashreef Laayein. 🙏`;

    const encodedText = encodeURIComponent(text);
    const phoneNum = sale.customerPhone ? sale.customerPhone.replace(/[^0-9]/g, '') : '';
    
    const whatsappUrl = phoneNum 
      ? `https://wa.me/${phoneNum}?text=${encodedText}` 
      : `https://wa.me/?text=${encodedText}`;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 500);
  };

  const resetAndClose = () => {
    setLastSale(null);
    setCustomerName('');
    setCustomerPhone('');
    setSaleType('CASH');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3.5 border-b border-[#e1dfdd] flex justify-between items-center bg-[#faf9f8]">
          <h2 className="font-bold text-sm text-[#11100f] flex items-center gap-1.5">
            <ShoppingCart size={16} className="text-[#0078d4]" />
            {lastSale ? 'Sale Successful' : 'Checkout Cart'}
          </h2>
          <button type="button" onClick={resetAndClose} className="p-1 text-[#605e5c]">
            <X size={18} />
          </button>
        </div>

        {/* Success Screen */}
        {lastSale ? (
          <div className="p-5 text-center space-y-4 my-auto">
            <div className="w-12 h-12 bg-[#dff6dd] text-[#107c41] rounded-full flex items-center justify-center mx-auto">
              <Check size={28} />
            </div>
            <div>
              <h3 className="font-black text-base text-[#11100f]">Bill Finalize Ho Gaya!</h3>
              <p className="text-xs text-[#605e5c] mt-1">Total Amount: <span className="font-bold text-[#107c41]">Rs {lastSale.total}</span></p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => handlePdfDownloadAndWhatsApp(lastSale)}
                className="w-full bg-[#25D366] active:bg-[#1da851] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
              >
                <FileText size={16} /> Download PDF & Share WhatsApp
              </button>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full bg-[#f3f2f1] active:bg-[#e1dfdd] text-[#11100f] py-2 rounded-xl text-xs font-bold transition"
              >
                Done / Next Sale
              </button>
            </div>
          </div>
        ) : (
          /* Cart Items & Form */
          <>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#a19f9d]">Cart Khali Hai.</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border border-[#e1dfdd] p-2 rounded-lg bg-white">
                    <div>
                      <h4 className="font-bold text-xs text-[#11100f]">{item.name}</h4>
                      <p className="text-[10px] text-[#605e5c]">Rs {item.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#c8c6c4] rounded-md overflow-hidden bg-[#faf9f8]">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold text-[#605e5c]"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-[#605e5c]"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#a4262c] p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="p-3 bg-[#faf9f8] border-t border-[#e1dfdd] space-y-2.5">
                <div className="grid grid-cols-2 gap-2 bg-[#e1dfdd] p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setSaleType('CASH')}
                    className={`py-1.5 text-xs font-bold rounded-md transition ${
                      saleType === 'CASH' ? 'bg-[#107c41] text-white shadow-xs' : 'text-[#605e5c]'
                    }`}
                  >
                    Cash Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaleType('KHATA')}
                    className={`py-1.5 text-xs font-bold rounded-md transition ${
                      saleType === 'KHATA' ? 'bg-[#d13438] text-white shadow-xs' : 'text-[#605e5c]'
                    }`}
                  >
                    Khata (Udhaar)
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="relative">
                    <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a19f9d]" />
                    <input
                      type="text"
                      placeholder={saleType === 'KHATA' ? "Customer Name (Required)" : "Customer Name (Optional)"}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1.5 border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4]"
                    />
                  </div>
                  <div className="relative">
                    <Phone size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a19f9d]" />
                    <input
                      type="text"
                      placeholder="WhatsApp Phone (e.g. 03001234567)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1.5 border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4]"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div>
                    <span className="text-[10px] text-[#605e5c] block font-bold uppercase">Total</span>
                    <span className="text-base font-black text-[#11100f]">Rs {totalBill}</span>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#0078d4] active:bg-[#005a9e] text-white px-5 py-2 rounded-lg text-xs font-bold transition"
                  >
                    Confirm Sale
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
