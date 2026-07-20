import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Lock, Clock, Camera, Save, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc, collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuth } from '../App';
import { createLog } from '../lib/logs';

export default function SettingsView() {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'logs'>('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  // Profile Form
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'logs'),
      where('uid', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isUpdating) return;
    setIsUpdating(true);
    setMessage(null);

    try {
      await updateProfile(user, { displayName: name, photoURL: photoURL });
      await updateDoc(doc(db, 'users', user.uid), {
        name,
        phone,
        photoURL,
        updatedAt: new Date().toISOString()
      });
      await createLog(user.uid, 'Profile Information Updated');
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err: any) {
      await createLog(user.uid, 'Profile Update Failed', 'Error');
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500000) { // 500KB limit for base64
      setMessage({ type: 'error', text: 'Image too large. Max 500KB.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoURL(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isUpdating) return;
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setIsUpdating(true);
    setMessage(null);

    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      await createLog(user.uid, 'Security Credentials Updated');
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      await createLog(user.uid, 'Security Update Failed', 'Error');
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-10 relative">
      <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none -mr-20 -mt-20">
        <img 
          src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop" 
          alt="Settings background" 
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
      </div>
      {/* Tabs */}
      <div className="flex gap-4 p-2 bg-brand-black-light rounded-2xl border border-white/5 w-fit relative z-10">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'logs', label: 'Activity Logs', icon: Clock }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-brand-yellow text-brand-black shadow-lg' : 'text-slate-500 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-3 gap-10"
          >
            <div className="md:col-span-1 space-y-6">
              <div className="bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 text-center">
                <div className="relative w-32 h-32 mx-auto mb-6 group">
                  <div className="w-full h-full bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center text-slate-700 overflow-hidden">
                    {photoURL ? (
                      <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={64} />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-brand-yellow text-brand-black rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer">
                    <Camera size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                </div>
                <h3 className="text-white font-black uppercase tracking-tight text-lg">{profile?.name}</h3>
                <p className="text-brand-yellow text-[10px] font-black uppercase tracking-widest">{profile?.role}</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <form onSubmit={handleUpdateProfile} className="bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                <h3 className="text-white font-black text-xl uppercase tracking-tight">Profile Information</h3>
                
                {message && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest ${
                    message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {message.text}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-10 py-4 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-brand-yellow-light transition-all flex items-center gap-3"
                >
                  {isUpdating ? <div className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                  Save Profile Changes
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl"
          >
            <form onSubmit={handleUpdatePassword} className="bg-brand-black-light p-10 rounded-[2.5rem] border border-white/5 space-y-8">
              <h3 className="text-white font-black text-xl uppercase tracking-tight">Security Credentials</h3>
              
              {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest ${
                  message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {message.text}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      required
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">New Password</label>
                    <input
                      required
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Confirm New Password</label>
                    <input
                      required
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow/50 text-white font-medium"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="px-10 py-4 bg-brand-yellow text-brand-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-brand-yellow-light transition-all flex items-center gap-3"
              >
                {isUpdating ? <div className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" /> : <Shield size={16} />}
                Update Security Credentials
              </button>
            </form>
          </motion.div>
        )}

        {activeTab === 'logs' && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-brand-black-light rounded-[2.5rem] border border-white/5 overflow-hidden"
          >
            <div className="p-10 border-b border-white/5">
              <h3 className="text-white font-black text-xl uppercase tracking-tight">System Logs</h3>
              <p className="text-slate-500 text-xs font-medium">Your recent security and operational activity</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Event</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">IP Address</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.length > 0 ? logs.map((log, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-10 py-6 text-white text-xs font-bold uppercase tracking-widest">{log.event}</td>
                      <td className="px-10 py-6">
                        <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[8px] font-black uppercase tracking-widest">
                          {log.status || 'Success'}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-slate-500 text-[10px] font-mono">{log.ip || '192.168.1.1'}</td>
                      <td className="px-10 py-6 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        {new Date(log.timestamp?.toDate?.() || log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center text-slate-500 font-medium italic">
                        No activity logs found in the secure registry.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
