import React, { useState } from 'react';
import { Store, ShoppingBag, Search, Truck } from 'lucide-react';
import { ITEM_CATEGORIES } from '../deliveryData';
import DeliveryRiderImg from '../assets/delivery_rider.png';

export default function Marketplace({ products, shops, user, onAddToCart, onNavigateToAuth }) {
  const [addedProductId, setAddedProductId] = useState(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddClick = (product) => {
    if (onAddToCart) onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategoryFilter === 'all' || p.category === activeCategoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={styles.marketPage} className="slide-up">
      <div className="container">
        
        {/* Marketplace Header */}
        <div style={styles.headerRow}>
          <div>
            <h2 style={{ fontSize: '32px' }}>Merchant <span style={{ color: 'var(--accent)' }}>Marketplace</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Purchase products directly from verified Ugandan businesses and dispatch secure armored deliveries instantly.
            </p>
          </div>
          <div style={styles.headerDecoration} className="marketplace-header-deco">
            <img src={DeliveryRiderImg} alt="Marketplace Express" style={styles.headerDecoImg} />
          </div>
        </div>

        <div style={styles.mainLayout}>
          
          {/* Catalog Area: Grid & Search */}
          <div style={styles.productsArea}>
            
            {/* Filter Bar */}
            <div style={styles.filterBar}>
              <div style={styles.searchWrapper}>
                <Search size={16} color="var(--text-muted)" style={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search products or stores..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.categoryFilters}>
                <button
                  onClick={() => setActiveCategoryFilter('all')}
                  style={{
                    ...styles.filterBtn,
                    ...(activeCategoryFilter === 'all' ? styles.activeFilterBtn : {})
                  }}
                >
                  All Products
                </button>
                {ITEM_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.id)}
                    style={{
                      ...styles.filterBtn,
                      ...(activeCategoryFilter === cat.id ? styles.activeFilterBtn : {})
                    }}
                  >
                    {cat.name.split(' & ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Products grid */}
            {filteredProducts.length === 0 ? (
              <div style={styles.emptyProducts} className="card">
                <ShoppingBag size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                <h4>No products found.</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center' }}>
                  Choose "Open a Shop" in the navigation header to register a merchant storefront and list custom inventories.
                </p>
              </div>
            ) : (
              <div style={styles.productsGrid} className="marketplace-products-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} className="card card-hover" style={styles.productCard}>
                    
                    {/* Product Cover Image Container */}
                    <div style={styles.productImageWrapper} className="marketplace-product-image-wrapper">
                      <img src={product.image} alt={product.name} style={styles.productImg} />
                    </div>

                    {/* Details Info Container */}
                    <div style={styles.productInfoBox} className="marketplace-product-info-box">
                      <div style={styles.cardHeader}>
                        <span style={styles.productName}>{product.name}</span>
                        <span style={styles.priceTag}>{product.price.toLocaleString()} UGX</span>
                      </div>
                      <p style={styles.productDesc}>{product.description}</p>
                      
                      <div style={styles.sellerRow}>
                        <Store size={12} color="var(--accent)" />
                        <span style={styles.sellerName}>{product.seller}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleAddClick(product)}
                        className="btn"
                        style={{
                          ...styles.purchaseBtn,
                          backgroundColor: addedProductId === product.id ? 'var(--success)' : '#facc15',
                          color: addedProductId === product.id ? '#ffffff' : '#000000',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <ShoppingBag size={14} color={addedProductId === product.id ? '#ffffff' : '#000000'} />
                        <span>{addedProductId === product.id ? 'Added to Cart!' : 'Add to Cart'}</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

const styles = {
  marketPage: {
    padding: '40px 0 80px 0',
    backgroundColor: 'var(--bg-primary)'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '36px',
    flexWrap: 'wrap',
    gap: '24px'
  },
  headerDecoration: {
    width: '180px',
    height: '80px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid var(--border)'
  },
  headerDecoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  mainLayout: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  productsArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%'
  },
  filterBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px'
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px 10px 38px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    color: 'var(--text-primary)',
    ':focus': {
      borderColor: 'var(--accent)'
    }
  },
  categoryFilters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  filterBtn: {
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid var(--border)',
    background: 'none',
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: 'var(--accent)'
    }
  },
  activeFilterBtn: {
    backgroundColor: '#facc15',
    color: '#000000',
    borderColor: '#facc15'
  },
  emptyProducts: {
    padding: '60px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
    gap: '24px'
  },
  productCard: {
    padding: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  productImageWrapper: {
    height: '160px',
    backgroundColor: '#f4f4f5',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    flexShrink: 0
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  productInfoBox: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '8px'
  },
  productName: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    textTransform: 'capitalize'
  },
  priceTag: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--accent)',
    backgroundColor: 'rgba(250,204,21,0.1)',
    padding: '3px 8px',
    borderRadius: '6px',
    flexShrink: 0
  },
  productDesc: {
    fontSize: '12.5px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '14px'
  },
  sellerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '16px',
    borderTop: '1px solid rgba(0,0,0,0.02)',
    paddingTop: '10px'
  },
  sellerName: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-muted)'
  },
  purchaseBtn: {
    width: '100%',
    padding: '10px',
    fontSize: '13px'
  }
};

// Add DOM stylesheet overrides to manage proportional scaling for registry pages
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @media (max-width: 768px) {
      .marketplace-header-deco { 
        display: block !important;
        width: 110px !important;
        height: 55px !important;
        flex-shrink: 0 !important;
      }
      .marketplace-products-grid { 
        grid-template-columns: repeat(2, 1fr) !important; 
        gap: 12px !important; 
      }
      .marketplace-product-image-wrapper { 
        height: 120px !important; 
        padding: 8px !important;
      }
      .marketplace-product-info-box {
        padding: 10px !important;
      }
      .marketplace-product-info-box span {
        font-size: 12.5px !important;
      }
      .marketplace-product-info-box p {
        font-size: 11.5px !important;
        margin-bottom: 8px !important;
      }
      .marketplace-product-info-box button {
        padding: 6px 10px !important;
        font-size: 11.5px !important;
      }
    }
    @media (max-width: 480px) {
      .marketplace-products-grid { 
        grid-template-columns: repeat(2, 1fr) !important; 
        gap: 8px !important; 
      }
      .marketplace-product-image-wrapper { 
        height: 90px !important; 
        padding: 4px !important;
      }
      .marketplace-product-info-box {
        padding: 8px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
