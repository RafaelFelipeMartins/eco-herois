import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {Avatar} from 'primeng/avatar';

@Component({
  selector: 'profile-component',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule, Avatar]
})
export class ProfileComponent {
  value = [
    { label: 'Apps', color1: '#34d399', color2: '#fbbf24', value: 25, icon: 'pi pi-table' },
    { label: 'Messages', color1: '#fbbf24', color2: '#60a5fa', value: 15, icon: 'pi pi-inbox' },
    { label: 'Media', color1: '#60a5fa', color2: '#c084fc', value: 20, icon: 'pi pi-image' },
    { label: 'System', color1: '#c084fc', color2: '#c084fc', value: 10, icon: 'pi pi-cog' }
  ];

  achievements = [
    { label: '1º envio',     icon: 'pi pi-star',     count: 1 },
    { label: '5 envios',     icon: 'pi pi-bolt',     count: 5 },
    { label: '10 envios',    icon: 'pi pi-trophy',   count: 10 },
    { label: '20 envios',    icon: 'pi pi-crown',    count: 20 },
    { label: 'Eco Herói',    icon: 'pi pi-shield',   count: 1 },
    { label: 'Top Escola',   icon: 'pi pi-users',    count: 12 },
    { label: 'Semanal',      icon: 'pi pi-calendar', count: 7 },
  ];

  getGradient(c1: string, c2: string) {
    return `linear-gradient(to right, ${c1}, ${c2})`;
  }
}
