export type AppWindowId = 'finder' | 'safari' | 'spotify' | 'photos' | 'notes' | 'portfolio' | 'terminal' | 'camera';

export interface AppWindow {
  id: AppWindowId;
  title: string;
  isOpen: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface DesktopItem {
  id: string;
  label: string;
  iconName: string; // Lucide icon identifier
  url: string;
  tooltip: string;
  accentColor: string;
}

export interface SystemLocation {
  city: string;
  country: string;
  loading: boolean;
}
