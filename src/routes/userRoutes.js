const express = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");

const router = express.Router();

// All user management routes require authentication + admin permissions
router.use(authenticate);

router.get("/", authorize("users", "read"), userController.getAllUsers);
router.get("/:id", authorize("users", "read"), userController.getUserById);
router.patch("/:id", authorize("users", "update"), userController.updateUser);
router.delete("/:id", authorize("users", "delete"), userController.deleteUser);

module.exports = router;
