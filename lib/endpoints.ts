// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `/account/register`,
  LOGIN: `/auth/token`,
  GETUSER: `/user/GetLoginUser`,
} as const;

// Assets Endpoints
export const ASSETS_ENDPOINTS = {
  LIST: `/assets/search`,
  CREATE: `/assets`,
  SINGLE: (id: string) => `/assets/${id}`,
  EDIT: `/assets/edit`,
  APPROVE: `/assets/update-approval-status`,
  BULK: `/assets/upload-excel`,
} as const;

// Assets Finance Endpoints
export const ASSETS_FINANCE_ENDPOINTS = {
  CREATE: `/assets/finances`,
} as const;

// Branch Endpoints
export const BRANCH_ENDPOINTS = {
  LIST: `/branches/search`,
  CREATE: `/branches`,
  EDIT: `/branches/edit`,
  SINGLE: (id: string) => `/branches/${id}`,
};

// Categories Endpoints
export const CATEGORIES_ENDPOINTS = {
  LIST: `/categories/search`,
  CREATE: `/categories`,
  SINGLE: (id: string) => `/categories/${id} `,
  EDIT: `/categories/edit`,
} as const;

// Dashboard Endpoints
export const DASHBOARD_ENDPOINTS = {
  OVERVIEW: `/branch-dashboard`,
  ADMIN_OVERVIEW: `/admin-dashboard`,
} as const;

// Departments
export const DEPARTMENTS = {
  LIST: `/departments/search`,
  CREATE: `/departments`,
  SINGLE: (id: string) => `/departments/${id}`,
  EDIT: `/departments/edit`,
} as const;
// Events logs
export const EVENT_LOGS_ENDPOINTS = {
  LIST: (id: string) => `/event/${id}`,
} as const;

// fiscal years
export const FISCALYEAR = {
  LIST: `/fiscalyear/search`,
  CREATE: `/fiscalyear`,
  SINGLE: (id: string) => `/fiscalyears/${id}`,
  EDIT: `/fiscalyear/edit`,
} as const;

// organizations
export const ORGANIZATIONS = {
  LIST: `/global/tenants/search`,
  AUTHORIZED: `/global/tenants/authorize`,
} as const;

// Roles
export const ROLES_ENDPOINTS = {
  LIST: `/global/roles/search`,
  CREATE: `/global/roles`,
  ASSIGN: `/global/roles/assign-role`,
} as const;

// ROles Authorization Endpoints
export const ROLES_AUTHORIZATION_ENDPOINTS = {
  CREATE: `/global/roles/add-scope`,
  REMOVE: `/global/roles/remove-scope`,
} as const;

// user Endpoints
export const USER_ENDPOINTS = {
  LIST: `/users/search`,

  CREATE: `/users`,
} as const;

// organization
export const ORGANIZATION_USERS = {
  LIST: `/global/users/search`,
  ALLLIST: `/global/users/searchAll`,
};

// Report

export const REPORT_ENDPOINTS = {
  LIST: `/report/search`,
  CREATE: `/reports`,
  SINGLE: (id: string) => `/reports/${id}`,
} as const;

// All endpoints combined for easy access
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  ASSETS: ASSETS_ENDPOINTS,
  ASSETS_FINANCE: ASSETS_FINANCE_ENDPOINTS,
  BRANCHES: BRANCH_ENDPOINTS,
  CATEGORIES: CATEGORIES_ENDPOINTS,
  DASHBOARD: DASHBOARD_ENDPOINTS,
  DEPARTMENTS: DEPARTMENTS,
  FISCALYEAR: FISCALYEAR,
  ORGANIZATIONS: ORGANIZATIONS,
  ORAGNIZATIONSUSERS: ORGANIZATION_USERS,
  ROLE: ROLES_ENDPOINTS,
  ROLES_AUTHORIZATION: ROLES_AUTHORIZATION_ENDPOINTS,
  USERS: USER_ENDPOINTS,
  EVENT_LOGS: EVENT_LOGS_ENDPOINTS,
  REPORT: REPORT_ENDPOINTS,
} as const;

export default API_ENDPOINTS;