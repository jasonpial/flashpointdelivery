import React, { useState } from 'react';
import { ShieldAlert, Mail, Lock, User, Phone, X, ShieldCheck, Store, Briefcase } from 'lucide-react';
import { ITEM_CATEGORIES } from '../deliveryData';

export default function Auth({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Registration type: 'client' or 'seller'
  const [registerRole, setRegisterRole] = useState('client');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+256 ');
  const [password, setPassword] = useState('');
  
  // Seller registration specific fields
  const [shopName, setShopName] = useState('');
  const [shopCategory, setShopCategory] = useState(ITEM_CATEGORIES[0].id);
  const [shopLocation, setShopLocation] = useState('');

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (registerRole === 'seller' && (!shopName.trim() || !shopLocation.trim())) {
        setError('Please enter your Business Name and Location Address.');
        return;
      }
      if (password.length < 6) {
        setError('Security standard requires passwords to be at least 6 characters.');
        return;
      }
    }

    if (isLogin) {
      const cleanEmail = email.toLowerCase().trim();
      
      // Match roles
      if (cleanEmail === 'client@flashpoint.co.ug' && password === 'password123') {
        onLoginSuccess({
          name: 'Senteza Ronald',
          email: 'client@flashpoint.co.ug',
          phone: '+256 772 900 123',
          role: 'client'
        });
        onClose();
      } else if (cleanEmail === 'officer@flashpoint.co.ug' && password === 'handler123') {
        onLoginSuccess({
          name: 'Sgt. Okello Emmanuel',
          email: 'officer@flashpoint.co.ug',
          phone: '+256 788 123 456',
          role: 'handler'
        });
        onClose();
      } else if (cleanEmail === 'ceo@flashpoint.co.ug' && password === 'ceo123') {
        onLoginSuccess({
          name: 'Director Mukasa',
          email: 'ceo@flashpoint.co.ug',
          phone: '+256 701 000 001',
          role: 'ceo'
        });
        onClose();
      } else if (cleanEmail === 'merchant@flashpoint.co.ug' && password === 'seller123') {
        onLoginSuccess({
          name: 'Acacia Tech Hub',
          email: 'merchant@flashpoint.co.ug',
          phone: '+256 772 333 444',
          role: 'seller'
        });
        onClose();
      } else if (cleanEmail === 'hr@flashpoint.co.ug' && password === 'hr123') {
        onLoginSuccess({
          name: 'Juliet Namayanja',
          email: 'hr@flashpoint.co.ug',
          phone: '+256 755 888 999',
          role: 'hr'
        });
        onClose();
      } else if (cleanEmail === 'admin@flashpoint.co.ug' && password === 'admin123') {
        onLoginSuccess({
          name: 'SuperAdmin Kigozi',
          email: 'admin@flashpoint.co.ug',
          phone: '+256 700 111 222',
          role: 'admin'
        });
        onClose();
      } else {
        // Fallback: allow flexible logins for passwords >= 6
        if (password.length >= 6) {
          const defaultName = email.split('@')[0];
          onLoginSuccess({
            name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
            email: cleanEmail,
            phone: phone.trim() || '+256 700 000 000',
            role: cleanEmail.includes('ceo') ? 'ceo' : cleanEmail.includes('officer') ? 'handler' : cleanEmail.includes('merchant') ? 'seller' : cleanEmail.includes('hr') ? 'hr' : cleanEmail.includes('admin') ? 'admin' : 'client'
          });
          onClose();
        } else {
          setError('Invalid credentials. Use Fast Login options below to test easily.');
        }
      }
    } else {
      // Register new user
      if (registerRole === 'seller') {
        onLoginSuccess({
          name: shopName.trim(), // Shop name acts as user display name for sellers
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          role: 'seller',
          shopDetails: {
            name: shopName.trim(),
            category: shopCategory,
            location: shopLocation.trim(),
            phone: phone.trim()
          }
        });
      } else {
        onLoginSuccess({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          role: 'client'
        });
      }
      onClose();
    }
  };

  const handleDemoFill = (role) => {
    setError('');
    setIsLogin(true);
    if (role === 'client') {
      setEmail('client@flashpoint.co.ug');
      setPassword('password123');
    } else if (role === 'handler') {
      setEmail('officer@flashpoint.co.ug');
      setPassword('handler123');
    } else if (role === 'ceo') {
      setEmail('ceo@flashpoint.co.ug');
      setPassword('ceo123');
    } else if (role === 'seller') {
      setEmail('merchant@flashpoint.co.ug');
      setPassword('seller123');
    } else if (role === 'hr') {
      setEmail('hr@flashpoint.co.ug');
      setPassword('hr123');
    } else if (role === 'admin') {
      setEmail('admin@flashpoint.co.ug');
      setPassword('admin123');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="slide-up">
        {/* Modal Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <ShieldCheck size={20} color="var(--accent)" />
            <h3>{isLogin ? 'SECURE ACCOUNT LOGIN' : 'CREATE PORTAL ACCOUNT'}</h3>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Info Alert */}
        <div style={styles.alertBox}>
          <ShieldAlert size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={styles.alertText}>
              Security check active. Credentials must be vetted. Multi-role routing initialized.
            </p>
          </div>
        </div>

        {/* Toggle Register Role Options (Only when registering) */}
        {!isLogin && (
          <div style={styles.roleToggleGroup}>
            <button 
              type="button" 
              onClick={() => setRegisterRole('client')}
              style={{ ...styles.roleSelectBtn, ...(registerRole === 'client' ? styles.roleSelectBtnActive : {}) }}
            >
              <User size={14} />
              <span>Standard Client</span>
            </button>
            <button 
              type="button" 
              onClick={() => setRegisterRole('seller')}
              style={{ ...styles.roleSelectBtn, ...(registerRole === 'seller' ? styles.roleSelectBtnActive : {}) }}
            >
              <Store size={14} />
              <span>Business Seller</span>
            </button>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorBanner}>{error}</div>}

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Contact Person Name</label>
              <div style={styles.inputWrapper}>
                <User size={16} style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="e.g. Senteza Ronald"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  style={styles.inputPadding}
                />
              </div>
            </div>
          )}

          {/* Seller Specific Registration Fields */}
          {!isLogin && registerRole === 'seller' && (
            <div style={{ backgroundColor: 'rgba(250,204,21,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label">Business / Shop Name</label>
                <div style={styles.inputWrapper}>
                  <Store size={16} style={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="e.g. Kikuubo Electronic Importers"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="form-input"
                    style={styles.inputPadding}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Business Category</label>
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

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Business Physical Address</label>
                <div style={styles.inputWrapper}>
                  <Briefcase size={16} style={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Plot & Street, Kampala"
                    value={shopLocation}
                    onChange={(e) => setShopLocation(e.target.value)}
                    className="form-input"
                    style={styles.inputPadding}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="user@flashpoint.co.ug"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={styles.inputPadding}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Ugandan Phone Contact</label>
              <div style={styles.inputWrapper}>
                <Phone size={16} style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="+256 700 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  style={styles.inputPadding}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Security Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={16} style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={styles.inputPadding}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
            <span>{isLogin ? 'Authenticate Access' : 'Create Vetted Profile'}</span>
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        {isLogin && (
          <div style={styles.demoSection}>
            <p style={styles.demoLabel}>EXECUTIVE & STAFF TEST PORTALS (ONE-CLICK):</p>
            <div style={styles.demoBtnsGrid}>
              <button onClick={() => handleDemoFill('client')} style={styles.demoFillBtn}>
                Client Log
              </button>
              <button onClick={() => handleDemoFill('handler')} style={styles.demoFillBtn}>
                Handler Log
              </button>
              <button onClick={() => handleDemoFill('ceo')} style={styles.demoFillBtn}>
                CEO Log
              </button>
              <button onClick={() => handleDemoFill('seller')} style={styles.demoFillBtn}>
                Seller Log
              </button>
              <button onClick={() => handleDemoFill('hr')} style={styles.demoFillBtn}>
                HR Log
              </button>
              <button onClick={() => handleDemoFill('admin')} style={styles.demoFillBtn}>
                Admin Log
              </button>
            </div>
          </div>
        )}

        {/* Toggle Mode Footer */}
        <div style={styles.footer}>
          <span>{isLogin ? "Don't have a secure profile?" : "Already registered?"}</span>
          <button style={styles.modeToggleBtn} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Register Store/Profile' : 'Access Portal'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: '20px'
  },
  modal: {
    backgroundColor: 'var(--bg-secondary)',
    border: '2px solid var(--border)',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '450px',
    padding: '28px',
    position: 'relative',
    boxShadow: '0 20px 40px rgba(0,0,0,0.6), var(--shadow-glow)',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: '#ffffff'
    }
  },
  alertBox: {
    display: 'flex',
    gap: '10px',
    backgroundColor: 'rgba(250,204,21,0.03)',
    border: '1px dashed var(--accent)',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '16px'
  },
  alertText: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  },
  roleToggleGroup: {
    display: 'flex',
    gap: '10px',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    marginBottom: '16px'
  },
  roleSelectBtn: {
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s ease'
  },
  roleSelectBtnActive: {
    backgroundColor: 'var(--bg-secondary)',
    color: '#ffffff',
    border: '1px solid var(--border)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '16px',
    textAlign: 'center'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    color: 'var(--text-muted)'
  },
  inputPadding: {
    paddingLeft: '42px'
  },
  submitBtn: {
    marginTop: '10px',
    padding: '14px',
    width: '100%'
  },
  demoSection: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    textAlign: 'center'
  },
  demoLabel: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    marginBottom: '10px',
    letterSpacing: '0.5px'
  },
  demoBtnsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px'
  },
  demoFillBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: '11px',
    fontWeight: '700',
    padding: '6px 0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: 'var(--accent)',
      backgroundColor: 'var(--bg-tertiary)'
    }
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '24px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    borderTop: '1px solid var(--border)',
    paddingTop: '16px'
  },
  modeToggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};
