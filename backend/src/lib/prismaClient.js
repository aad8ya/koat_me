import { PrismaClient } from "../generated/prisma/index.js";

let prisma;

if (!global._prisma) {
  global._prisma = new PrismaClient();
}

prisma = global._prisma;

export { prisma };
