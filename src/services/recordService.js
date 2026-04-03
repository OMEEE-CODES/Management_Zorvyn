const Record = require("../models/Record");

const createRecord = async (data, userId) => {
  const record = await Record.create({ ...data, createdBy: userId });
  return record;
};

const getRecords = async ({
  page = 1,
  limit = 20,
  type,
  category,
  startDate,
  endDate,
  sortBy = "date",
  order = "desc",
}) => {
  const filter = {};

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const sortOrder = order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Record.find(filter)
      .populate("createdBy", "name email role")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Record.countDocuments(filter),
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getRecordById = async (id) => {
  const record = await Record.findById(id).populate(
    "createdBy",
    "name email role"
  );
  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }
  return record;
};

const updateRecord = async (id, updates) => {
  const record = await Record.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "name email role");

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }

  return record;
};

const deleteRecord = async (id) => {
  const record = await Record.findByIdAndDelete(id);
  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }
  return record;
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
