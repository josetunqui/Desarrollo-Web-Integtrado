// Datos que el formulario envía al back-end (Spring Boot)
export interface ClienteRequest {
  nombres: string;
  apellidos: string;
  dni: string;
  email: string;
  celular: string;
  tipoComprobante: 'BOLETA' | 'FACTURA';
  ruc: string;
  password: string;
  aceptaTerminos: boolean;
}

// Datos que el back-end devuelve cuando el registro es exitoso (201 Created)
export interface ClienteResponse {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  email: string;
  celular: string;
  tipoComprobante: string;
  ruc: string | null;
  fechaRegistro: string;
}

// Estructura del error que devuelve el @RestControllerAdvice
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  mensaje: string;
  ruta: string;
  errores: Record<string, string>;
}
