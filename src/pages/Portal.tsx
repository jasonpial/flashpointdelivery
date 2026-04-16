import React from 'react';
import { motion } from 'motion/react';
import { Globe, ShieldCheck, Zap, ArrowRight, Shield, Package, Users, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Portal() {
  return (
    <div className="min-h-screen bg-brand-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop" 
          alt="Logistics network" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase"
          >
            SECURE <span className="text-brand-yellow">SIGN IN</span>
          </motion.h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
            Select your destination to access your specialized Flashpoint dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-20">
          <div className="bg-brand-black-light rounded-[2.5rem] p-12 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <img 
                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2065&auto=format&fit=crop" 
                alt="Client portal" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-brand-yellow rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(250,204,21,0.2)] group-hover:scale-110 transition-transform">
                <Shield size={32} className="text-brand-black" />
              </div>
              <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Secure Client Portal</h2>
              <p className="text-slate-400 mb-10 text-lg font-medium leading-relaxed">Access your private dashboard to manage high-value shipments and secure documents.</p>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-3 px-10 py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-wider rounded-2xl hover:bg-brand-yellow-light transition-all shadow-lg shadow-brand-yellow/10"
              >
                Enter Secure Portal <ArrowRight size={20} />
              </Link>
            </div>
            <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Globe size={400} />
            </div>
          </div>

          <div className="bg-brand-black-light rounded-[2.5rem] p-12 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <img 
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop" 
                alt="Tracking" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                <Zap size={32} className="text-brand-yellow" />
              </div>
              <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Public Tracking</h2>
              <p className="text-slate-400 mb-10 text-lg font-medium leading-relaxed">Instantly check the status of any shipment using your unique Flashpoint ID.</p>
              <Link 
                to="/track/FP-UG-100200" 
                className="inline-flex items-center gap-3 px-10 py-5 bg-white/5 text-white font-black uppercase tracking-wider rounded-2xl hover:bg-white/10 transition-all border border-white/10"
              >
                Track Now <ArrowRight size={20} />
              </Link>
            </div>
            <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Zap size={400} />
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="mb-20 relative">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none -mx-20">
            <img 
              src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop" 
              alt="Network background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-grow bg-white/10"></div>
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Role-Based Access</h2>
              <div className="h-px flex-grow bg-white/10"></div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                role: "Client", 
                desc: "Request deliveries & track shipments", 
                icon: <Package size={24} />, 
                color: "bg-brand-yellow",
                textColor: "text-brand-black"
              },
              { 
                role: "Handler", 
                desc: "Manage assignments & field reports", 
                icon: <Users size={24} />, 
                color: "bg-white/10",
                textColor: "text-white"
              },
              { 
                role: "CEO / Admin", 
                desc: "Monitor revenue & global operations", 
                icon: <LayoutDashboard size={24} />, 
                color: "bg-brand-yellow/10",
                textColor: "text-brand-yellow"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-brand-black-light p-8 rounded-[2rem] border border-white/5 hover:border-brand-yellow/30 transition-all group"
              >
                <div className={`w-12 h-12 ${item.color} ${item.textColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{item.role}</h3>
                <p className="text-slate-500 text-sm font-medium mb-8">{item.desc}</p>
                <Link 
                  to={`/login?role=${item.role.toLowerCase().split(' ')[0]}`}
                  className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-brand-yellow transition-colors"
                >
                  Enter Dashboard <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-brand-yellow/5 rounded-[2.5rem] p-12 flex flex-wrap items-center justify-between gap-10 border border-brand-yellow/10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-brand-yellow rounded-3xl flex items-center justify-center text-brand-black shadow-[0_0_20px_rgba(250,204,21,0.2)]">
              <ShieldCheck size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Security First</h3>
              <p className="text-slate-400 font-medium">All Flashpoint deliveries are protected by our 24/7 elite security monitoring center.</p>
            </div>
          </div>
          <button className="px-10 py-5 bg-white/5 text-white font-black uppercase tracking-wider rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            Security Protocols
          </button>
        </div>
      </div>
    </div>
  );
}
