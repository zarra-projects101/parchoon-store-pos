import React from 'react';
import { Plus, Package } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white p-2.5 rounded-xl border border-[#e1dfdd] shadow-xs flex flex-col justify-between overflow-hidden">
      <div>
        {/* Product Image */}
        <div className="w-full h-24 bg-[#f3f2f1] rounded-lg mb-2 overflow-hidden flex items-center justify-center border border-[#f3f2f1]">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Package size={28} className="text-[#a19f9d]" />
          )}
        </div>

        <h3 className="font-bold text-xs text-[#11100f] line-clamp-1">{product.name}</h3>
        <p className="text-[11px] text-[#0078d4] font-semibold mt-0.5">Rs {product.price}</p>
      </div>

      <button
        onClick={() => onAddToCart(product)}
        className="mt-2 w-full bg-[#f3f2f1] active:bg-[#0078d4] active:text-white hover:bg-[#0078d4] hover:text-white text-[#11100f] py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
      >
        <Plus size={14} /> Add
      </button>
    </div>
  );
}
