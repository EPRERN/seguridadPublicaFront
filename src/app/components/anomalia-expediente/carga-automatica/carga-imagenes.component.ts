import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AnomaliaExpediente } from 'src/app/models/anomaliaExpediente';
import { AnomaliaExpedienteService } from 'src/app/services/anomalias/anomalia-expediente.service';
import { ExpedienteService } from 'src/app/services/nueva-caratula/expediente.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { VistaPreviaModalComponent } from './vista-previa-modal/vista-previa-modal.component';
import { AyudaPopComponent } from './ayudapop.component';

import { addDays } from 'date-fns';



@Component({
  selector: 'app-carga-imagenes',
  templateUrl: './carga-imagenes.component.html',
  styleUrls: ['./carga-imagenes.component.css']
})
export class CargaImagenesComponent implements OnInit {

  fileList: File[] = [];
  expedientes!: any;
  headers: string[] = [];
  rows: any[] = [];

  nroExpedienteSeleccionado!: string;


  constructor(public dialog: MatDialog, private router: Router, private expedienteService: ExpedienteService, private anomaliaExpedienteService: AnomaliaExpedienteService) { }



  ngOnInit(): void {
    this.expedienteService.getAllExpediente().subscribe(
      (resp) => {
        this.expedientes = resp;
      }
    );
  }


  volver() {
    this.router.navigate(['/anomalia-expediente'])
  }


  onFilesSelected(event: any): void {

    console.log('Iniciando la selección de archivos');
    const files: FileList = event.target.files;
    this.headers = [];
    this.rows = [];

    for (let i = 0; i < files.length; i++) {
      this.fileList.push(files[i]);
    }

    console.log('File list:', this.fileList);

    for (let i = 0; i < this.fileList.length; i++) {
      const fileReader: FileReader = new FileReader();

      fileReader.onload = (e: any) => {
        console.log('Procesando el archivo:', this.fileList[i].name);
        const data: string | ArrayBuffer = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

        const rangeRef = worksheet['!ref'];
        if (!rangeRef) {

          console.error('La referencia de rango no está definida en la hoja de cálculo.');
          return;
        }

        const range: XLSX.Range = XLSX.utils.decode_range(rangeRef);

        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef: string = XLSX.utils.encode_cell({ r: range.s.r, c: C });
          const cell: XLSX.CellObject = worksheet[cellRef];
          this.headers.push(cell && cell.v !== undefined ? String(cell.v) : '');
        }



        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          const row: any = {};
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellRef: string = XLSX.utils.encode_cell({ r: R, c: C });
            const cell: XLSX.CellObject = worksheet[cellRef];
            let cellValue = cell ? cell.v : undefined;


            if (cell && cell.t === 'n' && this.headers[C] === 'Fecha') {
              if (typeof cellValue === 'number') {
                cellValue = this.excelSerialToDate(cellValue);
                console.log('Fecha convertida:', cellValue);
              }
            }


            if (this.headers[C] === 'ANOMALIA') {
              const parts = (cellValue as string).split(':');
              if (parts.length === 2) {
                row['codigo'] = parts[0].trim();
                row['descripcion'] = parts[1].trim();
              } else {

                row['descripcion'] = cellValue;
              }

              console.log('Valor completo de ANOMALÍA:', cellValue);
              console.log('Código:', row['codigo']);
              console.log('Descripción:', row['descripcion']);
            } else {
              row[this.headers[C]] = cellValue;
            }
          }
          this.rows.push(row);
        }

        console.log('Headers:', this.headers);
        console.log('Rows:', this.rows);
      };

      fileReader.readAsBinaryString(this.fileList[i]);
    }
  }



  abrirPopupAyuda() {
    const dialogRef = this.dialog.open(AyudaPopComponent, {
      width: '1200px',
      height: '500px',
      data: { headers: this.headers, rows: this.rows }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de vista previa se cerró.');
    });

  }


  excelSerialToDate(serial: number): Date {
    const epoch = new Date('1899-12-31').getTime(); // Fecha base de Excel
    const daysSinceEpoch = serial - 1; // Restar 1 porque Excel cuenta desde el 1 de enero de 1900

    // Calcular la fecha sumando los días desde la fecha base de Excel
    const date = addDays(epoch, daysSinceEpoch);

    return date;
  }


  uploadFiles(): void {
    console.log('Iniciando la carga de archivos');
    console.log('File list:', this.fileList);

    if (this.fileList.length === 0) {
      console.log('No hay archivo para subir.');
      return;
    }

    if (!this.expedientes) {
      console.log('Seleccione un número antes de subir el archivo.');
      return;
    }

    const nroExpedienteSeleccionado = this.nroExpedienteSeleccionado;
    console.log('Número de expediente seleccionado:', nroExpedienteSeleccionado);

    for (let i = 0; i < this.rows.length; i++) {
      console.log('Procesando la fila:', i);
      console.log('Datos de la fila:', this.rows[i]);

      console.log('Valor de codigo capturado:', this.rows[i].codigo);
      console.log('Valor de descripcion capturado:', this.rows[i].descripcion);




      const expedienteEncontrado = this.expedientes.find(
        (exp: { nroExpediente: any }) => exp.nroExpediente.toString() === nroExpedienteSeleccionado.toString()
      );

      if (!expedienteEncontrado) {
        console.error('Expediente no encontrado para el número: ' + nroExpedienteSeleccionado);
        console.log('Números de expedientes disponibles:', this.expedientes.map((exp: any) => exp.nroExpediente));
        continue;
      }

      console.log('Expediente encontrado:', expedienteEncontrado);

      const anomaliaExpediente: AnomaliaExpediente = {
        id: 0,
        nroExpediente: expedienteEncontrado.nroExpediente,
        caso: this.rows[i].CASOS,
        fecha: this.rows[i].FECHA,
        latitud: this.rows[i].LATITUD,
        longitud: this.rows[i].LONGITUD,
        descripcion: this.rows[i].descripcion,
        medidor: this.rows[i].MEDIDOR,
        fotos: this.rows[i].FOTOS.split(';'),
        direccion: this.rows[i].DIRECCION,
        reclamoSara: this.rows[i].RECLAMO_SARA,
        localidad: this.rows[i].LOCALIDAD,

        codigo: this.rows[i].codigo,
        riesgo: this.rows[i].riesgo,
        otros: this.rows[i].otros,
        denunciante: this.rows[i].denunciante,
        empleado: this.rows[i].empleado,
        gravedad: this.rows[i].gravedad,
        fechaNotificacion: this.rows[i].fechaNotificacion,
        caratulaSeleccionada: this.rows[i].caratulaSeleccionada,
        distribuidora: this.rows[i].distribuidora
      };

      console.log('Datos a guardar:', anomaliaExpediente);

      this.anomaliaExpedienteService.saveAnomaliaExpediente(anomaliaExpediente).subscribe(
        (resp) => {


          Swal.fire({
            title: 'Se han guardado los datos!',
            icon: 'success'
          });
          this.router.navigate(['/anomalia-expediente']);

          console.log('Respuesta del servidor:', resp);
          console.log('Datos guardados exitosamente en la base de datos:', resp);
        },
        (error) => {
          console.error('Error en la solicitud HTTP:', error);
          console.error('Error al guardar datos en la base de datos:', error);
        }
      );
    }

    console.log('Fin de la carga de archivos');
    this.expedientes = undefined;
  }



  removeFile(index: number): void {
    this.fileList.splice(index, 1);
  }

  recargarNavegador(): void {

    location.reload();
  }


  abrirModalVistaPrevia(): void {
    const dialogRef = this.dialog.open(VistaPreviaModalComponent, {
      width: '600px',
      data: { headers: this.headers, rows: this.rows }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de vista previa se cerró.');
    });
  }


}