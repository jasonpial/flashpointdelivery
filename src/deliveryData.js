// Flashpoint Delivery - Ugandan Security & Courier Cargo Data

export const ITEM_CATEGORIES = [
  {
    id: "documents",
    name: "Documents & Stationery",
    icon: "FileText",
    description: "Secure transport of paperwork, exams, envelopes, and office stationery.",
    items: [
      "envelop documents", "envelope cards", "stamps", "Manila papers", "pens", 
      "reams", "stationery", "school bags", "exams", "tonner (printer toner)", 
      "school requirements"
    ]
  },
  {
    id: "electronics",
    name: "Electronics & Gadgets",
    icon: "Cpu",
    description: "High-value tech requiring anti-static protection and security escorts.",
    items: [
      "digital watches", "tablets", "mobile phones", "Alarm clocks", "Back up chargers", 
      "sound bar or speakers", "electronic wires", "printers", "TV stickers", 
      "TV stand", "computers", "robots", "air conditioners", "blenders", 
      "woofers", "refrigerators", "television inch (Smart TV)", "phone accessories", 
      "batteries", "bulbs", "small electronics", "small machines", "laptops", "cameras"
    ]
  },
  {
    id: "apparel",
    name: "Fashion & Household Textiles",
    icon: "Shirt",
    description: "Clothing, personal jewelry, cosmetics, bedding, and home fabrics.",
    items: [
      "Jeans", "jewelry", "shirts", "clothes", "vets (vests)", "bed sheets", 
      "suitcases", "sandals", "slipper", "men shoes", "rings", "specs (glasses)", 
      "perfumes", "cosmetics", "curtains", "soap", "pillows", "carpets"
    ]
  },
  {
    id: "food_beverages",
    name: "Food, Drinks & Agriculture",
    icon: "CupSoda",
    description: "Perishables, local farm seeds, processed foods, and beverages.",
    items: [
      "Drinks", "juice", "packed sugar", "baby items", "tea leaves", "apples", 
      "coffee", "seeds", "cake", "cake accessories", "water bottles", "egg trays", 
      "chocolates"
    ]
  },
  {
    id: "hardware_auto",
    name: "Hardware, Tools & Automotive",
    icon: "Wrench",
    description: "Heavy components, construction trowels, car accessories, and plumbing.",
    items: [
      "Nails", "Jerrycans", "cups", "Rubber", "Ruler", "desk", "mattress", 
      "plastic pipes", "fridge trowels", "car rims", "car accessories", "spare parts", 
      "bottles", "plumbing materials", "packaging boxes", "pipes", "weighing scale", 
      "generators"
    ]
  },
  {
    id: "medical_chemical",
    name: "Chemical, Medical & Soil",
    icon: "ShieldAlert",
    description: "Sensitive pharmaceuticals, soil samples, and regulated agro-chemicals.",
    items: [
      "drugs (pharmaceuticals)", "herbal medicine", "soil samples", "liquid soap", 
      "pesticides", "herbicides"
    ]
  },
  {
    id: "special_transport",
    name: "Special Events & Outsized Cargo",
    icon: "Truck",
    description: "Large items, bicycles, event banners, and fragile accessories.",
    items: [
      "wedding accessories", "bicycles", "banners"
    ]
  }
];

export const UGANDA_LOCATIONS = {
  KAMPALA_DIVISIONS: [
    { name: "Kampala Central (Nakasero, Road)", baseRate: 5000, estMins: 20 },
    { name: "Kololo / Kamwokya / Wandegeya", baseRate: 6000, estMins: 25 },
    { name: "Bugolobi / Nakawa / Ntinda", baseRate: 7000, estMins: 35 },
    { name: "Muyenga / Kansanga / Kabalagala", baseRate: 7500, estMins: 30 },
    { name: "Rubaga / Mengo / Namirembe", baseRate: 7000, estMins: 30 },
    { name: "Kawempe / Makerere / Bwaise", baseRate: 8000, estMins: 40 },
    { name: "Makindye / Kibuye / Katwe", baseRate: 7000, estMins: 25 }
  ],
  CENTRAL_REGION: [
    { name: "Wakiso District (Kira, Nansana)", baseRate: 15000, estMins: 60 },
    { name: "Entebbe City (Airport Zone)", baseRate: 25000, estMins: 90 },
    { name: "Mukono Town / Seeta", baseRate: 20000, estMins: 75 },
    { name: "Mpigi Town Council", baseRate: 35000, estMins: 110 },
    { name: "Luwero / Bombo", baseRate: 50000, estMins: 140 },
    { name: "Mityana Town", baseRate: 60000, estMins: 150 },
    { name: "Masaka City Centre", baseRate: 85000, estMins: 180 }
  ]
};

export const CARRIER_MODES = [
  {
    id: "standard",
    name: "Standard Fast Courier",
    multiplier: 1.0,
    surcharge: 0,
    securityLevel: "Standard Courier Courier",
    badgeText: "Fast Transit",
    description: "Standard dispatch rider or light van. Best for basic documents, clothing, and everyday items."
  },
  {
    id: "secured_agent",
    name: "Secured Agent Transit",
    multiplier: 1.3,
    surcharge: 25000,
    securityLevel: "Level 1: Shielded Escort",
    badgeText: "Secured Cargo",
    description: "Tamper-proof cargo box with real-time GPS locks and background-checked security handler. Recommended for electronics, cash tokens, and cosmetics."
  },
  {
    id: "tactical_escort",
    name: "Tactical Armored Carrier",
    multiplier: 1.8,
    surcharge: 90000,
    securityLevel: "Level 2: Armored Escort (Armed Guard)",
    badgeText: "Maximum Security",
    description: "Reinforced armored escort vehicle with professional security personnel. Required for high-value jewelry, drugs, chemicals, or classified soil samples."
  }
];

/**
 * Calculates delivery price in UGX
 */
export function calculateDeliveryPrice(itemsList, pickup, delivery, carrierModeId) {
  if (!pickup || !delivery) {
    return { subtotal: 0, securitySurcharge: 0, total: 0 };
  }

  const baseCost = Math.max(pickup.baseRate, delivery.baseRate);
  
  let cargoUnitCost = 0;
  itemsList.forEach(item => {
    const category = ITEM_CATEGORIES.find(c => c.items.includes(item.name.toLowerCase()));
    let itemRate = 1500;
    
    if (category) {
      if (category.id === "electronics" || category.id === "special_transport") {
        itemRate = 4500;
      } else if (category.id === "hardware_auto") {
        itemRate = 3000;
      } else if (category.id === "medical_chemical") {
        itemRate = 4000;
      }
    }
    cargoUnitCost += itemRate * item.qty;
  });

  const mode = CARRIER_MODES.find(m => m.id === carrierModeId) || CARRIER_MODES[0];
  
  const subtotal = baseCost + cargoUnitCost;
  const securitySurcharge = mode.surcharge;
  const total = Math.round((subtotal * mode.multiplier) + securitySurcharge);

  return {
    baseRate: baseCost,
    cargoUnitCost,
    subtotal,
    securitySurcharge,
    total
  };
}

export const MOCK_ORDERS = [
  {
    id: "FP-9031",
    items: [
      { name: "laptops", qty: 2 },
      { name: "envelop documents", qty: 1 }
    ],
    pickup: { name: "Kololo / Kamwokya / Wandegeya", baseRate: 6000 },
    delivery: { name: "Entebbe City (Airport Zone)", baseRate: 25000 },
    pickupAddress: "Plot 12 Acacia Avenue, Kololo",
    deliveryAddress: "Entebbe Cargo Terminal Gate 4",
    receiverName: "Captain Ssewankambo",
    receiverPhone: "+256 701 988 776",
    carrierMode: "secured_agent",
    status: "in_transit",
    pricing: { total: 65400, baseRate: 25000, cargoUnitCost: 10500, subtotal: 35500, securitySurcharge: 25000 },
    handler: {
      name: "Sgt. Okello Emmanuel",
      clearance: "Gold Shield - Vetting Tier 3",
      avatarColor: "#fbbf24"
    },
    chat: [
      { sender: "handler", text: "Jambo! I have secured your packages in the vault. Moving out of Kololo shortly.", time: "11:15 AM" },
      { sender: "client", text: "Thanks Sgt. Okello. Please note the cargo contains fragile prototype laptops.", time: "11:20 AM" },
      { sender: "handler", text: "Acknowledged. Shock-absorbent cases deployed. ETA at Entebbe Airport is 12:45 PM.", time: "11:22 AM" }
    ]
  },
  {
    id: "FP-8241",
    items: [
      { name: "jewelry", qty: 1 }
    ],
    pickup: { name: "Kampala Central (Nakasero, Road)", baseRate: 5000 },
    delivery: { name: "Muyenga / Kansanga / Kabalagala", baseRate: 7500 },
    pickupAddress: "Sheraton Kampala Hotel, Lobby Desk",
    deliveryAddress: "Muyenga Tank Hill Rise, Villa 9B",
    receiverName: "Dr. Alisha Patel",
    receiverPhone: "+256 772 454 321",
    carrierMode: "tactical_escort",
    status: "secured",
    pricing: { total: 172500, baseRate: 7500, cargoUnitCost: 1500, subtotal: 9000, securitySurcharge: 90000 },
    handler: {
      name: "Lt. Nabakooza Grace",
      clearance: "Elite Tactical - Special Escort Force",
      avatarColor: "#ffffff"
    },
    chat: [
      { sender: "handler", text: "Security check completed. The diamonds have been verified and placed in the armored briefcase. Ready for dispatch.", time: "11:38 AM" }
    ]
  }
];

export const MOCK_REPLIES = [
  "Affirmative, cargo status is secure. Proceeding according to safety route plans.",
  "Traffic check at Nakawa junction, recalculating route via bypass to avoid delays.",
  "Package handoff is being initiated. Please prepare your delivery PIN or signature.",
  "Security status: High alert. All package seals are verified and intact.",
  "Understood. I will call you upon crossing the security checkpoint."
];

// --- SELLER NETWORK DATABASES ---

export const INITIAL_SHOPS = [
  { id: "s1", name: "Kikuubo Wholesalers Ltd", category: "hardware_auto", location: "Kikuubo Lane, Kampala Central", phone: "+256 701 555 111", verified: true },
  { id: "s2", name: "Acacia Tech Hub", category: "electronics", location: "Acacia Mall Plaza", phone: "+256 772 333 444", verified: true },
  { id: "s3", name: "Kampala Medical Depot", category: "medical_chemical", location: "Wandegeya High Street", phone: "+256 782 999 888", verified: true },
  { id: "s4", name: "Uganda Tea & Coffee Merchants", category: "food_beverages", location: "Nakasero Market Block B", phone: "+256 752 444 999", verified: true }
];

export const INITIAL_PRODUCTS = [
  { id: "p1", name: "laptops", price: 1850000, category: "electronics", seller: "Acacia Tech Hub", description: "Premium Core i7 business laptop with warranty.", image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="15" y="25" width="70" height="44" rx="4" fill="%2318181b" stroke="%23facc15" stroke-width="3"/><rect x="10" y="69" width="80" height="6" rx="2" fill="%23facc15"/><line x1="30" y1="40" x2="70" y2="40" stroke="%23ffffff" stroke-width="2"/></svg>' },
  { id: "p2", name: "printers", price: 620000, category: "electronics", seller: "Acacia Tech Hub", description: "All-in-one wireless scanner & laser printer.", image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="25" y="25" width="50" height="40" rx="3" fill="%2318181b" stroke="%23facc15" stroke-width="3"/><rect x="35" y="15" width="30" height="10" fill="%23facc15"/><rect x="30" y="65" width="40" height="15" fill="%23facc15"/></svg>' },
  { id: "p3", name: "tablets", price: 800000, category: "electronics", seller: "Acacia Tech Hub", description: "10-inch secure tablet for retail operations.", image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="15" width="60" height="70" rx="6" fill="%2318181b" stroke="%23facc15" stroke-width="3"/><circle cx="50" cy="78" r="4" fill="%23facc15"/></svg>' },
  { id: "p4", name: "digital watches", price: 150000, category: "electronics", seller: "Acacia Tech Hub", description: "Vetted GPS tracking wrist watch.", image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="25" y="10" width="50" height="80" rx="10" fill="none" stroke="%2318181b" stroke-width="6"/><rect x="35" y="30" width="30" height="40" rx="4" fill="%2318181b" stroke="%23facc15" stroke-width="3"/></svg>' },
  
  { id: "p5", name: "Nails", price: 12000, category: "hardware_auto", seller: "Kikuubo Wholesalers Ltd", description: "Pack of 100 industrial steel nails.", image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><line x1="30" y1="20" x2="70" y2="20" stroke="%23facc15" stroke-width="6"/><line x1="50" y1="20" x2="50" y2="80" stroke="%2318181b" stroke-width="5"/><polygon points="45,80 50,90 55,80" fill="%2318181b"/></svg>' },
  { id: "p6", name: "generators", price: 3400000, category: "hardware_auto", seller: "Kikuubo Wholesalers Ltd", description: "5kVA silent diesel standby generator.", image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" rx="5" fill="%2318181b" stroke="%23facc15" stroke-width="3"/><circle cx="50" cy="50" r="16" fill="none" stroke="%23facc15" stroke-width="4"/><line x1="20" y1="35" x2="80" y2="35" stroke="%23facc15" stroke-width="2"/></svg>' },
  { id: "p7", name: "car rims", price: 900000, category: "hardware_auto", seller: "Kikuubo Wholesalers Ltd", description: "Set of 4 alloy wheels (15 inch).", image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="%2318181b" stroke="%23facc15" stroke-width="4"/><circle cx="50" cy="50" r="10" fill="none" stroke="%23facc15" stroke-width="3"/><line x1="50" y1="15" x2="50" y2="85" stroke="%23facc15" stroke-width="3"/><line x1="15" y1="50" x2="85" y2="50" stroke="%23facc15" stroke-width="3"/></svg>' },
  { id: "p8", name: "weighing scale", price: 120000, category: "hardware_auto", seller: "Kikuubo Wholesalers Ltd", description: "Heavy duty dial scale up to 150kg.", image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="15" y="65" width="70" height="20" rx="2" fill="%2318181b" stroke="%23facc15" stroke-width="3"/><circle cx="50" cy="35" r="20" fill="none" stroke="%2318181b" stroke-width="3"/><line x1="50" y1="35" x2="60" y2="25" stroke="%23facc15" stroke-width="3"/></svg>' },

  { id: "p9", name: "drugs (pharmaceuticals)", price: 35000, category: "medical_chemical", seller: "Kampala Medical Depot", description: "Assorted licensed pharmaceutical capsules.", image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="25" y="40" width="50" height="20" rx="10" fill="%2318181b" stroke="%23facc15" stroke-width="3"/><line x1="50" y1="40" x2="50" y2="60" stroke="%23facc15" stroke-width="3"/></svg>' },
  { id: "p10", name: "herbal medicine", price: 20000, category: "medical_chemical", seller: "Kampala Medical Depot", description: "Pure local organic immune boosters.", image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 15C35 35 30 55 35 75C50 75 70 70 75 45C65 30 55 20 50 15Z" fill="%2318181b" stroke="%23facc15" stroke-width="3"/></svg>' },

  { id: "p11", name: "coffee", price: 25000, category: "food_beverages", seller: "Uganda Tea & Coffee Merchants", description: "1kg roasted Arabica coffee beans.", image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="35" ry="25" fill="%2318181b" stroke="%23facc15" stroke-width="3"/><path d="M25 50 Q50 30 75 50" fill="none" stroke="%23facc15" stroke-width="3"/></svg>' },
  { id: "p12", name: "tea leaves", price: 8000, category: "food_beverages", seller: "Uganda Tea & Coffee Merchants", description: "500g pure mountain black tea leaves.", image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 20 C25 40 25 70 50 80 C75 70 75 40 50 20Z" fill="%2318181b" stroke="%23facc15" stroke-width="3"/><line x1="50" y1="20" x2="50" y2="80" stroke="%23facc15" stroke-width="2"/></svg>' }
];

// --- REPORTS & BROADCASTS DATABASE ---

export const INITIAL_REPORTS = [
  {
    id: "REP-481",
    handlerName: "Sgt. Okello Emmanuel",
    orderId: "FP-9031",
    subject: "Mukono Junction Transit Clearance",
    content: "Secure vehicle has successfully crossed the Mukono checkpoint. Seals are completely intact. Radar indicates clear passage. ETA Entebbe is on track.",
    timestamp: "12:10 PM",
    read: false
  },
  {
    id: "REP-293",
    handlerName: "Lt. Nabakooza Grace",
    orderId: "FP-8241",
    subject: "Acacia Mall Handoff Secure Vaulting",
    content: "Diamonds have been safely loaded and verification signatures collected. Escort vehicle is fully armed. Commencing route lock.",
    timestamp: "11:45 AM",
    read: true
  }
];

export const INITIAL_BROADCASTS = [
  { id: "b1", sender: "Director Mukasa (CEO)", message: "URGENT SECURITY ADVISORY: Northern bypass road repairs are causing gridlock near Kawempe. All handlers are advised to use alternative routing.", timestamp: "03:15 PM" },
  { id: "b2", sender: "Director Mukasa (CEO)", message: "SYSTEM UPDATE: Double verification seals are now mandatory on all high-security medical drug deliveries.", timestamp: "10:00 AM" }
];
