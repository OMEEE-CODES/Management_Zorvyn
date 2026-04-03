const Record = require("../models/Record");

const getSummary = async () => {
  const [totals] = await Record.aggregate([
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
        },
        totalExpenses: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  if (!totals) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
      totalRecords: 0,
    };
  }

  return {
    totalIncome: totals.totalIncome,
    totalExpenses: totals.totalExpenses,
    netBalance: totals.totalIncome - totals.totalExpenses,
    totalRecords: totals.count,
  };
};

const getCategoryBreakdown = async () => {
  const breakdown = await Record.aggregate([
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { total: -1 },
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        total: 1,
        count: 1,
      },
    },
  ]);

  return breakdown;
};

const getRecentActivity = async (limit = 10) => {
  const records = await Record.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .limit(limit);

  return records;
};

const getMonthlyTrends = async (months = 12) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const trends = await Record.aggregate([
    {
      $match: { date: { $gte: startDate } },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        type: "$_id.type",
        total: 1,
        count: 1,
      },
    },
  ]);

  return trends;
};

module.exports = { getSummary, getCategoryBreakdown, getRecentActivity, getMonthlyTrends };
