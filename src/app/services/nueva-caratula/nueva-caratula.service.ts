import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class NuevaCaratulaService {

  private API_SERVER:string = environment.apiUrl + '/caratula_rest/'

  // private API_SERVER: string = "http://localhost:8081/caratula_rest/";

  constructor(private http: HttpClient) {}

  public getAllCaratula(): Observable<any> {
    return this.http.get(this.API_SERVER);
  }

  public saveCaratulas(caratula: any): Observable<any> {
    return this.http.post(this.API_SERVER, caratula);
  }

  public deleteCaratula(id: any): Observable<any> {
    return this.http.delete(this.API_SERVER + "delete/" + id);
  }

  public getCaratulaById(id: any): Observable<any> {
    return this.http.get(this.API_SERVER + id);
  }
}
