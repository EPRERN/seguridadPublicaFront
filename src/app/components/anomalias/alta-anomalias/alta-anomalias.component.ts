import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Anomalia } from 'src/app/models/anomalia';
import { AnomaliasService } from 'src/app/services/anomalias/anomalias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alta-anomalias',
  templateUrl: './alta-anomalias.component.html',
  styleUrls: ['./alta-anomalias.component.css']
})
export class AltaAnomaliasComponent implements OnInit {



  
  anomalias: any[] = []
  anomaliasPorPagina: any[] = [];
  filtroCodigo:  string | null = null;
  

  
  filteredAnomalias: any[] = []; // Array para almacenar las anomalías filtradas



  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private anomaliasService: AnomaliasService) { }



  ngOnInit(): void {
    this.anomaliasService.getAllAnomalia().subscribe(
      (data: any) => {
        this.anomalias = data;
        this.filteredAnomalias = this.anomalias; // Inicializar el array de anomalías filtradas
        this.updatePaginator();
      },
      (error: any) => {
        console.error('Error al obtener anomalías:', error);
      }
    );
  }


  goToFirstPage() {
    this.paginator.firstPage();
  }

  goToLastPage() {
    this.paginator.lastPage();
  }
  onPageChange(event: PageEvent) {
    this.paginator.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.updatePaginator();

  }

  updatePaginator() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.anomaliasPorPagina = this.anomalias.slice(startIndex, endIndex);
    this.paginator.length = this.anomalias.length;
  }







  nuevaAnomalia() {
    this.router.navigate(['/nuevaAnomalia'])
  }


  eliminarFila(item: Anomalia) {
    const index = this.anomalias.indexOf(item);
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
          this.anomalias.splice(index, 1);
          this.anomaliasService.deleteAnomalia(item.id).subscribe(
            () => {
              console.log(`Registro con ID ${item.id} eliminado en el servidor.`);
              location.reload();
            },
            (error) => {
              console.error(`Error al eliminar el registro en el servidor: ${error}`);
            }
          );
        } else if (result.isDenied) {
          Swal.fire('No se eliminó el registro', '', 'info')
        }
      })
    }
  }
  codigoExpedientesOriginal:any = [];

  filtrarAnomalias() {
    if (this.filtroCodigo !== null) {
      this.filteredAnomalias = this.anomalias.filter(anomalia =>
        anomalia.codigo.toLowerCase().includes(this.filtroCodigo!.toLowerCase())
      );
    } else {
      // Handle the case when this.filtroCodigo is null
      // For example, you could reset the filtered anomalies to show all anomalies
      this.filteredAnomalias = this.anomalias;
    }
    this.updatePaginator(); // Actualizar el paginador después de filtrar
  }
  



  cambiarOrden() {
    this.anomalias.reverse(); // Invertir el orden de los elementos en el arreglo anomalias
    this.updatePaginator();
  }
}
