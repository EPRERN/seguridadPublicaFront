export class AnomaliaNotificada {
    id: number;
    nroExpediente: number;
    caratulaSeleccionada:string;
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
    fechaNotificacion!:string
    riesgo!:string
    notificada!:boolean;
    distribuidora!:string;
    






    constructor(data: any) {
        this.id = data.id;
        this.nroExpediente = data.nroExpediente;
        this.caratulaSeleccionada = data.caratulaSeleccionada
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
        this.notificada = data.notificada;
        this.distribuidora = data.distribuidora
    }
}