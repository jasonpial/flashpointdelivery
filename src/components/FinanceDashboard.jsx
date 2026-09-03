import React, { useState } from 'react';
import { DollarSign, FileText, TrendingUp, Check, X, ShieldAlert, Award, Search } from 'lucide-react';

export default function FinanceDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Transactions database
  const [transactions, setTransactions] = useState([
    { id: 'TXN-90238', orderId: 'FP-UG-102938', amount: 25000, method: 'Mobile Money', status: 'PAID', ref: 'MP260829.1432.B812', sender: 'David Oundo' },
    { id: 'TXN-90240', orderId: 'FP-UG-19302', amount: 185000, method: 'Mobile Money', status: 'PAID', ref: 'MP260829.1511.C332', sender: 'Kyobe Arthur' },
    { id: 'TXN-90241', orderId: 'FP-UG-19305', amount: 480000, method: 'Corporate Account', status: 'PENDING', ref: 'CORP-INV-802', sender: 'ABC Enterprises' },
    { id: 'TXN-90242', orderId: 'FP-UG-100234', amount: 45000, method: 'Cash on Delivery', status: 'UNPAID', ref: 'COD-LOG-901', sender: 'John Doe' }
  ]);

  const handleReconcile = (txnId) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txnId) {
        return { ...t, status: 'PAID', ref: t.ref.includes('COD') ? 'CASH-REC-' + Math.floor(1000 + Math.random() * 9000) : t.ref };
      }
      return t;
    }));
    setSuccessMsg(`Transaction ${txnId} successfully reconciled & verified.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const filteredTxns = transactions.filter(t => 
    t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.ref.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox}>
          <div style={styles.avatarBadge}>
            <DollarSign size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>FINANCE DIVISION</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{ ...styles.navItem, ...(activeTab === 'overview' ? styles.activeNavItem : {}) }}
          >
            <TrendingUp size={16} />
            <span>Financial Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('reconcile')}
            style={{ ...styles.navItem, ...(activeTab === 'reconcile' ? styles.activeNavItem : {}) }}
          >
            <Check size={16} />
            <span>Reconciliation Desk Desk ({transactions.filter(t => t.status !== 'PAID').length})</span>
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

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <h3 style={styles.nodeTitle}>FINANCE OVERVIEW & METRICS</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Summary of Uganda mobile money records, cash collections, and net company revenues.
            </p>

            {/* KPI grid */}
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>12,450,000 UGX</span>
                <span style={styles.kpiLbl}>Revenue Today</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>4,820,000 UGX</span>
                <span style={styles.kpiLbl}>Pending Payments</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>3,200,000 UGX</span>
                <span style={styles.kpiLbl}>Expenses</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>420,000 UGX</span>
                <span style={styles.kpiLbl}>Refunds Issued</span>
              </div>
            </div>

            {/* Net calculations display */}
            <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
              <h4 style={{ marginBottom: '14px', fontSize: '14px' }}>DAILY RECONCILIATION SUMMARY</h4>
              <div style={styles.formulaRow}>
                <div style={styles.formulaCol}>
                  <span style={styles.formLbl}>Revenue Today</span>
                  <strong>12,450,000 UGX</strong>
                </div>
                <div style={styles.operator}>-</div>
                <div style={styles.formulaCol}>
                  <span style={styles.formLbl}>Expenses</span>
                  <strong>3,200,000 UGX</strong>
                </div>
                <div style={styles.operator}>-</div>
                <div style={styles.formulaCol}>
                  <span style={styles.formLbl}>Refunds</span>
                  <strong>420,000 UGX</strong>
                </div>
                <div style={styles.operator}>=</div>
                <div style={styles.formulaCol} style={{ backgroundColor: 'rgba(5,150,105,0.08)', padding: '12px 20px', borderRadius: '8px', border: '1px solid var(--success)' }}>
                  <span style={styles.formLbl} style={{ color: 'var(--success)', fontWeight: '800' }}>NET REVENUE</span>
                  <strong style={{ color: 'var(--success)' }}>8,830,000 UGX</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RECONCILE TAB */}
        {activeTab === 'reconcile' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={styles.nodeTitle}>PAYMENT RECONCILIATION TABLE</h3>
              <div style={styles.searchWrapper}>
                <Search size={16} color="var(--text-muted)" style={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search sender, reference or ID..."
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
                    <th style={styles.tableTh}>TXN ID</th>
                    <th style={styles.tableTh}>Order Ref</th>
                    <th style={styles.tableTh}>Sender Name</th>
                    <th style={styles.tableTh}>Amount</th>
                    <th style={styles.tableTh}>Method</th>
                    <th style={styles.tableTh}>Reference code</th>
                    <th style={styles.tableTh}>Status</th>
                    <th style={styles.tableTh} style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTxns.map(t => (
                    <tr key={t.id} style={styles.tableBodyRow}>
                      <td style={styles.tableTd}><strong>{t.id}</strong></td>
                      <td style={styles.tableTd}>{t.orderId}</td>
                      <td style={styles.tableTd}>{t.sender}</td>
                      <td style={styles.tableTd}><strong>{t.amount.toLocaleString()} UGX</strong></td>
                      <td style={styles.tableTd}>{t.method}</td>
                      <td style={styles.tableTd}>
                        <code style={{ fontSize: '11px', backgroundColor: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>{t.ref}</code>
                      </td>
                      <td style={styles.tableTd}>
                        <span style={{
                          ...styles.statusTag,
                          color: t.status === 'PAID' ? 'var(--success)' : t.status === 'PENDING' ? 'var(--accent)' : 'var(--danger)',
                          backgroundColor: t.status === 'PAID' ? 'rgba(5,150,105,0.06)' : t.status === 'PENDING' ? 'rgba(250,204,21,0.06)' : 'rgba(220,38,38,0.06)'
                        }}>{t.status}</span>
                      </td>
                      <td style={styles.tableTd} style={{ textAlign: 'right', paddingRight: '20px' }}>
                        {t.status !== 'PAID' ? (
                          <button 
                            onClick={() => handleReconcile(t.id)}
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '11px' }}
                          >
                            <span>Verify & Reconcile</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Cleared</span>
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
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginTop: '20px'
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  kpiVal: {
    fontSize: '18px',
    fontWeight: '900',
    color: 'var(--accent)'
  },
  kpiLbl: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  formulaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    marginTop: '10px'
  },
  formulaCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  formLbl: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  operator: {
    fontSize: '24px',
    color: 'var(--text-muted)',
    fontWeight: '300'
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
  statusTag: {
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '20px',
    border: '1px solid var(--border)'
  }
};
