const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

console.log(Object.keys(prisma));

prisma.$disconnect();