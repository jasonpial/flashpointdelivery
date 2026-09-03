import React, { useState } from 'react';
import { Truck, Navigation, Settings, AlertTriangle, Check, Compass, ShieldAlert } from 'lucide-react';

export default function FleetDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('fleet');
  const [successMsg, setSuccessMsg] = useState('');

  // Fleet list
  const [vehicles, setVehicles] = useState([
    { id: 'FP-VAN-004', driver: 'Brian Senyondo', type: 'Shielded Transit Van', fuel: 62, mileage: 83421, insurance: 'ACTIVE', serviceDue: 421, status: 'Active' },
    { id: 'FP-TRUCK-002', driver: 'Sgt. Okello Emmanuel', type: 'Armored Carrier', fuel: 85, mileage: 41200, insurance: 'ACTIVE', serviceDue: 1800, status: 'Active' },
    { id: 'FP-BIKE-027', driver: 'Nsubuga Henry', type: 'Secured Courier Motorcycle', fuel: 40, mileage: 12400, insurance: 'ACTIVE', serviceDue: 50, status: 'Maintenance' },
    { id: 'FP-VAN-001', driver: 'None (Standby)', type: 'Standard Delivery Van', fuel: 100, mileage: 98100, insurance: 'EXPIRED', serviceDue: 0, status: 'Unavailable' }
  ]);

  const handleTriggerService = (vId) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vId) {
        return { ...v, serviceDue: 5000, status: 'Active' };
      }
      return v;
    }));
    setSuccessMsg(`Vehicle ${vId} marked as serviced. Next maintenance log scheduled at +5,000 KM.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleRenewInsurance = (vId) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vId) {
        return { ...v, insurance: 'ACTIVE' };
      }
      return v;
    }));
    setSuccessMsg(`Insurance certification renewed for ${vId} via URA e-portal.`);
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
            <span style={styles.officerRole}>FLEET OVERWATCH</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab('fleet')}
            style={{ ...styles.navItem, ...(activeTab === 'fleet' ? styles.activeNavItem : {}) }}
          >
            <Compass size={16} />
            <span>Active Fleet ({vehicles.length})</span>
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

        {/* FLEET TAB */}
        {activeTab === 'fleet' && (
          <div>
            <h3 style={styles.nodeTitle}>UGANDAN CARRIER FLEET LOGS</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Overwatch of all armored vans, bulk cargo trucks, and high-speed dispatch motorcycles.
            </p>

            {/* KPI grid */}
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>34</span>
                <span style={styles.kpiLbl}>Cargo Trucks</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>52</span>
                <span style={styles.kpiLbl}>Motorcycles</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>71</span>
                <span style={styles.kpiLbl}>Active Units</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>8</span>
                <span style={styles.kpiLbl}>In Maintenance</span>
              </div>
            </div>

            {/* Vehicle Cards Grid */}
            <div style={styles.vehicleGrid}>
              {vehicles.map(v => (
                <div key={v.id} className="card" style={styles.vehicleCard}>
                  <div style={styles.cardHeader}>
                    <div>
                      <span style={styles.vehicleId}>{v.id}</span>
                      <h4 style={styles.vehicleType}>{v.type}</h4>
                    </div>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: v.status === 'Active' ? 'rgba(5,150,105,0.06)' : v.status === 'Maintenance' ? 'rgba(250,204,21,0.06)' : 'rgba(220,38,38,0.06)',
                      color: v.status === 'Active' ? 'var(--success)' : v.status === 'Maintenance' ? 'var(--accent)' : 'var(--danger)',
                      borderColor: v.status === 'Active' ? 'rgba(5,150,105,0.15)' : v.status === 'Maintenance' ? 'rgba(250,204,21,0.15)' : 'rgba(220,38,38,0.15)'
                    }}>{v.status}</span>
                  </div>

                  <div style={styles.specBox}>
                    <div style={styles.specRow}>
                      <span style={styles.specLbl}>Active Driver:</span>
                      <strong>{v.driver}</strong>
                    </div>
                    <div style={styles.specRow} style={{ marginTop: '6px' }}>
                      <span style={styles.specLbl}>Fuel Level:</span>
                      <strong>{v.fuel}%</strong>
                    </div>
                    <div style={styles.specRow} style={{ marginTop: '6px' }}>
                      <span style={styles.specLbl}>Total Mileage:</span>
                      <strong>{v.mileage.toLocaleString()} KM</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Insurance status:</span>
                      <strong style={{ color: v.insurance === 'ACTIVE' ? 'var(--success)' : 'var(--danger)' }}>{v.insurance}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Next service:</span>
                      <strong style={{ color: v.serviceDue <= 500 ? 'var(--danger)' : 'var(--text-primary)' }}>
                        {v.serviceDue === 0 ? 'SERVICE EXPIRED' : `Due in ${v.serviceDue} KM`}
                      </strong>
                    </div>
                  </div>

                  <div style={styles.btnRow}>
                    {v.serviceDue <= 500 && (
                      <button 
                        onClick={() => handleTriggerService(v.id)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '11px', flex: 1 }}
                      >
                        <span>Perform Service</span>
                      </button>
                    )}
                    {v.insurance === 'EXPIRED' && (
                      <button 
                        onClick={() => handleRenewInsurance(v.id)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '11px', flex: 1 }}
                      >
                        <span>Renew Insurance</span>
                      </button>
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
  vehicleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '24px'
  },
  vehicleCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  vehicleId: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--text-muted)'
  },
  vehicleType: {
    fontSize: '14.5px',
    fontWeight: '800',
    margin: '2px 0 0 0'
  },
  statusBadge: {
    fontSize: '9px',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid'
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
  specLbl: {
    color: 'var(--text-muted)'
  },
  btnRow: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '8px'
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
