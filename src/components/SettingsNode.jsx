import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Upload, Activity, CheckCircle, ShieldAlert } from 'lucide-react';

export default function SettingsNode({ user, onUserUpdate }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Profile Photo state
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null);
  const [profileLogs, setProfileLogs] = useState([
    { action: "Secure terminal verification completed", time: "10:15 AM", date: "Today" },
    { action: "Profile clearance level checked", time: "10:16 AM", date: "Today" }
  ]);

  const [saveSuccess, setSaveSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Handle mock photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        
        // Log action
        const newLog = { action: "Profile avatar updated", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: "Today" };
        setProfileLogs(prev => [newLog, ...prev]);

        // Propagate up if callback exists
        if (onUserUpdate) {
          onUserUpdate({ ...user, photo: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Name and Email are mandatory fields.");
      return;
    }

    const updatedUser = { ...user, name, email, phone };
    if (photoPreview) {
      updatedUser.photo = photoPreview;
    }
    
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }

    const newLog = { action: "Profile parameters modified", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: "Today" };
    setProfileLogs(prev => [newLog, ...prev]);

    setSaveSuccess('Profile updated successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      alert("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Security protocol requires a minimum password length of 6 characters.");
      return;
    }

    const newLog = { action: "Credential keys rotated", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: "Today" };
    setProfileLogs(prev => [newLog, ...prev]);

    setOldPassword('');
    setNewPassword('');
    setPasswordSuccess('Security credentials rotated!');
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  return (
    <div style={styles.settingsGrid}>
      
      {/* Left Card: Profile Details & Photo */}
      <div className="card" style={styles.cardBox}>
        <h3 style={styles.cardTitle}>
          <User size={18} color="var(--accent)" />
          <span>PROFILE DETAILS</span>
        </h3>

        {/* Photo Upload Node */}
        <div style={styles.photoContainer}>
          <div style={styles.photoPreviewWrapper}>
            {photoPreview ? (
              <img src={photoPreview} alt="Profile Avatar" style={styles.photoImg} />
            ) : (
              <div style={styles.photoPlaceholder}>
                <User size={36} color="var(--text-muted)" />
              </div>
            )}
          </div>
          <div style={styles.uploadControls}>
            <span style={styles.uploadLabel}>Profile Avatar</span>
            <label style={styles.fileInputLabel}>
              <Upload size={14} />
              <span>Upload Photo</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoChange} 
                style={{ display: 'none' }} 
              />
            </label>
            <span style={styles.uploadHint}>Support JPG, PNG. Max 2MB.</span>
          </div>
        </div>

        {/* Edit profile form */}
        <form onSubmit={handleProfileSave} style={{ marginTop: '20px' }}>
          {saveSuccess && (
            <div style={styles.successBanner}>
              <CheckCircle size={14} />
              <span>{saveSuccess}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Contact</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="form-input" 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <span>Save Profile Parameters</span>
          </button>
        </form>
      </div>

      {/* Right Column: Credentials & Logs */}
      <div style={styles.rightColumn}>
        
        {/* Credentials Card */}
        <div className="card" style={styles.cardBox}>
          <h3 style={styles.cardTitle}>
            <Lock size={18} color="var(--accent)" />
            <span>SECURITY CREDENTIALS</span>
          </h3>

          <form onSubmit={handlePasswordSave}>
            {passwordSuccess && (
              <div style={styles.successBanner}>
                <CheckCircle size={14} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input 
                type="password" 
                placeholder="Enter current password" 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)} 
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Security Password</label>
              <input 
                type="password" 
                placeholder="Enter new password (min 6 characters)" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="form-input" 
              />
            </div>

            <button type="submit" className="btn btn-secondary" style={{ width: '100%', borderColor: 'var(--accent)' }}>
              <span>Rotate Password Keys</span>
            </button>
          </form>
        </div>

        {/* Activity Logs Card */}
        <div className="card" style={styles.cardBox}>
          <h3 style={styles.cardTitle}>
            <Activity size={18} color="var(--accent)" />
            <span>SECURITY AUDIT LOGS</span>
          </h3>

          <div style={styles.logsContainer}>
            {profileLogs.map((log, idx) => (
              <div key={idx} style={styles.logItem}>
                <div style={styles.logBullet} />
                <div style={styles.logDetails}>
                  <span style={styles.logText}>{log.action}</span>
                  <span style={styles.logTime}>{log.date} at {log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

const styles = {
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '30px',
    alignItems: 'start',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
  },
  cardBox: {
    padding: '24px'
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '14px',
    marginBottom: '20px',
    letterSpacing: '0.5px'
  },
  photoContainer: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--border)'
  },
  photoPreviewWrapper: {
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid var(--accent)',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  photoPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadControls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '6px'
  },
  uploadLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  fileInputLabel: {
    backgroundColor: 'rgba(250,204,21,0.15)',
    color: 'var(--accent)',
    border: '1px dashed var(--accent)',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease'
  },
  uploadHint: {
    fontSize: '11px',
    color: 'var(--text-muted)'
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
    textAlign: 'center',
    justifyContent: 'center'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  logsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '260px',
    overflowY: 'auto',
    paddingRight: '6px'
  },
  logItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(0,0,0,0.02)'
  },
  logBullet: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    marginTop: '6px',
    flexShrink: 0
  },
  logDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  logText: {
    fontSize: '12.5px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  logTime: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    marginTop: '2px'
  }
};
