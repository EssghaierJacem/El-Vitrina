import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  template: `<div id="map" style="height: 300px;"></div>`,
  standalone: true,
})
export class LeafletMapComponent implements AfterViewInit {
  @Output() addressSelected = new EventEmitter<string>();

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  ngAfterViewInit(): void {
    // Laisse Angular rendre le DOM avant d'initialiser Leaflet
    setTimeout(() => {
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Map container not found.');
        return;
      }

      this.map = L.map(mapElement, {
        center: [36.8065, 10.1815],
        zoom: 13,
        dragging: true,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      this.marker = L.marker([36.8065, 10.1815], { draggable: true }).addTo(this.map);

      this.map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (this.marker) {
          this.marker.setLatLng([lat, lng]);
        }

        const address = await this.reverseGeocode(lat, lng);
        this.addressSelected.emit(address);
      });
    }, 0);
  }

  private async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.display_name || 'Adresse introuvable';
    } catch (error) {
      console.error('Erreur de géocodage inversé :', error);
      return 'Erreur lors de la récupération de l\'adresse';
    }
  }
}
