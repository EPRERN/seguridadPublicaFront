import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class TipoCaratulaService {

  private API_SERVER: string = environment.apiUrl + '/tipocaratula_rest/'

  // private API_SERVER: string = "http://localhost:8081/tipocaratula_rest/";

  constructor(
    private http: HttpClient
  ) { }


  public getAllTiposCaratula(): Observable<any> {
    return this.http.get(this.API_SERVER);
  }


  public saveTipoCaratula(tipoCaratula: any): Observable<any> {
    return this.http.post(this.API_SERVER, tipoCaratula)
  }

  public deleteTipoCaratula(id: any): Observable<any> {
    return this.http.delete(this.API_SERVER + "delete/" + id);
  }
}





