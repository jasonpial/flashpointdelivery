import React, { useState } from 'react';
import { TrendingUp, BarChart2, PieChart, Users, Compass } from 'lucide-react';

export default function AnalyticsDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('kpis');

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox}>
          <div style={styles.avatarBadge}>
            <BarChart2 size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>BUSINESS ANALYTICS</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab('kpis')}
            style={{ ...styles.navItem, ...(activeTab === 'kpis' ? styles.activeNavItem : {}) }}
          >
            <PieChart size={16} />
            <span>Operational Trends</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        
        {/* KPIS TAB */}
        {activeTab === 'kpis' && (
          <div>
            <h3 style={styles.nodeTitle}>UGANDAN LOGISTICS INTEL LOGS</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Consolidated intelligence metrics mapping business growth, courier performance, and delivery success ratios.
            </p>

            {/* KPI grid */}
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>12,843</span>
                <span style={styles.kpiLbl}>Total Runs Processed</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>+18.4%</span>
                <span style={styles.kpiLbl}>Monthly Volume Growth</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>99.6%</span>
                <span style={styles.kpiLbl}>Delivery Success Ratio</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>4.8 / 5.0</span>
                <span style={styles.kpiLbl}>Client Satisfaction Index</span>
              </div>
            </div>

            {/* Visual HTML charts representing branch performance */}
            <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '20px' }}>REGIONAL REVENUE INTEL INDEX (UGX)</h4>
              
              <div style={styles.chartBlock}>
                
                {/* Bar 1 */}
                <div style={styles.chartRow}>
                  <span style={styles.chartLabel}>Kampala Central HQ (24.8M)</span>
                  <div style={styles.barContainer}>
                    <div style={{ ...styles.barFill, width: '100%', backgroundColor: '#facc15' }} />
                  </div>
                </div>

                {/* Bar 2 */}
                <div style={styles.chartRow}>
                  <span style={styles.chartLabel}>Entebbe Sub-Depot (11.2M)</span>
                  <div style={styles.barContainer}>
                    <div style={{ ...styles.barFill, width: '45%', backgroundColor: '#ca8a04' }} />
                  </div>
                </div>

                {/* Bar 3 */}
                <div style={styles.chartRow}>
                  <span style={styles.chartLabel}>Jinja Crossing (6.4M)</span>
                  <div style={styles.barContainer}>
                    <div style={{ ...styles.barFill, width: '25%', backgroundColor: '#1e293b' }} />
                  </div>
                </div>

              </div>
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
  chartBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  chartRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  chartLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-secondary)'
  },
  barContainer: {
    width: '100%',
    height: '14px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.8s ease'
  }
};
