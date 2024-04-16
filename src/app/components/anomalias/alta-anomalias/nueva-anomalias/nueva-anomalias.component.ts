import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Anomalia } from 'src/app/models/anomalia';
import { AnomaliasService } from 'src/app/services/anomalias/anomalias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nueva-anomalias',
  templateUrl: './nueva-anomalias.component.html',
  styleUrls: ['./nueva-anomalias.component.css']
})
export class NuevaAnomaliasComponent implements OnInit {

  nuevaAnomaliaForm!: FormGroup;
  anomalia:Anomalia[] = [ ];

  anomalias!: any
  task: any = {
    color: 'primary',
  }


  constructor(private router:Router,public fb: FormBuilder, public anomaliaService:AnomaliasService){}


  ngOnInit(): void {
    this.nuevaAnomaliaForm = this.fb.group({
      id: [''],
      descripcion: ['', Validators.required],
      codigo: ['', Validators.required],
      riesgo: ['', Validators.required],
      cuantificacion: ['', Validators.required],
      gravedad: [null, Validators.required], // Añadir Validators.required aquí
      otros: [false]
    });
    
  }



  guardarDatos() {
    if (this.nuevaAnomaliaForm.valid) { // Comprobar si el formulario es válido
      const anomalia: Anomalia = this.nuevaAnomaliaForm.value;
  
      this.anomaliaService.saveAnomalia(anomalia).subscribe(
        (response) => {
          Swal.fire({
            title: '¡Se han guardado los datos!',
            icon: 'success'
          });
          console.log('Respuesta exitosa: ', response);
          this.router.navigate(['/altaAnomalias'])
        },
        (error) => {
          console.log('No se guardaron los datos ', error);
        }
      );
    } else {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor, complete todos los campos obligatorios.',
        icon: 'error'
      });
    }
  }

  volver(){
    this.router.navigate(['/altaAnomalias'])
  }

}
