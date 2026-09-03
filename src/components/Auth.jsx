import React, { useState, useEffect } from 'react';
import { ShieldAlert, Mail, Lock, User, Phone, X, ShieldCheck, Store, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { ITEM_CATEGORIES } from '../deliveryData';
import './Auth.css';

export default function Auth({ isOpen, onClose, onLoginSuccess, initialIsLogin }) {
  // isRightPanelActive = true means Sign Up panel is active; false means Sign In panel is active
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [showDemoLogins, setShowDemoLogins] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRightPanelActive(initialIsLogin !== undefined ? !initialIsLogin : false);
    }
  }, [isOpen, initialIsLogin]);

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

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

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
    } else if (cleanEmail === 'dispatcher@flashpoint.co.ug' && password === 'dispatcher123') {
      onLoginSuccess({
        name: 'Mark Okot',
        email: 'dispatcher@flashpoint.co.ug',
        phone: '+256 781 444 555',
        role: 'dispatcher'
      });
      onClose();
    } else if (cleanEmail === 'finance@flashpoint.co.ug' && password === 'finance123') {
      onLoginSuccess({
        name: 'Sarah Namagembe',
        email: 'finance@flashpoint.co.ug',
        phone: '+256 772 888 111',
        role: 'finance'
      });
      onClose();
    } else if (cleanEmail === 'fleet@flashpoint.co.ug' && password === 'fleet123') {
      onLoginSuccess({
        name: 'Brian Senyondo',
        email: 'fleet@flashpoint.co.ug',
        phone: '+256 701 999 000',
        role: 'fleet_manager'
      });
      onClose();
    } else if (cleanEmail === 'security@flashpoint.co.ug' && password === 'security123') {
      onLoginSuccess({
        name: 'Lt. Col. Katumba',
        email: 'security@flashpoint.co.ug',
        phone: '+256 752 333 999',
        role: 'security'
      });
      onClose();
    } else if (cleanEmail === 'support@flashpoint.co.ug' && password === 'support123') {
      onLoginSuccess({
        name: 'Patricia Kemigisha',
        email: 'support@flashpoint.co.ug',
        phone: '+256 788 444 333',
        role: 'support_agent'
      });
      onClose();
    } else if (cleanEmail === 'branch@flashpoint.co.ug' && password === 'branch123') {
      onLoginSuccess({
        name: 'Mukasa Henry',
        email: 'branch@flashpoint.co.ug',
        phone: '+256 771 222 333',
        role: 'branch_manager'
      });
      onClose();
    } else if (cleanEmail === 'warehouse@flashpoint.co.ug' && password === 'warehouse123') {
      onLoginSuccess({
        name: 'Lwanga Ivan',
        email: 'warehouse@flashpoint.co.ug',
        phone: '+256 702 444 555',
        role: 'warehouse_operator'
      });
      onClose();
    } else if (cleanEmail === 'courier@flashpoint.co.ug' && password === 'courier123') {
      onLoginSuccess({
        name: 'Nsubuga Henry',
        email: 'courier@flashpoint.co.ug',
        phone: '+256 752 989 776',
        role: 'courier'
      });
      onClose();
    } else if (cleanEmail === 'corporate@flashpoint.co.ug' && password === 'corporate123') {
      onLoginSuccess({
        name: 'ABC Enterprises',
        email: 'corporate@flashpoint.co.ug',
        phone: '+256 701 443 221',
        role: 'corporate_client'
      });
      onClose();
    } else if (cleanEmail === 'marketplaceadmin@flashpoint.co.ug' && password === 'marketplaceadmin123') {
      onLoginSuccess({
        name: 'Mirembe Grace',
        email: 'marketplaceadmin@flashpoint.co.ug',
        phone: '+256 772 555 444',
        role: 'marketplace_admin'
      });
      onClose();
    } else if (cleanEmail === 'analytics@flashpoint.co.ug' && password === 'analytics123') {
      onLoginSuccess({
        name: 'Dr. Ssempijja Joseph',
        email: 'analytics@flashpoint.co.ug',
        phone: '+256 788 111 222',
        role: 'analytics'
      });
      onClose();
    } else if (cleanEmail === 'auditor@flashpoint.co.ug' && password === 'auditor123') {
      onLoginSuccess({
        name: 'Kiggundu Paul',
        email: 'auditor@flashpoint.co.ug',
        phone: '+256 771 900 800',
        role: 'auditor'
      });
      onClose();
    } else {
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
        setError('Invalid credentials. Use staff test options below to log in instantly.');
      }
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all mandatory registration fields.');
      return;
    }
    if (registerRole === 'seller' && (!shopName.trim() || !shopLocation.trim())) {
      setError('Please enter your Business Name and Location Address.');
      return;
    }
    if (password.length < 6) {
      setError('Security standards require password to be at least 6 characters.');
      return;
    }

    if (registerRole === 'seller') {
      onLoginSuccess({
        name: shopName.trim(),
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
  };

  const handleDemoFill = (role) => {
    setError('');
    setIsRightPanelActive(false);
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
    } else if (role === 'dispatcher') {
      setEmail('dispatcher@flashpoint.co.ug');
      setPassword('dispatcher123');
    } else if (role === 'finance') {
      setEmail('finance@flashpoint.co.ug');
      setPassword('finance123');
    } else if (role === 'fleet_manager') {
      setEmail('fleet@flashpoint.co.ug');
      setPassword('fleet123');
    } else if (role === 'security') {
      setEmail('security@flashpoint.co.ug');
      setPassword('security123');
    } else if (role === 'support_agent') {
      setEmail('support@flashpoint.co.ug');
      setPassword('support123');
    } else if (role === 'branch_manager') {
      setEmail('branch@flashpoint.co.ug');
      setPassword('branch123');
    } else if (role === 'warehouse_operator') {
      setEmail('warehouse@flashpoint.co.ug');
      setPassword('warehouse123');
    } else if (role === 'courier') {
      setEmail('courier@flashpoint.co.ug');
      setPassword('courier123');
    } else if (role === 'corporate_client') {
      setEmail('corporate@flashpoint.co.ug');
      setPassword('corporate123');
    } else if (role === 'marketplace_admin') {
      setEmail('marketplaceadmin@flashpoint.co.ug');
      setPassword('marketplaceadmin123');
    } else if (role === 'analytics') {
      setEmail('analytics@flashpoint.co.ug');
      setPassword('analytics123');
    } else if (role === 'auditor') {
      setEmail('auditor@flashpoint.co.ug');
      setPassword('auditor123');
    }
  };

  return (
    <div className="auth-modal-backdrop">
      <div className={`auth-slider-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
        
        {/* Close Button */}
        <button className="auth-close-btn" onClick={onClose} aria-label="Close authentication modal">
          <X size={20} />
        </button>

        {/* ----------------- SIGN UP FORM (RIGHT SIDE) ----------------- */}
        <div className="auth-form-container sign-up-container">
          <form onSubmit={handleSignUpSubmit}>
            <h1 className="auth-title">Create Account</h1>

            {/* Social Links Bar */}
            <div className="social-container">
              <a href="#" onClick={(e) => e.preventDefault()} className="social-icon-btn" title="Sign up with Facebook">f</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="social-icon-btn" title="Sign up with Google">G+</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="social-icon-btn" title="Sign up with LinkedIn">in</a>
            </div>

            <span className="auth-subtitle">or use your details for registration</span>

            {error && isRightPanelActive && <div className="auth-error-banner">{error}</div>}

            {/* Role Toggle Selector */}
            <div className="auth-role-toggle">
              <button 
                type="button" 
                onClick={() => setRegisterRole('client')}
                className={`auth-role-btn ${registerRole === 'client' ? 'active' : ''}`}
              >
                <User size={13} />
                <span>Client</span>
              </button>
              <button 
                type="button" 
                onClick={() => setRegisterRole('seller')}
                className={`auth-role-btn ${registerRole === 'seller' ? 'active' : ''}`}
              >
                <Store size={13} />
                <span>Business Seller</span>
              </button>
            </div>

            {/* Full Name */}
            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            {/* Seller Specific Fields */}
            {registerRole === 'seller' && (
              <>
                <div className="auth-input-group">
                  <div className="auth-input-wrapper">
                    <Store size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      placeholder="Business / Shop Name"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <div className="auth-input-wrapper">
                    <Briefcase size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      placeholder="Shop Location Address"
                      value={shopLocation}
                      onChange={(e) => setShopLocation(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <Phone size={16} className="auth-input-icon" />
                <input
                  type="text"
                  placeholder="Phone (+256...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            <button type="submit" className="auth-btn-primary">
              SIGN UP
            </button>
          </form>
        </div>

        {/* ----------------- SIGN IN FORM (LEFT SIDE) ----------------- */}
        <div className="auth-form-container sign-in-container">
          <form onSubmit={handleSignInSubmit}>
            <h1 className="auth-title">Sign in</h1>

            {/* Social Links Bar */}
            <div className="social-container">
              <a href="#" onClick={(e) => e.preventDefault()} className="social-icon-btn" title="Sign in with Facebook">f</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="social-icon-btn" title="Sign in with Google">G+</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="social-icon-btn" title="Sign in with LinkedIn">in</a>
            </div>

            <span className="auth-subtitle">or use your account</span>

            {error && !isRightPanelActive && <div className="auth-error-banner">{error}</div>}

            {/* Email */}
            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>

            <a href="#" onClick={(e) => { e.preventDefault(); alert('Reset password link sent to registered email.'); }} className="auth-link">
              Forgot your password?
            </a>

            <button type="submit" className="auth-btn-primary">
              SIGN IN
            </button>

            {/* Quick Staff Fast Login Section */}
            <div className="auth-demo-drawer">
              <button 
                type="button" 
                className="auth-demo-toggle"
                onClick={() => setShowDemoLogins(!showDemoLogins)}
              >
                <ShieldCheck size={13} />
                <span>One-Click Test Accounts</span>
                {showDemoLogins ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {showDemoLogins && (
                <div className="auth-demo-grid">
                  <button type="button" onClick={() => handleDemoFill('client')} className="auth-demo-btn">Client</button>
                  <button type="button" onClick={() => handleDemoFill('handler')} className="auth-demo-btn">Handler</button>
                  <button type="button" onClick={() => handleDemoFill('ceo')} className="auth-demo-btn">CEO</button>
                  <button type="button" onClick={() => handleDemoFill('seller')} className="auth-demo-btn">Seller</button>
                  <button type="button" onClick={() => handleDemoFill('admin')} className="auth-demo-btn">Admin</button>
                  <button type="button" onClick={() => handleDemoFill('dispatcher')} className="auth-demo-btn">Dispatch</button>
                  <button type="button" onClick={() => handleDemoFill('finance')} className="auth-demo-btn">Finance</button>
                  <button type="button" onClick={() => handleDemoFill('fleet_manager')} className="auth-demo-btn">Fleet</button>
                  <button type="button" onClick={() => handleDemoFill('security')} className="auth-demo-btn">Security</button>
                  <button type="button" onClick={() => handleDemoFill('support_agent')} className="auth-demo-btn">Support</button>
                  <button type="button" onClick={() => handleDemoFill('branch_manager')} className="auth-demo-btn">Branch</button>
                  <button type="button" onClick={() => handleDemoFill('warehouse_operator')} className="auth-demo-btn">Warehouse</button>
                  <button type="button" onClick={() => handleDemoFill('courier')} className="auth-demo-btn">Courier</button>
                  <button type="button" onClick={() => handleDemoFill('corporate_client')} className="auth-demo-btn">Corporate</button>
                  <button type="button" onClick={() => handleDemoFill('analytics')} className="auth-demo-btn">Analytics</button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* ----------------- SLIDING OVERLAY CONTAINER ----------------- */}
        <div className="auth-overlay-container">
          <div className="auth-overlay">
            
            {/* Left Overlay Panel (Shown when Sign Up form is active on right) */}
            <div className="auth-overlay-panel auth-overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button 
                className="auth-btn-ghost" 
                onClick={() => { setIsRightPanelActive(false); setError(''); }}
              >
                SIGN IN
              </button>
            </div>

            {/* Right Overlay Panel (Shown when Sign In form is active on left) */}
            <div className="auth-overlay-panel auth-overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button 
                className="auth-btn-ghost" 
                onClick={() => { setIsRightPanelActive(true); setError(''); }}
              >
                SIGN UP
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
