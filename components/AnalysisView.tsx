import React from 'react';
import { AnalysisResult } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { RotateCcw, AlertTriangle, Fingerprint, Printer, CheckCircle2 } from 'lucide-react';

interface AnalysisViewProps {
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  onReset: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ isAnalyzing, result, onReset }) => {
  
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full max-w-md mx-auto p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="relative w-32 h-32 mb-8">
           <Fingerprint className="w-full h-full text-slate-800" />
           <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-spin border-t-cyan-400"></div>
           <div className="absolute inset-4 border-4 border-slate-700/30 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-xl font-bold text-cyan-400 animate-pulse">DGP Analysis In Progress...</h2>
        <p className="text-slate-400 text-sm mt-2">Processing biometric markers</p>
        <div className="w-48 h-1 bg-slate-800 mt-6 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 animate-[scan_2s_ease-in-out_infinite] w-full origin-left"></div>
        </div>
      </div>
    );
  }

  if (!result || !result.detected) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-slate-900 rounded-2xl border border-red-900/50">
        <div className="flex flex-col items-center text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-red-500" />
          <h2 className="text-xl font-bold text-white">Analysis Failed</h2>
          <p className="text-slate-400 text-sm">
            {result?.error || "We couldn't process the biometric data. Please ensure the finger is placed correctly."}
          </p>
          <button
            onClick={onReset}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white text-slate-900 rounded-none md:rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      
      {/* Report Header */}
      <div className="bg-slate-900 p-6 border-b-4 border-cyan-500 text-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Fingerprint className="text-cyan-400" />
            DGP <span className="text-cyan-400 font-light">LABS</span>
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Digit Blood Print Report</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Report ID</p>
          <p className="font-mono text-cyan-400 font-bold">{result.reportId}</p>
        </div>
      </div>

      <div className="p-8 space-y-8 bg-slate-50">
        
        {/* Patient Details Section */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b pb-2">Patient Demographics</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div>
              <p className="text-slate-500 text-xs">Full Name</p>
              <p className="font-bold text-slate-800">{result.patientDetails?.fullName}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Father's Name</p>
              <p className="font-bold text-slate-800">{result.patientDetails?.fatherName}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Age / Gender</p>
              <p className="font-bold text-slate-800">{result.patientDetails?.age} Yrs / {result.patientDetails?.gender}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Contact</p>
              <p className="font-bold text-slate-800">{result.patientDetails?.contactNumber}</p>
            </div>
          </div>
        </div>

        {/* Primary Result */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
          
          <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-2">Predicted Blood Group</h2>
          <div className="text-6xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            {result.predictedBloodGroup}
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-emerald-300 text-xs font-bold">{result.confidenceScore}% Confidence</span>
          </div>
          <p className="mt-4 text-xs text-slate-400 capitalize">Pattern Detected: <span className="text-white">{result.fingerprintType}</span></p>
        </div>

        {/* Detailed Probabilities */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Probability Distribution</h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.probabilities} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="group" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#f8fafc', fontSize: '12px' }}
                />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                  {result.probabilities?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.group === result.predictedBloodGroup ? '#06b6d4' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="text-blue-800 font-bold text-xs uppercase mb-2">Medical Reasoning</h4>
          <p className="text-blue-900/80 text-sm leading-relaxed">
            {result.reasoning}
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-6 flex flex-col items-center gap-4">
           <div className="text-[10px] text-slate-400 text-center leading-tight max-w-xs">
             <p className="font-bold">DISCLAIMER</p>
             <p>This report is generated by AI (DGP Model v1.0) using statistical dermatoglyphic analysis. It is experimental and NOT a substitute for clinical blood testing.</p>
           </div>
           
           <div className="flex gap-4 w-full justify-center">
             <button
               onClick={() => window.print()}
               className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors"
             >
               <Printer size={16} />
               Print Report
             </button>
             <button
               onClick={onReset}
               className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-cyan-900/20"
             >
               <RotateCcw size={16} />
               New Patient
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};