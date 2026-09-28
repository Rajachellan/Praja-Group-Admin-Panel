'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  CalendarDays,
  Mail,
  Phone,
  RefreshCw,
  Search,
  UserRound,
} from 'lucide-react';
import api from '../../services/api';

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
  CareerId: CareerReference | string | null;
  createdAt?: string;
}

export default function JobEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<JobEnquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
          <p className="mt-1 text-sm text-slate-600">Applications submitted for open positions on the careers page.</p>
        </div>
        <button
          type="button"
          onClick={() => void getEnquiries()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
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
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3.5 font-bold">Applicant</th>
                  <th className="px-4 py-3.5 font-bold">Contact</th>
                  <th className="px-4 py-3.5 font-bold">Applied for</th>
                  <th className="px-4 py-3.5 font-bold">About applicant</th>
                  <th className="px-4 py-3.5 font-bold">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.map((enquiry) => {
                  const career = typeof enquiry.CareerId === 'object' ? enquiry.CareerId : null;
                  return (
                    <tr key={enquiry._id} className="align-top transition hover:bg-slate-50/80">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <UserRound className="h-4 w-4 shrink-0 text-[#166534]" />
                          {enquiry.name}
                        </div>
                      </td>
                      <td className="space-y-1.5 px-4 py-4 text-slate-600">
                        <a href={`mailto:${enquiry.email}`} className="flex items-center gap-2 hover:text-[#166534]">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          {enquiry.email}
                        </a>
                        <a href={`tel:${enquiry.phNo}`} className="flex items-center gap-2 hover:text-[#166534]">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          {enquiry.phNo}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        {career ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#166534]">
                            <Briefcase className="h-3.5 w-3.5" />
                            {career.jobName}
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-slate-400">Job posting unavailable</span>
                        )}
                      </td>
                      <td className="max-w-sm px-4 py-4 text-slate-600">
                        <p className="line-clamp-3 whitespace-pre-wrap">{enquiry.about}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                        {enquiry.createdAt ? (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}