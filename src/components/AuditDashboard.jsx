import React, { useState } from 'react';
import { ShieldCheck, Search, List, Activity, Key } from 'lucide-react';

export default function AuditDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('logs');
  const [searchQuery, setSearchQuery] = useState('');

  // Vetted Audit Logs
  const [auditLogs] = useState([
    { id: 'LOG-772', time: '14:41:02', user: 'Dispatcher Mark', action: 'Reassigned vehicle FP-VAN-004 to Jinja drop', location: 'Kampala HQ Depot' },
    { id: 'LOG-768', time: '14:37:15', user: 'Finance Sarah', action: 'Confirmed payment receipt ref MM.C332', location: 'Nakasero Command' },
    { id: 'LOG-765', time: '14:35:48', user: 'Handler Brian', action: 'Uploaded delivery proof (Sig & Photo)', location: 'Entebbe Depot' },
    { id: 'LOG-761', time: '14:32:09', user: 'Admin John', action: 'Changed active user permissions list', location: 'Nakasero HQ Root' }
  ]);

  const filteredLogs = auditLogs.filter(l => 
    l.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox}>
          <div style={styles.avatarBadge}>
            <ShieldCheck size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>AUDIT & COMPLIANCE</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab('logs')}
            style={{ ...styles.navItem, ...(activeTab === 'logs' ? styles.activeNavItem : {}) }}
          >
            <List size={16} />
            <span>Audit Ledger</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        
        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div>
            <div style={{ display: 'flex', justifyContext: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={styles.nodeTitle}>COMPLIANCE AUDIT TRAILS</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                  Verifiable ledger of all system transactions, credential elevations, and vehicle allocations.
                </p>
              </div>
              
              <div style={styles.searchWrapper}>
                <Search size={16} color="var(--text-muted)" style={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search logs by staff, action..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.tableTh}>LOG ID</th>
                    <th style={styles.tableTh}>Timestamp</th>
                    <th style={styles.tableTh}>Security Operator</th>
                    <th style={styles.tableTh}>Executed Action Parameter</th>
                    <th style={styles.tableTh}>Base Station</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(l => (
                    <tr key={l.id} style={styles.tableBodyRow}>
                      <td style={styles.tableTd}><strong>{l.id}</strong></td>
                      <td style={styles.tableTd}><code>{l.time}</code></td>
                      <td style={styles.tableTd}><strong>{l.user}</strong></td>
                      <td style={styles.tableTd}>{l.action}</td>
                      <td style={styles.tableTd}>
                        <span style={styles.locBadge}>{l.location}</span>
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
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '280px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px'
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px 8px 36px',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    transition: 'all 0.2s ease',
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
  locBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid var(--border)'
  }
};
