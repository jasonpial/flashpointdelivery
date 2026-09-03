import React, { useState } from 'react';
import { Truck, Users, ShieldAlert, Check, MapPin, Radio, Activity, Navigation } from 'lucide-react';

export default function OperationsDashboard({ user, orders, onUpdateOrderStatus }) {
  const [activeTab, setActiveTab] = useState('control');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Local list of handlers
  const [handlers] = useState([
    { name: 'Corporal Mubiru Moses', status: 'Available', vehicle: 'FP-VAN-002' },
    { name: 'Nsubuga Henry', status: 'Available', vehicle: 'FP-TRUCK-004' },
    { name: 'Kyobe Arthur', status: 'On Assignment', vehicle: 'FP-BIKE-08' },
    { name: 'Sgt. Okello Emmanuel', status: 'Available', vehicle: 'FP-ESCORT-01' }
  ]);

  // Local list of vehicles
  const [vehicles] = useState([
    { id: 'FP-TRUCK-004', type: 'Armored Truck', status: 'Available' },
    { id: 'FP-VAN-002', type: 'Shielded Van', status: 'Available' },
    { id: 'FP-BIKE-08', type: 'Courier Motorcycle', status: 'In Use' },
    { id: 'FP-ESCORT-01', type: 'Tactical Escort SUV', status: 'Available' }
  ]);

  // Unassigned shipments list
  const [unassignedList, setUnassignedList] = useState([
    { id: 'FP-UG-19302', pickup: 'Kampala', destination: 'Jinja', cargo: 'Valuable Electronics', weight: '85 KG', urgency: 'CRITICAL' },
    { id: 'FP-UG-19305', pickup: 'Entebbe Vault', destination: 'Nakasero Base', cargo: 'Gold Bullion', weight: '120 KG', urgency: 'TACTICAL' }
  ]);

  const [assignments, setAssignments] = useState([]);

  const handleAssign = (shipmentId, handlerName, vehicleId) => {
    setAssignments(prev => [
      ...prev,
      { id: shipmentId, handler: handlerName, vehicle: vehicleId, timestamp: new Date().toLocaleTimeString() }
    ]);
    setUnassignedList(prev => prev.filter(s => s.id !== shipmentId));
    setSuccessMsg(`Shipment ${shipmentId} assigned successfully to ${handlerName} with ${vehicleId}.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox}>
          <div style={styles.avatarBadge}>
            <Radio size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>DISPATCH COMMAND</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab('control')}
            style={{ ...styles.navItem, ...(activeTab === 'control' ? styles.activeNavItem : {}) }}
          >
            <Activity size={16} />
            <span>Operations Control</span>
          </button>
          <button 
            onClick={() => setActiveTab('assign')}
            style={{ ...styles.navItem, ...(activeTab === 'assign' ? styles.activeNavItem : {}) }}
          >
            <Navigation size={16} />
            <span>Assignment Desk ({unassignedList.length})</span>
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

        {/* OPERATIONS CONTROL TAB */}
        {activeTab === 'control' && (
          <div>
            <h3 style={styles.nodeTitle}>FLASHPOINT CENTRAL DISPATCH SYSTEM</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Real-time dispatch management of active armored carriers and courier riders across Ugandan branches.
            </p>

            {/* KPI grid */}
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>84</span>
                <span style={styles.kpiLbl}>Active Shipments</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>21</span>
                <span style={styles.kpiLbl}>Pickups Pending</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>43</span>
                <span style={styles.kpiLbl}>In Transit</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiVal}>97</span>
                <span style={styles.kpiLbl}>Delivered Today</span>
              </div>
            </div>

            {/* Map and details split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginTop: '24px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ marginBottom: '14px', fontSize: '14px' }}>ACTIVE LIVE MONITORING TRACK</h4>
                <div style={styles.fakeMap}>
                  <div style={{ position: 'absolute', top: '20px', left: '40px', textAlign: 'center' }}>
                    <MapPin size={20} color="var(--accent)" />
                    <span style={{ fontSize: '9px', fontWeight: '800', display: 'block', color: '#ffffff' }}>KAMPALA HQ</span>
                  </div>
                  <div style={{ position: 'absolute', top: '70px', left: '160px', textAlign: 'center' }}>
                    <Truck size={24} color="#facc15" className="pulse-glow-effect" />
                    <span style={{ fontSize: '9px', color: '#facc15', fontWeight: '800', display: 'block' }}>FP-VAN-002 (In Transit)</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '30px', right: '50px', textAlign: 'center' }}>
                    <MapPin size={20} color="var(--accent)" />
                    <span style={{ fontSize: '9px', fontWeight: '800', display: 'block', color: '#ffffff' }}>ENTEBBE DEPOT</span>
                  </div>
                </div>
              </div>

              {/* Handlers Status list */}
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ marginBottom: '14px', fontSize: '14px' }}>COURIER/HANDLER AVAILABILITY</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {handlers.map((h, i) => (
                    <div key={i} style={styles.statusRow}>
                      <div>
                        <strong>{h.name}</strong>
                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>Assigned: {h.vehicle}</span>
                      </div>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: h.status === 'Available' ? 'rgba(5,150,105,0.08)' : 'rgba(250,204,21,0.08)',
                        color: h.status === 'Available' ? 'var(--success)' : 'var(--accent)'
                      }}>{h.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASSIGNMENT TAB */}
        {activeTab === 'assign' && (
          <div>
            <h3 style={styles.nodeTitle}>UNASSIGNED DISPATCH LIST</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Assign authorized guards and transport vehicles to secure newly generated client requests.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {unassignedList.map(s => (
                <div key={s.id} className="card" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', alignItems: 'center', gap: '20px' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)' }}>{s.id}</span>
                    <h4 style={{ margin: '4px 0', fontSize: '15px' }}>{s.cargo} ({s.weight})</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Route: {s.pickup} → {s.destination}</span>
                  </div>

                  <div>
                    <label style={styles.fieldLabel}>Select Handler</label>
                    <select id={`handler-select-${s.id}`} style={styles.select}>
                      {handlers.filter(h => h.status === 'Available').map((h, idx) => (
                        <option key={idx} value={h.name}>{h.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={styles.fieldLabel}>Select Vehicle</label>
                    <select id={`vehicle-select-${s.id}`} style={styles.select}>
                      {vehicles.filter(v => v.status === 'Available').map((v, idx) => (
                        <option key={idx} value={v.id}>{v.id} ({v.type})</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    onClick={() => {
                      const hVal = document.getElementById(`handler-select-${s.id}`).value;
                      const vVal = document.getElementById(`vehicle-select-${s.id}`).value;
                      handleAssign(s.id, hVal, vVal);
                    }}
                    className="btn btn-primary"
                    style={{ padding: '10px 16px', fontSize: '12px' }}
                  >
                    <span>Assign Transit</span>
                  </button>
                </div>
              ))}

              {unassignedList.length === 0 && (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                  <Check size={36} color="var(--success)" style={{ marginBottom: '12px' }} />
                  <h4>All shipment dispatches are successfully assigned to active units.</h4>
                </div>
              )}
            </div>

            {assignments.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h4 style={{ marginBottom: '14px', fontSize: '14px' }}>RECENT DISPATCH HANDSHAKES</h4>
                <div className="card" style={{ padding: 0 }}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeadRow}>
                        <th style={styles.tableTh}>Shipment ID</th>
                        <th style={styles.tableTh}>Assigned Handler</th>
                        <th style={styles.tableTh}>Assigned Vehicle</th>
                        <th style={styles.tableTh}>Timestamp</th>
                        <th style={styles.tableTh}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((a, i) => (
                        <tr key={i} style={styles.tableBodyRow}>
                          <td style={styles.tableTd}><strong>{a.id}</strong></td>
                          <td style={styles.tableTd}>{a.handler}</td>
                          <td style={styles.tableTd}>{a.vehicle}</td>
                          <td style={styles.tableTd}>{a.timestamp}</td>
                          <td style={styles.tableTd}>
                            <span style={styles.activeTag}>IN TRANSIT</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
  fakeMap: {
    width: '100%',
    height: '240px',
    backgroundColor: '#1e293b',
    borderRadius: '8px',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'radial-gradient(circle, #334155 10%, transparent 11%)',
    backgroundSize: '20px 20px'
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    borderBottom: '1px solid var(--border)'
  },
  statusBadge: {
    fontSize: '9.5px',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  fieldLabel: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px'
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    fontSize: '12px',
    backgroundColor: '#ffffff',
    outline: 'none'
  },
  activeTag: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--accent)',
    backgroundColor: 'rgba(250,204,21,0.06)',
    border: '1px solid rgba(250,204,21,0.15)',
    padding: '2px 6px',
    borderRadius: '4px'
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
  }
};
