import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const Hero = ({ onShopClick, onQuizClick }: { onShopClick: () => void, onQuizClick: () => void }) => {
  return (
    <div className="grid lg:grid-cols-12 min-h-[700px] border-b border-border">
      <section className="lg:col-span-7 p-12 lg:p-24 flex flex-col justify-center bg-cream border-r border-border">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-accent block mb-6">British Made & Sustainable</span>
          <h1 className="text-[64px] md:text-[90px] leading-[0.9] font-serif font-medium mb-10 tracking-tighter">
            Curating the <br/><span className="italic text-primary">modern</span> UK home.
          </h1>
          <p className="text-lg max-w-md opacity-80 leading-relaxed mb-10 text-[#1A1A1A]">
            High-quality essentials designed for British weather and sustainable values. From energy-saving gadgets to handcrafted ceramics.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onShopClick}
              className="bg-primary text-white px-10 py-5 text-xs uppercase tracking-widest font-bold hover:bg-accent transition-all"
            >
              Shop The Collection
            </button>
            <button 
              onClick={onQuizClick}
              className="border border-primary text-primary px-10 py-5 text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all"
            >
              Energy Saver Quiz
            </button>
          </div>
        </motion.div>
      </section>

      <section className="lg:col-span-5 relative overflow-hidden bg-sage flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1541167760496-1628856ab752?auto=format&fit=crop&q=80&w=1200" 
            alt="Modern British Craftsmanship"
            className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/10" />
        </div>
        
        <div className="grid grid-cols-2 h-48 border-t border-border">
          <div className="border-r border-border overflow-hidden group relative">
             <img 
              src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=600" 
              alt="Pottery Detail"
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="overflow-hidden group relative">
             <img 
              src="https://images.unsplash.com/photo-1558227108-83a15ddbee14?auto=format&fit=crop&q=80&w=600" 
              alt="Sustainable Detail"
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="absolute bottom-6 right-6 p-6 bg-white/95 backdrop-blur-md border border-border shadow-2xl flex items-center gap-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary leading-tight italic">
            Curated by <br/>Independent Makers
          </div>
          <div className="h-8 w-px bg-border"></div>
          <div className="flex -space-x-2">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=60" 
              alt="Maker 1"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="w-8 h-8 rounded-full bg-cream border-2 border-white flex items-center justify-center text-[8px] font-bold">+12</div>
          </div>
        </div>
      </section>
    </div>
  );
};
