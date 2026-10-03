import React, { useState } from 'react';
import type { LocationData, PosterConfig, PosterTemplate } from '../types/poster';
import { geocodeAddress } from '../services/osmService';
import { Printer, MapPin, Search, Navigation, Sliders, FileText, AlertTriangle } from 'lucide-react';

interface FormPanelProps {
  userLocation: LocationData;
  setUserLocation: (loc: LocationData) => void;
  config: PosterConfig;
  setConfig: React.Dispatch<React.SetStateAction<PosterConfig>>;
  isLoading: boolean;
  onSearchShelters: (location: LocationData) => void;
  onPrint: () => void;
}

export const FormPanel: React.FC<FormPanelProps> = ({
  userLocation,
  setUserLocation,
  config,
  setConfig,
  isLoading,
  onSearchShelters,
  onPrint,
}) => {
  const [addressInput, setAddressInput] = useState(userLocation.address);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'location' | 'design' | 'content'>('location');

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!addressInput.trim()) return;

    setIsSearching(true);
    const results = await geocodeAddress(addressInput);
    setIsSearching(false);

    if (results.length > 0) {
      const top = results[0];
      setUserLocation(top);
      onSearchShelters(top);
      setSuggestions([]);
    }
  };

  const handleInputChange = async (val: string) => {
    setAddressInput(val);
    if (val.trim().length >= 3) {
      const results = await geocodeAddress(val);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (loc: LocationData) => {
    setAddressInput(loc.displayName);
    setUserLocation(loc);
    onSearchShelters(loc);
    setSuggestions([]);
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const loc: LocationData = {
            address: `Współrzędne GPS: ${lat.toFixed(5)}, ${lon.toFixed(5)}`,
            displayName: `Twoja obecna lokalizacja GPS (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
            lat,
            lon,
          };
          setUserLocation(loc);
          setAddressInput(loc.address);
          onSearchShelters(loc);
          setIsSearching(false);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setIsSearching(false);
          alert('Nie udało się pobrać dokładnej lokalizacji GPS. Wpisz swój adres w polu wyszukiwania.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      alert('Twoja przeglądarka nie obsługuje geolokalizacji.');
    }
  };

  const sampleAddresses = [
    { label: 'Warszawa, Marszałkowska 100', query: 'Warszawa Marszałkowska 100', lat: 52.2297, lon: 21.0122 },
    { label: 'Kraków, Floriańska 15', query: 'Kraków Floriańska 15', lat: 50.0632, lon: 19.9392 },
    { label: 'Gdańsk, Długa 45', query: 'Gdańsk Długa 45', lat: 54.3497, lon: 18.6534 },
    { label: 'Wrocław, Rynek 1', query: 'Wrocław Rynek 1', lat: 51.1100, lon: 17.0320 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 flex flex-col justify-between">
      <div>
        {/* HEADER BRAND & QUICK PRINT ACTION */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-red-600 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
              <AlertTriangle className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Generator Plakatów A4
              </h2>
              <p className="text-xs text-slate-400">Personalizacja i druk plakatu schronienia</p>
            </div>
          </div>

          <button
            onClick={onPrint}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 cursor-pointer text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Drukuj Plakat (Ctrl+P)</span>
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex bg-slate-950 p-1 rounded-xl mb-5 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('location')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'location' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> 1. Lokalizacja
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'design' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> 2. Szablon & Wygląd
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'content' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> 3. Teksty & Uwagi
          </button>
        </div>

        {/* TAB 1: LOCATION SEARCH */}
        {activeTab === 'location' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                Wpisz swój adres zamieszkania:
              </label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="np. ul. Marszałkowska 100, Warszawa"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                />
                <button
                  type="submit"
                  disabled={isSearching || isLoading}
                  className="absolute right-2 top-2 p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {suggestions.length > 0 && (
                <div className="mt-2 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl z-20 relative">
                  {suggestions.map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(loc)}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-800 border-b border-slate-900 last:border-0 flex items-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate">{loc.displayName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Pobierz automatycznie z GPS urządzania</span>
              </div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isSearching}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                {isSearching ? 'Pobieranie...' : 'Użyj GPS'}
              </button>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-semibold block mb-2">Przykładowe adresy testowe:</span>
              <div className="grid grid-cols-2 gap-2">
                {sampleAddresses.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const loc: LocationData = {
                        address: sample.query,
                        displayName: sample.label,
                        lat: sample.lat,
                        lon: sample.lon,
                      };
                      setAddressInput(sample.query);
                      setUserLocation(loc);
                      onSearchShelters(loc);
                    }}
                    className="text-left text-xs bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 px-3 py-2 rounded-lg text-slate-300 hover:text-white transition truncate"
                  >
                    📍 {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DESIGN & TEMPLATES */}
        {activeTab === 'design' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                Wybierz styl i format plakatu:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'civil_defense', title: 'Ochrona Cywilna', desc: 'Żółto-czarny oficjalny plakat ostrzegawczy', icon: '⚠️' },
                  { id: 'modern_safety', title: 'Nowoczesny Infograficzny', desc: 'Przejrzysty niebiesko-czerwony układ', icon: '🛡️' },
                  { id: 'neighborhood_info', title: 'Klatka / Osiedlowy', desc: 'Dla wspólnot mieszkaniowych i bloku', icon: '🏢' },
                  { id: 'tactical_dark', title: 'Taktyczny Kontrast', desc: 'Wysoki kontrast z paskami alarmowymi', icon: '🚨' },
                ].map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setConfig((prev) => ({ ...prev, template: tmpl.id as PosterTemplate }))}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      config.template === tmpl.id
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-lg mb-1">{tmpl.icon}</div>
                    <div className="font-bold text-xs text-white">{tmpl.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{tmpl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase text-slate-300 block mb-1">Sekcje widoczne na plakacie:</span>
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Pokazuj Interaktywną Mapę OSM</span>
                <input
                  type="checkbox"
                  checked={config.showMap}
                  onChange={(e) => setConfig((prev) => ({ ...prev, showMap: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Pokazuj Kod QR z nawigacją</span>
                <input
                  type="checkbox"
                  checked={config.showQrCode}
                  onChange={(e) => setConfig((prev) => ({ ...prev, showQrCode: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Pokazuj Instrukcje Bezpieczeństwa</span>
                <input
                  type="checkbox"
                  checked={config.showInstructions}
                  onChange={(e) => setConfig((prev) => ({ ...prev, showInstructions: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Pokazuj Checkliste Plecaka Ewakuacyjnego</span>
                <input
                  type="checkbox"
                  checked={config.showBagChecklist}
                  onChange={(e) => setConfig((prev) => ({ ...prev, showBagChecklist: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: CONTENT & CUSTOMIZATION */}
        {activeTab === 'content' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Nagłówek główny plakatu:</label>
              <input
                type="text"
                value={config.headerTitle}
                onChange={(e) => setConfig((prev) => ({ ...prev, headerTitle: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Punkt zbiórki sąsiedzkiej:</label>
              <input
                type="text"
                value={config.assemblyPoint}
                onChange={(e) => setConfig((prev) => ({ ...prev, assemblyPoint: e.target.value }))}
                placeholder="np. Plac zabaw przy bloku 4B / Boisko szkolne"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Dodatkowe uwagi lokalne:</label>
              <textarea
                value={config.customNotes}
                onChange={(e) => setConfig((prev) => ({ ...prev, customNotes: e.target.value }))}
                rows={2}
                placeholder="np. Zapas wody znajduje się w piwnicy. Klucze do schronu posiada dozorca (lokal 3)."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
        Przetwarzanie danych lokalizacyjnych z wykorzystaniem API OpenStreetMap (Nominatim & Overpass).
      </div>
    </div>
  );
};
