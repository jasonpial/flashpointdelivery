import React from 'react';
import { Shield, Lock } from 'lucide-react';
import DeliveryRiderImg from '../assets/delivery_rider.png';

// Import Role Dashboards
import ClientDashboard from './ClientDashboard';
import HandlerDashboard from './HandlerDashboard';
import CEODashboard from './CEODashboard';
import SellerDashboard from './SellerDashboard';
import HRDashboard from './HRDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard({ 
  user, 
  orders, 
  reports, 
  broadcasts, 
  shops, 
  products,
  onOpenAuth, 
  onNavigateToBook, 
  onUpdateOrderStatus, 
  onAddChatMessage,
  onAddReport,
  onAddBroadcast,
  onAddProduct,
  onUserUpdate,
  onAddOrder
}) {

  // Not Logged In - Secure Gateway Lock Screen
  if (!user) {
    return (
      <div style={styles.secureGate} className="slide-up">
        <div className="container" style={styles.gateContent}>
          <div style={styles.gateImageWrapper}>
            <img src={DeliveryRiderImg} alt="Tactical Courier Rider" style={styles.gateImage} />
            <div style={styles.gateImageOverlay} />
            <div style={styles.gateShield} className="pulse-glow-effect">
              <Lock size={32} color="#000000" />
            </div>
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>UNAUTHORIZED ACCESS</h2>
          <p style={styles.gateText}>
            This terminal contains classified logistics, real-time GPS locations, and active armed security escort logs. 
            Please sign in using your authenticated security profile to proceed.
          </p>
          <button className="btn btn-primary" onClick={onOpenAuth} style={{ padding: '12px 32px' }}>
            <Shield size={16} />
            <span>Authenticate Secure Profile</span>
          </button>
        </div>
      </div>
    );
  }

  // Logged In - Route to respective roles dashboard
  switch (user.role) {
    case 'ceo':
      return (
        <CEODashboard 
          user={user} 
          orders={orders} 
          reports={reports} 
          broadcasts={broadcasts} 
          shops={shops} 
          onUserUpdate={onUserUpdate} 
          onAddBroadcast={onAddBroadcast} 
        />
      );
      
    case 'handler':
      return (
        <HandlerDashboard 
          user={user} 
          orders={orders} 
          onUserUpdate={onUserUpdate} 
          onUpdateOrderStatus={onUpdateOrderStatus} 
          onAddChatMessage={onAddChatMessage} 
          onAddReport={onAddReport} 
        />
      );
      
    case 'seller':
      return (
        <SellerDashboard 
          user={user} 
          products={products} 
          shops={shops} 
          orders={orders} 
          onUserUpdate={onUserUpdate} 
          onAddProduct={onAddProduct} 
        />
      );
      
    case 'hr':
      return (
        <HRDashboard 
          user={user} 
          orders={orders} 
          reports={reports} 
          onUserUpdate={onUserUpdate} 
        />
      );

    case 'admin':
      return (
        <AdminDashboard 
          user={user} 
          orders={orders} 
          reports={reports} 
          shops={shops} 
          onUserUpdate={onUserUpdate} 
          onUpdateOrderStatus={onUpdateOrderStatus} 
        />
      );

    case 'client':
    default:
      return (
        <ClientDashboard 
          user={user} 
          orders={orders} 
          onUserUpdate={onUserUpdate} 
          onNavigateToBook={onNavigateToBook} 
          onUpdateOrderStatus={onUpdateOrderStatus} 
          onAddChatMessage={onAddChatMessage} 
          onAddOrder={onAddOrder}
        />
      );
  }
}

const styles = {
  secureGate: {
    padding: '80px 0',
    backgroundColor: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 120px)'
  },
  gateContent: {
    maxWidth: '440px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  gateImageWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '360px',
    height: '180px',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '28px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)'
  },
  gateImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  gateImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(252,252,249,0.8) 0%, transparent 100%)'
  },
  gateShield: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#facc15',
    border: '2px solid #000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-md)',
    zIndex: 10
  },
  gateText: {
    fontSize: '14.5px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '32px'
  }
};
