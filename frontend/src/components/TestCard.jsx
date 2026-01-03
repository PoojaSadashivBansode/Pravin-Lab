import React from "react";
import { Check, Droplets } from "lucide-react";

const TestCard = ({ name, oldPrice, newPrice, parameters, time }) => {
  const numericOldPrice = parseInt(oldPrice);
  const numericNewPrice = parseInt(newPrice);
  const discountPercent = numericOldPrice > numericNewPrice 
    ? Math.round(((numericOldPrice - numericNewPrice) / numericOldPrice) * 100) 
    : 0;

  return (
    /* max-w-[280px] is ideal for 4-column layouts to ensure enough gutter space */
    <div className="relative bg-white rounded-3xl shadow-sm border border-gray-200 w-full max-w-70 p-5 flex flex-col font-sans transition-all hover:shadow-xl hover:-translate-y-1">
      
      {/* Popular Tag */}
      <div className="flex justify-between items-start mb-3">
        <div className="bg-white shadow-sm rounded-full p-2 flex items-center justify-center border border-gray-50">
          <Droplets className="text-brand-red" size={18} fill="#D32F2F" />
        </div>
        <span className="bg-[#E91E63] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Most Popular
        </span>
      </div>

      {/* Title - Reduced size slightly for 4-column fit */}
      <h2 className="text-[18px] font-bold text-text-primary leading-tight mb-3 min-h-11 line-clamp-2">
        {name}
      </h2>

      {/* Features */}
      <ul className="space-y-1.5 mb-5">
        <li className="flex items-center gap-2 text-gray-500 text-[13px] font-medium">
          <Check size={14} className="text-[#6CC24A]" strokeWidth={3} />
          {parameters}
        </li>
        <li className="flex items-center gap-2 text-gray-500 text-[13px] font-medium">
          <Check size={14} className="text-[#6CC24A]" strokeWidth={3} />
          {time}
        </li>
      </ul>

      {/* Pricing */}
      <div className="flex items-center gap-2 mb-5">
        <div className="text-[24px] font-black text-brand-red">
          ₹{newPrice}
        </div>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        <div className="flex flex-col">
          <span className="text-gray-400 text-xs line-through font-medium">
            ₹{oldPrice}
          </span>
          {discountPercent > 0 && (
            <span className="bg-[#5CB85C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 w-fit">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <button className="btn-primary w-full py-2.5 rounded-xl text-md font-bold transition-all hover:opacity-90 active:bg-[#BFBFBF] active:scale-95">
        Book Now
      </button>
    </div>
  );
};

export default TestCard;