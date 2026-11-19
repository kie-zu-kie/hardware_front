export const products = [
  {
    id: 1,
    name: "Bosch Cordless Drill",
    category: "Power Tools",
    price: 4850,
    stock: 18,
    reorder: 10,
    unit: "pcs",
    supplier: "Bosch Philippines"
  },
  {
    id: 2,
    name: "DeWalt Angle Grinder",
    category: "Power Tools",
    price: 6250,
    stock: 7,
    reorder: 10,
    unit: "pcs",
    supplier: "DeWalt Supplier"
  },
  {
    id: 3,
    name: "Stanley Hammer",
    category: "Hand Tools",
    price: 850,
    stock: 32,
    reorder: 10,
    unit: "pcs",
    supplier: "Stanley Tools"
  },
  {
    id: 4,
    name: "Ingco Screwdriver Set",
    category: "Hand Tools",
    price: 650,
    stock: 25,
    reorder: 10,
    unit: "sets",
    supplier: "Ingco Philippines"
  },
  {
    id: 5,
    name: "PVC Pipe 1/2 inch",
    category: "Plumbing",
    price: 120,
    stock: 85,
    reorder: 20,
    unit: "pcs",
    supplier: "Local Hardware Supply"
  },
  {
    id: 6,
    name: "PVC Elbow 1/2 inch",
    category: "Plumbing",
    price: 35,
    stock: 14,
    reorder: 20,
    unit: "pcs",
    supplier: "Local Hardware Supply"
  },
  {
    id: 7,
    name: "Royu Circuit Breaker",
    category: "Electrical",
    price: 420,
    stock: 40,
    reorder: 15,
    unit: "pcs",
    supplier: "Royu Electrical"
  },
  {
    id: 8,
    name: "Electrical Wire 2.0mm",
    category: "Electrical",
    price: 1850,
    stock: 6,
    reorder: 10,
    unit: "rolls",
    supplier: "Firefly Electric"
  },
  {
    id: 9,
    name: "Boysen Wall Paint 4L",
    category: "Paint",
    price: 1350,
    stock: 22,
    reorder: 8,
    unit: "cans",
    supplier: "Boysen Philippines"
  },
  {
    id: 10,
    name: "Paint Brush 4 inch",
    category: "Painting",
    price: 180,
    stock: 55,
    reorder: 15,
    unit: "pcs",
    supplier: "Local Hardware Supply"
  }
];

export const customers = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    phone: "09171234567",
    email: "juan@email.com",
    address: "Antipolo City"
  },
  {
    id: 2,
    name: "Maria Santos",
    phone: "09181234567",
    email: "maria@email.com",
    address: "Cainta, Rizal"
  },
  {
    id: 3,
    name: "Pedro Reyes",
    phone: "09201234567",
    email: "pedro@email.com",
    address: "Taytay, Rizal"
  },
  {
    id: 4,
    name: "Ana Garcia",
    phone: "09211234567",
    email: "ana@email.com",
    address: "Marikina City"
  },
  {
    id: 5,
    name: "Mark Villanueva",
    phone: "09221234567",
    email: "mark@email.com",
    address: "Pasig City"
  }
];

export const cashiers = [
  {
    id: 1,
    name: "John Smith",
    username: "john.cashier",
    status: "Active"
  },
  {
    id: 2,
    name: "Sarah Reyes",
    username: "sarah.cashier",
    status: "Active"
  },
  {
    id: 3,
    name: "Michael Cruz",
    username: "michael.cashier",
    status: "Active"
  }
];

export const suppliers = [
  {
    id: 1,
    name: "Bosch Philippines",
    contact: "02-8123-4567",
    email: "sales@bosch.ph",
    address: "Manila"
  },
  {
    id: 2,
    name: "Ingco Philippines",
    contact: "02-8234-5678",
    email: "sales@ingco.ph",
    address: "Quezon City"
  },
  {
    id: 3,
    name: "Stanley Tools",
    contact: "02-8345-6789",
    email: "sales@stanley.ph",
    address: "Pasig City"
  },
  {
    id: 4,
    name: "Royu Electrical",
    contact: "02-8456-7890",
    email: "sales@royu.ph",
    address: "Manila"
  },
  {
    id: 5,
    name: "Boysen Philippines",
    contact: "02-8567-8901",
    email: "sales@boysen.ph",
    address: "Quezon City"
  }
];

export const sales = [
  {
    id: 1,
    date: "Aug 25, 2026",
    customer: "Juan Dela Cruz",
    cashier: "John Smith",
    total: 4850,
    payment: "Cash"
  },
  {
    id: 2,
    date: "Aug 25, 2026",
    customer: "Maria Santos",
    cashier: "Sarah Reyes",
    total: 6250,
    payment: "GCash"
  },
  {
    id: 3,
    date: "Aug 24, 2026",
    customer: "Pedro Reyes",
    cashier: "John Smith",
    total: 1850,
    payment: "Cash"
  },
  {
    id: 4,
    date: "Aug 24, 2026",
    customer: "Ana Garcia",
    cashier: "Michael Cruz",
    total: 2700,
    payment: "Card"
  },
  {
    id: 5,
    date: "Aug 23, 2026",
    customer: "Mark Villanueva",
    cashier: "Sarah Reyes",
    total: 1350,
    payment: "Cash"
  }
];

export const stockUpdates = [
  {
    id: 1,
    product: "Bosch Cordless Drill",
    type: "Stock In",
    quantity: 10,
    date: "Aug 25, 2026",
    supplier: "Bosch Philippines",
    status: "Completed"
  },
  {
    id: 2,
    product: "DeWalt Angle Grinder",
    type: "Stock Out",
    quantity: 3,
    date: "Aug 25, 2026",
    supplier: "DeWalt Supplier",
    status: "Completed"
  },
  {
    id: 3,
    product: "PVC Pipe 1/2 inch",
    type: "Stock In",
    quantity: 30,
    date: "Aug 24, 2026",
    supplier: "Local Hardware Supply",
    status: "Completed"
  },
  {
    id: 4,
    product: "Electrical Wire 2.0mm",
    type: "Stock In",
    quantity: 5,
    date: "Aug 23, 2026",
    supplier: "Firefly Electric",
    status: "Completed"
  }
];

export const supplyMonitoring = [
  {
    id: 1,
    product: "DeWalt Angle Grinder",
    stock: 7,
    reorder: 10,
    supplier: "DeWalt Supplier",
    status: "Critical"
  },
  {
    id: 2,
    product: "PVC Elbow 1/2 inch",
    stock: 14,
    reorder: 20,
    supplier: "Local Hardware Supply",
    status: "Low"
  },
  {
    id: 3,
    product: "Electrical Wire 2.0mm",
    stock: 6,
    reorder: 10,
    supplier: "Firefly Electric",
    status: "Critical"
  },
  {
    id: 4,
    product: "Stanley Hammer",
    stock: 32,
    reorder: 10,
    supplier: "Stanley Tools",
    status: "Good"
  },
   {
    id: 4,
    product: "Stanley Hammer",
    stock: 32,
    reorder: 10,
    supplier: "Stanley Tools",
    status: "Good"
  }
];