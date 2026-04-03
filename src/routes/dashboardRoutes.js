const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");

const router = express.Router();

router.use(authenticate);

// Summary - accessible to all authenticated roles
router.get(
  "/summary",
  authorize("dashboard", "read"),
  dashboardController.getSummary
);

router.get(
  "/categories",
  authorize("dashboard", "read"),
  dashboardController.getCategoryBreakdown
);

router.get(
  "/recent",
  authorize("dashboard", "read"),
  dashboardController.getRecentActivity
);

// Trends/Insights - analyst and admin only
router.get(
  "/trends",
  authorize("dashboard", "insights"),
  dashboardController.getMonthlyTrends
);

module.exports = router;
