import { prisma } from "../lib/prismaClient.js";

export const submitQuote = async (req, res) => {
  const { contractor, company, roofSize, roofType, city, state, projectDate } =
    req.body;

  if (
    !contractor ||
    !company ||
    !roofSize ||
    !roofType ||
    !city ||
    !state ||
    !projectDate
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newQuote = await prisma.quote.create({
      data: {
        contractor,
        company,
        roofSize: parseFloat(roofSize),
        roofType,
        city,
        state,
        projectDate: new Date(projectDate),
      },
    });

    return res.status(201).json({ success: true, quote: newQuote });
  } catch (err) {
    console.error("Error submitting quote:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
