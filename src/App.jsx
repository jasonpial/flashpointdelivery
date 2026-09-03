import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Auth from './components/Auth';
import OrderForm from './components/OrderForm';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import ShopRegistry from './components/ShopRegistry';
import PortalSelect from './components/PortalSelect';
import Cart from './components/Cart';
import { dbService } from './services/dbService';
import { 
  MOCK_ORDERS, 
  INITIAL_SHOPS, 
  INITIAL_PRODUCTS, 
  INITIAL_REPORTS, 
  INITIAL_BROADCASTS 
} from './deliveryData';
import { Shield, Clock, MapPin, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null); // null by default
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [authOpen, setAuthOpen] = useState(false);
  const [dashboardSubNode, setDashboardSubNode] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [portalPanel, setPortalPanel] = useState('grid');
  const [cart, setCart] = useState([]);

  // Global States
  const [shops, setShops] = useState(INITIAL_SHOPS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS);
  
  // Cart state for purchased items
  const [initialCargoCart, setInitialCargoCart] = useState([]);
  
  // Broadcast ribbon dismissal
  const [dismissedAlertId, setDismissedAlertId] = useState(null);

  // Fetch initial data from database service
  useEffect(() => {
    async function loadDbData() {
      const fetchedOrders = await dbService.fetchOrders();
      if (fetchedOrders) setOrders(fetchedOrders);

      const fetchedShops = await dbService.fetchShops();
      if (fetchedShops) setShops(fetchedShops);

      const fetchedProducts = await dbService.fetchProducts();
      if (fetchedProducts) setProducts(fetchedProducts);

      const fetchedReports = await dbService.fetchReports();
      if (fetchedReports) setReports(fetchedReports);

      const fetchedBroadcasts = await dbService.fetchBroadcasts();
      if (fetchedBroadcasts) setBroadcasts(fetchedBroadcasts);
    }
    loadDbData();
  }, []);

  // Authentication handlers
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Auto navigate to their respective portal upon login
    switch (userData.role) {
      case 'ceo':
        setActiveTab('ceo_console');
        break;
      case 'seller':
        setActiveTab('seller_hub');
        break;
      case 'hr':
        setActiveTab('hr_dashboard');
        break;
      case 'admin':
      case 'super_admin':
        setActiveTab('admin_dashboard');
        break;
      case 'dispatcher':
      case 'operations_manager':
        setActiveTab('dispatcher');
        break;
      case 'finance':
      case 'finance_manager':
        setActiveTab('finance');
        break;
      case 'fleet_manager':
        setActiveTab('fleet_manager');
        break;
      case 'security':
      case 'security_manager':
      case 'control_room':
        setActiveTab('security');
        break;
      case 'support_agent':
        setActiveTab('support_agent');
        break;
      case 'branch_manager':
        setActiveTab('branch_manager');
        break;
      case 'warehouse_operator':
        setActiveTab('warehouse_operator');
        break;
      case 'courier':
        setActiveTab('courier');
        break;
      case 'corporate_client':
        setActiveTab('corporate_client');
        break;
      case 'marketplace_admin':
        setActiveTab('marketplace_admin');
        break;
      case 'analytics':
        setActiveTab('analytics');
        break;
      case 'auditor':
        setActiveTab('auditor');
        break;
      case 'client':
      default:
        setActiveTab('client_portal');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
    setDashboardSubNode(null);
    setPortalPanel('grid');
  };

  // Profile updates
  const handleUserUpdate = (updatedUserData) => {
    setUser(updatedUserData);
  };

  // Order submission
  const handleAddOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    dbService.createOrder(newOrder);
  };

  // Track order from Search Bar input
  const handleTrackOrder = (orderId) => {
    const cleanId = orderId.toUpperCase().trim();
    if (cleanId === 'FP-9031' || cleanId === 'FP-8241') {
      if (!user) {
        alert(`Clearance Check: Tracking data for "${cleanId}" exists. Please login to access active timelines.`);
        setAuthOpen(true);
        return;
      }
      setActiveTab('client_portal');
    } else {
      alert(`Cargo log "${cleanId}" not found. Hint: try 'FP-9031' or 'FP-8241'.`);
    }
  };

  // Update order status (for testing simulation in Dashboard)
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
    dbService.updateOrderStatus(orderId, newStatus);
  };

  // Append new chat messages
  const handleAddChatMessage = (orderId, messageObj) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, chat: [...order.chat, messageObj] } 
          : order
      )
    );
    dbService.addChatMessage(orderId, messageObj);
  };

  // Register Business Shop
  const handleRegisterShop = (newShop) => {
    setShops(prev => [newShop, ...prev]);
    if (user && user.role === 'seller') {
      setUser(prev => ({ ...prev, name: newShop.name }));
    }
    dbService.createShop(newShop);
  };

  // Add Product to catalog (invoked by sellers/partners)
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    dbService.createProduct(newProduct);
  };

  // Submit Handler Report
  const handleAddReport = (newReport) => {
    setReports(prev => [newReport, ...prev]);
    dbService.createReport(newReport);
  };

  // CEO broadcasts alert dispatch
  const handleAddBroadcast = (newBroadcast) => {
    setBroadcasts(prev => [newBroadcast, ...prev]);
    setDismissedAlertId(null); // Show alert banner for everyone
    dbService.createBroadcast(newBroadcast);
  };

  // Cart management handlers
  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleUpdateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, qty: newQty } : item));
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckout = () => {
    setInitialCargoCart(cart.map(item => ({ name: item.name, qty: item.qty })));
    setCart([]); // Clear cart after checkout transition
    setActiveTab('book');
  };

  // Cart purchase link from Hero (adds to cart & redirects to cart page)
  const handlePurchaseItem = (product) => {
    handleAddToCart(product);
    setActiveTab('cart');
  };

  const handleClearCargoCart = () => {
    setInitialCargoCart([]);
  };

  // Count active/pending orders for current user
  const activeOrdersCount = user ? orders.filter(o => o.status !== 'delivered').length : 0;
  
  // Latest system alert
  const latestAlert = broadcasts.length > 0 ? broadcasts[0] : null;

  return (
    <div className="app-container">
      
      {/* Persistent Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onOpenAuth={(mode = 'login') => { setAuthMode(mode); setAuthOpen(true); }} 
        onLogout={handleLogout} 
        onTrackOrder={handleTrackOrder}
        activeSubNode={dashboardSubNode}
        setActiveSubNode={setDashboardSubNode}
        portalPanel={portalPanel}
        setPortalPanel={setPortalPanel}
        cart={cart}
      />

      {/* Main Pages Router */}
      <main className="content-wrap">
        
        {/* Tab 1: Home Page */}
        {activeTab === 'home' && (
          <Hero 
            onBookClick={() => setActiveTab('book')} 
            onTrackOrder={handleTrackOrder}
            onPurchaseItem={handlePurchaseItem}
            user={user}
            onOpenAuth={(mode = 'login') => { setAuthMode(mode); setAuthOpen(true); }}
            onLogout={handleLogout}
            onNavigateToMarketplace={() => setActiveTab('marketplace')}
            onNavigateToRegisterShop={() => setActiveTab('open_shop')}
          />
        )}

        {/* Tab: Portal Selection */}
        {activeTab === 'portal_select' && (
          <PortalSelect 
            setActiveTab={setActiveTab} 
            user={user} 
            onOpenAuth={(mode = 'login') => { setAuthMode(mode); setAuthOpen(true); }}
            portalPanel={portalPanel}
            setPortalPanel={setPortalPanel}
          />
        )}

        {/* Tab 2: Product Marketplace */}
        {activeTab === 'marketplace' && (
          <Marketplace 
            products={products}
            shops={shops}
            user={user}
            onRegisterShop={handleRegisterShop}
            onAddToCart={handleAddToCart}
            onNavigateToAuth={(mode = 'login') => { setAuthMode(mode); setAuthOpen(true); }}
          />
        )}

        {/* Dedicated Shop Registration Page */}
        {activeTab === 'open_shop' && (
          <ShopRegistry 
            shops={shops}
            user={user}
            onRegisterShop={handleRegisterShop}
            onNavigateToAuth={(mode = 'login') => { setAuthMode(mode); setAuthOpen(true); }}
          />
        )}

        {/* Tab: Cart Page */}
        {activeTab === 'cart' && (
          <Cart 
            cart={cart}
            onUpdateQty={handleUpdateCartQty}
            onRemove={handleRemoveFromCart}
            onClear={handleClearCart}
            onCheckout={handleCheckout}
            onContinueShopping={() => setActiveTab('marketplace')}
          />
        )}

        {/* Tab 3: Delivery Booking Form */}
        {activeTab === 'book' && (
          <OrderForm 
            user={user} 
            onAddOrder={handleAddOrder}
            onOpenAuth={(mode = 'login') => { setAuthMode(mode); setAuthOpen(true); }}
            onNavigateToDashboard={() => setActiveTab('client_portal')}
            initialCargoCart={initialCargoCart}
            onClearCargoCart={handleClearCargoCart}
          />
        )}

        {/* Consolidated Dashboard Router for all 18 roles/tabs */}
        {[
          'client_portal', 'corporate_client', 'seller_hub', 'handler_dashboard', 'courier', 
          'dispatcher', 'ceo_console', 'hr_dashboard', 'admin_dashboard', 'finance', 
          'fleet_manager', 'security', 'support_agent', 'branch_manager', 'warehouse_operator', 
          'marketplace_admin', 'analytics', 'auditor'
        ].includes(activeTab) && (
          <Dashboard 
            user={user} 
            orders={orders}
            reports={reports}
            broadcasts={broadcasts}
            shops={shops}
            products={products}
            onOpenAuth={(mode = 'login') => { setAuthMode(mode); setAuthOpen(true); }}
            onNavigateToBook={() => setActiveTab('book')}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddChatMessage={handleAddChatMessage}
            onAddReport={handleAddReport}
            onAddBroadcast={handleAddBroadcast}
            onAddProduct={handleAddProduct}
            onUserUpdate={handleUserUpdate}
            onAddOrder={handleAddOrder}
            activeSubNode={dashboardSubNode}
            setActiveSubNode={setDashboardSubNode}
          />
        )}

      </main>

      {/* Authentication Modal */}
      <Auth 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
        initialIsLogin={authMode === 'login'}
      />

      {/* Premium Theme Footer */}
      <footer style={styles.footer} className="app-footer">
        <div className="container footer-grid" style={styles.footerGrid}>
          
          {/* Logo & Vitals */}
          <div style={styles.footerBrand}>
            <div style={styles.logoRow}>
              <Shield size={24} color="var(--accent)" />
              <h3 style={styles.footerBrandTitle}>FLASHPOINT <span style={{ color: 'var(--accent)' }}>DELIVERY</span></h3>
            </div>
            <p style={styles.footerDesc}>
              Uganda's primary high-security carrier company. Guarding and delivering valuables with absolute transparency, speed, and real-time handler channels.
            </p>
          </div>

          {/* Quick Info Grid */}
          <div style={styles.footerInfoCol}>
            <h4 style={styles.footerTitle}>OPERATIONAL ZONES</h4>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem}><MapPin size={12} color="var(--accent)" /> Kampala Central (Nakasero, Kololo, Bugolobi)</li>
              <li style={styles.footerListItem}><MapPin size={12} color="var(--accent)" /> Greater Wakiso (Kira, Nansana, Entebbe)</li>
              <li style={styles.footerListItem}><MapPin size={12} color="var(--accent)" /> Central districts (Luwero, Masaka, Mityana)</li>
            </ul>
          </div>

          {/* Contacts */}
          <div style={styles.footerInfoCol}>
            <h4 style={styles.footerTitle}>SECURE CONTACTS</h4>
            <div style={styles.footerContactBox}>
              <div style={styles.contactItem}>
                <span style={styles.contactHeader}>LOGISTICS HOTLINE</span>
                <span style={styles.contactLink}>+256 123 456 789</span>
              </div>
              <div style={{ ...styles.contactItem, marginTop: '12px' }}>
                <span style={styles.contactHeader}>WEB PORTAL</span>
                <span style={styles.contactLink}>www.flashpointdelivery.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright bar */}
        <div style={styles.bottomBar}>
          <div className="container bottom-container-row" style={styles.bottomContainer}>
            <span>© {new Date().getFullYear()} Flashpoint Delivery Ltd. All rights reserved.</span>
            <div style={styles.legalLinks}>
              <a href="#" style={styles.legalLink}>Security Protocol</a>
              <span style={{ color: 'var(--border)' }}>|</span>
              <a href="#" style={styles.legalLink}>Terms of Carriage</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

const styles = {
  footer: {
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border)',
    padding: '60px 0 0 0',
    color: 'var(--text-secondary)'
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1fr',
    gap: '40px',
    paddingBottom: '40px',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
      gap: '30px'
    }
  },
  footerBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  footerBrandTitle: {
    fontSize: '20px',
    fontWeight: '800',
    letterSpacing: '0.05em'
  },
  footerDesc: {
    fontSize: '13px',
    lineHeight: '1.6',
    maxWidth: '380px'
  },
  footerInfoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  footerTitle: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    letterSpacing: '1px',
    borderLeft: '2px solid var(--accent)',
    paddingLeft: '10px'
  },
  footerList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  footerListItem: {
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  footerContactBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  contactItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  contactHeader: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px'
  },
  contactLink: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    marginTop: '2px'
  },
  bottomBar: {
    borderTop: '1px solid var(--border)',
    padding: '24px 0',
    backgroundColor: 'var(--bg-primary)'
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'var(--text-muted)',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      gap: '12px',
      alignItems: 'center'
    }
  },
  legalLinks: {
    display: 'flex',
    gap: '12px'
  },
  legalLink: {
    color: 'var(--text-muted)',
    transition: 'all 0.2s ease',
    ':hover': {
      color: 'var(--accent)'
    }
  }
};

// Add DOM stylesheet overrides for footer responsiveness at runtime
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @media (max-width: 900px) {
      .footer-grid {
        grid-template-columns: 1fr !important;
        gap: 30px !important;
      }
    }
    @media (max-width: 600px) {
      .bottom-container-row {
        flex-direction: column !important;
        gap: 12px !important;
        align-items: center !important;
        text-align: center !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
