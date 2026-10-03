import React from 'react';
import type { LocationData, ShelterData, PosterConfig } from '../types/poster';
import { EvacuationMap } from './EvacuationMap';
import { QrCodeImage } from './QrCodeImage';
import { ShieldAlert, MapPin, Footprints, Phone, Backpack, AlertTriangle, Radio, CheckCircle2, Clock } from 'lucide-react';

interface PosterPreviewProps {
  userLocation: LocationData;
  shelter: ShelterData;
  config: PosterConfig;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({ userLocation, shelter, config }) => {
  const osmRouteUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${userLocation.lat}%2C${userLocation.lon}%3B${shelter.lat}%2C${shelter.lon}`;

  return (
    <div className="w-full flex justify-center py-4 bg-slate-900/50 print:p-0 print:m-0 print:bg-white overflow-x-auto">
      <div
        id="printable-poster"
        className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 shadow-2xl relative flex flex-col justify-between font-sans print:shadow-none print:w-full print:h-full print:p-8 print:m-0 border border-slate-200 rounded-sm ${
          config.template === 'civil_defense' ? 'border-t-[16px] border-t-amber-500' : ''
        } ${config.template === 'tactical_dark' ? 'border-t-[16px] border-t-red-600' : ''}`}
      >
        {/* TOP WARNING BANNER / HEADER */}
        <div>
          {config.template === 'civil_defense' && (
            <div className="border-b-4 border-amber-500 pb-4 mb-4">
              <div className="flex justify-between items-center bg-amber-500 text-slate-950 px-4 py-2 font-black tracking-wider uppercase text-sm mb-3 rounded-t">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 fill-slate-950 text-amber-500" />
                  <span>PLAKAT INFORMACYJNO-EWAKUACYJNY OCHRONY LUDNOŚCI</span>
                </div>
                <span>KOD: OB-2026-PL</span>
              </div>
              <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight leading-none mb-1">
                {config.headerTitle || 'LOKALIZACJA NAJBLIŻSZEGO SCHRONU'}
              </h1>
              <p className="text-slate-700 font-semibold text-sm">
                {config.headerSubtitle || 'Oficjalny punkt osłonowy dla mieszkańców wskazanego adresu.'}
              </p>
            </div>
          )}

          {config.template === 'modern_safety' && (
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-xl mb-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-2">
                    <ShieldAlert className="w-3.5 h-3.5" /> BEZPIECZEŃSTWO LUDNOŚCI
                  </span>
                  <h1 className="text-3xl font-extrabold tracking-tight">{config.headerTitle || 'KARTA EWAKUACYJNA'}</h1>
                  <p className="text-blue-200 text-sm font-medium mt-0.5">{config.headerSubtitle || 'Procedura dotarcia do najbliższego miejsca ukrycia'}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-center">
                  <Radio className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
                  <span className="text-[10px] font-bold tracking-wider text-slate-200 uppercase mt-1 block">ZACIĄGNIĘTO Z OSM</span>
                </div>
              </div>
            </div>
          )}

          {config.template === 'neighborhood_info' && (
            <div className="border-b-2 border-emerald-600 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 text-white p-3 rounded-lg">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                      {config.headerTitle || 'INFORMACJA DLA MIESZKAŃCÓW'}
                    </h1>
                    <p className="text-emerald-700 font-semibold text-sm">
                      {config.headerSubtitle || 'Lokalne schrony oraz zasady postępowania w razie zagrożenia'}
                    </p>
                  </div>
                </div>
                <div className="text-right border-l-2 border-slate-200 pl-4">
                  <span className="text-xs font-bold text-slate-500 uppercase block">STATUS OBIEKTU</span>
                  <span className="text-xs font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    ZWERYFIKOWANY (OSM/PSP)
                  </span>
                </div>
              </div>
            </div>
          )}

          {config.template === 'tactical_dark' && (
            <div className="bg-slate-950 text-white p-6 mb-4 rounded border-b-4 border-red-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-500 font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> ALARM / EWAKUACJA
                </span>
                <span className="text-slate-400 font-mono text-xs">STREFA OSM: POLAND</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white">
                {config.headerTitle || 'PUNKT SCHRONIENIA & ROUTE'}
              </h1>
              <p className="text-slate-300 text-sm font-mono mt-1">
                {config.headerSubtitle || 'Wykaz parametrów dotarcia z miejsca pobytu do punktu osłonowego'}
              </p>
            </div>
          )}

          {/* TWO MAIN CARDS: HOME LOCATION VS SHELTER LOCATION */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* HOME LOCATION CARD */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-700 text-xs font-black uppercase mb-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>TWÓJ ADRES (PUNKT STARTOWY)</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {userLocation.address || 'Nie podano adresu'}
                </h3>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                <span>Współrzędne:</span>
                <span className="font-bold text-slate-800">{userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}</span>
              </div>
            </div>

            {/* SHELTER LOCATION CARD */}
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-amber-900 text-xs font-black uppercase">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>NAJBLIŻSZY SCHRON / UKRYCIE</span>
                  </div>
                  <span className="text-[10px] font-extrabold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full uppercase">
                    {shelter.source}
                  </span>
                </div>
                <h3 className="font-extrabold text-amber-950 text-base leading-snug">
                  {shelter.name}
                </h3>
                <p className="text-xs text-amber-900 font-medium mt-1">
                  📍 {shelter.address}
                </p>
              </div>

              {/* DISTANCE & WALK TIME BADGES */}
              <div className="mt-3 pt-2 border-t border-amber-200 grid grid-cols-2 gap-2 text-center">
                <div className="bg-white/80 p-1.5 rounded border border-amber-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Odległość</span>
                  <span className="text-sm font-black text-slate-900 flex items-center justify-center gap-1">
                    <Footprints className="w-3.5 h-3.5 text-amber-600" /> {shelter.distanceMeters} m
                  </span>
                </div>
                <div className="bg-white/80 p-1.5 rounded border border-amber-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Czas marszu</span>
                  <span className="text-sm font-black text-slate-900 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> ~{shelter.walkMinutes} min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MAP & ROUTE SECTION */}
          {config.showMap && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-600" /> MAPA DOJŚCIA PIESZEGO DO SCHRONU (OSM)
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Trasa czerwona przerywana</span>
              </div>
              <EvacuationMap
                userLocation={userLocation}
                shelter={shelter}
                className="h-56 w-full rounded-xl border-2 border-slate-300 shadow-inner overflow-hidden"
              />
            </div>
          )}

          {/* CUSTOM INSTRUCTIONS & BAG CHECKLIST GRID */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            {/* INSTRUCTIONS */}
            {config.showInstructions && (
              <div className={`${config.showBagChecklist ? 'col-span-7' : 'col-span-12'} bg-slate-50 border border-slate-200 p-3.5 rounded-xl`}>
                <h4 className="text-xs font-extrabold uppercase text-slate-900 mb-2 flex items-center gap-1.5 border-b pb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ZASADY EWAKUACJI & BEZPIECZEŃSTWA
                </h4>
                <ol className="text-xs text-slate-700 space-y-1.5 font-medium list-decimal list-inside">
                  <li><strong>Zachowaj spokój:</strong> Zamknij okna i drzwi w mieszkaniu.</li>
                  <li><strong>Odłącz media:</strong> Wyłącz gaz, prąd oraz zakręć zawór wody.</li>
                  <li><strong>Zabierz plecak ewakuacyjny:</strong> Dokumenty, leki i zapas wody.</li>
                  <li><strong>Kieruj się do schronu:</strong> Podążaj trasą podaną na powyższej mapie.</li>
                </ol>
                {config.customNotes && (
                  <div className="mt-2.5 p-2 bg-amber-100 border border-amber-300 rounded text-xs text-amber-950 font-semibold">
                    💡 <strong>Uwagi lokalne:</strong> {config.customNotes}
                  </div>
                )}
              </div>
            )}

            {/* EVACUATION BAG CHECKLIST */}
            {config.showBagChecklist && (
              <div className={`${config.showInstructions ? 'col-span-5' : 'col-span-12'} bg-blue-50/70 border border-blue-200 p-3.5 rounded-xl`}>
                <h4 className="text-xs font-extrabold uppercase text-blue-950 mb-2 flex items-center gap-1.5 border-b border-blue-200 pb-1">
                  <Backpack className="w-4 h-4 text-blue-600" /> PLECAK EWAKUACYJNY (CHECKLISTA)
                </h4>
                <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-800 font-medium">
                  {config.bagItems.slice(0, 6).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <input type="checkbox" checked readOnly className="rounded text-blue-600 h-3 w-3" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER & EMERGENCY CONTACTS + QR CODE */}
        <div className="border-t-2 border-slate-900 pt-3 mt-2 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-black uppercase text-slate-900 flex items-center gap-1">
                <Phone className="w-4 h-4 text-red-600" /> NUMERY ALARMOWE:
              </span>
              <span className="text-lg font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">112</span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">998 (Straż)</span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">999 (Pogotowie)</span>
            </div>

            {config.assemblyPoint && (
              <div className="text-xs text-slate-800 font-bold bg-slate-100 p-1.5 rounded border border-slate-300">
                📍 Punkt Zbiórki Sąsiedzkiej: <span className="text-blue-900 font-extrabold">{config.assemblyPoint}</span>
              </div>
            )}

            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              Wygenerowano automatycznie z wykorzystaniem otwartych danych OpenStreetMap & Geoportal. Wydruk A4 do umieszczenia w widocznym miejscu.
            </p>
          </div>

          {config.showQrCode && (
            <div className="border-l border-slate-300 pl-4 flex-shrink-0">
              <QrCodeImage url={osmRouteUrl} size={90} label="Skanuj po nawigację OSM" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
