'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  GraduationCap,
  ListChecks,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { CareerFormData } from '../../../types/career';

interface JobFormProps {
  onSubmit: (formData: CareerFormData) => Promise<{ success: boolean; message?: string }>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PRESET_ROLES = [
  'Civil Engineering',
  'Project Management',
  'Site Operations',
  'Architecture & Design',
  'Sales & Admin',
  'Structural Engineering',
  'Quality & Safety',
  'BOQ & Estimation'
];

export default function JobForm({ onSubmit, onSuccess, onCancel }: JobFormProps) {
  const [jobName, setJobName] = useState<string>('');
  const [jobRole, setJobRole] = useState<string>('Civil Engineering');
  const [customRole, setCustomRole] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  
  // Dynamic list state for responsibilities
  const [respInput, setRespInput] = useState<string>('');
  const [resposnibilities, setResposnibilities] = useState<string[]>([]);
  
  // Dynamic list state for qualifications
  const [qualInput, setQualInput] = useState<string>('');
  const [qualification, setQualification] = useState<string[]>([]);

  // Submission UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Responsibilities Handlers
  const addResponsibility = () => {
    if (respInput.trim()) {
      setResposnibilities([...resposnibilities, respInput.trim()]);
      setRespInput('');
    }
  };

  const removeResponsibility = (index: number) => {
    setResposnibilities(resposnibilities.filter((_, i) => i !== index));
  };

  const handleBulkResponsibilities = (text: string) => {
    const lines = text
      .split('\n')
      .map((l) => l.replace(/^[•\-\*\d\.\s]+/, '').trim())
      .filter((l) => l.length > 0);
    if (lines.length > 0) {
      setResposnibilities(lines);
    }
  };

  // Qualifications Handlers
  const addQualification = () => {
    if (qualInput.trim()) {
      setQualification([...qualification, qualInput.trim()]);
      setQualInput('');
    }
  };

  const removeQualification = (index: number) => {
    setQualification(qualification.filter((_, i) => i !== index));
  };

  const handleBulkQualifications = (text: string) => {
    const lines = text
      .split('\n')
      .map((l) => l.replace(/^[•\-\*\d\.\s]+/, '').trim())
      .filter((l) => l.length > 0);
    if (lines.length > 0) {
      setQualification(lines);
    }
  };

  const resetForm = () => {
    setJobName('');
    setJobRole('Civil Engineering');
    setCustomRole('');
    setExperience('');
    setRespInput('');
    setResposnibilities([]);
    setQualInput('');
    setQualification([]);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const finalRole = jobRole === 'Custom' ? customRole.trim() : jobRole;

    // Validation
    if (!jobName.trim()) {
      setErrorMsg('Please enter a Job Name / Title.');
      return;
    }
    if (!finalRole) {
      setErrorMsg('Please select or specify a Job Role.');
      return;
    }
    if (!experience.trim()) {
      setErrorMsg('Please specify required Experience (e.g. 3 - 5 Years).');
      return;
    }

    // Combine any pending input into array
    let finalResp = [...resposnibilities];
    if (respInput.trim()) {
      finalResp.push(respInput.trim());
      setRespInput('');
    }
    if (finalResp.length === 0) {
      setErrorMsg('Please add at least one Key Responsibility.');
      return;
    }

    let finalQual = [...qualification];
    if (qualInput.trim()) {
      finalQual.push(qualInput.trim());
      setQualInput('');
    }
    if (finalQual.length === 0) {
      setErrorMsg('Please add at least one Qualification requirement.');
      return;
    }

    const payload: CareerFormData = {
      jobName: jobName.trim(),
      jobRole: finalRole,
      experience: experience.trim(),
      resposnibilities: finalResp,
      qualification: finalQual
    };

    setLoading(true);

    try {
      const res = await onSubmit(payload);
      if (res.success) {
        setSuccessMsg(res.message || 'Job vacancy posted successfully!');
        resetForm();
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.message || 'Failed to post job.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Server error occurred while posting job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#166534]/10 text-[#166534] border border-[#166534]/20 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#f37924]" /> Create Career Opportunity
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Post a New Job Vacancy
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Fill in the details below. Posted jobs will appear immediately on the Prajha Groups careers portal.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Form
        </button>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>{errorMsg}</div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
          <div>{successMsg}</div>
        </div>
      )}

      {/* Section 1: Basic Information */}
      <div className="space-y-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#166534]" /> 1. Position Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Job Name */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Job Name / Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Civil Site Engineer"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#166534] focus:bg-white transition-all"
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Experience Required <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. 4 - 7 Years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#166534] focus:bg-white transition-all"
              />
              <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Job Role */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Job Role / Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_ROLES.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setJobRole(role)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left truncate border ${
                    jobRole === role
                      ? 'bg-[#166534] text-white border-[#166534] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {role}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setJobRole('Custom')}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left truncate border ${
                  jobRole === 'Custom'
                    ? 'bg-[#166534] text-white border-[#166534] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                + Custom Role
              </button>
            </div>

            {jobRole === 'Custom' && (
              <input
                type="text"
                required
                placeholder="Enter custom job role name..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="mt-3 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#166534] focus:bg-white transition-all"
              />
            )}
          </div>

        </div>
      </div>

      {/* Section 2: Key Responsibilities */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-[#166534]" /> 2. Key Responsibilities
          </h3>
          <span className="text-xs font-bold text-[#166534] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {resposnibilities.length} Points Added
          </span>
        </div>

        {/* Input box + Add button */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a responsibility point and click add..."
            value={respInput}
            onChange={(e) => setRespInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addResponsibility();
              }
            }}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#166534] focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={addResponsibility}
            className="px-5 py-3 bg-[#166534] hover:bg-[#11532a] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Point
          </button>
        </div>

        {/* Dynamic Items List */}
        {resposnibilities.length > 0 && (
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            {resposnibilities.map((resp, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
              >
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#166534]/10 text-[#166534] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{resp}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeResponsibility(index)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bulk paste option */}
        <details className="text-xs text-slate-500 font-medium">
          <summary className="cursor-pointer hover:text-[#166534] font-bold">
            Or paste multiple lines at once (Click to expand)
          </summary>
          <textarea
            rows={3}
            placeholder="Paste multiple lines of responsibilities here..."
            onBlur={(e) => handleBulkResponsibilities(e.target.value)}
            className="mt-2 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#166534]"
          />
        </details>
      </div>

      {/* Section 3: Qualifications & Requirements */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#f37924]" /> 3. Qualifications & Requirements
          </h3>
          <span className="text-xs font-bold text-[#f37924] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            {qualification.length} Requirements Added
          </span>
        </div>

        {/* Input box + Add button */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a qualification/requirement and click add..."
            value={qualInput}
            onChange={(e) => setQualInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addQualification();
              }
            }}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#166534] focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={addQualification}
            className="px-5 py-3 bg-[#f37924] hover:bg-[#e06816] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Requirement
          </button>
        </div>

        {/* Dynamic Items List */}
        {qualification.length > 0 && (
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            {qualification.map((qual, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
              >
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-[#f37924] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{qual}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeQualification(index)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bulk paste option */}
        <details className="text-xs text-slate-500 font-medium">
          <summary className="cursor-pointer hover:text-[#f37924] font-bold">
            Or paste multiple requirements at once (Click to expand)
          </summary>
          <textarea
            rows={3}
            placeholder="Paste multiple lines of qualifications here..."
            onBlur={(e) => handleBulkQualifications(e.target.value)}
            className="mt-2 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#f37924]"
          />
        </details>
      </div>

      {/* Form Action Controls */}
      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#166534] hover:bg-[#11532a] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#166534]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span>Publishing Job...</span>
          ) : (
            <>
              <Send className="w-4 h-4 text-[#f37924]" />
              <span>Post Job Opening</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
