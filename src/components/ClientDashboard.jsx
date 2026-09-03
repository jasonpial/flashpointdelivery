import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Radio, Settings, Send, CheckCircle2, Truck, 
  Phone, Clock, MessageSquare, Play, MapPin, Navigation, User, Plus 
} from 'lucide-react';
import SettingsNode from './SettingsNode';
import OrderForm from './OrderForm';

export default function ClientDashboard({ 
  user, orders, onUserUpdate, onNavigateToBook, onUpdateOrderStatus, onAddChatMessage, onAddOrder,
  activeSubNode, setActiveSubNode
}) {
  const [localActiveNode, setLocalActiveNode] = useState('shipments');
  const activeNode = activeSubNode || localActiveNode;
  const setActiveNode = (node) => {
    if (setActiveSubNode) setActiveSubNode(node);
    setLocalActiveNode(node);
  };
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  // Filter client orders (For demo we display all active orders, but let's filter safely)
  const clientOrders = orders.filter(o => o.id);

  useEffect(() => {
    if (clientOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(clientOrders[0].id);
    }
  }, [clientOrders, selectedOrderId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [orders, selectedOrderId, isTyping]);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Send message (as Client)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedOrderId) return;

    const messageText = typedMessage.trim();
    onAddChatMessage(selectedOrderId, {
      sender: 'client',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setTypedMessage('');

    // AI handler response simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const handlerReplies = [
        "Copy that. Radar signals are clear. Continuing along the Nakasero bypass.",
        "Understood, client. Security vaults are locked. ETA is unaffected.",
        "Secure carrier status: compromise-free. Continuing routing.",
        "Roger that. Initiating handoff protocol shortly. Please prepare ID clearance."
      ];
      onAddChatMessage(selectedOrderId, {
        sender: 'handler',
        text: handlerReplies[Math.floor(Math.random() * handlerReplies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 1500);
  };

  // Timeline stages
  const stages = [
    { key: 'pending', name: 'Approved' },
    { key: 'secured', name: 'Secured' },
    { key: 'in_transit', name: 'In Transit' },
    { key: 'out_for_delivery', name: 'Out For Delivery' },
    { key: 'delivered', name: 'Delivered' }
  ];

  const getStageIndex = (status) => {
    return stages.findIndex(s => s.key === status);
  };

  return (
    <div style={styles.dashboardLayout} className="slide-up dashboard-main-layout">
      
      {/* Sidebar Navigation - Client portal nodes */}
      <aside style={styles.sidebar} className="dashboard-sidebar">
        <div style={styles.badgeBox} className="dashboard-sidebar-badge">
          <div style={styles.avatarBadge}>
            <User size={22} color="#000000" />
          </div>
          <div>
            <span style={styles.roleLabel}>CLIENT PORTAL</span>
            <span style={styles.nameLabel}>{user.name}</span>
          </div>
        </div>
        <nav style={styles.sideNav} className="dashboard-sidebar-nav">
          <button 
            onClick={() => setActiveNode('shipments')}
            style={{ ...styles.navItem, ...(activeNode === 'shipments' ? styles.activeNavItem : {}) }}
          >
            <Truck size={16} />
            <span>My Shipments ({clientOrders.length})</span>
          </button>

          <button 
            onClick={() => setActiveNode('book')}
            style={{ ...styles.navItem, ...(activeNode === 'book' ? styles.activeNavItem : {}) }}
          >
            <Plus size={16} />
            <span>Request Pickup</span>
          </button>
          
          <button 
            onClick={() => setActiveNode('chat')}
            style={{ ...styles.navItem, ...(activeNode === 'chat' ? styles.activeNavItem : {}) }}
          >
            <Radio size={16} />
            <span>Secure Radio</span>
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
        
        {/* Node 1: My Shipments */}
        {activeNode === 'shipments' && (
          <div className="slide-up client-dashboard-split-grid" style={styles.splitGrid}>
            
            {/* Left Cargo logs */}
            <div>
              <h3 style={styles.nodeTitle}>MY CARGO LOGS</h3>
              <div style={styles.ordersList}>
                {clientOrders.map(order => (
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
                    <span style={styles.cardRoute}>
                      {order.pickup.name.split(' (')[0]} → {order.delivery.name.split(' (')[0]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Request New Shipment CTA */}
              <button 
                onClick={() => setActiveNode('book')} 
                className="btn btn-secondary" 
                style={{ width: '100%', marginTop: '20px', borderColor: 'var(--accent)' }}
              >
                <Plus size={16} />
                <span>Request New Carrier</span>
              </button>
            </div>

            {/* Right Details Panel */}
            <div>
              {selectedOrder ? (
                <div className="card" style={{ padding: '28px' }}>
                  <div style={styles.detailHeader}>
                    <h4>SECURED TRACKER TIMELINE</h4>
                    <span style={styles.carrierTierBadge}>{selectedOrder.carrierMode.replace(/_/g, ' ')}</span>
                  </div>

                  {/* Dynamic Progress Timeline */}
                  <div style={styles.timelineBox}>
                    {stages.map((stage, idx) => {
                      const currentIdx = getStageIndex(selectedOrder.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={stage.key} style={styles.timelineItem}>
                          <div style={styles.timelineIconCol}>
                            <div style={{
                              ...styles.timelineDot,
                              backgroundColor: isCompleted ? 'var(--accent)' : 'var(--border)',
                              borderColor: isCompleted ? 'var(--accent)' : 'var(--border)',
                              boxShadow: isCurrent ? '0 0 10px rgba(250,204,21,0.6)' : 'none'
                            }}>
                              {isCompleted && <CheckCircle2 size={10} color="#000000" />}
                            </div>
                            {idx < stages.length - 1 && (
                              <div style={{
                                ...styles.timelineLine,
                                backgroundColor: idx < currentIdx ? 'var(--accent)' : 'var(--border)'
                              }} />
                            )}
                          </div>
                          <div style={styles.timelineLabelCol}>
                            <span style={{
                              ...styles.timelineLabel,
                              fontWeight: isCurrent ? '800' : '600',
                              color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)'
                            }}>
                              {stage.name}
                            </span>
                            {isCurrent && (
                              <span style={styles.livePulse}>ACTIVE SIGNAL</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Transit metadata details */}
                  <div style={styles.metadataGrid}>
                    <div style={styles.metaRow}>
                      <MapPin size={14} color="var(--accent)" />
                      <div>
                        <strong>Pickup Origin:</strong>
                        <span>{selectedOrder.pickupAddress}</span>
                      </div>
                    </div>
                    <div style={styles.metaRow}>
                      <Navigation size={14} color="var(--accent)" />
                      <div>
                        <strong>Delivery Target:</strong>
                        <span>{selectedOrder.deliveryAddress} ({selectedOrder.delivery.name})</span>
                      </div>
                    </div>
                    <div style={styles.metaRow}>
                      <User size={14} color="var(--accent)" />
                      <div>
                        <strong>Assigned Officer Guard:</strong>
                        <span>{selectedOrder.handler.name} • {selectedOrder.handler.clearance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulator Control Panel (Allows Reviewer Manual Transitions) */}
                  <div style={styles.reviewerPanel}>
                    <span style={styles.reviewerLabel}>DEMO TRANSIT SIMULATOR CONTROLS:</span>
                    <div style={styles.reviewerGrid}>
                      <button 
                        onClick={() => onUpdateOrderStatus(selectedOrder.id, 'secured')}
                        style={styles.simulateBtn}
                      >
                        Secure Cargo
                      </button>
                      <button 
                        onClick={() => onUpdateOrderStatus(selectedOrder.id, 'in_transit')}
                        style={styles.simulateBtn}
                      >
                        Depart
                      </button>
                      <button 
                        onClick={() => onUpdateOrderStatus(selectedOrder.id, 'delivered')}
                        style={styles.simulateBtn}
                      >
                        Handoff Complete
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                  <Shield size={32} color="var(--text-muted)" />
                  <p style={{ marginTop: '12px' }}>Choose a cargo ID to track secure vaults.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Node 2: Request Pickup (embedded OrderForm directly inside page) */}
        {activeNode === 'book' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>REQUEST CARRIER PICKUP</h3>
            <div className="card" style={{ padding: '24px' }}>
              <OrderForm 
                user={user} 
                onAddOrder={(newOrder) => {
                  onAddOrder(newOrder);
                  setActiveNode('shipments');
                  setSelectedOrderId(newOrder.id);
                }}
                onOpenAuth={() => {}}
                onNavigateToDashboard={() => setActiveNode('shipments')}
                initialCargoCart={[]}
                onClearCargoCart={() => {}}
              />
            </div>
          </div>
        )}

        {/* Node 3: Secure Radio */}
        {activeNode === 'chat' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>SECURE RADIO LINK</h3>
            {selectedOrder ? (
              <div style={styles.chatContainer}>
                
                {/* Chat window */}
                <div className="chat-window">
                  <div className="chat-header">
                    <div style={styles.handlerBadge}>
                      <div style={styles.handlerAvatar}>H</div>
                      <div>
                        <h4 style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedOrder.handler.name}</h4>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Security Clearance: Gold Vetted</span>
                      </div>
                    </div>
                    
                    {/* WhatsApp Redirect */}
                    <a 
                      href={`https://api.whatsapp.com/send?phone=+256772900111&text=Hello%20Officer,%20this%20is%20${user.name}.%20Requesting%20GPS%20seal%20verification%20for%20shipment%20${selectedOrder.id}.`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={styles.whatsAppBtn}
                    >
                      <Phone size={14} color="#ffffff" style={{ flexShrink: 0 }} />
                      <span>WhatsApp Link</span>
                    </a>
                  </div>

                  {/* Messages */}
                  <div className="chat-messages">
                    {selectedOrder.chat.map((msg, idx) => {
                      const isHandler = msg.sender === 'handler';
                      return (
                        <div 
                          key={idx} 
                          className={`chat-bubble ${isHandler ? 'chat-bubble-handler' : 'chat-bubble-client'}`}
                          style={{
                            alignSelf: isHandler ? 'flex-start' : 'flex-end',
                            backgroundColor: isHandler ? 'rgba(0,0,0,0.02)' : 'rgba(250,204,21,0.08)',
                            borderColor: isHandler ? 'var(--border)' : 'rgba(250,204,21,0.15)'
                          }}
                        >
                          <span style={styles.bubbleAuthor}>{isHandler ? selectedOrder.handler.name : 'You'}</span>
                          <p style={{ margin: '2px 0 0 0' }}>{msg.text}</p>
                          <span className="chat-bubble-time">{msg.time}</span>
                        </div>
                      );
                    })}

                    {isTyping && (
                      <div className="chat-bubble chat-bubble-handler" style={{ alignSelf: 'flex-start' }}>
                        <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '700' }}>
                          Officer typing route updates...
                        </span>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  {/* Send Form */}
                  <form onSubmit={handleSendMessage} className="chat-input-area">
                    <input
                      type="text"
                      placeholder="Type secure radio message to officer..."
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
                <p style={{ marginTop: '12px' }}>Please choose a cargo ID to open radio frequencies.</p>
              </div>
            )}
          </div>
        )}

        {/* Node 4: User Settings */}
        {activeNode === 'settings' && (
          <div className="slide-up">
            <h3 style={styles.nodeTitle}>USER SETTINGS</h3>
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
  roleLabel: {
    display: 'block',
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '1px'
  },
  nameLabel: {
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
  timelineBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '20px 24px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    marginBottom: '24px'
  },
  timelineItem: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start'
  },
  timelineIconCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  timelineDot: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  timelineLine: {
    width: '2px',
    height: '30px',
    margin: '4px 0',
    backgroundColor: 'var(--border)'
  },
  timelineLabelCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '1px'
  },
  timelineLabel: {
    fontSize: '12.5px'
  },
  livePulse: {
    fontSize: '8px',
    fontWeight: '800',
    color: 'var(--danger)',
    backgroundColor: 'rgba(239,68,68,0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid rgba(239,68,68,0.2)'
  },
  metadataGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginBottom: '24px'
  },
  metaRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    fontSize: '13px'
  },
  reviewerPanel: {
    borderTop: '1px solid var(--border)',
    paddingTop: '20px',
    marginTop: '10px'
  },
  reviewerLabel: {
    display: 'block',
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
    marginBottom: '10px'
  },
  reviewerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px'
  },
  simulateBtn: {
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
      backgroundColor: 'var(--bg-tertiary)',
      borderColor: 'var(--accent)'
    }
  },
  chatContainer: {
    maxWidth: '740px'
  },
  handlerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  handlerAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#facc15',
    color: '#000000',
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
      backgroundColor: '#eab308'
    }
  }
};

// Add DOM stylesheet overrides to manage proportional scaling for mobile dashboard layouts
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
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
      .client-dashboard-split-grid {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
      }
      .timeline-box-wrapper {
        padding: 12px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
