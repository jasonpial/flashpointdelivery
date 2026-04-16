import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Package, Users, Settings, LogOut, Shield, Bell, User } from 'lucide-react';
import { useAuth } from '../App';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Chat from '../components/Chat';
import AdminView from '../components/AdminView';
import HandlerView from '../components/HandlerView';
import ClientView from '../components/ClientView';
import NewShipmentModal from '../components/NewShipmentModal';
import SettingsView from '../components/SettingsView';
import CommunicationView from '../components/CommunicationView';

export default function Dashboard() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [showNewShipment, setShowNewShipment] = useState(false);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeNode, setActiveNode] = useState<'dashboard' | 'shipments' | 'network' | 'settings' | 'communication'>('dashboard');

  const isAdmin = profile?.role === 'admin' || user?.email === 'mimjum88@gmail.com';
  const isHandler = profile?.role === 'handler';
  const isClient = !isAdmin && !isHandler;

  useEffect(() => {
    if (!user) return;

    // Only fetch client shipments here if we are a client
    // Admin and Handler views handle their own specialized fetching
    if (isClient) {
      const q = query(
        collection(db, 'shipments'),
        where('clientUid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setShipments(docs);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user, isClient]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-80 bg-brand-black-light border-r border-white/5 flex flex-col z-[120] transition-transform duration-300 lg:translate-x-0
        ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}
        lg:flex
      `}>
        <div className="p-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)]">
              <Shield className="text-brand-black" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Flashpoint</h1>
              <span className="text-[10px] font-black text-brand-yellow uppercase tracking-widest">Elite Logistics</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'shipments', label: 'Shipments', icon: Package },
              { id: 'communication', label: 'Communication', icon: Bell },
              { id: 'network', label: 'Network', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNode(item.id as any);
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  activeNode === item.id 
                    ? 'bg-brand-yellow text-brand-black shadow-lg' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-10 border-t border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10">
              <User size={24} />
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-black uppercase tracking-widest text-[10px] truncate">{profile?.name || user?.email}</p>
              <p className="text-brand-yellow font-black uppercase tracking-widest text-[8px]">{profile?.role || 'Elite Client'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
          >
            <LogOut size={18} />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 p-6 lg:p-12 w-full overflow-x-hidden relative">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
            alt="Dashboard background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10">
          <header className="flex flex-wrap justify-between items-center mb-16 gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden w-12 h-12 bg-brand-black-light border border-white/5 rounded-xl flex items-center justify-center text-white"
            >
              <LayoutDashboard size={24} />
            </button>
            <div>
              <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tighter uppercase mb-2">
                {activeNode === 'settings' ? 'System Settings' : 
                 activeNode === 'communication' ? 'Secure Comms' :
                 isAdmin ? 'Command Center' : isHandler ? 'Field Operations' : 'Elite Portal'}
              </h2>
              <p className="text-slate-500 font-medium tracking-wide text-sm lg:text-base">
                Welcome back, <span className="text-white font-bold">{profile?.name?.split(' ')[0] || 'Agent'}</span>. System status: <span className="text-green-500 font-bold">OPTIMAL</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-brand-black-light border border-white/5 rounded-2xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Secure</span>
            </div>
            <button 
              onClick={() => setActiveNode('communication')}
              className={`p-4 bg-brand-black-light border border-white/5 rounded-2xl transition-all ${activeNode === 'communication' ? 'text-brand-yellow border-brand-yellow/30' : 'text-slate-500 hover:text-white'}`}
            >
              <Bell size={20} />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeNode === 'settings' ? (
              <SettingsView />
            ) : activeNode === 'communication' ? (
              <CommunicationView />
            ) : isAdmin ? (
              <AdminView />
            ) : isHandler ? (
              <HandlerView />
            ) : (
              <ClientView shipments={shipments} onNewShipment={() => setShowNewShipment(true)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>

      {/* New Shipment Modal */}
      <AnimatePresence>
        {showNewShipment && (
          <NewShipmentModal onClose={() => setShowNewShipment(false)} user={user} />
        )}
      </AnimatePresence>
    </div>
  );
}
