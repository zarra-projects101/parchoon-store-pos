import jsPDF from 'jspdf';

export const generateReceiptPDF = (sale) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 150], // Receipt Roll Size (80mm width)
  });

  // Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PARCHOON STORE', 40, 10, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Counter - Karachi', 40, 14, { align: 'center' });
  doc.text('----------------------------------------------------', 40, 18, { align: 'center' });

  // Sale Details
  let y = 23;
  doc.setFontSize(8);
  doc.text(`Date: ${sale.date} | ${sale.time}`, 5, y);
  y += 4;
  doc.text(`Customer: ${sale.customerName}`, 5, y);
  y += 4;
  doc.text(`Type: ${sale.type}`, 5, y);
  y += 4;
  doc.text('----------------------------------------------------', 40, y, { align: 'center' });

  // Table Header
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 5, y);
  doc.text('Qty', 48, y);
  doc.text('Amount', 75, y, { align: 'right' });

  y += 2;
  doc.setFont('helvetica', 'normal');
  doc.text('----------------------------------------------------', 40, y, { align: 'center' });

  // Items List
  y += 4;
  sale.items.forEach((item) => {
    // Item Name
    const itemName = item.name.length > 20 ? item.name.substring(0, 18) + '..' : item.name;
    doc.text(itemName, 5, y);
    doc.text(`${item.quantity}`, 50, y);
    doc.text(`Rs ${(item.price || 0) * item.quantity}`, 75, y, { align: 'right' });
    y += 5;
  });

  doc.text('----------------------------------------------------', 40, y, { align: 'center' });

  // Total
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL BILL:', 5, y);
  doc.text(`Rs ${sale.total}`, 75, y, { align: 'right' });

  // Footer
  y += 8;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Shukriya! Dobara Tashreef Laayein.', 40, y, { align: 'center' });

  // Save PDF File
  const fileName = `Receipt_${sale.customerName.replace(/\s+/g, '_')}_${sale.id.slice(-4)}.pdf`;
  doc.save(fileName);
};
