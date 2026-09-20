import React, { useState } from 'react';
import { useCustomerStore } from '../store/useCustomerStore';
import { X, BookOpen, UserPlus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function KhataModal({ isOpen, onClose }) {
  const { customers, addCustomer, recordPayment } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  if (!isOpen) return null;

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustName) return;
    addCustomer(newCustName, newCustPhone);
    setNewCustName('');
    setNewCustPhone('');
    setShowAddForm(false);
  };

  const handleWasooli = (e) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0) return;
    recordPayment(selectedCustomer.id, paymentAmount);
    setPaymentAmount('');
    setSelectedCustomer(null);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3">
      <div className="bg-white border border-[#e1dfdd] rounded-lg w-full max-w-md p-4 relative shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-3 border-b border-[#e1dfdd] pb-2">
          <h2 className="text-sm font-semibold text-[#11100f] flex items-center gap-2">
            <BookOpen size={16} className="text-[#d13438]" /> Customer Khata Ledger
          </h2>
          <button onClick={onClose} className="text-[#605e5c] hover:text-[#11100f]">
            <X size={18} />
          </button>
        </div>

        {/* Add Customer Toggle / Search */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Customer naam ya mobile..."
            className="flex-1 px-3 py-1.5 bg-[#faf9f8] border border-[#8a8886] rounded text-xs text-[#242424] focus:outline-none focus:border-[#0078d4]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#0078d4] hover:bg-[#106ebe] text-white px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1"
          >
            <UserPlus size={14} /> Add
          </button>
        </div>

        {/* Add New Customer Form */}
        {showAddForm && (
          <form onSubmit={handleCreateCustomer} className="bg-[#eff6fc] p-3 rounded border border-[#c7e0f4] mb-3 space-y-2">
            <input
              type="text"
              placeholder="Full Name *"
              required
              className="w-full px-2.5 py-1.5 bg-white border border-[#c7e0f4] rounded text-xs text-[#242424]"
              value={newCustName}
              onChange={(e) => setNewCustName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Mobile Number"
              className="w-full px-2.5 py-1.5 bg-white border border-[#c7e0f4] rounded text-xs text-[#242424]"
              value={newCustPhone}
              onChange={(e) => setNewCustPhone(e.target.value)}
            />
            <button type="submit" className="w-full bg-[#0078d4] text-white py-1.5 rounded text-xs font-semibold">
              Save Customer
            </button>
          </form>
        )}

        {/* Customers List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
          {filteredCustomers.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCustomer(c)}
              className="bg-[#faf9f8] hover:bg-[#f3f2f1] p-3 rounded border border-[#e1dfdd] cursor-pointer transition flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold text-xs text-[#11100f]">{c.name}</h4>
                <p className="text-[10px] text-[#605e5c]">{c.phone || 'No Phone'}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-xs text-[#d13438] block">Rs {c.balance}</span>
                <span className="text-[9px] text-[#605e5c]">Wusool Karna Hai</span>
              </div>
            </div>
          ))}
        </div>

        {/* Wasooli Modal Overlay */}
        {selectedCustomer && (
          <div className="absolute inset-0 bg-white/95 rounded-lg p-4 flex flex-col justify-between z-10 border border-[#e1dfdd]">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm text-[#11100f]">{selectedCustomer.name} - Ledger</h3>
                <button onClick={() => setSelectedCustomer(null)} className="text-[#605e5c]">
                  <X size={18} />
                </button>
              </div>

              <div className="bg-[#fde8e8] p-3 rounded border border-[#f8c2c2] mb-3 text-center">
                <span className="text-[10px] text-[#d13438] font-semibold block uppercase">Kul Baqaya Udhaar</span>
                <span className="text-xl font-bold text-[#d13438]">Rs {selectedCustomer.balance}</span>
              </div>

              {/* Cash Wasooli Input */}
              <form onSubmit={handleWasooli} className="space-y-2 mb-3">
                <label className="text-[11px] font-semibold text-[#605e5c] block">Cash Wasooli Entry:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Wusool Shuda Rakam..."
                    className="flex-1 px-3 py-1.5 bg-[#faf9f8] border border-[#8a8886] rounded text-xs text-[#242424]"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                  <button type="submit" className="bg-[#107c41] text-white px-3 py-1.5 rounded text-xs font-semibold">
                    Submit Wasooli
                  </button>
                </div>
              </form>

              {/* History */}
              <h4 className="text-[10px] font-semibold text-[#605e5c] uppercase mb-1">Transaction Log</h4>
              <div className="max-h-36 overflow-y-auto space-y-1 text-xs">
                {selectedCustomer.history.map((h, index) => (
                  <div key={index} className="flex justify-between items-center bg-[#faf9f8] p-2 rounded border border-[#e1dfdd]">
                    <div>
                      <span className="text-[10px] text-[#605e5c] block">{h.date} - {h.note}</span>
                    </div>
                    <span className={`font-semibold ${h.type === 'DEBIT' ? 'text-[#d13438]' : 'text-[#107c41]'}`}>
                      {h.type === 'DEBIT' ? '+' : '-'} Rs {h.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
