import React from 'react';
import { Wind, ShieldCheck, Leaf } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[4/5] overflow-hidden bg-white mb-6 border border-border">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isEnergySaver && (
            <div className="bg-white/90 backdrop-blur-sm text-accent text-[9px] font-bold px-2 py-1 flex items-center gap-1 uppercase tracking-widest shadow-sm border border-border">
              Energy Saver
            </div>
          )}
          {product.madeInBritain && (
            <div className="bg-primary text-white text-[9px] font-bold px-2 py-1 flex items-center gap-1 uppercase tracking-widest">
              Made in Britain
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <p className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold opacity-60">{product.category}</p>
          <p className="text-sm font-serif italic text-primary">£{product.price.toFixed(2)}</p>
        </div>
        <h3 className="text-xl font-serif font-medium text-[#1A1A1A] group-hover:text-primary transition-colors tracking-tight">
          {product.name}
        </h3>
        <p className="text-xs text-accent/70 leading-relaxed max-w-[90%] line-clamp-2">{product.description}</p>
        <div className="pt-2 flex items-center gap-4 text-[9px] text-accent font-bold uppercase tracking-widest opacity-40">
          <span className="flex items-center gap-1"><Leaf className="h-3 w-3" /> {product.carbonFootprint}</span>
        </div>
      </div>
    </div>
  );
};
