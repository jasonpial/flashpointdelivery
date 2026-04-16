import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../App';

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: <Home size={24} />, label: "Home", path: "/" },
    { icon: <Search size={24} />, label: "Track", path: "/track/LOG-123456" },
    { icon: <LayoutDashboard size={24} />, label: "Portal", path: "/portal" },
    { icon: <User size={24} />, label: user ? "Dash" : "SIGN IN", path: user ? "/dashboard" : "/portal" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brand-black border-t border-white/5 flex justify-around items-center h-20 px-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
      {navItems.map((item, i) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <Link 
            key={i} 
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-brand-yellow scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-brand-yellow/10' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
