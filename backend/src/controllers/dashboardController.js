import { prisma } from "../lib/prismaClient.js";
import { format } from "date-fns";

const fetchProjectsByState = async (filters) => {
  return await prisma.quote.groupBy({
    by: ["state"],
    where: filters,
    _count: true,
  });
};

const fetchAvgRoofSizeByType = async (filters) => {
  const roofTypes = await prisma.roofType.findMany();

  const rawAvgRoofSize = await prisma.quote.groupBy({
    by: ["roofTypeId"],
    where: filters,
    _avg: {
      roofSize: true,
    },
  });

  return rawAvgRoofSize.map((item) => {
    const roofType = roofTypes.find((rt) => rt.id === item.roofTypeId);

    return {
      roofType: roofType?.name || "Unknown",
      avgRoofSize: parseFloat(item._avg.roofSize.toFixed(2)),
    };
  });
};

const fetchEnergySavingsByType = async (filters) => {
  const quotes = await prisma.quote.findMany({
    where: filters,
    include: {
      roofType: true,
    },
  });

  const energySavingsByTypeMap = {};

  for (const quote of quotes) {
    const { roofType } = quote;
    if (!roofType || roofType.energySavings == null) continue;

    const savingsPerSqFt = roofType.energySavings / 100;
    const estimatedKwhSaved = quote.roofSize * savingsPerSqFt;

    if (!energySavingsByTypeMap[roofType.id]) {
      energySavingsByTypeMap[roofType.id] = {
        roofTypeName: roofType.name,
        totalKwhSaved: 0,
        projectCount: 0,
      };
    }

    energySavingsByTypeMap[roofType.id].totalKwhSaved += estimatedKwhSaved;
    energySavingsByTypeMap[roofType.id].projectCount += 1;
  }

  return Object.values(energySavingsByTypeMap).map((item) => ({
    ...item,
    totalKwhSaved: parseFloat(item.totalKwhSaved.toFixed(2)),
  }));
};

const fetchMonthlyProjects = async (filters) => {
  const filteredQuotes = await prisma.quote.findMany({
    where: filters,
    select: {
      projectDate: true,
    },
  });

  const monthlyMap = {};
  filteredQuotes.forEach(({ projectDate }) => {
    const month = format(new Date(projectDate), "yyyy-MM"); // e.g., '2025-04'
    if (!monthlyMap[month]) monthlyMap[month] = 0;
    monthlyMap[month]++;
  });
  return Object.entries(monthlyMap)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([month, count]) => ({
      month,
      count,
    }));
};

export const getDashboardSummary = async (req, res) => {
  try {
    const { state, roofTypeId, startDate, endDate } = req.query;

    const filters = {};
    if (state) filters.state = { in: req.query.state?.split(",") };
    if (roofTypeId)
      filters.roofTypeId = { in: req.query.roofTypeId?.split(",").map(Number) };
    if (startDate || endDate) {
      filters.projectDate = {};
      if (startDate) filters.projectDate.gte = new Date(startDate);
      if (endDate) filters.projectDate.lte = new Date(endDate);
    }

    const [
      projectsByState,
      avgRoofSizeByType,
      energySavingsByType,
      monthlyProjects,
      totalProjects,
      avgRoofSizeAgg,
    ] = await Promise.all([
      fetchProjectsByState(filters),
      fetchAvgRoofSizeByType(filters),
      fetchEnergySavingsByType(filters),
      fetchMonthlyProjects(filters),
      prisma.quote.count({ where: filters }),
      prisma.quote.aggregate({
        where: filters,
        _avg: { roofSize: true },
      }),
    ]);

    const totalEnergySaved = energySavingsByType.reduce(
      (acc, curr) => acc + curr.totalKwhSaved,
      0
    );
    setTimeout(() => {
      return res.status(200).json({
        projectsByState,
        avgRoofSizeByType,
        energySavingsByType,
        monthlyProjects,
        summaryStats: {
          totalProjects,
          avgRoofSize: parseFloat(
            avgRoofSizeAgg._avg.roofSize?.toFixed(2) || "0"
          ),
          totalEnergySaved: parseFloat(totalEnergySaved.toFixed(2)),
        },
      });
      console.log("Delayed for 5 second.");
    }, "5000");
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
