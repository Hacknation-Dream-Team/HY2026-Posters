import React from 'react';
import { ShieldAlert, Printer } from 'lucide-react';

interface HeaderProps {
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPrint }) => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-amber-500 to-red-600 p-2 rounded-xl shadow-lg shadow-amber-500/20">
            <ShieldAlert className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">SchronPoster</span>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20 uppercase">
                A4 Printable OSM Generator
              </span>
            </div>
            <p className="text-xs text-slate-400">Generator Plakatów Ewakuacyjnych z mapą i najbliższym schronem</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onPrint}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl shadow-md transition transform active:scale-95 text-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Drukuj A4 (Ctrl+P)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
