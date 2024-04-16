import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Expediente } from 'src/app/models/expediente';
import { ExpedienteService } from 'src/app/services/nueva-caratula/expediente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alta-expediente',
  templateUrl: './alta-expediente.component.html',
  styleUrls: ['./alta-expediente.component.css']
})
export class AltaExpedienteComponent implements OnInit {


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  expedientesPorPagina: Expediente[] = [];
  expedientes:Expediente[] = [];

  constructor(private router:Router, public expedienteService:ExpedienteService){}
  
  ngOnInit(): void {
    this.cargarExpedientes();
    this.expedienteService.getAllExpediente().subscribe((resp) => {
      this.expedientes = resp.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id); // Ordenar por ID de manera descendente
      this.expedientesPorPagina = this.expedientes.slice(0, this.paginator.pageSize);
      this.paginator.length = this.expedientes.length;
    })
  }

  cargarExpedientes() {
    this.expedienteService.getAllExpediente().subscribe(
      (data: any) => {
        this.expedientes = data;
        this.expedientesPorPagina = this.expedientes.slice(0, this.paginator.pageSize);
      },
      (error) => {
        console.error('Error al cargar los expedientes:', error);
      }
    );
  }


  public downloadAsPDF() {}
  public exportToExcel():void{}

  cambiarOrdenTabla(){
    this.expedientesPorPagina = this.expedientesPorPagina.slice().reverse();
  }


  goToFirstPage() {
    this.paginator.firstPage();
  }

  goToLastPage() {
    this.paginator.lastPage();
  }
  
  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.expedientesPorPagina = this.expedientes.slice(startIndex, endIndex);
  }

  nuevoExpediente(){
    this.router.navigate(['/CargarNuevoExpediente'])
  }


  eliminarFila(item: Expediente) {
    // Encuentra el índice de la fila en el arreglo caratulas
    const index = this.expedientes.indexOf(item);
    if (index !== -1) {

      Swal.fire({
        title: '¿ Estás seguro de eliminar el registro ?',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: `Cancelar`,
        text: 'Esta operación es irreversible',
        icon: 'warning',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Se eliminó el registro!', '', 'success')
          this.expedientes.splice(index, 1);
          this.expedienteService.deleteExpediente(item.id).subscribe(
            () => {
              console.log(`Registro con ID ${item.id} eliminado en el servidor.`);
              location.reload();
            },
            (error) => {
              console.error(`Error al eliminar el registro en el servidor: ${error}`);
            }
          );
        } else if (result.isDenied) {
          Swal.fire('No se eliminó el registro','', 'info')
          
        }
      })

    }
  }

}
