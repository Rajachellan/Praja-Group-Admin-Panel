'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  GraduationCap,
  ListChecks,
  Send,
  Building2,
  MapPin,
  CheckCircle2,
  X,
  ChevronRight,
  Layers,
  Award
} from 'lucide-react';
import api from '../../services/api';
import {AxiosError} from 'axios'

export default function CareersDashboardPage() {
  // Pure UI state for interactive form demo
  const [jobName, setJobName] = useState('');
  // const [jobRole, setJobRole] = useState('Civil Engineering');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  
  // Responsibilities UI list
  const [respInput, setRespInput] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);

  // Qualifications UI list
  const [qualInput, setQualInput] = useState('');
  const [qualifications, setQualifications] = useState<string[]>([]);

  const addResponsibility = () => {
    if (respInput.trim()) {
      setResponsibilities([...responsibilities, respInput.trim()]);
      setRespInput('');
    }
  };

  const removeResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const addQualification = () => {
    if (qualInput.trim()) {
      setQualifications([...qualifications, qualInput.trim()]);
      setQualInput('');
    }
  };

  const removeQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  async function addJobFun(e:React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      try{

        const res=await api.post('/add/job',{jobName,experience,location,responsibilities,qualifications})
        alert(res.data.message)
        if (res.data.success) {
          setJobName('')
          setExperience('')
          setLocation('')
          setRespInput('')
          setResponsibilities([])
          setQualInput('')
          setQualifications([])
        }

      }
      catch(err){
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || "Something went wrong");
  }
  }
  

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* 1. Page Header */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 bg-[#166534]/10 text-[#166534] border border-[#166534]/20 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#f37924]" /> Careers Administration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Post a New Job Opening
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
          Create and publish new job vacancies for Prajha Group. Specify job title, role category, experience requirements, key duties, and candidate qualifications.
        </p>
      </div>

      {/* 2. Main Job Post Form */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-8">
        
        {/* Form Title Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#166534]/10 text-[#166534] flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Job Specification Form</h2>
              <p className="text-xs text-slate-500 font-medium">Refer to Career Schema fields</p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Admin Portal
          </span>
        </div>

        <form onSubmit={(e) => addJobFun(e)} className="space-y-8">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#166534]" /> Basic Job Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Job Name */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  Job Name / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Civil Site Engineer"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#166534] focus:bg-white transition-all placeholder:text-slate-400"
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
                    placeholder="e.g. 4 - 7 Years"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#166534] focus:bg-white transition-all placeholder:text-slate-400"
                  />
                  <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Job Location */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  Job Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai, Tamil Nadu"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#166534] focus:bg-white transition-all placeholder:text-slate-400"
                  />
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Key Responsibilities (resposnibilities field) */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[#166534]" /> Key Responsibilities (resposnibilities)
              </h3>
              <span className="text-xs font-bold text-[#166534] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {responsibilities.length} Points Added
              </span>
            </div>

            {/* Input + Add button */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a key responsibility duty and press Enter..."
                value={respInput}
                onChange={(e) => setRespInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addResponsibility();
                  }
                }}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#166534] focus:bg-white transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={addResponsibility}
                className="px-5 py-3 bg-[#166534] hover:bg-[#11532a] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Duty
              </button>
            </div>

            {/* Added list display */}
            {responsibilities.length > 0 && (
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {responsibilities.map((resp, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#166534]/10 text-[#166534] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{resp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeResponsibility(index)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Qualifications & Requirements (qualification field) */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#f37924]" /> Qualifications & Requirements (qualification)
              </h3>
              <span className="text-xs font-bold text-[#f37924] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {qualifications.length} Requirements Added
              </span>
            </div>

            {/* Input + Add button */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a qualification requirement and press Enter..."
                value={qualInput}
                onChange={(e) => setQualInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addQualification();
                  }
                }}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#166534] focus:bg-white transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={addQualification}
                className="px-5 py-3 bg-[#f37924] hover:bg-[#e06816] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Requirement
              </button>
            </div>

            {/* Added list display */}
            {qualifications.length > 0 && (
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {qualifications.map((qual, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-[#f37924] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{qual}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQualification(index)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 bg-[#166534] hover:bg-[#11532a] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#166534]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#f37924]" />
              <span>Post Job Opening</span>
            </button>
          </div>

        </form>
      </div>

      {/* 3. Pure UI Preview Card of Posted Job */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#166534]" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Live Job Card Preview
            </h3>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-[#166534] text-[11px] font-bold rounded-full border border-emerald-200">
            UI Preview
          </span>
        </div>

        <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="px-3 py-1 bg-[#166534]/10 text-[#166534] text-xs font-bold rounded-md">
                {/* {jobRole || 'Civil Engineering'} */}
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-2">
                {jobName || 'Senior Civil Site Engineer'}
              </h4>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#f37924] bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <Clock className="w-4 h-4" />
              <span>Exp: {experience || '4 - 7 Years'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <MapPin className="w-4 h-4 text-[#166534]" />
            <span>{location || 'Job location'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-700 pt-2">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <ListChecks className="w-3.5 h-3.5 text-[#166534]" /> Responsibilities ({responsibilities.length})
              </span>
              <ul className="space-y-1 text-slate-600">
                {responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#166534] shrink-0 mt-1.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <GraduationCap className="w-3.5 h-3.5 text-[#f37924]" /> Qualifications ({qualifications.length})
              </span>
              <ul className="space-y-1 text-slate-600">
                {qualifications.map((q, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f37924] shrink-0 mt-1.5" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
