export interface LocationData {
  address: string;
  lat: number;
  lon: number;
  displayName: string;
  city?: string;
  road?: string;
  houseNumber?: string;
}

export interface ShelterData {
  id: string;
  name: string;
  type: 'schron' | 'ukrycie' | 'miejscu_dordznym' | 'bunkier';
  address: string;
  lat: number;
  lon: number;
  distanceMeters: number;
  walkMinutes: number;
  capacity?: number;
  description?: string;
  source: 'OSM Overpass' | 'Rejestr Państwowej Straży Pożarnej (PSP)';
}

export type PosterTemplate = 'civil_defense' | 'modern_safety' | 'neighborhood_info' | 'tactical_dark';

export interface PosterConfig {
  template: PosterTemplate;
  headerTitle: string;
  headerSubtitle: string;
  customNotes: string;
  assemblyPoint: string;
  contactPhones: { label: string; number: string }[];
  showMap: boolean;
  showQrCode: boolean;
  showInstructions: boolean;
  showBagChecklist: boolean;
  bagItems: string[];
}
