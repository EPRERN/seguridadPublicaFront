export enum Gravedad {
    LEVE = 'LEVE',
    MODERADA = 'MODERADA',
    GRAVE = 'GRAVE',
    MUY_GRAVE = 'MUY_GRAVE',
    INTOLERABLE = 'INTOLERABLE'
}

export class Anomalia{
    id!:number;
    descripcion!: string;
    codigo!:string;
    riesgo!:string;
    cuantificacion!:number;
    gravedad!:Gravedad;
    otros!:boolean;
}