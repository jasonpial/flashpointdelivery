import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, ShoppingBag, CheckCircle2 } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  businessName?: string;
}

const STORAGE_KEY = 'flashpoint_cart';

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }
  }, []);

  const updateCart = (nextCart: CartItem[]) => {
    setCart(nextCart);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCart));
    }
  };

  const removeItem = (id: string) => {
    updateCart(cart.filter(item => item.id !== id));
  };

  const total = useMemo(() => cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0), [cart]);

  const handlePlaceOrder = () => {
    updateCart([]);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-brand-black-light p-10 rounded-[2rem] border border-white/10 shadow-2xl text-center">
          <CheckCircle2 size={60} className="text-brand-yellow mx-auto mb-8" />
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Order Confirmed</h1>
          <p className="text-slate-400 mb-10">Your selection has been submitted and will be processed by the Flashpoint marketplace team.</p>
          <button onClick={() => navigate('/portal')} className="px-10 py-4 bg-brand-yellow text-brand-black font-black uppercase tracking-widest rounded-2xl hover:bg-brand-yellow-light transition-all">
            Return to Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest">
            <ArrowLeft size={18} /> Back to Marketplace
          </button>
          <div className="text-right text-slate-400 text-xs uppercase tracking-widest">
            <p>Flashpoint Checkout</p>
            <p className="text-white font-black">{cart.length} item{cart.length === 1 ? '' : 's'}</p>
          </div>
        </div>

        <div className="bg-brand-black-light rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/10">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Checkout</h1>
            <p className="text-slate-400 mt-2">Review your cart and confirm your order. This is a lightweight client-side checkout to demonstrate the flow.</p>
          </div>

          {cart.length === 0 ? (
            <div className="p-20 text-center">
              <div className="mx-auto mb-6 w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-brand-yellow">
                <ShoppingBag size={32} />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4">Your cart is empty</h2>
              <p className="text-slate-500 mb-8">Add products from the marketplace to proceed with checkout.</p>
              <Link to="/portal" className="px-8 py-4 bg-brand-yellow text-brand-black font-black uppercase tracking-widest rounded-2xl hover:bg-brand-yellow-light transition-all">
                Back to Client Portal
              </Link>
            </div>
          ) : (
            <div className="p-8 space-y-8">
              <div className="grid gap-6">
                {cart.map(item => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)_auto] gap-4 bg-white/5 p-6 rounded-[1.5rem] border border-white/10 items-center">
                    <div className="h-28 w-full overflow-hidden rounded-2xl bg-black/20">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{item.businessName || 'Marketplace Item'}</p>
                      <h2 className="text-white font-black text-lg mb-2">{item.name}</h2>
                      <p className="text-slate-400 text-sm leading-relaxed">Qty: {item.quantity}</p>
                      <p className="text-slate-400 text-sm leading-relaxed">UGX {item.price?.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-3">
                      <span className="text-brand-yellow font-black uppercase text-sm">UGX {(item.price * item.quantity).toLocaleString()}</span>
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-white text-xs uppercase tracking-widest font-black">
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-black/20 p-6 rounded-[1.5rem] border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-slate-500 uppercase tracking-widest text-[10px] mb-2">Order Summary</p>
                  <h2 className="text-3xl font-black text-white">UGX {total.toLocaleString()}</h2>
                </div>
                <button onClick={handlePlaceOrder} className="w-full lg:w-auto px-10 py-5 bg-brand-yellow text-brand-black font-black uppercase tracking-widest rounded-2xl hover:bg-brand-yellow-light transition-all">
                  Confirm Purchase
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
