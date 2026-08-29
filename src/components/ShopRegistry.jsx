import React, { useState } from 'react';
import { Store, CheckCircle, MapPin, Phone, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { ITEM_CATEGORIES } from '../deliveryData';

export default function ShopRegistry({ shops, user, onRegisterShop, onNavigateToAuth }) {
  const [shopName, setShopName] = useState('');
  const [shopCategory, setShopCategory] = useState(ITEM_CATEGORIES[0].id);
  const [shopLocation, setShopLocation] = useState('');
  const [shopPhone, setShopPhone] = useState('+256 ');
  const [regSuccess, setRegSuccess] = useState('');

  const handleShopSubmit = (e) => {
    e.preventDefault();
    if (!shopName.trim() || !shopLocation.trim()) {
      alert("Please fill in all shop registration fields.");
      return;
    }

    const newShop = {
      id: `s-${Math.floor(100 + Math.random() * 900)}`,
      name: shopName.trim(),
      category: shopCategory,
      location: shopLocation.trim(),
      phone: shopPhone.trim(),
      verified: true
    };

    onRegisterShop(newShop);
    
    setShopName('');
    setShopLocation('');
    setShopPhone('+256 ');
    setRegSuccess(`Store "${newShop.name}" registered successfully! Start adding products in your Seller Hub.`);
    setTimeout(() => setRegSuccess(''), 5000);
  };

  return (
    <div style={styles.registryPage} className="slide-up">
      <div className="container">
        
        {/* Page Header */}
        <div style={styles.headerRow}>
          <div style={{ maxWidth: '680px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Open a <span style={{ color: 'var(--accent)' }}>Flashpoint Shop</span></h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Onboard your business, list items, and leverage Uganda's primary high-security carrier network to ship products securely across Kampala and central regions.
            </p>
          </div>
        </div>

        <div style={styles.mainLayout} className="shop-registry-layout">
          
          {/* Left Column: Onboarding Perks & Verified Shippers Directory */}
          <div style={styles.infoCol}>
            
            {/* Perks Cards */}
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <h3 style={styles.perkTitle}>
                <Sparkles size={16} color="var(--accent)" />
                <span>PARTNER BENEFITS</span>
              </h3>
              <div style={styles.perksList}>
                <div style={styles.perkItem}>
                  <div style={styles.perkIconWrapper}>1</div>
                  <div>
                    <strong>Express Security Escort:</strong>
                    <p style={styles.perkText}>High-value merchant inventories are transported under vetted guard protocols.</p>
                  </div>
                </div>
                <div style={styles.perkItem}>
                  <div style={styles.perkIconWrapper}>2</div>
                  <div>
                    <strong>Live Sales Timeline:</strong>
                    <p style={styles.perkText}>Track product purchases and coordinate dispatch status reports directly with handlers.</p>
                  </div>
                </div>
                <div style={styles.perkItem}>
                  <div style={styles.perkIconWrapper}>3</div>
                  <div>
                    <strong>Kampala-wide Shipping:</strong>
                    <p style={styles.perkText}>Instantly tap into our pre-calculated division rates to simplify deliveries.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Shippers Directory */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={styles.perkTitle}>
                <Store size={16} color="var(--accent)" />
                <span>VERIFIED SHIPPERS</span>
              </h3>
              <div style={styles.shopsList}>
                {shops.map(shop => (
                  <div key={shop.id} style={styles.shopItem}>
                    <div style={styles.shopMetaHeader}>
                      <span style={styles.shopNameText}>{shop.name}</span>
                      {shop.verified && <span style={styles.verifiedBadge}>VERIFIED</span>}
                    </div>
                    <div style={styles.shopDetails}>
                      <span style={styles.shopDetailText}><MapPin size={10} /> {shop.location}</span>
                      <span style={styles.shopDetailText}><Phone size={10} /> {shop.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Registry Form */}
          <div style={styles.formCol}>
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={styles.formTitle}>
                <Shield size={18} color="var(--accent)" />
                <span>REGISTER YOUR SHOP</span>
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Fill out the business details below. A security representative will audit and verify your storefront credentials.
              </p>

              {regSuccess && (
                <div style={styles.successBox}>
                  <CheckCircle size={16} />
                  <span>{regSuccess}</span>
                </div>
              )}

              <form onSubmit={handleShopSubmit}>
                <div className="form-group">
                  <label className="form-label">Business Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Kampala Leather Goods" 
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="form-input" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Shop Category</label>
                  <select 
                    value={shopCategory}
                    onChange={(e) => setShopCategory(e.target.value)}
                    className="form-input"
                  >
                    {ITEM_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Physical Address</label>
                  <input 
                    type="text" 
                    placeholder="Plot & Street, Kampala" 
                    value={shopLocation}
                    onChange={(e) => setShopLocation(e.target.value)}
                    className="form-input" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Business Phone</label>
                  <input 
                    type="text" 
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    className="form-input" 
                  />
                </div>

                {user ? (
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                    <span>Register Business Account</span>
                  </button>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <p style={styles.loginReqText}>* Login required to register a merchant account.</p>
                    <button 
                      type="button" 
                      onClick={onNavigateToAuth}
                      className="btn btn-secondary" 
                      style={{ width: '100%', borderColor: 'var(--accent)' }}
                    >
                      <span>Login to Register</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

const styles = {
  registryPage: {
    padding: '40px 0 80px 0',
    backgroundColor: 'var(--bg-primary)'
  },
  headerRow: {
    marginBottom: '36px'
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    alignItems: 'start'
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  formCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  perkTitle: {
    fontSize: '13.5px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px',
    marginBottom: '16px',
    letterSpacing: '0.5px'
  },
  perksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  perkItem: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start'
  },
  perkIconWrapper: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#facc15',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '11px',
    flexShrink: 0
  },
  perkText: {
    fontSize: '11.5px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    marginTop: '2px'
  },
  shopsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '320px',
    overflowY: 'auto'
  },
  shopItem: {
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border)',
    ':last-child': {
      borderBottom: 'none',
      paddingBottom: 0
    }
  },
  shopMetaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
  },
  shopNameText: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  verifiedBadge: {
    fontSize: '8px',
    fontWeight: '800',
    color: 'var(--success)',
    backgroundColor: 'rgba(5,150,105,0.1)',
    padding: '1px 6px',
    borderRadius: '4px'
  },
  shopDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  shopDetailText: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  formTitle: {
    fontSize: '14px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px',
    marginBottom: '14px',
    letterSpacing: '0.5px'
  },
  successBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(5,150,105,0.08)',
    border: '1px solid var(--success)',
    color: 'var(--success)',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '11px',
    fontWeight: '700',
    lineHeight: '1.4',
    marginBottom: '14px'
  },
  loginReqText: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginBottom: '8px'
  }
};

// Add DOM stylesheet overrides to manage proportional scaling for registry pages
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @media (max-width: 768px) {
      .shop-registry-layout { grid-template-columns: 1fr !important; gap: 24px !important; }
    }
  `;
  document.head.appendChild(styleSheet);
}
