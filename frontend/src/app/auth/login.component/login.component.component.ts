import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-login.component',
  imports: [
    Button
  ],
  templateUrl: './login.component.component.html',
  styleUrl: './login.component.component.scss'
})


export class LoginComponent implements OnInit {
  items: MenuItem[] | undefined;
  position: 'left' | 'right' | 'top' | 'bottom' = 'bottom';

  constructor() {
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Finder',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/finder.svg'
      },
      {
        label: 'App Store',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/appstore.svg'
      },
      {
        label: 'Photos',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/photos.svg'
      },
      {
        label: 'Trash',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/trash.png'
      }
    ];
  }

}



