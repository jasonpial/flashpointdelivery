import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = JSON.parse(
  readFileSync(new URL('../firebase-applet-config.json', import.meta.url), 'utf-8')
);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seed() {
  console.log('⏳ Seeding Firestore database...\n');

  // ========== USER PROFILES ==========
  const clientUser = {
    uid: 'client-001',
    displayName: 'John Client',
    email: 'client@example.com',
    role: 'client',
    phone: '+256700001111',
    createdAt: serverTimestamp()
  };

  const handlerUser = {
    uid: 'handler-001',
    displayName: 'David Handler',
    email: 'handler@example.com',
    role: 'handler',
    phone: '+256700002222',
    status: 'available',
    assignedRegion: 'Kampala City - Central',
    createdAt: serverTimestamp()
  };

  const sellerUser = {
    uid: 'seller-001',
    displayName: 'Alice Seller',
    email: 'seller@example.com',
    role: 'seller',
    phone: '+256700003333',
    businessId: 'business-001',
    createdAt: serverTimestamp()
  };

  const adminUser = {
    uid: 'admin-001',
    displayName: 'Admin Root',
    email: 'admin@example.com',
    role: 'admin',
    phone: '+256700004444',
    accessLevel: 'super',
    createdAt: serverTimestamp()
  };

  // ========== BUSINESS PROFILES ==========
  const business1 = {
    ownerUid: sellerUser.uid,
    name: 'Flashpoint Electronics Hub',
    description: 'Premium electronics supplier with secure logistics integration.',
    category: 'Electronics',
    contactEmail: sellerUser.email,
    contactPhone: sellerUser.phone,
    address: 'Plot 15, Kampala Rd, Kampala, Uganda',
    createdAt: serverTimestamp()
  };

  const business2 = {
    ownerUid: 'seller-002-uid',
    name: 'Urban Fashion Marketplace',
    description: 'High-end apparel and accessories with priority logistics.',
    category: 'Retail',
    contactEmail: 'seller2@example.com',
    contactPhone: '+256700005555',
    address: 'Plot 8, Muwada Road, Kampala, Uganda',
    createdAt: serverTimestamp()
  };

  // ========== PRODUCTS ==========
  const products = [
    {
      businessId: sellerUser.uid,
      businessName: business1.name,
      name: 'Secure Phone Case Pack',
      description: 'Premium protective phone cases with shipping insurance.',
      price: 150000,
      category: 'Electronics',
      stock: 50,
      sku: 'FP-ELEC-001',
      weight: '0.5kg',
      dimensions: '15x10x5cm',
      tags: 'phone, protection, premium',
      images: [
        'https://images.unsplash.com/photo-1591290621512-0d0d644f3db0?q=80&w=400&h=400&auto=format&fit=crop'
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      businessId: sellerUser.uid,
      businessName: business1.name,
      name: 'Premium Laptop Stand',
      description: 'Ergonomic aluminum laptop stand for secure work setup.',
      price: 280000,
      category: 'Electronics',
      stock: 30,
      sku: 'FP-ELEC-002',
      weight: '2kg',
      dimensions: '30x25x15cm',
      tags: 'laptop, ergonomic, aluminum',
      images: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400&h=400&auto=format&fit=crop'
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      businessId: 'seller-002-uid',
      businessName: business2.name,
      name: 'Designer Leather Handbag',
      description: 'Luxury leather handbag with signature designer aesthetics.',
      price: 450000,
      category: 'Apparel',
      stock: 15,
      sku: 'FP-APPL-001',
      weight: '1kg',
      dimensions: '35x25x15cm',
      tags: 'luxury, leather, fashion',
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&h=400&auto=format&fit=crop'
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ];

  // ========== SHIPMENTS ==========
  const shipments = [
    {
      origin: 'Kampala City - Central',
      destination: 'Entebbe Airport',
      pickupAddress: 'Plot 15, Kampala Rd',
      destinationAddress: 'Cargo Section, Entebbe Airport',
      packageDetails: 'Electronics delivery with secure handling',
      weight: '5kg',
      selectedItems: ['Electronics', 'Fragile goods'],
      pickupRequired: true,
      serviceTier: 'Standard Delivery',
      trackingNumber: 'FP-UG-100001',
      status: 'in-transit',
      clientUid: clientUser.uid,
      clientEmail: clientUser.email,
      handlerUid: handlerUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      origin: 'Kampala City - Central',
      destination: 'Jinja District',
      pickupAddress: 'Plot 8, Muwada Road',
      destinationAddress: 'Industrial Park, Jinja',
      packageDetails: 'Apparel shipment with priority handling',
      weight: '3kg',
      selectedItems: ['Apparel', 'Accessories'],
      pickupRequired: false,
      serviceTier: 'Express Delivery',
      trackingNumber: 'FP-UG-100002',
      status: 'pending',
      clientUid: 'client-002-uid',
      clientEmail: 'client2@example.com',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ];

  // ========== REPORTS ==========
  const reports = [
    {
      authorUid: handlerUser.uid,
      title: 'Daily Operations Summary',
      description: 'Completed 5 deliveries with zero incidents.',
      timestamp: serverTimestamp(),
      type: 'daily-summary'
    },
    {
      authorUid: handlerUser.uid,
      title: 'Route Optimization Report',
      description: 'Optimized pickup route to reduce transit time by 15%.',
      timestamp: serverTimestamp(),
      type: 'technical'
    }
  ];

  // ========== BROADCASTS ==========
  const broadcasts = [
    {
      message: 'System Maintenance: Platform upgrades scheduled for May 13, 2026. Expected downtime: 2 hours.',
      timestamp: serverTimestamp(),
      author: 'System Admin',
      type: 'maintenance'
    },
    {
      message: 'New Feature: Real-time GPS tracking now available for all Express Delivery shipments.',
      timestamp: serverTimestamp(),
      author: 'System Admin',
      type: 'feature-announcement'
    }
  ];

  // ========== DIRECT MESSAGES ==========
  const directMessages = [
    {
      fromUid: clientUser.uid,
      toUid: handlerUser.uid,
      message: 'Please confirm pickup schedule for FP-UG-100001.',
      timestamp: serverTimestamp(),
      read: false
    },
    {
      fromUid: handlerUser.uid,
      toUid: clientUser.uid,
      message: 'Confirmed. Pickup scheduled for 2:00 PM today.',
      timestamp: serverTimestamp(),
      read: true
    },
    {
      fromUid: sellerUser.uid,
      toUid: adminUser.uid,
      message: 'Need assistance updating business profile information.',
      timestamp: serverTimestamp(),
      read: false
    }
  ];

  // ========== LOGS ==========
  const logs = [
    {
      level: 'info',
      message: 'User registration successful',
      userId: clientUser.uid,
      timestamp: serverTimestamp()
    },
    {
      level: 'info',
      message: 'Business profile created',
      userId: sellerUser.uid,
      timestamp: serverTimestamp()
    },
    {
      level: 'warning',
      message: 'High shipment volume detected in Kampala region',
      timestamp: serverTimestamp()
    }
  ];

  // ========== WRITE TO FIRESTORE ==========
  try {
    // Users
    await setDoc(doc(db, 'users', clientUser.uid), clientUser);
    console.log('✓ Client user created');
    await setDoc(doc(db, 'users', handlerUser.uid), handlerUser);
    console.log('✓ Handler user created');
    await setDoc(doc(db, 'users', sellerUser.uid), sellerUser);
    console.log('✓ Seller user created');
    await setDoc(doc(db, 'users', adminUser.uid), adminUser);
    console.log('✓ Admin user created');

    // Businesses
    await setDoc(doc(db, 'businesses', 'business-001'), business1);
    console.log('✓ Business 1 created');
    await setDoc(doc(db, 'businesses', 'business-002'), business2);
    console.log('✓ Business 2 created');

    // Products
    for (let i = 0; i < products.length; i++) {
      await setDoc(doc(db, 'products', `product-00${i + 1}`), products[i]);
    }
    console.log(`✓ ${products.length} products created`);

    // Shipments
    for (let i = 0; i < shipments.length; i++) {
      const shipmentRef = doc(db, 'shipments', `shipment-00${i + 1}`);
      await setDoc(shipmentRef, shipments[i]);

      // Add sample message to first shipment
      if (i === 0) {
        await setDoc(
          doc(collection(db, 'shipments', `shipment-00${i + 1}`, 'messages'), `msg-001`),
          {
            senderUid: clientUser.uid,
            text: 'Shipment created and ready for handler assignment.',
            timestamp: serverTimestamp()
          }
        );
      }
    }
    console.log(`✓ ${shipments.length} shipments created with messages`);

    // Reports
    for (let i = 0; i < reports.length; i++) {
      await setDoc(doc(db, 'reports', `report-00${i + 1}`), reports[i]);
    }
    console.log(`✓ ${reports.length} reports created`);

    // Broadcasts
    for (let i = 0; i < broadcasts.length; i++) {
      await setDoc(doc(db, 'broadcasts', `broadcast-00${i + 1}`), broadcasts[i]);
    }
    console.log(`✓ ${broadcasts.length} broadcasts created`);

    // Direct Messages
    for (let i = 0; i < directMessages.length; i++) {
      await setDoc(doc(db, 'direct_messages', `message-00${i + 1}`), directMessages[i]);
    }
    console.log(`✓ ${directMessages.length} direct messages created`);

    // Logs
    for (let i = 0; i < logs.length; i++) {
      await setDoc(doc(db, 'logs', `log-00${i + 1}`), logs[i]);
    }
    console.log(`✓ ${logs.length} log entries created`);

    console.log('\n✅ Firestore seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log(`   Client:  ${clientUser.email} (Role: client)`);
    console.log(`   Handler: ${handlerUser.email} (Role: handler)`);
    console.log(`   Seller:  ${sellerUser.email} (Role: seller)`);
    console.log(`   Admin:   ${adminUser.email} (Role: admin)`);
    console.log('\n💾 Collections created:');
    console.log('   ✓ users');
    console.log('   ✓ businesses');
    console.log('   ✓ products');
    console.log('   ✓ shipments (with messages subcollection)');
    console.log('   ✓ reports');
    console.log('   ✓ broadcasts');
    console.log('   ✓ direct_messages');
    console.log('   ✓ logs');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
