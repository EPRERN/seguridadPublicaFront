import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';



import { AltaExpedienteComponent } from './components/expedientes/alta-expediente.component';
import { CargarNuevoExpedienteComponent } from './components/expedientes/cargar-nuevo-expediente/cargar-nuevo-expediente.component';
import { AltaCaratulaComponent } from './components/caratulas/alta-caratula.component';
import { NuevaCaratulaComponent } from './components/caratulas/nueva-caratula/nueva-caratula.component';
import { EmailComponent } from './pages/key/email/email.component';
import { AltaAnomaliasComponent } from './components/anomalias/alta-anomalias/alta-anomalias.component';
import { NuevaAnomaliasComponent } from './components/anomalias/alta-anomalias/nueva-anomalias/nueva-anomalias.component';
import { CargaImagenesComponent } from './components/anomalia-expediente/carga-automatica/carga-imagenes.component';

import { CargaManualComponent } from './components/anomalia-expediente/carga-manual/carga-manual.component';
import { AnomaliaExpedienteComponent } from './components/anomalia-expediente/anomalia-expediente.component';
import { NotificacionComponent } from './components/anomalias/notificacion/notificacion.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'altaExpte',
    component: AltaExpedienteComponent
  },
  {
    path:'notificacion',
    component:NotificacionComponent
  },
  {
    path: 'CargarNuevoExpediente',
    component: CargarNuevoExpedienteComponent
  },
  {
    path: 'altaCaratula',
    component: AltaCaratulaComponent
  },
  {
    path: 'nuevaCaratula',
    component: NuevaCaratulaComponent
  },
  {
    path: 'altaAnomalias',
    component: AltaAnomaliasComponent
  },
  {
    path: 'nuevaAnomalia',
    component: NuevaAnomaliasComponent
  },
  {
    path: 'anomalia-expediente',
    component: AnomaliaExpedienteComponent
  },
  {
    path:'carga-manual',
    component:CargaManualComponent
  }, 
  {
    path: 'carga-imagenes',
    component: CargaImagenesComponent
  },
  {
    path: 'email',
    component: EmailComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
