import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Anomalia } from 'src/app/models/anomalia';
import { environment } from 'src/environments/environment.production';



@Injectable({
  providedIn: 'root'
})
export class AnomaliasService {

  private API_URL: string = environment.apiUrl + '/anomalia_rest/';

  
  constructor(private http: HttpClient) { }

  saveAnomalia(anomalia: Anomalia): Observable<any> {
    return this.http.post<any>(this.API_URL, anomalia);
  }

  getAllAnomalia():Observable<any> {
    return this.http.get(this.API_URL);
  }
  deleteAnomalia(id:any):Observable<any>{
    return this.http.delete(this.API_URL + "delete/" + id);
  }
}
