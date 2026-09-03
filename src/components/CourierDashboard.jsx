import React, { useState } from 'react';
import { Truck, Compass, DollarSign, MapPin, Check, CheckCircle2 } from 'lucide-react';

export default function CourierDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('route');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Courier assigned runs
  const [runs, setRuns] = useState([
    { id: 1, route: 'Kampala HQ → Ntinda Shopping Complex', status: 'Pending Pickup', weight: '2.5 KG', value: 'UGX 12,000' },
    { id: 2, route: 'Kampala HQ → Entebbe Airport Office', status: 'In Transit', weight: '14 KG', value: 'UGX 45,000' },
    { id: 3, route: 'Ntinda depot → Bugolobi Industrial division', status: 'Pending Pickup', weight: '5.8 KG', value: 'UGX 18,000' },
    { id: 4, route: 'Bugolobi Hub → Kololo Summit View', status: 'Pending Pickup', weight: '1.2 KG', value: 'UGX 8,000' }
  ]);

  const [earnings, setEarnings] = useState(38000); // UGX already earned today

  const handleCompleteRun = (runId, valueStr) => {
    setRuns(prev => prev.map(r => {
      if (r.id === runId) {
        return { ...r, status: 'DELIVERED' };
      }
      return r;
    }));
    const cashVal = parseInt(valueStr.replace(/[^0-9]/g, ''));
    setEarnings(prev => prev + cashVal);
    setSuccessMsg(`Transit run completed successfully. Delivery signature recorded. Earning logged.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox}>
          <div style={styles.avatarBadge}>
            <Truck size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>TACTICAL RIDER</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab('route')}
            style={{ ...styles.navItem, ...(activeTab === 'route' ? styles.activeNavItem : {}) }}
          >
            <Compass size={16} />
            <span>Assigned Runs ({runs.filter(r => r.status !== 'DELIVERED').length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('earnings')}
            style={{ ...styles.navItem, ...(activeTab === 'earnings' ? styles.activeNavItem : {}) }}
          >
            <DollarSign size={16} />
            <span>Rider Earnings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {successMsg && (
          <div style={styles.successBanner}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* RUNS TAB */}
        {activeTab === 'route' && (
          <div>
            <h3 style={styles.nodeTitle}>TODAY'S DISPATCH ROUTE</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Optimized delivery manifests assigned for courier dispatch.
            </p>

            <div style={styles.runsList}>
              {runs.map(r => (
                <div key={r.id} className="card" style={{
                  ...styles.runCard,
                  opacity: r.status === 'DELIVERED' ? 0.7 : 1
                }}>
                  <div style={styles.runHeader}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>RUN INDEX #{r.id}</span>
                      <h4 style={{ margin: '4px 0', fontSize: '14.5px' }}>{r.route}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cargo Manifest: {r.weight} | Value: {r.value}</span>
                    </div>

                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: r.status === 'DELIVERED' ? 'rgba(5,150,105,0.06)' : 'rgba(250,204,21,0.06)',
                      color: r.status === 'DELIVERED' ? 'var(--success)' : 'var(--accent)'
                    }}>{r.status}</span>
                  </div>

                  {r.status !== 'DELIVERED' && (
                    <button 
                      onClick={() => handleCompleteRun(r.id, r.value)}
                      className="btn btn-primary"
                      style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '11px', marginTop: '10px' }}
                    >
                      <Check size={12} color="#000000" />
                      <span>Confirm Delivery Drop</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EARNINGS TAB */}
        {activeTab === 'earnings' && (
          <div>
            <h3 style={styles.nodeTitle}>COURIER RIDER INCENTIVE EARNINGS</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Track accumulated high-risk delivery surcharges and incentives disbursed this week.
            </p>

            <div className="card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={styles.earnBadge}>
                <DollarSign size={32} color="#000000" />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WEEKLY SURCHARGE CREDIT</span>
                <h3 style={{ fontSize: '24px', fontWeight: '950', color: 'var(--success)' }}>
                  {earnings.toLocaleString()} UGX
                </h3>
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
  runsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px'
  },
  runCard: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  runHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '10px'
  },
  statusBadge: {
    fontSize: '9.5px',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid var(--border)'
  },
  earnBadge: {
    width: '56px',
    height: '56px',
    borderRadius: '8px',
    backgroundColor: 'rgba(5,150,105,0.08)',
    border: '1px solid var(--success)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
