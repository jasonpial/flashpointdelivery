import React, { useState } from 'react';
import { 
  Store, Plus, PlusCircle, ShoppingBag, Settings, 
  CheckCircle2, Tag, Box, Info, Phone, MapPin, Upload 
} from 'lucide-react';
import SettingsNode from './SettingsNode';
import { ITEM_CATEGORIES } from '../deliveryData';

export default function SellerDashboard({ user, products, shops, orders, onUserUpdate, onAddProduct }) {
  const [activeNode, setActiveNode] = useState('inventory');
  
  // New Product Form state
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState(ITEM_CATEGORIES[0].id);
  const [productDesc, setProductDesc] = useState('');
  const [productPhoto, setProductPhoto] = useState(null); // base64 photo
  const [addSuccess, setAddSuccess] = useState('');

  // Find shop matching current logged-in seller
  const myShop = shops.find(s => s.name.toLowerCase().includes(user.name.toLowerCase())) 
    || shops.find(s => s.id === 's2'); // Fallback Acacia Tech Hub

  // Filter products belonging to this seller
  const myProducts = products.filter(p => p.seller === myShop.name);

  // Filter orders containing products from this seller
  const myOrders = orders.filter(order => 
    order.items.some(item => 
      products.some(p => p.name === item.name && p.seller === myShop.name)
    )
  );

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productName.trim() || !productPrice || !productDesc.trim()) {
      alert("Please fill in all product fields.");
      return;
    }

    const priceNum = parseInt(productPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid price in UGX.");
      return;
    }

    const newProduct = {
      id: `p-${Date.now()}`,
      name: productName.toLowerCase().trim(),
      price: priceNum,
      category: productCategory,
      seller: myShop.name,
      description: productDesc.trim(),
      // Fallback SVG graphic if no product cover photo is uploaded
      image: productPhoto || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="15" y="25" width="70" height="44" rx="4" fill="%2318181b" stroke="%23facc15" stroke-width="3"/><rect x="10" y="69" width="80" height="6" rx="2" fill="%23facc15"/><line x1="30" y1="40" x2="70" y2="40" stroke="%23ffffff" stroke-width="2"/></svg>'
    };

    onAddProduct(newProduct);

    setProductName('');
    setProductPrice('');
    setProductDesc('');
    setProductPhoto(null);
    setAddSuccess(`Product "${newProduct.name}" listed successfully in Bavara Products list!`);
    setTimeout(() => setAddSuccess(''), 4000);
  };

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox} className="dashboard-sidebar-badge">
          <div style={styles.avatarBadge}>
            <Store size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.merchantRole}>MERCHANT HUB</span>
            <span style={styles.merchantName}>{myShop.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav} className="dashboard-sidebar-nav">
          <button 
            onClick={() => setActiveNode('registry')}
            style={{ ...styles.navItem, ...(activeNode === 'registry' ? styles.activeNavItem : {}) }}
          >
            <Store size={16} />
            <span>Shop Profile</span>
          </button>

          <button 
            onClick={() => setActiveNode('inventory')}
            style={{ ...styles.navItem, ...(activeNode === 'inventory' ? styles.activeNavItem : {}) }}
          >
            <Box size={16} />
            <span>Product Inventory ({myProducts.length})</span>
          </button>
          
          <button 
            onClick={() => setActiveNode('sales')}
            style={{ ...styles.navItem, ...(activeNode === 'sales' ? styles.activeNavItem : {}) }}
          >
            <ShoppingBag size={16} />
            <span>Sales Orders ({myOrders.length})</span>
          </button>
          
          <button 
            onClick={() => setActiveNode('settings')}
            style={{ ...styles.navItem, ...(activeNode === 'settings' ? styles.activeNavItem : {}) }}
          >
            <Settings size={16} />
            <span>Settings Node</span>
          </button>
        </nav>
      </aside>

      {/* Main Panel Content Area */}
      <main style={styles.mainContent} className="dashboard-content-area">
        
        {/* Node 1: Registry Profile */}
        {activeNode === 'registry' && (
          <div className="slide-up" style={styles.registryCard}>
            <h3 style={styles.nodeTitle}>MERCHANT SHOP PROFILE</h3>
            <div className="card" style={{ padding: '30px' }}>
              <div style={styles.shopMetaHeader}>
                <h2 style={styles.shopTitleText}>{myShop.name}</h2>
                {myShop.verified && <span style={styles.verifiedBadge}>VERIFIED MERCHANT</span>}
              </div>
              <div style={styles.yellowLine} />
              
              <div style={styles.shopDetailsGrid}>
                <div style={styles.detailRow}>
                  <MapPin size={16} color="var(--accent)" />
                  <div>
                    <strong>Location Address:</strong>
                    <span>{myShop.location}</span>
                  </div>
                </div>
                <div style={styles.detailRow}>
                  <Phone size={16} color="var(--accent)" />
                  <div>
                    <strong>Business Contact:</strong>
                    <span>{myShop.phone}</span>
                  </div>
                </div>
                <div style={styles.detailRow}>
                  <Tag size={16} color="var(--accent)" />
                  <div>
                    <strong>Trade Category:</strong>
                    <span style={{ textTransform: 'capitalize' }}>{myShop.category.replace(/_/g, ' & ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Node 2: Product Inventory */}
        {activeNode === 'inventory' && (
          <div className="slide-up seller-dashboard-split-grid" style={styles.splitGrid}>
            {/* Add product form */}
            <div>
              <h3 style={styles.nodeTitle}>ADD NEW PRODUCT</h3>
              <div className="card" style={{ padding: '24px' }}>
                {addSuccess && (
                  <div style={styles.successBanner}>
                    <CheckCircle2 size={16} />
                    <span>{addSuccess}</span>
                  </div>
                )}
                <form onSubmit={handleProductSubmit}>
                  
                  {/* Photo Uploader */}
                  <div style={styles.uploadBlock}>
                    <span className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Product Image Cover</span>
                    <div style={styles.uploaderRow}>
                      <div style={styles.photoPreviewBox}>
                        {productPhoto ? (
                          <img src={productPhoto} alt="Product Preview" style={styles.photoPreviewImg} />
                        ) : (
                          <Box size={24} color="var(--text-muted)" />
                        )}
                      </div>
                      <label style={styles.uploadLabel}>
                        <Upload size={14} />
                        <span>Select Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload} 
                          style={{ display: 'none' }} 
                        />
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. tablet, reams, coffee" 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Product Category</label>
                    <select 
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="form-input"
                    >
                      {ITEM_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price in UGX</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 150000" 
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Product Description</label>
                    <textarea 
                      rows="3"
                      placeholder="Enter specifications..."
                      value={productDesc}
                      onChange={(e) => setProductDesc(e.target.value)}
                      className="form-input"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    <PlusCircle size={14} color="#000000" />
                    <span>List in Marketplace</span>
                  </button>
                </form>
              </div>
            </div>

            {/* List products */}
            <div>
              <h3 style={styles.nodeTitle}>MY STOCKED INVENTORIES</h3>
              <div style={styles.productsList}>
                {myProducts.map(prod => (
                  <div key={prod.id} className="card" style={styles.prodItemCard}>
                    <div style={styles.prodItemCardInner}>
                      {/* Cover Photo */}
                      <div style={styles.listProdImgBox}>
                        <img src={prod.image} alt={prod.name} style={styles.listProdImg} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={styles.prodItemHeader}>
                          <span style={styles.prodItemName}>{prod.name}</span>
                          <span style={styles.prodItemPrice}>{prod.price.toLocaleString()} UGX</span>
                        </div>
                        <p style={styles.prodItemDesc}>{prod.description}</p>
                        <span style={styles.prodItemCategory}>{prod.category.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Node 3: Sales Orders */}
        {activeNode === 'sales' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>MERCHANT SALES LEDGER</h3>
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              {myOrders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <ShoppingBag size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                  <h4>No orders placed on your products yet.</h4>
                </div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeadRow}>
                      <th style={styles.tableTh}>Order ID</th>
                      <th style={styles.tableTh}>Shipper Items</th>
                      <th style={styles.tableTh}>Recipient Details</th>
                      <th style={styles.tableTh}>Delivery Target</th>
                      <th style={styles.tableTh}>Delivery Phase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map(order => (
                      <tr key={order.id} style={styles.tableBodyRow}>
                        <td style={styles.tableTd}><strong style={{ color: 'var(--text-primary)' }}>{order.id}</strong></td>
                        <td style={styles.tableTd}>
                          <div style={styles.itemsListCol}>
                            {order.items
                              .filter(item => products.some(p => p.name === item.name && p.seller === myShop.name))
                              .map(item => (
                                <span key={item.name} style={styles.tableItemText}>
                                  {item.name} x{item.qty}
                                </span>
                              ))}
                          </div>
                        </td>
                        <td style={styles.tableTd}>
                          <div style={styles.detailsCol}>
                            <span style={styles.detailsPrimary}>{order.receiverName}</span>
                            <span style={styles.detailsSecondary}>{order.receiverPhone}</span>
                          </div>
                        </td>
                        <td style={styles.tableTd}>
                          <div style={styles.detailsCol}>
                            <span style={styles.detailsPrimary}>{order.deliveryAddress}</span>
                            <span style={styles.detailsSecondary}>{order.delivery.name}</span>
                          </div>
                        </td>
                        <td style={styles.tableTd}>
                          <span style={{
                            ...styles.statusTag,
                            color: order.status === 'delivered' ? 'var(--success)' : 'var(--accent)',
                            backgroundColor: order.status === 'delivered' ? 'rgba(5,150,105,0.08)' : 'rgba(250,204,21,0.08)',
                            borderColor: order.status === 'delivered' ? 'rgba(5,150,105,0.2)' : 'rgba(250,204,21,0.2)'
                          }}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Node 4: Settings */}
        {activeNode === 'settings' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>MERCHANT SETTINGS</h3>
            <SettingsNode user={user} onUserUpdate={onUserUpdate} />
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
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
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
  merchantRole: {
    display: 'block',
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '1px'
  },
  merchantName: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    maxWidth: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
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
    ':hover': {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-primary)'
    }
  },
  activeNavItem: {
    backgroundColor: '#facc15',
    color: '#000000',
    ':hover': {
      backgroundColor: '#eab308',
      color: '#000000'
    }
  },
  mainContent: {
    padding: '40px 30px',
    overflowY: 'auto'
  },
  nodeTitle: {
    fontSize: '20px',
    fontWeight: '800',
    marginBottom: '24px',
    borderLeft: '3px solid #facc15',
    paddingLeft: '12px',
    letterSpacing: '0.5px'
  },
  splitGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.3fr',
    gap: '30px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr'
    }
  },
  registryCard: {
    maxWidth: '780px'
  },
  shopMetaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  shopTitleText: {
    fontSize: '22px',
    fontWeight: '900',
    color: 'var(--text-primary)'
  },
  verifiedBadge: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--success)',
    backgroundColor: 'rgba(5,150,105,0.08)',
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid rgba(5,150,105,0.2)'
  },
  yellowLine: {
    width: '60px',
    height: '3px',
    backgroundColor: '#facc15',
    margin: '14px 0 28px 0',
    borderRadius: '2px'
  },
  shopDetailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  detailRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    fontSize: '13.5px'
  },
  uploadBlock: {
    marginBottom: '20px'
  },
  uploaderRow: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center'
  },
  photoPreviewBox: {
    width: '56px',
    height: '56px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: '#f4f4f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  photoPreviewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  uploadLabel: {
    backgroundColor: 'rgba(250,204,21,0.15)',
    color: 'var(--accent)',
    border: '1px dashed var(--accent)',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(5,150,105,0.08)',
    border: '1px solid var(--success)',
    color: 'var(--success)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '16px',
    justifyContent: 'center'
  },
  productsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '480px',
    overflowY: 'auto',
    paddingRight: '6px'
  },
  prodItemCard: {
    padding: '12px'
  },
  prodItemCardInner: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  listProdImgBox: {
    width: '50px',
    height: '50px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    backgroundColor: '#f4f4f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0
  },
  listProdImg: {
    width: '80%',
    height: '80%',
    objectFit: 'contain'
  },
  prodItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  prodItemName: {
    fontSize: '13.5px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    textTransform: 'capitalize'
  },
  prodItemPrice: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--accent)'
  },
  prodItemDesc: {
    fontSize: '11.5px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  },
  prodItemCategory: {
    fontSize: '8px',
    fontWeight: '800',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '1px 5px',
    alignSelf: 'flex-start',
    marginTop: '4px',
    display: 'inline-block'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  tableTh: {
    padding: '14px 20px',
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    borderBottom: '1px solid var(--border)'
  },
  tableTd: {
    padding: '14px 20px',
    fontSize: '13px',
    borderBottom: '1px solid var(--border)'
  },
  tableHeadRow: {
    backgroundColor: 'var(--bg-tertiary)'
  },
  tableBodyRow: {
    backgroundColor: '#ffffff',
    ':hover': {
      backgroundColor: 'rgba(0,0,0,0.01)'
    }
  },
  itemsListCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  tableItemText: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    textTransform: 'capitalize'
  },
  detailsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  detailsPrimary: {
    fontSize: '12.5px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  detailsSecondary: {
    fontSize: '10.5px',
    color: 'var(--text-muted)'
  },
  statusTag: {
    fontSize: '9px',
    fontWeight: '800',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '20px',
    border: '1px solid'
  }
};

// Add DOM stylesheet overrides to manage proportional scaling for mobile dashboard layouts
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @media (max-width: 768px) {
      .dashboard-main-layout {
        grid-template-columns: 1fr !important;
        min-height: auto !important;
      }
      .dashboard-sidebar {
        border-right: none !important;
        border-bottom: 1px solid var(--border) !important;
        padding: 12px 16px !important;
        gap: 12px !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
        overflow-x: auto !important;
        white-space: nowrap !important;
      }
      .dashboard-sidebar-badge {
        display: none !important;
      }
      .dashboard-sidebar-nav {
        flex-direction: row !important;
        gap: 6px !important;
        width: 100% !important;
        overflow-x: auto !important;
        white-space: nowrap !important;
        padding-bottom: 0 !important;
        scrollbar-width: none !important;
      }
      .dashboard-sidebar-nav::-webkit-scrollbar {
        display: none !important;
      }
      .dashboard-sidebar-nav button {
        padding: 8px 12px !important;
        font-size: 11px !important;
        flex-shrink: 0 !important;
        width: auto !important;
        justify-content: center !important;
      }
      .dashboard-content-area {
        padding: 16px 12px !important;
        width: 100% !important;
      }
      .seller-dashboard-split-grid {
        grid-template-columns: 1fr !important;
        gap: 24px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
