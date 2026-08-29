import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Auth from './components/Auth';
import OrderForm from './components/OrderForm';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import ShopRegistry from './components/ShopRegistry';
import PortalSelect from './components/PortalSelect';
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

  // Global States
  const [shops, setShops] = useState(INITIAL_SHOPS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS);
  
  // Cart state for purchased items
  const [initialCargoCart, setInitialCargoCart] = useState([]);
  
  // Broadcast ribbon dismissal
  const [dismissedAlertId, setDismissedAlertId] = useState(null);

  // Authentication handlers
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Auto navigate to their respective portal upon login
    if (userData.role === 'ceo') {
      setActiveTab('ceo_console');
    } else if (userData.role === 'seller') {
      setActiveTab('seller_hub');
    } else if (userData.role === 'hr') {
      setActiveTab('hr_dashboard');
    } else if (userData.role === 'admin') {
      setActiveTab('admin_dashboard');
    } else {
      setActiveTab('client_portal');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
  };

  // Profile updates
  const handleUserUpdate = (updatedUserData) => {
    setUser(updatedUserData);
  };

  // Order submission
  const handleAddOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
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
  };

  // Register Business Shop
  const handleRegisterShop = (newShop) => {
    setShops(prev => [newShop, ...prev]);
    if (user && user.role === 'seller') {
      setUser(prev => ({ ...prev, name: newShop.name }));
    }
  };

  // Add Product to catalog (invoked by sellers/partners)
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  // Submit Handler Report
  const handleAddReport = (newReport) => {
    setReports(prev => [newReport, ...prev]);
  };

  // CEO broadcasts alert dispatch
  const handleAddBroadcast = (newBroadcast) => {
    setBroadcasts(prev => [newBroadcast, ...prev]);
    setDismissedAlertId(null); // Show alert banner for everyone
  };

  // Cart purchase link
  const handlePurchaseItem = (product) => {
    setInitialCargoCart([{ name: product.name, qty: 1 }]);
    setActiveTab('book');
    alert(`"${product.name}" added to manifest. Finish details to book shipment.`);
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
      {activeTab !== 'portal_select' && (
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
          onOpenAuth={() => setAuthOpen(true)} 
          onLogout={handleLogout} 
          onTrackOrder={handleTrackOrder}
        />
      )}

      {/* Main Pages Router */}
      <main className="content-wrap">
        
        {/* Tab 1: Home Page */}
        {activeTab === 'home' && (
          <Hero 
            onBookClick={() => setActiveTab('book')} 
            onTrackOrder={handleTrackOrder}
            onPurchaseItem={handlePurchaseItem}
            user={user}
            onOpenAuth={() => setAuthOpen(true)}
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
            onOpenAuth={() => setAuthOpen(true)}
          />
        )}

        {/* Tab 2: Product Marketplace */}
        {activeTab === 'marketplace' && (
          <Marketplace 
            products={products}
            shops={shops}
            user={user}
            onRegisterShop={handleRegisterShop}
            onPurchaseItem={handlePurchaseItem}
            onNavigateToAuth={() => setAuthOpen(true)}
          />
        )}

        {/* Dedicated Shop Registration Page */}
        {activeTab === 'open_shop' && (
          <ShopRegistry 
            shops={shops}
            user={user}
            onRegisterShop={handleRegisterShop}
            onNavigateToAuth={() => setAuthOpen(true)}
          />
        )}

        {/* Tab 3: Delivery Booking Form */}
        {activeTab === 'book' && (
          <OrderForm 
            user={user} 
            onAddOrder={handleAddOrder}
            onOpenAuth={() => setAuthOpen(true)}
            onNavigateToDashboard={() => setActiveTab('client_portal')}
            initialCargoCart={initialCargoCart}
            onClearCargoCart={handleClearCargoCart}
          />
        )}

        {/* Tab 4: Client Portal (Timeline tracking & Pickup requests) */}
        {activeTab === 'client_portal' && (
          <Dashboard 
            user={user} 
            orders={orders}
            reports={reports}
            broadcasts={broadcasts}
            shops={shops}
            products={products}
            onOpenAuth={() => setAuthOpen(true)}
            onNavigateToBook={() => setActiveTab('book')}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddChatMessage={handleAddChatMessage}
            onAddReport={handleAddReport}
            onAddBroadcast={handleAddBroadcast}
            onAddProduct={handleAddProduct}
            onUserUpdate={handleUserUpdate}
            onAddOrder={handleAddOrder}
          />
        )}

        {/* Tab 5: Seller Hub (Inventory and store management) */}
        {activeTab === 'seller_hub' && (
          <Dashboard 
            user={user} 
            orders={orders}
            reports={reports}
            broadcasts={broadcasts}
            shops={shops}
            products={products}
            onOpenAuth={() => setAuthOpen(true)}
            onNavigateToBook={() => setActiveTab('book')}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddChatMessage={handleAddChatMessage}
            onAddReport={handleAddReport}
            onAddBroadcast={handleAddBroadcast}
            onAddProduct={handleAddProduct}
            onUserUpdate={handleUserUpdate}
            onAddOrder={handleAddOrder}
          />
        )}

        {/* Tab 6: CEO Console */}
        {activeTab === 'ceo_console' && (
          <Dashboard 
            user={user} 
            orders={orders}
            reports={reports}
            broadcasts={broadcasts}
            shops={shops}
            products={products}
            onOpenAuth={() => setAuthOpen(true)}
            onNavigateToBook={() => setActiveTab('book')}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddChatMessage={handleAddChatMessage}
            onAddReport={handleAddReport}
            onAddBroadcast={handleAddBroadcast}
            onAddProduct={handleAddProduct}
            onUserUpdate={handleUserUpdate}
            onAddOrder={handleAddOrder}
          />
        )}

        {/* Tab 7: HR Dashboard */}
        {activeTab === 'hr_dashboard' && (
          <Dashboard 
            user={user} 
            orders={orders}
            reports={reports}
            broadcasts={broadcasts}
            shops={shops}
            products={products}
            onOpenAuth={() => setAuthOpen(true)}
            onNavigateToBook={() => setActiveTab('book')}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddChatMessage={handleAddChatMessage}
            onAddReport={handleAddReport}
            onAddBroadcast={handleAddBroadcast}
            onAddProduct={handleAddProduct}
            onUserUpdate={handleUserUpdate}
            onAddOrder={handleAddOrder}
          />
        )}

        {/* Tab 8: Admin Dashboard */}
        {activeTab === 'admin_dashboard' && (
          <Dashboard 
            user={user} 
            orders={orders}
            reports={reports}
            broadcasts={broadcasts}
            shops={shops}
            products={products}
            onOpenAuth={() => setAuthOpen(true)}
            onNavigateToBook={() => setActiveTab('book')}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddChatMessage={handleAddChatMessage}
            onAddReport={handleAddReport}
            onAddBroadcast={handleAddBroadcast}
            onAddProduct={handleAddProduct}
            onUserUpdate={handleUserUpdate}
            onAddOrder={handleAddOrder}
          />
        )}

      </main>

      {/* Authentication Modal */}
      <Auth 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
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
              <div style={styles.contactItem} style={{ marginTop: '12px' }}>
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
