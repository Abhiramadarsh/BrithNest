import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ChevronLeft, Chrome } from 'lucide-react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden bg-sage">
        <img 
          src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200" 
          alt="Sustainable Interior"
          className="w-full h-full object-cover grayscale opacity-60 mix-blend-multiply"
        />
        <div className="absolute inset-0 p-20 flex flex-col justify-end text-primary">
          <span className="text-xs uppercase tracking-[0.4em] font-bold mb-4 opacity-70">The Nest Journal</span>
          <h2 className="text-5xl font-serif italic font-bold leading-tight max-w-md">
            The standard for <br/>British sustainable <br/>living.
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-cream">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-12"
        >
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-accent opacity-40 hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Boutique
          </button>

          <div className="space-y-4">
            <h1 className="text-4xl font-serif text-primary tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-sm text-accent opacity-60 leading-relaxed font-bold uppercase tracking-widest text-[9px]">
              Join the BritNest community for curated sustainable updates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-accent opacity-60">Full Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white border border-border p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors"
                  placeholder="John Smith"
                  required
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-accent opacity-60">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-border p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors"
                placeholder="you@email.co.uk"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-accent opacity-60">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-border p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white p-5 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Register Account')} 
              {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-[8px] uppercase tracking-widest font-bold">
                <span className="bg-cream px-2 text-accent opacity-40">Or continue with</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full border border-border bg-white text-primary p-5 text-xs font-bold uppercase tracking-widest hover:bg-sage transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <Chrome className="h-4 w-4" /> Sign In with Google
            </button>
          </form>

          <div className="pt-8 border-t border-border text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors"
            >
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
