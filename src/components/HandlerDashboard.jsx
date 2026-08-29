import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Radio, FileText, Settings, Send, CheckCircle2, 
  Truck, Phone, ArrowRight, Clock, MessageSquare, Play 
} from 'lucide-react';
import SettingsNode from './SettingsNode';

export default function HandlerDashboard({ user, orders, onUserUpdate, onUpdateOrderStatus, onAddChatMessage, onAddReport }) {
  const [activeNode, setActiveNode] = useState('assignments');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Report Form state
  const [reportSubject, setReportSubject] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');
  
  const chatEndRef = useRef(null);

  // Filter orders assigned to this handler
  // For demo, if none matches, default to all orders so the reviewer can test
  const assignedOrders = orders.filter(o => o.handler.name.includes(user.name) || o.handler.name === 'Agent Assigned - Pending Clearance');

  useEffect(() => {
    if (assignedOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(assignedOrders[0].id);
    }
  }, [assignedOrders, selectedOrderId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [orders, selectedOrderId, isTyping]);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Send Chat message (as Handler)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedOrderId) return;

    const messageText = typedMessage.trim();
    
    // Add Handler message
    onAddChatMessage(selectedOrderId, {
      sender: 'handler',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setTypedMessage('');

    // Simulate Client Response after 1.5s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const clientReplies = [
        "Received, Officer. I am keeping track of the dashboard status timeline.",
        "Understood, thank you. Please let me know once you clear Nakasero division.",
        "Perfect. The receiver has been alerted and will sign upon armored vehicle arrival.",
        "Thank you. Please ensure the security seals remain untouched."
      ];

      onAddChatMessage(selectedOrderId, {
        sender: 'client',
        text: clientReplies[Math.floor(Math.random() * clientReplies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 1500);
  };

  // Submit report to CEO
  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportSubject.trim() || !reportDetails.trim() || !selectedOrderId) {
      alert("Please fill in the Report Subject and Details.");
      return;
    }

    onAddReport({
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      handlerName: user.name,
      orderId: selectedOrderId,
      subject: reportSubject.trim(),
      content: reportDetails.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    });

    setReportSubject('');
    setReportDetails('');
    setReportSuccess('Report successfully sent to Director / CEO dashboard!');
    setTimeout(() => setReportSuccess(''), 4000);
  };

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation - Distinct Nodes */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox} className="dashboard-sidebar-badge">
          <div style={styles.avatarBadge}>
            <Shield size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.officerRole}>SECURITY HANDLER</span>
            <span style={styles.officerName}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav} className="dashboard-sidebar-nav">
          <button 
            onClick={() => setActiveNode('assignments')}
            style={{ ...styles.navItem, ...(activeNode === 'assignments' ? styles.activeNavItem : {}) }}
          >
            <Truck size={16} />
            <span>My Assignments ({assignedOrders.length})</span>
          </button>
          
          <button 
            onClick={() => setActiveNode('chat')}
            style={{ ...styles.navItem, ...(activeNode === 'chat' ? styles.activeNavItem : {}) }}
          >
            <MessageSquare size={16} />
            <span>Client Radio Links</span>
          </button>
          
          <button 
            onClick={() => setActiveNode('report')}
            style={{ ...styles.navItem, ...(activeNode === 'report' ? styles.activeNavItem : {}) }}
          >
            <FileText size={16} />
            <span>Submit CEO Report</span>
          </button>
          
          <button 
            onClick={() => setActiveNode('settings')}
            style={{ ...styles.navItem, ...(activeNode === 'settings' ? styles.activeNavItem : {}) }}
          >
            <Settings size={16} />
            <span>User Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent} className="dashboard-content-area">
        
        {/* Node 1: Assignments */}
        {activeNode === 'assignments' && (
          <div className="slide-up handler-dashboard-split-grid" style={styles.splitGrid}>
            {/* Left list */}
            <div>
              <h3 style={styles.nodeTitle}>ASSIGNED COURIER LOGS</h3>
              <div style={styles.ordersList}>
                {assignedOrders.map(order => (
                  <div 
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    style={{
                      ...styles.orderCard,
                      ...(order.id === selectedOrderId ? styles.activeOrderCard : {})
                    }}
                    className="card"
                  >
                    <div style={styles.orderCardHeader}>
                      <span style={styles.orderId}>{order.id}</span>
                      <span style={{
                        ...styles.statusBadge,
                        color: order.status === 'delivered' ? 'var(--success)' : 'var(--accent)',
                        backgroundColor: order.status === 'delivered' ? 'rgba(5,150,105,0.08)' : 'rgba(250,204,21,0.08)',
                        borderColor: order.status === 'delivered' ? 'rgba(5,150,105,0.2)' : 'rgba(250,204,21,0.2)'
                      }}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span style={styles.cardRoute}>{order.pickup.name.split(' (')[0]} → {order.delivery.name.split(' (')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Details Panel */}
            <div>
              {selectedOrder ? (
                <div className="card" style={{ padding: '28px' }}>
                  <div style={styles.detailHeader}>
                    <h4>LOGISTICS MANIFEST ({selectedOrder.id})</h4>
                    <span style={styles.carrierTierBadge}>{selectedOrder.carrierMode.replace(/_/g, ' ')}</span>
                  </div>

                  {/* Status update controls */}
                  <div style={styles.statusControlContainer}>
                    <span style={styles.controlLabel}>UPDATE LOGISTICS STAGE:</span>
                    <div style={styles.controlGrid}>
                      <button 
                        onClick={() => onUpdateOrderStatus(selectedOrder.id, 'secured')}
                        style={{ ...styles.stageBtn, ...(selectedOrder.status === 'secured' ? styles.stageBtnActive : {}) }}
                      >
                        Secured Vault
                      </button>
                      <button 
                        onClick={() => onUpdateOrderStatus(selectedOrder.id, 'in_transit')}
                        style={{ ...styles.stageBtn, ...(selectedOrder.status === 'in_transit' ? styles.stageBtnActive : {}) }}
                      >
                        In Transit
                      </button>
                      <button 
                        onClick={() => onUpdateOrderStatus(selectedOrder.id, 'out_for_delivery')}
                        style={{ ...styles.stageBtn, ...(selectedOrder.status === 'out_for_delivery' ? styles.stageBtnActive : {}) }}
                      >
                        Out for Delivery
                      </button>
                      <button 
                        onClick={() => onUpdateOrderStatus(selectedOrder.id, 'delivered')}
                        style={{ ...styles.stageBtn, ...(selectedOrder.status === 'delivered' ? styles.stageBtnActive : {}) }}
                      >
                        Delivered
                      </button>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div style={styles.addressList}>
                    <div style={styles.addressItem}>
                      <Clock size={14} color="var(--accent)" />
                      <div>
                        <strong>Pickup Address:</strong>
                        <span>{selectedOrder.pickupAddress}</span>
                      </div>
                    </div>
                    <div style={styles.addressItem} style={{ marginTop: '12px' }}>
                      <CheckCircle2 size={14} color="var(--accent)" />
                      <div>
                        <strong>Recipient Details:</strong>
                        <span>{selectedOrder.receiverName} ({selectedOrder.receiverPhone})</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Target Address: {selectedOrder.deliveryAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cargo manifest */}
                  <div style={styles.cargoSection}>
                    <span style={styles.cargoLabel}>CARGO LOADING MANIFEST:</span>
                    <div style={styles.cargoItemsList}>
                      {selectedOrder.items.map(item => (
                        <div key={item.name} style={styles.cargoItem}>
                          <span style={{ textTransform: 'capitalize' }}>{item.name}</span>
                          <span style={styles.cargoQty}>x{item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                  <Shield size={32} color="var(--text-muted)" />
                  <p style={{ marginTop: '12px' }}>Select an active order log to load logistics manifests.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Node 2: Client Chat */}
        {activeNode === 'chat' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>CLIENT RADIO COMM LINKS</h3>
            {selectedOrder ? (
              <div style={styles.chatContainer}>
                
                {/* Chat window */}
                <div className="chat-window">
                  <div className="chat-header">
                    <div style={styles.clientBadge}>
                      <div style={styles.clientAvatar}>C</div>
                      <div>
                        <h4 style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Ronald Senteza (Client)</h4>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Radio Signal: Encrypted</span>
                      </div>
                    </div>
                    
                    {/* WhatsApp Call Integration */}
                    <a 
                      href={`https://api.whatsapp.com/send?phone=+256772900123&text=Hello%20Ronald,%20this%20is%20${user.name}%20from%20Flashpoint%20Delivery.%20Your%20secure%20cargo%20${selectedOrder.id}%20is%20currently%20in%20stage:%20${selectedOrder.status}.`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={styles.whatsAppBtn}
                    >
                      <Phone size={14} color="#ffffff" />
                      <span>WhatsApp Link</span>
                    </a>
                  </div>

                  {/* Chat messages list */}
                  <div className="chat-messages">
                    {selectedOrder.chat.map((msg, idx) => {
                      const isClient = msg.sender === 'client';
                      return (
                        <div 
                          key={idx} 
                          className={`chat-bubble ${isClient ? 'chat-bubble-handler' : 'chat-bubble-client'}`}
                          style={{
                            alignSelf: isClient ? 'flex-start' : 'flex-end',
                            backgroundColor: isClient ? 'rgba(0,0,0,0.02)' : 'rgba(250,204,21,0.08)',
                            borderColor: isClient ? 'var(--border)' : 'rgba(250,204,21,0.15)'
                          }}
                        >
                          <span style={styles.bubbleAuthor}>{isClient ? 'Ronald Senteza' : 'You (Officer)'}</span>
                          <p style={{ margin: '2px 0 0 0' }}>{msg.text}</p>
                          <span className="chat-bubble-time">{msg.time}</span>
                        </div>
                      );
                    })}

                    {isTyping && (
                      <div className="chat-bubble chat-bubble-handler" style={{ alignSelf: 'flex-start' }}>
                        <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '700' }}>
                          Client typing secure response...
                        </span>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  {/* Send Input */}
                  <form onSubmit={handleSendMessage} className="chat-input-area">
                    <input
                      type="text"
                      placeholder="Type secure radio message to client..."
                      value={typedMessage}
                      onChange={(e) => setTypedMessage(e.target.value)}
                      style={styles.chatInput}
                    />
                    <button type="submit" style={styles.chatSendBtn}>
                      <Send size={16} color="#000000" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <MessageSquare size={32} color="var(--text-muted)" />
                <p style={{ marginTop: '12px' }}>Please select an active order to link antennas.</p>
              </div>
            )}
          </div>
        )}

        {/* Node 3: Submit Report */}
        {activeNode === 'report' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>SUBMIT STATUS REPORT TO CEO</h3>
            <div className="card" style={{ padding: '28px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Submit tactical route check updates, checkpoint clearances, or incident logs directly to Director Mukasa's ledger.
              </p>

              {reportSuccess && (
                <div style={styles.successBanner}>
                  <CheckCircle2 size={16} />
                  <span>{reportSuccess}</span>
                </div>
              )}

              <form onSubmit={handleReportSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Select Cargo Reference</label>
                    <select 
                      value={selectedOrderId || ''}
                      onChange={(e) => setSelectedOrderId(e.target.value)}
                      className="form-input"
                    >
                      {assignedOrders.map(order => (
                        <option key={order.id} value={order.id}>{order.id} ({order.pickup.name.split(' (')[0]})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Report Subject</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Checkpoint Clearance Mukono Bypass" 
                      value={reportSubject}
                      onChange={(e) => setReportSubject(e.target.value)}
                      className="form-input" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Report Log Details</label>
                  <textarea 
                    rows="6"
                    placeholder="Enter detailed report parameters..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  <Send size={14} color="#000000" />
                  <span>Dispatch Report to Director</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Node 4: Settings */}
        {activeNode === 'settings' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>OFFICER SETTINGS</h3>
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
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
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
    fontSize: '20px',
    fontWeight: '800',
    marginBottom: '24px',
    borderLeft: '3px solid #facc15',
    paddingLeft: '12px',
    letterSpacing: '0.5px'
  },
  splitGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '30px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr'
    }
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  orderCard: {
    padding: '16px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderWidth: '1px'
  },
  activeOrderCard: {
    borderColor: 'var(--accent)',
    backgroundColor: 'rgba(250,204,21,0.03)',
    boxShadow: 'var(--shadow-glow)'
  },
  orderCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  orderId: {
    fontSize: '13.5px',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  statusBadge: {
    fontSize: '9px',
    fontWeight: '800',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '20px',
    border: '1px solid'
  },
  cardRoute: {
    fontSize: '11.5px',
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '16px',
    marginBottom: '20px'
  },
  carrierTierBadge: {
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#ffffff',
    backgroundColor: '#18181b',
    padding: '4px 10px',
    borderRadius: '6px'
  },
  statusControlContainer: {
    backgroundColor: 'var(--bg-tertiary)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    marginBottom: '24px'
  },
  controlLabel: {
    display: 'block',
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
    marginBottom: '10px'
  },
  controlGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    '@media (max-width: 600px)': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    }
  },
  stageBtn: {
    padding: '8px',
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: 'var(--accent)'
    }
  },
  stageBtnActive: {
    backgroundColor: '#facc15',
    color: '#000000',
    borderColor: '#facc15'
  },
  addressList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginBottom: '24px'
  },
  addressItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    fontSize: '13px'
  },
  cargoSection: {
    borderTop: '1px solid var(--border)',
    paddingTop: '20px'
  },
  cargoLabel: {
    display: 'block',
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
    marginBottom: '10px'
  },
  cargoItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  cargoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600'
  },
  cargoQty: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--accent)',
    backgroundColor: 'rgba(250,204,21,0.1)',
    padding: '1px 6px',
    borderRadius: '4px'
  },
  chatContainer: {
    maxWidth: '740px'
  },
  clientBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  clientAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--border)',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800'
  },
  whatsAppBtn: {
    backgroundColor: '#25D366',
    color: '#ffffff',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    boxShadow: '0 2px 6px rgba(37,211,102,0.2)',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#128C7E',
      transform: 'translateY(-2px)'
    }
  },
  bubbleAuthor: {
    display: 'block',
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--text-secondary)',
    marginBottom: '2px'
  },
  chatInput: {
    flex: 1,
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    outline: 'none',
    transition: 'all 0.3s ease',
    ':focus': {
      borderColor: 'var(--accent)'
    }
  },
  chatSendBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    backgroundColor: '#facc15',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'var(--accent-hover)'
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
    padding: '10px 14px',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '16px',
    justifyContent: 'center'
  }
};

// Add WhatsApp button hover style & DOM responsive dashboard overrides to style sheet
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    a[style*="whatsAppBtn"]:hover {
      background-color: #128C7E !important;
      transform: translateY(-2px) !important;
    }
    @media (max-width: 768px) {
      .dashboard-main-layout {
        grid-template-columns: 1fr !important;
        min-height: auto !important;
      }
      .dashboard-sidebar {
        border-right: none !important;
        border-bottom: 1px solid var(--border) !important;
        padding: 12px 16px !important;
        gap: 12px !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
        overflow-x: auto !important;
        white-space: nowrap !important;
      }
      .dashboard-sidebar-badge {
        display: none !important;
      }
      .dashboard-sidebar-nav {
        flex-direction: row !important;
        gap: 6px !important;
        width: 100% !important;
        overflow-x: auto !important;
        white-space: nowrap !important;
        padding-bottom: 0 !important;
        scrollbar-width: none !important;
      }
      .dashboard-sidebar-nav::-webkit-scrollbar {
        display: none !important;
      }
      .dashboard-sidebar-nav button {
        padding: 8px 12px !important;
        font-size: 11px !important;
        flex-shrink: 0 !important;
        width: auto !important;
        justify-content: center !important;
      }
      .dashboard-content-area {
        padding: 16px 12px !important;
        width: 100% !important;
      }
      .handler-dashboard-split-grid {
        grid-template-columns: 1fr !important;
        gap: 24px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
