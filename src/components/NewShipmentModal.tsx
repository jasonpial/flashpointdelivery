import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, X, Shield, MapPin, Weight, Info, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { ITEM_CATEGORIES, UGANDA_REGIONS } from '../constants/deliveryItems';

interface NewShipmentModalProps {
  onClose: () => void;
  user: any;
}

export default function NewShipmentModal({ onClose, user }: NewShipmentModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [newTrackingId, setNewTrackingId] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    origin: 'Kampala City - Central',
    destination: 'Kampala City - Central',
    pickupAddress: '',
    destinationAddress: '',
    packageDetails: '',
    weight: '',
    selectedItems: [] as string[],
    customItem: '',
    pickupRequired: true,
    serviceTier: 'Standard Delivery'
  });

  const toggleItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(item)
        ? prev.selectedItems.filter(i => i !== item)
        : [...prev.selectedItems, item]
    }));
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const trackingNumber = `FP-UG-${Math.floor(100000 + Math.random() * 900000)}`;
      const finalItems = [...formData.selectedItems];
      if (formData.customItem.trim()) {
        finalItems.push(formData.customItem.trim());
      }

      await addDoc(collection(db, 'shipments'), {
        origin: formData.origin,
        destination: formData.destination,
        pickupAddress: formData.pickupAddress,
        destinationAddress: formData.destinationAddress,
        packageDetails: formData.packageDetails,
        weight: formData.weight,
        selectedItems: finalItems,
        pickupRequired: formData.pickupRequired,
        serviceTier: formData.serviceTier,
        trackingNumber,
        status: 'pending',
        clientUid: user.uid,
        clientEmail: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewTrackingId(trackingNumber);
      setIsSuccess(true);
    } catch (err) {
      console.error("Error creating shipment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-black/90 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-brand-black-light rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
      >
        {isSuccess ? (
          <div className="p-16 text-center">
            <div className="w-24 h-24 bg-brand-yellow text-brand-black rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
              <Shield size={48} />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">SHIPMENT SECURED</h2>
            <p className="text-slate-400 mb-10 font-medium text-lg">Your elite delivery request has been logged. A security handler will be assigned shortly.</p>
            
            <div className="bg-white/5 p-8 rounded-[2rem] mb-10 border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Elite Tracking ID</p>
              <p className="text-3xl font-black text-brand-yellow tracking-widest uppercase">{newTrackingId}</p>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-yellow-light transition-all shadow-xl"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="p-10 bg-brand-yellow text-brand-black flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Package size={28} />
                <h2 className="text-2xl font-black uppercase tracking-tight">New Elite Delivery</h2>
              </div>
              <button onClick={onClose} className="hover:rotate-90 transition-transform">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleCreateShipment} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide relative">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <img 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
                  alt="Shipment background" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Pickup Region</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <select 
                      required
                      value={formData.origin}
                      onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all text-white font-medium appearance-none"
                    >
                      {UGANDA_REGIONS.map(region => (
                        <option key={region} value={region} className="bg-brand-black">{region}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Destination Region</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <select 
                      required
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all text-white font-medium appearance-none"
                    >
                      {UGANDA_REGIONS.map(region => (
                        <option key={region} value={region} className="bg-brand-black">{region}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Detailed Pickup Address</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Plot 12, Kampala Rd, Level 4"
                    value={formData.pickupAddress}
                    onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Detailed Destination Address</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Entebbe Airport, Cargo Section"
                    value={formData.destinationAddress}
                    onChange={(e) => setFormData({...formData, destinationAddress: e.target.value})}
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Select Items to Deliver</label>
                <div className="space-y-4">
                  {ITEM_CATEGORIES.map((cat) => (
                    <div key={cat.name} className="border border-white/5 rounded-2xl overflow-hidden">
                      <button 
                        type="button"
                        onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)}
                        className="w-full px-6 py-4 bg-white/5 flex justify-between items-center hover:bg-white/10 transition-colors"
                      >
                        <span className="text-xs font-black text-white uppercase tracking-widest">{cat.name}</span>
                        {expandedCategory === cat.name ? <ChevronUp size={18} className="text-brand-yellow" /> : <ChevronDown size={18} className="text-slate-500" />}
                      </button>
                      <AnimatePresence>
                        {expandedCategory === cat.name && (
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-brand-black/40"
                          >
                            <div className="p-6 grid grid-cols-2 gap-3">
                              {cat.items.map(item => (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => toggleItem(item)}
                                  className={`flex items-center gap-3 p-3 rounded-xl text-left text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    formData.selectedItems.includes(item) 
                                      ? 'bg-brand-yellow text-brand-black' 
                                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                  }`}
                                >
                                  {formData.selectedItems.includes(item) ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                                  {item}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Other Item (Not listed above)</label>
                <input 
                  type="text" 
                  placeholder="Enter custom item name..."
                  value={formData.customItem}
                  onChange={(e) => setFormData({...formData, customItem: e.target.value})}
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all text-white font-medium"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Estimated Weight (kg)</label>
                  <div className="relative">
                    <Weight className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                      required
                      type="number" 
                      placeholder="0.5"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all text-white font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Service Tier</label>
                  <select 
                    value={formData.serviceTier}
                    onChange={(e) => setFormData({...formData, serviceTier: e.target.value})}
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all text-white font-black uppercase tracking-widest text-xs appearance-none"
                  >
                    <option className="bg-brand-black">Standard Delivery</option>
                    <option className="bg-brand-black">Express Secure</option>
                    <option className="bg-brand-black">High-Value Escort</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex-grow">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Request Pickup</h4>
                  <p className="text-[10px] text-slate-500 font-medium">We'll collect the package from your location.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, pickupRequired: !formData.pickupRequired})}
                  className={`w-14 h-8 rounded-full relative transition-colors ${formData.pickupRequired ? 'bg-brand-yellow' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${formData.pickupRequired ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Additional Instructions</label>
                <textarea 
                  rows={3}
                  placeholder="Any special handling instructions..."
                  value={formData.packageDetails}
                  onChange={(e) => setFormData({...formData, packageDetails: e.target.value})}
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all text-white font-medium"
                ></textarea>
              </div>

              <div className="p-6 bg-brand-yellow/5 rounded-2xl flex gap-4 text-sm text-brand-yellow border border-brand-yellow/10">
                <Info size={24} className="shrink-0" />
                <p className="font-medium leading-relaxed">By submitting this request, you agree to our elite security protocols. A handler will be assigned to your shipment within 30 minutes.</p>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-yellow-light transition-all shadow-xl shadow-brand-yellow/10 flex items-center justify-center gap-3"
              >
                {isSubmitting ? <div className="w-5 h-5 border-2 border-brand-black border-t-transparent rounded-full animate-spin" /> : null}
                Confirm Delivery Request
              </button>
            </div>
          </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
