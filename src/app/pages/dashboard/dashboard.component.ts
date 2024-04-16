import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  sidebarVisible: boolean = false;
  sidebarVisible1: boolean = false;
  sidebarVisible3: boolean = false;
  sidebarVisible4: boolean = false;
  sidebarVisible5: boolean = false;

  buttonStyles: { [klass: string]: any } = {
    
    'p-button-outlined': true,
    'p-button-help': true
  };


  constructor(private router:Router){}
  

  irDictamenTecnico(){
    this.router.navigate(['/dictamenTecnico'])
  }

  goHome(){
 
        this.router.navigate(['#'])
   
  }


  goLogin(){
    Swal.fire({
      title: '¿Estás seguro de que quieres cerrar tu sesión?',
      text: "Podrían perderse los cambios que no hayas guardado",
      icon: 'warning',
      showCancelButton: true,
      showCloseButton:true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText:'NO, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login'])
      }
    })
   
  }


  AltaAnomalias(){
    this.router.navigate(['/altaAnomalias'])
  }

  AltaDeExpediente(){
    this.router.navigate(['/altaExpte'])
  }

  Expte(){
    this.sidebarVisible = true
  }


  irACargaManual(){
    this.router.navigate(['/anomalia-expediente'])
  }

  irANuevoExpte(){
    this.router.navigate(['/altaCaratula'])

  }
  Anomalias(){
    this.sidebarVisible1 = true
  }
  FormCargo(){
    this.sidebarVisible3 = true
  }
  Multas(){
    this.sidebarVisible4 = true 
  }
  OtrasOpciones(){
    this.sidebarVisible5 = true
  }

  cargaImagenesAnomalia(){
    this.router.navigate(['/carga-imagenes'])
  }


  irANotificacionAnomalias(){
    this.router.navigate(['/notificacion'])
  }

}
