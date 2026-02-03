import { STORAGE_KEYS } from '../constants/storage-keys';
import { getMockData } from '../data/mock-data';

export function initializeMockData(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(STORAGE_KEYS.MOCK_INITIALIZED) === 'true') return;

  const { usuarios, comercios, solicitudes, consumos } = getMockData();
  localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios));
  localStorage.setItem(STORAGE_KEYS.COMERCIOS, JSON.stringify(comercios));
  localStorage.setItem(STORAGE_KEYS.SOLICITUDES, JSON.stringify(solicitudes));
  localStorage.setItem(STORAGE_KEYS.CONSUMOS, JSON.stringify(consumos));
  localStorage.setItem(STORAGE_KEYS.MOCK_INITIALIZED, 'true');
}
