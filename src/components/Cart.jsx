import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ShieldCheck, ArrowLeft } from 'lucide-react';
import { paymentService } from '../services/paymentService';

export default function Cart({ 
  cart, onUpdateQty, onRemove, onClear, onCheckout, onContinueShopping 
}) {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckoutClick = () => {
    paymentService.processPayment(
      {
        amount: totalPrice,
        customerName: 'Valued Client',
        title: `Flashpoint Cart Manifest (${totalItems} items)`
      },
      (paymentResult) => {
        alert(`Payment Confirmed! Reference: ${paymentResult.tx_ref || paymentResult.transaction_id}. Proceeding to cargo booking.`);
        onCheckout();
      },
      () => {
        onCheckout();
      }
    );
  };

  if (cart.length === 0) {
    return (
      <div style={styles.emptyCartPage} className="slide-up">
        <div className="container" style={styles.emptyContainer}>
          <div className="card" style={styles.emptyCard}>
            <div style={styles.emptyIconWrapper}>
              <ShoppingBag size={48} color="var(--accent)" />
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Your Cart is Empty</h3>
            <p style={styles.emptyText}>
              You haven't selected any items for dispatch yet. Browse our marketplace to purchase products from verified merchants.
            </p>
            <button className="btn btn-primary" onClick={onContinueShopping} style={{ marginTop: '16px' }}>
              <ArrowLeft size={14} color="#000000" />
              <span>Browse Marketplace</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.cartPage} className="slide-up">
      <div className="container">
        
        <h2 style={styles.pageTitle}>Classified <span style={{ color: 'var(--accent)' }}>Cart Logs</span></h2>
        <p style={styles.pageSub}>Review items before finalizing carriage manifest and scheduling armed escorts.</p>

        <div style={styles.layoutGrid} className="cart-layout-grid">
          
          {/* Left Side: Items List */}
          <div style={styles.listCol}>
            <div style={styles.listHeader}>
              <span>MANIPULATE ITEMS ({totalItems})</span>
              <button onClick={onClear} style={styles.clearBtn}>
                <Trash2 size={12} />
                <span>Clear Cart</span>
              </button>
            </div>

            <div style={styles.itemsList}>
              {cart.map(item => (
                <div key={item.id} className="card" style={styles.itemCard}>
                  <div style={styles.itemImageCol}>
                    <img src={item.image} alt={item.name} style={styles.itemImg} />
                  </div>
                  
                  <div style={styles.itemDetailsCol}>
                    <div style={styles.itemTitleRow}>
                      <span style={styles.itemName}>{item.name}</span>
                      <button onClick={() => onRemove(item.id)} style={styles.removeBtn} title="Remove Item">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <span style={styles.itemSeller}>Merchant: {item.seller}</span>
                    
                    <div style={styles.itemActionRow}>
                      <span style={styles.itemPrice}>{(item.price * item.qty).toLocaleString()} UGX</span>
                      
                      {/* Quantity Controls */}
                      <div style={styles.qtyControls}>
                        <button 
                          onClick={() => onUpdateQty(item.id, item.qty - 1)}
                          style={styles.qtyBtn}
                        >
                          <Minus size={10} />
                        </button>
                        <span style={styles.qtyValue}>{item.qty}</span>
                        <button 
                          onClick={() => onUpdateQty(item.id, item.qty + 1)}
                          style={styles.qtyBtn}
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-secondary" onClick={onContinueShopping} style={styles.backShoppingBtn}>
              <ArrowLeft size={14} />
              <span>Continue Shopping</span>
            </button>
          </div>

          {/* Right Side: Carriage Checkout Summary */}
          <div style={styles.summaryCol}>
            <div className="card" style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>CARRIAGE SUMMARY</h3>
              <div style={styles.summaryDivider} />
              
              <div style={styles.summaryRow}>
                <span>Vetted Cargo Items</span>
                <span>{totalItems}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Subtotal Value</span>
                <span>{totalPrice.toLocaleString()} UGX</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Transit Security Escort</span>
                <span style={{ color: 'var(--success)', fontWeight: '700' }}>Calculated Next Stage</span>
              </div>

              <div style={styles.summaryDivider} />

              <div style={styles.totalRow}>
                <span>Cargo Declared Value</span>
                <span style={styles.totalVal}>{totalPrice.toLocaleString()} UGX</span>
              </div>

              <button className="btn btn-primary" onClick={handleCheckoutClick} style={styles.checkoutBtn}>
                <ShieldCheck size={16} color="#000000" />
                <span>PROCEED TO SECURE CHECKOUT</span>
              </button>

              <div style={styles.securityGuarantees}>
                <div style={styles.guaranteeItem}>
                  <ShieldCheck size={12} color="var(--accent)" />
                  <span>AES-256 Encrypted Booking Locks</span>
                </div>
                <div style={styles.guaranteeItem}>
                  <ShieldCheck size={12} color="var(--accent)" />
                  <span>Uganda Police Vetted Handlers Link</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

const styles = {
  cartPage: {
    padding: '40px 0 80px 0',
    backgroundColor: 'var(--bg-primary)',
    minHeight: 'calc(100vh - 76px)'
  },
  pageTitle: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  pageSub: {
    color: 'var(--text-secondary)',
    marginBottom: '36px'
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '30px',
    alignItems: 'start'
  },
  listCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '1px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px'
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '700'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  itemCard: {
    padding: '16px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  itemImageCol: {
    width: '80px',
    height: '80px',
    backgroundColor: '#f4f4f5',
    borderRadius: '8px',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  itemImg: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  itemDetailsCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  itemTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemName: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    textTransform: 'capitalize'
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    transition: 'color 0.2s ease',
    ':hover': {
      color: '#ef4444'
    }
  },
  itemSeller: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: '600'
  },
  itemActionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px'
  },
  itemPrice: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--accent)'
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-tertiary)'
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'var(--border)'
    }
  },
  qtyValue: {
    padding: '0 10px',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  backShoppingBtn: {
    alignSelf: 'flex-start',
    marginTop: '10px'
  },
  summaryCol: {
    position: 'sticky',
    top: '104px'
  },
  summaryCard: {
    padding: '24px'
  },
  summaryTitle: {
    fontSize: '15px',
    fontWeight: '800',
    letterSpacing: '1px',
    color: 'var(--text-primary)'
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: 'var(--border)',
    margin: '16px 0'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '10px'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  totalVal: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--accent)'
  },
  checkoutBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '13px',
    fontWeight: '800',
    letterSpacing: '0.5px'
  },
  securityGuarantees: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '20px'
  },
  guaranteeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    color: 'var(--text-muted)'
  },
  emptyCartPage: {
    padding: '80px 0',
    backgroundColor: 'var(--bg-primary)',
    minHeight: 'calc(100vh - 76px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  emptyCard: {
    maxWidth: '480px',
    textAlign: 'center',
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  emptyIconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  emptyText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '20px'
  }
};

// Add DOM stylesheet overrides to manage Cart responsiveness on mobile viewports
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @media (max-width: 768px) {
      .cart-layout-grid {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
