const express = require("express");
const { body } = require("express-validator");
const recordController = require("../controllers/recordController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(authenticate);

const recordValidation = [
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be 'income' or 'expense'"),
  body("category").notEmpty().withMessage("Category is required"),
  body("date").optional().isISO8601().withMessage("Date must be a valid date"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

// Read - accessible to viewer, analyst, admin
router.get("/", authorize("records", "read"), recordController.getRecords);
router.get(
  "/:id",
  authorize("records", "read"),
  recordController.getRecordById
);

// Create/Update/Delete - admin only
router.post(
  "/",
  authorize("records", "create"),
  recordValidation,
  validate,
  recordController.createRecord
);
router.patch(
  "/:id",
  authorize("records", "update"),
  recordController.updateRecord
);
router.delete(
  "/:id",
  authorize("records", "delete"),
  recordController.deleteRecord
);

module.exports = router;
