import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, catchError } from 'rxjs';
import { AnomaliaExpediente } from 'src/app/models/anomaliaExpediente';
import { AnomaliaNotificada } from 'src/app/models/anomaliaNotificada';
import { environment } from 'src/environments/environment.production';



@Injectable({
  providedIn: 'root'
})
export class AnomaliaExpedienteService {


  private API_URL: string = environment.apiUrl + '/anomaliaExpediente_rest/';
  private API_NOTIFICAR: string = environment.apiUrl + '/anomaliaNotificada_rest/';



  constructor(private http: HttpClient) { }






  getAllAnomaliaExpediente(): Observable<any> {
    return this.http.get(this.API_URL);
  }

  deleteAnomaliaExpediente(id: any): Observable<any> {
    return this.http.delete(this.API_URL + "delete/" + id);
  }



  private anomaliaExpedienteForm!: FormGroup;

  setFormulario(form: FormGroup): void {
    this.anomaliaExpedienteForm = form;
  }

  getFormulario(): FormGroup {
    return this.anomaliaExpedienteForm;
  }



  updateAnomaliaExpediente(anomaliaExpediente: AnomaliaExpediente): Observable<AnomaliaExpediente> {
    const url = `${this.API_URL}${anomaliaExpediente.id}`;
    return this.http.put<AnomaliaExpediente>(url, anomaliaExpediente).pipe(
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);  
        throw 'Hubo un error al actualizar los datos en la base de datos.';
      })
    );
  }

  updateGravedadAnomalias(ids: number[], gravedad: string, codigo: string): Observable<any> {

    const data = {

      ids: ids,
      gravedad: gravedad,
      codigo: codigo
    };

    console.log('Datos enviados a Spring:', data);

    const url = `${this.API_URL}updateGravedad`;


    return this.http.put(url, data).pipe(

      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        throw 'Hubo un error al actualizar la gravedad en la base de datos.';
      }),

    );
  }


  saveAnomaliaExpediente(anomaliaExpediente: AnomaliaExpediente) {
    return this.http.post<AnomaliaExpediente>(this.API_URL, anomaliaExpediente).pipe(
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        throw 'Hubo un error al guardar los datos en la base de datos.';
      })
    );
  }


  updateOcultoAnomalia(id: number, oculto: boolean): Observable<any> {
    const url = `${this.API_URL}updateOculto/${id}`;
    return this.http.put(url, null, { params: { oculto: oculto.toString() } }).pipe(
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        throw 'Hubo un error al actualizar el campo oculto en la base de datos.';
      })
    );
  }


  guardarAnomaliaNotificada(anomaliaNotificada: AnomaliaNotificada){
    return this.http.post<AnomaliaNotificada>(this.API_NOTIFICAR, anomaliaNotificada).pipe(
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        throw 'Hubo un error al guardar la anomalia notificada en la base de datos.';
      })
    );
  }

  obtenerTodasLasAnomaliasNotificadas(): Observable<AnomaliaNotificada[]> {
    return this.http.get<AnomaliaNotificada[]>(this.API_NOTIFICAR );
  }


  // obtenerCodigosAnomalias(): Observable<string[]> {
  //   const url = `${this.API_URL}obtenerCodigosAnomalias`; 
  //   return this.http.get<string[]>(url);
  // }





}