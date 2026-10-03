import React from 'react';
import { ShieldCheck, Map } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-6 text-slate-500 text-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Generator Plakatów Ewakuacyjnych A4 • HackYeah 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Map className="w-3.5 h-3.5 text-amber-500" /> Dane: OpenStreetMap / Overpass API / PSP
          </span>
          <span>Druk bezpośredni przez dwuklik lub Ctrl+P</span>
        </div>
      </div>
    </footer>
  );
};
