import React, { useState } from 'react';
import { Search, ChevronRight, ArrowRight, Zap, Shield, X, ShoppingBag, Store } from 'lucide-react';
import HeroBgImg from '../assets/hero_bg.jpg';

export default function Hero({ 
  onBookClick, onTrackOrder, onPurchaseItem, user, onOpenAuth, onLogout,
  onNavigateToMarketplace, onNavigateToRegisterShop
}) {
  const [trackingId, setTrackingId] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  
  // Popular Goods Category Pill State
  const [activeCategoryPill, setActiveCategoryPill] = useState('electronics');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setSearchError('Please enter a valid tracking ID.');
      return;
    }
    
    const cleanId = trackingId.toUpperCase().trim();
    if (cleanId === 'FP-9031' || cleanId === 'FP-8241') {
      setSearchError('');
      onTrackOrder(cleanId);
    } else {
      setSearchError(`Tracking ID "${cleanId}" not found. Try 'FP-9031' or 'FP-8241'.`);
    }
  };

  // Popular Goods local manifest
  const popularGoods = [
    { name: 'mobile phones', price: 350000, category: 'electronics', seller: 'Acacia Tech Hub', description: 'Vetted cargo with GPS lock.', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="15" y="25" width="70" height="44" rx="4" fill="%2318181b" stroke="%23facc15" stroke-width="3"/><rect x="10" y="69" width="80" height="6" rx="2" fill="%23facc15"/><line x1="30" y1="40" x2="70" y2="40" stroke="%23ffffff" stroke-width="2"/></svg>' },
    { name: 'printers', price: 620000, category: 'electronics', seller: 'Acacia Tech Hub', description: 'Laser all-in-one printer.', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="25" y="25" width="50" height="40" rx="3" fill="%2318181b" stroke="%23facc15" stroke-width="3"/><rect x="35" y="15" width="30" height="10" fill="%23facc15"/><rect x="30" y="65" width="40" height="15" fill="%23facc15"/></svg>' },
    { name: 'laptops', price: 1850000, category: 'electronics', seller: 'Acacia Tech Hub', description: 'Business laptops under escort.', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="15" y="25" width="70" height="44" rx="4" fill="%2318181b" stroke="%23facc15" stroke-width="3"/><rect x="10" y="69" width="80" height="6" rx="2" fill="%23facc15"/><line x1="30" y1="40" x2="70" y2="40" stroke="%23ffffff" stroke-width="2"/></svg>' },
    
    { name: 'jewelry', price: 950000, category: 'high_value', seller: 'Kampala Diamond Dealers', description: 'Armored vault transportation.', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="%2318181b" stroke="%23facc15" stroke-width="4"/><circle cx="50" cy="50" r="10" fill="none" stroke="%23facc15" stroke-width="3"/></svg>' },
    { name: 'digital watches', price: 250000, category: 'high_value', seller: 'Acacia Tech Hub', description: 'Vetted courier box transit.', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="25" y="10" width="50" height="80" rx="10" fill="none" stroke="%2318181b" stroke-width="6"/><rect x="35" y="30" width="30" height="40" rx="4" fill="%2318181b" stroke="%23facc15" stroke-width="3"/></svg>' },
    
    { name: 'envelop documents', price: 5000, category: 'documents', seller: 'Kampala Printing Press', description: 'Sealed corporate envelope.', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="15" width="60" height="70" rx="6" fill="%2318181b" stroke="%23facc15" stroke-width="3"/></svg>' },
    { name: 'exams', price: 12000, category: 'documents', seller: 'UNEB Main Depot', description: 'Heavily guarded academic papers.', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="25" y="25" width="50" height="50" fill="%2318181b" stroke="%23facc15" stroke-width="3"/></svg>' },

    { name: 'tea leaves', price: 8000, category: 'food', seller: 'Uganda Tea Merchants', description: 'Organic farm black tea leaves.', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 20 C25 40 25 70 50 80 C75 70 75 40 50 20Z" fill="%2318181b" stroke="%23facc15" stroke-width="3"/></svg>' },
    { name: 'coffee', price: 25000, category: 'food', seller: 'Uganda Coffee Exporters', description: 'Roasted Arabica coffee beans.', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="35" ry="25" fill="%2318181b" stroke="%23facc15" stroke-width="3"/></svg>' }
  ];

  const filteredGoods = popularGoods.filter(item => item.category === activeCategoryPill);

  return (
    <div style={styles.landingContainer} className="slide-up">
      
      {/* 1. HERO MAIN BANNER SECTION */}
      <section style={styles.heroSliderSection} className="hero-section-box">
        {/* Invisible link over Logo area */}
        <div 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          style={{
            ...styles.logoOverlayLink,
            backgroundColor: isLogoHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          }}
          title="Flashpoint Deliveries - Home"
        />

        {/* Interactive Overlay Button over "Track Your Package ->" */}
        <button 
          onClick={() => setIsTrackingModalOpen(true)}
          onMouseEnter={() => setIsBtnHovered(true)}
          onMouseLeave={() => setIsBtnHovered(false)}
          style={{
            ...styles.trackOverlayBtn,
            boxShadow: isBtnHovered ? '0 0 20px rgba(250, 204, 21, 0.5)' : 'none',
            backgroundColor: isBtnHovered ? 'rgba(250, 204, 21, 0.08)' : 'transparent',
          }}
          title="Track Your Package"
        />
      </section>

      {/* 1.5 NAVIGATION ENTRY BUTTONS */}
      <section style={styles.entrySection} className="entry-section-pills">
        <div className="container" style={styles.entryGrid}>
          <div 
            onClick={onNavigateToMarketplace}
            className="card card-hover entry-card" 
            style={styles.entryCard}
          >
            <div style={styles.entryIconBox} className="entry-icon-box">
              <ShoppingBag size={20} color="#000000" />
            </div>
            <div style={styles.entryTextCol}>
              <h4 style={styles.entryCardTitle} className="entry-card-title">Market Place</h4>
              <p style={styles.entryCardDesc} className="entry-card-desc">Shop verified Ugandan businesses and book deliveries.</p>
            </div>
            <ArrowRight size={16} color="var(--accent)" style={styles.entryArrow} className="entry-arrow" />
          </div>

          <div 
            onClick={onNavigateToRegisterShop}
            className="card card-hover entry-card" 
            style={styles.entryCard}
          >
            <div style={styles.entryIconBox} className="entry-icon-box">
              <Store size={20} color="#000000" />
            </div>
            <div style={styles.entryTextCol}>
              <h4 style={styles.entryCardTitle} className="entry-card-title">Sell With Us</h4>
              <p style={styles.entryCardDesc} className="entry-card-desc">Register your merchant shop and list custom cargo items.</p>
            </div>
            <ArrowRight size={16} color="var(--accent)" style={styles.entryArrow} className="entry-arrow" />
          </div>
        </div>
      </section>

      {/* Interactive Glassmorphism Tracking Modal */}
      {isTrackingModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsTrackingModalOpen(false)}>
          <div style={styles.modalContent} className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <button 
              style={styles.modalCloseBtn} 
              className="modal-close-hover" 
              onClick={() => setIsTrackingModalOpen(false)}
              title="Close"
            >
              <X size={18} />
            </button>
            <h3 style={styles.modalTitle}>Track Your Package</h3>
            <p style={styles.modalSub}>Enter your unique cargo tracking ID to view real-time feed updates.</p>
            
            <form onSubmit={(e) => {
              handleTrackSubmit(e);
              const cleanId = trackingId.toUpperCase().trim();
              if (cleanId === 'FP-9031' || cleanId === 'FP-8241') {
                setIsTrackingModalOpen(false);
              }
            }} style={styles.modalForm}>
              <div style={styles.modalInputWrapper}>
                <Search size={18} color="var(--text-secondary)" style={styles.modalSearchIcon} />
                <input
                  type="text"
                  placeholder="Enter Tracking ID (e.g. FP-9031)"
                  value={trackingId}
                  onChange={(e) => {
                    setTrackingId(e.target.value);
                    if (searchError) setSearchError('');
                  }}
                  style={styles.modalInput}
                  autoFocus
                />
              </div>
              
              {searchError && <span style={styles.modalErrorText}>{searchError}</span>}
              
              <div style={styles.modalHelpers}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Clearance feeds:</span>
                <button 
                  type="button" 
                  onClick={() => { 
                    setTrackingId('FP-9031'); 
                    setSearchError(''); 
                  }} 
                  className="modal-helper-hover"
                  style={styles.modalHelperBtn}
                >
                  FP-9031
                </button>
                <button 
                  type="button" 
                  onClick={() => { 
                    setTrackingId('FP-8241'); 
                    setSearchError(''); 
                  }} 
                  className="modal-helper-hover"
                  style={styles.modalHelperBtn}
                >
                  FP-8241
                </button>
              </div>
              
              <button type="submit" className="btn btn-primary" style={styles.modalSubmitBtn}>
                <span>Track Live</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. QUICK PICK / POPULAR GOODS SECTION */}
      <section id="popular-goods" style={styles.popularSection} className="popular-goods-section">
        <div className="container">
          <div style={styles.popularHeader}>
            <span style={styles.popularSubtitle} className="popular-subtitle">QUICK PICK</span>
            <h2 style={styles.popularTitle} className="popular-title">Popular Goods</h2>
          </div>

          {/* Category Selector Pills */}
          <div style={styles.pillsRow} className="category-pills-row">
            <button
              onClick={() => setActiveCategoryPill('electronics')}
              style={{
                ...styles.categoryPill,
                ...(activeCategoryPill === 'electronics' ? styles.categoryPillActive : styles.categoryPillInactive)
              }}
              className="category-pill"
            >
              Electronics
            </button>
            <button
              onClick={() => setActiveCategoryPill('high_value')}
              style={{
                ...styles.categoryPill,
                ...(activeCategoryPill === 'high_value' ? styles.categoryPillActive : styles.categoryPillInactive)
              }}
              className="category-pill"
            >
              High-Value Goods
            </button>
            <button
              onClick={() => setActiveCategoryPill('documents')}
              style={{
                ...styles.categoryPill,
                ...(activeCategoryPill === 'documents' ? styles.categoryPillActive : styles.categoryPillInactive)
              }}
              className="category-pill"
            >
              Documents & Cards
            </button>
            <button
              onClick={() => setActiveCategoryPill('food')}
              style={{
                ...styles.categoryPill,
                ...(activeCategoryPill === 'food' ? styles.categoryPillActive : styles.categoryPillInactive)
              }}
              className="category-pill"
            >
              Food & Coffee
            </button>
          </div>

          {/* Popular goods cards grid */}
          <div style={styles.goodsGrid}>
            {filteredGoods.map(item => (
              <div key={item.name} className="card card-hover" style={styles.goodsCard}>
                <div style={styles.goodsCardInner}>
                  {/* Left Column: Product Vector Image */}
                  <div style={styles.goodsImageCol}>
                    <img src={item.image} alt={item.name} style={styles.goodsImg} />
                  </div>
                  {/* Right Column: Metadata details */}
                  <div style={styles.goodsDetailsCol}>
                    <div style={styles.goodsCardHeader}>
                      <span style={styles.goodsName}>{item.name}</span>
                      <span style={styles.goodsPrice}>{item.price.toLocaleString()} UGX</span>
                    </div>
                    <p style={styles.goodsDesc}>{item.description}</p>
                    <div style={styles.goodsFooter}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Store: {item.seller}</span>
                      <button 
                        onClick={() => onPurchaseItem(item)}
                        style={styles.goodsDeliverBtn}
                      >
                        <span>Deliver</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. FAST AND RELIABLE SERVICES GRID */}
      <section style={styles.servicesSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.serviceTitle}>FAST AND RELIABLE DELIVERY SERVICES</h2>
            <p style={styles.serviceSubtitle}>THAT MEET YOUR TIMELINE AND BUDGET</p>
            <div style={styles.yellowLine} />
          </div>

          <div className="grid-2" style={{ gap: '30px' }}>
            <div style={styles.serviceCard} className="card">
              <div style={styles.serviceIconWrapper}>
                <Zap size={22} color="#000000" />
              </div>
              <div style={styles.serviceInfo}>
                <h4 style={styles.serviceCardName}>MAKING YOUR LIFE EASIER</h4>
                <p style={styles.serviceCardText}>
                  Select your desired cargo from our extensive lists or write-in custom deliverables. 
                  Our dispatchers coordinate direct route plans instantly.
                </p>
              </div>
            </div>

            <div style={styles.serviceCard} className="card">
              <div style={styles.serviceIconWrapper}>
                <Shield size={22} color="#000000" />
              </div>
              <div style={styles.serviceInfo}>
                <h4 style={styles.serviceCardName}>PROVIDING QUALITATIVE SERVICES</h4>
                <p style={styles.serviceCardText}>
                  From standard couriers to heavily guarded armored vehicles. 
                  We maintain strict vetting protocols to guarantee 100% compromise-free transit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

const styles = {
  landingContainer: {
    backgroundColor: 'var(--bg-primary)'
  },
  heroSliderSection: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1024 / 576',
    backgroundImage: `url(${HeroBgImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-md)'
  },
  trackOverlayBtn: {
    position: 'absolute',
    left: '4.8%',
    top: '64.5%',
    width: '16.8%',
    height: '8.5%',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '9999px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease',
    zIndex: 15
  },
  logoOverlayLink: {
    position: 'absolute',
    left: '4.8%',
    top: '8%',
    width: '14%',
    height: '8%',
    cursor: 'pointer',
    zIndex: 15,
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    animation: 'fadeIn 0.3s ease'
  },
  modalContent: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '32px',
    width: '90%',
    maxWidth: '450px',
    position: 'relative',
    boxShadow: 'var(--shadow-lg)',
    animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    padding: '4px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '800',
    marginBottom: '8px',
    color: 'var(--text-primary)'
  },
  modalSub: {
    fontSize: '13.5px',
    color: 'var(--text-secondary)',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  modalInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  modalSearchIcon: {
    position: 'absolute',
    left: '14px',
    pointerEvents: 'none'
  },
  modalInput: {
    width: '100%',
    padding: '12px 16px 12px 42px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'all 0.2s ease'
  },
  modalErrorText: {
    fontSize: '12px',
    color: 'var(--danger)',
    fontWeight: '700',
    marginTop: '-8px'
  },
  modalHelpers: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    color: 'var(--text-muted)'
  },
  modalHelperBtn: {
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '4px 10px',
    color: 'var(--accent)',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '11px',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff'
  },
  modalSubmitBtn: {
    padding: '14px',
    width: '100%',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  entrySection: {
    padding: '30px 0 10px 0',
    backgroundColor: 'var(--bg-primary)'
  },
  entryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px'
  },
  entryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    padding: '20px',
    position: 'relative',
    transition: 'all 0.3s ease',
    backgroundColor: 'var(--bg-secondary)'
  },
  entryIconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#facc15',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  entryTextCol: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  },
  entryCardTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  entryCardDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
    lineHeight: '1.4'
  },
  entryArrow: {
    marginLeft: 'auto',
    flexShrink: 0
  },
  popularSection: {
    padding: '60px 0 80px 0',
    backgroundColor: '#ffffff',
    borderTop: '1px solid var(--border)'
  },
  popularHeader: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  popularSubtitle: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px'
  },
  popularTitle: {
    fontSize: '32px',
    fontWeight: '900',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em'
  },
  pillsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '14px',
    flexWrap: 'wrap',
    marginBottom: '40px'
  },
  categoryPill: {
    padding: '10px 28px',
    borderRadius: '30px',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    boxShadow: 'var(--shadow-sm)'
  },
  categoryPillActive: {
    backgroundColor: '#facc15',
    color: '#000000'
  },
  categoryPillInactive: {
    backgroundColor: '#18181b',
    color: '#ffffff'
  },
  goodsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px'
  },
  goodsCard: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  goodsCardInner: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  goodsImageCol: {
    width: '74px',
    height: '74px',
    borderRadius: '8px',
    backgroundColor: '#f4f4f5',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  goodsImg: {
    width: '80%',
    height: '80%',
    objectFit: 'contain'
  },
  goodsDetailsCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '80px'
  },
  goodsCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px'
  },
  goodsName: {
    fontSize: '14.5px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    textTransform: 'capitalize'
  },
  goodsPrice: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--accent)'
  },
  goodsDesc: {
    fontSize: '11.5px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    margin: '4px 0 8px 0'
  },
  goodsFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(0,0,0,0.03)',
    paddingTop: '6px'
  },
  goodsDeliverBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    fontSize: '11px',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  servicesSection: {
    padding: '60px 0 80px 0'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  serviceTitle: {
    fontSize: '28px',
    fontWeight: '900',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em'
  },
  serviceSubtitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    letterSpacing: '1.5px',
    marginTop: '6px'
  },
  yellowLine: {
    width: '60px',
    height: '3px',
    backgroundColor: '#facc15',
    marginTop: '16px',
    borderRadius: '2px'
  },
  serviceCard: {
    display: 'flex',
    gap: '18px',
    padding: '24px'
  },
  serviceIconWrapper: {
    width: '42px',
    height: '42px',
    borderRadius: '8px',
    backgroundColor: '#facc15',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  serviceInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  serviceCardName: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '8px',
    letterSpacing: '0.5px'
  },
  serviceCardText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5'
  }
};

// Add DOM stylesheet overrides to manage proportional scaling for flanking and mobile placements
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .modal-close-hover:hover {
      background-color: #f4f4f5 !important;
      color: var(--text-primary) !important;
    }
    .modal-helper-hover:hover {
      background-color: var(--bg-tertiary) !important;
      border-color: var(--accent) !important;
    }
    @media (max-width: 600px) {
      .modal-content-box {
        padding: 20px !important;
        max-width: 90% !important;
      }
      .popular-goods-section {
        padding: 24px 0 40px 0 !important;
      }
      .popular-title {
        font-size: 22px !important;
      }
      .popular-subtitle {
        font-size: 9px !important;
        margin-bottom: 2px !important;
      }
      .category-pills-row {
        gap: 6px !important;
        margin-bottom: 20px !important;
      }
      .category-pill {
        padding: 6px 12px !important;
        font-size: 11px !important;
      }
      .entry-section-pills .container {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10px !important;
      }
      .entry-card {
        padding: 10px 12px !important;
        gap: 8px !important;
        justify-content: center !important;
      }
      .entry-icon-box {
        width: 32px !important;
        height: 32px !important;
      }
      .entry-icon-box svg {
        width: 16px !important;
        height: 16px !important;
      }
      .entry-card-title {
        font-size: 13px !important;
      }
      .entry-card-desc,
      .entry-arrow {
        display: none !important;
      }
      .entry-section-pills {
        padding: 20px 0 0 0 !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
