'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Lock,
  Mail,
  User,
  ShieldAlert,
  Sparkles,
  LayoutDashboard,
  NotepadText,
  BookOpen,
  Contact,
  BriefcaseBusiness,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  ShieldX
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/app/services/api';
import { getUser, AdminUser, SYSTEM_SECTIONS, SystemSection, ROOT_SUPER_ADMIN, isSuperAdmin } from '@/lib/auth';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'editor' | 'viewer' | string;
  status: 'active' | 'inactive';
  permissions: string[];
  lastLogin?: string;
  createdAt?: string;
}

const SECTION_ICON_MAP: Record<string, React.ElementType> = {
  overview: LayoutDashboard,
  blogs: NotepadText,
  'uploaded-blogs': BookOpen,
  leads: Contact,
  careers: Contact,
  jobEnquiry: BriefcaseBusiness,
  'user-access': ShieldCheck,
};

export default function UserAccessManagementPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [sections, setSections] = useState<SystemSection[]>(SYSTEM_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamMember | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Delete State
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<TeamMember | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    status: 'active',
    permissions: ['overview', 'blogs', 'uploaded-blogs', 'leads', 'careers', 'jobEnquiry'],
  });

  useEffect(() => {
    setCurrentUser(getUser());
    fetchUsers();
    fetchSections();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/user/all');
      if (res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch admin users:', err);
      // Fallback try /admin/users
      try {
        const fallbackRes = await api.get('/admin/users');
        if (fallbackRes.data.success) {
          setUsers(fallbackRes.data.data || []);
          return;
        }
      } catch (e) {}
      setError(err.response?.data?.message || 'Failed to load user access directory');
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await api.get('/user/sections');
      if (res.data.success && Array.isArray(res.data.data)) {
        setSections(res.data.data);
      }
    } catch (err) {
      // Fallback to default SYSTEM_SECTIONS already present
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'admin',
      status: 'active',
      permissions: ['overview', 'blogs', 'uploaded-blogs', 'leads', 'careers', 'jobEnquiry'],
    });
    setModalError(null);
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user: TeamMember) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status || 'active',
      permissions: Array.isArray(user.permissions) ? [...user.permissions] : ['overview'],
    });
    setModalError(null);
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleTogglePermission = (sectionId: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(sectionId);
      const newPerms = exists
        ? prev.permissions.filter((p) => p !== sectionId)
        : [...prev.permissions, sectionId];
      return { ...prev, permissions: newPerms };
    });
  };

  const applyPreset = (preset: 'all' | 'content' | 'operations' | 'clear') => {
    if (preset === 'all') {
      setFormData((prev) => ({
        ...prev,
        permissions: sections.map((s) => s.id),
      }));
    } else if (preset === 'content') {
      setFormData((prev) => ({
        ...prev,
        permissions: ['overview', 'blogs', 'uploaded-blogs'],
      }));
    } else if (preset === 'operations') {
      setFormData((prev) => ({
        ...prev,
        permissions: ['overview', 'leads', 'careers', 'jobEnquiry'],
      }));
    } else if (preset === 'clear') {
      setFormData((prev) => ({
        ...prev,
        permissions: ['overview'],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    try {
      if (editingUser) {
        // Update User
        const payload: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          permissions: formData.role === 'super-admin' ? sections.map((s) => s.id) : formData.permissions,
        };
        if (formData.password.trim()) {
          payload.password = formData.password.trim();
        }

        const res = await api.put(`/user/${editingUser._id}`, payload);
        if (res.data.success) {
          toast.success('Admin user updated successfully');
          setIsModalOpen(false);
          fetchUsers();
        }
      } else {
        // Create User
        if (!formData.password || formData.password.length < 6) {
          setModalError('Password must be at least 6 characters');
          setModalLoading(false);
          return;
        }

        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          status: formData.status,
          permissions: formData.role === 'super-admin' ? sections.map((s) => s.id) : formData.permissions,
        };

        const res = await api.post('/user/create', payload);
        if (res.data.success) {
          toast.success('New administrator onboarded successfully');
          setIsModalOpen(false);
          fetchUsers();
        }
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      const msg = err.response?.data?.message || 'Failed to save admin user';
      setModalError(msg);
      toast.error(msg);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setDeleteLoading(true);
    try {
      const res = await api.delete(`/user/${deleteConfirmUser._id}`, {
        data: { requesterEmail: currentUser?.email },
      });
      if (res.data.success) {
        toast.success(`Removed admin account: ${deleteConfirmUser.name}`);
        setDeleteConfirmUser(null);
        fetchUsers();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to remove user account';
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats
  const totalCount = users.length;
  const superAdminCount = users.filter((u) => u.role === 'super-admin').length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const restrictedCount = users.filter((u) => u.role !== 'super-admin').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60 shadow-xs">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                User Access & Permissions
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Onboard administrators, configure granular section permissions, and control team role-based access.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#12542a] text-white font-bold text-xs shadow-md shadow-emerald-900/15 transition-all transform active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Administrator</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Administrators</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalCount}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Accounts</span>
            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">{activeCount}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold border border-purple-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Super Admins</span>
            <h3 className="text-2xl font-black text-purple-700 mt-0.5">{superAdminCount}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold border border-orange-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custom / Scoped Roles</span>
            <h3 className="text-2xl font-black text-orange-700 mt-0.5">{restrictedCount}</h3>
          </div>
        </div>
      </div>

      {/* Directory Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white text-slate-900 font-medium"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Roles</option>
            <option value="super-admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="inactive">Inactive / Suspended</option>
          </select>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Loading Team Permissions...
            </p>
          </div>
        ) : error ? (
          <div className="p-10 text-center flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm font-bold text-slate-800">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-2 text-xs font-bold text-teal-600 hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No administrator accounts match your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">User Details</th>
                  <th className="py-3.5 px-6">System Role</th>
                  <th className="py-3.5 px-6">Permitted Sections</th>
                  <th className="py-3.5 px-6">Account Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((u) => {
                  const isCurrent = currentUser && (currentUser.email === u.email || currentUser._id === u._id);
                  const isSuper = u.role === 'super-admin';
                  const isRoot = u.email.toLowerCase() === ROOT_SUPER_ADMIN.toLowerCase();
                  const userPerms = Array.isArray(u.permissions) ? u.permissions : [];

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0">
                            {u.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                              {u.name}
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-teal-100 text-teal-800">
                                  You
                                </span>
                              )}
                              {isRoot && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800">
                                  Root Superadmin
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-slate-400 truncate">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6">
                        {isSuper ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-purple-100 text-purple-700 border border-purple-200">
                            <Sparkles className="w-3.5 h-3.5" />
                            SUPER ADMIN
                          </span>
                        ) : u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            ADMIN
                          </span>
                        ) : u.role === 'editor' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-sky-100 text-sky-700 border border-sky-200">
                            EDITOR
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-600 border border-slate-200">
                            VIEWER
                          </span>
                        )}
                      </td>

                      {/* Permitted Sections */}
                      <td className="py-4 px-6">
                        {isSuper ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                            Full Unrestricted Access
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 max-w-sm">
                            {userPerms.map((perm) => {
                              const s = sections.find((sec) => sec.id === perm);
                              return (
                                <span
                                  key={perm}
                                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80"
                                >
                                  {s?.label || perm}
                                </span>
                              );
                            })}
                            {userPerms.length === 0 && (
                              <span className="text-xs text-slate-400 italic">No modules granted</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {u.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="p-2 rounded-xl text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                            title="Edit User Permissions"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmUser(u)}
                            disabled={isCurrent || isRoot}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                            title={
                              isCurrent
                                ? 'Cannot delete your own account'
                                : isRoot
                                ? 'Root Super Admin cannot be deleted'
                                : 'Delete User Account'
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboard / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center font-bold">
                  {editingUser ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {editingUser ? 'Edit User Permissions & Roles' : 'Onboard New Administrator'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingUser
                      ? 'Modify credentials, assigned system role, and accessible modules.'
                      : 'Create a new team member and assign accessible system modules.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {modalError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Two Column Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="rahul@prajhagroup.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password {editingUser ? '(leave blank to keep unchanged)' : '*'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={editingUser ? '••••••••' : 'Min. 6 characters'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-teal-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-teal-500 outline-none"
                  >
                    <option value="active">Active (Permitted to log in)</option>
                    <option value="inactive">Inactive (Suspended / Deactivated)</option>
                  </select>
                </div>
              </div>

              {/* System Role Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  System Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'super-admin', title: 'Super Admin', desc: 'Full unrestricted power' },
                    { id: 'admin', title: 'Admin', desc: 'Standard operations' },
                    { id: 'editor', title: 'Editor', desc: 'Content & leads scope' },
                    { id: 'viewer', title: 'Viewer', desc: 'Read-only audit scope' },
                  ].map((roleOption) => {
                    const isSelected = formData.role === roleOption.id;
                    return (
                      <button
                        key={roleOption.id}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            role: roleOption.id,
                            permissions:
                              roleOption.id === 'super-admin'
                                ? sections.map((s) => s.id)
                                : roleOption.id === 'editor'
                                ? ['overview', 'blogs', 'uploaded-blogs']
                                : roleOption.id === 'viewer'
                                ? ['overview']
                                : formData.permissions,
                          });
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`font-black text-xs ${
                              isSelected ? 'text-teal-900' : 'text-slate-800'
                            }`}
                          >
                            {roleOption.title}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 stroke-[3]" />}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium leading-tight">
                          {roleOption.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Module & Section Permissions */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 pt-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Module & Section Permissions
                    </label>
                    <p className="text-[11px] text-slate-500">
                      {formData.role === 'super-admin'
                        ? 'Super Admin automatically receives full unrestricted access to all modules.'
                        : 'Select which navigation sections and management dashboards this user is allowed to access.'}
                    </p>
                  </div>

                  {formData.role !== 'super-admin' && (
                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => applyPreset('all')}
                        className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset('content')}
                        className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        Content
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset('operations')}
                        className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        Operations
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset('clear')}
                        className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {sections.map((section) => {
                    const isSuper = formData.role === 'super-admin';
                    const isChecked = isSuper || formData.permissions.includes(section.id);
                    const Icon = SECTION_ICON_MAP[section.id] || LayoutDashboard;

                    return (
                      <div
                        key={section.id}
                        onClick={() => !isSuper && handleTogglePermission(section.id)}
                        className={`p-3 rounded-2xl border transition-all flex items-start gap-3 select-none ${
                          isSuper
                            ? 'opacity-85 bg-teal-50/30 border-teal-200/60 cursor-default'
                            : isChecked
                            ? 'bg-teal-50/50 border-teal-500 cursor-pointer shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isChecked
                              ? 'bg-teal-600 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Icon
                              className={`w-3.5 h-3.5 ${
                                isChecked ? 'text-teal-600' : 'text-slate-400'
                              }`}
                            />
                            <span
                              className={`text-xs font-bold leading-tight ${
                                isChecked ? 'text-teal-950' : 'text-slate-800'
                              }`}
                            >
                              {section.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-1">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {modalLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{editingUser ? 'Save Changes' : 'Onboard User'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Revoke & Delete Admin Account</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently remove{' '}
                <strong className="text-slate-800">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDeleteUser}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {deleteLoading && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>Confirm & Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
