import React, { useState } from 'react';
import { Shield, User, LogOut, Search, Moon } from 'lucide-react';
import Logo from '../assets/logo.svg';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout, onTrackOrder }) {
  const [trackingQuery, setTrackingQuery] = useState('');

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'portal_select', label: 'PORTAL' }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
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
        
        {/* Left Side Group: Logo & Navigation Links */}
        <div style={styles.leftNavGroup} className="left-nav-group-row">
          
          {/* Logo & Brand Title */}
          <div style={styles.logoGroup} className="logo-group-row" onClick={() => handleNavClick('home')}>
            <div style={styles.logoWrapper}>
              <img src={Logo} alt="Flashpoint Logo" style={styles.logoImg} />
            </div>
            <div style={styles.brandTextBox} className="brand-text-box">
              <h1 style={styles.brandTitle}>FLASHPOINT</h1>
              <span style={styles.subTitle}>SECURITY CARRIER</span>
            </div>
          </div>

          {/* Persistent Nav Links (Seen on all screen sizes, no hamburger collapse!) */}
          <nav style={styles.navigation} className="nav-links-row">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  ...styles.navLink,
                  ...(activeTab === item.id ? styles.activeNavLink : {})
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

        </div>

        {/* Search Bar Input, Moon Icon, & Auth State */}
        <div style={styles.rightControls} className="header-right-controls">
          {/* Header Search Input Bar alongside the search icon */}
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

          {/* Dark Mode Icon */}
          <button style={styles.iconBtn} className="theme-toggle-btn" title="Toggle Theme Mode">
            <Moon size={15} />
          </button>

          {/* Auth State Button */}
          {user ? (
            <div style={styles.userProfileWrapper} className="user-profile-btn">
              <div style={styles.userProfile} onClick={() => handleNavClick(user.role === 'ceo' ? 'ceo_console' : user.role === 'seller' ? 'seller_hub' : user.role === 'hr' ? 'hr_dashboard' : user.role === 'admin' ? 'admin_dashboard' : 'client_portal')}>
                <div style={styles.avatar}>
                  <User size={13} color="#000000" />
                </div>
                <span style={styles.username}>{user.name.split(' ')[0]}</span>
              </div>
              <button 
                onClick={onLogout} 
                style={styles.logoutBtn} 
                title="Sign Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onOpenAuth} style={styles.signInBtn}>
              <Shield size={12} />
              <span>Login</span>
            </button>
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
    flexWrap: 'wrap',
    gap: '10px',
    padding: '0 15px',
    '@media (max-width: 768px)': {
      height: 'auto',
      padding: '10px 8px',
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
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
    flexDirection: 'column',
    '@media (max-width: 480px)': {
      display: 'none' // Hide subtitle brand text on extremely small width to fit nav links
    }
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
    justifyContent: 'center',
    '@media (max-width: 768px)': {
      width: '100%',
      order: 3, // Push links to stack neatly below logo/controls on tablet/mobile if needed
      borderTop: '1px solid #f4f4f5',
      paddingTop: '6px',
      marginTop: '4px'
    }
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
    transition: 'all 0.2s ease',
    ':hover': {
      color: '#000000',
      backgroundColor: '#f4f4f5'
    },
    '@media (max-width: 480px)': {
      padding: '4px 6px',
      fontSize: '10px'
    }
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
    gap: '16px', // Reduced horizontal spacing from default
    flexShrink: 0
  },
  searchBarWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '280px', // Increased space for the search bar
    '@media (max-width: 600px)': {
      width: '100px' // Shrink on mobile so everything fits
    }
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
  }
};

// Add DOM stylesheet overrides to manage header layout on mobile viewports
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @media (max-width: 768px) {
      .theme-toggle-btn { display: none !important; }
      .header-right-controls {
        display: flex !important;
        gap: 4px !important;
        align-items: center !important;
      }
      .left-nav-group-row {
        gap: 8px !important;
      }
      .search-bar-wrapper {
        width: 100px !important;
      }
      .search-bar-wrapper input {
        font-size: 9.5px !important;
        padding: 4px 6px 4px 20px !important;
      }
      .search-bar-wrapper svg {
        left: 6px !important;
        width: 10px !important;
        height: 10px !important;
      }
      .header-right-controls button, 
      .user-profile-btn {
        padding: 4px 8px !important;
        font-size: 9.5px !important;
        border-radius: 12px !important;
        display: flex !important;
        align-items: center !important;
        gap: 4px !important;
      }
      .user-profile-btn span {
        max-width: 32px !important;
        font-size: 9.5px !important;
      }
      .user-profile-btn div {
        width: 14px !important;
        height: 14px !important;
      }
      .user-profile-btn div svg {
        width: 8px !important;
        height: 8px !important;
      }
      .header-right-controls button svg {
        width: 10px !important;
        height: 10px !important;
      }
      .nav-container-row {
        flex-wrap: nowrap !important;
        justify-content: space-between !important;
        height: 52px !important;
        padding: 0 8px !important;
        gap: 4px !important;
      }
      .logo-group-row {
        gap: 4px !important;
      }
      .logo-group-row h1 {
        font-size: 11.5px !important;
      }
      .logo-group-row span {
        display: none !important;
      }
      .nav-links-row {
        flex-wrap: nowrap !important;
        justify-content: flex-end !important;
        overflow-x: auto !important;
        white-space: nowrap !important;
        gap: 2px !important;
        width: auto !important;
        max-width: 50% !important;
        margin-top: 0 !important;
        padding-top: 0 !important;
        border-top: none !important;
        scrollbar-width: none !important;
      }
      .nav-links-row::-webkit-scrollbar {
        display: none !important;
      }
      .nav-links-row button {
        padding: 4px 6px !important;
        font-size: 9.5px !important;
        letter-spacing: 0px !important;
        flex-shrink: 0 !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
