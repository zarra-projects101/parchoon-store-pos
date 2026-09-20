import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, PackagePlus, Camera, Image, Package } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

export default function InventoryModal({ isOpen, onClose }) {
  const products = useInventoryStore((state) => state.products);
  const addProduct = useInventoryStore((state) => state.addProduct);
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('RATION');
  const [imagePreview, setImagePreview] = useState(null);

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert('Aayein! Naama aur Kimat dono likhein.');
      return;
    }

    addProduct({
      name: name.trim(),
      price: Number(price),
      category: category.toUpperCase(),
      image: imagePreview,
    });

    setName('');
    setPrice('');
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3">
      {/* Hidden File Inputs outside Form */}
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <div className="bg-white rounded-xl max-w-md w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3.5 border-b border-[#e1dfdd] flex justify-between items-center bg-[#faf9f8]">
          <h2 className="font-bold text-sm text-[#11100f] flex items-center gap-1.5">
            <PackagePlus size={16} className="text-[#0078d4]" /> Dukan Inventory
          </h2>
          <button type="button" onClick={onClose} className="p-1 text-[#605e5c]">
            <X size={18} />
          </button>
        </div>

        {/* Add Product Form */}
        <form onSubmit={handleAdd} className="p-3 bg-[#faf9f8] border-b border-[#e1dfdd] space-y-2.5">
          <p className="text-[10px] font-bold text-[#605e5c] uppercase">Naya Item Shamil Karein</p>

          {/* Photo Picker Options */}
          <div className="flex items-center gap-2">
            <div className="w-14 h-14 bg-white border border-[#c8c6c4] rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Package size={20} className="text-[#a19f9d]" />
              )}
            </div>

            <div className="flex-1 flex gap-1.5">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex-1 bg-white border border-[#c8c6c4] py-2 rounded-lg text-[10px] font-bold text-[#605e5c] flex items-center justify-center gap-1 active:bg-[#f3f2f1]"
              >
                <Image size={13} className="text-[#0078d4]" /> Gallery
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 bg-white border border-[#c8c6c4] py-2 rounded-lg text-[10px] font-bold text-[#605e5c] flex items-center justify-center gap-1 active:bg-[#f3f2f1]"
              >
                <Camera size={13} className="text-[#107c41]" /> Camera
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Item Name (e.g. Chini)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-2.5 py-1.5 border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4]"
            />
            <input
              type="number"
              placeholder="Price (Rs)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="px-2.5 py-1.5 border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4]"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-2.5 py-1.5 border border-[#c8c6c4] rounded-lg text-xs focus:outline-none focus:border-[#0078d4] bg-white"
            >
              <option value="RATION">RATION</option>
              <option value="CLEANING">CLEANING</option>
              <option value="GENERAL">GENERAL</option>
            </select>
            <button
              type="submit"
              className="bg-[#0078d4] active:bg-[#005a9e] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>
        </form>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <p className="text-[10px] font-bold text-[#605e5c] uppercase">Mawjooda Items ({products.length})</p>
          {products.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#a19f9d]">Koi items nahi hain.</div>
          ) : (
            products.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 border border-[#e1dfdd] rounded-lg bg-white"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#f3f2f1] rounded flex items-center justify-center overflow-hidden border border-[#f3f2f1]">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={14} className="text-[#a19f9d]" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-[#11100f]">{item.name}</h4>
                    <p className="text-[10px] text-[#605e5c]">
                      Rs {item.price} • <span className="font-bold text-[#0078d4]">{item.category}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteProduct(item.id)}
                  className="p-1.5 text-[#a4262c] hover:bg-[#fde8e8] rounded-lg transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
