
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';


import emailjs, { EmailJSResponseStatus } from 'emailjs-com';


import Swal from 'sweetalert2';


import { catchError, map, startWith } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DistribuidoraService } from 'src/app/services/nueva-caratula/distribuidora.service';
import { NuevaCaratulaService } from 'src/app/services/nueva-caratula/nueva-caratula.service';
import { TipoCaratulaService } from 'src/app/services/nueva-caratula/tipo-caratula.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';



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
  selector: 'app-nueva-caratula',
  templateUrl: './nueva-caratula.component.html',
  styleUrls: ['./nueva-caratula.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class NuevaCaratulaComponent implements OnInit {

  nuevaCaratulaForm!: FormGroup;




  task: any = {
    color: 'primary',
  }

  caratulas!: any;
  distribuidoras!: any;
  tiposCaratulas!: any;
  

  startDate = new Date();
  fecha = new FormControl(new Date());




  constructor(
    private fb: FormBuilder,
    public distribuidoraService: DistribuidoraService,
    public nuevaCaratulaService: NuevaCaratulaService,
    public tipoCaratulaService: TipoCaratulaService,

    public router:Router

  ) { }

  volver(){
    this.router.navigate(['/altaCaratula'])
  }


  ngOnInit(): void {

  

    const fechaActual = new Date().toISOString().split('T')[0];
    this.nuevaCaratulaForm = this.fb.group({
      id: [''],
      fecha: [fechaActual,Validators.required],
      tieneExpediente: [false],
      aclaracion: ['',Validators.required],
      distribuidora: [null,Validators.required],
      tipoCaratula: [null,Validators.required],
      tipoGravedad: ['',Validators.required],
      caratulaSeleccionada: ['']
    });

    this.nuevaCaratulaForm.get('tipoCaratula')?.valueChanges.subscribe(() => {
      this.updateCaratulaSeleccionada();
    });

    this.nuevaCaratulaForm.get('tipoGravedad')?.valueChanges.subscribe(() => {
      this.updateCaratulaSeleccionada();
    });

    this.tipoCaratulaService.getAllTiposCaratula().subscribe(resp => {
      this.tiposCaratulas = resp;
    },error => { console.error(error) });


    this.nuevaCaratulaService.getAllCaratula().subscribe(resp => {
      this.caratulas = resp;
    },error => { console.error(error) });


    this.distribuidoraService.getAllDistribuidora().subscribe(resp => {
      this.distribuidoras = resp;
    },error => { console.error(error) });

  }
  updateCaratulaSeleccionada() {
    const tipoCaratula = this.nuevaCaratulaForm.get('tipoCaratula')?.value;
    const tipoGravedad = this.nuevaCaratulaForm.get('tipoGravedad')?.value;
    const aclaracion = this.nuevaCaratulaForm.get('aclaracion')?.value;

  this.nuevaCaratulaForm
      .get('caratulaSeleccionada')
      ?.setValue(`${tipoCaratula?.tipoDeCaratula} ${tipoGravedad} ${aclaracion}`);
  }



  guardarDatos() {
    Swal.fire({
      title: 'Se han guardado los datos!',
      icon: 'success'
    });
    this.nuevaCaratulaService.saveCaratulas(this.nuevaCaratulaForm.value).subscribe(resp => {
      this.caratulas = this.caratulas.filter((caratulas: { id: any }) => resp.id == caratulas.id);
      this.caratulas.push(resp);
    },
    error => { console.error(error)});


   }
  
  enviarCorreo() {
    let tieneExpedienteSymbol: string = this.nuevaCaratulaForm.get('tieneExpediente')?.value ? '✓' : '✗';

    if (this.nuevaCaratulaForm.valid) {
        // const templateParams = {
        //     message: 'Buenos días, se solicita la apertura de un Expediente de Seguridad Pública:',
        //     fecha: this.nuevaCaratulaForm.get('fecha')?.value,
        //     aclaracion: this.nuevaCaratulaForm.get('aclaracion')?.value,
        //     distribuidora: this.nuevaCaratulaForm.get('distribuidora')?.value.nombreDistribuidora,
        //     tipoCaratula: this.nuevaCaratulaForm.get('tipoCaratula')?.value.tipoDeCaratula,
        //     tipoGravedad: this.nuevaCaratulaForm.get('tipoGravedad')?.value,
        //     caratulaSeleccionada: this.nuevaCaratulaForm.get('caratulaSeleccionada')?.value
        // };

        // Enviar el correo
        // emailjs.send('service_8io144d', 'template_hwihqn6', templateParams, 'EC21HTNE0PH36sjXt')
        //     .then((response: EmailJSResponseStatus) => {
        //         console.log('Correo enviado', response);
        //         this.nuevaCaratulaForm.reset();
        //         Swal.fire({
        //             title: 'Se han guardado los datos y enviado el correo!',
        //             icon: 'success'
        //         });
        //     })
        //     .catch((error) => {
        //         console.error('Error al enviar el correo', error);
        //     });
    }
  }
  
  

}





  // this.caratulasService.getAllDistribuidoras().subscribe(
  //   (distribuidoras: Distribuidora[]) => {
  //     this.distribuidoras = distribuidoras;
  //   },
  //   (error) => {
  //     console.error(error);
  //   }
  // );
  // this.caratulasService.obtenerUltimoIdCaratulas().subscribe(
  //   (ultimoId: number) => {
  //     this.t_caratulasid = ultimoId + 1;
  //     this.formulario1.controls['t_caratulasid'].setValue(this.t_caratulasid);
  //   },
  //   (error) => {
  //     console.error('Error al obtener el ultimo id', error);
  //   }
  // );




  // this.caratulasGravedadService.getAllCaratulasGravedad().subscribe(
  //   (caratulasGravedades: CaratulaGravedad[]) => {
  //     this.caratulasGravedades = caratulasGravedades;
  //     console.log('Datos de caratulasGravedades:', this.caratulasGravedades);

  //   },
  //   (error) => {
  //     console.error(error);
  //   }
  // );


  // this.formulario1.patchValue({

  //   caratulasfecha: fechaActual});


  // Obtén los datos del formulario1
  // const datosFormulario1 = this.formulario1.value;
  // Construye la concatenación deseada
  // const caratulasseleccionada = `${datosFormulario1.t_caratulastipoid.t_caratulastipodescripcion} ${datosFormulario1.t_caratulasgravedadid.caratulasgravedaddescripcion} ${datosFormulario1.caratulasaclaracion}`;

  // Asigna la concatenación al campo caratulasseleccionada en los datos del formulario
  // datosFormulario1.caratulasseleccionada = caratulasseleccionada;

  // }
  



  // Convierte t_caratulasgravedadid en una cadena (string)
  // const t_caratulasgravedadidString = datosFormulario1.t_caratulasgravedadid.toString();
  // const datosFormulario1 = this.formulario1.value;

  // Agrega un console.log para ver los datos antes de enviarlos al backend
  // console.log('Datos a enviar al backend:', datosFormulario1);

  // const caratulasseleccionada = `${datosFormulario1.t_caratulastipoid.t_caratulastipodescripcion} ${datosFormulario1.t_caratulasgravedadid.caratulasgravedaddescripcion} ${datosFormulario1.caratulasaclaracion}`;
  // Construye el objeto en el formato deseado
  // const objetoParaEnviar = {
  //   t_caratulasid: datosFormulario1.t_caratulasid,
  //   caratulasfecha: datosFormulario1.caratulasfecha,
  //   caratulastieneexpte: datosFormulario1.caratulastieneexpte,
  //   caratulasaclaracion: datosFormulario1.caratulasaclaracion,
  //   t_distribuidorasid: {
  //     distribuidorasnombre: datosFormulario1.t_distribuidorasid.distribuidorasnombre,
  //     distribuidorasid: datosFormulario1.t_distribuidorasid.distribuidorasid
  //   },
  //   t_caratulastipoid: {
  //     t_caratulastipoid: datosFormulario1.t_caratulastipoid.t_caratulastipoid,
  //     t_caratulastipodescripcion: datosFormulario1.t_caratulastipoid.t_caratulastipodescripcion,
  //     t_caratulastipocodigo: datosFormulario1.t_caratulastipoid.t_caratulastipocodigo
  //   },
  //   t_caratulasgravedadid: {
  //     caratulasgravedaddescripcion: datosFormulario1.t_caratulasgravedadid.caratulasgravedaddescripcion,
  //     caratulasgravedadid: datosFormulario1.t_caratulasgravedadid.caratulasgravedadid
  //   },
  //   caratulasseleccionada: caratulasseleccionada
  // };


  //   this.caratulasService.createCaratulas(objetoParaEnviar)
  //     .pipe(
  //       catchError(error => {
  //         console.error('Error en la solicitud HTTP: ', error);
  //         return throwError(error);
  //       })
  //     )
  //     .subscribe(
  //       (response) => {
  //         // Maneja la respuesta del backend aquí si es necesario
  //         console.log('Datos guardados exitosamente:', response);
  //         Swal.fire({
  //           position: 'top-end',
  //           icon: 'success',
  //           title: 'Datos guardados exitosamente',
  //           showConfirmButton: false,
  //           timer: 2500,
  //         });
  //         // Restablece el formulario después de guardar
  //         this.formulario1.reset();
  //       });

  //   this.t_caratulasid++;

  //   const valuesFormulario1 = this.formulario1.value;
  //   const gravedadSeleccionada = this.formulario1.get('t_caratulasgravedadid')?.value;

  //   this.fechaFormulario1 = valuesFormulario1.caratulasfecha;

  //   if (gravedadSeleccionada) {
  //     // Busca el objeto CaratulaGravedad correspondiente en el arreglo
  //     const gravedadObj = this.caratulasGravedades.find(gravedad => gravedad.caratulasgravedaddescripcion === gravedadSeleccionada);
  //     if (gravedadObj) {
  //       // Si se encontró la gravedad seleccionada, asigna su descripción al formulario2
  //       this.formulario1.patchValue({
  //         caratulasgravedaddescripcion: gravedadObj.caratulasgravedaddescripcion
  //       });
  //     } else {
  //       // Manejar el caso en el que no se encontró la gravedad seleccionada
  //       this.formulario1.patchValue({
  //         caratulasgravedaddescripcion: '', // O proporciona un valor predeterminado apropiado
  //       });
  //     }
  //   } else {
  //     // Manejar el caso en el que no se seleccionó ninguna gravedad
  //     this.formulario1.patchValue({
  //       caratulasgravedaddescripcion: '',
  //     });
  //   }
  //  }

// }