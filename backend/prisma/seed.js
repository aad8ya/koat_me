import { faker } from "@faker-js/faker";
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const roofTypes = ["Metal", "TPO", "Foam", "Shingle", "Clay Tile", "Asphalt"];

async function main() {
  console.log("🌱 Seeding database with mock quotes...");

  const quotes = Array.from({ length: 1000 }, () => ({
    contractor: faker.person.fullName(),
    company: faker.company.name(),
    roofSize: parseFloat(
      faker.number.float({ min: 500, max: 10000 }).toFixed(2)
    ),
    roofType: faker.helpers.arrayElement(roofTypes),
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
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
