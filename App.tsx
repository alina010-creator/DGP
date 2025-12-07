import React, { useState } from 'react';
import { Scanner } from './components/Scanner';
import { AnalysisView } from './components/AnalysisView';
import { PatientForm } from './components/PatientForm';
import { analyzeFingerprint } from './services/geminiService';
import { AnalysisResult, AppState, PatientDetails } from './types';
import { Fingerprint } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.FORM);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null);

  const handlePatientSubmit = (details: PatientDetails) => {
    setPatientDetails(details);
    setAppState(AppState.SCANNING);
  };

  const handleCapture = async (base64Image: string) => {
    if (!patientDetails) return;

    setAppState(AppState.ANALYZING);
    // Add artificial delay for UX if simulation
    const startTime = Date.now();
    
    const analysis = await analyzeFingerprint(base64Image, patientDetails);
    
    const elapsedTime = Date.now() - startTime;
    const minTime = 3000; // Minimum 3 seconds analysis for dramatic effect
    
    if (elapsedTime < minTime) {
      setTimeout(() => {
        setResult(analysis);
        setAppState(AppState.RESULTS);
      }, minTime - elapsedTime);
    } else {
      setResult(analysis);
      setAppState(AppState.RESULTS);
    }
  };

  const handleReset = () => {
    setResult(null);
    setPatientDetails(null);
    setAppState(AppState.FORM);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 pb-12">
      {/* Header */}
      <header className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-500 rounded text-white">
              <Fingerprint className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white">
              DGP <span className="text-cyan-400 font-light">PRO</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono text-slate-400">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        
        {appState === AppState.FORM && (
          <PatientForm onSubmit={handlePatientSubmit} />
        )}

        {appState === AppState.SCANNING && (
           <div className="flex flex-col items-center w-full animate-in fade-in duration-300">
             <div className="text-center mb-6 max-w-lg">
               <h2 className="text-xl font-bold text-white mb-2">Biometric Acquisition</h2>
               <p className="text-slate-400 text-sm">
                 Acquire fingerprint data for <span className="text-cyan-400 font-bold">{patientDetails?.fullName}</span>.
               </p>
             </div>
             <Scanner onCapture={handleCapture} />
             <button 
               onClick={() => setAppState(AppState.FORM)}
               className="mt-6 text-slate-500 text-xs hover:text-slate-300 underline"
             >
               Back to Patient Details
             </button>
           </div>
        )}

        {(appState === AppState.ANALYZING || appState === AppState.RESULTS) && (
          <AnalysisView 
            isAnalyzing={appState === AppState.ANALYZING}
            result={result}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
};

export default App;