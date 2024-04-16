export class AnomaliaExpediente {
    id: number;
    nroExpediente: number;
    caso: number;
    codigo: string;
    descripcion: string;
    fecha: string;
    otros: boolean;
    fotos: string[];
    medidor: string;
    direccion: string;
    localidad: string;
    denunciante: string;
    empleado: string;
    latitud: number;
    longitud: number;
    reclamoSara: number;
    gravedad: string;
    riesgo:string;
    caratulaSeleccionada: string; // Nuevo campo agregado
    distribuidora: string; // Nuevo campo agregado
    fechaNotificacion:string;
    oculto?: boolean; // Propiedad opcional

    constructor(data: any) {
        this.id = data.id;
        this.nroExpediente = data.nroExpediente;
        this.caso = data.caso;
        this.codigo = data.codigo;
        this.descripcion = data.descripcion;
        this.gravedad = data.gravedad;
        this.fecha = data.fecha;
        this.otros = data.otros;
        this.fotos = data.fotos;
        this.medidor = data.medidor;
        this.direccion = data.direccion;
        this.localidad = data.localidad;
        this.denunciante = data.denunciante;
        this.empleado = data.empleado;
        this.latitud = data.latitud;
        this.longitud = data.longitud;
        this.reclamoSara = data.reclamoSara;
        this.caratulaSeleccionada = data.caratulaSeleccionada;
        this.distribuidora = data.distribuidora;
        this.riesgo = data.riesgo;
        this.fechaNotificacion = data.fechaNotificacion;
        this.oculto = data.oculto !== undefined ? data.oculto : false; // Inicialización opcional
    }
}
