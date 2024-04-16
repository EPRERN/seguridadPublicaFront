import { Distribuidora } from "./distribuidora";
import { Distrito } from "./distrito";

export class Localidad{
    id!:number;
    nombreLocalidad!:string;
    codigoPostal!:number;
    distrito!:Distrito;
    distribuidora!:Distribuidora;
}