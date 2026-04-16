import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../App';

// IMPORT YOUR LOGO IMAGE
import logo from '../assets/images/flashpointlogo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard');

  if (isDashboard) return null;

  return (
    <nav className="bg-brand-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Flashpoint Logo"
            className="h-15 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-400 hover:text-brand-yellow font-bold transition-colors">Home</Link>
          <Link to="/portal" className="text-slate-400 hover:text-brand-yellow font-bold transition-colors">Portal</Link>
          <Link to="/pricing" className="text-slate-400 hover:text-brand-yellow font-bold transition-colors">Pricing</Link>
          <Link to="/track/FP-UG-100200" className="text-slate-400 hover:text-brand-yellow font-bold transition-colors">Tracking</Link>
          {user ? (
            <Link 
              to="/dashboard" 
              className="px-6 py-2.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2"
            >
              <User size={18} />
              Dashboard
            </Link>
          ) : (
            <Link 
              to="/portal" 
              className="px-6 py-2.5 bg-brand-yellow text-brand-black font-bold rounded-xl hover:bg-brand-yellow-light transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)]"
            >
              SIGN IN
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-brand-black border-b border-white/5 p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <Link to="/" className="block text-slate-400 font-bold hover:text-brand-yellow" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/portal" className="block text-slate-400 font-bold hover:text-brand-yellow" onClick={() => setIsOpen(false)}>Portal</Link>
          <Link to="/pricing" className="block text-slate-400 font-bold hover:text-brand-yellow" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link to="/track/FP-UG-100200" className="block text-slate-400 font-bold hover:text-brand-yellow" onClick={() => setIsOpen(false)}>Tracking</Link>
          <Link 
            to={user ? "/dashboard" : "/portal"} 
            className="block w-full py-4 bg-brand-yellow text-brand-black font-bold rounded-xl text-center shadow-lg shadow-brand-yellow/10"
            onClick={() => setIsOpen(false)}
          >
            {user ? "Dashboard" : "SIGN IN"}
          </Link>
        </div>
      )}
    </nav>
  );
}
