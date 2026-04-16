import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Users, Shield, Bell, Phone as WhatsApp, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';

export default function CommunicationView() {
  const { profile, user } = useAuth();
  const [activeChat, setActiveChat] = useState<'broadcast' | 'direct' | 'reports'>('broadcast');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [directMessages, setDirectMessages] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);

  const isAdmin = profile?.role === 'admin' || user?.email === 'mimjum88@gmail.com';
  const isHandler = profile?.role === 'handler';

  useEffect(() => {
    if (!user) return;

    // Fetch broadcasts (CEO to all)
    const broadcastQuery = query(collection(db, 'broadcasts'), orderBy('timestamp', 'desc'));
    const unsubscribeBroadcast = onSnapshot(broadcastQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch available users for direct chat
    if (isHandler) {
      // Handlers see their assigned clients
      const q = query(collection(db, 'shipments'), where('handlerUid', '==', user.uid));
      const unsubscribeUsers = onSnapshot(q, (snapshot) => {
        const clients = snapshot.docs.map(doc => ({
          uid: doc.data().clientUid,
          name: doc.data().clientName || 'Elite Client',
          email: doc.data().clientEmail
        }));
        // Unique clients
        const uniqueClients = Array.from(new Map(clients.map(c => [c.uid, c])).values());
        setAvailableUsers(uniqueClients);
      });
      return () => { unsubscribeBroadcast(); unsubscribeUsers(); };
    } else if (!isAdmin) {
      // Clients see their assigned handlers
      const q = query(collection(db, 'shipments'), where('clientUid', '==', user.uid));
      const unsubscribeUsers = onSnapshot(q, (snapshot) => {
        const handlers = snapshot.docs
          .filter(doc => doc.data().handlerUid)
          .map(doc => ({
            uid: doc.data().handlerUid,
            name: doc.data().handlerName || 'Elite Handler',
            email: 'Handler'
          }));
        const uniqueHandlers = Array.from(new Map(handlers.map(h => [h.uid, h])).values());
        setAvailableUsers(uniqueHandlers);
      });
      return () => { unsubscribeBroadcast(); unsubscribeUsers(); };
    }

    // Fetch reports if admin
    if (isAdmin) {
      const reportsQuery = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
      const unsubscribeReports = onSnapshot(reportsQuery, (snapshot) => {
        setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => {
        unsubscribeBroadcast();
        unsubscribeReports();
      };
    }

    return () => unsubscribeBroadcast();
  }, [user, isAdmin, isHandler]);

  // Fetch direct messages when a user is selected
  useEffect(() => {
    if (!user || !selectedUser) return;

    const chatId = [user.uid, selectedUser.uid].sort().join('_');
    const q = query(
      collection(db, 'direct_messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDirectMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user, selectedUser]);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isAdmin || isSending) return;
    setIsSending(true);

    try {
      await addDoc(collection(db, 'broadcasts'), {
        content: message,
        senderName: profile?.name || 'CEO',
        senderRole: 'admin',
        timestamp: serverTimestamp()
      });
      setMessage('');
    } catch (err) {
      console.error("Error sending broadcast:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser || isSending) return;
    setIsSending(true);

    const chatId = [user!.uid, selectedUser.uid].sort().join('_');

    try {
      await addDoc(collection(db, 'direct_messages'), {
        chatId,
        content: message,
        senderUid: user!.uid,
        senderName: profile?.name || 'User',
        timestamp: serverTimestamp()
      });
      setMessage('');
    } catch (err) {
      console.error("Error sending direct message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isHandler || isSending) return;
    setIsSending(true);

    try {
      await addDoc(collection(db, 'reports'), {
        content: message,
        title: `Field Report - ${new Date().toLocaleDateString()}`,
        handlerName: profile?.name || 'Handler',
        handlerUid: user?.uid,
        type: 'update',
        timestamp: serverTimestamp()
      });
      setMessage('');
      setActiveChat('broadcast'); // Switch back after sending
    } catch (err) {
      console.error("Error sending report:", err);
    } finally {
      setIsSending(false);
    }
  };

  const openWhatsApp = (phone: string = '256700000000') => {
    const url = `https://wa.me/${phone.replace(/\D/g, '')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="grid lg:grid-cols-4 gap-10 h-[calc(100vh-250px)]">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-brand-black-light p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <h3 className="text-white font-black text-xs uppercase tracking-widest mb-6 px-2">Channels</h3>
          <div className="space-y-2">
            <button
              onClick={() => setActiveChat('broadcast')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                activeChat === 'broadcast' ? 'bg-brand-yellow text-brand-black' : 'text-slate-500 hover:bg-white/5'
              }`}
            >
              <Bell size={18} />
              Broadcasts
            </button>
            {!isAdmin && (
              <button
                onClick={() => setActiveChat('direct')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  activeChat === 'direct' ? 'bg-brand-yellow text-brand-black' : 'text-slate-500 hover:bg-white/5'
                }`}
              >
                <MessageSquare size={18} />
                Direct Comms
              </button>
            )}
            {isHandler && (
              <button
                onClick={() => setActiveChat('reports')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  activeChat === 'reports' ? 'bg-brand-yellow text-brand-black' : 'text-slate-500 hover:bg-white/5'
                }`}
              >
                <FileText size={18} />
                Send Report
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setActiveChat('reports')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  activeChat === 'reports' ? 'bg-brand-yellow text-brand-black' : 'text-slate-500 hover:bg-white/5'
                }`}
              >
                <FileText size={18} />
                Field Reports
              </button>
            )}
            {(isHandler || !isAdmin) && (
              <button
                onClick={() => openWhatsApp()}
                className="w-full flex items-center gap-4 px-6 py-4 text-green-500 hover:bg-green-500/10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
              >
                <WhatsApp size={18} />
                WhatsApp Support
              </button>
            )}
          </div>
        </div>

        {activeChat === 'direct' && (
          <div className="bg-brand-black-light p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-6 px-2">Active Contacts</h3>
            <div className="space-y-2">
              {availableUsers.length > 0 ? availableUsers.map((u) => (
                <button
                  key={u.uid}
                  onClick={() => setSelectedUser(u)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                    selectedUser?.uid === u.uid ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center text-brand-black font-black text-[10px]">
                    {u.name[0]}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest truncate">{u.name}</p>
                    <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest truncate">{u.email}</p>
                  </div>
                </button>
              )) : (
                <p className="text-slate-500 text-[10px] font-medium px-2 italic">No contacts assigned yet.</p>
              )}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="bg-brand-yellow/5 p-6 rounded-[2.5rem] border border-brand-yellow/20">
            <div className="flex items-center gap-3 mb-4 text-brand-yellow">
              <Shield size={20} />
              <h4 className="font-black uppercase tracking-widest text-[10px]">CEO Authority</h4>
            </div>
            <p className="text-slate-500 text-[10px] font-medium leading-relaxed">
              Broadcasts are sent to all active dashboards across the network. Use with discretion.
            </p>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3 flex flex-col bg-brand-black-light rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-yellow/10 rounded-2xl flex items-center justify-center text-brand-yellow">
              {activeChat === 'broadcast' ? <Bell size={24} /> : activeChat === 'direct' ? <MessageSquare size={24} /> : <FileText size={24} />}
            </div>
            <div>
              <h3 className="text-white font-black uppercase tracking-tight text-lg">
                {activeChat === 'broadcast' ? 'System Broadcasts' : activeChat === 'direct' ? (selectedUser ? `Chat with ${selectedUser.name}` : 'Select a Contact') : activeChat === 'reports' ? (isAdmin ? 'Field Reports Registry' : 'Submit Field Report') : 'Direct Comms'}
              </h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                {activeChat === 'broadcast' ? 'Global Network Channel' : activeChat === 'direct' ? 'Secure Peer-to-Peer Link' : 'Secure Intelligence Link'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide relative">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070&auto=format&fit=crop" 
              alt="Communication background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10">
            {activeChat === 'broadcast' ? (
            messages.length > 0 ? messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-4 max-w-2xl"
              >
                <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-black font-black shrink-0">
                  {msg.senderName?.[0] || 'C'}
                </div>
                <div className="space-y-2">
                  <div className="bg-white/5 p-6 rounded-3xl rounded-tl-none border border-white/5">
                    <p className="text-white text-sm leading-relaxed font-medium">{msg.content}</p>
                  </div>
                  <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-widest text-slate-500 px-2">
                    <span className="text-brand-yellow">{msg.senderName}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp?.toDate?.() || msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Bell className="text-slate-800 mb-4" size={48} />
                <p className="text-slate-500 font-medium italic">No broadcasts in the current cycle.</p>
              </div>
            )
          ) : activeChat === 'direct' ? (
            selectedUser ? (
              directMessages.length > 0 ? directMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.senderUid === user?.uid ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-4 max-w-2xl ${msg.senderUid === user?.uid ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-brand-black font-black shrink-0 ${msg.senderUid === user?.uid ? 'bg-white text-brand-black' : 'bg-brand-yellow'}`}>
                    {msg.senderName?.[0] || 'U'}
                  </div>
                  <div className={`space-y-2 ${msg.senderUid === user?.uid ? 'text-right' : ''}`}>
                    <div className={`p-6 rounded-3xl border border-white/5 ${msg.senderUid === user?.uid ? 'bg-white/10 rounded-tr-none' : 'bg-white/5 rounded-tl-none'}`}>
                      <p className="text-white text-sm leading-relaxed font-medium">{msg.content}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-widest text-slate-500 px-2">
                      <span>{new Date(msg.timestamp?.toDate?.() || msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <MessageSquare className="text-slate-800 mb-4" size={48} />
                  <p className="text-slate-500 font-medium italic">Start a secure conversation with {selectedUser.name}.</p>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Users className="text-slate-800 mb-4" size={48} />
                <p className="text-slate-500 font-medium italic">Select a contact from the sidebar to begin.</p>
              </div>
            )
          ) : activeChat === 'reports' && isAdmin ? (
            reports.length > 0 ? reports.map((report, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 p-8 rounded-3xl border border-white/5"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-white font-black uppercase tracking-tight">{report.title}</h4>
                  <span className="px-3 py-1 bg-brand-yellow/10 text-brand-yellow rounded-lg text-[8px] font-black uppercase tracking-widest">
                    {report.type}
                  </span>
                </div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">{report.content}</p>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Handler: {report.handlerName}</span>
                  <span>{new Date(report.timestamp?.toDate?.() || report.timestamp).toLocaleString()}</span>
                </div>
              </motion.div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <FileText className="text-slate-800 mb-4" size={48} />
                <p className="text-slate-500 font-medium italic">No field reports received.</p>
              </div>
            )
          ) : activeChat === 'reports' && isHandler ? (
            <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center space-y-8">
              <div className="w-20 h-20 bg-brand-yellow/10 rounded-[2rem] flex items-center justify-center text-brand-yellow">
                <FileText size={40} />
              </div>
              <div>
                <h3 className="text-white font-black text-xl uppercase tracking-tight mb-2">Submit Intelligence Report</h3>
                <p className="text-slate-500 text-sm font-medium">Your report will be sent directly to the CEO's command center.</p>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the field situation, incidents, or operational updates..."
                className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium min-h-[200px]"
              />
              <button
                onClick={handleSendReport}
                disabled={!message.trim() || isSending}
                className="w-full py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-yellow-light transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {isSending ? <div className="w-5 h-5 border-2 border-brand-black border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
                Transmit Report
              </button>
            </div>
          ) : null}
          </div>
        </div>

        {((activeChat === 'broadcast' && isAdmin) || (activeChat === 'direct' && selectedUser)) && (
          <div className="p-8 border-t border-white/5 bg-white/5">
            <form onSubmit={activeChat === 'broadcast' ? handleSendBroadcast : handleSendDirect} className="flex gap-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={activeChat === 'broadcast' ? "Type global broadcast message..." : `Message ${selectedUser?.name}...`}
                className="flex-1 px-6 py-4 bg-brand-black border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium"
              />
              <button
                type="submit"
                disabled={!message.trim() || isSending}
                className="w-14 h-14 bg-brand-yellow text-brand-black rounded-2xl flex items-center justify-center hover:bg-brand-yellow-light transition-all shadow-lg shrink-0"
              >
                {isSending ? <div className="w-5 h-5 border-2 border-brand-black border-t-transparent rounded-full animate-spin" /> : <Send size={20} />}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
