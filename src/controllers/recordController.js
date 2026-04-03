const recordService = require("../services/recordService");

const createRecord = async (req, res, next) => {
  try {
    const record = await recordService.createRecord(req.body, req.user._id);
    res.status(201).json({
      success: true,
      message: "Record created successfully",
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      type,
      category,
      startDate,
      endDate,
      sortBy,
      order,
    } = req.query;

    const result = await recordService.getRecords({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      type,
      category,
      startDate,
      endDate,
      sortBy,
      order,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getRecordById = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    res.status(200).json({ success: true, data: { record } });
  } catch (error) {
    next(error);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    await recordService.deleteRecord(req.params.id);
    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
