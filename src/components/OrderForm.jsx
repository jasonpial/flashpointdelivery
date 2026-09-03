import React, { useState, useEffect } from 'react';
import { 
  FileText, Cpu, Shirt, CupSoda, Wrench, ShieldAlert, Truck, 
  Plus, Minus, Trash2, MapPin, Navigation, Info, ShieldCheck, Shield, ChevronRight
} from 'lucide-react';
import { ITEM_CATEGORIES, UGANDA_LOCATIONS, CARRIER_MODES, calculateDeliveryPrice } from '../deliveryData';
import DeliveryRiderImg from '../assets/delivery_rider.png';

export default function OrderForm({ user, onAddOrder, onOpenAuth, onNavigateToDashboard, initialCargoCart, onClearCargoCart }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [customItemName, setCustomItemName] = useState('');
  
  // Category tabs state
  const [activeCategory, setActiveCategory] = useState(ITEM_CATEGORIES[0].id);

  // Load items from marketplace purchase cart if present
  useEffect(() => {
    if (initialCargoCart && initialCargoCart.length > 0) {
      setSelectedItems(initialCargoCart);
      onClearCargoCart();
    }
  }, [initialCargoCart, onClearCargoCart]);

  // Logistics state
  const [pickupMode, setPickupMode] = useState('terminal'); // terminal vs home
  const [pickupLocation, setPickupLocation] = useState(UGANDA_LOCATIONS.KAMPALA_DIVISIONS[0]);
  const [deliveryLocation, setDeliveryLocation] = useState(UGANDA_LOCATIONS.CENTRAL_REGION[0]);
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('+256 ');
  
  // Carrier Mode
  const [carrierMode, setCarrierMode] = useState('standard');

  // Pricing
  const [pricing, setPricing] = useState({ baseRate: 0, cargoUnitCost: 0, subtotal: 0, securitySurcharge: 0, total: 0 });

  // Recalculate price when dependencies change
  useEffect(() => {
    const actualPickup = pickupMode === 'terminal' 
      ? { name: "Flashpoint Terminal (Nakasero Road)", baseRate: 4000 }
      : pickupLocation;

    const price = calculateDeliveryPrice(selectedItems, actualPickup, deliveryLocation, carrierMode);
    setPricing(price);
  }, [selectedItems, pickupMode, pickupLocation, deliveryLocation, carrierMode]);

  // Handle category icon mapping
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'FileText': return <FileText size={18} />;
      case 'Cpu': return <Cpu size={18} />;
      case 'Shirt': return <Shirt size={18} />;
      case 'CupSoda': return <CupSoda size={18} />;
      case 'Wrench': return <Wrench size={18} />;
      case 'ShieldAlert': return <ShieldAlert size={18} />;
      case 'Truck': return <Truck size={18} />;
      default: return <FileText size={18} />;
    }
  };

  // Add item from grid
  const handleAddItem = (itemName) => {
    setSelectedItems(prev => {
      const existing = prev.find(item => item.name === itemName);
      if (existing) {
        return prev.map(item => item.name === itemName ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { name: itemName, qty: 1 }];
    });
  };

  // Increment item qty
  const incrementQty = (itemName) => {
    setSelectedItems(prev => prev.map(item => item.name === itemName ? { ...item, qty: item.qty + 1 } : item));
  };

  // Decrement item qty
  const decrementQty = (itemName) => {
    setSelectedItems(prev => 
      prev.map(item => {
        if (item.name === itemName) {
          return { ...item, qty: Math.max(1, item.qty - 1) };
        }
        return item;
      })
    );
  };

  // Remove item
  const handleRemoveItem = (itemName) => {
    setSelectedItems(prev => prev.filter(item => item.name !== itemName));
  };

  // Add custom item
  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!customItemName.trim()) return;
    
    handleAddItem(customItemName.toLowerCase().trim());
    setCustomItemName('');
  };

  // Submit Order booking
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      alert("Security protocol error: Please select at least one item to deliver.");
      return;
    }

    if (!deliveryAddress.trim()) {
      alert("Missing details: Please provide the exact street or building address for delivery.");
      return;
    }

    if (pickupMode === 'home' && !pickupAddress.trim()) {
      alert("Missing details: Please provide your pickup street/home address.");
      return;
    }

    if (!receiverName.trim()) {
      alert("Logistics error: Please enter the recipient's name.");
      return;
    }

    // Auth Guard check
    if (!user) {
      alert("Verification required: Please log in to complete your secured courier order.");
      onOpenAuth();
      return;
    }

    // Complete Booking
    const finalPickup = pickupMode === 'terminal'
      ? { name: "Flashpoint Terminal (Nakasero Road)", baseRate: 4000 }
      : pickupLocation;

    const newOrder = {
      id: `FP-${Math.floor(1000 + Math.random() * 9000)}`,
      items: selectedItems,
      pickup: finalPickup,
      delivery: deliveryLocation,
      pickupAddress: pickupMode === 'terminal' ? 'Drop-off at Flashpoint Main Terminal' : pickupAddress,
      deliveryAddress,
      receiverName,
      receiverPhone,
      carrierMode,
      status: 'pending',
      pricing,
      handler: {
        name: 'Agent Assigned - Pending Clearance',
        clearance: 'Standard Security Clearance',
        avatarColor: '#facc15'
      },
      chat: [
        { sender: 'handler', text: 'System Check: Your security carrier booking has been received. A vetted handler is currently checking cargo clearances.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]
    };

    onAddOrder(newOrder);
    onNavigateToDashboard();
  };

  const activeCategoryData = ITEM_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div style={styles.bookingLayout} className="slide-up booking-layout-container">
      <div className="container">
        
        {/* Booking Form Title with Banner Image */}
        <div style={styles.formHeaderContainer} className="form-header-container">
          <div style={styles.formHeader}>
            <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>
              Book Security <span style={{ color: 'var(--accent)' }}>Carrier</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Configure cargo details, pickup locations, security level, and receive instant billing in UGX.
            </p>
          </div>
          <div style={styles.formHeaderBannerWrapper}>
            <img src={DeliveryRiderImg} alt="Delivery Rider Motorcycle" style={styles.formHeaderBanner} />
          </div>
        </div>

        <div style={styles.gridContainer} className="order-form-grid-container">
          {/* Left Column: Selector Form */}
          <div style={styles.formColumn} className="order-form-column">
            
            {/* Step 1: Items Selection */}
            <div style={styles.formSection} className="card">
              <h3 style={styles.sectionTitle}>
                <span style={styles.stepBadge}>1</span>
                <span>Select Deliverables</span>
              </h3>

              {/* Category tabs */}
              <div style={styles.categoryTabs}>
                {ITEM_CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    style={{
                      ...styles.categoryTabBtn,
                      ...(activeCategory === category.id ? styles.activeCategoryTab : {})
                    }}
                  >
                    {getCategoryIcon(category.icon)}
                    <span style={{ fontSize: '12px' }}>{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Category Description */}
              <div style={styles.categoryDesc}>
                <Info size={14} color="var(--accent)" />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {activeCategoryData?.description}
                </span>
              </div>

              {/* Items Grid */}
              <div style={styles.itemsGrid}>
                {activeCategoryData?.items.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleAddItem(item)}
                    style={styles.itemAddBtn}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{item}</span>
                    <Plus size={14} color="var(--accent)" />
                  </button>
                ))}
              </div>

              {/* Custom Item Adder Section */}
              <div style={styles.customItemBox}>
                <p style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
                  CAN'T FIND YOUR ITEM? ADD A CUSTOM CARGO:
                </p>
                <form onSubmit={handleAddCustomItem} style={styles.customItemForm}>
                  <input
                    type="text"
                    placeholder="Enter custom item name (e.g. Matooke Bundle, Hard Drive)"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    style={styles.customItemInput}
                  />
                  <button type="submit" style={styles.customAddBtn}>
                    <Plus size={16} color="#000000" />
                    <span>Add Custom</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Step 2: Logistics & Destination */}
            <div style={styles.formSection} className="card">
              <h3 style={styles.sectionTitle}>
                <span style={styles.stepBadge}>2</span>
                <span>Logistics & Addresses</span>
              </h3>

              {/* Pickup Mode Toggle */}
              <div className="form-group">
                <label className="form-label">Pickup Preference</label>
                <div style={styles.toggleRow}>
                  <button
                    type="button"
                    onClick={() => setPickupMode('terminal')}
                    style={{
                      ...styles.toggleBtn,
                      ...(pickupMode === 'terminal' ? styles.activeToggleBtn : {})
                    }}
                  >
                    Terminal Drop-off (Nakasero)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickupMode('home')}
                    style={{
                      ...styles.toggleBtn,
                      ...(pickupMode === 'home' ? styles.activeToggleBtn : {})
                    }}
                  >
                    Flashpoint Home Pickup (+Fee)
                  </button>
                </div>
              </div>

              {/* Pickup Details (Conditionally shown if Home Pickup is selected) */}
              {pickupMode === 'home' && (
                <div style={styles.animateReveal}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Pickup Zone (Kampala / Wakiso)</label>
                      <select
                        className="form-input"
                        value={pickupLocation.name}
                        onChange={(e) => {
                          const division = UGANDA_LOCATIONS.KAMPALA_DIVISIONS.find(x => x.name === e.target.value) 
                            || UGANDA_LOCATIONS.CENTRAL_REGION.find(x => x.name === e.target.value);
                          if (division) setPickupLocation(division);
                        }}
                      >
                        <optgroup label="Kampala City Divisions">
                          {UGANDA_LOCATIONS.KAMPALA_DIVISIONS.map(div => (
                            <option key={div.name} value={div.name}>{div.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Central Region Districts">
                          {UGANDA_LOCATIONS.CENTRAL_REGION.map(dist => (
                            <option key={dist.name} value={dist.name}>{dist.name}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pickup Street / Address</label>
                      <input
                        type="text"
                        placeholder="e.g. Plot 15 Acacia Avenue, Kamwokya"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Destination Details */}
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Destination District/Zone</label>
                  <select
                    className="form-input"
                    value={deliveryLocation.name}
                    onChange={(e) => {
                      const dist = UGANDA_LOCATIONS.CENTRAL_REGION.find(x => x.name === e.target.value)
                        || UGANDA_LOCATIONS.KAMPALA_DIVISIONS.find(x => x.name === e.target.value);
                      if (dist) setDeliveryLocation(dist);
                    }}
                  >
                    <optgroup label="Central Region Districts">
                      {UGANDA_LOCATIONS.CENTRAL_REGION.map(dist => (
                        <option key={dist.name} value={dist.name}>{dist.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Kampala City Divisions">
                      {UGANDA_LOCATIONS.KAMPALA_DIVISIONS.map(div => (
                        <option key={div.name} value={div.name}>{div.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Delivery Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Mukono Town Council, behind Total Station"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Receiver Info */}
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Recipient Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mukasa Ivan"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Recipient Phone Number</label>
                  <input
                    type="text"
                    placeholder="+256 788 123 456"
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Carrier & Security Type */}
            <div style={styles.formSection} className="card">
              <h3 style={styles.sectionTitle}>
                <span style={styles.stepBadge}>3</span>
                <span>Choose Carrier Security Level</span>
              </h3>

              <div style={styles.modesContainer}>
                {CARRIER_MODES.map(mode => (
                  <label
                    key={mode.id}
                    style={{
                      ...styles.modeCard,
                      ...(carrierMode === mode.id ? styles.activeModeCard : {})
                    }}
                  >
                    <div style={styles.modeCardHeader}>
                      <input
                        type="radio"
                        name="carrierMode"
                        value={mode.id}
                        checked={carrierMode === mode.id}
                        onChange={() => setCarrierMode(mode.id)}
                        style={styles.radioInput}
                      />
                      <div style={styles.modeTitleBox}>
                        <span style={styles.modeName}>{mode.name}</span>
                        <span style={styles.modeSecurity}>{mode.securityLevel}</span>
                      </div>
                      <span style={{
                        ...styles.modeBadge,
                        backgroundColor: mode.id === 'tactical_escort' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(250, 204, 21, 0.1)',
                        color: mode.id === 'tactical_escort' ? '#ef4444' : 'var(--accent)',
                        borderColor: mode.id === 'tactical_escort' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(250, 204, 21, 0.3)'
                      }}>
                        {mode.badgeText}
                      </span>
                    </div>
                    <p style={styles.modeDesc}>{mode.description}</p>
                    {mode.surcharge > 0 && (
                      <span style={styles.surchargeLabel}>
                        + {mode.surcharge.toLocaleString()} UGX surcharge
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Billing Invoice Sidebar */}
          <div style={styles.billingColumn} className="order-form-billing-column">
            <div style={styles.billingCard} className="card pulse-glow-effect">
              <h3 style={styles.billingTitle}>
                <ShieldCheck size={20} color="var(--accent)" />
                <span>SECURED CARGO INVOICE</span>
              </h3>

              {/* Items Manifest List */}
              <div style={styles.manifestSection}>
                <span style={styles.manifestHeader}>Cargo Manifest:</span>
                {selectedItems.length === 0 ? (
                  <div style={styles.emptyManifest}>
                    <span>No cargo loaded. Click items on the left to load delivery cargo.</span>
                  </div>
                ) : (
                  <div style={styles.manifestList}>
                    {selectedItems.map(item => (
                      <div key={item.name} style={styles.manifestItem}>
                        <div style={styles.manifestItemInfo}>
                          <span style={styles.itemName}>{item.name}</span>
                          <span style={styles.itemQty}>x{item.qty}</span>
                        </div>
                        <div style={styles.manifestControls}>
                          <button 
                            type="button" 
                            onClick={() => decrementQty(item.name)}
                            style={styles.qtyControlBtn}
                          >
                            <Minus size={10} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => incrementQty(item.name)}
                            style={styles.qtyControlBtn}
                          >
                            <Plus size={10} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveItem(item.name)}
                            style={styles.removeBtn}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Logistics Summary */}
              <div style={styles.logisticsSummary}>
                <span style={styles.manifestHeader}>Transport Route:</span>
                <div style={styles.routeBox}>
                  <div style={styles.routePoint}>
                    <MapPin size={14} color="var(--accent)" />
                    <div>
                      <span style={styles.routePointLabel}>Pickup Location:</span>
                      <span style={styles.routePointVal}>
                        {pickupMode === 'terminal' ? 'Flashpoint Main Terminal (Nakasero)' : pickupLocation.name}
                      </span>
                    </div>
                  </div>
                  <div style={styles.routeDivider} />
                  <div style={styles.routePoint}>
                    <Navigation size={14} color="var(--accent)" />
                    <div>
                      <span style={styles.routePointLabel}>Destination District:</span>
                      <span style={styles.routePointVal}>{deliveryLocation.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Grid */}
              <div style={styles.priceGrid}>
                <div style={styles.priceRow}>
                  <span style={styles.priceLabel}>Base Logistics:</span>
                  <span style={styles.priceVal}>{pricing.baseRate.toLocaleString()} UGX</span>
                </div>
                <div style={styles.priceRow}>
                  <span style={styles.priceLabel}>Cargo Unit Rate:</span>
                  <span style={styles.priceVal}>{pricing.cargoUnitCost.toLocaleString()} UGX</span>
                </div>
                <div style={styles.priceRow}>
                  <span style={styles.priceLabel}>Subtotal:</span>
                  <span style={styles.priceVal}>{pricing.subtotal.toLocaleString()} UGX</span>
                </div>
                <div style={styles.priceRow}>
                  <span style={styles.priceLabel}>Security Escort Fee:</span>
                  <span style={styles.priceVal}>+ {pricing.securitySurcharge.toLocaleString()} UGX</span>
                </div>
                
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>TOTAL ESTIMATE:</span>
                  <span style={styles.totalVal}>{pricing.total.toLocaleString()} UGX</span>
                </div>
              </div>

              {/* Confirm Booking CTA */}
              <button 
                type="button" 
                onClick={handleBookingSubmit}
                className="btn btn-primary"
                style={styles.confirmBtn}
              >
                <Shield size={16} />
                <span>Confirm Secured Carrier</span>
              </button>

              {!user && (
                <div style={styles.loginHint}>
                  <span>* You will be prompted to login to secure this transaction.</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  bookingLayout: {
    padding: '40px 0 80px 0',
    backgroundColor: 'var(--bg-primary)'
  },
  formHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '30px',
    marginBottom: '36px',
    flexWrap: 'wrap'
  },
  formHeader: {
    flex: '1 1 300px'
  },
  formHeaderBannerWrapper: {
    flex: '1 1 200px',
    maxWidth: '400px',
    maxHeight: '140px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border)'
  },
  formHeaderBanner: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1.7fr 1fr',
    gap: '30px',
    alignItems: 'start',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr'
    }
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  formSection: {
    padding: '28px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '16px'
  },
  stepBadge: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '800'
  },
  categoryTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px'
  },
  categoryTabBtn: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: 'var(--accent)'
    }
  },
  activeCategoryTab: {
    backgroundColor: 'var(--accent)',
    color: '#000000',
    borderColor: 'var(--accent)'
  },
  categoryDesc: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: 'rgba(250,204,21,0.03)',
    border: '1px solid rgba(250,204,21,0.1)',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '10px',
    marginBottom: '24px'
  },
  itemAddBtn: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: 'var(--text-primary)',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    fontSize: '13px',
    ':hover': {
      backgroundColor: 'rgba(250,204,21,0.05)',
      borderColor: 'rgba(250,204,21,0.4)',
      transform: 'translateY(-2px)'
    }
  },
  customItemBox: {
    borderTop: '1px solid var(--border)',
    paddingTop: '20px',
    marginTop: '10px'
  },
  customItemForm: {
    display: 'flex',
    gap: '12px'
  },
  customItemInput: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    ':focus': {
      borderColor: 'var(--accent)'
    }
  },
  customAddBtn: {
    backgroundColor: 'var(--accent)',
    color: '#000000',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '0 20px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'var(--accent-hover)'
    }
  },
  toggleRow: {
    display: 'flex',
    gap: '12px',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '6px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)'
  },
  toggleBtn: {
    flex: 1,
    padding: '10px',
    background: 'none',
    border: 'none',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  activeToggleBtn: {
    backgroundColor: 'var(--bg-secondary)',
    color: '#ffffff',
    border: '1px solid var(--border)'
  },
  modesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  modeCard: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'block',
    ':hover': {
      borderColor: 'rgba(250,204,21,0.3)'
    }
  },
  activeModeCard: {
    borderColor: 'var(--accent)',
    backgroundColor: 'rgba(250,204,21,0.03)'
  },
  modeCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '10px'
  },
  radioInput: {
    accentColor: 'var(--accent)',
    width: '18px',
    height: '18px'
  },
  modeTitleBox: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  modeName: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#ffffff'
  },
  modeSecurity: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  modeBadge: {
    fontSize: '10px',
    fontWeight: '800',
    padding: '4px 10px',
    borderRadius: '12px',
    border: '1px solid'
  },
  modeDesc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    paddingLeft: '32px',
    marginBottom: '10px'
  },
  surchargeLabel: {
    display: 'inline-block',
    marginLeft: '32px',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--accent)',
    backgroundColor: 'rgba(250,204,21,0.05)',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  billingColumn: {
    position: 'sticky',
    top: '100px',
    '@media (max-width: 1024px)': {
      position: 'static'
    }
  },
  billingCard: {
    padding: '28px',
    borderWidth: '2px'
  },
  billingTitle: {
    fontSize: '16px',
    fontWeight: '800',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '18px',
    marginBottom: '20px'
  },
  manifestSection: {
    marginBottom: '24px'
  },
  manifestHeader: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '10px'
  },
  emptyManifest: {
    padding: '16px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px dashed var(--border)',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '12px',
    color: 'var(--text-muted)'
  },
  manifestList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '200px',
    overflowY: 'auto',
    paddingRight: '6px'
  },
  manifestItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '8px',
    border: '1px solid var(--border)'
  },
  manifestItemInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  itemName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize'
  },
  itemQty: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--accent)',
    backgroundColor: 'rgba(250,204,21,0.1)',
    padding: '1px 6px',
    borderRadius: '4px'
  },
  manifestControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  qtyControlBtn: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '1px solid var(--border)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: 'var(--accent)',
      color: '#ffffff'
    }
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      color: 'var(--danger)'
    }
  },
  logisticsSummary: {
    borderTop: '1px solid var(--border)',
    paddingTop: '20px',
    marginBottom: '24px'
  },
  routeBox: {
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  routePoint: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  routePointLabel: {
    display: 'block',
    fontSize: '9px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  routePointVal: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff'
  },
  routeDivider: {
    height: '1px',
    backgroundColor: 'var(--border)',
    marginLeft: '24px'
  },
  priceGrid: {
    borderTop: '1px solid var(--border)',
    paddingTop: '20px',
    marginBottom: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px'
  },
  priceLabel: {
    color: 'var(--text-secondary)'
  },
  priceVal: {
    fontWeight: '600',
    color: '#ffffff'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px dashed var(--border)',
    paddingTop: '14px',
    marginTop: '6px'
  },
  totalLabel: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#ffffff'
  },
  totalVal: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--accent)'
  },
  confirmBtn: {
    width: '100%',
    padding: '14px'
  },
  loginHint: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '12px'
  },
  animateReveal: {
    animation: 'slideUp 0.3s ease-out forwards'
  }
};

// Insert custom category hover styles & DOM responsive overrides to document runtime stylesheet
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    button[style*="categoryTabBtn"]:hover {
      border-color: var(--accent) !important;
      color: #ffffff !important;
    }
    button[style*="qtyControlBtn"]:hover {
      border-color: var(--accent) !important;
      color: #ffffff !important;
    }
    @media (max-width: 768px) {
      .form-header-container div[style*="formHeaderBannerWrapper"] {
        display: block !important;
        max-width: 140px !important;
        max-height: 70px !important;
        flex-shrink: 0 !important;
      }
      .order-form-grid-container {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
      }
      .order-form-billing-column {
        position: static !important;
        width: 100% !important;
      }
      .order-form-column {
        width: 100% !important;
      }
      .grid-2 {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }
      div[style*="formSection"] {
        padding: 16px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
