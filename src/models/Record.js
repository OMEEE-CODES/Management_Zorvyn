const mongoose = require("mongoose");

const RECORD_TYPES = ["income", "expense"];
const CATEGORIES = [
  "salary",
  "investment",
  "freelance",
  "rent",
  "utilities",
  "food",
  "transport",
  "healthcare",
  "entertainment",
  "education",
  "other",
];

const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: RECORD_TYPES,
        message: "Type must be either 'income' or 'expense'",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(", ")}`,
      },
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
recordSchema.index({ date: -1 });
recordSchema.index({ type: 1, category: 1 });
recordSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Record", recordSchema);
module.exports.RECORD_TYPES = RECORD_TYPES;
module.exports.CATEGORIES = CATEGORIES;
