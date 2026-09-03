import React, { useState } from 'react';
import { 
  ShieldAlert, Activity, Sliders, Database, Key, Wifi, Globe, 
  Terminal, ShieldCheck, RefreshCw, CheckCircle2, UserCheck, Settings
} from 'lucide-react';
import SettingsNode from './SettingsNode';

export default function AdminDashboard({ 
  user, 
  orders, 
  reports, 
  shops, 
  onUserUpdate, 
  onUpdateOrderStatus,
  activeSubNode,
  setActiveSubNode
}) {
  const [localActiveNode, setLocalActiveNode] = useState('roles');
  const activeNode = activeSubNode || localActiveNode;
  const setActiveNode = (node) => {
    if (setActiveSubNode) setActiveSubNode(node);
    setLocalActiveNode(node);
  };
  const [successMsg, setSuccessMsg] = useState('');
  
  // 1. User Management (Stateful mock accounts)
  const [accounts, setAccounts] = useState([
    { name: 'Senteza Ronald', email: 'client@flashpoint.co.ug', role: 'client', clearance: 'Standard Access' },
    { name: 'Sgt. Okello Emmanuel', email: 'officer@flashpoint.co.ug', role: 'handler', clearance: 'Tier 3 Vetted' },
    { name: 'Director Mukasa', email: 'ceo@flashpoint.co.ug', role: 'ceo', clearance: 'Full Executive' },
    { name: 'Acacia Tech Hub', email: 'merchant@flashpoint.co.ug', role: 'seller', clearance: 'Merchant Access' },
    { name: 'Namayanja Juliet', email: 'hr@flashpoint.co.ug', role: 'hr', clearance: 'Personnel Admin' },
    { name: 'SuperAdmin Kigozi', email: 'admin@flashpoint.co.ug', role: 'admin', clearance: 'Root Overwatch' }
  ]);

  // 2. Mock Audit Ledger
  const [auditLogs, setAuditLogs] = useState([
    { id: 'LOG-8821', time: '21:30:15', category: 'SECURITY', action: 'AES-256 encryption handshake verified on Nakasero Node.', user: 'SYSTEM' },
    { id: 'LOG-8819', time: '21:12:44', category: 'ACCESS', action: 'Secure credential token authorized for Sgt. Okello Emmanuel.', user: 'Gateway Auth' },
    { id: 'LOG-8815', time: '20:45:00', category: 'CARGO', action: 'Cargo status for FP-9031 overridden to IN_TRANSIT stage.', user: 'SuperAdmin Kigozi' },
    { id: 'LOG-8810', time: '19:33:12', category: 'OVERRIDE', action: 'Emergency beacon override initiated on tactical channel 4.', user: 'Director Mukasa' },
    { id: 'LOG-8805', time: '18:10:02', category: 'MERCHANT', action: 'New storefront verification check passed for Acacia Tech Hub.', user: 'Juliet Namayanja' },
    { id: 'LOG-8801', time: '17:05:44', category: 'SYSTEM', action: 'Kampala base station telemetry ping succeeded. Latency 12ms.', user: 'SYSTEM' }
  ]);

  // 3. Emergency Overrides State
  const [selectedOrderId, setSelectedOrderId] = useState(orders.length > 0 ? orders[0].id : '');
  const [overrideStatus, setOverrideStatus] = useState('in_transit');

  // 4. System Telemetry State
  const [telemetry, setTelemetry] = useState({
    apiStatus: 'Operational',
    apiLatency: '14ms',
    gpsSatellites: 18,
    radioEncryption: 'AES-256 Enabled',
    serverNode: 'Kampala Central (Nakasero)',
    systemLoad: '12.4%'
  });

  const triggerNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Modify User Role on the fly
  const handleRoleChange = (email, newRole) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.email === email) {
        // Map clearance description based on role
        let clearance = 'Standard Access';
        if (newRole === 'ceo') clearance = 'Full Executive';
        if (newRole === 'handler') clearance = 'Tier 3 Vetted';
        if (newRole === 'seller') clearance = 'Merchant Access';
        if (newRole === 'hr') clearance = 'Personnel Admin';
        if (newRole === 'admin') clearance = 'Root Overwatch';
        
        const updated = { ...acc, role: newRole, clearance };
        
        // If this is the currently logged-in user, propagate changes to shell
        if (email === user.email) {
          onUserUpdate({
            ...user,
            role: newRole
          });
        }
        
        return updated;
      }
      return acc;
    }));

    // Add Audit Log
    const newLog = {
      id: `LOG-${Math.floor(8000 + Math.random() * 900)}`,
      time: new Date().toTimeString().split(' ')[0],
      category: 'ACCESS',
      action: `User role for "${email}" elevated/modified to role: [${newRole.toUpperCase()}].`,
      user: user.name
    };
    setAuditLogs(prev => [newLog, ...prev]);

    triggerNotification(`Account ${email} updated successfully to role ${newRole.toUpperCase()}.`);
  };

  // Submit Emergency Override
  const handleOverrideSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrderId) {
      alert("Please select a cargo order ID first.");
      return;
    }

    onUpdateOrderStatus(selectedOrderId, overrideStatus);

    // Add Audit Log
    const newLog = {
      id: `LOG-${Math.floor(8000 + Math.random() * 900)}`,
      time: new Date().toTimeString().split(' ')[0],
      category: 'OVERRIDE',
      action: `Emergency override performed on cargo ID ${selectedOrderId}. Stage forced to: [${overrideStatus.toUpperCase()}].`,
      user: user.name
    };
    setAuditLogs(prev => [newLog, ...prev]);

    triggerNotification(`Emergency Override complete: Cargo ${selectedOrderId} stage overridden to ${overrideStatus.replace(/_/g, ' ').toUpperCase()}.`);
  };

  // Refresh Telemetry simulation
  const handleRefreshTelemetry = () => {
    setTelemetry({
      apiStatus: 'Operational',
      apiLatency: `${Math.floor(8 + Math.random() * 15)}ms`,
      gpsSatellites: Math.floor(12 + Math.random() * 10),
      radioEncryption: 'AES-256 Secured',
      serverNode: 'Kampala Central (Nakasero)',
      systemLoad: `${(5 + Math.random() * 15).toFixed(1)}%`
    });
    triggerNotification('System diagnostics and satellite locks refreshed.');
  };

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox} className="dashboard-sidebar-badge">
          <div style={styles.avatarBadge}>
            <Sliders size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>ROOT ADMINISTRATOR</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav} className="dashboard-sidebar-nav">
          <button 
            onClick={() => setActiveNode('roles')}
            style={{ ...styles.navItem, ...(activeNode === 'roles' ? styles.activeNavItem : {}) }}
          >
            <UserCheck size={16} />
            <span>Role Controller</span>
          </button>

          <button 
            onClick={() => setActiveNode('audit')}
            style={{ ...styles.navItem, ...(activeNode === 'audit' ? styles.activeNavItem : {}) }}
          >
            <Terminal size={16} />
            <span>Audit Ledger ({auditLogs.length})</span>
          </button>

          <button 
            onClick={() => setActiveNode('telemetry')}
            style={{ ...styles.navItem, ...(activeNode === 'telemetry' ? styles.activeNavItem : {}) }}
          >
            <Activity size={16} />
            <span>Telemetry Overwatch</span>
          </button>

          <button 
            onClick={() => setActiveNode('override')}
            style={{ ...styles.navItem, ...(activeNode === 'override' ? styles.activeNavItem : {}) }}
          >
            <ShieldAlert size={16} />
            <span>Emergency Override</span>
          </button>

          <button 
            onClick={() => setActiveNode('settings')}
            style={{ ...styles.navItem, ...(activeNode === 'settings' ? styles.activeNavItem : {}) }}
          >
            <Settings size={16} />
            <span>Admin Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent} className="dashboard-content-area">
        
        {successMsg && (
          <div style={styles.successBanner} className="slide-up">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Node 1: User Role Manager */}
        {activeNode === 'roles' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>USER SECURITY ROLES & CLEARANCES</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Promote or demote users to configure testing profiles. Swapping the role of your active logged-in profile updates your current console immediately.
            </p>

            <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.tableTh}>Name</th>
                    <th style={styles.tableTh}>Email Profile</th>
                    <th style={styles.tableTh}>Clearance Level</th>
                    <th style={styles.tableTh}>Security Role (Swapper)</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc, index) => (
                    <tr key={index} style={styles.tableBodyRow}>
                      <td style={styles.tableTd}><strong>{acc.name}</strong></td>
                      <td style={styles.tableTd}>{acc.email}</td>
                      <td style={styles.tableTd}>
                        <span style={styles.clearanceLabel}>{acc.clearance}</span>
                      </td>
                      <td style={styles.tableTd}>
                        <select 
                          value={acc.role} 
                          onChange={(e) => handleRoleChange(acc.email, e.target.value)}
                          style={styles.selectSwapper}
                        >
                          <option value="client">Client Portal</option>
                          <option value="seller">Seller Hub</option>
                          <option value="handler">Handler Dashboard</option>
                          <option value="hr">HR Dashboard</option>
                          <option value="ceo">CEO Console</option>
                          <option value="admin">Admin Dashboard</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Node 2: System Audit Ledger */}
        {activeNode === 'audit' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>SYSTEM SECURITY & ACCESS AUDIT LEDGER</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Tamper-proof logs detailing security override events, role promotions, GPS tracking seals, and executive broadcast signals.
            </p>

            <div className="card" style={styles.logListCard}>
              <div style={styles.logList}>
                {auditLogs.map(log => (
                  <div key={log.id} style={styles.logItem}>
                    <div style={styles.logMeta}>
                      <span style={{
                        ...styles.logCategory,
                        color: log.category === 'SECURITY' || log.category === 'OVERRIDE' ? 'var(--danger)' : 'var(--accent)',
                        backgroundColor: log.category === 'SECURITY' || log.category === 'OVERRIDE' ? 'rgba(220,38,38,0.06)' : 'rgba(250,204,21,0.06)',
                        borderColor: log.category === 'SECURITY' || log.category === 'OVERRIDE' ? 'rgba(220,38,38,0.15)' : 'rgba(250,204,21,0.15)'
                      }}>
                        {log.category}
                      </span>
                      <span style={styles.logTime}>{log.time}</span>
                    </div>
                    <p style={styles.logAction}>{log.action}</p>
                    <span style={styles.logOperator}>Operator: <strong>{log.user}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Node 3: System Telemetry */}
        {activeNode === 'telemetry' && (
          <div className="slide-up">
            <div style={styles.telemetryHeader}>
              <h3 style={styles.nodeTitle}>UGANDAN NETWORK TELEMETRY & GATEWAYS</h3>
              <button 
                onClick={handleRefreshTelemetry}
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                <RefreshCw size={12} />
                <span>Diagnostics Refresh</span>
              </button>
            </div>

            <div style={styles.statsGrid}>
              <div className="card" style={styles.statCard}>
                <Wifi size={24} color="var(--success)" />
                <span style={styles.statLabel}>Kampala Radio Link</span>
                <span style={styles.statValue}>{telemetry.apiStatus}</span>
                <span style={styles.statSub}>Channel Latency: {telemetry.apiLatency}</span>
              </div>

              <div className="card" style={styles.statCard}>
                <Globe size={24} color="var(--accent)" />
                <span style={styles.statLabel}>GPS Escort Satellites</span>
                <span style={styles.statValue}>{telemetry.gpsSatellites} Locked</span>
                <span style={styles.statSub}>Vetting active tracking</span>
              </div>

              <div className="card" style={styles.statCard}>
                <Key size={24} color="var(--accent)" />
                <span style={styles.statLabel}>Encryption Module</span>
                <span style={styles.statValue}>{telemetry.radioEncryption}</span>
                <span style={styles.statSub}>Radio signals: Encrypted</span>
              </div>

              <div className="card" style={styles.statCard}>
                <Database size={24} color="var(--accent)" />
                <span style={styles.statLabel}>System Overwatch Load</span>
                <span style={styles.statValue}>{telemetry.systemLoad}</span>
                <span style={styles.statSub}>Nodes load within threshold</span>
              </div>
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
              <h4 style={{ marginBottom: '16px' }}>NETWORK VITAL CHANNELS</h4>
              <div style={styles.channelStatusList}>
                <div style={styles.channelItem}>
                  <span>Secure Radio Band (142.85 MHz)</span>
                  <span style={styles.channelBadgeActive}>Active</span>
                </div>
                <div style={styles.channelItem}>
                  <span>Armored Escort Radio Beacon (Nakasero Tower)</span>
                  <span style={styles.channelBadgeActive}>Active</span>
                </div>
                <div style={styles.channelItem}>
                  <span>SMS API Gateway (Uganda Telecom Node)</span>
                  <span style={styles.channelBadgeActive}>Active</span>
                </div>
                <div style={styles.channelItem}>
                  <span>WhatsApp Callback API (Backup Radio Channel)</span>
                  <span style={styles.channelBadgeWarning}>Idle</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Node 4: Emergency Overrides */}
        {activeNode === 'override' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>EMERGENCY PROTOCOL STAGE OVERRIDES</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Override the status stage of active secure cargoes. Required if courier radio antennas are deactivated in rural divisions.
            </p>

            <div className="card" style={{ maxWidth: '600px', padding: '28px' }}>
              <form onSubmit={handleOverrideSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Cargo Order Ref</label>
                  <select 
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="form-input"
                  >
                    <option value="" disabled>-- Select Cargo ID --</option>
                    {orders.map(order => (
                      <option key={order.id} value={order.id}>
                        {order.id} (Route: {order.pickup.name.split(' (')[0]} → {order.delivery.name.split(' (')[0]}) - Current Status: {order.status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Force Target Delivery Stage</label>
                  <div style={styles.overrideStageGroup}>
                    {['pending', 'secured', 'in_transit', 'out_for_delivery', 'delivered'].map(stage => (
                      <label key={stage} style={{
                        ...styles.overrideRadioLabel,
                        borderColor: overrideStatus === stage ? 'var(--accent)' : 'var(--border)',
                        backgroundColor: overrideStatus === stage ? 'rgba(250,204,21,0.06)' : 'transparent'
                      }}>
                        <input 
                          type="radio" 
                          name="override_stage"
                          value={stage}
                          checked={overrideStatus === stage}
                          onChange={(e) => setOverrideStatus(e.target.value)}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: '700' }}>
                          {stage.replace(/_/g, ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', width: '100%', marginTop: '10px' }}>
                  <ShieldCheck size={16} color="#000000" />
                  <span>Execute Emergency Override</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Node 5: Settings */}
        {activeNode === 'settings' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>ADMIN ACCOUNT SETTINGS</h3>
            <SettingsNode user={user} onUserUpdate={onUserUpdate} />
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
    ':hover': {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-primary)'
    }
  },
  activeNavItem: {
    backgroundColor: '#facc15',
    color: '#000000',
    ':hover': {
      backgroundColor: '#eab308',
      color: '#000000'
    }
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
    backgroundColor: '#ffffff',
    ':hover': {
      backgroundColor: 'rgba(0,0,0,0.01)'
    }
  },
  clearanceLabel: {
    fontSize: '11.5px',
    fontWeight: '700',
    color: 'var(--text-secondary)'
  },
  selectSwapper: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    fontSize: '12.5px',
    outline: 'none',
    backgroundColor: 'var(--bg-primary)',
    fontWeight: '700',
    transition: 'all 0.2s ease',
    ':focus': {
      borderColor: 'var(--accent)'
    }
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
  logListCard: {
    padding: '20px'
  },
  logList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  logItem: {
    borderBottom: '1px solid var(--border)',
    paddingBottom: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    ':last-child': {
      borderBottom: 'none',
      paddingBottom: 0
    }
  },
  logMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logCategory: {
    fontSize: '9px',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid'
  },
  logTime: {
    fontSize: '11px',
    color: 'var(--text-muted)'
  },
  logAction: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  logOperator: {
    fontSize: '11px',
    color: 'var(--text-muted)'
  },
  telemetryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
  },
  statCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  statSub: {
    fontSize: '10.5px',
    color: 'var(--text-muted)',
    marginTop: '4px'
  },
  channelStatusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  channelItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--border)',
    ':last-child': {
      borderBottom: 'none',
      paddingBottom: 0
    }
  },
  channelBadgeActive: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--success)',
    backgroundColor: 'rgba(5,150,105,0.08)',
    border: '1px solid rgba(5,150,105,0.2)',
    padding: '2px 8px',
    borderRadius: '20px'
  },
  channelBadgeWarning: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    backgroundColor: 'rgba(113,113,122,0.08)',
    border: '1px solid var(--border)',
    padding: '2px 8px',
    borderRadius: '20px'
  },
  overrideStageGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px'
  },
  overrideRadioLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    border: '1px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};
