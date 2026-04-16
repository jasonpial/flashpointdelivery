import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Users, MessageSquare, FileText, CheckCircle2, Clock, MapPin, X, Send, AlertCircle, TrendingUp, Shield, ArrowRight, Weight, Info } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';

export default function HandlerView() {
  const { user, profile } = useAuth();
  const [assignedShipments, setAssignedShipments] = useState<any[]>([]);
  const [myReports, setMyReports] = useState<any[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({
    title: '',
    content: '',
    type: 'daily'
  });
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  const stats = useMemo(() => {
    const total = assignedShipments.length;
    const delivered = assignedShipments.filter(s => s.status === 'Delivered').length;
    const inTransit = assignedShipments.filter(s => s.status === 'In Transit').length;
    const successRate = total > 0 ? Math.round((delivered / total) * 100) : 100;
    
    return { total, delivered, inTransit, successRate };
  }, [assignedShipments]);

  useEffect(() => {
    if (!user) return;

    // Fetch shipments assigned to this handler
    const q = query(
      collection(db, 'shipments'),
      where('handlerUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssignedShipments(docs);
    });

    // Fetch handler's own reports
    const reportsQ = query(
      collection(db, 'reports'),
      where('handlerUid', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribeReports = onSnapshot(reportsQ, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyReports(docs);
    });

    return () => {
      unsubscribe();
      unsubscribeReports();
    };
  }, [user]);

  const handleUpdateStatus = async (shipmentId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'shipments', shipmentId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsReporting(true);

    try {
      await addDoc(collection(db, 'reports'), {
        handlerUid: user.uid,
        handlerName: profile?.name || 'Unknown',
        title: reportData.title,
        content: reportData.content,
        type: reportData.type,
        timestamp: serverTimestamp()
      });
      setReportSuccess(true);
      setReportData({ title: '', content: '', type: 'daily' });
      setTimeout(() => {
        setReportSuccess(false);
        setShowReportForm(false);
      }, 3000);
    } catch (err) {
      console.error("Error sending report:", err);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Handler Stats Grid */}
      <div className="relative">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden rounded-[3rem]">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
            alt="Operations background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {[
            { label: "Active Tasks", value: stats.inTransit.toString(), icon: <Clock className="text-brand-yellow" />, color: "bg-brand-yellow/10" },
            { label: "Total Completed", value: stats.delivered.toString(), icon: <CheckCircle2 className="text-green-500" />, color: "bg-green-500/10" },
            { label: "Success Rate", value: `${stats.successRate}%`, icon: <TrendingUp className="text-white" />, color: "bg-white/10" },
            { label: "Total Assignments", value: stats.total.toString(), icon: <Package className="text-brand-black" />, color: "bg-brand-yellow" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-black-light p-8 rounded-[2.5rem] border border-white/5 shadow-2xl"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                {stat.icon}
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Active Assignments Node */}
        <div className="lg:col-span-2 bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
          <div className="flex flex-wrap justify-between items-center gap-6">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Operation Manifest</h2>
              <p className="text-slate-500 text-sm font-medium">Manage your assigned elite deliveries.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => window.open('https://wa.me/256700000000', '_blank')}
                className="px-6 py-4 bg-green-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center gap-3 hover:bg-green-600 transition-all shadow-lg shadow-green-500/10"
              >
                <MessageSquare size={18} />
                WhatsApp Support
              </button>
              <button 
                onClick={() => setShowReportForm(true)}
                className="px-6 py-4 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center gap-3 hover:bg-brand-yellow-light transition-all shadow-lg shadow-brand-yellow/10"
              >
                <FileText size={18} />
                Transmit Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {assignedShipments.length > 0 ? assignedShipments.map((shipment, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-brand-yellow/30 transition-all group"
              >
                <div className="flex flex-wrap justify-between items-center gap-6 mb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-brand-yellow/10 rounded-3xl flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-black transition-all">
                      <Package size={28} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Tracking ID</p>
                      <h3 className="text-xl font-black text-white tracking-widest">{shipment.trackingNumber}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      shipment.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                      shipment.status === 'In Transit' ? 'bg-brand-yellow/10 text-brand-yellow' :
                      'bg-white/10 text-slate-500'
                    }`}>
                      {shipment.status}
                    </span>
                    <button 
                      onClick={() => setSelectedShipment(shipment)}
                      className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Info size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="flex items-center gap-4 text-slate-300">
                    <MapPin size={18} className="text-brand-yellow" />
                    <span className="text-sm font-black uppercase tracking-widest">{shipment.origin} → {shipment.destination}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <Users size={18} className="text-brand-yellow" />
                    <span className="text-sm font-black uppercase tracking-widest">Client: {shipment.clientName || 'Elite Client'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => handleUpdateStatus(shipment.id, 'In Transit')}
                    disabled={shipment.status === 'In Transit' || shipment.status === 'Delivered'}
                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    <Clock size={14} />
                    Set In Transit
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(shipment.id, 'Delivered')}
                    disabled={shipment.status === 'Delivered'}
                    className="flex-1 py-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-green-500 hover:bg-green-500/20 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} />
                    Confirm Delivery
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="bg-white/5 rounded-[2.5rem] p-20 border border-white/5 text-center shadow-2xl">
                <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-700 mx-auto mb-8">
                  <Package size={40} />
                </div>
                <h3 className="font-black text-white mb-3 uppercase tracking-tight">No Assigned Shipments</h3>
                <p className="text-slate-500 text-sm font-medium">You currently have no active elite delivery assignments.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nodes */}
        <div className="lg:col-span-1 space-y-10">
          {/* Report History Node */}
          <div className="bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <FileText className="text-brand-yellow" size={24} />
              <h2 className="text-xl font-black text-white uppercase tracking-tight">My Reports</h2>
            </div>
            <div className="space-y-6">
              {myReports.length > 0 ? myReports.map((report, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-yellow/30 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-black text-white text-xs uppercase tracking-tight group-hover:text-brand-yellow transition-colors">{report.title}</h4>
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                      report.type === 'incident' ? 'bg-red-500/20 text-red-500' : 'bg-brand-yellow/20 text-brand-yellow'
                    }`}>
                      {report.type}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px] line-clamp-2 mb-4 font-medium">{report.content}</p>
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-500">
                    <Clock size={10} />
                    <span>{new Date(report.timestamp?.toDate?.() || report.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-xs font-medium">No reports sent yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Support Node */}
          <div className="bg-brand-yellow p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Shield size={120} />
            </div>
            <h3 className="text-brand-black font-black text-2xl uppercase tracking-tighter mb-4 relative z-10">Elite Support</h3>
            <p className="text-brand-black/70 text-sm font-medium mb-8 relative z-10">Need tactical assistance or have an operational emergency?</p>
            <button className="w-full py-4 bg-brand-black text-brand-yellow font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-black/90 transition-all relative z-10">
              Contact HQ
            </button>
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
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Client Information</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white">
                          <Users size={20} />
                        </div>
                        <div>
                          <p className="text-white font-black uppercase tracking-widest text-xs">{selectedShipment.clientName || 'Elite Client'}</p>
                          <p className="text-slate-500 text-[10px]">{selectedShipment.clientEmail || 'Private Registry'}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Route Logistics</p>
                      <div className="flex items-center gap-4 text-white">
                        <MapPin size={18} className="text-brand-yellow" />
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black uppercase tracking-widest">{selectedShipment.origin}</span>
                          <ArrowRight size={14} className="text-slate-600" />
                          <span className="text-sm font-black uppercase tracking-widest">{selectedShipment.destination}</span>
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

      {/* Report Modal */}
      <AnimatePresence>
        {showReportForm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportForm(false)}
              className="absolute inset-0 bg-brand-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-brand-black-light rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
            >
              {reportSuccess ? (
                <div className="p-16 text-center">
                  <div className="w-24 h-24 bg-green-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">REPORT SENT</h2>
                  <p className="text-slate-400 font-medium text-lg">Your field report has been securely transmitted to the CEO dashboard.</p>
                </div>
              ) : (
                <>
                  <div className="p-10 bg-brand-yellow text-brand-black flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <FileText size={28} />
                      <h2 className="text-2xl font-black uppercase tracking-tight">Field Report</h2>
                    </div>
                    <button onClick={() => setShowReportForm(false)} className="hover:rotate-90 transition-transform">
                      <X size={28} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSendReport} className="p-10 space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Report Title</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g., Daily Operations Summary"
                        value={reportData.title}
                        onChange={(e) => setReportData({...reportData, title: e.target.value})}
                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Report Type</label>
                      <select 
                        value={reportData.type}
                        onChange={(e) => setReportData({...reportData, type: e.target.value})}
                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all text-white font-black uppercase tracking-widest text-xs appearance-none"
                      >
                        <option value="daily" className="bg-brand-black">Daily Summary</option>
                        <option value="weekly" className="bg-brand-black">Weekly Overview</option>
                        <option value="incident" className="bg-brand-black">Incident Report</option>
                        <option value="general" className="bg-brand-black">General Update</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Report Content</label>
                      <textarea 
                        required
                        rows={5}
                        placeholder="Detailed report content..."
                        value={reportData.content}
                        onChange={(e) => setReportData({...reportData, content: e.target.value})}
                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all text-white font-medium"
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      disabled={isReporting}
                      className="w-full py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-yellow-light transition-all shadow-xl shadow-brand-yellow/10 flex items-center justify-center gap-3"
                    >
                      {isReporting ? <div className="w-5 h-5 border-2 border-brand-black border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
                      Transmit Report
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
