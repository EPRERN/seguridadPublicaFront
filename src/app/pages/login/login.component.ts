import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router:Router, private authService:AuthService){

  }


  IraRegistro() {
    this.router.navigate(['/email'])
  }

  IraDash(){
    this.router.navigate(['/dashboard'])
  }
}
