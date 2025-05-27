import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { SensorDataComponent } from './sensor-data/sensor-data.component';
import { RealTimeDashboardComponent } from './real-time-dashboard/real-time-dashboard.component';
import { DeviceComponent } from './device/device.component';
import { AuthGuard } from './auth.guard';


export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/real-time-dashboard',
        pathMatch: 'full',
      },
      {
        path: 'sensor-data',
        component: SensorDataComponent,
      },
       {
        path: 'real-time-dashboard',
        component: RealTimeDashboardComponent,
      },
       {
        path: 'devices',
        component: DeviceComponent,
      }
    ],
  },

        {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then((m) => m.AuthenticationRoutes),
      },


  {
    path: '**',
    redirectTo: 'authentication/login',
  },
];