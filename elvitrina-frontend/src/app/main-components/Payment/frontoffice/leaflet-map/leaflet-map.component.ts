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
    // Initialiser la carte
    this.map = L.map('map', {
      center: [36.8065, 10.1815],  // Coordonnées de Tunis
      zoom: 13,  // Niveau de zoom par défaut
      dragging: true,  // Permet de déplacer la carte
      zoomControl: true,  // Contrôle de zoom visible
      scrollWheelZoom: true,  // Permet le zoom avec la molette de la souris
      doubleClickZoom: true,  // Permet de zoomer avec un double clic
  });
    // Ajouter la couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Ajouter un marqueur draggable par défaut
    this.marker = L.marker([36.8065, 10.1815], { draggable: true }).addTo(this.map);

    // Quand on clique sur la carte
    this.map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Déplacer le marqueur existant
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      }

      // Récupérer l'adresse et l’émettre
      const address = await this.reverseGeocode(lat, lng);
      this.addressSelected.emit(address);
    });
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
