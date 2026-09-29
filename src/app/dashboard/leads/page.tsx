'use client';

import { useEffect, useState } from "react";
import api from '../../services/api';
import { 
  Contact, 
  Search, 
  RefreshCw, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  FileText, 
  X, 
  AlertCircle,
  ExternalLink,
  Users
} from 'lucide-react';

interface contactedData {
  _id?: string;
  name: string;
  email: string;
  message: string;
  phNo: number | string;
  propertyLocation?: string;
  landArea?: string;
  landOwner?: string;
  propertyType?: string;
  directorRole?: string;
  file?: string;
  createdAt?: string;
}

function Leads() {
  const [datas, setDatas] = useState<contactedData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<contactedData | null>(null);

  async function getDatas() {
    setLoading(true);
    try {
      const res = await api.get('/get/data');
      if (res && res.data && res.data.data) {
        setDatas(res.data.data);
      } else if (res && Array.isArray(res.data)) {
        setDatas(res.data);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDatas();
  }, []);

  // Filtered Leads based on search query
  const filteredDatas = datas.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.phNo && String(item.phNo).includes(q)) ||
      (item.propertyLocation && item.propertyLocation.toLowerCase().includes(q)) ||
      (item.landArea && item.landArea.toLowerCase().includes(q)) ||
      (item.landOwner && item.landOwner.toLowerCase().includes(q)) ||
      (item.propertyType && item.propertyType.toLowerCase().includes(q)) ||
      (item.directorRole && item.directorRole.toLowerCase().includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-slate-900">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/90 via-white to-orange-50/90 p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase bg-[#f37924]/15 text-[#f37924] border border-[#f37924]/30 rounded-full flex items-center gap-1">
              <Contact className="w-3 h-3" /> Prajha Leads Directory
            </span>
            <span className="text-xs font-bold text-slate-500">
              {datas.length} Total Received
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Inquiries & Client Leads
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Contact form submissions fetched directly from server backend.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={getDatas}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-6 shadow-xs">
        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email, phone, location, message..."
              className="w-full bg-slate-50 text-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#f37924] focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          <span className="text-xs font-bold text-slate-500">
            Showing {filteredDatas.length} of {datas.length} leads
          </span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50/80">
              <tr>
                <th className="py-3.5 px-4 font-bold">S.No</th>
                <th className="py-3.5 px-4 font-bold">Client Contact</th>
                <th className="py-3.5 px-4 font-bold">Phone Number</th>
                <th className="py-3.5 px-4 font-bold">Property Location</th>
                <th className="py-3.5 px-4 font-bold">Land Details</th>
                <th className="py-3.5 px-4 font-bold">Directorate Division</th>
                <th className="py-3.5 px-4 font-bold">Message Preview</th>
                <th className="py-3.5 px-4 font-bold">File</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredDatas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300 stroke-1 mb-2" />
                    <p className="text-xs font-bold">
                      {loading ? 'Loading leads from server...' : 'No lead records found.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDatas.map((item, idx) => (
                  <tr key={item._id || idx} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Index */}
                    <td className="py-3.5 px-4 font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Client Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-bold group-hover:text-[#f37924] transition-colors text-[15px]">
                          {item.name}
                        </span>
                        <span className="text-[13px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          {item.email}
                        </span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      <span className="flex items-center gap-1.5 text-[14px]">
                        <Phone className="w-3.5 h-3.5 text-[#166534]" />
                        <span>{item.phNo}</span>
                      </span>
                    </td>

                    {/* Property Location */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      <span className="flex items-center gap-1.5 text-[14px]">
                        <MapPin className="w-3.5 h-3.5 text-[#f37924] shrink-0" />
                        <span className="truncate max-w-[150px]">{item.propertyLocation || 'N/A'}</span>
                      </span>
                    </td>

                    {/* Landowner Enquiry Fields */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      <div className="min-w-[150px] space-y-1">
                        <p><span className="text-slate-400">Type:</span> {item.propertyType || 'N/A'}</p>
                        <p><span className="text-slate-400">Area:</span> {item.landArea || 'N/A'}</p>
                        <p><span className="text-slate-400">Owner:</span> {item.landOwner || 'N/A'}</p>
                      </div>
                    </td>

                    {/* Director Role */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[15px] font-bold">
                        {item.directorRole? item.directorRole : ""}
                      </span>
                    </td>

                    {/* Message Preview */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium max-w-[200px]">
                      <span className="truncate block" title={item.message}>
                        {item.message || 'N/A'}
                      </span>
                    </td>

                    {/* File Attachment */}
                    <td className="py-3.5 px-4">
                      {item.file ? (
                        <a 
                          href={item.file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#166534] hover:underline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View File</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">None</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLead(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#f37924] hover:bg-slate-100 transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 text-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#f37924]/15 text-[#f37924] border border-[#f37924]/30">
                  Lead Details
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">{selectedLead.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Mail className="w-4 h-4 text-[#f37924]" />
                <span>{selectedLead.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Phone className="w-4 h-4 text-[#166534]" />
                <span>{selectedLead.phNo}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Location: {selectedLead.propertyLocation || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Building2 className="w-4 h-4 text-[#166534]" />
                <span>Property type: {selectedLead.propertyType || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <span className="w-4 text-center text-[#166534]">㎡</span>
                <span>Land area: {selectedLead.landArea || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Users className="w-4 h-4 text-[#f37924]" />
                <span>Submitted by: {selectedLead.landOwner || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Users className="w-4 h-4 text-[#f37924]" />
                <span>Assigned Director: <strong>{selectedLead.directorRole}</strong></span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">Inquiry Message:</span>
              <p className="text-xs text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed font-medium">
                "{selectedLead.message}"
              </p>
            </div>

            {selectedLead.file && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-[#166534]">Attached File / Document</span>
                <a 
                  href={selectedLead.file} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-[#166534] text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1"
                >
                  View Document <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leads;