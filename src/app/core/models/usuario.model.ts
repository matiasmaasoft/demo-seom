export type RolUsuario = 'socio' | 'comercio';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string; // solo para demo, comparación en memoria
  rol: RolUsuario;
  comercioId?: string; // si es comercio, id del comercio asociado
}
