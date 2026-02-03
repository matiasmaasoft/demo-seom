import { ComercioExtended } from '../models/comercio.model';

/**
 * Parsea el contenido de lista_comercios.txt (categorías en mayúsculas,
 * líneas con tab = nombre \t dirección \t teléfono).
 */
export function parseListaComercios(raw: string): ComercioExtended[] {
  const lines = raw.split(/\r?\n/);
  const result: ComercioExtended[] = [];
  let currentCategory = '';
  let index = 0;

  for (const line of lines) {
    const parts = line.split('\t').map((p) => p.trim());
    const first = parts[0] || '';
    const second = parts[1] || '';
    const third = parts[2] || '';
    const fourth = parts[3] || '';

    // Categoría: exactamente 2 partes y la segunda es todo mayúsculas (ej. "	ACUMULADORES")
    if (parts.filter(Boolean).length <= 2) {
      const namePart = second || first;
      if (namePart && namePart === namePart.toUpperCase() && namePart.length > 2) {
        currentCategory = namePart;
        continue;
      }
    }

    // Comercio: 3+ partes (nombre, dirección, teléfono)
    if (parts.length >= 3 && second) {
      index += 1;
      result.push({
        id: 'com-real-' + index,
        nombre: second,
        direccion: third || undefined,
        telefono: fourth || undefined,
        categoria: currentCategory || undefined,
      });
    }
  }

  return result;
}
