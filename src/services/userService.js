const User = require("../models/User");
const { ROLES } = require("../config/roles");

const getAllUsers = async ({ page = 1, limit = 20, role, isActive }) => {
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive;

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateUser = async (id, updates) => {
  // Prevent updating password through this route
  delete updates.password;

  if (updates.role && !Object.values(ROLES).includes(updates.role)) {
    const error = new Error(
      `Invalid role. Must be one of: ${Object.values(ROLES).join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const deleteUser = async (id, requestingUserId) => {
  if (id === requestingUserId.toString()) {
    const error = new Error("You cannot delete your own account");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
