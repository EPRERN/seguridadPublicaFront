import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as blobUtil from 'blob-util';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.production';



@Injectable({
  providedIn: 'root'
})
export class CargaImgService {

  // private baseUrl: string = 'http://localhost:8080/anomaliaexpediente_rest/upload'; // Reemplaza con la URL correcta  
  
  private baseUrl: string = environment.apiUrl + '/files/upload';
  
  
  
  constructor(private http: HttpClient) { }


  uploadFiles(files: File[], userInput: number): Observable<any> {
    const formData: FormData = new FormData();

    files.forEach((file: File) => {
      formData.append('file', file, file.name);
    });

    formData.append('inputNumber', userInput.toString());

    // Cambio importante: establecer la URL correcta y el tipo de contenido
    return this.http.post(this.baseUrl, formData);
  }


}
