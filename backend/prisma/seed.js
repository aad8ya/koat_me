import { faker } from "@faker-js/faker";
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const roofTypes = [
  { name: "Metal", energySavings: 10 },
  { name: "TPO", energySavings: 18 },
  { name: "Foam", energySavings: 25 },
  { name: "Shingle", energySavings: 15 },
  { name: "Clay Tile", energySavings: 22 },
  { name: "Asphalt", energySavings: 12 },
];

async function main() {
  console.log("🌱 Seeding database with mock quotes...");

  const roofTypeMap = {};

  for (const rt of roofTypes) {
    const roofType = await prisma.roofType.upsert({
      where: { name: rt.name },
      update: { energySavings: rt.energySavings },
      create: {
        name: rt.name,
        energySavings: rt.energySavings,
      },
    });
    roofTypeMap[rt.name] = roofType.id;
  }

  const quotes = Array.from({ length: 1000 }, () => ({
    contractor: faker.person.fullName(),
    company: faker.company.name(),
    roofSize: parseFloat(
      faker.number.float({ min: 500, max: 10000 }).toFixed(2)
    ),
    roofTypeId:
      roofTypeMap[faker.helpers.arrayElement(roofTypes.map((rt) => rt.name))],
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    projectDate: faker.date.between({ from: "2023-01-01", to: "2025-01-01" }),
  }));

  await prisma.quote.createMany({
    data: quotes,
    skipDuplicates: true,
  });

  console.log("✅ Done seeding.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
