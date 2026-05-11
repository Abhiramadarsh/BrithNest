import React from 'react';
import { ShoppingBag, Search, User, Menu, LogOut, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Menu className="h-5 w-5 text-accent lg:hidden" />
            <div className="hidden lg:flex items-center space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] text-accent opacity-60">
              <Link to="/" className="hover:opacity-100 transition-opacity">The Edit</Link>
              <a href="#" className="hover:opacity-100 transition-opacity">Sustainable Living</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Energy Guide</a>
            </div>
          </div>
          
          <Link to="/" className="text-3xl font-serif italic tracking-tighter font-bold text-primary">BritNest</Link>

          <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-[0.2em]">
            <div className="hidden sm:block bg-sage text-accent px-4 py-1.5 rounded-full">Free UK Delivery over £50</div>
            <button className="text-accent opacity-60 hover:opacity-100 transition-opacity">
              <Search className="h-4 w-4" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link to="/admin" className="p-2 text-accent hover:text-primary transition-colors flex items-center gap-2">
                    <span className="hidden lg:inline text-[9px] font-bold uppercase tracking-widest">Admin</span>
                    <Package className="h-4 w-4" />
                  </Link>
                )}
                <div className="flex flex-col items-end">
                  <span className="text-[8px] opacity-40">Good Day,</span>
                  <span className="text-primary truncate max-w-[80px]">{user.displayName || user.email?.split('@')[0]}</span>
                </div>
                <button onClick={logout} className="text-accent hover:text-red-600 transition-colors">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="text-primary hover:text-accent transition-colors">
                <User className="h-4 w-4" />
              </Link>
            )}

            <button className="text-primary hover:text-accent transition-colors flex items-center gap-2">
              <span className="hidden md:inline">Cart (2)</span>
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
