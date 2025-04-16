import { PrismaClient } from "../../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const STATE_ENUMS = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

async function main() {
  console.log("🌱 Populating roofTypes and temp quote fields...");

  // Fetch distinct roofType strings
  const uniqueRoofTypes = await prisma.quote.findMany({
    distinct: ["roofType"],
    select: { roofType: true },
  });

  const createdTypes = {};

  for (const entry of uniqueRoofTypes) {
    const name = entry.roofType?.trim();
    if (!name) continue;

    const type = await prisma.roofType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdTypes[name] = type.id;
  }

  // Update each quote with the foreign key (roofTypeIdTemp)
  for (const [name, id] of Object.entries(createdTypes)) {
    await prisma.quote.updateMany({
      where: { roofType: name },
      data: { roofTypeIdTemp: id },
    });
  }

  // Populate stateTemp based on state string
  const quotes = await prisma.quote.findMany({
    select: { id: true, state: true },
  });

  for (const { id, state } of quotes) {
    const stateAbbr = state?.toUpperCase()?.trim();
    if (STATE_ENUMS.includes(stateAbbr)) {
      await prisma.quote.update({
        where: { id },
        data: { stateTemp: stateAbbr },
      });
    } else {
      console.warn(`Skipping invalid state: ${state}`);
    }
  }

  console.log(
    "✅ roofType + temp fields (roofTypeIdTemp, stateTemp) in quote populated."
  );
}

main()
  .catch((e) => {
    console.error("❌ Error during script execution:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
