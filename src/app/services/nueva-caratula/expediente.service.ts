import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.production';


@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {
  
  private API_SERVER : string = environment.apiUrl + '/expediente_rest/'

  // private API_SERVER: string = "http://localhost:8081/expediente_rest/";

  constructor(private http:HttpClient) { }
  public getAllExpediente():Observable<any>{
    return this.http.get(this.API_SERVER);
  }
  public saveExpediente(expediente: any): Observable<any> {
    return this.http.post(this.API_SERVER + "save", expediente);
  }
  public deleteExpediente(id:any):Observable<any>{
    return this.http.delete(this.API_SERVER + "delete/" + id);
  }
}
