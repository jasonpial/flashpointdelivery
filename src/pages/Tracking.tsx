import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Package, MapPin, Calendar, Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function Tracking() {
  const { id } = useParams();
  const [trackingId, setTrackingId] = useState(id || '');
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;
    
    setLoading(true);
    // Mock tracking search
    setTimeout(() => {
      setShipment({
        id: trackingId,
        status: 'In Transit',
        origin: 'Kampala, UG',
        destination: 'Mbarara, UG',
        lastUpdate: 'Package scanned at Mbarara Hub',
        timestamp: new Date().toISOString(),
        history: [
          { status: 'Picked Up', location: 'Kampala Central', time: '2024-03-01 09:00' },
          { status: 'In Transit', location: 'Masaka Road', time: '2024-03-01 14:30' },
          { status: 'Arrived at Facility', location: 'Mbarara Hub', time: '2024-03-02 02:15' },
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-black py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=2018&auto=format&fit=crop" 
          alt="Tracking background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase"
          >
            TRACK YOUR <span className="text-brand-yellow">PACKAGE</span>
          </motion.h1>
          <p className="text-slate-400 font-medium text-lg">Enter your Flashpoint ID for real-time elite security updates.</p>
        </div>

        <form onSubmit={handleSearch} className="mb-20">
          <div className="relative group">
            <div className="absolute -inset-1 bg-brand-yellow/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-focus-within:opacity-100"></div>
            <div className="relative flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter Tracking ID (e.g. FP-UG-100200)"
                className="flex-1 px-8 py-6 bg-brand-black-light rounded-2xl border border-white/10 focus:ring-2 focus:ring-brand-yellow/50 outline-none text-xl font-black text-white placeholder:text-slate-600 transition-all uppercase tracking-widest"
              />
              <button 
                type="submit"
                className="px-12 py-6 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-brand-yellow-light transition-all shadow-lg shadow-brand-yellow/10 flex items-center justify-center gap-3 shrink-0"
              >
                <Search size={20} />
                Track Live
              </button>
            </div>
          </div>
        </form>

        {loading && (
          <div className="flex justify-center py-24">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-brand-yellow/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-yellow rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
        )}

        {shipment && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-black-light rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden"
          >
            <div className="p-10 bg-brand-yellow text-brand-black">
              <div className="flex flex-wrap justify-between items-center gap-6">
                <div>
                  <p className="text-brand-black/60 text-[10px] font-black uppercase tracking-widest mb-2">Flashpoint Elite Tracking ID</p>
                  <h2 className="text-3xl font-black tracking-tighter uppercase">{shipment.id}</h2>
                </div>
                <div className="px-8 py-3 bg-brand-black text-brand-yellow rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">
                  {shipment.status}
                </div>
              </div>
            </div>

            <div className="p-10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <img 
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop" 
                  alt="Logistics background" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10">
                <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div className="flex gap-6 group">
                  <div className="w-16 h-16 bg-brand-yellow/10 rounded-3xl flex items-center justify-center text-brand-yellow border border-brand-yellow/20 group-hover:scale-110 transition-transform">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Origin Point</p>
                    <p className="text-xl font-black text-white uppercase tracking-tight">{shipment.origin}</p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="w-16 h-16 bg-brand-yellow/10 rounded-3xl flex items-center justify-center text-brand-yellow border border-brand-yellow/20 group-hover:scale-110 transition-transform">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Destination Point</p>
                    <p className="text-xl font-black text-white uppercase tracking-tight">{shipment.destination}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <h3 className="text-xl font-black text-white border-b border-white/5 pb-6 flex items-center gap-4 uppercase tracking-tight">
                  <Clock size={24} className="text-brand-yellow" /> Security Log History
                </h3>
                <div className="relative pl-10 space-y-12">
                  <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-white/5"></div>
                  {shipment.history.map((item: any, i: number) => (
                    <div key={i} className="relative group">
                      <div className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full border-4 border-brand-black-light transition-all duration-500 ${i === 0 ? 'bg-brand-yellow shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-125' : 'bg-white/10'}`}></div>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                        <div>
                          <p className={`font-black uppercase tracking-tight text-lg ${i === 0 ? 'text-brand-yellow' : 'text-white'}`}>{item.status}</p>
                          <p className="text-slate-500 font-medium">{item.location}</p>
                        </div>
                        <p className="text-slate-600 text-xs font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );
}
