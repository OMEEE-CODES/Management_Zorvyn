const dashboardService = require("../services/dashboardService");

const getSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary();
    res.status(200).json({ success: true, data: { summary } });
  } catch (error) {
    next(error);
  }
};

const getCategoryBreakdown = async (req, res, next) => {
  try {
    const breakdown = await dashboardService.getCategoryBreakdown();
    res.status(200).json({ success: true, data: { breakdown } });
  } catch (error) {
    next(error);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activity = await dashboardService.getRecentActivity(limit);
    res.status(200).json({ success: true, data: { activity } });
  } catch (error) {
    next(error);
  }
};

const getMonthlyTrends = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const trends = await dashboardService.getMonthlyTrends(months);
    res.status(200).json({ success: true, data: { trends } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getCategoryBreakdown, getRecentActivity, getMonthlyTrends };
