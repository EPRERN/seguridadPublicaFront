import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {

  cardHeader: string = "Ingrese su Email y le llegará un correo para resetear el password";
  email: string = '';
  nombre:string ='';
  
  constructor(private router:Router){}
  IrALogin(){
    this.router.navigate(['/login'])
  }
}
