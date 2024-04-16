import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnomaliaExpediente } from 'src/app/models/anomaliaExpediente';
import { AnomaliaExpedienteService } from 'src/app/services/anomalias/anomalia-expediente.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-editar-gravedad',
  templateUrl:'./editar-gravedad.component.html',
  styleUrls: ['./editar-gravedad.component.css']
})
export class EditarGravedadComponent {


  opcionesCodigo:any[] = [];
  gravedadSeleccionada: string = '';

  codigoSeleccionado: string = '' 


  anomaliasSeleccionadas: any[] = [];
  opcionesGravedad: string[] = ['LEVE', 'MODERADA', 'GRAVE', 'MUY GRAVE', 'INTOLERABLE'];

  constructor(
    public dialogRef: MatDialogRef<EditarGravedadComponent>,
    private anomaliaExpedienteService: AnomaliaExpedienteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Datos recibidos:', data);
    if (data && data.elementosSeleccionados) {
      this.anomaliasSeleccionadas = data.elementosSeleccionados;
      
      this.gravedadSeleccionada = this.anomaliasSeleccionadas[0].gravedad;
      this.codigoSeleccionado = this.anomaliasSeleccionadas[0].codigo;
    } else {
      console.error('Los datos de los elementos seleccionados son undefined.');
    }


    // this.obtenerCodigosAnomalias();
  }

  

  guardarGravedad(): void {
    const idsActualizados = this.anomaliasSeleccionadas.map(item => +item.id);
    console.log('IDs Actualizados:', idsActualizados); 
    
    console.log('Gravedad Seleccionada:', this.gravedadSeleccionada); 
    
    
    this.anomaliaExpedienteService.updateGravedadAnomalias(idsActualizados, this.gravedadSeleccionada,this.codigoSeleccionado).subscribe(
      (registroActualizado: any) => {
        console.log('Registros actualizados:', registroActualizado);
        Swal.fire({
          title: 'Se ha actualizado la gravedad!',
          icon: 'success'
        }).then(() => {
          
          this.dialogRef.close(registroActualizado);
          
          setTimeout(() => {
            location.reload();
          }, 2500);
        });
      },
      (error: any) => {
        console.error('Error en la solicitud HTTP:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al actualizar los datos en la base de datos.',
          icon: 'error'
        });
      }
    );
  }
  

  
  
  
  // obtenerCodigosAnomalias(): void {
  //   this.anomaliaExpedienteService.obtenerCodigosAnomalias().subscribe(
  //     (codigos: string[]) => {
  //       this.opcionesCodigo = codigos;
  //     },
  //     (error: any) => {
  //       console.error('Error al obtener los códigos de anomalías:', error);
  //     }
  //   );
  // }
}
