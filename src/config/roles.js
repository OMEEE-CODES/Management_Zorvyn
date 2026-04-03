// Role definitions and their permissions
const ROLES = {
  VIEWER: "viewer",
  ANALYST: "analyst",
  ADMIN: "admin",
};

// Permission matrix: defines what each role can do
const PERMISSIONS = {
  [ROLES.VIEWER]: {
    records: ["read"],
    users: [],
    dashboard: ["read"],
  },
  [ROLES.ANALYST]: {
    records: ["read"],
    users: [],
    dashboard: ["read", "insights"],
  },
  [ROLES.ADMIN]: {
    records: ["create", "read", "update", "delete"],
    users: ["create", "read", "update", "delete"],
    dashboard: ["read", "insights"],
  },
};

const hasPermission = (role, resource, action) => {
  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return false;
  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;
  return resourcePermissions.includes(action);
};

module.exports = { ROLES, PERMISSIONS, hasPermission };
