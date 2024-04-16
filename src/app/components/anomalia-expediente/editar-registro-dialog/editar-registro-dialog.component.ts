import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnomaliaExpedienteService } from 'src/app/services/anomalias/anomalia-expediente.service';
import Swal from 'sweetalert2';





@Component({
  selector: 'app-editar-registro-dialog',
  templateUrl: './editar-registro-dialog.component.html',
  styleUrls: ['./editar-registro-dialog.component.css']
})
export class EditarRegistroDialogComponent {
  anomalias: any[] = []; // Ajusta según tus necesidades
  anomaliaExpedienteForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditarRegistroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private anomaliaExpedienteService: AnomaliaExpedienteService
  ) {
    this.anomaliaExpedienteForm = this.formBuilder.group({
      id: [data.anomaliaExpediente.id],
      nroExpediente: [data.anomaliaExpediente.nroExpediente],
      caso: [data.anomaliaExpediente.caso],
      codigo: [data.anomaliaExpediente.codigo],
      otros: [data.anomaliaExpediente.otros],
      descripcion: [data.anomaliaExpediente.descripcion],
      fecha: [data.anomaliaExpediente.fecha],
      fotos: this.formBuilder.array(data.anomaliaExpediente.fotos || []),
      medidor: [data.anomaliaExpediente.medidor],
      direccion: [data.anomaliaExpediente.direccion],
      denunciante: [data.anomaliaExpediente.denunciante],
      distribuidora:[data.anomaliaExpediente.distribuidora],
      autoFillEpre: [data.anomaliaExpediente.autoFillEpre],
      empleado: [data.anomaliaExpediente.empleado],
      latitud: [data.anomaliaExpediente.latitud],
      longitud: [data.anomaliaExpediente.longitud],
      reclamoSara: [data.anomaliaExpediente.reclamoSara],
      localidad: [data.anomaliaExpediente.localidad]
    });
  }

  get fotosFormArray(): FormArray {
    return this.anomaliaExpedienteForm.get('fotos') as FormArray;
  }

  formatDate(event: any): void {

  }

  guardarDatos(): void {
    const datosActualizados = this.anomaliaExpedienteForm.value;

    // Asegúrate de que el id existe y no es undefined ni null
    if (datosActualizados.id !== undefined && datosActualizados.id !== null) {
      this.anomaliaExpedienteService.updateAnomaliaExpediente(datosActualizados).subscribe(
        (registroActualizado) => {
          console.log('Registro actualizado:', registroActualizado);
          Swal.fire({
            title: 'Se han Actualizado los datos!',
            icon: 'success'
          });

          // Cierra el diálogo
          this.dialogRef.close(registroActualizado);
          location.reload();
        },
        (error) => {
          // Maneja el error si es necesario
          console.error('Error al actualizar el registro:', error);
          // Puedes mostrar un mensaje de error al usuario si es necesario
        }
      );
    } else {
      // Maneja el caso donde el id no es válido
      console.error('El ID del registro no es válido:', datosActualizados.id);
      // Puedes mostrar un mensaje de error al usuario si es necesario
    }
  }


  cerrarDialog(): void {
    this.dialogRef.close();
  }



  // Lógica para agregar una nueva foto al FormArray
  agregarNuevaFoto() {
    this.fotosFormArray.push(this.formBuilder.control(''));
  }

  // Lógica para eliminar una foto del FormArray
  eliminarInputFoto(index: number) {
    this.fotosFormArray.removeAt(index);
  }


  
}
