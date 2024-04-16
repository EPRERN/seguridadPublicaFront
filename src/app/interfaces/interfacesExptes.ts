    export interface Caratulas{
    t_caratulasid:number,
    caratulasfecha:Date,
    caratulastieneexpte:boolean,
    caratulasaclaracion:string,
    t_distribuidorasid:Distribuidoras,
    t_caratulastipoid:CaratulasTipo,
    t_caratulasgravedadid:CaratulasGravedad,
    caratulasseleccionada:string
}

export interface Distribuidoras{
    t_distribuidorasid:number,
    distribuidorasnombre:string,
    distribuidorasdireccion:string,
    distribuidorasemail:string,
    distribuidorastelefono:string,
    distribuidoraslocalidad:string,
    distribuidorascp:string,
    distribuidorasnombrecompleto:string
}

export interface CaratulasGravedad {
    t_caratulasgravedadid:number,
    caratulasgravedaddescripcion:string
}
export interface CaratulasTipo{
    t_caratulastipoid: number,
    t_caratulastipodescripcion:string,
    t_caratulastipocodigo:string
}


export interface Expediente{
    t_expedientesid:number,
    expedientesnroexpte:string,
    expedientesinifecha:Date,
    t_caratulasid:Caratulas,
    expedientesfc:boolean
}

export interface Empleados{
    t_empleadosid:number,
    empleadosnombre:string,
    empleadosnick:string,
    empleadospuesto:string,
    empleadostitulo:string,
    empleadosfirma:string,
    empleadosfirma_gxi:string
}

export interface AnomaliasExpedientes{
    t_anomaliasexptesid:number,
    t_anomaliasexptescaso:number,
    t_expedientesid: Expediente,
    t_anomaliasid:number,
    anomaliasexptesfecha:Date,
    anomaliasexptesfojasexpte:number,
    anomaliasexptesfsfotosdesde:number,
    anomaliasexptesfsfotoshasta:number,
    anomaliasexpteslongitud:number,
    t_anomaliasexpteslatitud:number,
    anomaliasexptesdireccion:string,
    anomaliasexptesacumulado:number,
    anomaliasexpteslimite500k:boolean,
    anomaliasexptesotros:boolean,
    anomaliasexptessara:string,
    anomaliasexptesdenunciante:string,
    anomaliasexptesmedidor:string,
    anomaliasexptesnotificada:boolean,
    anomaliasexptesacreditada:boolean,
    anomaliasexptesformcargo:boolean,
    anomaliasexptesmultadas:boolean,
    anomaliasexptescerrada:boolean,
    anomaliasexptesliquidada:boolean,
    t_empleadosid:Empleados,
    t_localidadesid:Localidades
}

export interface Localidades{
    t_localidadesid:number,
    localidadesnombre:string,
    localidadescpalfa:string,
    t_distritosid:Distritos,
    t_distribuidorasid:Distribuidoras
}

export interface Distritos{
    t_distritosid:number,
    distritosnombre:string
}