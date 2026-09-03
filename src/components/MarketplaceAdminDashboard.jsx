import React, { useState } from 'react';
import { Store, Check, X, ShieldAlert, Award, Compass, Search } from 'lucide-react';

export default function MarketplaceAdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('stores');
  const [successMsg, setSuccessMsg] = useState('');

  // Pending merchant stores
  const [pendingStores, setPendingStores] = useState([
    { id: 'STR-VET-801', name: 'Kampala Agritech Supplies', category: 'Farm Equipment', owner: 'Mugisha Fred', status: 'Pending Review' },
    { id: 'STR-VET-803', name: 'Kigezi Potato Growers', category: 'Fresh Produce', owner: 'Tumwebaze Grace', status: 'Pending Review' }
  ]);

  // Pending products moderation
  const [pendingProducts, setPendingProducts] = useState([
    { id: 'PROD-MOD-12', name: 'Organic Coffee Beans (5KG)', price: '85,000 UGX', seller: 'Coffee Growers Coop', status: 'Pending Approval' },
    { id: 'PROD-MOD-15', name: 'Grade A Maize Grain (50KG)', price: '120,000 UGX', seller: 'Kampala Agritech Supplies', status: 'Pending Approval' }
  ]);

  const handleApproveStore = (storeId, storeName) => {
    setPendingStores(prev => prev.filter(s => s.id !== storeId));
    setSuccessMsg(`Merchant store "${storeName}" is approved. Frontstore is live in Flashpoint Marketplace.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleApproveProduct = (prodId, prodName) => {
    setPendingProducts(prev => prev.filter(p => p.id !== prodId));
    setSuccessMsg(`Product "${prodName}" is cleared and approved for listing in customer catalog.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox}>
          <div style={styles.avatarBadge}>
            <Store size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>MARKETPLACE ADMIN</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab('stores')}
            style={{ ...styles.navItem, ...(activeTab === 'stores' ? styles.activeNavItem : {}) }}
          >
            <Compass size={16} />
            <span>Store Vettings ({pendingStores.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            style={{ ...styles.navItem, ...(activeTab === 'products' ? styles.activeNavItem : {}) }}
          >
            <Check size={16} />
            <span>Product Moderation ({pendingProducts.length})</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {successMsg && (
          <div style={styles.successBanner}>
            <Check size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STORES TAB */}
        {activeTab === 'stores' && (
          <div>
            <h3 style={styles.nodeTitle}>MERCHANT STOREFRONT APPROVALS</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Verify business legitimacy, licensing credentials, and contact points before allowing store listing.
            </p>

            <div style={styles.grid}>
              {pendingStores.map(s => (
                <div key={s.id} className="card" style={styles.vetCard}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>{s.id}</span>
                    <h4 style={{ margin: '4px 0', fontSize: '15px' }}>{s.name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Category: {s.category} | Representative: {s.owner}</span>
                  </div>

                  <div style={styles.btnRow}>
                    <button 
                      onClick={() => handleApproveStore(s.id, s.name)}
                      className="btn btn-primary"
                      style={{ padding: '8px 14px', fontSize: '11px' }}
                    >
                      <span>Verify & Authorize</span>
                    </button>
                  </div>
                </div>
              ))}

              {pendingStores.length === 0 && (
                <div className="card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1/-1' }}>
                  <Check size={36} color="var(--success)" style={{ marginBottom: '12px' }} />
                  <h4>All pending merchant store registrations are resolved.</h4>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            <h3 style={styles.nodeTitle}>PRODUCT CATALOG MODERATION</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Review product details, catalog pricing, and images to prevent prohibited item listings.
            </p>

            <div style={styles.grid}>
              {pendingProducts.map(p => (
                <div key={p.id} className="card" style={styles.vetCard}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>{p.id}</span>
                    <h4 style={{ margin: '4px 0', fontSize: '15px' }}>{p.name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Pricing: {p.price} | Merchant: {p.seller}</span>
                  </div>

                  <div style={styles.btnRow}>
                    <button 
                      onClick={() => handleApproveProduct(p.id, p.name)}
                      className="btn btn-primary"
                      style={{ padding: '8px 14px', fontSize: '11px' }}
                    >
                      <span>Approve Listing</span>
                    </button>
                  </div>
                </div>
              ))}

              {pendingProducts.length === 0 && (
                <div className="card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1/-1' }}>
                  <Check size={36} color="var(--success)" style={{ marginBottom: '12px' }} />
                  <h4>All product moderation queues are clear.</h4>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  dashboardLayout: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    minHeight: 'calc(100vh - 76px)',
    backgroundColor: 'var(--bg-primary)',
  },
  sidebar: {
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  badgeBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '20px'
  },
  avatarBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#facc15',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  officerRole: {
    display: 'block',
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '1px'
  },
  officerName: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  sideNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'none',
    border: 'none',
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  activeNavItem: {
    backgroundColor: '#facc15',
    color: '#000000'
  },
  mainContent: {
    padding: '40px 30px',
    overflowY: 'auto'
  },
  nodeTitle: {
    fontSize: '18px',
    fontWeight: '800',
    borderLeft: '3px solid #facc15',
    paddingLeft: '12px',
    letterSpacing: '0.5px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  vetCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  btnRow: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto'
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(5,150,105,0.08)',
    border: '1px solid var(--success)',
    color: 'var(--success)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '20px'
  }
};
