import { Routes } from '@angular/router';
import {LoginComponent} from './auth/login.component/login.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {CameraComponent} from './components/camera/camera.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'homepage',
    component: HomepageComponent
  },
  {
    path: 'camera',
    component: CameraComponent,
  }
];
