import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import * as h337 from 'heatmap.js';

@Component({
  selector: 'app-map-heat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  map!: L.Map;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    this.addHeatLayer();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [-25.4284, -49.2733], // Curitiba coords
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private addHeatLayer(): void {
    const heatData = {
      max: 8,
      data: [
        { lat: -25.4284, lng: -49.2733, value: 5 },
        { lat: -25.43,    lng: -49.28,   value: 3 },
        { lat: -25.42,    lng: -49.27,   value: 7 }
        // … seus pontos de lixo/denúncia aqui
      ]
    };

    const cfg = {
      radius: 25,
      maxOpacity: .8,
      scaleRadius: true,
      useLocalExtrema: true,
      latField: 'lat',
      lngField: 'lng',
      valueField: 'value'
    };

    // @ts-ignore
    const heatmapLayer = new h337.leafletHeatmap(cfg).addTo(this.map);
    heatmapLayer.setData(heatData);
  }
}
