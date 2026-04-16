import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, TrendingUp, Clock, CheckCircle2, Info, X, Shield, MapPin, ArrowRight, Weight, Plus, Users } from 'lucide-react';

interface ClientViewProps {
  shipments: any[];
  onNewShipment: () => void;
}

export default function ClientView({ shipments, onNewShipment }: ClientViewProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'In Transit' | 'Delivered'>('all');
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  const filteredShipments = shipments.filter(s => 
    statusFilter === 'all' || s.status === statusFilter
  );

  const stats = {
    active: shipments.filter(s => s.status !== 'Delivered').length,
    completed: shipments.filter(s => s.status === 'Delivered').length,
    total: shipments.length
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Stats Grid */}
      <div className="relative">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden rounded-[3rem]">
          <img 
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop" 
            alt="Client background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { label: "Active Deliveries", value: stats.active.toString(), icon: <Package className="text-brand-black" />, trend: "Real-time tracking", color: "bg-brand-yellow", filter: 'pending' },
            { label: "Total Completed", value: stats.completed.toString(), icon: <TrendingUp className="text-white" />, trend: "Success rate 100%", color: "bg-white/10", filter: 'Delivered' },
            { label: "Total Registered", value: stats.total.toString(), icon: <Clock className="text-brand-yellow" />, trend: "Elite history", color: "bg-brand-yellow/10", filter: 'all' }
          ].map((stat, i) => (
            <motion.button 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setStatusFilter(stat.filter as any)}
              className={`text-left bg-brand-black-light p-8 rounded-[2.5rem] border transition-all ${statusFilter === stat.filter ? 'border-brand-yellow shadow-[0_0_30px_rgba(250,204,21,0.1)]' : 'border-white/5 shadow-2xl hover:border-white/20'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 ${stat.color} rounded-3xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Shipments Node */}
        <div className="lg:col-span-2 bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">My Shipments</h2>
              <p className="text-slate-500 text-sm font-medium">Tracking your secure assets across the network.</p>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'In Transit', 'Delivered'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f as any)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    statusFilter === f ? 'bg-brand-yellow text-brand-black' : 'bg-white/5 text-slate-500 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredShipments.length > 0 ? filteredShipments.map((shipment, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedShipment(shipment)}
                className="bg-white/5 p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-brand-yellow/30 transition-all group cursor-pointer"
              >
                <div className="flex flex-wrap justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-brand-yellow/10 rounded-3xl flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-black transition-all">
                      <Package size={28} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Tracking ID</p>
                      <h3 className="text-xl font-black text-white tracking-widest">{shipment.trackingNumber}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Route</p>
                      <p className="text-white text-sm font-black uppercase tracking-widest">{shipment.origin} → {shipment.destination}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      shipment.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                      shipment.status === 'In Transit' ? 'bg-brand-yellow/10 text-brand-yellow' :
                      shipment.status === 'pending' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-white/10 text-slate-500'
                    }`}>
                      {shipment.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="bg-white/5 rounded-[2.5rem] p-20 border border-white/5 text-center shadow-2xl">
                <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-700 mx-auto mb-8">
                  <Package size={40} />
                </div>
                <h3 className="font-black text-white mb-3 uppercase tracking-tight">No Shipments Found</h3>
                <p className="text-slate-500 text-sm font-medium mb-8">You haven't registered any elite deliveries yet.</p>
                <button 
                  onClick={onNewShipment}
                  className="px-8 py-4 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-yellow-light transition-all"
                >
                  Register First Shipment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nodes */}
        <div className="lg:col-span-1 space-y-10">
          {/* Quick Actions Node */}
          <div className="bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h3 className="text-white font-black text-xl uppercase tracking-tight mb-8">Quick Actions</h3>
            <div className="space-y-4">
              <button 
                onClick={onNewShipment}
                className="w-full p-6 bg-brand-yellow text-brand-black rounded-2xl flex items-center justify-between group hover:bg-brand-yellow-light transition-all"
              >
                <div className="flex items-center gap-4">
                  <Plus size={20} />
                  <span className="font-black uppercase tracking-widest text-xs">New Delivery</span>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full p-6 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <Shield size={20} />
                  <span className="font-black uppercase tracking-widest text-xs">Upgrade Security</span>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Security Status Node */}
          <div className="bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <Shield className="text-brand-yellow" size={24} />
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Security Status</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Encryption</span>
                <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">Active</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="h-full bg-brand-yellow"
                />
              </div>
              <p className="text-slate-500 text-[10px] font-medium leading-relaxed">
                All shipment data is protected by military-grade end-to-end encryption. Your assets are monitored 24/7 by our elite handler network.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Detail Modal */}
      <AnimatePresence>
        {selectedShipment && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedShipment(null)}
              className="absolute inset-0 bg-brand-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-brand-black-light rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-10 bg-brand-yellow text-brand-black flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Shield size={32} />
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Shipment Intelligence</h2>
                    <p className="text-brand-black/60 text-[10px] font-black uppercase tracking-widest">Tracking: {selectedShipment.trackingNumber}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedShipment(null)} className="hover:rotate-90 transition-transform">
                  <X size={32} />
                </button>
              </div>
              
              <div className="p-10 space-y-10">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Handler Information</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white">
                          <Users size={20} />
                        </div>
                        <div>
                          <p className="text-white font-black uppercase tracking-widest text-xs">{selectedShipment.handlerName || 'Awaiting Assignment'}</p>
                          <p className="text-slate-500 text-[10px]">{selectedShipment.handlerName ? 'Elite Handler' : 'Security Queue'}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Route Logistics</p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-4 text-white">
                          <MapPin size={18} className="text-brand-yellow shrink-0 mt-1" />
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">From: {selectedShipment.origin}</p>
                            <p className="text-sm font-black uppercase tracking-widest">{selectedShipment.pickupAddress || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 text-white">
                          <MapPin size={18} className="text-green-500 shrink-0 mt-1" />
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">To: {selectedShipment.destination}</p>
                            <p className="text-sm font-black uppercase tracking-widest">{selectedShipment.destinationAddress || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Package Specifications</p>
                      <div className="flex items-center gap-3 text-white">
                        <Weight size={18} className="text-brand-yellow" />
                        <span className="text-sm font-black uppercase tracking-widest">{selectedShipment.weight} KG</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Service Tier</p>
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-brand-yellow/10 border border-brand-yellow/20 rounded-xl">
                          <span className="text-brand-yellow text-[10px] font-black uppercase tracking-widest">{selectedShipment.serviceTier || 'Standard Delivery'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Manifest Contents</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedShipment.selectedItems?.map((item: string, i: number) => (
                      <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
                        {item}
                      </span>
                    )) || <span className="text-slate-500 text-xs italic">No manifest items listed</span>}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${
                      selectedShipment.status === 'Delivered' ? 'bg-green-500' : 'bg-brand-yellow'
                    }`} />
                    <span className="text-white font-black uppercase tracking-widest text-xs">Status: {selectedShipment.status}</span>
                  </div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    Registered: {new Date(selectedShipment.createdAt?.toDate?.() || selectedShipment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
