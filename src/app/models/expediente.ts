import { Caratula } from "./caratula";
import { Distribuidora } from "./distribuidora";

export class Expediente {
    id: number;
    fecha: string;
    nroExpediente: string;
    caratulaSeleccionada: string;
    distribuidora: string;
  
    constructor(id: number, fecha: string, nroExpediente: string, caratulaSeleccionada: string, distribuidora: string) {
      this.id = id;
      this.fecha = fecha;
      this.nroExpediente = nroExpediente;
      this.caratulaSeleccionada = caratulaSeleccionada;
      this.distribuidora = distribuidora;
    }
  }
  