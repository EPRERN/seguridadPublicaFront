
import {  TipoCaratula } from "./tipo-caratula";
import { CaratulaGravedad } from "./caratulaGravedad";
import { Distribuidora } from "./distribuidora";

export class Caratula {

  id!: number;
  fecha!: Date;
  caratulastieneexpte!: boolean;
  tieneExpediente!: boolean;
  aclaracion!: string;
  distribuidora!: Distribuidora;
  tipoCaratula!: TipoCaratula;
  tipoGravedad!:string;
  caratulaSeleccionada!:string
  nuevaCaratulaForm: any;
  isSelected!:boolean;

}
