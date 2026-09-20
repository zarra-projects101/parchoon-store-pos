import React, { useState, useEffect } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { X, Camera, Image } from 'lucide-react';

export default function EditItemModal({ isOpen, onClose, product, item }) {
  const targetItem = product || item;
  const updateProduct = useInventoryStore((state) => state.updateProduct || state.updateItem);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('RATION');
  const [unit, setUnit] = useState('kg');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (targetItem) {
      setName(targetItem.name || '');
      setPrice(targetItem.price || '');
      setStock(targetItem.stock || '');
      setCategory(targetItem.category?.toUpperCase() || 'RATION');
      setUnit(targetItem.unit || 'kg');
      setImage(targetItem.image || '');
    }
  }, [targetItem]);

  if (!isOpen || !targetItem) return null;

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const updatedData = {
      ...targetItem,
      name,
      price: Number(price),
      stock: Number(stock) || 0,
      category,
      unit,
      image,
    };

    if (updateProduct) updateProduct(targetItem.id, updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-xl max-w-sm w-full p-4 shadow-xl">
        <div className="flex justify-between items-center pb-2 border-b border-[#e1dfdd] mb-3">
          <h2 className="font-bold text-sm text-[#11100f] flex items-center gap-1.5">
            <Camera size={16} className="text-[#0078d4]" /> Edit Item / Rate
          </h2>
          <button onClick={onClose} className="p-1 text-[#605e5c] hover:bg-[#f3f2f1] rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#605e5c] mb-1">Product Photo</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#faf9f8] border border-dashed border-[#c8c6c4] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Image size={22} className="text-[#a19f9d]" />
                )}
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label className="cursor-pointer bg-[#eff6fc] hover:bg-[#0078d4] text-[#0078d4] hover:text-white px-2.5 py-1 rounded-md text-[11px] font-semibold border border-[#c7e0f4] transition flex items-center justify-center gap-1">
                  <Camera size={13} />
                  <span>Take Live Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageCapture}
                    className="hidden"
                  />
                </label>

                <label className="cursor-pointer bg-[#faf9f8] hover:bg-[#f3f2f1] text-[#605e5c] hover:text-[#11100f] px-2.5 py-1 rounded-md text-[11px] font-semibold border border-[#e1dfdd] transition flex items-center justify-center gap-1">
                  <Image size={13} />
                  <span>Select from Gallery</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageCapture}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#605e5c] mb-0.5">Item Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#605e5c] mb-0.5">Price / Rate (Rs)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#605e5c] mb-0.5">Stock Qty</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#605e5c] mb-0.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4]"
              >
                <option value="RATION">RATION</option>
                <option value="GENERAL">GENERAL</option>
                <option value="CLEANING">CLEANING</option>
                <option value="DAIRY">DAIRY</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#605e5c] mb-0.5">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4]"
              >
                <option value="kg">kg</option>
                <option value="ltr">ltr</option>
                <option value="pack">pack</option>
                <option value="bag">bag</option>
                <option value="pc">pc</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#0078d4] text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#106ebe] transition"
          >
            Update Item
          </button>
        </form>
      </div>
    </div>
  );
}
