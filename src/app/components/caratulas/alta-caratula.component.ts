import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import * as XLSX from 'xlsx';
import { Caratula } from 'src/app/models/caratula';
import { DistribuidoraService } from 'src/app/services/nueva-caratula/distribuidora.service';
import { NuevaCaratulaService } from 'src/app/services/nueva-caratula/nueva-caratula.service';
import { TipoCaratulaService } from 'src/app/services/nueva-caratula/tipo-caratula.service';
import Swal from 'sweetalert2';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';





@Component({
  selector: 'app-alta-caratula',
  templateUrl: './alta-caratula.component.html',
  styleUrls: ['./alta-caratula.component.css'],
  providers:[]
})
export class AltaCaratulaComponent {

  caratulas: Caratula[] = [];

  nuevaCaratulaForm!:FormGroup

  distribuidoras!: any;
  tiposCaratulas!: any;


  caratulasFiltradas: Caratula[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  
  caratulasPorPagina: Caratula[] = [];


  @ViewChild('dropdownButton') dropdownButton!: ElementRef;


  //METODO PARA TRAER LOS DATOS A LA NUEVA CARATULA
  cargarCaratulasDesdeNuevaCaratula(caratulas: Caratula[]) {
    this.caratulas = caratulas;
    this.caratulasPorPagina = this.caratulas.slice(0, this.paginator.pageSize);
    this.paginator.length = this.caratulas.length;
    this.caratulasPorPagina = this.caratulasPorPagina.slice().sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
  }






  exportOptions:MenuItem[] = [
    {
      label: 'Exportar a Excel',
      icon: 'pi pi-file-excel',
      command: () => this.exportToExcel()
    },
    {
      label: 'Exportar a PDF',
      icon: 'pi pi-file-pdf',
      command: () => this.downloadAsPDF()
    }
  ]

  //////////////////////////////////////////////////////////////////////////////
//                           EXPORTAR A PDF                                   //
//////////////////////////////////////////////////////////////////////////////


@ViewChild('tableData', { static: false }) tableData!: ElementRef;



public downloadAsPDF() {
  const doc = new jspdf.jsPDF();
  const tableData = this.tableData.nativeElement;
  

  html2canvas(tableData).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save('tablaCaratulasExpedientes.pdf');
  });
}


  //////////////////////////////////////////////////////////////////////////////
//                           EXPORTAR A EXCEL                                   //
//////////////////////////////////////////////////////////////////////////////


public exportToExcel(): void {
  const fileName = 'caratulas.xlsx';

  

  const data = this.caratulasPorPagina.map(item => ({
    id: item.id,
    fecha: item.fecha,
    tieneExpediente: item.tieneExpediente ? 'Sí' : 'No',
    tipo: item.tipoCaratula ? item.tipoCaratula.tipoDeCaratula : 'No Se Seleccionó una Caratula',
    gravedad: item.tipoGravedad,
    caratulaExpediente: item.caratulaSeleccionada
  }));



  
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, fileName);
}

private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}





//////////////////////////////////////////////////////////////////////////////



  onSelectionChange(item: Caratula) {
    item.isSelected = !item.isSelected;
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
    const sortedCaratulas = this.caratulas.slice().sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
    this.caratulasPorPagina = sortedCaratulas.slice(startIndex, endIndex);
  }
  
  

  constructor(
    
    public distribuidoraService: DistribuidoraService,
    public nuevaCaratulaService: NuevaCaratulaService,
    public tipoCaratulaService: TipoCaratulaService,
    private router:Router) 
  {}

  
  isLoading: boolean = true;

  
  ngOnInit(): void {
    this.nuevaCaratulaService.getAllCaratula().subscribe((resp) => {
      this.caratulas = resp.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id); // Ordenar por ID de manera descendente
      this.caratulasPorPagina = this.caratulas.slice(0, this.paginator.pageSize);
      this.paginator.length = this.caratulas.length;
      this.isLoading = false;
    });
    
    this.nuevaCaratulaService.getAllCaratula().subscribe(resp => {
      this.cargarCaratulasDesdeNuevaCaratula(resp);
    });

    this.nuevaCaratulaForm.get('tipoCaratula')?.valueChanges.subscribe((resp) => {
      this.updateCaratulaSeleccionada(),
      // this.caratulas = resp;
      this.tiposCaratulas = resp;
    });

    this.nuevaCaratulaForm.get('tipoGravedad')?.valueChanges.subscribe((resp) => {
      this.updateCaratulaSeleccionada(),
      this.caratulas = resp;
    });

   

    this.nuevaCaratulaService.getAllCaratula().subscribe(resp => {
      this.caratulas = resp;
    });

    this.distribuidoraService.getAllDistribuidora().subscribe(resp => {
      this.distribuidoras = resp;
    });
    this.tipoCaratulaService.getAllTiposCaratula().subscribe(resp => {
      this.tiposCaratulas = resp;
    },error => { console.error(error) });

    this.nuevaCaratulaService.getAllCaratula().subscribe(resp => {
      this.caratulas = resp;
      this.caratulasPorPagina = resp.slice().sort((a: { id: number; }, b: { id: number; }) => b.id - a.id); // Ordenar en orden descendente
      this.isLoading = false;
    });


    this.distribuidoraService.getAllDistribuidora().subscribe(resp => {
      this.distribuidoras = resp;
    },error => { console.error(error) });


   
   

    this.caratulasFiltradas = [...this.caratulasPorPagina]; // Inicializa las carátulas filtradas con todos los valores al principio
  
  
  }
  filtrarCaratulas(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const texto = inputElement.value.trim().toLowerCase();
  
    if (!texto) {
      this.caratulasPorPagina = [...this.caratulas]; // Restablece la lista de carátulas si el campo de búsqueda está vacío
    } else {
      this.caratulasPorPagina = this.caratulas.filter(caratula =>
        caratula.caratulaSeleccionada.toLowerCase().includes(texto)
      );
    }
  }
  
  
  

  cambiarOrdenTabla() {
    this.caratulasPorPagina = this.caratulasPorPagina.slice().reverse();
  }


  updateCaratulaSeleccionada() {
    const tipoCaratula = this.nuevaCaratulaForm.get('tipoCaratula')?.value;
    const tipoGravedad = this.nuevaCaratulaForm.get('tipoGravedad')?.value;
    const aclaracion = this.nuevaCaratulaForm.get('aclaracion')?.value;

  this.nuevaCaratulaForm
      .get('caratulaSeleccionada')
      ?.setValue(`${tipoCaratula?.tipoDeCaratula} ${tipoGravedad} ${aclaracion}`);
  }

  eliminarFila(item: Caratula) {
    // Encuentra el índice de la fila en el arreglo caratulas
    const index = this.caratulas.indexOf(item);
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
          this.caratulas.splice(index, 1);
          this.nuevaCaratulaService.deleteCaratula(item.id).subscribe(
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
    

    nuevaCaratula(){
      this.router.navigate(['/nuevaCaratula'])
     }


     
  }

      // Elimina la fila del arreglo caratulas
      // this.caratulas.splice(index, 1);
      // this.nuevaCaratulaService.deleteCaratula(item.id).subscribe(
      //   () => {
      //     console.log(`Registro con ID ${item.id} eliminado en el servidor.`);
      //     location.reload();
      //   },
      //   (error) => {
      //     console.error(`Error al eliminar el registro en el servidor: ${error}`);
      //   }
      // );
  
  


// this.caratulasService.getAllCaratulas().subscribe(
    //   (caratulas: Caratula[]) => {
    //     this.caratulas = caratulas;
    //     this.paginator.length = this.caratulas.length;
    //     this.paginator.pageSize = 10; // Establece la cantidad de elementos por página
  
    //     // Aquí inicializa caratulasPorPagina con los datos iniciales
    //     this.caratulasPorPagina = this.caratulas.slice(0, this.paginator.pageSize);
    //     this.isLoading = false; // Indica que los datos han sido cargados
    //   },
    //   (error) => {
    //     console.error(error);
    //     this.isLoading = false; // En caso de error, también debes cambiar el estado de isLoading
    //   }
    // )

    // abrirDropdown() {
      //   this.renderer2.setProperty(this.dropdownButton.nativeElement, 'aria-expanded', 'true');
      //   this.renderer2.addClass(this.dropdownButton.nativeElement, 'show');
      //   const dropdownMenu = this.dropdownButton.nativeElement.nextElementSibling;
      //   this.renderer2.addClass(dropdownMenu, 'show');
      // }