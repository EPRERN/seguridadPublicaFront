import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { Expediente } from 'src/app/models/expediente';
import { DistribuidoraService } from 'src/app/services/nueva-caratula/distribuidora.service';
import { ExpedienteService } from 'src/app/services/nueva-caratula/expediente.service';
import { NuevaCaratulaService } from 'src/app/services/nueva-caratula/nueva-caratula.service';
import Swal from 'sweetalert2';




export const MY_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'short', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'short' },
  },
};
@Component({
  selector: 'app-cargar-nuevo-expediente',
  templateUrl: './cargar-nuevo-expediente.component.html',
  styleUrls: ['./cargar-nuevo-expediente.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class CargarNuevoExpedienteComponent {
  caratulaSeleccionada: any;
  distribuidora: any;
  nuevoExpedienteForm!: FormGroup;

  startDate = new Date();
  fecha = new FormControl(new Date());
  expedientes: Expediente[] = [];
  distribuidoras!: any;
  tiposCaratulas!: any;
  nuevaCaratula: any[] = [];

  isDistribuidoraDisabled: boolean = true;


  panelColor = new FormControl('red');
  task: any = {
    color: 'primary',
  }



  constructor(private fb: FormBuilder, public router: Router,
    private distribuidoraService: DistribuidoraService,
    private nuevaCaratulaService: NuevaCaratulaService,
    private expedienteService: ExpedienteService) {
  }


  ngOnInit(): void {
    const fechaActual = new Date().toISOString().split('T')[0];
    this.nuevoExpedienteForm = this.fb.group({
      id: [''],
      fecha: [fechaActual, Validators.required],
      caratulaSeleccionada: [''],
      nroExpediente: ['', Validators.required],
      distribuidora: ['']
    });
    this.nuevoExpedienteForm.get('distribuidora')?.disable(); // Aquí deshabilitas el campo de formulario

    this.distribuidoraService.getAllDistribuidora().subscribe(resp => {
      this.distribuidoras = resp;
    });

    this.nuevaCaratulaService.getAllCaratula().subscribe(resp => {
      this.nuevaCaratula = resp;

    })
  }

  onChangeCaratulaSeleccionada() {
    const selectedCaratula = this.nuevoExpedienteForm.get('caratulaSeleccionada')?.value;
    this.caratulaSeleccionada = selectedCaratula;
    const selectedDistribuidora = this.nuevaCaratula.find((item: any) => item.caratulaSeleccionada === selectedCaratula)?.distribuidora.nombreDistribuidora;
    this.distribuidora = selectedDistribuidora;
    this.nuevoExpedienteForm.patchValue({
      distribuidora: selectedDistribuidora
    });
  }


  guardarDatos() {
    Swal.fire({
        title:'Se ha guardado el Expediente Correctamente',
        icon:'success'
    });
    const selectedCaratulaId = this.nuevoExpedienteForm.get('caratulaSeleccionada')?.value;
    const selectedDistribuidoraId = this.nuevoExpedienteForm.get('distribuidora')?.value;
  
    const fechaValue = this.nuevoExpedienteForm.get('fecha')?.value;
    const nroExpedienteValue = this.nuevoExpedienteForm.get('nroExpediente')?.value;
  
    const expedienteData = {
      fecha: fechaValue,
      nroExpediente: nroExpedienteValue,
      caratulaSeleccionada: selectedCaratulaId,
      distribuidora: selectedDistribuidoraId
    };
  
    this.expedienteService.saveExpediente(expedienteData).subscribe(
      resp => {
        this.expedientes.push(resp);
        // Realiza alguna acción adicional si es necesario después de guardar los datos correctamente
      },
      error => {
        console.error(error);
        Swal.fire({
          title: 'Error al guardar los datos',
          text: 'Ha ocurrido un error al intentar guardar los datos. Por favor, inténtelo de nuevo más tarde.',
          icon: 'error'
        });
      }
    );
  
    console.log("Valores que se enviarán:", expedienteData);
  }
  











  enviarCorreo() {

  }

  volver() {
    this.router.navigate(['/altaExpte'])
  }




}

