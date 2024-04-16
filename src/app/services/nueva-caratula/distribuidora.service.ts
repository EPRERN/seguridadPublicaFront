import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class DistribuidoraService {

  private API_SERVER: string = environment.apiUrl + '/distribuidora_rest/'

  // private API_SERVER: string = "http://localhost:8081/distribuidora_rest/";

  
  constructor(
    private http:HttpClient
  ) { }


  public getAllDistribuidora():Observable<any>{
    return this.http.get(this.API_SERVER);
  }


  public saveDistribuidora(distribuidora:any):Observable<any>{
    return this.http.post(this.API_SERVER,distribuidora)
  }

  public deleteDistribuidora(id:any):Observable<any>{
    return this.http.delete(this.API_SERVER + "delete/" + id);
  }
}
