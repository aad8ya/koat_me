import { prisma } from "../lib/prismaClient.js";

export const addRoofType = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Invalid roof type name." });
  }

  try {
    const existing = await prisma.roofType.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: "Roof type already exists." });
    }

    const newRoofType = await prisma.roofType.create({ data: { name } });

    return res.status(201).json({ success: true, roofType: newRoofType });
  } catch (err) {
    console.error("Error creating roof type:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getRoofTypes = async (_, res) => {
  try {
    const types = await prisma.roofType.findMany({ orderBy: { name: "asc" } });

    return res.status(200).json(types);
  } catch (err) {
    console.error("Error fetching roof types:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
