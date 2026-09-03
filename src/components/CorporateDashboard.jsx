import React, { useState } from 'react';
import { Briefcase, CreditCard, Users, Compass, Check, DollarSign } from 'lucide-react';

export default function CorporateDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Corporate employees authorized to ship
  const [employees, setEmployees] = useState([
    { name: 'Oundo David (Procurement)', limit: '5,000,000 UGX', spent: '1,240,000 UGX', status: 'Approved' },
    { name: 'Grace Nabakooza (Operations)', limit: '3,000,000 UGX', spent: '850,000 UGX', status: 'Approved' },
    { name: 'Ivan Sseba (Logistics Staff)', limit: '1,000,000 UGX', spent: '980,000 UGX', status: 'Warning (Near Limit)' }
  ]);

  const handleRequestRateContract = () => {
    setSuccessMsg("Corporate discount rate requested. Flashpoint Enterprise account executive will contact you with negotiated rates.");
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox}>
          <div style={styles.avatarBadge}>
            <Briefcase size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>CORPORATE CLIENT</span>
            <span style={styles.officerName}>ABC ENTERPRISES</span>
          </div>
        </div>
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab('summary')}
            style={{ ...styles.navItem, ...(activeTab === 'summary' ? styles.activeNavItem : {}) }}
          >
            <Compass size={16} />
            <span>Corporate Account Summary</span>
          </button>
          <button 
            onClick={() => setActiveTab('employees')}
            style={{ ...styles.navItem, ...(activeTab === 'employees' ? styles.activeNavItem : {}) }}
          >
            <Users size={16} />
            <span>Shipping Permissions</span>
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

        {/* SUMMARY TAB */}
        {activeTab === 'summary' && (
          <div>
            <h3 style={styles.nodeTitle}>CORPORATE CONTROL BOARD</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Corporate enterprise portal for bulk cargo allocations, consolidated invoicing, and staff clearance tiers.
            </p>

            {/* KPI grid */}
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>42</span>
                <span style={styles.kpiLbl}>Authorized Staff</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>382</span>
                <span style={styles.kpiLbl}>Shipments This Month</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>18,450,000 UGX</span>
                <span style={styles.kpiLbl}>Monthly Spend Ledger</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>Tier 2</span>
                <span style={styles.kpiLbl}>Clearance Tier</span>
              </div>
            </div>

            {/* Contract Request Card */}
            <div className="card" style={{ marginTop: '24px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>NEGOTIATED FREIGHT TARIFF CONTRACT</h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>You are currently shipping under standard business rates. Request a corporate flat discount contract.</p>
              </div>
              <button onClick={handleRequestRateContract} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>
                <span>Request Custom Contract Rate</span>
              </button>
            </div>
          </div>
        )}

        {/* EMPLOYEES TAB */}
        {activeTab === 'employees' && (
          <div>
            <h3 style={styles.nodeTitle}>EMPLOYEE ACCOUNT SHIPPING PERMISSIONS</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Manage shipping limits allocated to staff members booking cargo dispatches on behalf of the company.
            </p>

            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.tableTh}>Authorized Staff Member</th>
                    <th style={styles.tableTh}>Allocated Spend Limit</th>
                    <th style={styles.tableTh}>Amount Spent (Current Cycle)</th>
                    <th style={styles.tableTh}>Clearance Limit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e, idx) => (
                    <tr key={idx} style={styles.tableBodyRow}>
                      <td style={styles.tableTd}><strong>{e.name}</strong></td>
                      <td style={styles.tableTd}>{e.limit}</td>
                      <td style={styles.tableTd}>{e.spent}</td>
                      <td style={styles.tableTd}>
                        <span style={{
                          ...styles.statusTag,
                          color: e.status === 'Approved' ? 'var(--success)' : 'var(--danger)',
                          backgroundColor: e.status === 'Approved' ? 'rgba(5,150,105,0.06)' : 'rgba(220,38,38,0.06)'
                        }}>{e.status}</span>
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
  }
};
