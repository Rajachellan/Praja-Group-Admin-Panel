export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'editor' | 'viewer' | string;
  status: 'active' | 'inactive';
  permissions: string[];
  lastLogin?: string;
  createdAt?: string;
}

export interface SystemSection {
  id: string;
  label: string;
  description: string;
  path: string;
}

export const SYSTEM_SECTIONS: SystemSection[] = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    description: 'Main dashboard overview, real-time metrics, and summary KPIs',
    path: '/dashboard',
  },
  {
    id: 'blogs',
    label: 'Blogs Management',
    description: 'Create, draft, and compose new blog articles for Praja Group',
    path: '/dashboard/blogs',
  },
  {
    id: 'uploaded-blogs',
    label: 'Uploaded Blogs',
    description: 'Manage, edit, publish, or remove published articles and media',
    path: '/dashboard/blogs/manage',
  },
  {
    id: 'leads',
    label: 'Inquiries & Leads',
    description: 'Track contact inquiries, corporate client leads, and follow-ups',
    path: '/dashboard/leads',
  },
  {
    id: 'careers',
    label: 'Careers Management',
    description: 'Publish and manage career openings across group divisions',
    path: '/dashboard/careers',
  },
  {
    id: 'jobEnquiry',
    label: 'Job Applications',
    description: 'Review candidate applications, resumes, and recruitment pipeline',
    path: '/dashboard/jobEnquiry',
  },
  {
    id: 'user-access',
    label: 'User Access & Permissions',
    description: 'Onboard administrators, assign section permissions, and manage roles',
    path: '/dashboard/user-access',
  },
];

export const ROOT_SUPER_ADMIN = 'prajhaconnect@gmail.com';

/**
 * Retrieves the current logged-in user from localStorage
 */
export const getUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;

  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      if (parsed && parsed.email) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore JSON parse error and fallback
  }

  const email = localStorage.getItem('email');
  if (!email) return null;

  const name = localStorage.getItem('name') || localStorage.getItem('username') || 'Admin User';
  const role = (localStorage.getItem('role') as any) || (email.toLowerCase() === ROOT_SUPER_ADMIN ? 'super-admin' : 'admin');
  const status = (localStorage.getItem('status') as any) || 'active';

  let permissions: string[] = [];
  try {
    const permStr = localStorage.getItem('permissions');
    if (permStr) {
      permissions = JSON.parse(permStr);
    }
  } catch (e) {}

  if (role === 'super-admin') {
    permissions = SYSTEM_SECTIONS.map((s) => s.id);
  }

  return {
    _id: '',
    name,
    email,
    role,
    status,
    permissions,
  };
};

/**
 * Checks if the logged in user is a Super Admin
 */
export const isSuperAdmin = (user?: AdminUser | null): boolean => {
  if (!user) user = getUser();
  if (!user) return false;
  return user.role === 'super-admin' || user.email.toLowerCase() === ROOT_SUPER_ADMIN;
};

/**
 * Checks whether user has permission to access a specific section
 */
export const hasPermission = (user: AdminUser | null | undefined, sectionId: string): boolean => {
  if (!user) user = getUser();
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  if (!user.permissions || !Array.isArray(user.permissions)) return false;
  return user.permissions.includes('*') || user.permissions.includes(sectionId);
};
