import { useState, useEffect, useRef } from 'react';
import type { LocationData, ShelterData, PosterConfig } from './types/poster';
import { findNearestShelter } from './services/osmService';
import { PosterPreview } from './components/PosterPreview';
import { FormPanel } from './components/FormPanel';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import confetti from 'canvas-confetti';
import { Sparkles, Printer, Eye, RefreshCw, Download, Loader2 } from 'lucide-react';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function App() {
  const [userLocation, setUserLocation] = useState<LocationData>({
    address: 'ul. Marszałkowska 100, Warszawa',
    displayName: 'ul. Marszałkowska 100, 00-001 Warszawa, Polska',
    lat: 52.2297,
    lon: 21.0122,
    city: 'Warszawa',
    road: 'Marszałkowska',
    houseNumber: '100',
  });

  const [shelter, setShelter] = useState<ShelterData | null>(null);
  const [isLoadingShelter, setIsLoadingShelter] = useState<boolean>(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Referencja do kontenera z plakatem A4 (wymagana dla html2canvas)
  const posterRef = useRef<HTMLDivElement | null>(null);

  const [config, setConfig] = useState<PosterConfig>({
    template: 'civil_defense',
    headerTitle: 'LOKALIZACJA NAJBLIŻSZEGO SCHRONU',
    headerSubtitle: 'Oficjalny plakat informacyjny dla mieszkańców wskazanego adresu',
    customNotes: 'Zapas wody oraz klucze do łącznika zlokalizowane w lokalu 4.',
    assemblyPoint: 'Boisko szkolne przy ul. Marszałkowskiej',
    contactPhones: [
      { label: 'Numer Alarmowy', number: '112' },
      { label: 'Straż Pożarna', number: '998' },
    ],
    showMap: true,
    showQrCode: true,
    showInstructions: true,
    showBagChecklist: true,
    bagItems: [
      'Dokumenty, dowód osobisty & gotówka',
      'Woda pitna (min 2L na osobę) & suche racje',
      'Apteczka pierwszej pomocy & leki stale przyjmowane',
      'Latarka akumulatorowa + zapasowe baterie',
      'Odbiornik radiowy (FM/AM na baterie)',
      'Odzież termiczna & płaszcz przeciwdeszczowy',
    ],
  });

  const handleLoadShelter = async (location: LocationData) => {
    setIsLoadingShelter(true);
    const result = await findNearestShelter(location.lat, location.lon, location.address);
    setShelter(result);
    setIsLoadingShelter(false);
  };

  useEffect(() => {
    handleLoadShelter(userLocation);
  }, []);

  const handlePrint = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
    });
    window.print();
  };

  // OBSŁUGA GENEROWANIA I POBIERANIA PDF
  const handleDownloadPDF = async () => {
    if (!posterRef.current) return;

    setIsGeneratingPdf(true);

    try {
      // Wygenerowanie obrazu z widocznego plakatu
      const canvas = await html2canvas(posterRef.current, {
        scale: 2, // Wyższa rozdzielczość
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      // Utworzenie dokumentu PDF w formacie A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();   // 210 mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Plakat_Ewakuacyjny_${userLocation.city || 'A4'}.pdf`);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Błąd podczas generowania pliku PDF:', err);
      alert('Wystąpił błąd podczas generowania pliku PDF. Sprawdź konsolę.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header onPrint={handlePrint} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:m-0 print:max-w-none">
        {/* TOP BAR / CONTROL BANNER */}
        <div className="print:hidden mb-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4" /> Druk A4 w CSS (@media print) + OSM Overpass API
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Wygeneruj Plakat Ewakuacyjny Dla Twojego Adresu
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl">
              Uzupełnij formularz poniżej, a system automatycznie zlokalizuje najbliższy schron lub budowlę ochronną na mapie OpenStreetMap i wygeneruje gotowy plakat A4.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* PRZYCISK POBIERANIA PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf || !shelter}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-5 py-3 rounded-xl border border-slate-700 shadow-lg transition transform active:scale-95 text-sm cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
              ) : (
                <Download className="w-5 h-5 text-amber-400" />
              )}
              <span>{isGeneratingPdf ? 'Generowanie...' : 'Pobierz PDF'}</span>
            </button>

            {/* PRZYCISK DRUKOWANIA */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95 text-sm cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-5 h-5" />
              <span>Drukuj Plakat (A4)</span>
            </button>
          </div>
        </div>

        {/* MAIN DASHBOARD LAYOUT: FORM PANEL (LEFT) & LIVE A4 PREVIEW (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block">
          {/* FORM PANEL (LEFT) - HIDDEN ON PRINT */}
          <div className="lg:col-span-5 print:hidden">
            <FormPanel
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              config={config}
              setConfig={setConfig}
              isLoading={isLoadingShelter}
              onSearchShelters={(loc) => handleLoadShelter(loc)}
              onPrint={handlePrint}
            />
          </div>

          {/* POSTER PREVIEW AREA (RIGHT) - FULL WIDTH ON PRINT */}
          <div className="lg:col-span-7 flex flex-col items-center print:w-full print:block">
            <div className="w-full flex items-center justify-between mb-3 px-2 print:hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Podgląd Na Żywo (Strona A4)</span>
              </div>
              {isLoadingShelter && (
                <span className="text-xs text-amber-400 flex items-center gap-1 font-semibold animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Wyszukiwanie schronu w OSM...
                </span>
              )}
            </div>

            {/* THE PRINTABLE A4 POSTER COMPONENT (Z REFERENCJĄ REF) */}
            {shelter ? (
              <div ref={posterRef} className="w-full flex justify-center">
                <PosterPreview userLocation={userLocation} shelter={shelter} config={config} />
              </div>
            ) : (
              <div className="w-[210mm] h-[297mm] bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                Ładowanie schronu...
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}