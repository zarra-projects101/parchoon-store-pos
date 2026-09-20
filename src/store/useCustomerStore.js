import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialCustomers = [
  { id: '1', name: 'Tariq Bhai', phone: '0300-1234567', balance: 1500, history: [{ date: '10 Sep', amount: 1500, type: 'DEBIT', note: 'Purana Udhaar' }] },
  { id: '2', name: 'Usman Builder', phone: '0321-9876543', balance: 4200, history: [{ date: '12 Sep', amount: 4200, type: 'DEBIT', note: 'Ration Pack' }] },
];

export const useCustomerStore = create(
  persist(
    (set) => ({
      customers: initialCustomers,

      addCustomer: (name, phone) => set((state) => ({
        customers: [{ id: Date.now().toString(), name, phone, balance: 0, history: [] }, ...state.customers]
      })),

      addBillToKhata: (customerId, amount, billSummary) => set((state) => ({
        customers: state.customers.map((c) => {
          if (c.id === customerId) {
            const updatedBalance = c.balance + Number(amount);
            const newEntry = {
              date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }),
              amount: Number(amount),
              type: 'DEBIT',
              note: billSummary
            };
            return { ...c, balance: updatedBalance, history: [newEntry, ...c.history] };
          }
          return c;
        })
      })),

      recordPayment: (customerId, amountPaid) => set((state) => ({
        customers: state.customers.map((c) => {
          if (c.id === customerId) {
            const updatedBalance = Math.max(0, c.balance - Number(amountPaid));
            const newEntry = {
              date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }),
              amount: Number(amountPaid),
              type: 'CREDIT',
              note: 'Cash Wasooli'
            };
            return { ...c, balance: updatedBalance, history: [newEntry, ...c.history] };
          }
          return c;
        })
      }))
    }),
    { name: 'parchoon-customer-storage' }
  )
);
