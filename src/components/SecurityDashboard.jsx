import React, { useState } from 'react';
import { Shield, AlertOctagon, Bell, Eye, Check, Key, ShieldAlert } from 'lucide-react';

export default function SecurityDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('incidents');
  const [successMsg, setSuccessMsg] = useState('');

  // Security Incident Database
  const [incidents, setIncidents] = useState([
    { id: 'FP-INC-204', shipmentId: 'FP-UG-19282', location: 'Kampala bypass', type: 'Hijack Alert (Threat Visualized)', severity: 'HIGH', reporter: 'Handler #FP-102', status: 'UNDER INVESTIGATION', time: '10:14 AM' },
    { id: 'FP-INC-201', shipmentId: 'FP-UG-102938', location: 'Entebbe highway', type: 'Escort Vehicle Breakdown', severity: 'MEDIUM', reporter: 'Handler #FP-105', status: 'RESOLVED', time: '08:42 AM' }
  ]);

  const handleResolveIncident = (incId) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incId) {
        return { ...inc, status: 'RESOLVED' };
      }
      return inc;
    }));
    setSuccessMsg(`Incident ${incId} successfully resolved and archived in command logs.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeployTacticalUnit = (incId) => {
    setSuccessMsg(`TACTICAL RESPONSE UNIT DEPLOYED to incident ${incId} location. Dispatch notified.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox}>
          <div style={styles.avatarBadge}>
            <ShieldAlert size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>SECURITY ROOM</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab('incidents')}
            style={{ ...styles.navItem, ...(activeTab === 'incidents' ? styles.activeNavItem : {}) }}
          >
            <AlertOctagon size={16} />
            <span>Active Incidents ({incidents.filter(i => i.status !== 'RESOLVED').length})</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {successMsg && (
          <div style={styles.successBanner} className="pulse-glow-effect">
            <Shield size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* INCIDENTS TAB */}
        {activeTab === 'incidents' && (
          <div>
            <h3 style={styles.nodeTitle}>SECURITY OVERWATCH & EMERGENCY LOGS</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Central monitoring of classified cargo transits, high-value assets, and emergency handler alerts.
            </p>

            <div style={styles.incidentGrid}>
              {incidents.map(inc => (
                <div key={inc.id} className="card" style={{
                  ...styles.incidentCard,
                  borderColor: inc.status === 'RESOLVED' ? 'var(--border)' : 'var(--danger)'
                }}>
                  <div style={styles.cardHeader}>
                    <div>
                      <span style={styles.incId}>{inc.id}</span>
                      <h4 style={styles.incType}>{inc.type}</h4>
                    </div>
                    <span style={{
                      ...styles.severityBadge,
                      backgroundColor: inc.severity === 'HIGH' ? 'rgba(220,38,38,0.08)' : 'rgba(250,204,21,0.08)',
                      color: inc.severity === 'HIGH' ? 'var(--danger)' : 'var(--accent)'
                    }}>{inc.severity} SEVERITY</span>
                  </div>

                  <div style={styles.specBox}>
                    <div style={styles.specRow}>
                      <span>Target Cargo ID:</span>
                      <strong>{inc.shipmentId}</strong>
                    </div>
                    <div style={styles.specRow} style={{ marginTop: '6px' }}>
                      <span>Report Location:</span>
                      <strong>{inc.location}</strong>
                    </div>
                    <div style={styles.specRow} style={{ marginTop: '6px' }}>
                      <span>Vetted Reporter:</span>
                      <strong>{inc.reporter}</strong>
                    </div>
                    <div style={styles.specRow} style={{ marginTop: '6px' }}>
                      <span>Handshake Time:</span>
                      <strong>{inc.time}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <span>Investigation Status:</span>
                    <strong style={{ color: inc.status === 'RESOLVED' ? 'var(--success)' : 'var(--accent)' }}>{inc.status}</strong>
                  </div>

                  <div style={styles.btnRow}>
                    {inc.status !== 'RESOLVED' && (
                      <>
                        <button 
                          onClick={() => handleDeployTacticalUnit(inc.id)}
                          className="btn btn-primary"
                          style={{ padding: '8px 14px', fontSize: '11px', flex: 1.3 }}
                        >
                          <Shield size={12} color="#000000" />
                          <span>Deploy Tactical Squad</span>
                        </button>
                        <button 
                          onClick={() => handleResolveIncident(inc.id)}
                          className="btn btn-secondary"
                          style={{ padding: '8px 14px', fontSize: '11px', flex: 1, color: 'var(--success)', borderColor: 'var(--success)' }}
                        >
                          <span>Mark Resolved</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
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
  incidentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  incidentCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '24px',
    border: '2px solid'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  incId: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--text-muted)'
  },
  incType: {
    fontSize: '15px',
    fontWeight: '800',
    margin: '4px 0 0 0'
  },
  severityBadge: {
    fontSize: '8.5px',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  specBox: {
    backgroundColor: 'var(--bg-tertiary)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    fontSize: '12px'
  },
  specRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto',
    paddingTop: '8px'
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(220,38,38,0.06)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '20px'
  }
};
