import React, { useState } from 'react';
import { 
  BarChart2, TrendingUp, Shield, FileText, Radio, Settings, 
  Send, CheckCircle, Clock, Truck, Store, MapPin 
} from 'lucide-react';
import SettingsNode from './SettingsNode';

export default function CEODashboard({ 
  user, orders, reports, broadcasts, shops, onUserUpdate, onAddBroadcast,
  activeSubNode, setActiveSubNode
}) {
  const [localActiveNode, setLocalActiveNode] = useState('summary');
  const activeNode = activeSubNode || localActiveNode;
  const setActiveNode = (node) => {
    if (setActiveSubNode) setActiveSubNode(node);
    setLocalActiveNode(node);
  };
  const [broadcastInput, setBroadcastInput] = useState('');
  const [broadSuccess, setBroadSuccess] = useState('');

  // Summarize logistics stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.pricing.total, 0);
  const activeOrders = orders.filter(o => ['secured', 'in_transit', 'out_for_delivery'].includes(o.status)).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const sellerCount = shops.length;

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!broadcastInput.trim()) return;

    onAddBroadcast({
      id: `b-${Date.now()}`,
      sender: `${user.name} (CEO)`,
      message: broadcastInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setBroadcastInput('');
    setBroadSuccess('Broadcast sent successfully to all clients and handlers!');
    setTimeout(() => setBroadSuccess(''), 3000);
  };

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation - Distinct Nodes */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.ceoBadge} className="dashboard-sidebar-badge">
          <Shield size={24} color="#facc15" />
          <div>
            <span style={styles.ceoTitle}>EXECUTIVE ACCESS</span>
            <span style={styles.ceoName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav} className="dashboard-sidebar-nav">
          <button 
            onClick={() => setActiveNode('summary')}
            style={{ ...styles.navItem, ...(activeNode === 'summary' ? styles.activeNavItem : {}) }}
          >
            <BarChart2 size={16} />
            <span>Summary Analytics</span>
          </button>
          
          <button 
            onClick={() => setActiveNode('logistics')}
            style={{ ...styles.navItem, ...(activeNode === 'logistics' ? styles.activeNavItem : {}) }}
          >
            <Truck size={16} />
            <span>Logistics Monitor</span>
          </button>
          
          <button 
            onClick={() => setActiveNode('reports')}
            style={{ ...styles.navItem, ...(activeNode === 'reports' ? styles.activeNavItem : {}) }}
          >
            <FileText size={16} />
            <span>Handler Reports ({reports.length})</span>
          </button>
          
          <button 
            onClick={() => setActiveNode('broadcast')}
            style={{ ...styles.navItem, ...(activeNode === 'broadcast' ? styles.activeNavItem : {}) }}
          >
            <Radio size={16} />
            <span>Broadcast Center</span>
          </button>
          
          <button 
            onClick={() => setActiveNode('settings')}
            style={{ ...styles.navItem, ...(activeNode === 'settings' ? styles.activeNavItem : {}) }}
          >
            <Settings size={16} />
            <span>User Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Panel Content Area */}
      <main style={styles.mainContent} className="dashboard-content-area">
        
        {/* Node 1: Summary Analytics */}
        {activeNode === 'summary' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>EXECUTIVE SUMMARY</h3>
            <div style={styles.statsGrid}>
              <div className="card" style={styles.statCard}>
                <TrendingUp size={28} color="var(--accent)" />
                <span style={styles.statLabel}>Total Transit Revenue</span>
                <span style={styles.statValue}>{totalRevenue.toLocaleString()} UGX</span>
              </div>
              <div className="card" style={styles.statCard}>
                <Truck size={28} color="var(--accent)" />
                <span style={styles.statLabel}>Active Escorts</span>
                <span style={styles.statValue}>{activeOrders} Cargoes</span>
              </div>
              <div className="card" style={styles.statCard}>
                <Store size={28} color="var(--accent)" />
                <span style={styles.statLabel}>Registered Sellers</span>
                <span style={styles.statValue}>{sellerCount} Shops</span>
              </div>
              <div className="card" style={styles.statCard}>
                <Clock size={28} color="var(--accent)" />
                <span style={styles.statLabel}>Pending Dispatch</span>
                <span style={styles.statValue}>{pendingOrders} Bookings</span>
              </div>
            </div>

            {/* Shipment breakdown layout details */}
            <div className="card" style={{ marginTop: '30px' }}>
              <h4 style={{ marginBottom: '16px' }}>SECURED CARRIER DISTRIBUTION</h4>
              <div style={styles.breakdownRow}>
                <div style={styles.breakdownItem}>
                  <span style={styles.breakdownCount}>
                    {orders.filter(o => o.carrierMode === 'tactical_escort').length}
                  </span>
                  <span style={styles.breakdownLabel}>Tactical Armored</span>
                </div>
                <div style={styles.breakdownItem}>
                  <span style={styles.breakdownCount}>
                    {orders.filter(o => o.carrierMode === 'secured_agent').length}
                  </span>
                  <span style={styles.breakdownLabel}>Secured Agent</span>
                </div>
                <div style={styles.breakdownItem}>
                  <span style={styles.breakdownCount}>
                    {orders.filter(o => o.carrierMode === 'standard').length}
                  </span>
                  <span style={styles.breakdownLabel}>Standard Courier</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Node 2: Logistics Monitor */}
        {activeNode === 'logistics' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>GLOBAL LOGISTICS MONITOR</h3>
            <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.tableTh}>Order ID</th>
                    <th style={styles.tableTh}>Courier Mode</th>
                    <th style={styles.tableTh}>Route Details</th>
                    <th style={styles.tableTh}>Recipient</th>
                    <th style={styles.tableTh}>UGX Fee</th>
                    <th style={styles.tableTh}>Vetting Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={styles.tableBodyRow}>
                      <td style={styles.tableTd}><strong style={{ color: 'var(--text-primary)' }}>{order.id}</strong></td>
                      <td style={styles.tableTd}>
                        <span style={styles.modeBadge}>{order.carrierMode.replace(/_/g, ' ')}</span>
                      </td>
                      <td style={styles.tableTd}>
                        <div style={styles.routeCol}>
                          <span style={styles.routeText}><MapPin size={10} /> {order.pickup.name.split(' (')[0]}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>to {order.delivery.name.split(' (')[0]}</span>
                        </div>
                      </td>
                      <td style={styles.tableTd}>
                        <div style={styles.routeCol}>
                          <span style={styles.routeText}>{order.receiverName}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{order.receiverPhone}</span>
                        </div>
                      </td>
                      <td style={styles.tableTd}><strong>{order.pricing.total.toLocaleString()}</strong></td>
                      <td style={styles.tableTd}>
                        <span style={{
                          ...styles.statusTag,
                          color: order.status === 'delivered' ? 'var(--success)' : order.status === 'pending' ? 'var(--text-muted)' : 'var(--accent)',
                          backgroundColor: order.status === 'delivered' ? 'rgba(5,150,105,0.08)' : order.status === 'pending' ? 'rgba(0,0,0,0.02)' : 'rgba(250,204,21,0.08)'
                        }}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Node 3: Handler Reports */}
        {activeNode === 'reports' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>HANDLER COURIER SECURITY REPORTS</h3>
            <div style={styles.reportsList}>
              {reports.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                  <FileText size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                  <h4>No reports filed by handlers yet.</h4>
                </div>
              ) : (
                reports.map(report => (
                  <div key={report.id} className="card" style={styles.reportCard}>
                    <div style={styles.reportHeader}>
                      <div>
                        <h4 style={styles.reportSubject}>{report.subject}</h4>
                        <span style={styles.reportAuthor}>Submitted by: {report.handlerName} • Cargo ID: <strong style={{ color: 'var(--accent)' }}>{report.orderId}</strong></span>
                      </div>
                      <span style={styles.reportTime}>{report.timestamp}</span>
                    </div>
                    <p style={styles.reportContent}>{report.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Node 4: Broadcast Center */}
        {activeNode === 'broadcast' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>BROADCAST SECURITY BULLETIN</h3>
            <div className="card" style={{ padding: '28px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                Compose and send warnings to all active clients and courier handlers. 
                Bulletins immediately appear on their respective dashboard screens.
              </p>

              {broadSuccess && (
                <div style={styles.successBox}>
                  <CheckCircle size={16} />
                  <span>{broadSuccess}</span>
                </div>
              )}

              <form onSubmit={handleBroadcastSubmit}>
                <div className="form-group">
                  <label className="form-label">Bulletin Message</label>
                  <textarea 
                    rows="4"
                    placeholder="Type security advisory here (e.g. bypass closed, roadblocks at Central division)..."
                    value={broadcastInput}
                    onChange={(e) => setBroadcastInput(e.target.value)}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <Send size={14} color="#000000" />
                  <span>Broadcast System Bulletin</span>
                </button>
              </form>
            </div>

            {/* Broadcast history list */}
            <div className="card" style={{ marginTop: '30px' }}>
              <h4 style={{ marginBottom: '16px' }}>SYSTEM BULLETIN ARCHIVES</h4>
              <div style={styles.bulletinList}>
                {broadcasts.map(b => (
                  <div key={b.id} style={styles.bulletinItem}>
                    <div style={styles.bulletinMeta}>
                      <strong>{b.sender}</strong>
                      <span style={styles.bulletinTime}>{b.timestamp}</span>
                    </div>
                    <p style={styles.bulletinMsg}>{b.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Node 5: Settings */}
        {activeNode === 'settings' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>EXECUTIVE SETTINGS</h3>
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
  ceoBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '20px'
  },
  ceoTitle: {
    display: 'block',
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '1px'
  },
  ceoName: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--text-primary)'
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  statCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    justifyContent: 'center'
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  statValue: {
    fontSize: '22px',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '20px 0',
    flexWrap: 'wrap',
    gap: '20px'
  },
  breakdownItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  breakdownCount: {
    fontSize: '36px',
    fontWeight: '900',
    color: 'var(--accent)'
  },
  breakdownLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    marginTop: '6px'
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
  modeBadge: {
    fontSize: '9px',
    fontWeight: '800',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    backgroundColor: 'rgba(250,204,21,0.1)',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  },
  statusTag: {
    fontSize: '9px',
    fontWeight: '800',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '20px',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  routeCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  routeText: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  reportsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  reportCard: {
    padding: '24px'
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px',
    marginBottom: '14px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  reportSubject: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  reportAuthor: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '4px',
    display: 'block'
  },
  reportTime: {
    fontSize: '11px',
    color: 'var(--text-muted)'
  },
  reportContent: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'var(--text-secondary)'
  },
  successBox: {
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
  bulletinList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  bulletinItem: {
    borderBottom: '1px solid var(--border)',
    paddingBottom: '14px',
    ':last-child': {
      borderBottom: 'none',
      paddingBottom: 0
    }
  },
  bulletinMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    marginBottom: '6px'
  },
  bulletinTime: {
    color: 'var(--text-muted)',
    fontSize: '10px'
  },
  bulletinMsg: {
    fontSize: '13px',
    lineHeight: '1.5',
    color: 'var(--text-secondary)'
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
    }
  `;
  document.head.appendChild(styleSheet);
}
