import React, { useState } from 'react';
import { 
  Users, ShieldCheck, Briefcase, DollarSign, Settings, 
  Search, Check, X, Award, CheckCircle2, Phone, ShieldAlert
} from 'lucide-react';
import SettingsNode from './SettingsNode';

export default function HRDashboard({ user, orders, reports, onUserUpdate }) {
  const [activeNode, setActiveNode] = useState('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Personnel Data (Stateful so hiring adds to it)
  const [personnel, setPersonnel] = useState([
    { id: 'FP-STAFF-01', name: 'Sgt. Okello Emmanuel', role: 'Armed Escort', clearance: 'Tier 3 - Armed Guard', status: 'In Transit', phone: '+256 788 123 456' },
    { id: 'FP-STAFF-02', name: 'Lt. Grace Nabakooza', role: 'Armored Driver', clearance: 'Tier 3 - Armed Guard', status: 'Secured Vault', phone: '+256 771 909 888' },
    { id: 'FP-STAFF-03', name: 'Corporal Mubiru Moses', role: 'Secured Agent', clearance: 'Tier 2 - Shielded', status: 'Off-Duty', phone: '+256 701 443 221' },
    { id: 'FP-STAFF-04', name: 'Nsubuga Henry', role: 'Standard Courier Rider', clearance: 'Tier 1 - Standard', status: 'Active Dispatch', phone: '+256 752 989 776' },
    { id: 'FP-STAFF-05', name: 'Kyobe Arthur', role: 'Secured Agent', clearance: 'Tier 2 - Shielded', status: 'In Transit', phone: '+256 782 555 666' }
  ]);

  // 2. Security Vetting Requests
  const [vettingRequests, setVettingRequests] = useState([
    { id: 'VET-102', name: 'Corporal Mubiru Moses', currentClearance: 'Tier 2 - Shielded', requestedClearance: 'Tier 3 - Armed Guard', reason: 'Completed tactical armored vehicle simulation course.' },
    { id: 'VET-105', name: 'Nsubuga Henry', currentClearance: 'Tier 1 - Standard', requestedClearance: 'Tier 2 - Shielded', reason: '6 months active dispatch records with zero incident reports.' }
  ]);

  // 3. Recruitment Pipeline Applications
  const [applications, setApplications] = useState([
    { id: 'APP-801', name: 'Nassolo Fiona', position: 'Tactical Escort Guard', background: 'Military Police (UPDF) - 4 years', weaponsClear: 'Handgun/Rifle Certified', zone: 'Kampala Central division' },
    { id: 'APP-804', name: 'Ssebatindira Ivan', position: 'Secured Agent Rider', background: 'VIP Security Escort - 2 years', weaponsClear: 'Taser Certified', zone: 'Wakiso District' }
  ]);

  // 4. Payroll and High-Risk Surcharge Bonuses
  const [payroll, setPayroll] = useState([
    { name: 'Sgt. Okello Emmanuel', baseWage: 850000, escortsCompleted: 8, pendingBonus: 360000, status: 'Unpaid' },
    { name: 'Lt. Grace Nabakooza', baseWage: 950000, escortsCompleted: 12, pendingBonus: 540000, status: 'Unpaid' },
    { name: 'Corporal Mubiru Moses', baseWage: 700000, escortsCompleted: 4, pendingBonus: 100000, status: 'Unpaid' },
    { name: 'Kyobe Arthur', baseWage: 700000, escortsCompleted: 6, pendingBonus: 150000, status: 'Unpaid' }
  ]);

  // Search filtered personnel
  const filteredPersonnel = personnel.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.clearance.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Vetting Actions
  const handleVettingApproval = (requestId, name, newClearance) => {
    // Upgrade personnel record
    setPersonnel(prev => prev.map(p => {
      if (p.name === name) {
        return { ...p, clearance: newClearance, role: newClearance.includes('Tier 3') ? 'Armed Escort' : 'Secured Agent' };
      }
      return p;
    }));
    // Remove request
    setVettingRequests(prev => prev.filter(r => r.id !== requestId));
    triggerNotification(`Clearance request for ${name} APPROVED. Clearance tier elevated.`);
  };

  const handleVettingReject = (requestId, name) => {
    setVettingRequests(prev => prev.filter(r => r.id !== requestId));
    triggerNotification(`Clearance request for ${name} REJECTED.`);
  };

  // Hiring Actions
  const handleHireApplicant = (appId, name, position) => {
    const newId = `FP-STAFF-${Math.floor(10 + Math.random() * 90)}`;
    const newStaff = {
      id: newId,
      name: name,
      role: position,
      clearance: position.includes('Tactical') ? 'Tier 3 - Armed Guard' : 'Tier 2 - Shielded',
      status: 'Off-Duty',
      phone: '+256 77' + Math.floor(1000000 + Math.random() * 9000000)
    };

    setPersonnel(prev => [...prev, newStaff]);
    setApplications(prev => prev.filter(a => a.id !== appId));
    
    // Add to payroll as well
    setPayroll(prev => [
      ...prev,
      { name: name, baseWage: position.includes('Tactical') ? 850000 : 700000, escortsCompleted: 0, pendingBonus: 0, status: 'Unpaid' }
    ]);

    triggerNotification(`Applicant ${name} successfully HIRED. Staff record initialized under ID ${newId}.`);
  };

  const handleRejectApplicant = (appId, name) => {
    setApplications(prev => prev.filter(a => a.id !== appId));
    triggerNotification(`Application for ${name} rejected and archived.`);
  };

  // Payroll Actions
  const handleDisburseBonus = (name) => {
    setPayroll(prev => prev.map(p => {
      if (p.name === name) {
        return { ...p, pendingBonus: 0, status: 'Paid (Bonus Cleared)' };
      }
      return p;
    }));
    triggerNotification(`Disbursed high-risk security escorts bonus to ${name}. Bank ledger updated.`);
  };

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox} className="dashboard-sidebar-badge">
          <div style={styles.avatarBadge}>
            <Briefcase size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>HUMAN RESOURCES</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav} className="dashboard-sidebar-nav">
          <button 
            onClick={() => setActiveNode('directory')}
            style={{ ...styles.navItem, ...(activeNode === 'directory' ? styles.activeNavItem : {}) }}
          >
            <Users size={16} />
            <span>Personnel Directory ({personnel.length})</span>
          </button>

          <button 
            onClick={() => setActiveNode('vetting')}
            style={{ ...styles.navItem, ...(activeNode === 'vetting' ? styles.activeNavItem : {}) }}
          >
            <ShieldCheck size={16} />
            <span>Clearance Vetting ({vettingRequests.length})</span>
          </button>

          <button 
            onClick={() => setActiveNode('recruitment')}
            style={{ ...styles.navItem, ...(activeNode === 'recruitment' ? styles.activeNavItem : {}) }}
          >
            <Briefcase size={16} />
            <span>Recruitment Pipeline ({applications.length})</span>
          </button>

          <button 
            onClick={() => setActiveNode('payroll')}
            style={{ ...styles.navItem, ...(activeNode === 'payroll' ? styles.activeNavItem : {}) }}
          >
            <DollarSign size={16} />
            <span>Payroll & Incentives</span>
          </button>

          <button 
            onClick={() => setActiveNode('settings')}
            style={{ ...styles.navItem, ...(activeNode === 'settings' ? styles.activeNavItem : {}) }}
          >
            <Settings size={16} />
            <span>HR Settings</span>
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

        {/* Node 1: Directory */}
        {activeNode === 'directory' && (
          <div className="slide-up">
            <div style={styles.nodeHeader}>
              <h3 style={styles.nodeTitle}>UGANDAN SECURITY PERSONNEL DIRECTORY</h3>
              <div style={styles.searchWrapper}>
                <Search size={16} color="var(--text-muted)" style={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search staff, role or clearance tier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
            </div>

            <div className="card" style={{ overflowX: 'auto', padding: 0, marginTop: '20px' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.tableTh}>ID</th>
                    <th style={styles.tableTh}>Name</th>
                    <th style={styles.tableTh}>Assigned Role</th>
                    <th style={styles.tableTh}>Clearance Level</th>
                    <th style={styles.tableTh}>Duty Status</th>
                    <th style={styles.tableTh}>Contact Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPersonnel.map(p => (
                    <tr key={p.id} style={styles.tableBodyRow}>
                      <td style={styles.tableTd}><strong>{p.id}</strong></td>
                      <td style={styles.tableTd}>
                        <div style={styles.personnelNameCell}>
                          <div style={styles.avatarMini}>{p.name.charAt(0)}</div>
                          <strong>{p.name}</strong>
                        </div>
                      </td>
                      <td style={styles.tableTd}>{p.role}</td>
                      <td style={styles.tableTd}>
                        <span style={{
                          ...styles.clearanceBadge,
                          color: p.clearance.includes('Tier 3') ? 'var(--danger)' : p.clearance.includes('Tier 2') ? 'var(--accent)' : 'var(--text-secondary)',
                          backgroundColor: p.clearance.includes('Tier 3') ? 'rgba(220,38,38,0.06)' : p.clearance.includes('Tier 2') ? 'rgba(202,138,4,0.06)' : 'rgba(113,113,122,0.06)',
                          borderColor: p.clearance.includes('Tier 3') ? 'rgba(220,38,38,0.15)' : p.clearance.includes('Tier 2') ? 'rgba(202,138,4,0.15)' : 'rgba(113,113,122,0.15)'
                        }}>
                          {p.clearance}
                        </span>
                      </td>
                      <td style={styles.tableTd}>
                        <span style={{
                          ...styles.statusTag,
                          color: p.status === 'Off-Duty' ? 'var(--text-muted)' : 'var(--success)',
                          backgroundColor: p.status === 'Off-Duty' ? 'rgba(113,113,122,0.08)' : 'rgba(5,150,105,0.08)',
                          borderColor: p.status === 'Off-Duty' ? 'var(--border)' : 'rgba(5,150,105,0.2)'
                        }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={styles.tableTd}>
                        <span style={styles.phoneLink}>
                          <Phone size={11} />
                          <span>{p.phone}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredPersonnel.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No personnel matching search filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Node 2: Security Vetting */}
        {activeNode === 'vetting' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>SECURITY VETTING & CLEARANCE UPGRADE REQUESTS</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Vetting requests submitted by tactical couriers and riders. Elevating clearance enables dispatch routing on higher risk armored transits.
            </p>

            <div style={styles.requestGrid}>
              {vettingRequests.map(req => (
                <div key={req.id} className="card" style={styles.vetCard}>
                  <div style={styles.vetHeader}>
                    <div>
                      <span style={styles.vetId}>{req.id}</span>
                      <h4 style={styles.vetName}>{req.name}</h4>
                    </div>
                    <span style={styles.vetStatusBadge}>Pending Vetting</span>
                  </div>

                  <div style={styles.vetFlowRow}>
                    <div style={styles.vetFlowBox}>
                      <span style={styles.flowLabel}>Current Clearance</span>
                      <span style={styles.flowVal}>{req.currentClearance}</span>
                    </div>
                    <div style={styles.vetArrow}>→</div>
                    <div style={styles.vetFlowBox}>
                      <span style={styles.flowLabel}>Requested Elevation</span>
                      <span style={styles.flowVal} style={{ color: 'var(--accent)', fontWeight: '800' }}>{req.requestedClearance}</span>
                    </div>
                  </div>

                  <p style={styles.vetReason}><strong>Vetting Rationale: </strong>"{req.reason}"</p>

                  <div style={styles.vetBtnRow}>
                    <button 
                      onClick={() => handleVettingApproval(req.id, req.name, req.requestedClearance)}
                      className="btn btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      <Check size={14} color="#000000" />
                      <span>Approve Tier Upgrade</span>
                    </button>
                    <button 
                      onClick={() => handleVettingReject(req.id, req.name)}
                      className="btn btn-secondary" 
                      style={{ padding: '8px 16px', fontSize: '12px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                    >
                      <X size={14} />
                      <span>Deny Elevation</span>
                    </button>
                  </div>
                </div>
              ))}

              {vettingRequests.length === 0 && (
                <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                  <ShieldCheck size={36} color="var(--success)" style={{ marginBottom: '12px' }} />
                  <h4>No pending clearance vetting files. All personnel verified.</h4>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Node 3: Recruitment Pipeline */}
        {activeNode === 'recruitment' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>TACTICAL COURIER RECRUITMENT PIPELINE</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Applications from security guards and transit drivers vetting in Kampala. Standard background checks require UPDF clearance or VIP credentials.
            </p>

            <div style={styles.applicantGrid}>
              {applications.map(app => (
                <div key={app.id} className="card" style={styles.appCard}>
                  <div style={styles.appHeader}>
                    <div>
                      <h4 style={{ fontSize: '15px' }}>{app.name}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Target Role: <strong>{app.position}</strong></span>
                    </div>
                    <span style={styles.appIdBadge}>{app.id}</span>
                  </div>

                  <div style={styles.appMeta}>
                    <div>
                      <span style={styles.metaLabel}>Background History:</span>
                      <span style={styles.metaVal}>{app.background}</span>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <span style={styles.metaLabel}>Weapons Clearance:</span>
                      <span style={styles.metaVal}>{app.weaponsClear}</span>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <span style={styles.metaLabel}>Vetted Zone:</span>
                      <span style={styles.metaVal}>{app.zone}</span>
                    </div>
                  </div>

                  <div style={styles.appBtnRow}>
                    <button 
                      onClick={() => handleHireApplicant(app.id, app.name, app.position)}
                      className="btn btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      <span>Approve & Hire</span>
                    </button>
                    <button 
                      onClick={() => handleRejectApplicant(app.id, app.name)}
                      className="btn btn-secondary" 
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      <span>Reject File</span>
                    </button>
                  </div>
                </div>
              ))}

              {applications.length === 0 && (
                <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                  <Award size={36} color="var(--accent)" style={{ marginBottom: '12px' }} />
                  <h4>No applications in queue. Recruitment targets achieved.</h4>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Node 4: Payroll & High-Risk Bonuses */}
        {activeNode === 'payroll' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>SALARY LEDGER & RISK SURCHARGE DISBURSEMENTS</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Base salaries combined with high-risk surcharge bonuses (accumulated from tactical armoured carrier escorts and high-clearance transits).
            </p>

            <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.tableTh}>Staff Name</th>
                    <th style={styles.tableTh}>Base Monthly Wage</th>
                    <th style={styles.tableTh}>High-Risk Escorts</th>
                    <th style={styles.tableTh}>Pending Surcharge Bonus</th>
                    <th style={styles.tableTh}>Ledger Status</th>
                    <th style={styles.tableTh} style={{ textAlign: 'right', paddingRight: '20px' }}>Incentive Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.map((pay, index) => (
                    <tr key={index} style={styles.tableBodyRow}>
                      <td style={styles.tableTd}><strong>{pay.name}</strong></td>
                      <td style={styles.tableTd}>{pay.baseWage.toLocaleString()} UGX</td>
                      <td style={styles.tableTd}>
                        <span style={styles.escortCount}>{pay.escortsCompleted} Trips</span>
                      </td>
                      <td style={styles.tableTd}>
                        <strong style={{ color: pay.pendingBonus > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                          {pay.pendingBonus.toLocaleString()} UGX
                        </strong>
                      </td>
                      <td style={styles.tableTd}>
                        <span style={{
                          ...styles.statusTag,
                          color: pay.status === 'Unpaid' ? 'var(--accent)' : 'var(--success)',
                          backgroundColor: pay.status === 'Unpaid' ? 'rgba(250,204,21,0.06)' : 'rgba(5,150,105,0.06)',
                          borderColor: pay.status === 'Unpaid' ? 'rgba(250,204,21,0.2)' : 'rgba(5,150,105,0.2)'
                        }}>
                          {pay.status}
                        </span>
                      </td>
                      <td style={styles.tableTd} style={{ textAlign: 'right', paddingRight: '20px' }}>
                        {pay.pendingBonus > 0 ? (
                          <button 
                            onClick={() => handleDisburseBonus(pay.name)}
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '11px' }}
                          >
                            <DollarSign size={11} color="#000000" />
                            <span>Disburse Bonus</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Ledger Cleared</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Node 5: Settings */}
        {activeNode === 'settings' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>HR ACCOUNT SETTINGS</h3>
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
  nodeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '24px'
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
    ':focus': {
      borderColor: 'var(--accent)'
    }
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
  personnelNameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  avatarMini: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '800'
  },
  clearanceBadge: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid',
    display: 'inline-block'
  },
  statusTag: {
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '20px',
    border: '1px solid'
  },
  phoneLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--text-secondary)',
    fontSize: '12px'
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
  requestGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  vetCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  vetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  vetId: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px'
  },
  vetName: {
    fontSize: '15px',
    fontWeight: '800'
  },
  vetStatusBadge: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--accent)',
    backgroundColor: 'rgba(250,204,21,0.08)',
    border: '1px solid rgba(250,204,21,0.2)',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  vetFlowRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border)'
  },
  vetFlowBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  flowLabel: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: '700'
  },
  flowVal: {
    fontSize: '12px',
    fontWeight: '600'
  },
  vetArrow: {
    fontSize: '18px',
    color: 'var(--text-muted)',
    fontWeight: '300'
  },
  vetReason: {
    fontSize: '12.5px',
    lineHeight: '1.5',
    color: 'var(--text-secondary)'
  },
  vetBtnRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '6px'
  },
  applicantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  appCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  appHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  appIdBadge: {
    fontSize: '9px',
    fontWeight: '800',
    backgroundColor: 'var(--border)',
    color: 'var(--text-primary)',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  appMeta: {
    backgroundColor: 'var(--bg-primary)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    fontSize: '12px'
  },
  metaLabel: {
    display: 'block',
    fontSize: '9px',
    color: 'var(--text-muted)',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  metaVal: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  appBtnRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '4px'
  },
  escortCount: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: 'rgba(250,204,21,0.08)',
    border: '1px solid rgba(250,204,21,0.2)',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  }
};
