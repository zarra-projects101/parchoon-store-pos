import React, { useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { X, ShoppingBag, Trash2, Plus, Minus, Send, Wallet, BookOpen } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose }) {
  const store = useInventoryStore();
  const cart = store?.cart || [];
  const updateCartQuantity = store?.updateCartQuantity;
  const removeFromCart = store?.removeFromCart;
  const clearCart = store?.clearCart;
  const addKhataEntry = store?.addKhataEntry;

  const [paymentType, setPaymentType] = useState('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  if (!isOpen) return null;

  const totalBill = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const generateWhatsAppMessage = () => {
    let msg = `*--- PARCHOON STORE RECEIPT ---*\n`;
    cart.forEach((item, index) => {
      msg += `${index + 1}. ${item.name} (${item.quantity} ${item.unit || 'pc'}) - Rs ${(item.price || 0) * item.quantity}\n`;
    });
    msg += `-------------------------------\n`;
    msg += `*TOTAL BILL: Rs ${totalBill}*\n`;
    msg += `Payment Mode: ${paymentType === 'cash' ? 'Paid (Cash)' : 'Udhaar (Khata)'}\n`;
    msg += `Thank you for shopping with us!`;
    return encodeURIComponent(msg);
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (paymentType === 'khata') {
      if (!customerName.trim()) {
        alert('Please enter Customer Name for Khata entry.');
        return;
      }
      if (addKhataEntry) {
        addKhataEntry({
          id: Date.now().toString(),
          customerName,
          customerPhone,
          amount: totalBill,
          items: [...cart],
          date: new Date().toISOString(),
          type: 'DEBIT',
        });
      }
    }

    if (customerPhone.trim()) {
      const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanPhone}?text=${generateWhatsAppMessage()}`;
      window.open(waUrl, '_blank');
    }

    alert(paymentType === 'cash' ? 'Sale Completed Successfully!' : 'Added to Khata Successfully!');
    if (clearCart) clearCart();
    setCustomerName('');
    setCustomerPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-xl max-w-sm w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3.5 border-b border-[#e1dfdd] flex justify-between items-center bg-[#faf9f8]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#0078d4]" />
            <h2 className="font-bold text-sm text-[#11100f]">Current Cart Bill</h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#605e5c] hover:bg-[#edebe9] rounded-lg transition">
            <X size={18} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#a19f9d] space-y-2">
              <ShoppingBag size={40} className="stroke-[1.5]" />
              <p className="text-xs font-medium">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2.5 border border-[#e1dfdd] rounded-lg bg-white shadow-2xs">
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="font-semibold text-xs text-[#11100f] truncate">{item.name}</h4>
                  <p className="text-[11px] text-[#605e5c]">
                    Rs {item.price} x {item.quantity} = <span className="font-bold text-[#11100f]">Rs {(item.price || 0) * item.quantity}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center border border-[#c8c6c4] rounded-md bg-[#faf9f8]">
                    <button
                      onClick={() => updateCartQuantity && updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-[#edebe9] text-[#605e5c]"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-1.5 text-xs font-bold min-w-[18px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity && updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-[#edebe9] text-[#605e5c]"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart && removeFromCart(item.id)}
                    className="p-1 text-[#a4262c] hover:bg-[#fde7e9] rounded-md transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout Actions */}
        {cart.length > 0 && (
          <div className="p-3 border-t border-[#e1dfdd] bg-[#faf9f8] space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold text-[#11100f] pb-2 border-b border-[#e1dfdd]">
              <span>Total Bill</span>
              <span className="text-sm text-[#0078d4]">Rs {totalBill}</span>
            </div>

            {/* Payment Choice */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentType('cash')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 transition ${
                  paymentType === 'cash'
                    ? 'bg-[#0078d4] text-white border-[#0078d4]'
                    : 'bg-white text-[#605e5c] border-[#c8c6c4]'
                }`}
              >
                <Wallet size={13} />
                <span>Cash Payment</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('khata')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 transition ${
                  paymentType === 'khata'
                    ? 'bg-[#d13438] text-white border-[#d13438]'
                    : 'bg-white text-[#605e5c] border-[#c8c6c4]'
                }`}
              >
                <BookOpen size={13} />
                <span>Add to Khata</span>
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-1.5">
              {paymentType === 'khata' && (
                <input
                  type="text"
                  required
                  placeholder="Customer Name (e.g. Ali Ahmed)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4]"
                />
              )}

              <input
                type="tel"
                placeholder="WhatsApp No (e.g. 03001234567)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4]"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleCheckout}
              className="w-full bg-[#107c41] text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#0b5a2f] transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Send size={14} />
              <span>Checkout {customerPhone ? '& WhatsApp' : ''}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
