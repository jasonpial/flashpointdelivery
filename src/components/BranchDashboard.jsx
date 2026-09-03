import React, { useState } from 'react';
import { Store, MapPin, Users, Compass, DollarSign, Check } from 'lucide-react';

export default function BranchDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [activeBranch, setActiveBranch] = useState('Kampala');
  const [successMsg, setSuccessMsg] = useState('');

  // Branch statistics data
  const [branchData, setBranchData] = useState({
    Kampala: { incoming: 184, outgoing: 221, awaiting: 32, delivered: 307, revenue: 24800000, staffCount: 18 },
    Entebbe: { incoming: 92, outgoing: 110, awaiting: 12, delivered: 140, revenue: 11200000, staffCount: 9 },
    Jinja: { incoming: 48, outgoing: 64, awaiting: 8, delivered: 98, revenue: 6400000, staffCount: 5 }
  });

  const currentStats = branchData[activeBranch];

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox}>
          <div style={styles.avatarBadge}>
            <Store size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>BRANCH MANAGEMENT</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab('summary')}
            style={{ ...styles.navItem, ...(activeTab === 'summary' ? styles.activeNavItem : {}) }}
          >
            <Compass size={16} />
            <span>Branch Overview</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        
        <div style={styles.branchHeaderRow}>
          <h3 style={styles.nodeTitle}>{activeBranch.toUpperCase()} BRANCH CONTROL COMMAND</h3>
          
          {/* Branch switcher dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="var(--accent)" />
            <select 
              value={activeBranch} 
              onChange={(e) => setActiveBranch(e.target.value)} 
              style={styles.select}
            >
              <option value="Kampala">Kampala Branch HQ</option>
              <option value="Entebbe">Entebbe Sub-Depot</option>
              <option value="Jinja">Jinja Crossing Branch</option>
            </select>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
          Overview of regional cargo throughput, local staff listings, and cash collections at the local counter.
        </p>

        {/* KPI Grid */}
        <div style={styles.kpiGrid}>
          <div style={styles.kpiCard}>
            <span style={styles.kpiVal}>{currentStats.incoming}</span>
            <span style={styles.kpiLbl}>Incoming Cargo</span>
          </div>
          <div style={styles.kpiCard}>
            <span style={styles.kpiVal}>{currentStats.outgoing}</span>
            <span style={styles.kpiLbl}>Outgoing Cargo</span>
          </div>
          <div style={styles.kpiCard}>
            <span style={styles.kpiVal}>{currentStats.awaiting}</span>
            <span style={styles.kpiLbl}>Awaiting Pickup</span>
          </div>
          <div style={styles.kpiCard}>
            <span style={styles.kpiVal}>{currentStats.delivered}</span>
            <span style={styles.kpiLbl}>Delivered locally</span>
          </div>
        </div>

        {/* Revenue and Personnel summary split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
          
          {/* Cash Vault Info */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>BRANCH COUNTER REVENUES</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={styles.cashIcon}>
                <DollarSign size={28} color="#000000" />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vetted Cash & MM Collections</span>
                <h3 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--success)' }}>
                  {currentStats.revenue.toLocaleString()} UGX
                </h3>
              </div>
            </div>
          </div>

          {/* Local Staff Count Info */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>STAFF ON RECORD</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={styles.staffIcon}>
                <Users size={28} color="#000000" />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assigned Personnel</span>
                <h3 style={{ fontSize: '22px', fontWeight: '900' }}>
                  {currentStats.staffCount} Officers
                </h3>
              </div>
            </div>
          </div>

        </div>

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
  branchHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '8px'
  },
  nodeTitle: {
    fontSize: '18px',
    fontWeight: '800',
    borderLeft: '3px solid #facc15',
    paddingLeft: '12px',
    letterSpacing: '0.5px'
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    fontSize: '13px',
    backgroundColor: '#ffffff',
    fontWeight: '700',
    outline: 'none'
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
    fontSize: '24px',
    fontWeight: '900',
    color: 'var(--accent)'
  },
  kpiLbl: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  cashIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: 'rgba(5,150,105,0.08)',
    border: '1px solid var(--success)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  staffIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: 'rgba(250,204,21,0.08)',
    border: '1px solid var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
