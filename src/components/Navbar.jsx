import React, { useState, useEffect } from 'react';
import { Shield, User, LogOut, Search, Moon, Sun, ShoppingBag, Menu, X } from 'lucide-react';
import Logo from '../assets/logo.svg';

export default function Navbar({ 
  activeTab, setActiveTab, user, onOpenAuth, onLogout, onTrackOrder, 
  activeSubNode, setActiveSubNode, portalPanel, setPortalPanel,
  cart
}) {
  const [trackingQuery, setTrackingQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('fp_theme')) || 'light';
  });

  // Sync data-theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Close mobile dropdown menu when clicking anywhere outside
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (isMobileMenuOpen) {
        const toggleArea = document.querySelector('.logo-and-toggle');
        if (toggleArea && !toggleArea.contains(e.target)) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('touchstart', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('touchstart', handleDocumentClick);
    };
  }, [isMobileMenuOpen]);

  const getNavItems = () => {
    const baseItems = [
      { id: 'home', label: 'HOME' },
      { id: 'services', label: 'SERVICES' },
      { id: 'about', label: 'ABOUT US' },
      { id: 'contact', label: 'CONTACT US' }
    ];

    if (!user) {
      return baseItems;
    }
    
    const role = user.role;
    const mapping = {
      ceo: { id: 'ceo_console', label: 'CEO CONSOLE' },
      seller: { id: 'seller_hub', label: 'SELLER HUB' },
      hr: { id: 'hr_dashboard', label: 'HR DASHBOARD' },
      admin: { id: 'admin_dashboard', label: 'ADMIN' },
      super_admin: { id: 'admin_dashboard', label: 'ADMIN' },
      dispatcher: { id: 'dispatcher', label: 'DISPATCH' },
      operations_manager: { id: 'dispatcher', label: 'DISPATCH' },
      finance: { id: 'finance', label: 'FINANCE' },
      finance_manager: { id: 'finance', label: 'FINANCE' },
      fleet_manager: { id: 'fleet_manager', label: 'FLEET' },
      security: { id: 'security', label: 'SECURITY' },
      security_manager: { id: 'security', label: 'SECURITY' },
      control_room: { id: 'security', label: 'SECURITY' },
      support_agent: { id: 'support_agent', label: 'SUPPORT' },
      branch_manager: { id: 'branch_manager', label: 'BRANCH' },
      warehouse_operator: { id: 'warehouse_operator', label: 'WAREHOUSE' },
      courier: { id: 'courier', label: 'COURIER' },
      corporate_client: { id: 'corporate_client', label: 'CORPORATE' },
      marketplace_admin: { id: 'marketplace_admin', label: 'COMPLIANCE' },
      analytics: { id: 'analytics', label: 'ANALYTICS' },
      auditor: { id: 'auditor', label: 'AUDIT' }
    };
    
    const mapped = mapping[role] || { id: 'client_portal', label: 'DASHBOARD' };
    
    return [
      { id: mapped.id, label: mapped.label },
      ...baseItems
    ];
  };

  const isActive = (item) => {
    if (item.subNode) {
      return activeTab === item.id && activeSubNode === item.subNode;
    }
    if (item.id === 'about') {
      return activeTab === 'portal_select' && portalPanel === 'about';
    }
    if (item.id === 'contact') {
      return activeTab === 'portal_select' && portalPanel === 'contact';
    }
    if (item.id === 'services' || item.id === 'track') {
      return false;
    }
    return activeTab === item.id;
  };

  const handleNavClick = (item) => {
    if (item.id === 'services') {
      setActiveTab('home');
      setTimeout(() => {
        const popularSection = document.getElementById('popular-goods');
        if (popularSection) {
          popularSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    
    if (item.id === 'track') {
      setActiveTab('home');
      setTimeout(() => {
        const searchInput = document.querySelector('.hero-section-box');
        if (searchInput) {
          searchInput.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    
    if (item.id === 'about') {
      setActiveTab('portal_select');
      setPortalPanel('about');
      return;
    }
    
    if (item.id === 'contact') {
      setActiveTab('portal_select');
      setPortalPanel('contact');
      return;
    }

    setActiveTab(item.id);
    if (item.subNode && setActiveSubNode) {
      setActiveSubNode(item.subNode);
    } else if (setActiveSubNode) {
      setActiveSubNode(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;
    onTrackOrder(trackingQuery.trim().toUpperCase());
    setTrackingQuery('');
  };

  return (
    <header style={styles.header}>
      <div className="container nav-container-row" style={styles.navContainer}>
        
        {/* 1. Logo + Hamburger Toggle (Left side group) */}
        <div style={styles.logoAndToggle} className="logo-and-toggle">

          {/* Logo & Brand Title */}
          <div style={styles.logoGroup} className="logo-group-row" onClick={() => handleNavClick({ id: 'home' })}>
            <div style={styles.logoWrapper}>
              <img src={Logo} alt="Flashpoint Logo" style={styles.logoImg} />
            </div>
            <div style={styles.brandTextBox} className="brand-text-box">
              <h1 style={styles.brandTitle}>FLASHPOINT</h1>
              <span style={styles.subTitle}>SECURITY CARRIER</span>
            </div>
          </div>

          {/* Hamburger Toggle — sits right next to logo, mobile only */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={styles.menuToggleBtn}
              className="menu-toggle-btn"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Dropdown anchored directly below the toggle button */}
            {isMobileMenuOpen && (
              <div style={styles.mobileMenuDropdown} className="mobile-menu-dropdown fade-in">
                {getNavItems().map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleNavClick(item);
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      ...styles.mobileNavLink,
                      ...(isActive(item) ? styles.activeMobileNavLink : {})
                    }}
                    className="mobile-nav-link-btn"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* 2. Persistent Nav Links (Center — hidden on mobile) */}
        <nav style={styles.navigation} className="nav-links-row">
          {getNavItems().map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(item)}
              style={{
                ...styles.navLink,
                ...(isActive(item) ? styles.activeNavLink : {})
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* 3. Right Controls: Track input, Cart, Auth */}
        <div style={styles.rightControls} className="header-right-controls">
          {/* Track search */}
          <form onSubmit={handleSearchSubmit} style={styles.searchBarWrapper} className="search-bar-wrapper">
            <Search size={14} color="var(--text-secondary)" style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Track code..." 
              value={trackingQuery}
              onChange={(e) => setTrackingQuery(e.target.value)}
              style={styles.headerSearchInput} 
            />
          </form>

          {/* Dark / Light Mode Toggle Button */}
          <button 
            onClick={toggleTheme} 
            style={{
              ...styles.iconBtn,
              backgroundColor: theme === 'dark' ? 'rgba(250, 204, 21, 0.15)' : '#f4f4f5',
              borderColor: theme === 'dark' ? 'var(--accent)' : 'transparent',
              borderStyle: 'solid',
              borderWidth: '1px'
            }} 
            className="theme-toggle-btn" 
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun size={15} color="var(--accent)" />
            ) : (
              <Moon size={15} color="var(--text-primary)" />
            )}
          </button>

          {/* Cart Icon Badge */}
          <button 
            onClick={() => setActiveTab('cart')}
            style={{
              ...styles.iconBtn,
              position: 'relative',
              backgroundColor: activeTab === 'cart' ? 'rgba(250, 204, 21, 0.15)' : '#f4f4f5',
              borderColor: activeTab === 'cart' ? 'var(--accent)' : 'transparent',
              borderStyle: 'solid',
              borderWidth: '1px'
            }}
            className="cart-toggle-btn"
            title="View Shopping Cart"
          >
            <ShoppingBag size={15} color={activeTab === 'cart' ? 'var(--accent)' : 'var(--text-primary)'} />
            {(cart ? cart.reduce((sum, item) => sum + item.qty, 0) : 0) > 0 && (
              <span style={styles.cartBadge} className="cart-badge">
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </button>

          {/* Auth buttons */}
          {user ? (
            <div style={styles.userProfileWrapper} className="user-profile-btn">
              <div style={styles.userProfile} onClick={() => {
                const mapping = {
                  ceo: 'ceo_console', seller: 'seller_hub', hr: 'hr_dashboard',
                  admin: 'admin_dashboard', super_admin: 'admin_dashboard',
                  dispatcher: 'dispatcher', operations_manager: 'dispatcher',
                  finance: 'finance', finance_manager: 'finance',
                  fleet_manager: 'fleet_manager', security: 'security',
                  security_manager: 'security', control_room: 'security',
                  support_agent: 'support_agent', branch_manager: 'branch_manager',
                  warehouse_operator: 'warehouse_operator', courier: 'courier',
                  corporate_client: 'corporate_client', marketplace_admin: 'marketplace_admin',
                  analytics: 'analytics', auditor: 'auditor'
                };
                handleNavClick({ id: mapping[user.role] || 'client_portal', subNode: 'shipments' });
              }}>
                <div style={styles.avatar}><User size={13} color="#000000" /></div>
                <span style={styles.username}>{user.name.split(' ')[0]}</span>
              </div>
              <button onClick={onLogout} style={styles.logoutBtn} title="Sign Out">
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button className="btn btn-secondary" onClick={() => onOpenAuth('login')} style={{ ...styles.signInBtn, backgroundColor: '#f4f4f5', color: '#18181b', border: '1px solid var(--border)', padding: '6px 12px', fontSize: '11px', height: '32px' }}>
                <span>Login</span>
              </button>
              <button className="btn btn-primary" onClick={() => onOpenAuth('register')} style={{ ...styles.signInBtn, padding: '6px 12px', fontSize: '11px', height: '32px' }}>
                <Shield size={12} />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%'
  },
  navContainer: {
    height: '68px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    gap: '10px',
    padding: '0 15px'
  },
  logoAndToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    flexShrink: 0
  },
  logoWrapper: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  brandTextBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  brandTitle: {
    fontSize: '15px',
    fontWeight: '900',
    letterSpacing: '0.05em',
    lineHeight: '1.0',
    color: 'var(--text-primary)'
  },
  subTitle: {
    fontSize: '7.5px',
    fontWeight: '800',
    color: 'var(--text-secondary)',
    letterSpacing: '0.15em',
    marginTop: '2px'
  },
  navigation: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: '#3f3f46',
    padding: '6px 10px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s ease'
  },
  activeNavLink: {
    color: 'var(--accent)',
    fontWeight: '800'
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0
  },
  leftNavGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexShrink: 0
  },
  searchBarWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '280px'
  },
  searchIcon: {
    position: 'absolute',
    left: '8px',
    pointerEvents: 'none'
  },
  headerSearchInput: {
    width: '100%',
    padding: '6px 8px 6px 28px',
    backgroundColor: '#f4f4f5',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    fontSize: '11px',
    outline: 'none',
    color: 'var(--text-primary)',
    transition: 'all 0.3s ease',
    ':focus': {
      borderColor: 'var(--accent)',
      backgroundColor: '#ffffff'
    }
  },
  iconBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#f4f4f5',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    transition: 'all 0.2s ease'
  },
  userProfileWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '2px 2px 2px 8px',
    backgroundColor: '#ffffff'
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
  },
  avatar: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#facc15',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  username: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    maxWidth: '50px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.08)',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#ef4444'
  },
  signInBtn: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  cartBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: 'var(--accent)',
    color: '#000000',
    fontSize: '9px',
    fontWeight: '800',
    borderRadius: '50%',
    width: '15px',
    height: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)'
  },
  menuToggleBtn: {
    background: '#f4f4f5',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    display: 'none',         /* hidden on desktop by default */
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    flexShrink: 0
  },
  mobileMenuDropdown: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    minWidth: '180px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
    gap: '2px',
    zIndex: 9999
  },
  mobileNavLink: {
    padding: '10px 14px',
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--text-secondary)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    width: '100%',
    whiteSpace: 'nowrap'
  },
  activeMobileNavLink: {
    color: '#000000',
    backgroundColor: '#facc15'
  }
};

// Add DOM stylesheet overrides to manage header layout on mobile viewports
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @media (max-width: 768px) {
      /* Hide desktop nav links and moon toggle */
      .theme-toggle-btn { display: none !important; }
      .nav-links-row { display: none !important; }

      /* Show hamburger button */
      .menu-toggle-btn {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 34px !important;
        height: 34px !important;
        border-radius: 8px !important;
        flex-shrink: 0 !important;
      }

      /* Full header row stays nowrap, fits on one line */
      .nav-container-row {
        flex-wrap: nowrap !important;
        justify-content: space-between !important;
        height: 56px !important;
        padding: 0 10px !important;
        gap: 6px !important;
      }

      /* Logo + hamburger group */
      .logo-and-toggle {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        flex-shrink: 0 !important;
      }

      /* Always show logo fully including FLASHPOINT text */
      .brand-text-box {
        display: flex !important;
        flex-direction: column !important;
      }
      .logo-group-row {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        cursor: pointer !important;
      }
      .logo-group-row img {
        width: 28px !important;
        height: 28px !important;
      }
      .logo-group-row h1 {
        font-size: 13px !important;
        font-weight: 900 !important;
        letter-spacing: 0.03em !important;
        margin: 0 !important;
        line-height: 1.0 !important;
        color: var(--text-primary) !important;
      }
      .logo-group-row span {
        font-size: 7px !important;
        font-weight: 800 !important;
        letter-spacing: 0.12em !important;
        display: block !important;
        color: var(--text-secondary) !important;
        margin-top: 1px !important;
      }

      /* Dropdown floating directly below menu toggle icon */
      .mobile-menu-dropdown {
        position: absolute !important;
        top: calc(100% + 6px) !important;
        left: 0 !important;
        right: auto !important;
        min-width: 190px !important;
        width: max-content !important;
        max-width: 240px !important;
        background-color: var(--bg-secondary) !important;
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25) !important;
        padding: 8px !important;
        z-index: 99999 !important;
      }

      /* Right controls compact */
      .header-right-controls {
        display: flex !important;
        gap: 5px !important;
        align-items: center !important;
        flex-shrink: 0 !important;
      }
      .search-bar-wrapper {
        width: 75px !important;
      }
      .search-bar-wrapper input {
        font-size: 8.5px !important;
        padding: 4px 6px 4px 18px !important;
      }
      .search-bar-wrapper svg {
        left: 5px !important;
        width: 9px !important;
        height: 9px !important;
      }
      .theme-toggle-btn {
        width: 32px !important;
        height: 32px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
      }
      .theme-toggle-btn svg {
        width: 15px !important;
        height: 15px !important;
      }
      .cart-toggle-btn {
        width: 32px !important;
        height: 32px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
      }
      .cart-toggle-btn svg {
        width: 15px !important;
        height: 15px !important;
      }
      .cart-badge {
        font-size: 8.5px !important;
        width: 14px !important;
        height: 14px !important;
        top: -3px !important;
        right: -3px !important;
      }
      .header-right-controls button {
        padding: 4px 8px !important;
        font-size: 9.5px !important;
        height: 28px !important;
      }
      .user-profile-btn {
        padding: 2px 6px !important;
        font-size: 9px !important;
        height: 28px !important;
        border-radius: 8px !important;
      }
      .user-profile-btn span {
        max-width: 36px !important;
        font-size: 9px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
