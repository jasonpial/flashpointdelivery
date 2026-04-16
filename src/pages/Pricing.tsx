import React from 'react';
import { motion } from 'motion/react';
import { Shield, Truck, MapPin, Clock, Info, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const rates = [
    {
      category: "Intra-City (Kampala)",
      items: [
        { name: "Small Package", weight: "Up to 1kg", price: "UGX 5,000", time: "Same Day" },
        { name: "Medium Box", weight: "1kg - 5kg", price: "UGX 10,000", time: "Same Day" },
        { name: "Large Parcel", weight: "5kg - 15kg", price: "UGX 25,000", time: "Next Day" }
      ]
    },
    {
      category: "Up-Country (Nationwide)",
      items: [
        { name: "Standard Delivery", weight: "Up to 2kg", price: "UGX 15,000", time: "24-48 Hours" },
        { name: "Bulk Cargo", weight: "2kg - 20kg", price: "UGX 45,000", time: "2-3 Days" },
        { name: "Heavy Duty", weight: "20kg+", price: "UGX 85,000+", time: "3-5 Days" }
      ]
    },
    {
      category: "Security & High Value",
      items: [
        { name: "Secure Document", weight: "Envelopes", price: "UGX 20,000", time: "Express" },
        { name: "Valuables Escort", weight: "Custom", price: "UGX 150,000", time: "Dedicated" },
        { name: "Cash-in-Transit", weight: "Custom", price: "Contact Us", time: "Scheduled" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-brand-black py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[50vh] opacity-[0.05] pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop" 
          alt="Pricing background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-black"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase"
          >
            ELITE <span className="text-brand-yellow">RATES</span>
          </motion.h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed">
            Simple, reliable pricing for all your delivery needs across Uganda. Choose the service that fits your timeline and budget.
          </p>
        </div>

        <div className="space-y-24">
          {rates.map((group, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h2 className="text-3xl font-black text-white mb-12 flex items-center gap-4 uppercase tracking-tight">
                <div className="w-3 h-10 bg-brand-yellow rounded-full shadow-[0_0_15px_rgba(250,204,21,0.4)]"></div>
                {group.category}
              </h2>
              <div className="grid md:grid-cols-3 gap-10">
                {group.items.map((item, j) => (
                  <div key={j} className="bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 hover:border-brand-yellow/30 transition-all group relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{item.name}</h3>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-6">{item.weight}</p>
                    <div className="text-3xl font-black text-brand-yellow mb-8 tracking-tighter">{item.price}</div>
                    <div className="flex items-center gap-3 text-slate-400 text-sm mb-10 font-bold">
                      <Clock size={18} className="text-brand-yellow" /> {item.time}
                    </div>
                    <ul className="space-y-4 mb-12">
                      <li className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                        <CheckCircle size={16} className="text-brand-yellow" /> Real-time Tracking
                      </li>
                      <li className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                        <CheckCircle size={16} className="text-brand-yellow" /> SMS Notifications
                      </li>
                      <li className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                        <CheckCircle size={16} className="text-brand-yellow" /> Secure Handling
                      </li>
                    </ul>
                    <Link 
                      to="/portal" 
                      className="block w-full py-4 bg-white/5 text-white text-center font-black uppercase tracking-widest text-xs rounded-2xl group-hover:bg-brand-yellow group-hover:text-brand-black transition-all border border-white/5"
                    >
                      Book Now
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 bg-brand-yellow/5 rounded-[3rem] p-16 text-white flex flex-col md:flex-row items-center justify-between gap-12 border border-brand-yellow/10 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-700">
            <img 
              src="https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=2071&auto=format&fit=crop" 
              alt="Consultation background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="max-w-xl text-center md:text-left relative z-10">
            <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">Need a Custom Quote?</h3>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">For bulk deliveries, recurring contracts, or specialized security requirements, our team is ready to provide a tailored solution.</p>
          </div>
          <button className="px-12 py-6 bg-brand-yellow text-brand-black font-black uppercase tracking-wider rounded-2xl hover:bg-brand-yellow-light transition-all shadow-lg shadow-brand-yellow/10 shrink-0 relative z-10">
            Contact Sales Team
          </button>
        </div>
      </div>
    </div>
  );
}
