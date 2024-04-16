import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

////////MODULOS DE MATERIAL 
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { MatGridTileHarness } from '@angular/material/grid-list/testing';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog'; 


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


// import { NgxMaskModule } from 'ngx-mask';


/// MODULOS PRIME NG 
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { SidebarModule } from 'primeng/sidebar';
import { InputNumberModule } from 'primeng/inputnumber';



import { DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';



import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { PopupService } from '@ng-bootstrap/ng-bootstrap/util/popup';

import {MatCheckboxModule} from '@angular/material/checkbox'; 

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { MessageService } from 'primeng/api';


import { MatNativeDateModule, MatOption } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker'; 


import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BackgroundComponent } from './pages/dashboard/background/background.component';
import { AltaExpedienteComponent } from './components/expedientes/alta-expediente.component';
import { CargarNuevoExpedienteComponent } from './components/expedientes/cargar-nuevo-expediente/cargar-nuevo-expediente.component';

import {MatSelectModule} from '@angular/material/select'; 

import { NuevaCaratulaComponent } from './components/caratulas/nueva-caratula/nueva-caratula.component';
import { AltaCaratulaComponent } from './components/caratulas/alta-caratula.component';
import { ResetPasswordComponent } from './pages/key/reset-password/reset-password.component';
import { EmailComponent } from './pages/key/email/email.component';

import { AltaAnomaliasComponent } from './components/anomalias/alta-anomalias/alta-anomalias.component';
import { NuevaAnomaliasComponent } from './components/anomalias/alta-anomalias/nueva-anomalias/nueva-anomalias.component';
import { FormatoDoubleDirectiveDirective } from './formato-double-directive.directive';
import { CargaImagenesComponent } from './components/anomalia-expediente/carga-automatica/carga-imagenes.component';

import { CargaManualComponent } from './components/anomalia-expediente/carga-manual/carga-manual.component';
import { AnomaliaExpedienteComponent } from './components/anomalia-expediente/anomalia-expediente.component';
import { PhotoDialogComponentComponent } from './components/anomalia-expediente/photo-dialog-component.component';
import {MatTooltipModule} from '@angular/material/tooltip'; 


import { NgxPaginationModule } from 'ngx-pagination';
import { VistaPreviaModalComponent } from './components/anomalia-expediente/carga-automatica/vista-previa-modal/vista-previa-modal.component';
import { EditarRegistroDialogComponent } from './components/anomalia-expediente/editar-registro-dialog/editar-registro-dialog.component';
import { HomeComponent } from './pages/home.component';

import { TabViewModule } from 'primeng/tabview';
import { NotificacionComponent } from './components/anomalias/notificacion/notificacion.component';
import { EditarGravedadComponent } from './components/anomalia-expediente/editar-gravedad/editar-gravedad.component';
import { LoggingInterceptorService } from './services/logging-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    CargarNuevoExpedienteComponent,
  
   

    DashboardComponent,
    LoginComponent,
    BackgroundComponent,
    AltaExpedienteComponent,
    NuevaCaratulaComponent,
    AltaCaratulaComponent,
    ResetPasswordComponent,
    EmailComponent,
    AltaAnomaliasComponent,
    NuevaAnomaliasComponent,
    FormatoDoubleDirectiveDirective,
    CargaImagenesComponent,
    
    CargaManualComponent,
    AnomaliaExpedienteComponent,
    PhotoDialogComponentComponent,
    VistaPreviaModalComponent,
    EditarRegistroDialogComponent,

    HomeComponent,
      NotificacionComponent,
      EditarGravedadComponent
    // NgxMaskModule
    
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatButtonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatGridListModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    SpeedDialModule,
    ToastModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    CardModule,
    SidebarModule,
    MatIconModule,
    BsDatepickerModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    NgbModalModule,
    MatDialogModule,
    InputNumberModule,
    NgxPaginationModule
    ,MatTooltipModule,
    TabViewModule


  ],
  exports:[],
  providers: [  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoggingInterceptorService,
    multi: true
  },MatOption,MatPaginator, MatGridTile, MatGridTileHarness, MessageService, PageEvent, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
