import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CosyQuiz } from './components/CosyQuiz';
import { Auth } from './pages/Auth';
import { Admin } from './pages/Admin';
import { AuthProvider } from './contexts/AuthContext';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Product } from './types';
import { seedProducts } from './lib/mockData';
import { Award, ChevronRight, Star } from 'lucide-react';
import { motion } from 'motion/react';

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('All');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    seedProducts();
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredProducts = category === 'All' 
    ? products 
    : products.filter(p => p.category === category);

  const categories = ['All', 'Energy-saving', 'Sustainable Homeware', 'Pet Products', 'Decor', 'Garden', 'Fragrance'];

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cream selection:bg-sage">
      <Navbar />
      <Hero onShopClick={scrollToShop} onQuizClick={() => setIsQuizOpen(true)} />

      <div className="bg-primary text-cream px-8 py-3 border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center sm:justify-between items-center gap-8 text-[10px] uppercase tracking-[0.3em] font-medium opacity-90">
          <div className="flex items-center gap-2">Trustpilot ★★★★★ (4.9/5)</div>
          <div className="flex items-center gap-2">Carbon Neutral Deliveries</div>
          <div className="flex items-center gap-2">Supporting UK Small Makers</div>
        </div>
      </div>

      <main ref={shopRef} className="max-w-7xl mx-auto px-6 sm:px-8 py-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent">The 2026 Collection</span>
            <h2 className="text-5xl md:text-6xl font-serif tracking-tight leading-none text-primary">Essentials for a <span className="italic">conscious</span> lifestyle.</h2>
          </div>
          <div className="flex overflow-x-auto pb-4 md:pb-0 gap-6 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-[10px] uppercase tracking-widest font-bold border-b-2 py-1.5 transition-all
                  ${category === cat 
                    ? 'text-primary border-primary' 
                    : 'text-accent/40 border-transparent hover:text-primary hover:border-accent/20'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[4/5] bg-border/50 border border-border" />
                <div className="h-4 bg-border/50 w-1/4" />
                <div className="h-6 bg-border/50 w-3/4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border bg-white">
            <p className="text-xs font-bold uppercase tracking-widest text-accent opacity-40 mb-4">No products found in the collection.</p>
            <p className="text-[10px] text-accent opacity-30 max-w-xs mx-auto">If you just set up your database, please add products via the Admin panel or ensure Firestore is enabled in your console.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
          >
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Categories Split Section */}
        <section className="mt-40 grid lg:grid-cols-2 border border-border">
          <div className="aspect-square lg:aspect-auto h-[600px] border-b lg:border-b-0 lg:border-r border-border p-12 lg:p-20 flex flex-col justify-end relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1200" 
              alt="Sustainable Pet Living"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
            
            <div className="relative">
              <div className="absolute top-[-300px] right-0 p-12 mix-blend-multiply opacity-20 hidden lg:block">
                 <div className="w-40 h-40 rounded-full border border-primary flex items-center justify-center font-serif text-3xl italic">01.</div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent mb-4 block">Discover the Edit</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight text-primary italic">The Eco-Pet <br/>Companion</h2>
              <p className="text-accent/80 text-sm max-w-sm mb-8 leading-relaxed font-medium">
                Sustainable materials meet British comfort. Biodegradable toys and recycled wool beds for UK pets.
              </p>
              <button 
                onClick={() => { setCategory('Pet Products'); scrollToShop(); }}
                className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-primary group-hover:gap-4 transition-all pb-1 border-b border-primary w-fit"
              >
                Explore Collection <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="aspect-square lg:aspect-auto h-[600px] p-12 lg:p-20 flex flex-col justify-end relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=1200" 
              alt="British Slow Garden"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sage via-sage/40 to-transparent" />

            <div className="relative">
              <div className="absolute top-[-300px] right-0 p-12 mix-blend-multiply opacity-10 hidden lg:block">
                 <div className="w-40 h-40 rounded-full border border-primary flex items-center justify-center font-serif text-3xl italic">02.</div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent mb-4 block">Outdoor Living</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight text-primary italic">The British <br/>Slow Garden</h2>
              <p className="text-accent/80 text-sm max-w-sm mb-8 leading-relaxed font-medium">
                Weather-resistant tools and sustainable planters crafted by UK small makers for the modern gardener.
              </p>
              <button 
                onClick={() => { setCategory('Garden'); scrollToShop(); }}
                className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-primary group-hover:gap-4 transition-all pb-1 border-b border-primary w-fit"
              >
                Explore Garden <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Visual Story Collage Section */}
        <section className="mt-40 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent">Editorial Collective</span>
                <h2 className="text-4xl font-serif text-primary">The Artisan <br/><span className="italic">Perspective</span></h2>
              </div>
              <p className="text-xs uppercase tracking-widest font-bold text-accent opacity-40 max-w-xs text-right leading-loose">
                Capturing the essence of British craftsmanship and the quiet beauty of a sustainable home.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:h-[600px]">
              <div className="col-span-2 row-span-2 overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200" 
                  alt="Highlands" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
              </div>
              <div className="overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1518199266791-5375a02194bc?auto=format&fit=crop&q=80&w=600" 
                  alt="Craft Detail" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
              </div>
              <div className="overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1543332164-6e82f3555182?auto=format&fit=crop&q=80&w=600" 
                  alt="Workshop" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
              </div>
              <div className="col-span-2 overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1449156001437-3a13bed6cb07?auto=format&fit=crop&q=80&w=1200" 
                  alt="Cottage" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Editorial Style - UPDATED PREVIOUSLY */}

      {/* Newsletter Section - Editorial Focus */}
      <section className="relative overflow-hidden border-t border-b border-border bg-primary py-32 lg:py-52 mt-40">
        <img 
          src="https://images.unsplash.com/photo-1490312278390-ab6414f8d2f5?auto=format&fit=crop&q=80&w=2000" 
          alt="British Countryside Afternoon" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale scale-110"
        />
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center space-y-12">
          <div className="space-y-8">
            <div className="flex justify-center gap-1 opacity-40">
              <Star className="h-3 w-3 fill-white text-white" />
              <Star className="h-3 w-3 fill-white text-white" />
              <Star className="h-3 w-3 fill-white text-white" />
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-tight">
              The Nest <br/><span className="italic">Journal</span>
            </h2>
            <p className="text-cream/70 text-sm leading-relaxed max-w-md mx-auto font-medium uppercase tracking-widest text-[9px]">
              Weekly insights into sustainable living, energy saving tips, and exclusive previews from British makers.
            </p>
            <form 
              onSubmit={(e) => { e.preventDefault(); alert('Thank you for joining the BritNest circle!'); }}
              className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto border border-white/20 shadow-2xl mt-12"
            >
              <input 
                type="email" 
                placeholder="your@email.co.uk" 
                className="flex-1 bg-white/10 backdrop-blur-md text-white placeholder:text-white/40 p-5 text-xs font-bold uppercase tracking-widest focus:outline-none focus:bg-white/20 transition-all"
                required
              />
              <button 
                type="submit"
                className="bg-cream text-primary px-10 py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-all grow-0"
              >
                Join Now
              </button>
            </form>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">
              Guaranteed No-Spam Policy. Carbon-Neutral Communication.
            </p>
          </div>
        </div>
      </section>
      </main>

      <footer className="border-t border-border bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="text-4xl font-serif italic font-bold tracking-tighter text-primary mb-6">BritNest</div>
            <p className="text-xs uppercase tracking-widest text-accent font-bold opacity-40 leading-loose max-w-xs">
              Designing for the British home with a commitment to local makers, energy efficiency, and a sustainable future.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">The Collective</h4>
            <div className="flex flex-col space-y-3 text-[10px] uppercase tracking-widest font-bold text-accent opacity-60">
               <a href="#" className="hover:opacity-100 transition-opacity">Our Makers</a>
               <a href="#" className="hover:opacity-100 transition-opacity">Sustainability</a>
               <a href="#" className="hover:opacity-100 transition-opacity">Sourcing</a>
               <a href="#" className="hover:opacity-100 transition-opacity">Journal</a>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Assistance</h4>
            <div className="flex flex-col space-y-3 text-[10px] uppercase tracking-widest font-bold text-accent opacity-60">
               <a href="#" className="hover:opacity-100 transition-opacity">UK Shipping</a>
               <a href="#" className="hover:opacity-100 transition-opacity">Easy Returns</a>
               <a href="#" className="hover:opacity-100 transition-opacity">Contact Us</a>
               <a href="#" className="hover:opacity-100 transition-opacity">Affiliates</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-widest font-bold text-accent opacity-30">© 2026 BritNest Limited. Established London, UK.</p>
          <div className="flex gap-8 text-[9px] uppercase tracking-widest font-bold text-accent opacity-30">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>

      <CosyQuiz isOpen={isQuizOpen} setIsOpen={setIsQuizOpen} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
