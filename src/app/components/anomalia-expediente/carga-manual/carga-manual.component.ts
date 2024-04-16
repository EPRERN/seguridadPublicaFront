import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AnomaliaExpedienteService } from 'src/app/services/anomalias/anomalia-expediente.service';
import { AnomaliasService } from 'src/app/services/anomalias/anomalias.service';
import { DistribuidoraService } from 'src/app/services/nueva-caratula/distribuidora.service';
import { ExpedienteService } from 'src/app/services/nueva-caratula/expediente.service';
import Swal from 'sweetalert2';

import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-carga-manual',
  templateUrl: './carga-manual.component.html',
  styleUrls: ['./carga-manual.component.css']
})
export class CargaManualComponent implements OnInit {


  anomaliaExpedienteForm!: FormGroup;
  anomalias!: any;
  distribuidoras!: any;
  expedientes!: any;

  anomaliasExpedientes: any[] = [];


  localidad: any[] = [
    { localidad: 'Aguada Guzman', codigoPostal: '8333' },
    { localidad: 'Arroyo de la Ventana', codigoPostal: '8168' },
    { localidad: 'Arroyo Los Berros', codigoPostal: '8521' },
    { localidad: 'Balneario El Condor', codigoPostal: '8501' },
    { localidad: 'Balneario El Salado', codigoPostal: '8351' },
    { localidad: 'Balsa Las Perlas', codigoPostal: '8324' },
    { localidad: 'Barda del Medio', codigoPostal: '8305' },
    { localidad: 'Campo Grande', codigoPostal: '8305' },
    { localidad: 'Catriel', codigoPostal: '8307' },
    { localidad: 'Cerro Policia', codigoPostal: '8333' },
    { localidad: 'Cervantes', codigoPostal: '8326' },
    { localidad: 'Chelforo', codigoPostal: '8326' },
    { localidad: 'Chichinales', codigoPostal: '8326' },
    { localidad: 'Chimpay', codigoPostal: '8364' },
    { localidad: 'Choele Choel', codigoPostal: '8360' },
    { localidad: 'Cinco Saltos', codigoPostal: '8303' },
    { localidad: 'Cipolletti', codigoPostal: '8324' },
    { localidad: 'Clemente Onelli', codigoPostal: '8416' },
    { localidad: 'Coronel Belisle', codigoPostal: '8364' },
    { localidad: 'Colonia Julia y Echarren', codigoPostal: '8138' },
    { localidad: 'Comallo', codigoPostal: '8416' },
    { localidad: 'Cona Niyeu', codigoPostal: '8521' },
    { localidad: 'Contralmirante Cordero', codigoPostal: '8301' },
    { localidad: 'Contralmirante Guerrico', codigoPostal: '8328' },
    { localidad: 'Darwin', codigoPostal: '8364' },
    { localidad: 'Dina Huapi', codigoPostal: '8402' },
    { localidad: 'El Cain', codigoPostal: '8422' },
    { localidad: 'El Cuy', codigoPostal: '8333' },
    { localidad: 'El Foyel', codigoPostal: '8401' },
    { localidad: 'El Manso', codigoPostal: '8430' },
    { localidad: 'Ferri', codigoPostal: '8301' },
    { localidad: 'General Roca', codigoPostal: '8332' },
    { localidad: 'General Conesa', codigoPostal: '8503' },
    { localidad: 'General Enrique Godoy', codigoPostal: '8336' },
    { localidad: 'General Fernandez Oro', codigoPostal: '8326' },
    { localidad: 'Guardia Mitre', codigoPostal: '8505' },
    { localidad: 'Ingeniero Huergo', codigoPostal: '8334' },
    { localidad: 'Ingeniero Jacobacci', codigoPostal: '8418' },
    { localidad: 'J.J. Gomez', codigoPostal: '8333' },
    { localidad: 'La Loberia', codigoPostal: '8501' },
    { localidad: 'Lago Pellegrini', codigoPostal: '8305' },
    { localidad: 'Lamarque', codigoPostal: '8363' },
    { localidad: 'Las Grutas', codigoPostal: '8521' },
    { localidad: 'Los Menucos', codigoPostal: '8424' },
    { localidad: 'Luis Beltran', codigoPostal: '8361' },
    { localidad: 'Mainque', codigoPostal: '8326' },
    { localidad: 'Mallin Ahogado', codigoPostal: '8430' },
    { localidad: 'Maquinchao', codigoPostal: '8422' },
    { localidad: 'Mencue', codigoPostal: '8417' },
    { localidad: 'Nahuel Niyeu', codigoPostal: '8536' },
    { localidad: 'Ñorquinco', codigoPostal: '8415' },
    { localidad: 'Paso Cordoba', codigoPostal: '8333' },
    { localidad: 'Peñas Blancas', codigoPostal: '8307' },
    { localidad: 'Pilcaniyeu', codigoPostal: '8412' },
    { localidad: 'Pomona', codigoPostal: '8378' },
    { localidad: 'Punta Colorada', codigoPostal: '8532' },
    { localidad: 'Ramos Mexia', codigoPostal: '8534' },
    { localidad: 'Rio Chico', codigoPostal: '8415' },
    { localidad: 'Rio Colorado', codigoPostal: '8138' },
    { localidad: 'Rio Villegas', codigoPostal: '8401' },
    { localidad: 'San Antonio Oeste', codigoPostal: '8520' },
    { localidad: 'San Carlos de Bariloche', codigoPostal: '8400' },
    { localidad: 'San Javier', codigoPostal: '8501' },
    { localidad: 'Sargento Vidal', codigoPostal: '8305' },
    { localidad: 'Sierra Colorada', codigoPostal: '8434' },
    { localidad: 'Sierra Grande', codigoPostal: '8532' },
    { localidad: 'Sierra Paileman', codigoPostal: '8521' },
    { localidad: 'Stefenelli', codigoPostal: '8332' },
    { localidad: 'Valcheta', codigoPostal: '8536' },
    { localidad: 'Valle Azul', codigoPostal: '8336' },
    { localidad: 'Valle Verde', codigoPostal: '5115' },
    { localidad: 'Viedma', codigoPostal: '8500' },
    { localidad: 'Villa Alberdi', codigoPostal: '8336' },
    { localidad: 'Villa Llanquin', codigoPostal: '8401' },
    { localidad: 'Villa Manzano', codigoPostal: '8308' },
    { localidad: 'Villa Mascardi', codigoPostal: '8401' },
    { localidad: 'Villa Regina', codigoPostal: '8363' },
    { localidad: 'Playas Doradas', codigoPostal: '8532' },
    { localidad: 'El Bolsón', codigoPostal: '8430' },
    { localidad: 'El Bolson', codigoPostal: '8430' },
    { localidad: 'Allen', codigoPostal: '8326' },
    { localidad: 'San Antonio Este', codigoPostal: '8521' },

  ];



  p: number = 1;


  pageChanged(event: any): void {
    this.p = event;
  }

  constructor(private route: ActivatedRoute, private expedienteService: ExpedienteService, private anomaliaService: AnomaliasService, private anomaliaExpedienteService: AnomaliaExpedienteService, private formBuilder: FormBuilder, private router: Router) { }

  formatDate(event: any): void {

    const inputValue: string = event.target.value;
    const numericValue: string = inputValue.replace(/\D/g, '');
    const formattedDate: string = this.formatToCustomDate(numericValue);

    this.anomaliaExpedienteForm.get('fecha')?.setValue(formattedDate);
  }


  private formatToCustomDate(numericValue: string): string {

    const day: string = numericValue.slice(0, 2);
    const month: string = numericValue.slice(2, 4);
    const year: string = numericValue.slice(4, 8);

    return `${day}/${month}/${year}`;
  }

  ngOnInit(): void {

    this.anomaliaExpedienteForm = this.formBuilder.group({

      caratulaSeleccionada: [''],
      nroExpediente: ['', Validators.required],
      caso: [''],
      codigo: [''],
      descripcion: [''],
      riesgo:[''],
      gravedad: [''],
      fecha: ['', [Validators.pattern(/^\d{0,2}\/?\d{0,2}\/?\d{0,4}$/)]],
      otros: [false],
      fotos: this.formBuilder.array([]),

      distribuidora: [{value: '', disabled: true}],
      medidor: [''],
      direccion: [''],
      localidad: [''],
      denunciante: [''],
      autoFillEpre: [false],


      empleado: [''],
      latitud: [0],
      longitud: [0],

      reclamoSara: [0]


    });
    const modoEdicion = this.route.snapshot.queryParamMap.get('modoEdicion') === 'true';
    const registro = modoEdicion ? JSON.parse(this.route.snapshot.queryParamMap.get('registro') || '{}') : null;

    if (modoEdicion && registro) {

      this.anomaliaExpedienteForm.patchValue({
        caratulaSeleccionada: registro.caratulaSeleccionada,
        nroExpediente: registro.nroExpediente,
        caso: registro.caso,
        codigo: registro.codigo,
        descripcion: registro.descripcion,
        gravedad: registro.gravedad,
        fecha: registro.fecha,
        otros: registro.otros,
        fotos: registro.fotos,
        medidor: registro.medidor,
        direccion: registro.direccion,
        localidad: registro.localidad,
        denunciante: registro.denunciante,
        autoFillEpre: registro.autoFillEpre,
        empleado: registro.empleado,
        latitud: registro.latitud,
        longitud: registro.longitud,
        reclamoSara: registro.reclamoSara

      });





      if (this.anomaliaExpedienteForm.get('fotos')) {
        registro.fotos.forEach((foto: string) => {
          this.agregarInputFoto();
          const lastIndex = this.fotosFormArray.length - 1;
          this.fotosFormArray.at(lastIndex).setValue(foto);
        });
      }
    }



    this.expedienteService.getAllExpediente().subscribe(
      (resp) => {
        this.expedientes = resp;
      }
    );
    this.anomaliaService.getAllAnomalia().subscribe(
      (resp) => {
        this.anomalias = resp;
      }
    );
    this.anomaliaExpedienteService.getAllAnomaliaExpediente().subscribe(
      (data: any) => {
        this.anomaliasExpedientes = data;
        console.log('Data: ', data)
      },
      (error: any) => {
        console.error('Error al obtener anomalías en Expedientes:', error);
      }
    )
    
    this.anomaliaExpedienteForm.get('distribuidora')?.disable();
    this.anomaliaExpedienteForm.get('descripcion')?.disable();
    this.anomaliaExpedienteForm.get('gravedad')?.disable();
    this.anomaliaExpedienteForm.get('caratulaSeleccionada')?.disable();
    this.anomaliaExpedienteForm.get('riesgo')?.disable();


    this.anomaliaExpedienteForm.get('otros')?.valueChanges.subscribe((value) => {

      const descripcionControl = this.anomaliaExpedienteForm.get('descripcion');
      const codigoControl = this.anomaliaExpedienteForm.get('codigo');
      const riesgoControl = this.anomaliaExpedienteForm.get('riesgo');




      const gravedadControl = this.anomaliaExpedienteForm.get('gravedad');



      if (value) {
        descripcionControl?.enable();
        descripcionControl?.setValue('');
        
        riesgoControl?.enable();
        riesgoControl?.setValue('')

        gravedadControl?.enable();
        gravedadControl?.setValue('')

        codigoControl?.setValue('');
      } else {
        descripcionControl?.disable();

        gravedadControl?.disable()


      }
    });


    console.log('formData: ', this.anomaliaExpedienteForm)

    this.anomaliaExpedienteForm.get('nroExpediente')?.valueChanges.subscribe((nroExpedienteSeleccionado) => {
      console.log('Nro. Expediente seleccionado:', nroExpedienteSeleccionado);
      const expedienteSeleccionado = this.expedientes.find((expediente: any) => expediente.nroExpediente == nroExpedienteSeleccionado);
      console.log('Expediente seleccionado:', expedienteSeleccionado);
      
      if (expedienteSeleccionado !== undefined) {
        this.anomaliaExpedienteForm.get('distribuidora')?.setValue(expedienteSeleccionado.distribuidora);
        this.anomaliaExpedienteForm.get('caratulaSeleccionada')?.setValue(expedienteSeleccionado.caratulaSeleccionada);
      } else {
        this.anomaliaExpedienteForm.get('caratulaSeleccionada')?.setValue(''); // Limpiar el campo si no se encuentra el expediente
      }
    });
    
    



    this.anomaliaExpedienteForm.get('codigo')?.valueChanges.subscribe((codigoSeleccionado) => {
      const anomaliaSeleccionada = this.anomalias.find((anomalia: { codigo: any; }) => anomalia.codigo === codigoSeleccionado);
      if (anomaliaSeleccionada) {
        this.anomaliaExpedienteForm.get('descripcion')?.setValue(anomaliaSeleccionada.descripcion);
        this.anomaliaExpedienteForm.get('gravedad')?.setValue(anomaliaSeleccionada.gravedad);
        this.anomaliaExpedienteForm.get('riesgo')?.setValue(anomaliaSeleccionada.riesgo);
      } else {
        this.anomaliaExpedienteForm.get('descripcion')?.setValue('');
        this.anomaliaExpedienteForm.get('gravedad')?.setValue('');
        this.anomaliaExpedienteForm.get('codigo')?.setValue('');
        this.anomaliaExpedienteForm.get('riesgo')?.setValue('');
      }
    });



    this.anomaliaExpedienteForm.get('autoFillEpre')?.valueChanges.subscribe((autoFillEpre: boolean) => {

      if (autoFillEpre) {
        this.anomaliaExpedienteForm.get('denunciante')?.setValue('EPRE');
      } else {

        this.anomaliaExpedienteForm.get('denunciante')?.setValue('');
      }
    });
  }


  get fotosFormArray() {
    return this.anomaliaExpedienteForm.get('fotos') as FormArray;
  }

  agregarInputFoto() {
    const nroExpediente = this.anomaliaExpedienteForm.get('nroExpediente')?.value;
    const caso = this.anomaliaExpedienteForm.get('caso')?.value;
    const resultado = `${nroExpediente}-${caso}-`;
    this.fotosFormArray.push(this.formBuilder.control(resultado));
  }

  eliminarInputFoto(index: number) {
    this.fotosFormArray.removeAt(index);
  }

  guardarDatos() {
    if (this.anomaliaExpedienteForm.valid) {
      const formData = {
        ...this.anomaliaExpedienteForm.getRawValue(),
        fotos: this.anomaliaExpedienteForm.get('fotos')?.value,
      };

      if (formData.fecha instanceof Date) {
        formData.fecha = formData.fecha.toISOString();
      }
      console.log('Fecha antes de enviar al servicio:', formData.fecha);


      this.anomaliaExpedienteService.saveAnomaliaExpediente(formData).subscribe(
        (response) => {
          console.log('Datos guardados:', response);
          Swal.fire({
            title: 'Se han guardado los datos!',
            icon: 'success'
          });
          this.router.navigate(['/anomalia-expediente']);
        },
        (error) => {
          console.error('Error al guardar datos:', error);
        }
      );
    }
  }


  
  scrollToTop() {
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }



  volver() {
    this.router.navigate(['/anomalia-expediente'])
  }



}
