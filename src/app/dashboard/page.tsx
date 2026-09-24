'use client';

import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { 
  Building2, 
  HardHat, 
  Wrench, 
  Mail, 
  RefreshCw, 
  Trash2, 
  Eye, 
  Sparkles, 
  Activity, 
  ChevronRight, 
  X,
  Server,
  Download,
  Plus,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Phone,
  BarChart3,
  Users,
  CheckCircle2
} from 'lucide-react';

export interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phNo: string | number;
  propertyLocation: string;
  directorRole: 'Bussiness Development' | 'Construction' | 'Facility Management' | string;
  message: string;
  status: 'New' | 'Reviewed' | 'In Progress' | 'Completed';
  createdAt: string;
}

const normalizeRole = (role?: string) => (role ?? '').toLowerCase().trim();

interface DashboardPageProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  searchQuery?: string;
  selectedDivision?: string;
}

export default function DashboardPage({
  activeTab = 'overview',
  setActiveTab,
  searchQuery = '',
  selectedDivision = 'All'
}: DashboardPageProps) {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [isApiConnected, setIsApiConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('');
  const [adminUser, setAdminUser] = useState<string>('PRAJHA_EXECUTIVE@1234');

  // New Inquiry Form State
  const [newInquiry, setNewInquiry] = useState({
    name: '',
    email: '',
    phNo: '',
    propertyLocation: '',
    directorRole: 'Bussiness Development',
    message: ''
  });

  // Read admin user info on client render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('name');
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        setAdminUser(storedEmail.toUpperCase());
      } else if (storedName) {
        setAdminUser(storedName.toUpperCase());
      }
    }
  }, []);

  const fetchBackendInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/get/data');
      const data = res.data?.data ?? res.data;
      setInquiries(Array.isArray(data) ? data : []);
      setIsApiConnected(true);
      const now = new Date();
      setLastSyncedTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      setInquiries([]);
      setIsApiConnected(false);
      const now = new Date();
      setLastSyncedTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendInquiries();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Real Data Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesSearch = 
        !searchQuery ||
        (inq.name && inq.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inq.email && inq.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inq.propertyLocation && inq.propertyLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inq.message && inq.message.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDivision = 
        selectedDivision === 'All' ||
        normalizeRole(inq.directorRole).includes(normalizeRole(selectedDivision));

      return matchesSearch && matchesDivision;
    });
  }, [inquiries, searchQuery, selectedDivision]);

  // Dynamic Real Metrics
  const metrics = useMemo(() => {
    const total = inquiries.length;
    const businessDev = inquiries.filter((inq) => normalizeRole(inq.directorRole).includes('business') || normalizeRole(inq.directorRole).includes('bussiness'));
    const construction = inquiries.filter((inq) => normalizeRole(inq.directorRole).includes('construction'));
    const facility = inquiries.filter((inq) => normalizeRole(inq.directorRole).includes('facility'));

    const newCount = inquiries.filter((inq) => inq.status === 'New' || !inq.status).length;
    const reviewedCount = inquiries.filter((inq) => inq.status === 'Reviewed').length;
    const inProgressCount = inquiries.filter((inq) => inq.status === 'In Progress').length;
    const completedCount = inquiries.filter((inq) => inq.status === 'Completed').length;

    return {
      total,
      businessDev,
      construction,
      facility,
      newCount,
      reviewedCount,
      inProgressCount,
      completedCount,
      businessCount: businessDev.length,
      constructionCount: construction.length,
      facilityCount: facility.length
    };
  }, [inquiries]);

  // Handle inquiry status update
  const handleUpdateStatus = (id: string, newStatus: ContactInquiry['status']) => {
    setInquiries(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
    if (selectedInquiry?._id === id) {
      setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Status updated to "${newStatus}"`);
  };

  // Handle inquiry delete
  const handleDeleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(item => item._id !== id));
    if (selectedInquiry?._id === id) setSelectedInquiry(null);
    showToast('Inquiry entry removed');
  };

  // Handle Create Inquiry Submit
  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInquiry.name || !newInquiry.email || !newInquiry.message || !newInquiry.phNo) {
      showToast('Please fill all required fields');
      return;
    }

    try {
      await api.post('/add/contact', newInquiry);
      showToast('New lead successfully saved to Prajha database!');
      await fetchBackendInquiries();
    } catch {
      showToast('Unable to save lead to the database.');
    }

    setShowAddModal(false);
    setNewInquiry({
      name: '',
      email: '',
      phNo: '',
      propertyLocation: '',
      directorRole: 'Bussiness Development',
      message: ''
    });
  };

  // Export Real Data CSV
  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      showToast('No data available to export');
      return;
    }
    const headers = 'ID,Name,Email,Phone,Location,Director Role,Status,Submitted Date\n';
    const rows = filteredInquiries.map(i => 
      `"${i._id}","${(i.name || '').replace(/"/g, '""')}","${(i.email || '').replace(/"/g, '""')}","${i.phNo}","${(i.propertyLocation || '').replace(/"/g, '""')}","${(i.directorRole || '').replace(/"/g, '""')}","${i.status || 'New'}","${i.createdAt ? new Date(i.createdAt).toLocaleDateString() : ''}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prajha_Groups_Real_Leads_${Date.now()}.csv`;
    a.click();
    showToast('CSV export generated successfully');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-[#f37924]/50 text-[#f37924] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-[#f37924] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main View Content by Active Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Hero Banner - Exact Kalam Kitchen Admin Styling */}
          <div className="bg-gradient-to-r from-[#0c2419] via-[#103c2a] to-[#165532] text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#166534]/50">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#20b26c]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-2 z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold tracking-wide backdrop-blur-md text-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Prajha Groups Admin Dashboard
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2 flex-wrap">
                Welcome back, <span className="text-emerald-400 font-black">{adminUser}</span> 👋
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/80 font-medium leading-relaxed">
                Here is your operations overview for Prajha Groups. Manage Inquiries, Business Development, Construction Projects, and Facility Management seamlessly.
              </p>
            </div>

            <div className="flex items-center gap-3 z-10 shrink-0">
              <button
                onClick={fetchBackendInquiries}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 backdrop-blur-sm flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-emerald-300 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Metrics</span>
              </button>
            </div>
          </div>

          {/* Top 4 Metrics Cards Grid (Exact Design from Reference Image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Contact Inquiries */}
            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] border border-emerald-100 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                {setActiveTab && (
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors border border-emerald-200/60"
                  >
                    View All
                  </button>
                )}
              </div>

              <div className="mt-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  CONTACT INQUIRIES
                </span>
                <p className="text-3xl font-black text-slate-900 mt-1">{metrics.total}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">User contact form submissions</p>
              </div>
            </div>

            {/* Card 2: Business Dev Leads */}
            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-full border border-sky-200">
                  {metrics.businessCount} Active
                </span>
              </div>

              <div className="mt-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  BUSINESS DEV LEADS
                </span>
                <p className="text-3xl font-black text-slate-900 mt-1">{metrics.businessCount}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">Land acquisition & JV proposals</p>
              </div>
            </div>

            {/* Card 3: Active Construction */}
            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-all border-l-4 border-l-[#f37924]">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
                  <HardHat className="w-5 h-5" />
                </div>
                {setActiveTab && (
                  <button
                    onClick={() => setActiveTab('construction')}
                    className="text-[10px] font-extrabold text-white bg-[#f37924] hover:bg-[#d96518] px-3 py-1 rounded-full transition-colors shadow-xs"
                  >
                    Manage
                  </button>
                )}
              </div>

              <div className="mt-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  CONSTRUCTION INQUIRIES
                </span>
                <p className="text-3xl font-black text-slate-900 mt-1">{metrics.constructionCount}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">Turnkey & civil site inquiries</p>
              </div>
            </div>

            {/* Card 4: Facility Management */}
            <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                {setActiveTab && (
                  <button
                    onClick={() => setActiveTab('facility')}
                    className="text-[10px] font-extrabold text-purple-800 bg-purple-100 hover:bg-purple-200 px-2.5 py-1 rounded-full transition-colors border border-purple-200"
                  >
                    Review
                  </button>
                )}
              </div>

              <div className="mt-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  FACILITY MANAGEMENT
                </span>
                <p className="text-3xl font-black text-slate-900 mt-1">{metrics.facilityCount}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">Building maintenance & upkeep</p>
              </div>
            </div>
          </div>

          {/* Bottom Two-Column Layout (Exact Kalam Kitchen Structure) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column (2/3 width): Quick Management Actions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  QUICK MANAGEMENT ACTIONS
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Action Card 1 */}
                <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Manage All Inquiries</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Filter client form submissions, view details, update status, and manage records.
                    </p>
                  </div>
                  {setActiveTab && (
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 pt-2 group w-fit"
                    >
                      <span>Go to Leads Manager</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </div>

                {/* Action Card 2 */}
                <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Business Development Pipeline</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Inspect land acquisition proposals, investor partnerships, and commercial deals.
                    </p>
                  </div>
                  {setActiveTab && (
                    <button
                      onClick={() => setActiveTab('business-dev')}
                      className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1.5 pt-2 group w-fit"
                    >
                      <span>View Business Dev</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </div>

                {/* Action Card 3 */}
                <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
                      <HardHat className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Construction Directorate</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Monitor turnkey civil project requests, site inquiries, and engineering proposals.
                    </p>
                  </div>
                  {setActiveTab && (
                    <button
                      onClick={() => setActiveTab('construction')}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 pt-2 group w-fit"
                    >
                      <span>View Construction</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </div>

                {/* Action Card 4 */}
                <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Facility Management Portal</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Track property upkeep inquiries, building service requests, and maintenance.
                    </p>
                  </div>
                  {setActiveTab && (
                    <button
                      onClick={() => setActiveTab('facility')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1.5 pt-2 group w-fit"
                    >
                      <span>View Facility Mgmt</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (1/3 width): System Operational Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  SYSTEM OPERATIONAL STATUS
                </h2>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs space-y-4">
                {/* Status Item 1: API Server */}
                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">API Server</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {isApiConnected ? 'Connected & Responsive' : 'Disconnected'}
                    </p>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-md ${isApiConnected ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
                    {isApiConnected ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                {/* Status Item 2: Last Synced */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Last Synced</p>
                      <p className="text-[11px] text-slate-500 font-medium">Auto refresh active</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {lastSyncedTime || 'Just now'}
                  </span>
                </div>

                {/* Dark Info Card (Exact match to reference image bottom card) */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#0c2419] to-[#144d33] text-white space-y-2 border border-[#166534]/50 shadow-xs">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                    PRAJHA ADMIN OPERATIONS
                  </h4>
                  <p className="text-xs text-emerald-100/90 font-medium leading-relaxed">
                    Use the mobile navigation drawer (top left hamburger icon) or desktop sidebar to switch between modules, manage leads, and review group directorates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Inquiries Tab */}
      {activeTab === 'inquiries' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">All Database Leads & Form Submissions</h2>
              <p className="text-xs text-slate-500 font-medium">Real-time database records across all Prajha Groups directorates</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Showing {filteredInquiries.length} of {metrics.total} records
              </span>
            </div>
          </div>

          <InquiriesTable 
            inquiries={filteredInquiries} 
            onSelect={setSelectedInquiry}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteInquiry}
          />
        </div>
      )}

      {/* Business Development Tab */}
      {activeTab === 'business-dev' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 p-6 rounded-3xl space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Business Development & Joint Ventures</h2>
                <p className="text-xs text-slate-500 font-medium">Real client inquiries routed to the Director of Business Development</p>
              </div>
              <span className="px-3 py-1 bg-[#166534]/15 text-[#166534] border border-[#166534]/30 rounded-full text-xs font-extrabold w-fit">
                {metrics.businessCount} Real Inquiries
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl border border-[#166534]/30 bg-emerald-50/40 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Division Leads</span>
                <p className="text-2xl font-black text-[#166534]">{metrics.businessCount}</p>
                <p className="text-[11px] text-slate-600 font-medium">Land & commercial proposals</p>
              </div>

              <div className="p-5 rounded-2xl border border-[#f37924]/30 bg-orange-50/40 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Pending Review</span>
                <p className="text-2xl font-black text-[#f37924]">
                  {metrics.businessDev.filter(i => i.status === 'New' || !i.status).length}
                </p>
                <p className="text-[11px] text-slate-600 font-medium">Awaiting director action</p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Locations Represented</span>
                <p className="text-2xl font-black text-slate-900">
                  {new Set(metrics.businessDev.map(i => (i.propertyLocation || '').trim()).filter(Boolean)).size}
                </p>
                <p className="text-[11px] text-slate-600 font-medium">Unique project locations</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Business Development Inquiries Table</h3>
            <InquiriesTable 
              inquiries={metrics.businessDev}
              onSelect={setSelectedInquiry}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteInquiry}
            />
          </div>
        </div>
      )}

      {/* Construction Projects Tab */}
      {activeTab === 'construction' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 p-6 rounded-3xl space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Construction Directorate Operations</h2>
                <p className="text-xs text-slate-500 font-medium">Turnkey civil developments, structural inquiries, and site requests</p>
              </div>
              <span className="px-3 py-1 bg-[#f37924]/15 text-[#f37924] border border-[#f37924]/30 rounded-full text-xs font-extrabold w-fit">
                {metrics.constructionCount} Real Inquiries
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl border border-[#f37924]/30 bg-orange-50/40 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Construction Inquiries</span>
                <p className="text-2xl font-black text-[#f37924]">{metrics.constructionCount}</p>
                <p className="text-[11px] text-slate-600 font-medium">Turnkey civil & building queries</p>
              </div>

              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">In Progress / Reviewed</span>
                <p className="text-2xl font-black text-[#166534]">
                  {metrics.construction.filter(i => i.status === 'Reviewed' || i.status === 'In Progress' || i.status === 'Completed').length}
                </p>
                <p className="text-[11px] text-slate-600 font-medium">Actively processed inquiries</p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">New Pending</span>
                <p className="text-2xl font-black text-slate-900">
                  {metrics.construction.filter(i => i.status === 'New' || !i.status).length}
                </p>
                <p className="text-[11px] text-slate-600 font-medium">Newly received from clients</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Construction Inquiries Table</h3>
            <InquiriesTable 
              inquiries={metrics.construction}
              onSelect={setSelectedInquiry}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteInquiry}
            />
          </div>
        </div>
      )}

      {/* Facility Management Tab */}
      {activeTab === 'facility' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 p-6 rounded-3xl space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Facility Management Directorate</h2>
                <p className="text-xs text-slate-500 font-medium">Building maintenance, security, electrical, HVAC, and commercial upkeep inquiries</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-extrabold w-fit">
                {metrics.facilityCount} Real Inquiries
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Facility Leads</span>
                <p className="text-2xl font-black text-slate-900">{metrics.facilityCount}</p>
                <p className="text-[11px] text-slate-500 font-medium">Real database records</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">New Inquiries</span>
                <p className="text-2xl font-black text-[#f37924]">
                  {metrics.facility.filter(i => i.status === 'New' || !i.status).length}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">Direct requests from clients</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Resolved / Completed</span>
                <p className="text-2xl font-black text-[#166534]">
                  {metrics.facility.filter(i => i.status === 'Completed').length}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">Completed facility services</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Facility Management Inquiries Table</h3>
            <InquiriesTable 
              inquiries={metrics.facility}
              onSelect={setSelectedInquiry}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteInquiry}
            />
          </div>
        </div>
      )}

      {/* Directors & Team Tab */}
      {activeTab === 'directors' && (
        <div className="bg-white border border-slate-200/90 p-6 rounded-3xl space-y-6 shadow-xs">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Board of Directors & Directorate Status</h2>
            <p className="text-xs text-slate-500 font-medium">Live inquiry distribution and pending workload routed to each Director</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: 'Bussiness Development',
                title: 'Director of Business Development',
                desc: 'Oversees land acquisitions, investor partnerships, and commercial JV proposals.',
                color: 'bg-emerald-50/50 border-[#166534]/30 text-[#166534]',
                inquiries: metrics.businessDev
              },
              {
                role: 'Construction',
                title: 'Director of Construction',
                desc: 'Directs turnkey civil developments, site engineering, and project delivery execution.',
                color: 'bg-orange-50/50 border-[#f37924]/30 text-[#f37924]',
                inquiries: metrics.construction
              },
              {
                role: 'Facility Management',
                title: 'Director of Facility Management',
                desc: 'Manages building operations, maintenance deployment, and client service SLAs.',
                color: 'bg-slate-50 border-slate-200 text-emerald-700',
                inquiries: metrics.facility
              }
            ].map((dir, i) => {
              const pendingCount = dir.inquiries.filter(inq => inq.status === 'New' || !inq.status).length;

              return (
                <div key={i} className={`p-6 rounded-2xl ${dir.color} border space-y-4 flex flex-col justify-between shadow-xs`}>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200">
                      {dir.role}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">{dir.title}</h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{dir.desc}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-200/80 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-semibold">Total Inquiries:</span>
                      <strong className="text-slate-900 font-bold">{dir.inquiries.length}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-semibold">Pending New:</span>
                      <span className="font-extrabold text-[#f37924] px-2 py-0.5 rounded bg-white border border-slate-200">
                        {pendingCount} Pending
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analytics Tab - Real Database Metrics */}
      {activeTab === 'analytics' && (
        <div className="bg-white border border-slate-200/90 p-6 rounded-3xl space-y-6 shadow-xs">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Real Database Analytics & Lead Conversion</h2>
            <p className="text-xs text-slate-500 font-medium">Metrics derived from active database records</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#f37924]" /> Real Inquiry Status Funnel
              </h3>
              <div className="space-y-3 text-xs font-semibold text-slate-700">
                <div className="flex justify-between items-center">
                  <span>New Incoming Leads</span>
                  <strong className="text-slate-900 font-bold">{metrics.newCount}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Director Reviewed</span>
                  <strong className="text-slate-900 font-bold">{metrics.reviewedCount}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>In Progress</span>
                  <strong className="text-[#f37924] font-bold">{metrics.inProgressCount}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completed</span>
                  <strong className="text-[#166534] font-bold">{metrics.completedCount}</strong>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#166534]" /> Directorate Lead Share
              </h3>
              <div className="space-y-3 text-xs font-semibold text-slate-700">
                <div className="flex justify-between items-center">
                  <span>Business Development</span>
                  <strong className="text-slate-900 font-bold">{metrics.businessCount} leads</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Construction Directorate</span>
                  <strong className="text-slate-900 font-bold">{metrics.constructionCount} leads</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Facility Management</span>
                  <strong className="text-slate-900 font-bold">{metrics.facilityCount} leads</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200/90 p-6 rounded-3xl space-y-6 shadow-xs">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">System & Backend Sync Settings</h2>
            <p className="text-xs text-slate-500 font-medium">Server endpoint details and real-time database sync</p>
          </div>

          <div className="max-w-xl space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Prajha Server API Endpoint</label>
              <input 
                type="text" 
                readOnly
                value="http://localhost:8000/api"
                className="w-full bg-white text-slate-900 text-xs p-3 rounded-xl border border-slate-200 font-mono focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isApiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-xs font-bold text-slate-700">
                  {isApiConnected ? `Backend Online (${metrics.total} Records)` : 'Syncing Server...'}
                </span>
              </div>

              <button 
                onClick={fetchBackendInquiries}
                disabled={isLoading}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-xs"
              >
                Test Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 text-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#f37924]/15 text-[#f37924] border border-[#f37924]/30">
                  Inquiry Detail #{selectedInquiry._id.slice(-6)}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">{selectedInquiry.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Mail className="w-4 h-4 text-[#f37924]" />
                <span>{selectedInquiry.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Phone className="w-4 h-4 text-[#166534]" />
                <span>{selectedInquiry.phNo}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{selectedInquiry.propertyLocation || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Users className="w-4 h-4 text-[#f37924]" />
                <span>Target Directorate: <strong>{selectedInquiry.directorRole}</strong></span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">Inquiry Message Content:</span>
              <p className="text-xs text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed font-medium">
                "{selectedInquiry.message}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Update Status:</span>
                <select
                  value={selectedInquiry.status || 'New'}
                  onChange={(e) => {
                    handleUpdateStatus(selectedInquiry._id, e.target.value as any);
                  }}
                  className="bg-slate-50 text-xs font-bold text-[#f37924] border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Lead / Inquiry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateInquiry}
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 text-slate-900"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#f37924]" /> Create New Lead Entry
              </h3>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Client Name *</label>
                <input 
                  type="text" 
                  required
                  value={newInquiry.name}
                  onChange={(e) => setNewInquiry({ ...newInquiry, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50 text-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#f37924] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={newInquiry.email}
                  onChange={(e) => setNewInquiry({ ...newInquiry, email: e.target.value })}
                  placeholder="client@company.com"
                  className="w-full bg-slate-50 text-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#f37924] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                <input 
                  type="text" 
                  required
                  value={newInquiry.phNo}
                  onChange={(e) => setNewInquiry({ ...newInquiry, phNo: e.target.value })}
                  placeholder="9876543210"
                  className="w-full bg-slate-50 text-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#f37924] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Director Division</label>
                <select
                  value={newInquiry.directorRole}
                  onChange={(e) => setNewInquiry({ ...newInquiry, directorRole: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#f37924] focus:bg-white"
                >
                  <option value="Bussiness Development">Business Development</option>
                  <option value="Construction">Construction</option>
                  <option value="Facility Management">Facility Management</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Property Location</label>
              <input 
                type="text" 
                value={newInquiry.propertyLocation}
                onChange={(e) => setNewInquiry({ ...newInquiry, propertyLocation: e.target.value })}
                placeholder="e.g. OMR IT Expressway, Chennai"
                className="w-full bg-slate-50 text-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#f37924] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Inquiry Message *</label>
              <textarea 
                rows={3}
                required
                value={newInquiry.message}
                onChange={(e) => setNewInquiry({ ...newInquiry, message: e.target.value })}
                placeholder="Details about the project or proposal..."
                className="w-full bg-slate-50 text-slate-900 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#f37924] focus:bg-white resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>

              <button 
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-[#166534] to-[#f37924] text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-sm"
              >
                Submit Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Inquiries Table
function InquiriesTable({
  inquiries,
  onSelect,
  onUpdateStatus,
  onDelete
}: {
  inquiries: ContactInquiry[];
  onSelect: (inq: ContactInquiry) => void;
  onUpdateStatus: (id: string, status: ContactInquiry['status']) => void;
  onDelete: (id: string) => void;
}) {
  if (inquiries.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 space-y-2">
        <AlertCircle className="w-8 h-8 mx-auto text-slate-400 stroke-1" />
        <p className="text-xs font-bold">No matching inquiries found in database</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="text-[11px] text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50/80">
          <tr>
            <th className="py-3 px-3.5 font-bold">Client Name</th>
            <th className="py-3 px-3.5 font-bold">Location</th>
            <th className="py-3 px-3.5 font-bold">Director Division</th>
            <th className="py-3 px-3.5 font-bold">Status</th>
            <th className="py-3 px-3.5 font-bold">Date</th>
            <th className="py-3 px-3.5 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
          {inquiries.map((inq) => {
            const statusColors: Record<string, string> = {
              New: 'bg-[#f37924]/15 text-[#f37924] border-[#f37924]/30',
              Reviewed: 'bg-[#166534]/15 text-[#166534] border-[#166534]/30',
              'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
              Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200'
            };

            const currentStatus = inq.status || 'New';

            return (
              <tr key={inq._id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="py-3.5 px-3.5">
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-bold group-hover:text-[#f37924] transition-colors">{inq.name}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{inq.email}</span>
                  </div>
                </td>

                <td className="py-3.5 px-3.5 text-slate-700 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[160px]">{inq.propertyLocation || 'N/A'}</span>
                  </span>
                </td>

                <td className="py-3.5 px-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {inq.directorRole || 'General'}
                  </span>
                </td>

                <td className="py-3.5 px-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${statusColors[currentStatus] || statusColors.New}`}>
                    {currentStatus}
                  </span>
                </td>

                <td className="py-3.5 px-3.5 text-slate-500 text-[11px] font-medium">
                  {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}
                </td>

                <td className="py-3.5 px-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onSelect(inq)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#f37924] hover:bg-slate-100"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(inq._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Entry"
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
  );
}
