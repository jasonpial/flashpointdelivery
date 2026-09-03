import React, { useState } from 'react';
import { Package, Scan, CheckCircle, List, Layers, ShieldAlert, ArrowRight, Check } from 'lucide-react';

export default function WarehouseDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('inventory');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Package ledger
  const [packages, setPackages] = useState([
    { id: 'PKG-70192', cargo: 'High-Value Diamonds', location: 'Section B-12 (Vault)', status: 'ARRIVED', condition: 'Sealed & Intact' },
    { id: 'PKG-70195', cargo: 'Electronic Components', location: 'Bay 4 (Staging)', status: 'SCANNED', condition: 'Box minor scuff' },
    { id: 'PKG-70198', cargo: 'Agricultural Seeds', location: 'Row G (Dry Area)', status: 'SORTED', condition: 'Sealed & Intact' }
  ]);

  const handleProgressStatus = (pkgId, currentStatus) => {
    const statusMap = {
      ARRIVED: 'SCANNED',
      SCANNED: 'SORTED',
      SORTED: 'STAGED',
      STAGED: 'DISPATCHED'
    };

    const nextStatus = statusMap[currentStatus];
    if (!nextStatus) return;

    setPackages(prev => prev.map(p => {
      if (p.id === pkgId) {
        return { ...p, status: nextStatus, location: nextStatus === 'DISPATCHED' ? 'Loaded on Armored Carrier' : p.location };
      }
      return p;
    }));
    setSuccessMsg(`Package ${pkgId} barcode scanned. Pipeline advanced: ${currentStatus} → ${nextStatus}.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox}>
          <div style={styles.avatarBadge}>
            <Package size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>WAREHOUSE DEPOT</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab('inventory')}
            style={{ ...styles.navItem, ...(activeTab === 'inventory' ? styles.activeNavItem : {}) }}
          >
            <List size={16} />
            <span>Warehouse Staging ({packages.length})</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {successMsg && (
          <div style={styles.successBanner}>
            <Check size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div>
            <h3 style={styles.nodeTitle}>SORTING & PACKAGE STAGING FLOW</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Sort packages and advance barcode scanner status parameters through sorting checkpoints.
            </p>

            {/* Stage tracker flow visually */}
            <div style={styles.flowCard} className="card">
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                STANDARD LOGISTICS STAGING FLOW
              </span>
              <div style={styles.flowRow}>
                <span style={styles.flowStepActive}>ARRIVAL</span>
                <ArrowRight size={14} color="var(--text-muted)" />
                <span style={styles.flowStepActive}>SCANNED</span>
                <ArrowRight size={14} color="var(--text-muted)" />
                <span style={styles.flowStepActive}>SORTED</span>
                <ArrowRight size={14} color="var(--text-muted)" />
                <span style={styles.flowStep}>STAGED</span>
                <ArrowRight size={14} color="var(--text-muted)" />
                <span style={styles.flowStep}>DISPATCHED</span>
              </div>
            </div>

            {/* Package Ledger table */}
            <div className="card" style={{ padding: 0, marginTop: '24px', overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.tableTh}>Package ID</th>
                    <th style={styles.tableTh}>Cargo Description</th>
                    <th style={styles.tableTh}>Sorting Location</th>
                    <th style={styles.tableTh}>Seal Condition</th>
                    <th style={styles.tableTh}>Scan Status</th>
                    <th style={styles.tableTh} style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map(p => (
                    <tr key={p.id} style={styles.tableBodyRow}>
                      <td style={styles.tableTd}><strong>{p.id}</strong></td>
                      <td style={styles.tableTd}>{p.cargo}</td>
                      <td style={styles.tableTd}><code>{p.location}</code></td>
                      <td style={styles.tableTd}>{p.condition}</td>
                      <td style={styles.tableTd}>
                        <span style={{
                          ...styles.statusTag,
                          color: p.status === 'ARRIVED' ? 'var(--text-muted)' : p.status === 'DISPATCHED' ? 'var(--success)' : 'var(--accent)',
                          backgroundColor: p.status === 'ARRIVED' ? 'rgba(113,113,122,0.06)' : p.status === 'DISPATCHED' ? 'rgba(5,150,105,0.06)' : 'rgba(250,204,21,0.06)'
                        }}>{p.status}</span>
                      </td>
                      <td style={styles.tableTd} style={{ textAlign: 'right', paddingRight: '20px' }}>
                        {p.status !== 'DISPATCHED' ? (
                          <button 
                            onClick={() => handleProgressStatus(p.id, p.status)}
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '11px' }}
                          >
                            <Scan size={10} color="#000000" />
                            <span>Scan Code ({p.status} →)</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '600' }}>Loaded for Dispatch</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
  officerRole: {
    display: 'block',
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '1px'
  },
  officerName: {
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
  },
  activeNavItem: {
    backgroundColor: '#facc15',
    color: '#000000'
  },
  mainContent: {
    padding: '40px 30px',
    overflowY: 'auto'
  },
  nodeTitle: {
    fontSize: '18px',
    fontWeight: '800',
    borderLeft: '3px solid #facc15',
    paddingLeft: '12px',
    letterSpacing: '0.5px'
  },
  flowCard: {
    padding: '20px 24px'
  },
  flowRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    fontSize: '12px'
  },
  flowStepActive: {
    color: '#ffffff',
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    padding: '4px 10px',
    borderRadius: '4px',
    fontWeight: '800'
  },
  flowStep: {
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    padding: '4px 10px',
    borderRadius: '4px',
    fontWeight: '600'
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
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '20px'
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
    backgroundColor: '#ffffff'
  },
  statusTag: {
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '20px',
    border: '1px solid var(--border)'
  }
};
