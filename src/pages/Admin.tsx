import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Product } from '../types';
import { Trash2, Plus, Package, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState('');

  // Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'Energy-saving',
    image: '',
    tags: [],
    madeInBritain: true,
    stock: 10
  });

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return unsubscribe;
  }, [isAdmin]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const productsRef = collection(db, 'products');
      await addDoc(productsRef, {
        ...newProduct,
        createdAt: serverTimestamp(),
      });
      setShowAddForm(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: 'Energy-saving',
        image: '',
        tags: [],
        madeInBritain: true,
        stock: 10
      });
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error: any) {
      alert('Delete failed: ' + error.message);
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center font-bold tracking-widest text-[10px] uppercase">Verifying Clearances...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-cream selection:bg-sage">
      <nav className="bg-white border-b border-border p-6 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="text-2xl font-serif italic tracking-tighter font-bold text-primary">BritNest</Link>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent opacity-40">Command Center</span>
          <div className="h-8 w-px bg-border"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{user?.email}</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-4xl font-serif text-primary tracking-tight">Product Control</h1>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent opacity-60">Manage your sustainable collection inventory.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary text-white px-8 py-4 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-accent transition-all"
          >
            {showAddForm ? 'Cancel Operation' : (
              <><Plus className="h-4 w-4" /> Deploy New Product</>
            )}
          </button>
        </header>

        <AnimatePresence>
          {showAddForm && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-border p-8 mb-16 space-y-8"
            >
              <h2 className="text-xl font-serif text-primary italic">Product Specification</h2>
              <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-8 text-[10px] font-bold uppercase tracking-widest">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="opacity-40">Product Name</label>
                    <input 
                      required
                      type="text" 
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full bg-cream p-4 border-b border-border focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. Recycled Wool Throw"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="opacity-40">Price (GBP)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className="w-full bg-cream p-4 border-b border-border focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="opacity-40">Category</label>
                    <select 
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-cream p-4 border-b border-border focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option>Energy-saving</option>
                      <option>Sustainable Homeware</option>
                      <option>Pet Products</option>
                      <option>Decor</option>
                      <option>Garden</option>
                      <option>Fragrance</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="opacity-40">Image URL (Unsplash preferred)</label>
                    <input 
                      required
                      type="url" 
                      value={newProduct.image}
                      onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      className="w-full bg-cream p-4 border-b border-border focus:outline-none focus:border-primary transition-colors"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="opacity-40">Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full bg-cream p-4 border-b border-border focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                </div>
                {formError && <p className="text-red-500 col-span-full">{formError}</p>}
                <button 
                  type="submit"
                  className="col-span-full bg-primary text-white p-5 hover:bg-accent transition-all"
                >
                  Confirm Deployment
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6">
          {loading ? (
            <p className="text-center py-20 text-[10px] font-bold uppercase tracking-widest opacity-40">Scanning archives...</p>
          ) : products.length === 0 ? (
             <p className="text-center py-20 text-[10px] font-bold uppercase tracking-widest opacity-40">Archive Empty.</p>
          ) : (
            products.map((product) => (
              <motion.div 
                layout
                key={product.id}
                className="bg-white border border-border p-6 flex flex-col md:flex-row items-center gap-8 group"
              >
                <div className="w-24 h-24 shrink-0 overflow-hidden bg-cream">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-serif italic text-primary">{product.name}</h3>
                    <span className="text-[8px] px-2 py-0.5 border border-border uppercase tracking-widest font-bold opacity-40">{product.category}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent opacity-40 line-clamp-1">{product.description}</p>
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-right">
                    <div className="text-[8px] uppercase tracking-widest font-bold opacity-40">Price</div>
                    <div className="text-sm font-bold text-primary">£{product.price}</div>
                  </div>
                  <div className="h-10 w-px bg-border"></div>
                  <button 
                    onClick={() => handleDeleteProduct(product.id!)}
                    className="p-3 text-accent hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
