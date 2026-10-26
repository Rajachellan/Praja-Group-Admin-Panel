'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  CalendarDays,
  ExternalLink,
  Eye,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  Search,
  UserRound,
  X,
  FileSpreadsheet,
  FileDown,
} from 'lucide-react';
import api from '../../services/api';
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';

interface CareerReference {
  _id: string;
  jobName: string;
}

interface JobEnquiry {
  _id: string;
  name: string;
  email: string;
  phNo: string;
  about: string;
  resume?: string;
  CareerId: CareerReference | string | null;
  createdAt?: string;
}

export default function JobEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<JobEnquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<JobEnquiry | null>(null);

  const getEnquiries = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await api.get('/get/job/enquiries');
      setEnquiries(Array.isArray(response.data.enquiries) ? response.data.enquiries : []);
    } catch (error) {
      console.error('Unable to fetch job enquiries:', error);
      setErrorMessage('Could not load job applications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void getEnquiries();
  }, [getEnquiries]);

  const filteredEnquiries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return enquiries;

    return enquiries.filter((enquiry) => {
      const jobName = typeof enquiry.CareerId === 'object' && enquiry.CareerId
        ? enquiry.CareerId.jobName
        : '';
      return [enquiry.name, enquiry.email, enquiry.phNo, enquiry.about, jobName]
        .some((value) => String(value ?? '').toLowerCase().includes(query));
    });
  }, [enquiries, searchQuery]);

  const handleExportExcel = () => {
    if (filteredEnquiries.length === 0) return;
    const exportData = filteredEnquiries.map((enquiry, idx) => {
      const jobName = typeof enquiry.CareerId === 'object' && enquiry.CareerId
        ? enquiry.CareerId.jobName
        : 'Direct / General Job Enquiry';
      return {
        'S.No': idx + 1,
        'Applicant Name': enquiry.name || '',
        'Email Address': enquiry.email || '',
        'Phone Number': enquiry.phNo || '',
        'Position Applied': jobName,
        'Resume URL': enquiry.resume || 'None',
        'About / Cover Note': enquiry.about || '',
        'Date Applied': enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString() : 'N/A',
      };
    });

    const dateStr = new Date().toISOString().split('T')[0];
    exportToExcel(exportData, `Prajha_Job_Applications_${dateStr}`, 'Applications');
  };

  const handleExportPdf = () => {
    if (filteredEnquiries.length === 0) return;
    const columns = [
      'S.No',
      'Applicant Name',
      'Contact Info',
      'Position Applied',
      'Resume',
      'Cover Note / Experience',
      'Date Applied',
    ];

    const rows = filteredEnquiries.map((enquiry, idx) => {
      const jobName = typeof enquiry.CareerId === 'object' && enquiry.CareerId
        ? enquiry.CareerId.jobName
        : 'General Application';
      return [
        idx + 1,
        enquiry.name || '',
        `${enquiry.email || ''}\n${enquiry.phNo || ''}`,
        jobName,
        enquiry.resume ? 'Attached (View in Portal)' : 'Not attached',
        (enquiry.about || '').length > 120 ? `${(enquiry.about || '').substring(0, 120)}...` : (enquiry.about || 'N/A'),
        enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : 'N/A',
      ];
    });

    const dateStr = new Date().toISOString().split('T')[0];
    exportToPdf({
      title: 'Job Applications & Candidate Directory',
      subtitle: 'Confidential Candidate Applications Report',
      fileName: `Prajha_Job_Applications_${dateStr}`,
      columns,
      rows,
      orientation: 'landscape',
    });
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 pb-12 text-slate-900">
      <header className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/90 bg-gradient-to-r from-emerald-50/90 via-white to-orange-50/90 p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#166534]/20 bg-[#166534]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#166534]">
              <Briefcase className="h-3 w-3" /> Careers
            </span>
            <span className="text-xs font-bold text-slate-500">{enquiries.length} applications received</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Job Applications</h1>
          <p className="mt-1 text-sm text-slate-600">Review applicants, candidate resumes, and submission details.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={filteredEnquiries.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50/80 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-300"
            title="Download applications as Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#166534]" />
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={filteredEnquiries.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-orange-50/80 text-orange-900 text-xs font-bold border border-orange-200 shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-orange-300"
            title="Download applications as PDF (.pdf)"
          >
            <FileDown className="w-4 h-4 text-[#f37924]" />
            <span>Export PDF</span>
          </button>

          <button
            type="button"
            onClick={() => void getEnquiries()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      <section className="space-y-5 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search applicant, email, phone, or job title…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#166534] focus:bg-white"
            />
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Showing {filteredEnquiries.length} of {enquiries.length} applications
          </p>
        </div>

        {errorMessage ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : loading && enquiries.length === 0 ? (
          <div role="status" className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center text-sm text-slate-500">
            Loading applications…
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="font-bold text-slate-700">No job applications found</p>
            <p className="mt-1 text-sm text-slate-500">
              {searchQuery ? 'Try another search term.' : 'New applications will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3.5 font-bold">Applicant</th>
                  <th className="px-4 py-3.5 font-bold">Contact</th>
                  <th className="px-4 py-3.5 font-bold">Applied for</th>
                  <th className="px-4 py-3.5 font-bold">Resume</th>
                  <th className="px-4 py-3.5 font-bold">About applicant</th>
                  <th className="px-4 py-3.5 font-bold">Received</th>
                  <th className="px-4 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.map((enquiry) => {
                  const career = typeof enquiry.CareerId === 'object' ? enquiry.CareerId : null;
                  return (
                    <tr key={enquiry._id} className="align-top transition hover:bg-slate-50/80 group">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-[#166534] transition-colors">
                          <UserRound className="h-4 w-4 shrink-0 text-[#166534]" />
                          {enquiry.name}
                        </div>
                      </td>
                      <td className="space-y-1.5 px-4 py-4 text-slate-600">
                        <a href={`mailto:${enquiry.email}`} className="flex items-center gap-2 hover:text-[#166534] transition-colors">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="text-xs">{enquiry.email}</span>
                        </a>
                        <a href={`tel:${enquiry.phNo}`} className="flex items-center gap-2 hover:text-[#166534] transition-colors">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span className="text-xs">{enquiry.phNo}</span>
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        {career ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#166534] border border-emerald-200/60">
                            <Briefcase className="h-3.5 w-3.5" />
                            {career.jobName}
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-slate-400">Job posting unavailable</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {enquiry.resume ? (
                          <a
                            href={enquiry.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#166534] transition hover:bg-[#166534] hover:text-white"
                            title="Open Resume"
                          >
                            <FileText className="h-3.5 w-3.5 shrink-0" />
                            <span>View Resume</span>
                            <ExternalLink className="h-3 w-3 shrink-0 opacity-75" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-400">
                            Not attached
                          </span>
                        )}
                      </td>
                      <td className="max-w-xs px-4 py-4 text-slate-600">
                        <p className="line-clamp-2 text-xs leading-relaxed whitespace-pre-wrap">{enquiry.about}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                        {enquiry.createdAt ? (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-[#166534] transition-colors"
                          title="View Details"
                          aria-label="View application details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Applicant Detail Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedEnquiry(null);
          }}
        >
          <div className="relative my-auto max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#166534]/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#166534]">
                  Application Details
                </span>
                <h3 className="mt-1 text-xl font-black text-slate-900">{selectedEnquiry.name}</h3>
                {selectedEnquiry.createdAt && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    Applied on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Target Job Role */}
            <div className="rounded-2xl border border-emerald-100 bg-[#F0FDF4] p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534]">Applied Position</span>
              <div className="mt-1 flex items-center gap-2 font-bold text-slate-900 text-base">
                <Briefcase className="h-4 w-4 text-[#166534]" />
                {typeof selectedEnquiry.CareerId === 'object' && selectedEnquiry.CareerId?.jobName
                  ? selectedEnquiry.CareerId.jobName
                  : 'Direct / General Job Enquiry'}
              </div>
            </div>

            {/* Applicant Contact Details */}
            <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Contact Information</span>
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <Mail className="h-4 w-4 text-[#F37924] shrink-0" />
                <a href={`mailto:${selectedEnquiry.email}`} className="hover:text-[#166534] underline">
                  {selectedEnquiry.email}
                </a>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <Phone className="h-4 w-4 text-[#166534] shrink-0" />
                <a href={`tel:${selectedEnquiry.phNo}`} className="hover:text-[#166534]">
                  {selectedEnquiry.phNo}
                </a>
              </div>
            </div>

            {/* Resume Card */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">Resume / CV Document:</span>
              {selectedEnquiry.resume ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#166534] text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Candidate Resume</p>
                      <p className="text-[11px] text-slate-500">Uploaded via Cloudflare R2 / Server storage</p>
                    </div>
                  </div>
                  <a
                    href={selectedEnquiry.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#166534] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#11532a] shrink-0 shadow-xs"
                  >
                    <span>Open Resume</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-xs font-medium text-slate-400">
                  No resume file was attached with this application.
                </div>
              )}
            </div>

            {/* Applicant Message / Cover Note */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">About the Applicant:</span>
              <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                {selectedEnquiry.about}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}