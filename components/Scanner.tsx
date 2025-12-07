import React, { useRef, useState, useEffect } from 'react';
import { Upload, Fingerprint, Scan, Smartphone } from 'lucide-react';

interface ScannerProps {
  onCapture: (imageData: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onCapture }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const scanInterval = useRef<number | null>(null);

  // Generate a dummy fingerprint pattern for the simulation
  const generateSimulatedScan = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 300, 400);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      // Draw random concentric circles to simulate a print for the AI context
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(150, 200, 10 + i * 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      return canvas.toDataURL('image/png').split(',')[1];
    }
    return "";
  };

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    
    // Simulate scanning duration
    let p = 0;
    scanInterval.current = window.setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        completeScan();
      }
    }, 50); // 2.5 seconds total
  };

  const stopScan = () => {
    if (scanInterval.current) {
      clearInterval(scanInterval.current);
    }
    setIsScanning(false);
    setProgress(0);
  };

  const completeScan = () => {
    if (scanInterval.current) {
      clearInterval(scanInterval.current);
    }
    const simulatedData = generateSimulatedScan();
    onCapture(simulatedData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        onCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        <div className="z-10 text-center space-y-6 w-full">
          <div>
             <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
               <Smartphone className="w-5 h-5 text-cyan-400" />
               DGP Bio-Scanner
             </h3>
             <p className="text-slate-400 text-xs mt-2">Place thumb on the sensor pad below</p>
          </div>

          {/* Fingerprint Sensor Pad */}
          <div 
            className="relative group cursor-pointer select-none"
            onMouseDown={startScan}
            onMouseUp={stopScan}
            onMouseLeave={stopScan}
            onTouchStart={startScan}
            onTouchEnd={stopScan}
          >
            {/* Outer Glow Ring */}
            <div className={`w-40 h-48 rounded-full border-2 transition-all duration-300 flex items-center justify-center relative bg-slate-950 ${isScanning ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]' : 'border-slate-700'}`}>
               
               {/* Progress Fill */}
               <div 
                 className="absolute bottom-0 w-full bg-cyan-500/10 rounded-full transition-all duration-75"
                 style={{ height: `${progress}%` }}
               ></div>

               {/* Scan Line */}
               {isScanning && (
                 <div 
                   className="absolute w-full h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-20"
                   style={{ top: `${100 - progress}%`, opacity: progress < 100 ? 1 : 0 }}
                 ></div>
               )}

               <Fingerprint 
                 size={80} 
                 className={`transition-colors duration-300 ${isScanning ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-500'}`} 
               />
               
               {/* Pulse Effect */}
               {!isScanning && (
                 <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping"></div>
               )}
            </div>
            
            <p className="mt-4 text-xs font-mono text-cyan-500 font-bold uppercase tracking-widest">
              {isScanning ? `Scanning... ${progress}%` : "Hold to Scan"}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-slate-600 text-xs uppercase">Or</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700"
          >
            <Upload size={16} />
            Upload Scan File
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      <p className="text-center text-[10px] text-slate-600 mt-4 max-w-xs mx-auto">
        *On-screen scanning uses simulation logic for demonstration. For clinical accuracy, please upload a high-resolution optical scanner image.
      </p>
    </div>
  );
};