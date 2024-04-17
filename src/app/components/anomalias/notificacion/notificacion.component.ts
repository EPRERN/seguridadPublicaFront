import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';

import * as XLSX from 'xlsx';

import { Anomalia } from 'src/app/models/anomalia';
import { Caratula } from 'src/app/models/caratula';
import { AnomaliaExpedienteService } from 'src/app/services/anomalias/anomalia-expediente.service';
import { AnomaliasService } from 'src/app/services/anomalias/anomalias.service';
import { NuevaCaratulaService } from 'src/app/services/nueva-caratula/nueva-caratula.service';
import { AnomaliaExpediente } from 'src/app/models/anomaliaExpediente';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ExpedienteService } from 'src/app/services/nueva-caratula/expediente.service';
import { Expediente } from 'src/app/models/expediente';
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';
import { AnomaliaNotificada } from 'src/app/models/anomaliaNotificada';



@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit {
  [x: string]: any;




  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.paginator.pageSizeOptions = [100, 50, 15, 5, 1];
    this.paginator.pageSize = 100;
  }

  caratulas: Caratula[] = [];
  expandedGroups: { [key: string]: boolean } = {};
  notificacionesExpedientesOriginal: any[] = [];
  notificacionesExpedientePorPagina: any[] = [];
  notificacionesExpedientes: any[] = [];
  caratulasExpedientes: any[] = [];
  tiposCaratulas: any[] = [];
  anomalias: any[] = [];
  expedientes: any[] = [];
  mostrarBotonNotificacion: boolean = true;
  paginatorPageSize: number = 100;
  registrosNotificados: any[] = [];

  anomaliaNotificada: AnomaliaNotificada = {
    id: 0,
    caratulaSeleccionada: '',
    nroExpediente: 0,
    caso: 0,
    distribuidora: '',
    codigo: '',
    descripcion: '',
    fecha: '',
    otros: false,
    fotos: [],
    empleado: '',
    direccion: '',
    localidad: '',
    denunciante: '',
    latitud: 0,
    longitud: 0,
    medidor: '',
    // mostrarBotonNotificacion: false,
    reclamoSara: 0,
    gravedad: '',
    fechaNotificacion: '',
    riesgo: '',
    notificada: false
  };

  anomaliasNotificadas: AnomaliaNotificada[] = [];


  constructor(
    private anomaliaExpedienteService: AnomaliaExpedienteService,
    public nuevaCaratulaService: NuevaCaratulaService,
    private anomaliasService: AnomaliasService,
    private expedienteService: ExpedienteService
  ) { }





  ngOnInit(): void {

    this.loadData();
    this.anomaliaExpedienteService.getAllAnomaliaExpediente().subscribe(
      (data: AnomaliaExpediente[]) => {
        // Inicializa mostrarBotonNotificacion en true para cada grupo de notificacionesExpedientes
        this.notificacionesExpedientes = data.map(grupo => ({
          ...grupo,
          mostrarBotonNotificacion: true, // Agrega la propiedad mostrarBotonNotificacion a cada grupo
          notificado: false, // Agrega la propiedad notificado a cada grupo
          anomaliaNotificada: { notificada: false } // Inicializa anomaliaNotificada con { notificada: false }
        }));
        this.updatePaginator();
      },
      (error: any) => {
        console.error('Error al obtener notificaciones en Expedientes:', error);
      }
    );

    this.expedienteService.getAllExpediente().subscribe(
      (data: Expediente[]) => {
        this.expedientes = data;
        console.log(data);
        this.procesargrupoExpedientes();
      }
    );


    this.anomaliaExpedienteService.obtenerTodasLasAnomaliasNotificadas().subscribe(
      (data: AnomaliaNotificada[]) => {
        this.anomaliasNotificadas = data;
        console.log('Anomalia notificada: ', data)
      }, (error: any) => {
        console.error('Error al obtener anomalías:', error);
      }
    );
    this.anomaliasService.getAllAnomalia().subscribe(
      (data: Anomalia[]) => {
        this.anomalias = data;
      },
      (error: any) => {
        console.error('Error al obtener anomalías:', error);
      }
    );

    this.nuevaCaratulaService.getAllCaratula().subscribe(resp => {
      this.caratulasExpedientes = resp;
    });
  }




  loadData(): void {
    // Lógica para cargar los datos y obtener el total de elementos
    this.anomaliaExpedienteService.obtenerTodasLasAnomaliasNotificadas().subscribe(
      (data: AnomaliaNotificada[]) => {
        this.totalItems = data.length;
        this.currentPage = 1;
        this.updatePagedData();
        console.log('Anomalias notificadas:', data);
      },
      (error: any) => {
        console.error('Error al obtener anomalías:', error);
      }
    );
  }

  updatePagedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedAnomaliasNotificadas = this.anomaliasNotificadas.slice(startIndex, endIndex);
  }

  onPageChangeData(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.updatePagedData();
  }


  meses: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];





  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////             NOTIFICAR ANOMALIA           //////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////


  async notificarGrupo(grupo: any): Promise<void> {
    this.anomaliaNotificada = { ...grupo.anomaliaNotificada };


    this.anomaliaNotificada.id = grupo.id; // Asigna el id si es necesario
    this.anomaliaNotificada.nroExpediente = grupo.nroExpediente;
    this.anomaliaNotificada.caso = grupo.caso;
    this.anomaliaNotificada.codigo = grupo.codigo
    this.anomaliaNotificada.descripcion = grupo.descripcion
    this.anomaliaNotificada.fecha = grupo.fecha
    this.anomaliaNotificada.otros = grupo.otros
    this.anomaliaNotificada.fotos = grupo.fotos
    this.anomaliaNotificada.medidor = grupo.medidor
    this.anomaliaNotificada.direccion = grupo.direccion
    this.anomaliaNotificada.localidad = grupo.localidad
    this.anomaliaNotificada.denunciante = grupo.denunciante
    this.anomaliaNotificada.empleado = grupo.empleado
    this.anomaliaNotificada.latitud = grupo.latitud
    this.anomaliaNotificada.longitud = grupo.longitud
    this.anomaliaNotificada.reclamoSara = grupo.reclamoSara
    this.anomaliaNotificada.gravedad = grupo.gravedad
    this.anomaliaNotificada.fechaNotificacion = grupo.fechaNotificacion
    this.anomaliaNotificada.riesgo = grupo.riesgo
    this.anomaliaNotificada.notificada = grupo.notificada

    console.log('Datos de grupo.anomaliaNotificada:', grupo.anomaliaNotificada); // Agregar este console.log

    const fechaNotificacion = this.calcularFechaNotificacion(grupo.registros);


    let fechaTexto = '';

    const fechaPartes = grupo.fecha.split('/');
    const dia = fechaPartes[0];
    const mes = this.meses[parseInt(fechaPartes[1]) - 1];
    const anio = fechaPartes[2];



    grupo.registros.forEach((notificacion: any) => {
      console.log('Notificando:', notificacion); // Verificar si se está notificando correctamente


      notificacion.fechaNotificacion = fechaNotificacion;

      this.anomaliaNotificada.id = notificacion.id; // Asigna el id si es necesario
      this.anomaliaNotificada.nroExpediente = notificacion.nroExpediente;
      this.anomaliaNotificada.caso = notificacion.caso;
      this.anomaliaNotificada.codigo = notificacion.codigo;
      this.anomaliaNotificada.distribuidora = notificacion.distribuidora
      this.anomaliaNotificada.caratulaSeleccionada = notificacion.caratulaSeleccionada
      this.anomaliaNotificada.descripcion = notificacion.descripcion
      this.anomaliaNotificada.fecha = notificacion.fecha
      this.anomaliaNotificada.otros = notificacion.otros
      this.anomaliaNotificada.fotos = notificacion.fotos
      this.anomaliaNotificada.medidor = notificacion.medidor
      this.anomaliaNotificada.direccion = notificacion.direccion
      this.anomaliaNotificada.localidad = notificacion.localidad
      this.anomaliaNotificada.denunciante = notificacion.denunciante
      this.anomaliaNotificada.empleado = notificacion.empleado
      this.anomaliaNotificada.latitud = notificacion.latitud
      this.anomaliaNotificada.longitud = notificacion.longitud
      this.anomaliaNotificada.reclamoSara = notificacion.reclamoSara
      this.anomaliaNotificada.gravedad = notificacion.gravedad
      this.anomaliaNotificada.fechaNotificacion = notificacion.fechaNotificacion
      this.anomaliaNotificada.riesgo = notificacion.riesgo
      this.anomaliaNotificada.notificada = notificacion.notificada


      this.anomaliaExpedienteService.updateOcultoAnomalia(notificacion.id, true).subscribe(
        () => console.log('Campo oculto actualizado exitosamente.'),
        (error) => console.error('Error al actualizar el campo oculto:', error)
      );
      // Lógica para notificar
      this.notificar(notificacion);

      // Agregar el registro notificado a registrosNotificados
      this.registrosNotificados.push(notificacion);
    });

    grupo.anomaliaNotificada.notificada = true;
    // Oculta el botón de notificación del grupo notificado
    grupo.mostrarBotonNotificacion = false;
    grupo.notificado = true; // Establecer la bandera de notificado
    this.updateNotificacionesExpedientes();

    grupo.oculto = true; // Establecer la propiedad oculto en true para el registro notificado


    const contenidoPDF = fechaTexto + '\n';
    this.textoDocumento2 += contenidoPDF;
    await new Promise(resolve => setTimeout(resolve, 0));

    this.anomaliaExpedienteService.guardarAnomaliaNotificada(this.anomaliaNotificada).subscribe(
      () => {
        grupo.anomaliaNotificada.notificada = true;
        Swal.fire({
          title: 'Notificación exitosa',
          text: `Se ha notificado el registro. Fecha y hora: ${new Date().toLocaleString()}`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error => {
        console.error('Error al notificar en la base de datos:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al notificar en la base de datos.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );



    setTimeout(() => {
      location.reload();
    }, 4000);

    this.descargarDocumento(grupo);
    this.imprimirPDF(grupo);
    this.imprimirPDF2(grupo);
    this.generarExcel(grupo);
    this.imprimirPlanillaDeRiesgo(grupo);
  }




  textoDocumento2: string = '';
  textoDocumento1: string = '';
  descargarDocumento(notificaciones: AnomaliaExpediente[] | AnomaliaExpediente): void {
    this['textoDocumento2'] = ''; // Accediendo a 'textoDocumento2' con notación de índice
  
    if (Array.isArray(notificaciones)) {
      notificaciones.forEach((anomalia, index) => {
        const localidadesArray = anomalia.localidad.split(',');
        const localidades = localidadesArray.join(' - ');
  
        this['textoDocumento2'] += `Caso ${anomalia.caso}, Anomalía ${anomalia.codigo}, MED:${anomalia.medidor}, ${localidades}.- ${anomalia.descripcion}(Fotos ${anomalia.fotos.join(' / ')})`;
        
        // Agregar un salto de línea solo si no es el último registro
        if (index < notificaciones.length - 1) {
          this['textoDocumento2'] += '\n';
        }
      });
    } else {
      const anomalia = notificaciones;
      const localidadesArray = anomalia.localidad.split(',');
      const localidades = localidadesArray.join(' - ');
  
      this['textoDocumento2'] += `Caso ${anomalia.caso}, Anomalía ${anomalia.codigo}, MED:${anomalia.medidor}, ${localidades}.- ${anomalia.descripcion}(Fotos ${anomalia.fotos.join(' / ')})`;
    }
  }
  
  async imprimirPDF(grupo: any): Promise<void> {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([900, 1000]);
      const { width, height } = page.getSize();
  
      const fontSize = 12;
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
      let y = height - 50;
  
      const fechaPartes = grupo.fecha.split('/');
      const dia = fechaPartes[0];
      const mes = this.meses[parseInt(fechaPartes[1]) - 1];
      const anio = fechaPartes[2];
  
      if (grupo.registros.length > 0) {
        const distribuidora = grupo.distribuidora; // Obtener la distribuidora del grupo
  
        const fechaTexto = `A los ${dia} días del mes de ${mes} de ${anio}, se efectúa una inspección ocular\npor parte de Tco. (${grupo.registros.map((registro: { empleado: any; }) => registro.empleado).join(', ')})\nen representante del ENTE PROVINCIAL REGULADOR DE LA ELECTRICIDAD,\na los fines de constatar el estado de las líneas\nde Distribución Eléctrica, a ROCA-VIEDMA a cargo de la empresa \n(${distribuidora}) de la cual surgen las siguientes anomalías detalladas:\n`;
  
        const fechaLines = fechaTexto.split('\n');
  
        for (const line of fechaLines) {
          page.drawText(line, {
            x: 50,
            y,
            size: fontSize,
            font: boldFont,
            color: rgb(0, 0, 0),
          });
          y -= 15;
        }
  
        // Iterar sobre cada registro del grupo
        grupo.registros.forEach((anomaliaExpediente: any) => {
          const textoNotificacion = `
            Caso ${anomaliaExpediente.caso}, Anomalía ${anomaliaExpediente.codigo}, MED:${anomaliaExpediente.medidor}, ${anomaliaExpediente.localidad}.- ${anomaliaExpediente.descripcion}(Fotos ${anomaliaExpediente.fotos.join(' / ')})
          `;
  
          page.drawText(textoNotificacion, {
            x: 50,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
          y -= 15;
  
          // Agregar un salto de línea después de cada registro
          y -= 15;
        });
  
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Inspeccion_Ocular.pdf';
        link.click();
      } else {
        console.error('El grupo está vacío.');
        return;
      }
    } catch (error) {
      console.error('Error al imprimir el PDF:', error);
    }
  }
  














  updateNotificacionesExpedientes() {
    // Filtrar las notificaciones no notificadas y actualizar la lista
    this.notificacionesExpedientes = this.notificacionesExpedientes.filter(grupo => !grupo.notificado);
  }







  pageSizeOptions: number[] = [5, 10, 25, 100]; // Opciones de tamaño de página
  pageSize: number = 10; // Tamaño de página inicial
  totalItems: number = 0; // Total de elementos
  currentPage: number = 1; // Página actual
  pagedAnomaliasNotificadas: AnomaliaNotificada[] = []; // Array de anomalías paginadas









  ///////////////---------------------------------------------------------------------------------------------------------------------


  onPageChange(event: PageEvent) {
    this.paginatorPageSize = event.pageSize;
    this.updatePaginator();
  }

  updatePaginator() {
    const startIndex = this.paginator.pageIndex * this.paginatorPageSize;
    const endIndex = startIndex + this.paginatorPageSize;
    this.notificacionesExpedientePorPagina = this.notificacionesExpedientes.slice(startIndex, endIndex);
    this.paginator.length = this.notificacionesExpedientes.length;
  }



  toggleGrupo(grupoExpediente: any): void {
    this.expandedGroups[grupoExpediente.nroExpediente] = !this.expandedGroups[grupoExpediente.nroExpediente];
  }


  isGrupoExpandido(nroExpediente: string): boolean {
    return this.expandedGroups[nroExpediente] || false;
  }



  procesargrupoExpedientes(): void {

    if (this.expedientes.length > 0) {

      const primeraDistribuidora = this.expedientes[0].distribuidora;

      if (primeraDistribuidora !== undefined && primeraDistribuidora !== null) {


      } else {
        console.error('La distribuidora del primer expediente es undefined o null.');
      }
    } else {
      console.error('No se han recibido expedientes.');
    }
  }



  actualizarExpedientesOriginal(): void {
    this.notificacionesExpedientesOriginal = [...this.notificacionesExpedientes];
  }






  notificar(notificacionExpediente: AnomaliaExpediente) {

    const textoNotificacion = `
      Caso ${notificacionExpediente.caso}, Anomalía ${notificacionExpediente.codigo}, MED:${notificacionExpediente.medidor}, 
      ${notificacionExpediente.localidad}.- ${notificacionExpediente.descripcion}(Fotos ${notificacionExpediente.fotos.join(' / ')})
    `;


  }



  agruparPorExpediente(notificaciones: any[]): any[] {
    const grupos: any[] = [];
    const mapa: { [key: string]: any } = {};

    notificaciones.forEach(notificacion => {
      const key = notificacion.nroExpediente;
      if (!mapa[key]) {

        mapa[key] = { ...notificacion, registros: [notificacion] };
      } else {

        mapa[key].caso += ' a ' + notificacion.caso;
        mapa[key].registros.push(notificacion);
      }
    });

    for (const key in mapa) {
      if (mapa.hasOwnProperty(key)) {
        grupos.push(mapa[key]);
      }
    }

    return grupos;
  }






  obtenerRangoCasos(grupoExpediente: any[]): string {
    const casos = grupoExpediente.map(expediente => expediente.caso);
    casos.sort((a, b) => a - b);
    const primerCaso = casos[0];
    const ultimoCaso = casos[casos.length - 1];


    return `${primerCaso} a ${ultimoCaso}`;
  }










  ///////////////////////////            CEDULA DE NOTIFICACION                   //////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async imprimirPDF2(grupo: any): Promise<void> {
    // Verificar si grupo es un objeto
    if (typeof grupo !== 'object' || grupo === null) {
      console.error('El argumento "grupo" no es un objeto válido.');
      return; // Salir de la función si grupo no es un objeto válido
    }


    const casos = grupo.registros.map((registro: { caso: any; }) => registro.caso).join(', ');
    const fechaPartes = grupo.registros[0].fecha.split('/');
    const dia = fechaPartes[0];
    const mes = this.meses[parseInt(fechaPartes[1]) - 1];
    const anio = fechaPartes[2];

    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([900, 1000]);
      const { width, height } = page.getSize();
      const fontSize = 12;
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const caratulaSeleccionada = grupo.registros[0].caratulaSeleccionada;
      const nroExpediente = grupo.registros[0].nroExpediente;
      const distribuidoras = Array.from(new Set(grupo.registros.map((registro: { distribuidora: any; }) => registro.distribuidora))).join(', ');

      const saludo = "\nDe mi mayor consideración: \n";
      const textoRestante = `

      Me dirijo a Uds. Con relación al expediente administrativo caratulado: ${caratulaSeleccionada} .- \nExpediente Nº: ${nroExpediente} .- Casos: ${casos}  de Trámite por ante este \nENTE PROVINCIAL REGULADOR DE LA ELECTRICIDAD DE LA PROVINCIA DE RÍO NEGRO,\n con asiento de funciones en calle 9 de julio Mº 174, en los que se ha dispuesto a notificarles .-
        
        La situación de peligro surgiría de las instalaciones descriptas en la denuncia efectuada
        por el EPRE, de la cual se adjunta copia, ordénese a la Distribuidora ${distribuidoras} -. 
        Que se constituya en el lugar señalado dentro del plazo de 24hs. de Notificada la presente, 
        y que en el mismo acto tome al menos 5 (cinco) fotografías que documenten el estado de las 
        instalaciones eléctricas que representan un concreto o inminente riesgo para la seguridad 
        pública. Asimismo se deberán instrumentar en forma inmediata las medidas técnicas idóneas 
        a efectos de normalizar la situación en caso de que se encuentre afectada la seguridad
        pública. En caso de que dichas instalaciones no pertenezcan a la Distribuidora ${distribuidoras} -.
        deberá intimar al responsable de las mismas, en los términos del art. 6º del Régimen de 
        Suministro. La distribuidora deberá acreditar todo lo actuado en el expediente mediante 
        prueba documental idónea, dentro de los plazos establecidos conforme a la Categoría del 
        Riesgo, determinada por la Resolución EPRE 409/22 Sub-ANEXO II, plazo a computarse a 
        partir de notificada la presente. 
        Se adjuntan Acta de Inspección ocular y planilla de Riesgo probable. 
        `;

      page.drawText(saludo, {
        x: 50,
        y: height - 50,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      const lines = textoRestante.split('\n');
      let y = height - 50 - fontSize - 5;
      for (const line of lines) {
        page.drawText(line, {
          x: 50,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= fontSize + 5;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Cedula_Notificacion.pdf';
      link.click();

    } catch (error) {
      console.error('Error al imprimir el PDF:', error);
    }

  }





  /////////////////////////////////////////////////////////////////////////  

  generarExcel(grupoExpediente: any) {

    const datosExportar = grupoExpediente.registros.map((registro: { caso: any; fecha: any; codigo: any; descripcion: any; gravedad: any; localidad: any; distribuidora: any; }) => ({
      'CASO': registro.caso,
      'FECHA': registro.fecha,
      'CODIGO': registro.codigo,
      'DESCRIPCION': registro.descripcion,
      'Gravedad': registro.gravedad,
      'LOCALIDAD': registro.localidad,
      'DISTRIBUIDORA': registro.distribuidora
    }));

    const localidadesUnicas = Array.from(new Set(grupoExpediente.registros.map((registro: { localidad: any; }) => registro.localidad)));
    const localidadesTexto = localidadesUnicas.join(' - ');
    const headerText = [
      [`RESULTADOS DE INSPECCIÓN REALIZADA EN LOCALIDADES: ${localidadesTexto}`, { font: { name: 'Cambria', color: '#f54842', size: '12', bold: true } }],
    ];

    const hojaExcel = XLSX.utils.json_to_sheet(datosExportar, { origin: 2 });

    XLSX.utils.sheet_add_aoa(hojaExcel, headerText, { origin: 0 });

    const primeraCelda = XLSX.utils.encode_cell({ r: 0, c: 0 });
    hojaExcel[primeraCelda].s = { font: { bold: true } };

    if (hojaExcel['!ref']) {
      const tablaRange = XLSX.utils.decode_range(hojaExcel['!ref']);
      const columnas = [
        { wch: 10 },
        { wch: 15 },
        { wch: 10 },
        { wch: 30 },
        { wch: 30 },
        { wch: 10 },
        { wch: 30 },
        { wch: 20 }
      ];

      hojaExcel['!cols'] = columnas;

      const tablaEstilo = {
        border: {
          top: { style: 'large' },
          bottom: { style: 'large' },
          left: { style: 'large' },
          right: { style: 'large' }
        },
        fontFamily: { bold: true }
      };

      for (let row = tablaRange.s.r + 1; row <= tablaRange.e.r; ++row) {
        for (let col = tablaRange.s.c; col <= tablaRange.e.c; ++col) {
          const cellAddress = { r: row, c: col };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          if (!hojaExcel[cellRef]) continue;
          hojaExcel[cellRef].s = tablaEstilo;
        }
      }

      const libroExcel: XLSX.WorkBook = { Sheets: { 'data': hojaExcel }, SheetNames: ['data'] };
      const buffer = XLSX.write(libroExcel, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const nombreArchivo = 'datos_notificaciones.xlsx';
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = nombreArchivo;
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      console.error('La hoja de Excel es indefinida.');
    }
  }










  ////////////////////////////////////////////////       PLANILLA DE RIESGO ////////////////////
  ////////////////////////////////////////////////


  imprimirPlanillaDeRiesgo(grupoExpediente: any) {


    console.log('Datos de grupoExpediente:', grupoExpediente);

    const fechaNotificacion = this.calcularFechaNotificacion(grupoExpediente.registros);

    console.log('Fecha de Notificación Final:', fechaNotificacion);


    const headerText = [
      [`EXPEDIENTE NÚMERO  ${grupoExpediente.nroExpediente}  -  ${grupoExpediente.caratulaSeleccionada}   -   ${grupoExpediente.distribuidora}`, { font: { name: 'Cambria', color: '#f54842', size: '12', bold: true } }],
    ];





    const datosExportar = grupoExpediente.registros.map((registro: any) => {
      const fotos = registro.fotos.join(' / ');

      return {
        'CASO': registro.caso,
        'FECHA': registro.fecha,
        'DENUNCIANTE': registro.denunciante,
        'LOCALIDAD': registro.localidad,
        'DIRECCION': registro.direccion,
        'DESCRIPCION': registro.descripcion,
        'RIESGO': registro.riesgo,
        'FECHA NOTIF.': fechaNotificacion,
        'CODIGO': registro.codigo,
        'GRAVEDAD': registro.gravedad,
        'FOTOS': fotos
      };
    });


    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExportar, { origin: 2 });


    const columnWidths = [
      { wch: 4 },
      { wch: 15 },
      { wch: 12 },
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 5 },
      { wch: 15 },
      { wch: 40 },
    ];


    columnWidths.forEach((width, i) => {
      const colIndex = XLSX.utils.encode_col(i);
      ws['!cols'] = ws['!cols'] || [];
      ws['!cols'].push({ wch: width.wch });
    });

    XLSX.utils.sheet_add_aoa(ws, headerText, { origin: 0 }); // -1 significa que se insertará antes de la primera fila    
    XLSX.utils.book_append_sheet(wb, ws, 'PlanillaDeRiesgo');


    const nombreArchivo = 'PlanillaDeRiesgo.xlsx';
    XLSX.writeFile(wb, nombreArchivo);
  }


  formatFecha(fecha: string): string {
    if (!fecha) return ''; // Si la fecha es null o undefined, devuelve una cadena vacía
    
    // Divide la fecha por las barras y obtén sus partes
    const partes = fecha.split('/');
  
    // Verifica si hay partes suficientes
    if (partes.length === 3) {
      // Formatea la fecha en el formato "DD/MM/YYYY"
      return `${partes[0].padStart(2, '0')}/${partes[1].padStart(2, '0')}/${partes[2]}`;
    } else {
      // Si el formato no es el esperado, devuelve la fecha original
      return fecha;
    }
  }
  
  


  calcularFechaNotificacion(registros: any[]): string {
    if (!registros || registros.length === 0) {
      console.log("No hay registros para calcular la fecha de notificación");
      return "Registros no especificados";
    }
  
    // Obtén la fecha mínima como una fecha grande para asegurarte de que cualquier otra fecha la sobrepase
    let fechaMinima = new Date('9999-12-31');
  
    registros.forEach(registro => {
      const fechaParts = registro.fecha.split('/');
      const dia = parseInt(fechaParts[0]);
      const mes = parseInt(fechaParts[1]);
      const anio = parseInt(fechaParts[2]);
      const fechaRegistro = new Date(anio, mes - 1, dia); // Resta 1 al mes ya que en JavaScript los meses van de 0 a 11
  
      let diasAgregar: number;
  
      switch (registro.gravedad) {
        case 'LEVE':
          diasAgregar = 33;
          break;
        case 'MODERADA':
          diasAgregar = 13;
          break;
        case 'GRAVE':
          diasAgregar = 3;
          break;
        case 'INTOLERABLE':
          diasAgregar = 1;
          break;
        default:
          diasAgregar = 0;
          break;
      }
  
      fechaRegistro.setDate(fechaRegistro.getDate() + diasAgregar);
  
      console.log('Fecha de Notificación del registro', registro.caso, ':', fechaRegistro);
  
      // Actualiza la fecha mínima si la fecha del registro es menor que la fecha mínima actual
      if (fechaRegistro < fechaMinima) {
        fechaMinima = fechaRegistro;
      }
    });
  
    // Formatea la fecha mínima según tu requerimiento DD/MM/YYYY
    const fechaFormateada = `${this.padNumber(fechaMinima.getDate(), 2)}/${this.padNumber(fechaMinima.getMonth() + 1, 2)}/${fechaMinima.getFullYear()}`;
  
    console.log('Fecha de Notificación Final:', fechaFormateada);
    return fechaFormateada;
  }
  
  padNumber(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
  
























  
  







  filtroNroExpediente2: string = '';
  filtroNroExpediente: string = '';

  aplicarFiltro(): void {
    if (this.filtroNroExpediente.trim() !== '') {
      this.notificacionesExpedientePorPagina = this.notificacionesExpedientes.filter(notificacion =>
        notificacion.nroExpediente.toString().includes(this.filtroNroExpediente.trim())
      );
      this.paginator.pageIndex = 0; // Volver a la primera página después de aplicar el filtro
      this.paginator.length = this.notificacionesExpedientePorPagina.length; // Actualizar la longitud del paginador
    } else {
      this.updatePaginator(); // Si el campo de filtro está vacío, muestra todos los datos nuevamente
      this.notificacionesExpedientePorPagina = this.notificacionesExpedientes; // Restablecer los registros
    }
  }

  filtrarAnomalias() {
    if (this.filtroNroExpediente2.trim() !== '') {
      this.anomaliasNotificadas = this.anomaliasNotificadas.filter(anomalia =>
        anomalia.nroExpediente.toString().includes(this.filtroNroExpediente2.toString())
      );
    } else {
      // Si el campo de filtro está vacío, muestra todas las anomalías notificadas nuevamente
      this.anomaliasNotificadas = [...this.notificacionesExpedientes];
    }
  }
  















}