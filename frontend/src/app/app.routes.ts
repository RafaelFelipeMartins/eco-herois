import { Routes } from '@angular/router';
import {LoginComponent} from './auth/login.component/login.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {CameraComponent} from './components/camera/camera.component';
import {MapComponent} from './components/map/map.component';
import {ProfileComponent} from './components/profile/profile.component';

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
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  }
];
