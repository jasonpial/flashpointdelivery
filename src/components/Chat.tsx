import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, User, Clock, Shield } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';

interface Message {
  id: string;
  text: string;
  senderUid: string;
  timestamp: any;
}

export default function Chat({ shipmentId }: { shipmentId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shipmentId) return;

    const q = query(
      collection(db, 'shipments', shipmentId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [shipmentId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, 'shipments', shipmentId, 'messages'), {
        text: newMessage,
        senderUid: user.uid,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-brand-black-light rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
      <div className="p-6 bg-brand-yellow text-brand-black flex items-center gap-4">
        <div className="w-10 h-10 bg-brand-black text-brand-yellow rounded-xl flex items-center justify-center shadow-lg">
          <Shield size={20} />
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-tight">Secure Comms</h3>
          <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Direct Handler Line</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.senderUid === user?.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
              msg.senderUid === user?.uid 
                ? 'bg-brand-yellow text-brand-black rounded-tr-none' 
                : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
            }`}>
              <p className="leading-relaxed">{msg.text}</p>
              <p className={`text-[9px] font-black uppercase tracking-widest mt-2 opacity-50 ${msg.senderUid === user?.uid ? 'text-right' : 'text-left'}`}>
                {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 flex gap-3 bg-brand-black/20">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type secure message..."
          className="flex-grow px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:bg-white/10 transition-all text-sm text-white font-medium"
        />
        <button 
          type="submit"
          className="w-14 h-14 bg-brand-yellow text-brand-black rounded-xl flex items-center justify-center hover:bg-brand-yellow-light transition-all shadow-lg shadow-brand-yellow/10 active:scale-95"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
