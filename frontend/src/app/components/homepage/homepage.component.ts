import {Component, OnInit} from '@angular/core';
import {Dock} from 'primeng/dock';
import {Tooltip} from 'primeng/tooltip';
import {MenuItem} from 'primeng/api';
import {Button} from 'primeng/button';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-homepage',
  imports: [
    Dock,
    Tooltip,
    Button,
    NgForOf
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  dockItems: MenuItem[] = [];

  buttons = [
    { label: 'Home', icon: 'pi pi-home', action: () => console.log('Home') },
    { label: 'Camera', icon: 'pi pi-camera', action: () => console.log('Camera') },
    { label: 'Map', icon: 'pi pi-map', action: () => console.log('Map') },
    { label: 'Profile', icon: 'pi pi-user', action: () => console.log('Profile') }
  ];

  constructor() {
  }

  ngOnInit() {

    this.dockItems = [
      { label: 'Home', icon: 'https://primefaces.org/cdn/primeng/images/dock/finder.svg' },
      { label: 'Camera', icon: 'https://primefaces.org/cdn/primeng/images/dock/appstore.svg' },
      { label: 'Targets', icon: 'https://primefaces.org/cdn/primeng/images/dock/photos.svg' },
      { label: 'Profile', icon: 'https://primefaces.org/cdn/primeng/images/dock/trash.png' }
    ];
  }
}
