export const generateWhatsAppReceipt = (cart, totalBill, paymentType) => {
  let msg = `*--- PARCHOON STORE RECEIPT ---*\n\n`;
  cart.forEach((item, index) => {
    msg += `${index + 1}. ${item.name} x ${item.quantity} = Rs ${(item.price || 0) * item.quantity}\n`;
  });
  msg += `\n-------------------------------\n`;
  msg += `*TOTAL BILL: Rs ${totalBill}*\n`;
  msg += `Payment Mode: ${paymentType === 'cash' ? 'Paid (Cash)' : 'Udhaar (Khata)'}\n`;
  msg += `Shukriya! Phir Tashreef Layien.`;
  return encodeURIComponent(msg);
};
