import React from 'react';
import { Plus, Scale, Edit3 } from 'lucide-react';

export default function ItemCard({ item, onAddToCart, onOpenLooseModal, onOpenEditModal }) {
  return (
    <div className="bg-white border border-[#e1dfdd] rounded-lg p-3 shadow-xs hover:border-[#0078d4] transition flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-semibold text-[#605e5c] bg-[#faf9f8] px-1.5 py-0.5 rounded border border-[#e1dfdd] uppercase">
            {item.category}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenLooseModal(item);
              }}
              title="Loose / Custom Weight"
              className="p-1 text-[#605e5c] hover:text-[#0078d4] hover:bg-[#eff6fc] rounded transition cursor-pointer"
            >
              <Scale size={15} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenEditModal(item);
              }}
              title="Edit Item"
              className="p-1 text-[#605e5c] hover:text-[#0078d4] hover:bg-[#eff6fc] rounded transition cursor-pointer"
            >
              <Edit3 size={15} />
            </button>
          </div>
        </div>
        <h3 className="font-semibold text-xs text-[#11100f] mt-1">{item.name}</h3>
      </div>

      <div className="flex justify-between items-end mt-3">
        <div>
          <span className="text-sm font-bold text-[#11100f]">Rs {item.price}</span>
          <span className="text-[10px] text-[#605e5c]">/{item.unit}</span>
        </div>
        <button
          onClick={() => onAddToCart(item)}
          className="bg-[#eff6fc] hover:bg-[#0078d4] text-[#0078d4] hover:text-white p-1.5 rounded transition border border-[#c7e0f4] cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
