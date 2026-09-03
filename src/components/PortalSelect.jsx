import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, User, Store, Truck, Briefcase, Sliders, 
  ArrowRight, Lock, ShieldAlert, Key, X, Info, MapPin, Phone, Radio, Mail, Send,
  Activity, Navigation, DollarSign, Compass, Layers, PieChart, AlertOctagon, HelpCircle, BarChart2
} from 'lucide-react';
import Logo from '../assets/logo.svg';
import DeliveryRiderImg from '../assets/delivery_rider.png';

export default function PortalSelect({ 
  setActiveTab, user, onOpenAuth, onLogout,
  portalPanel, setPortalPanel
}) {
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [accessDeniedPortal, setAccessDeniedPortal] = useState(null);

  // Sync activePanel with parent state
  const activePanel = portalPanel || 'grid';
  const setActivePanel = setPortalPanel || (() => {});

  // Contact Form State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const portals = [
    // --- Category: customer_business ---
    {
      id: 'client_portal',
      title: 'CLIENT PORTAL',
      category: 'customer_business',
      description: 'Book cargo dispatches, trace active timelines, and communicate with guards via radio links.',
      icon: <User size={30} />,
      roleReq: 'client',
      clearanceLevel: 'Standard Client Vitals',
      theme: {
        bg: '#f1f5f9',
        border: '#cbd5e1',
        icon: '#475569',
        text: '#1e293b',
        gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
      }
    },
    {
      id: 'corporate_client',
      title: 'CORPORATE PORTAL',
      category: 'customer_business',
      description: 'ABC Enterprises portal. Track large-scale logistics and manage employee clearances.',
      icon: <Briefcase size={30} />,
      roleReq: 'corporate_client',
      clearanceLevel: 'Corporate Client Vitals',
      theme: {
        bg: '#eff6ff',
        border: '#bfdbfe',
        icon: '#2563eb',
        text: '#1e3a8a',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
      }
    },
    {
      id: 'seller_hub',
      title: 'SELLER HUB',
      category: 'customer_business',
      description: 'Register merchant storefronts, manage product catalogs, and review sales ledgers.',
      icon: <Store size={30} />,
      roleReq: 'seller',
      clearanceLevel: 'Merchant Business Vitals',
      theme: {
        bg: '#fffbeb',
        border: '#fde68a',
        icon: '#d97706',
        text: '#78350f',
        gradient: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)'
      }
    },

    // --- Category: operations ---
    {
      id: 'dispatcher',
      title: 'OPERATIONS CONTROL',
      category: 'operations',
      description: 'Coordinate Kampala/Entebbe depots, assign handlers and vehicles, and track active runs.',
      icon: <Navigation size={30} />,
      roleReq: 'dispatcher',
      clearanceLevel: 'Central Dispatch clearance',
      theme: {
        bg: '#f0fdf4',
        border: '#bbf7d0',
        icon: '#16a34a',
        text: '#14532d',
        gradient: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)'
      }
    },
    {
      id: 'handler_dashboard',
      title: 'HANDLER DASHBOARD',
      category: 'operations',
      description: 'Review active escort tasks, update transit progress status, and link radio channels.',
      icon: <Truck size={30} />,
      roleReq: 'handler',
      clearanceLevel: 'Security Handler Vitals',
      theme: {
        bg: '#fff7ed',
        border: '#fed7aa',
        icon: '#ea580c',
        text: '#7c2d12',
        gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
      }
    },
    {
      id: 'courier',
      title: 'COURIER DASHBOARD',
      category: 'operations',
      description: 'Mobile route manifests, point-to-point drop confirmation checklist, and incentive logs.',
      icon: <Compass size={30} />,
      roleReq: 'courier',
      clearanceLevel: 'Rider Clearance Vitals',
      theme: {
        bg: '#faf5ff',
        border: '#e9d5ff',
        icon: '#9333ea',
        text: '#3b0764',
        gradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)'
      }
    },
    {
      id: 'fleet_manager',
      title: 'FLEET MANAGEMENT',
      category: 'operations',
      description: 'Register cargo vans, track mileage and fuel status, and schedule preventative servicing.',
      icon: <Sliders size={30} />,
      roleReq: 'fleet_manager',
      clearanceLevel: 'Logistics Assets Clearance',
      theme: {
        bg: '#f0f9ff',
        border: '#bae6fd',
        icon: '#0284c7',
        text: '#0c4a6e',
        gradient: 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)'
      }
    },
    {
      id: 'warehouse_operator',
      title: 'WAREHOUSE STAGING',
      category: 'operations',
      description: 'Arrival packages logging, warehouse sorting bins, and loading dock manifests check-off.',
      icon: <Layers size={30} />,
      roleReq: 'warehouse_operator',
      clearanceLevel: 'Depot Staging Clearance',
      theme: {
        bg: '#fff8e1',
        border: '#ffe082',
        icon: '#ffb300',
        text: '#5d4037',
        gradient: 'linear-gradient(135deg, #ffca28 0%, #ff8f00 100%)'
      }
    },
    {
      id: 'branch_manager',
      title: 'BRANCH DASHBOARD',
      category: 'operations',
      description: 'Kampala, Entebbe, and Jinja throughput metrics, localized personnel and cash ledger.',
      icon: <MapPin size={30} />,
      roleReq: 'branch_manager',
      clearanceLevel: 'Depot Director Vitals',
      theme: {
        bg: '#eff6ff',
        border: '#bfdbfe',
        icon: '#2563eb',
        text: '#172554',
        gradient: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)'
      }
    },

    // --- Category: security_support ---
    {
      id: 'security',
      title: 'CONTROL ROOM',
      category: 'security_support',
      description: 'Classified overwatch vault. Emergency silent alarms log and tactical escort dispatch.',
      icon: <AlertOctagon size={30} />,
      roleReq: 'security',
      clearanceLevel: 'High-Value Overwatch Clearance',
      theme: {
        bg: '#fff1f2',
        border: '#fecdd3',
        icon: '#e11d48',
        text: '#4c0519',
        gradient: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)'
      }
    },
    {
      id: 'support_agent',
      title: 'CUSTOMER SUPPORT',
      category: 'security_support',
      description: 'Answer customer complaints, update destination records, and clear validation flags.',
      icon: <HelpCircle size={30} />,
      roleReq: 'support_agent',
      clearanceLevel: 'Support Agent Vitals',
      theme: {
        bg: '#fdf4ff',
        border: '#f5d0fe',
        icon: '#c026d3',
        text: '#4a044e',
        gradient: 'linear-gradient(135deg, #d946ef 0%, #a21caf 100%)'
      }
    },

    // --- Category: management ---
    {
      id: 'ceo_console',
      title: 'CEO CONSOLE',
      category: 'management',
      description: 'Review handler logs, broadcast emergency bulletins, and audit company-wide operations.',
      icon: <ShieldCheck size={30} />,
      roleReq: 'ceo',
      clearanceLevel: 'Director / Executive Vitals',
      theme: {
        bg: '#fafafa',
        border: '#e4e4e7',
        icon: '#18181b',
        text: '#09090b',
        gradient: 'linear-gradient(135deg, #27272a 0%, #09090b 100%)'
      }
    },
    {
      id: 'hr_dashboard',
      title: 'HR DASHBOARD',
      category: 'management',
      description: 'Manage courier directory, vet security clearance upgrades, and disburse transit bonuses.',
      icon: <Briefcase size={30} />,
      roleReq: 'hr',
      clearanceLevel: 'Human Resources Vitals',
      theme: {
        bg: '#f7fee7',
        border: '#d9f99d',
        icon: '#65a30d',
        text: '#1a2e05',
        gradient: 'linear-gradient(135deg, #84cc16 0%, #4d7c0f 100%)'
      }
    },
    {
      id: 'finance',
      title: 'FINANCE DASHBOARD',
      category: 'management',
      description: 'Monitor daily net revenues, audit bank reconciliations, and handle driver payroll.',
      icon: <DollarSign size={30} />,
      roleReq: 'finance',
      clearanceLevel: 'Chief Financial Officer Vitals',
      theme: {
        bg: '#ecfeff',
        border: '#cffafe',
        icon: '#0891b2',
        text: '#083344',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
      }
    },
    {
      id: 'marketplace_admin',
      title: 'MARKETPLACE ADMIN',
      category: 'management',
      description: 'Moderate product catalog submissions, approve seller shops, and verify e-commerce profiles.',
      icon: <Radio size={30} />,
      roleReq: 'marketplace_admin',
      clearanceLevel: 'Marketplace Compliance Vitals',
      theme: {
        bg: '#faf5ff',
        border: '#e9d5ff',
        icon: '#7e22ce',
        text: '#3b0764',
        gradient: 'linear-gradient(135deg, #9333ea 0%, #6b21a8 100%)'
      }
    },
    {
      id: 'analytics',
      title: 'ANALYTICS & BI',
      category: 'management',
      description: 'Aggregate logistics charts, calculate branch growth margins, and review fleet utilization.',
      icon: <BarChart2 size={30} />,
      roleReq: 'analytics',
      clearanceLevel: 'Business Intelligence Vitals',
      theme: {
        bg: '#f0fdfa',
        border: '#99f6e4',
        icon: '#0d9488',
        text: '#115e59',
        gradient: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)'
      }
    },
    {
      id: 'auditor',
      title: 'AUDIT & COMPLIANCE',
      category: 'management',
      description: 'WHO-WHAT-WHEN-WHERE compliance tracking lists. Immutable system activity record logs.',
      icon: <Key size={30} />,
      roleReq: 'auditor',
      clearanceLevel: 'Platform Compliance Auditor',
      theme: {
        bg: '#f4f4f5',
        border: '#e4e4e7',
        icon: '#52525b',
        text: '#09090b',
        gradient: 'linear-gradient(135deg, #71717a 0%, #3f3f46 100%)'
      }
    },
    {
      id: 'admin_dashboard',
      title: 'ADMIN DASHBOARD',
      category: 'management',
      description: 'Promote user profiles, review telemetry overwatch gauges, and execute cargo overrides.',
      icon: <Sliders size={30} />,
      roleReq: 'admin',
      clearanceLevel: 'Root Administrator Vitals',
      theme: {
        bg: '#fef2f2',
        border: '#fecaca',
        icon: '#dc2626',
        text: '#7f1d1d',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      }
    }
  ];

  // Set default selected portal based on role
  useEffect(() => {
    if (user) {
      const match = portals.find(p => p.roleReq === user.role);
      if (match) {
        setSelectedPortal(match.id);
      } else {
        setSelectedPortal('client_portal');
      }
    } else {
      setSelectedPortal(null);
    }
  }, [user]);

  // Access check matrix
  const checkAccess = (portal) => {
    if (!user) return { allowed: false, reason: 'LOGGED_OUT' };
    
    const role = user.role;
    
    // Admin / SuperAdmin has access to everything
    if (role === 'admin' || role === 'super_admin') return { allowed: true };
    
    // CEO has access to everything for strategic overwatch
    if (role === 'ceo') return { allowed: true };

    // Standard client portal is open to all authenticated users
    if (portal.id === 'client_portal') return { allowed: true };

    // Direct role match
    if (portal.roleReq === role) return { allowed: true };

    // Special matching alias mappings
    if (portal.id === 'dispatcher' && role === 'operations_manager') return { allowed: true };
    if (portal.id === 'finance' && role === 'finance_manager') return { allowed: true };
    if (portal.id === 'security' && (role === 'security_manager' || role === 'control_room')) return { allowed: true };

    return { allowed: false, reason: 'RESTRICTED' };
  };

  const handlePortalClick = (portal) => {
    setSelectedPortal(portal.id);
    const access = checkAccess(portal);
    
    if (!access.allowed) {
      if (access.reason === 'LOGGED_OUT') {
        onOpenAuth();
      } else {
        setAccessDeniedPortal(portal);
      }
    } else {
      setAccessDeniedPortal(null);
      setActiveTab(portal.id);
    }
  };

  const scrollToTerminals = (e) => {
    if (e) e.preventDefault();
    if (!user) {
      onOpenAuth('login');
      return;
    }
    setActivePanel('grid');
    setTimeout(() => {
      const element = document.getElementById('terminal-grid-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!senderName.trim() || !senderMessage.trim()) {
      alert("Please fill in your name and message.");
      return;
    }
    setFormSuccess("Secure transmission sent! Nakasero base command ledger has recorded your inquiry.");
    setSenderName('');
    setSenderEmail('');
    setSenderMessage('');
    setTimeout(() => setFormSuccess(''), 4000);
  };

  return (
    <div style={styles.pageContainer} className="slide-up portal-landing-page">
      
      {/* 1. HERO SECTION (With background image) */}
      <section style={styles.heroSection} className="portal-hero-section">
        <div style={styles.heroBgOverlay} />
        
        {/* Centered Hero Content */}
        <div style={styles.heroContent} className="portal-hero-content">
          <h1 style={styles.heroTitle}>SECURED CARRIER GATEWAYS</h1>
          <p style={styles.heroSubtext}>
            Your partner in <span style={styles.heroBadge}>SECURED</span> transits
          </p>
          <button onClick={scrollToTerminals} style={styles.heroBtn}>
            ACCESS TERMINALS
          </button>
        </div>
      </section>

      {/* 2. OVERLAPPING CONTENT SECTION (Only shown if activePanel is 'grid') */}
      {activePanel === 'grid' && (
        <section style={styles.overlapSection} className="portal-overlap-section">
          <div style={styles.overlapContainer} className="portal-overlap-container">
            
            {/* Left Block: Description */}
            <div style={styles.descBlock}>
              <h2 style={styles.descTitle}>FLASHPOINT SYSTEMS</h2>
              <p style={styles.descText}>
                We are an extension of your company – we integrate ourselves directly into your logistics chain. 
                Vetted agents, armored carrier escorts, and real-time encrypted radio communication channels. 
                Classified logistics demand absolute security clearance.
              </p>
            </div>

            {/* Right Block: Overlapping gold gradient card */}
            <div style={styles.goldCard} className="portal-gold-card">
              <h3 style={styles.goldCardTitle}>SUPPORT AT ANY LEVEL</h3>
              <div style={styles.goldCardDivider} />
              <p style={styles.goldCardText}>
                Flashpoint Delivery can support your secure transport efforts at any level, whether dispatching a standard courier rider, assigning a shielded agent, or deploying a full tactical armored escort team with armed guards.
              </p>
              <a href="#" onClick={scrollToTerminals} style={styles.goldCardLink}>
                VET DETAILS
              </a>
            </div>

          </div>
        </section>
      )}

      {/* 3. DYNAMIC CONTENT PANEL (Terminals grid OR About page OR Contact page) */}
      <section id="terminal-grid-section" style={styles.terminalsSection}>
        <div style={styles.terminalsContainer}>
          
          {/* Panel A: Dashboard Terminals Grid */}
          {activePanel === 'grid' && (
            <>
              {!user ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '20px', maxWidth: '640px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
                  <Lock size={44} color="var(--accent)" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '10px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>TERMINALS ENCRYPTED & HIDDEN</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
                    All system command consoles and gateway portals are restricted. Please authenticate with valid credentials to access your designated terminal dashboard.
                  </p>
                  <button className="btn btn-primary" onClick={() => onOpenAuth('login')} style={{ padding: '14px 32px', fontSize: '13px', fontWeight: '800' }}>
                    <Shield size={16} color="#000000" />
                    <span>LOGIN / REGISTER TO ACCESS TERMINAL</span>
                  </button>
                </div>
              ) : (
                <>
                  <div style={styles.terminalsHeader}>
                    <span style={styles.sectionSubtitle}>SYSTEM INTERFACE ACCESS</span>
                    <h2 style={styles.sectionTitle}>COMMAND CONSOLES</h2>
                  </div>

                  {(() => {
                    const renderCard = (p) => {
                      const isSelected = selectedPortal === p.id;
                      const access = user ? checkAccess(p) : { allowed: true };
                      
                      return (
                        <div 
                          key={p.id}
                          onClick={() => handlePortalClick(p)}
                          style={{
                            ...styles.terminalCard,
                            backgroundColor: isSelected ? 'transparent' : p.theme.bg,
                            backgroundImage: isSelected ? p.theme.gradient : 'none',
                            borderColor: isSelected ? p.theme.border : p.theme.border,
                            color: isSelected ? '#ffffff' : p.theme.text
                          }}
                          className="terminal-card-item"
                        >
                          {/* Card Icon representing drawings */}
                          <div style={{
                            ...styles.cardIcon,
                            backgroundColor: isSelected ? 'rgba(255,255,255,0.1)' : '#ffffff',
                            borderColor: isSelected ? 'rgba(255,255,255,0.2)' : p.theme.border,
                            color: isSelected ? '#ffffff' : p.theme.icon
                          }} className="cardIcon">
                            {p.icon}
                          </div>
                          
                          {/* Spaced Uppercase Text */}
                          <h4 style={{
                            ...styles.cardTitle,
                            color: isSelected ? '#ffffff' : p.theme.text
                          }}>{p.title}</h4>
                          
                          <p style={{
                            ...styles.cardDesc,
                            color: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)'
                          }}>{p.description}</p>
                          
                          {user && !access.allowed && (
                            <span style={styles.lockBadge}>
                              <Lock size={10} />
                              <span>RESTRICTED</span>
                            </span>
                          )}
                        </div>
                      );
                    };

                    const isStaff = user && !['client', 'seller', 'corporate_client'].includes(user.role);

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
                        {/* Layer 1: Customer & Business Gateways */}
                        <div style={styles.categoryBlock}>
                          <div style={styles.categoryHeader}>
                            <span style={styles.categoryNumber}>LAYER 1</span>
                            <h3 style={styles.categoryTitle}>CUSTOMER & BUSINESS GATEWAYS</h3>
                          </div>
                          <div style={styles.cardsGrid} className="portal-cards-grid">
                            {portals.filter(p => p.category === 'customer_business').map(renderCard)}
                          </div>
                        </div>

                        {isStaff && (
                          <>
                            {/* Layer 2: Operations & Field Control */}
                            <div style={styles.categoryBlock}>
                              <div style={styles.categoryHeader}>
                                <span style={styles.categoryNumber}>LAYER 2</span>
                                <h3 style={styles.categoryTitle}>OPERATIONS & FIELD CONTROL</h3>
                              </div>
                              <div style={styles.cardsGrid} className="portal-cards-grid">
                                {portals.filter(p => p.category === 'operations').map(renderCard)}
                              </div>
                            </div>

                            {/* Layer 3: Security & Support */}
                            <div style={styles.categoryBlock}>
                              <div style={styles.categoryHeader}>
                                <span style={styles.categoryNumber}>LAYER 3</span>
                                <h3 style={styles.categoryTitle}>SECURITY & SUPPORT</h3>
                              </div>
                              <div style={styles.cardsGrid} className="portal-cards-grid">
                                {portals.filter(p => p.category === 'security_support').map(renderCard)}
                              </div>
                            </div>

                            {/* Layer 4: Executive & System Administration */}
                            <div style={styles.categoryBlock}>
                              <div style={styles.categoryHeader}>
                                <span style={styles.categoryNumber}>LAYER 4</span>
                                <h3 style={styles.categoryTitle}>EXECUTIVE & SYSTEM ADMINISTRATION</h3>
                              </div>
                              <div style={styles.cardsGrid} className="portal-cards-grid">
                                {portals.filter(p => p.category === 'management').map(renderCard)}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
            </>
          )}

          {/* Panel B: ABOUT US view */}
          {activePanel === 'about' && (
            <div className="slide-up" style={styles.innerView}>
              <h2 style={styles.viewTitle}>ABOUT FLASHPOINT DELIVERY</h2>
              <div style={styles.viewDivider} />
              
              <div style={styles.aboutGrid}>
                <div style={styles.aboutContent}>
                  <h3>Uganda's Primary High-Security Carrier</h3>
                  <p>
                    Established to provide armored transport, vaulting, and classified carriage logistics, Flashpoint Delivery operates Uganda's most vetted courier system. 
                    From Nakasero Base HQ, our dispatch networks manage hundreds of secured runs across Kampala Central, Greater Wakiso, and the Central region.
                  </p>
                  
                  <h4 style={{ marginTop: '24px', color: 'var(--accent)' }}>Vetted Operations Protocol</h4>
                  <p>
                    All dispatches utilize GPS locks, armed escorts, and double verification seals. 
                    We maintain secure radio bands and client communication lines to guarantee real-time updates and absolute delivery accountability.
                  </p>
                </div>
                
                <div style={styles.aboutStatsCard} className="card">
                  <div style={styles.aboutStatItem}>
                    <span style={styles.aboutStatVal}>20+</span>
                    <span style={styles.aboutStatLbl}>Armored Escort Units</span>
                  </div>
                  <div style={styles.aboutStatItem}>
                    <span style={styles.aboutStatVal}>100%</span>
                    <span style={styles.aboutStatLbl}>Intact Seal Record</span>
                  </div>
                  <div style={styles.aboutStatItem}>
                    <span style={styles.aboutStatVal}>12 min</span>
                    <span style={styles.aboutStatLbl}>Avg. Kampala Response</span>
                  </div>
                </div>
              </div>

              <button className="btn btn-secondary" onClick={() => setActivePanel('grid')} style={{ marginTop: '30px' }}>
                <span>Back to Portals Gateway</span>
              </button>
            </div>
          )}

          {/* Panel C: CONTACT US view */}
          {activePanel === 'contact' && (
            <div className="slide-up" style={styles.innerView}>
              <h2 style={styles.viewTitle}>CONTACT SECURE OPERATIONS</h2>
              <div style={styles.viewDivider} />

              <div style={styles.contactSplitGrid}>
                
                {/* Contact Coordinates */}
                <div style={styles.contactDetails}>
                  <h3>Central Operations HQ</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Access to base premises is strictly limited to active security personnel and authorized clients.
                  </p>

                  <div style={styles.coordinateRow}>
                    <MapPin size={18} color="var(--accent)" />
                    <div>
                      <strong>Operational Location:</strong>
                      <span>Plot 12 Acacia Avenue, Nakasero Road, Kampala Central</span>
                    </div>
                  </div>

                  <div style={styles.coordinateRow}>
                    <Phone size={18} color="var(--accent)" />
                    <div>
                      <strong>Secure Hotline:</strong>
                      <span>+256 123 456 789 (Base Command)</span>
                    </div>
                  </div>

                  <div style={styles.coordinateRow}>
                    <Radio size={18} color="var(--accent)" />
                    <div>
                      <strong>Radio Link frequency:</strong>
                      <span>142.85 MHz (Classified Channel 4)</span>
                    </div>
                  </div>

                  <div style={styles.coordinateRow}>
                    <Mail size={18} color="var(--accent)" />
                    <div>
                      <strong>Encrypted Comms E-mail:</strong>
                      <span>ops@flashpoint.co.ug</span>
                    </div>
                  </div>
                </div>

                {/* Dispatch Form */}
                <div className="card" style={{ padding: '24px' }}>
                  <h4 style={{ marginBottom: '16px' }}>SECURE MESSAGING UNIT</h4>
                  
                  {formSuccess && (
                    <div style={styles.successBanner}>
                      <ShieldCheck size={16} />
                      <span>{formSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit}>
                    <div className="form-group">
                      <label className="form-label">Identifier Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Officer Okello / Merchant John" 
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="form-input" 
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Return Communication Link (Email or Radio Sign)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. user@gmail.com / Radio Ch. 2" 
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="form-input" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message Parameter Log</label>
                      <textarea 
                        rows="4" 
                        placeholder="Type message text here..." 
                        value={senderMessage}
                        onChange={(e) => setSenderMessage(e.target.value)}
                        className="form-input" 
                        style={{ resize: 'none' }}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      <Send size={14} color="#000000" />
                      <span>Transmit Secure Query</span>
                    </button>
                  </form>
                </div>

              </div>

              <button className="btn btn-secondary" onClick={() => setActivePanel('grid')} style={{ marginTop: '30px' }}>
                <span>Back to Portals Gateway</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 4. PROTOTYPE TO PRODUCTION FOOTER SECTION */}
      <section style={styles.footerSection}>
        <div style={styles.footerContainer}>
          <h2 style={styles.footerTitle}>VETTING TO CARRIAGE</h2>
          <p style={styles.footerText}>
            Full active terminal access for authorized couriers, clients, and administrators. 
            All secure channels are monitored by nakasero operations base.
          </p>
          
          {/* Engineering-style vectors at bottom */}
          <div style={styles.vectorLines}>
            <div style={styles.vectorCircle} />
            <div style={styles.vectorLineHoriz} />
          </div>
        </div>
      </section>

      {/* 5. ACCESS DENIED MODAL OVERLAY */}
      {accessDeniedPortal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="slide-up">
            <button style={styles.modalCloseBtn} onClick={() => setAccessDeniedPortal(null)}>
              <X size={20} />
            </button>
            
            <ShieldAlert size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
            <h3 style={styles.modalTitle}>ACCESS DENIED - CLEARANCE FAILURE</h3>
            
            <p style={styles.modalDesc}>
              Your authenticated profile (<strong>{user.name}</strong> - <span style={{ textTransform: 'uppercase' }}>{user.role}</span>) does not possess the clearance level required for the <strong>{accessDeniedPortal.title}</strong> terminal.
            </p>
            <p style={styles.modalSub}>
              Terminal Clearance Level: <strong style={{ color: 'var(--accent)' }}>{accessDeniedPortal.clearanceLevel}</strong>
            </p>
            
            <div style={styles.modalActions}>
              <button 
                className="btn btn-primary" 
                onClick={() => { setAccessDeniedPortal(null); onOpenAuth(); }}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                <Key size={14} color="#000000" />
                <span>Switch Account Profile</span>
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setAccessDeniedPortal(null)}
                style={{ width: '100%' }}
              >
                <span>Return to Gateways</span>
              </button>
            </div>

            <div style={styles.credentialHelpBox}>
              <span style={styles.helpLabel}>EXECUTIVE & STAFF TEST ACCOUNTS:</span>
              <ul style={styles.helpList} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingLeft: 0, listStyle: 'none' }}>
                <li><strong>Client:</strong> client@flashpoint.co.ug (pass123)</li>
                <li><strong>Handler:</strong> officer@flashpoint.co.ug (handler123)</li>
                <li><strong>CEO:</strong> ceo@flashpoint.co.ug (ceo123)</li>
                <li><strong>HR:</strong> hr@flashpoint.co.ug (hr123)</li>
                <li><strong>Admin:</strong> admin@flashpoint.co.ug (admin123)</li>
                <li><strong>Dispatch:</strong> dispatcher@flashpoint.co.ug (dispatcher123)</li>
                <li><strong>Finance:</strong> finance@flashpoint.co.ug (finance123)</li>
                <li><strong>Fleet:</strong> fleet@flashpoint.co.ug (fleet123)</li>
                <li><strong>Security:</strong> security@flashpoint.co.ug (security123)</li>
                <li><strong>Support:</strong> support@flashpoint.co.ug (support123)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  categoryBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%'
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderLeft: '3px solid #facc15',
    paddingLeft: '12px'
  },
  categoryNumber: {
    fontSize: '9px',
    fontWeight: '800',
    backgroundColor: '#18181b',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '1px'
  },
  categoryTitle: {
    fontSize: '13.5px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    letterSpacing: '0.5px'
  },
  pageContainer: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'var(--font-family)',
    position: 'relative'
  },
  heroSection: {
    height: '600px',
    position: 'relative',
    backgroundImage: `url(${DeliveryRiderImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    textAlign: 'center',
    padding: '0 20px',
    transition: 'background-size 0.3s ease, height 0.3s ease'
  },
  heroBgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)', // Deep slate overlay to enhance text contrast
    zIndex: 1
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: '24px 0',
    backgroundColor: 'transparent'
  },
  headerContainer: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    color: '#ffffff'
  },
  subTitle: {
    fontSize: '7.5px',
    fontWeight: '800',
    color: '#d4d4d8',
    letterSpacing: '0.15em',
    marginTop: '2px'
  },
  navigation: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center'
  },
  navLink: {
    color: '#e4e4e7',
    background: 'none',
    border: 'none',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    textDecoration: 'none',
    padding: '4px 8px'
  },
  navLinkActive: {
    color: '#facc15',
    borderBottom: '2px solid #facc15',
    paddingBottom: '4px'
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    marginTop: '80px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: '900',
    letterSpacing: '3px',
    marginBottom: '16px',
    color: '#ffffff',
    textTransform: 'uppercase'
  },
  heroSubtext: {
    fontSize: '15px',
    letterSpacing: '1px',
    marginBottom: '32px',
    color: '#d4d4d8'
  },
  heroBadge: {
    backgroundColor: '#facc15',
    color: '#000000',
    padding: '3px 10px',
    fontWeight: '800',
    borderRadius: '4px',
    textTransform: 'uppercase'
  },
  heroBtn: {
    backgroundColor: '#18181b',
    color: '#ffffff',
    border: 'none',
    borderRadius: '24px',
    padding: '14px 36px',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '2px',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-md)',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#facc15',
      color: '#000000',
      transform: 'translateY(-2px)'
    }
  },
  overlapSection: {
    position: 'relative',
    backgroundColor: '#ffffff',
    padding: '40px 0 80px 0',
    zIndex: 5
  },
  overlapContainer: {
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '40px',
    alignItems: 'center'
  },
  descBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  descTitle: {
    fontSize: '24px',
    fontWeight: '900',
    letterSpacing: '1.5px',
    color: '#18181b',
    textTransform: 'uppercase'
  },
  descText: {
    fontSize: '14px',
    color: '#52525b',
    lineHeight: '1.7'
  },
  goldCard: {
    background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)',
    borderRadius: '16px',
    padding: '40px',
    color: '#ffffff',
    boxShadow: '0 20px 40px rgba(202, 138, 4, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '-100px', // Overlaps the hero image!
    zIndex: 6,
    border: '2px solid #ffffff'
  },
  goldCardTitle: {
    fontSize: '16px',
    fontWeight: '900',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#ffffff'
  },
  goldCardDivider: {
    width: '40px',
    height: '2px',
    backgroundColor: '#ffffff'
  },
  goldCardText: {
    fontSize: '13.5px',
    lineHeight: '1.6',
    color: 'rgba(255,255,255,0.95)'
  },
  goldCardLink: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: '11px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    textDecoration: 'none',
    alignSelf: 'flex-start',
    borderBottom: '2px solid #ffffff',
    paddingBottom: '2px',
    transition: 'opacity 0.2s ease',
    ':hover': {
      opacity: 0.8
    }
  },
  terminalsSection: {
    backgroundColor: '#f8fafc',
    padding: '80px 0',
    borderTop: '1px solid var(--border)'
  },
  terminalsContainer: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px'
  },
  terminalsHeader: {
    textAlign: 'center',
    marginBottom: '48px'
  },
  sectionSubtitle: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '2px',
    textTransform: 'uppercase'
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '900',
    letterSpacing: '1.5px',
    color: 'var(--text-primary)',
    marginTop: '6px'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px'
  },
  terminalCard: {
    border: '1px solid var(--border)',
    padding: '36px 28px',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    boxShadow: 'var(--shadow-sm)',
    position: 'relative'
  },
  cardIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    transition: 'all 0.3s ease'
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: '900',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginTop: '4px'
  },
  cardDesc: {
    fontSize: '12px',
    lineHeight: '1.6'
  },
  lockBadge: {
    fontSize: '8.5px',
    fontWeight: '800',
    color: 'var(--danger)',
    backgroundColor: 'rgba(220,38,38,0.06)',
    border: '1px solid rgba(220,38,38,0.15)',
    padding: '2px 8px',
    borderRadius: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: 'auto'
  },
  footerSection: {
    backgroundColor: '#ffffff',
    padding: '60px 0 80px 0',
    textAlign: 'center',
    borderTop: '1px solid var(--border)',
    position: 'relative',
    overflow: 'hidden'
  },
  footerContainer: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  footerTitle: {
    fontSize: '15px',
    fontWeight: '900',
    letterSpacing: '2px',
    color: '#ca8a04',
    textTransform: 'uppercase'
  },
  footerText: {
    fontSize: '12.5px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6'
  },
  vectorLines: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: '32px',
    position: 'relative'
  },
  vectorCircle: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '1px solid var(--border)',
    backgroundColor: '#ffffff',
    zIndex: 2
  },
  vectorLineHoriz: {
    width: '120px',
    height: '1px',
    backgroundColor: 'var(--border)',
    position: 'absolute',
    top: '5px',
    zIndex: 1
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    border: '2px solid var(--border)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '460px',
    padding: '32px',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    textAlign: 'center'
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      backgroundColor: '#f4f4f5',
      color: '#000000'
    }
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '900',
    color: 'var(--danger)',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  modalDesc: {
    fontSize: '13.5px',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
    marginBottom: '10px'
  },
  modalSub: {
    fontSize: '12.5px',
    color: 'var(--text-secondary)',
    marginBottom: '24px'
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px'
  },
  credentialHelpBox: {
    borderTop: '1px dashed var(--border)',
    paddingTop: '16px',
    textAlign: 'left'
  },
  helpLabel: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '8px'
  },
  helpList: {
    listStyle: 'none',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    paddingLeft: 0
  },
  
  // Interactive Panels Styles
  innerView: {
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: 'var(--shadow-sm)'
  },
  viewTitle: {
    fontSize: '22px',
    fontWeight: '900',
    letterSpacing: '1px',
    color: 'var(--text-primary)',
    textTransform: 'uppercase'
  },
  viewDivider: {
    width: '60px',
    height: '3px',
    backgroundColor: 'var(--accent)',
    marginTop: '8px',
    marginBottom: '28px'
  },
  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '40px',
    textAlign: 'left',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '24px'
    }
  },
  aboutContent: {
    fontSize: '14.5px',
    lineHeight: '1.7',
    color: 'var(--text-secondary)'
  },
  aboutStatsCard: {
    padding: '24px',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  aboutStatItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  aboutStatVal: {
    fontSize: '28px',
    fontWeight: '900',
    color: 'var(--accent)'
  },
  aboutStatLbl: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  contactSplitGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '40px',
    textAlign: 'left',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '24px'
    }
  },
  contactDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  coordinateRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    fontSize: '13.5px'
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
    fontSize: '12.5px',
    fontWeight: '700',
    marginBottom: '16px'
  }
};

// Add DOM stylesheet overrides to keep layout the same even on mobile screen sizes
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @media (max-width: 768px) {
      /* Fill hero section from left to right on mobile with no margins/boundaries */
      .portal-hero-section {
        height: 250px !important;
        background-size: cover !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        width: 100% !important;
      }
      
      /* Keep header items on a single row (logo left, links right) just like on big screen sizes, scaled for small viewports */
      .portal-header {
        position: absolute !important;
        background-color: transparent !important;
        padding: 12px 0 !important;
      }
      .portal-header > div {
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 0 8px !important;
        gap: 2px !important;
      }
      .portal-navigation {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        justify-content: flex-end !important;
        align-items: center !important;
        gap: 4px !important;
        width: auto !important;
      }
      .portal-navigation button,
      .portal-navigation a {
        font-size: 9px !important;
        font-weight: 800 !important;
        letter-spacing: 0.2px !important;
        padding: 3px 5px !important;
        margin: 0 !important;
        color: #ffffff !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important;
        background: none !important;
        border: none !important;
      }
      .portal-logo-wrapper {
        width: 18px !important;
        height: 18px !important;
      }
      .portal-logo-title {
        font-size: 10.5px !important;
        letter-spacing: 0.2px !important;
        color: #ffffff !important;
      }
      .portal-logo-subtitle {
        font-size: 5px !important;
        letter-spacing: 0.2px !important;
        color: #d4d4d8 !important;
        margin-top: 1px !important;
      }
      
      /* Avoid gold card intercepting (overlapping) the hero image on mobile */
      .portal-overlap-section {
        padding: 24px 0 !important;
      }
      .portal-overlap-container {
        grid-template-columns: 1fr !important;
        gap: 24px !important;
      }
      .portal-gold-card {
        margin-top: 20px !important; /* Shift completely down, no overlapping */
        padding: 24px !important;
        transform: none !important;
        box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
      }
      .portal-hero-content {
        margin-top: 20px !important;
      }
      .portal-hero-content h1 {
        font-size: 16px !important;
        letter-spacing: 1px !important;
      }
      .portal-hero-content p {
        font-size: 11px !important;
        margin-bottom: 12px !important;
      }
      .portal-hero-content button {
        padding: 8px 16px !important;
        font-size: 9px !important;
      }
      
      /* Compact 2-Column Terminal Cards Grid (two buttons in a row, fully fitting screen view) */
      .portal-cards-grid {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 8px !important;
        width: 100% !important;
        padding: 0 !important;
      }
      .terminal-card-item {
        padding: 10px 8px !important;
        gap: 6px !important;
        height: auto !important;
        border-radius: 8px !important;
      }
      .terminal-card-item .cardIcon {
        width: 32px !important;
        height: 32px !important;
      }
      .terminal-card-item .cardIcon svg {
        width: 14px !important;
        height: 14px !important;
      }
      .terminal-card-item h4 {
        font-size: 9px !important;
        letter-spacing: 0.5px !important;
      }
      .terminal-card-item p {
        font-size: 8.5px !important;
        line-height: 1.3 !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
