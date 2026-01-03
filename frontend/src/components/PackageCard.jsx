// src/components/PackageCard.jsx
import React from "react";
import { Check, ShieldCheck } from "lucide-react";

const PackageCard = ({ name, oldPrice, newPrice, parameters, includes, gender }) => {
  const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-t-brand-blue">
      {/* Top Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="bg-blue-50 text-brand-blue p-2 rounded-lg">
          <ShieldCheck size={24} />
        </div>
        <div className="bg-[#7AC943] text-white text-[12px] font-bold px-3 py-1 rounded-full">
          Save {discount}%
        </div>
      </div>

      {/* Package Info */}
      <h3 className="text-xl font-bold text-text-primary mb-1">{name}</h3>
      <p className="text-sm text-brand-blue font-semibold mb-4">{gender}</p>

      {/* Test Highlights */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Includes {parameters} Parameters</p>
        <ul className="space-y-2">
          {includes.slice(0, 4).map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
              <Check size={14} className="text-[#6CC24A]" strokeWidth={3} />
              {item}
            </li>
          ))}
          <li className="text-brand-blue text-xs font-bold pl-6">+ many more</li>
        </ul>
      </div>

      {/* Pricing & CTA */}
      <div className="mt-auto">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-black text-brand-red">₹{newPrice}</span>
          <span className="text-gray-400 line-through text-sm">₹{oldPrice}</span>
        </div>
        <button className="btn-primary w-full py-3 rounded-2xl shadow-lg shadow-brand-blue/20">
          Book Package
        </button>
      </div>
    </div>
  );
};

export default PackageCard;