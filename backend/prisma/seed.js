const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding RxConnect PostgreSQL Database...");

  const hashedPassword = await bcrypt.hash("password123", 10);
console.log("Branch delegate:", prisma.branch);
  console.log("User delegate:", prisma.user);

  // 1. Create Branches
  const downtownBranch = await prisma.branch.upsert({
    where: { code: "BR-101" },
    update: {},
    create: {
      code: "BR-101",
      name: "HealthFirst Central Pharmacy - Downtown",
      address: "104 Healthcare Boulevard, City Center",
      phone: "+1 (555) 443-9000",
      fulfillmentRate: 97.4,
    },
  });

  const uptownBranch = await prisma.branch.upsert({
    where: { code: "BR-102" },
    update: {},
    create: {
      code: "BR-102",
      name: "CarePlus Community Pharmacy - Uptown",
      address: "789 Metro Plaza, 2nd Floor",
      phone: "+1 (555) 321-6540",
      fulfillmentRate: 98.2,
    },
  });

  const westsideBranch = await prisma.branch.upsert({
    where: { code: "BR-103" },
    update: {},
    create: {
      code: "BR-103",
      name: "Westside Care Pharmacy",
      address: "550 West End Street",
      phone: "+1 (555) 888-2345",
      fulfillmentRate: 88.5,
    },
  });

  // 2. Create Users
  const customerUser = await prisma.user.upsert({
    where: { email: "customer@rxconnect.com" },
    update: {},
    create: {
      fullName: "Customer User",
      email: "customer@rxconnect.com",
      phone: "+1 (555) 234-5678",
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  const pharmacistUser = await prisma.user.upsert({
    where: { email: "pharmacist@rxconnect.com" },
    update: {},
    create: {
      fullName: "Dr. Sarah Jenkins",
      email: "pharmacist@rxconnect.com",
      phone: "+1 (555) 443-9000",
      password: hashedPassword,
      role: "PHARMACIST",
      employeeId: "PH-109",
      branchId: downtownBranch.id,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@rxconnect.com" },
    update: {},
    create: {
      fullName: "Elena Rostova",
      email: "admin@rxconnect.com",
      phone: "+1 (555) 990-1122",
      password: hashedPassword,
      role: "ADMIN",
      employeeId: "ADM-001",
    },
  });

  const deliveryUser = await prisma.user.upsert({
    where: { email: "delivery@rxconnect.com" },
    update: {},
    create: {
      fullName: "Alex Rivera",
      email: "delivery@rxconnect.com",
      phone: "+91 9876543210",
      password: hashedPassword,
      role: "DELIVERY_PARTNER",
      vehicle: "Honda Activa 6G (KA-19-EX-1234)",
      branchId: downtownBranch.id,
    },
  });

  // 3. Create Medicines
  const medicinesData = [
    {
      name: "Amoxicillin 500mg",
      category: "Antibiotics",
      price: 185.0,
      prescriptionRequired: true,
      dosage: "500mg Capsule",
      manufacturer: "RxHealth Pharma",
      description: "Broad-spectrum antibiotic used to treat bacterial infections.",
    },
    {
      name: "Paracetamol 650mg",
      category: "Pain Relief",
      price: 90.0,
      prescriptionRequired: false,
      dosage: "650mg Tablet",
      manufacturer: "HealthCare Ltd",
      description: "Effective fever reducer and mild to moderate pain reliever.",
    },
    {
      name: "Metformin 500mg",
      category: "Chronic Care",
      price: 220.0,
      prescriptionRequired: true,
      dosage: "500mg Sustained Release",
      manufacturer: "BioMed Labs",
      description: "First-line medication for the treatment of type 2 diabetes.",
    },
    {
      name: "Vitamin C 1000mg",
      category: "Vitamins",
      price: 120.0,
      prescriptionRequired: false,
      dosage: "1000mg Effervescent Tablet",
      manufacturer: "NutraLife",
      description: "Immune support dietary supplement with bioflavonoids.",
    },
    {
      name: "Ibuprofen 400mg",
      category: "Pain Relief",
      price: 80.0,
      prescriptionRequired: false,
      dosage: "400mg Softgel",
      manufacturer: "PainRelief Inc",
      description: "Non-steroidal anti-inflammatory drug (NSAID) for pain & inflammation.",
    },
    {
      name: "Lisinopril 10mg",
      category: "Blood Pressure",
      price: 195.0,
      prescriptionRequired: true,
      dosage: "10mg Tablet",
      manufacturer: "CardioHealth Inc",
      description: "ACE inhibitor used to treat high blood pressure and heart failure.",
    },
  ];

  for (const mData of medicinesData) {
    const med = await prisma.medicine.create({
      data: mData,
    });

    // Create inventory for branches
    await prisma.inventory.create({
      data: {
        medicineId: med.id,
        branchId: downtownBranch.id,
        quantity: Math.floor(Math.random() * 50) + 10,
        threshold: 15,
      },
    });
  }

  // 4. Create Prescriptions
  await prisma.prescription.create({
    data: {
      userId: customerUser.id,
      doctorName: "Dr. Robert Smith",
      notes: "Please provide generic brand if available",
      imageUrl: "https://placehold.co/600x400/0b193c/emerald?text=Doctor+Prescription+Scan",
      status: "APPROVED",
    },
  });

  await prisma.prescription.create({
    data: {
      userId: customerUser.id,
      doctorName: "Dr. Vance",
      notes: "Refill for chronic treatment",
      imageUrl: "https://placehold.co/600x400/0b193c/emerald?text=Pending+Prescription+Scan",
      status: "PENDING",
    },
  });

  // 5. Create Sample Order
  await prisma.order.create({
    data: {
      id: "RX-88412",
      customerId: customerUser.id,
      branchId: downtownBranch.id,
      deliveryPartnerId: deliveryUser.id,
      status: "OUT_FOR_DELIVERY",
      totalAmount: 345.0,
      destination: "742 Evergreen Terrace, Springfield, IL 62704",
      paymentMethod: "CARD",
      paymentStatus: "PAID",
      items: {
        create: [
          { medicineName: "Amoxicillin 500mg", quantity: 1, price: 185.0, isRx: true },
          { medicineName: "Vitamin C 1000mg", quantity: 1, price: 160.0, isRx: false },
        ],
      },
    },
  });

  console.log("Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
