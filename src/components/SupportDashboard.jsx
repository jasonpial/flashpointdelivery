import React, { useState } from 'react';
import { HelpCircle, Search, MessageSquare, Check, X, ShieldAlert, AlertCircle } from 'lucide-react';

export default function SupportDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('tickets');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Support Tickets Queue
  const [tickets, setTickets] = useState([
    { id: 'FP-TKT-1002', subject: 'Package delayed in transit', customer: 'Sarah Musoke', priority: 'HIGH', category: 'Logistics', status: 'Open', desc: 'My delivery was marked as dispatch 4 hours ago but the active handler position is not updating on my map.' },
    { id: 'FP-TKT-1003', subject: 'Wrong destination address logged', customer: 'John Mulago', priority: 'MEDIUM', category: 'Account Address', status: 'Open', desc: 'I selected Kampala Central but the booking receipt states Wakiso Division. Please correct destination before rider dispatch.' },
    { id: 'FP-TKT-1004', subject: 'Payment validation handshake fail', customer: 'David Oundo', priority: 'LOW', category: 'Billing MM', status: 'Open', desc: 'Mobile money reference MP260829 was deducted from my account but the terminal still shows unpaid cargo invoice.' }
  ]);

  const [resolutionText, setResolutionText] = useState({});

  const handleResolveTicket = (tktId) => {
    setTickets(prev => prev.map(t => {
      if (t.id === tktId) {
        return { ...t, status: 'RESOLVED' };
      }
      return t;
    }));
    setSuccessMsg(`Ticket ${tktId} successfully resolved and client notified.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const filteredTickets = tickets.filter(t => 
    t.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox}>
          <div style={styles.avatarBadge}>
            <HelpCircle size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>CUSTOMER SUPPORT</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav}>
          <button 
            onClick={() => setActiveTab('tickets')}
            style={{ ...styles.navItem, ...(activeTab === 'tickets' ? styles.activeNavItem : {}) }}
          >
            <MessageSquare size={16} />
            <span>Support Tickets Queue ({tickets.filter(t => t.status !== 'RESOLVED').length})</span>
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

        {/* TICKETS TAB */}
        {activeTab === 'tickets' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={styles.nodeTitle}>ACTIVE TICKET CLEARANCE</h3>
              <div style={styles.searchWrapper}>
                <Search size={16} color="var(--text-muted)" style={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search customer, subject or ticket ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
            </div>

            <div style={styles.ticketList}>
              {filteredTickets.map(t => (
                <div key={t.id} className="card" style={{
                  ...styles.ticketCard,
                  opacity: t.status === 'RESOLVED' ? 0.75 : 1
                }}>
                  <div style={styles.ticketHeader}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)' }}>{t.id} | {t.category}</span>
                      <h4 style={{ margin: '4px 0', fontSize: '15px' }}>{t.subject}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Raised By: <strong>{t.customer}</strong></span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        ...styles.priorityBadge,
                        backgroundColor: t.priority === 'HIGH' ? 'rgba(220,38,38,0.08)' : t.priority === 'MEDIUM' ? 'rgba(250,204,21,0.08)' : 'rgba(113,113,122,0.08)',
                        color: t.priority === 'HIGH' ? 'var(--danger)' : t.priority === 'MEDIUM' ? 'var(--accent)' : 'var(--text-secondary)'
                      }}>{t.priority}</span>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: t.status === 'Open' ? 'rgba(250,204,21,0.08)' : 'rgba(5,150,105,0.08)',
                        color: t.status === 'Open' ? 'var(--accent)' : 'var(--success)'
                      }}>{t.status}</span>
                    </div>
                  </div>

                  <p style={styles.ticketDesc}>"{t.desc}"</p>

                  {t.status === 'Open' && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <textarea 
                        placeholder="Type resolution briefing to transmit..." 
                        rows="2"
                        className="form-input"
                        value={resolutionText[t.id] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResolutionText(prev => ({ ...prev, [t.id]: val }));
                        }}
                        style={{ fontSize: '12px', resize: 'none' }}
                      />
                      <button 
                        onClick={() => {
                          if (!(resolutionText[t.id] || '').trim()) {
                            alert("Please log resolution parameter before clearance.");
                            return;
                          }
                          handleResolveTicket(t.id);
                        }}
                        className="btn btn-primary"
                        style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '11px' }}
                      >
                        <span>Resolve Ticket</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {filteredTickets.length === 0 && (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                  <HelpCircle size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                  <h4>No matching support tickets found.</h4>
                </div>
              )}
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
  ticketList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px'
  },
  ticketCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '10px'
  },
  priorityBadge: {
    fontSize: '8.5px',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase'
  },
  statusBadge: {
    fontSize: '9.5px',
    fontWeight: '850',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  ticketDesc: {
    fontSize: '13px',
    lineHeight: '1.6',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)'
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
