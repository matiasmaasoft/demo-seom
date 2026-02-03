export interface Comercio {
  id: string;
  nombre: string;
}

export interface ComercioExtended extends Comercio {
  direccion?: string;
  telefono?: string;
  categoria?: string;
}
