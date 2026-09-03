import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  MOCK_ORDERS, 
  INITIAL_SHOPS, 
  INITIAL_PRODUCTS, 
  INITIAL_REPORTS, 
  INITIAL_BROADCASTS 
} from '../deliveryData';

export const dbService = {
  // 1. ORDERS persistence
  async fetchOrders() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase orders fetch warning, using local state:', err);
      }
    }
    return MOCK_ORDERS;
  },

  async createOrder(orderData) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert([orderData])
          .select();
        if (!error && data && data.length > 0) return data[0];
      } catch (err) {
        console.warn('Supabase order insert warning:', err);
      }
    }
    return orderData;
  },

  async updateOrderStatus(orderId, newStatus) {
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('orders')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase update order status warning:', err);
      }
    }
  },

  // 2. SHOPS & PRODUCTS persistence
  async fetchShops() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('shops').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase fetch shops warning:', err);
      }
    }
    return INITIAL_SHOPS;
  },

  async createShop(shopData) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('shops').insert([shopData]).select();
        if (!error && data && data.length > 0) return data[0];
      } catch (err) {
        console.warn('Supabase shop insert warning:', err);
      }
    }
    return shopData;
  },

  async fetchProducts() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase fetch products warning:', err);
      }
    }
    return INITIAL_PRODUCTS;
  },

  async createProduct(productData) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('products').insert([productData]).select();
        if (!error && data && data.length > 0) return data[0];
      } catch (err) {
        console.warn('Supabase product insert warning:', err);
      }
    }
    return productData;
  },

  // 3. REPORTS & BROADCASTS
  async fetchReports() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('reports').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase fetch reports warning:', err);
      }
    }
    return INITIAL_REPORTS;
  },

  async createReport(reportData) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('reports').insert([reportData]).select();
        if (!error && data && data.length > 0) return data[0];
      } catch (err) {
        console.warn('Supabase report insert warning:', err);
      }
    }
    return reportData;
  },

  async fetchBroadcasts() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('broadcasts').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase fetch broadcasts warning:', err);
      }
    }
    return INITIAL_BROADCASTS;
  },

  async createBroadcast(broadcastData) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('broadcasts').insert([broadcastData]).select();
        if (!error && data && data.length > 0) return data[0];
      } catch (err) {
        console.warn('Supabase broadcast insert warning:', err);
      }
    }
    return broadcastData;
  },

  // 4. REALTIME CHAT MESSAGES
  async addChatMessage(orderId, messageObj) {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('chat_messages').insert([{
          order_id: orderId,
          sender: messageObj.sender,
          text: messageObj.text,
          time: messageObj.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (err) {
        console.warn('Supabase chat message insert warning:', err);
      }
    }
  }
};
