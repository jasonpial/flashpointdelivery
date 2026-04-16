import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Users, Package, DollarSign, FileText, Clock, CheckCircle2, AlertCircle, UserPlus, X, Search, Filter, ArrowRight, MapPin, Weight, Info, Shield } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, limit, updateDoc, doc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';

export default function AdminView() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalShipments: 0,
    activeHandlers: 0,
    deliveredShipments: 0
  });
  const [allShipments, setAllShipments] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [handlers, setHandlers] = useState<any[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  useEffect(() => {
    // Fetch all shipments
    const shipmentsQuery = query(collection(db, 'shipments'), orderBy('createdAt', 'desc'));
    const unsubscribeShipments = onSnapshot(shipmentsQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllShipments(docs);
      
      const delivered = docs.filter((s: any) => s.status === 'Delivered').length;
      // Mock revenue calculation: 50,000 UGX per shipment
      const revenue = docs.length * 50000;
      
      setStats(prev => ({
        ...prev,
        totalRevenue: revenue,
        totalShipments: docs.length,
        deliveredShipments: delivered
      }));
    });

    // Fetch handlers
    const handlersQuery = query(collection(db, 'users'), where('role', '==', 'handler'));
    const unsubscribeHandlers = onSnapshot(handlersQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHandlers(docs);
      setStats(prev => ({ ...prev, activeHandlers: docs.length }));
    });

    // Fetch recent reports
    const reportsQuery = query(collection(db, 'reports'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribeReports = onSnapshot(reportsQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentReports(docs);
    });

    return () => {
      unsubscribeShipments();
      unsubscribeHandlers();
      unsubscribeReports();
    };
  }, []);

  const filteredShipments = useMemo(() => {
    return allShipments.filter(s => {
      const matchesSearch = s.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allShipments, searchTerm, statusFilter]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, 'MMM dd'),
        fullDate: startOfDay(date),
        revenue: 0,
        count: 0
      };
    }).reverse();

    allShipments.forEach(s => {
      const shipmentDate = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
      const dayIndex = last7Days.findIndex(d => 
        shipmentDate >= d.fullDate && shipmentDate < subDays(d.fullDate, -1)
      );
      if (dayIndex !== -1) {
        last7Days[dayIndex].revenue += 50000;
        last7Days[dayIndex].count += 1;
      }
    });

    return last7Days;
  }, [allShipments]);

  const handleAssignHandler = async (handlerUid: string, handlerName: string) => {
    if (!selectedShipmentId) return;
    setIsAssigning(true);
    try {
      await updateDoc(doc(db, 'shipments', selectedShipmentId), {
        handlerUid,
        handlerName,
        updatedAt: new Date().toISOString()
      });
      setShowAssignModal(false);
      setSelectedShipmentId(null);
    } catch (err) {
      console.error("Error assigning handler:", err);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* CEO Stats Grid */}
      <div className="relative">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden rounded-[3rem]">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" 
            alt="Analytics background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {[
            { label: "Total Revenue", value: `UGX ${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="text-brand-black" />, trend: "+12.5% vs last month", color: "bg-brand-yellow", filter: 'all' },
            { label: "Total Shipments", value: stats.totalShipments.toString(), icon: <Package className="text-white" />, trend: "Global volume", color: "bg-white/10", filter: 'all' },
            { label: "Active Handlers", value: stats.activeHandlers.toString(), icon: <Users className="text-brand-yellow" />, trend: "Elite security team", color: "bg-brand-yellow/10", filter: 'all' },
            { label: "Success Rate", value: `${stats.totalShipments > 0 ? Math.round((stats.deliveredShipments / stats.totalShipments) * 100) : 100}%`, icon: <CheckCircle2 className="text-green-500" />, trend: "Delivered on time", color: "bg-green-500/10", filter: 'Delivered' }
          ].map((stat, i) => (
            <motion.button 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setStatusFilter(stat.filter)}
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
        {/* Revenue Node */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Revenue Analytics</h2>
                <p className="text-slate-500 text-xs font-medium">Financial performance over the last 7 days</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-brand-yellow" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Revenue</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fac415" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#fac415" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1115', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                    itemStyle={{ color: '#fac415', fontWeight: 'bold', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#fac415" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Global Operations Node */}
          <div className="bg-brand-black-light rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-white/5 flex flex-wrap justify-between items-center gap-6">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Global Operations</h2>
                <p className="text-slate-500 text-xs font-medium">Real-time tracking of all elite shipments</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text"
                    placeholder="Search Tracking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-brand-yellow/50 transition-all w-64"
                  />
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-yellow/50 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Tracking ID</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Route</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Handler</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredShipments.length > 0 ? filteredShipments.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                      <td className="px-10 py-6 font-black text-sm text-brand-yellow uppercase tracking-widest">{row.trackingNumber}</td>
                      <td className="px-10 py-6 text-slate-300 font-medium text-sm">
                        {row.origin} → {row.destination}
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          row.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                          row.status === 'In Transit' ? 'bg-brand-yellow/10 text-brand-yellow' :
                          'bg-white/10 text-slate-500'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        {row.handlerName ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-brand-yellow/10 rounded-lg flex items-center justify-center text-brand-yellow">
                              <Users size={12} />
                            </div>
                            <span className="text-white text-xs font-black uppercase tracking-widest">{row.handlerName}</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              setSelectedShipmentId(row.id);
                              setShowAssignModal(true);
                            }}
                            className="flex items-center gap-2 text-brand-yellow text-[10px] font-black uppercase tracking-widest hover:underline"
                          >
                            <UserPlus size={14} />
                            Assign
                          </button>
                        )}
                      </td>
                      <td className="px-10 py-6">
                        <button 
                          onClick={() => setSelectedShipment(row)}
                          className="p-2 bg-white/5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Info size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-10 py-20 text-center">
                        <Package className="mx-auto text-slate-800 mb-4" size={48} />
                        <p className="text-slate-500 font-medium">No shipments found matching your criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Nodes */}
        <div className="lg:col-span-1 space-y-10">
          {/* Handler Performance Node */}
          <div className="bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <Users className="text-brand-yellow" size={24} />
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Elite Handlers</h2>
            </div>
            <div className="space-y-6">
              {handlers.slice(0, 5).map((handler, i) => {
                const handlerShipments = allShipments.filter(s => s.handlerUid === handler.uid);
                const deliveredCount = handlerShipments.filter(s => s.status === 'Delivered').length;
                return (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-black font-black">
                        {handler.name?.[0]}
                      </div>
                      <div>
                        <p className="text-white text-xs font-black uppercase tracking-widest">{handler.name}</p>
                        <p className="text-slate-500 text-[10px] font-medium">{handlerShipments.length} Assignments</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-brand-yellow text-xs font-black">{deliveredCount}</p>
                      <p className="text-slate-500 text-[8px] uppercase font-black">Success</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Handler Reports Node */}
          <div className="bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <FileText className="text-brand-yellow" size={24} />
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Field Reports</h2>
            </div>
            
            <div className="space-y-6">
              {recentReports.length > 0 ? recentReports.map((report, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-yellow/30 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-black text-white text-sm uppercase tracking-tight group-hover:text-brand-yellow transition-colors">{report.title}</h4>
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                      report.type === 'incident' ? 'bg-red-500/20 text-red-500' : 'bg-brand-yellow/20 text-brand-yellow'
                    }`}>
                      {report.type}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-4 font-medium">{report.content}</p>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>By: {report.handlerName || 'Unknown'}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {new Date(report.timestamp?.toDate?.() || report.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto text-slate-700 mb-4" size={32} />
                  <p className="text-slate-500 text-sm font-medium">No reports received yet.</p>
                </div>
              )}
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

      {/* Assign Handler Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAssignModal(false)}
              className="absolute inset-0 bg-brand-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-brand-black-light rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-8 bg-brand-yellow text-brand-black flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <UserPlus size={24} />
                  <h2 className="text-xl font-black uppercase tracking-tight">Assign Handler</h2>
                </div>
                <button onClick={() => setShowAssignModal(false)} className="hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                {handlers.length > 0 ? handlers.map((handler, i) => (
                  <button
                    key={i}
                    onClick={() => handleAssignHandler(handler.uid, handler.name)}
                    disabled={isAssigning}
                    className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 hover:border-brand-yellow/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-yellow/10 rounded-xl flex items-center justify-center text-brand-yellow">
                        <Users size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-black uppercase tracking-widest text-xs">{handler.name}</p>
                        <p className="text-slate-500 text-[10px]">{handler.email}</p>
                      </div>
                    </div>
                    <CheckCircle2 size={20} className="text-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )) : (
                  <div className="text-center py-10">
                    <AlertCircle className="mx-auto text-slate-700 mb-4" size={32} />
                    <p className="text-slate-500 text-sm font-medium">No active handlers found.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
