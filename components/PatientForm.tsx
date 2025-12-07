import React, { useState } from 'react';
import { User, Calendar, Phone, FileText } from 'lucide-react';
import { PatientDetails } from '../types';

interface PatientFormProps {
  onSubmit: (details: PatientDetails) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ onSubmit }) => {
  const [details, setDetails] = useState<PatientDetails>({
    fullName: '',
    fatherName: '',
    age: '',
    gender: 'Male',
    contactNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.fullName && details.age && details.contactNumber) {
      onSubmit(details);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2 bg-cyan-900/30 rounded-lg">
             <FileText className="text-cyan-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Patient Registration</h2>
            <p className="text-xs text-slate-400">Enter details for DGP report</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                name="fullName"
                required
                value={details.fullName}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Father's Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                name="fatherName"
                value={details.fatherName}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                placeholder="Parent Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase">Age</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="number" 
                  name="age"
                  required
                  value={details.age}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                  placeholder="25"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase">Gender</label>
              <select 
                name="gender"
                value={details.gender}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none appearance-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Contact Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="tel" 
                name="contactNumber"
                required
                value={details.contactNumber}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-900/50 transition-all active:scale-95"
          >
            Proceed to Scan
          </button>
        </form>
      </div>
    </div>
  );
};