import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';
import { AnomaliaExpediente } from 'src/app/models/anomaliaExpediente';
import { AnomaliaExpedienteService } from 'src/app/services/anomalias/anomalia-expediente.service';
import Swal from 'sweetalert2';
import { PhotoDialogComponentComponent } from './photo-dialog-component.component';




import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { EditarRegistroDialogComponent } from './editar-registro-dialog/editar-registro-dialog.component';
import { EditarGravedadComponent } from './editar-gravedad/editar-gravedad.component';


@Component({
  selector: 'app-anomalia-expediente',
  templateUrl: './anomalia-expediente.component.html',
  styleUrls: ['./anomalia-expediente.component.css']
})
export class AnomaliaExpedienteComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngAfterViewInit(): void {
    this.paginator.pageSizeOptions = [100, 50, 15, 5, 1];
    this.paginator.pageSize = 100;
  }


  anomaliasExpedientePorPagina: any[] = [];
  anomaliasExpedientes: any[] = [];
  anomaliasExpedientesOriginal: any[] = [];

  elementosSeleccionados: any[] = [];
  seleccionarTodosVisible: boolean = false;
  numeroExpediente: string | null = null;





  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private anomaliaExpedienteService: AnomaliaExpedienteService
  ) { }


  toggleSeleccion(anomalia: any): void {
    anomalia.seleccionado = !anomalia.seleccionado;
    this.actualizarElementosSeleccionados();
  }


  ngOnInit(): void {
    this.anomaliaExpedienteService.getAllAnomaliaExpediente().subscribe(
      (data: AnomaliaExpediente[]) => {
        this.anomaliasExpedientes = data;
        this.actualizarExpedientesOriginal();
        this.updatePaginator();
        this.paginator.firstPage();
      },
      (error: any) => {
        console.error('Error al obtener anomalías en Expedientes:', error);
      }
    );

  }

  cargarDatos(): void {
    this.anomaliaExpedienteService.getAllAnomaliaExpediente().subscribe(
      (data: AnomaliaExpediente[]) => {
        this.anomaliasExpedientes = data;
        this.actualizarExpedientesOriginal();
      },
      (error: any) => {
        console.error('Error al obtener anomalías en Expedientes:', error);
      }
    );
  }




  seleccionarTodos(event: any): void {
    this.elementosSeleccionados = [];
    if (this.seleccionarTodosVisible) {
      this.anomaliasExpedientePorPagina.forEach((item) => (item.seleccionado = event.target.checked));
      this.elementosSeleccionados = [...this.anomaliasExpedientePorPagina];
    } else {
      this.anomaliasExpedientes.forEach((item) => (item.seleccionado = event.target.checked));
      this.elementosSeleccionados = [...this.anomaliasExpedientes];
    }
  }









  goToFirstPage() {
    if (this.paginator && this.paginator.hasPreviousPage()) {
      this.paginator.firstPage();
      this.updatePaginator();
    }
  }

  goToLastPage() {
    if (this.paginator && this.paginator.hasNextPage()) {
      this.paginator.lastPage();
      this.updatePaginator();
    }
  }




  onPageChange(event: PageEvent) {
    this.paginator.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.updatePaginator();
  }


  updatePaginator() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.anomaliasExpedientes.sort((a, b) => b.id - a.id);
    this.anomaliasExpedientePorPagina = this.anomaliasExpedientes.slice(startIndex, endIndex);
    this.paginator.length = this.anomaliasExpedientes.length;
  }


  cargarAnomaliasExpedientesDesdeNuevaAnomalia(anomaliaExpediente: AnomaliaExpediente) {
    this.anomaliasExpedientes = [anomaliaExpediente];
    this.anomaliasExpedientePorPagina = this.anomaliasExpedientes.slice(0, this.paginator.pageSize);
    this.paginator.length = this.anomaliasExpedientes.length;
    this.anomaliasExpedientePorPagina = this.anomaliasExpedientePorPagina
      .slice()
      .sort((a: { id: number }, b: { id: number }) => b.id - a.id);
  }




  nuevaAnomaliaExpte() {
    this.router.navigate(['/carga-manual'])
  }





  mostrarFotos(fotos: string[], foto: string) {
    const dialogRef = this.dialog.open(PhotoDialogComponentComponent, {
      data: { fotos, foto },
      width: '20%',
      height: '30%',
    });

    dialogRef.afterClosed().subscribe((result: any) => {

    });
  }



  cargaImagenesAnomalia() {
    this.router.navigate(['/carga-imagenes'])
  }




  editarRegistro(anomaliaExpediente: any): void {
    const dialogRef = this.dialog.open(EditarRegistroDialogComponent, {
      width: '800px',
      height: '750px',
      data: { anomaliaExpediente: anomaliaExpediente }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  agregarGravedadSeleccionados(): void {
    const elementosMarcados = this.anomaliasExpedientes.filter(anomalia => anomalia.seleccionado);

    if (elementosMarcados.length === 0) {
      return;
    }

    // Verificar si algún elemento seleccionado tiene el valor "OTROS" en la columna correspondiente
    const tieneOtros = elementosMarcados.some(item => item.codigo !== "OTROS");

    // Si se encontró algún elemento con valor "OTROS", mostrar el mensaje de alerta y salir de la función
    if (tieneOtros) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Únicamente puede cambiar la gravedad si el código es "OTROS"',
      });
      return;
    }

    // Obtener solo los IDs y la gravedad de los elementos seleccionados
    const datosSeleccionados = elementosMarcados.map(item => ({
      id: item.id,
      gravedad: item.gravedad
    }));

    // Abre el popup para editar la gravedad
    const dialogRef = this.dialog.open(EditarGravedadComponent, {
      width: '300px',
      height: '280px',
      data: { elementosSeleccionados: datosSeleccionados }
    });

    // Suscríbete al evento después de cerrar el popup
    dialogRef.afterClosed().subscribe((result: string) => {
      // Si hay un resultado, actualizar la gravedad en los elementos seleccionados
      if (result) {
        elementosMarcados.forEach((item) => {
          item.gravedad = result;
        });
      }
    });
  }








  eliminarElementosMarcados(): void {
    if (this.elementosSeleccionados.length === 0) {
      Swal.fire('Marca al menos un registro para eliminar', '', 'warning');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro de eliminar los registros marcados?',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar',
      text: 'Esta operación es irreversible',
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Se eliminaron los registros marcados!', '', 'success');

        this.elementosSeleccionados.forEach((item) => {
          const index = this.anomaliasExpedientes.indexOf(item);
          if (index !== -1) {
            this.anomaliasExpedientes.splice(index, 1);
            this.anomaliaExpedienteService.deleteAnomaliaExpediente(item.id).subscribe(
              () => {
                console.log(`Registro con ID ${item.id} eliminado en el servidor.`);
              },
              (error) => {
                console.error(`Error al eliminar el registro en el servidor: ${error}`);
              }
            );
          }
        });

        this.actualizarElementosSeleccionados();
        this.actualizarExpedientesOriginal();


        // Esperar 4 segundos (4000 milisegundos) antes de recargar la página
        setTimeout(function () {
          location.reload();
        }, 4000);

        // Navegar a la misma ruta actual para recargar la página
        // this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
        //   this.router.navigate(['/anomalia-expediente']);
        // });
      } else if (result.isDenied) {
        Swal.fire('No se eliminaron los registros marcados', '', 'info');
      }
    });


  }


  actualizarExpedientesOriginal(): void {
    this.anomaliasExpedientesOriginal = [...this.anomaliasExpedientes];

  }






  buscarPorExpediente(): void {
    const numeroExpedienteStr = this.numeroExpediente?.toString() || '';

    if (numeroExpedienteStr.trim() !== '') {
      this.anomaliasExpedientes = this.anomaliasExpedientesOriginal
        .filter(anomalia => anomalia.nroExpediente.toString().includes(numeroExpedienteStr));
    } else {
      this.anomaliasExpedientes = [...this.anomaliasExpedientesOriginal];
    }

    this.updatePaginator();  // Actualizar paginator
  }






  actualizarElementosSeleccionados(): void {
    this.elementosSeleccionados = this.anomaliasExpedientes.filter(item => item.seleccionado);
  }


  hovered = false;

  marcarCheckbox(anomalia: any): void {
    anomalia.seleccionado = !anomalia.seleccionado;
    anomalia.hovered = false; // Reiniciar el estado hovered
    this.actualizarElementosSeleccionados();
  }

  mouseEnter(anomalia: any): void {
    anomalia.hovered = true;
  }

  mouseLeave(anomalia: any): void {
    anomalia.hovered = false;
  }


  formatearFecha(fecha: string): string {
    const partesFecha = fecha.split('|');
    if (partesFecha.length === 3) {
      const [dia, mes, año] = partesFecha;
      return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${año}`;
    } else {
      return fecha; // Si la fecha no está en el formato esperado, devolverla sin cambios
    }
  }

}




























































