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

export const getQuotes = async (req, res) => {
  const { state, roofTypeId, page = 1, limit = 20 } = req.query;

  const filters = {};
  if (state) filters.state = state;
  if (roofTypeId) filters.roofTypeId = parseInt(roofTypeId);

  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where: filters,
        skip,
        take: parseInt(limit),
        orderBy: { projectDate: "desc" },
        include: { roofType: true },
      }),
      prisma.quote.count({ where: filters }),
    ]);

    return res.status(200).json({
      data: quotes,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error("Error retrieving quotes:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
