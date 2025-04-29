import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StoreService } from 'src/app/core/services/store/store.service';
import { StoreCategoryType } from 'src/app/core/models/store/store-category-type.enum';
import * as L from 'leaflet';

// Interface for category display
interface CategoryOption {
  value: StoreCategoryType;
  displayName: string;
}

@Component({
  selector: 'app-store-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCheckboxModule,
    RouterModule
  ],
  templateUrl: './store-edit.component.html',
  styleUrls: ['./store-edit.component.scss']
})
export class StoreEditComponent implements OnInit, AfterViewInit {

  IMAGE_BASE_URL = 'http://localhost:8080/api/stores/store/images/';

  storeForm: FormGroup;
  isSubmitting = false;
  existingImageUrl: string | null = null;
  existingCoverImageUrl: string | null = null;
  storeId: number | null = null;

  imagePreview: string | null = null;
  coverImagePreview: string | null = null;
  
  categories = Object.values(StoreCategoryType);
  categoryOptions: CategoryOption[] = [];

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  selectedLocation = {
    lat: 36.8065,
    lng: 10.1815
  };

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initCategoryOptions();
    this.initForm();
  }

  private initCategoryOptions(): void {
    this.categoryOptions = this.categories.map(category => ({
      value: category,
      displayName: this.getStoreCategoryDisplayName(category)
    })).sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  getStoreCategoryDisplayName(category: StoreCategoryType | string): string {
    switch (category) {
      case StoreCategoryType.HANDMADE_JEWELRY: return 'Handmade Jewelry';
      case StoreCategoryType.POTTERY_CERAMICS: return 'Pottery & Ceramics';
      case StoreCategoryType.TEXTILES_FABRICS: return 'Textiles & Fabrics';
      case StoreCategoryType.ART_PAINTINGS: return 'Art & Paintings';
      case StoreCategoryType.HOME_DECOR: return 'Home Decor';
      case StoreCategoryType.CLOTHING_ACCESSORIES: return 'Clothing & Accessories';
      case StoreCategoryType.ECO_FRIENDLY: return 'Eco-Friendly Products';
      case StoreCategoryType.LOCAL_FOODS: return 'Local Foods & Beverages';
      case StoreCategoryType.HEALTH_WELLNESS: return 'Health & Wellness';
      case StoreCategoryType.BOOKS_STATIONERY: return 'Books & Stationery';
      case StoreCategoryType.TOYS_GAMES: return 'Toys & Games';
      case StoreCategoryType.VINTAGE_ANTIQUES: return 'Vintage & Antiques';
      case StoreCategoryType.DIGITAL_PRODUCTS: return 'Digital Products';
      case StoreCategoryType.CRAFTS_DIY: return 'Crafts & DIY Kits';
      case StoreCategoryType.PET_SUPPLIES: return 'Pet Supplies';
      default: 
        // Format unrecognized enum values
        if (typeof category === 'string') {
          return category
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ');
        }
        return String(category);
    }
  }

  ngOnInit(): void {
    this.storeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.storeId) {
      this.loadStore(this.storeId);
    }
  }

  ngAfterViewInit() {
    // We'll initialize the map after we load the store data
  }

  private initForm(): void {
    this.storeForm = this.fb.group({
      storeName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      category: ['', Validators.required],
      address: ['', Validators.required],
      latitude: [this.selectedLocation.lat, Validators.required],
      longitude: [this.selectedLocation.lng, Validators.required],
      image: [null],
      coverImage: [null],
      status: [true],
      featured: [false]
    });
  }

  private extractCoordinates(address: string): { lat: number; lng: number } {
    try {
      const matches = address.match(/Lat: ([-\d.]+), Lng: ([-\d.]+)/);
      if (matches && matches.length === 3) {
        return {
          lat: parseFloat(matches[1]),
          lng: parseFloat(matches[2])
        };
      }
    } catch (error) {
      console.error('Error parsing coordinates:', error);
    }
    return this.selectedLocation; // Return default location if parsing fails
  }

  private formatCoordinatesAsAddress(lat: number, lng: number): string {
    return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
  }

  private initializeMap() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([this.selectedLocation.lat, this.selectedLocation.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([this.selectedLocation.lat, this.selectedLocation.lng], {
      draggable: true
    }).addTo(this.map);

    this.marker.on('dragend', (event) => {
      const marker = event.target;
      const position = marker.getLatLng();
      this.updateFormLocation(position.lat, position.lng);
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.updateMarkerPosition(lat, lng);
      this.updateFormLocation(lat, lng);
    });
  }

  private updateMarkerPosition(lat: number, lng: number) {
    if (this.marker && this.map) {
      this.marker.setLatLng([lat, lng]);
      this.map.panTo([lat, lng]);
    }
  }

  private updateFormLocation(lat: number, lng: number) {
    this.selectedLocation = { lat, lng };
    this.storeForm.patchValue({
      latitude: lat,
      longitude: lng,
      address: this.formatCoordinatesAsAddress(lat, lng)
    });
  }

  loadStore(id: number): void {
    this.storeService.getById(id).subscribe({
      next: (store) => {
        // Extract coordinates from address
        const coordinates = this.extractCoordinates(store.address);
        this.selectedLocation = coordinates;

        this.storeForm.patchValue({
          storeName: store.storeName,
          description: store.description,
          category: store.category,
          address: store.address,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          status: store.status,
          featured: store.featured,
          image: null,
          coverImage: null
        });

        const baseUrl = 'http://localhost:8080/api/stores/store/images/';
        this.existingImageUrl = store.image ? baseUrl + store.image : null;
        this.existingCoverImageUrl = store.coverImage ? baseUrl + store.coverImage : null;

        // Initialize map after loading store data
        setTimeout(() => this.initializeMap(), 100);
      },
      error: (error) => {
        console.error('Error loading store:', error);
        this.snackBar.open('Error loading store', 'Close', {
          duration: 5000
        });
        this.router.navigate(['../']);
      }
    });
  }

  onImageSelected(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.storeForm.get(field)?.setValue(file);
    }
  }

  onFileSelected(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.storeForm.patchValue({ [fieldName]: file });
      this.storeForm.get(fieldName)?.updateValueAndValidity();
  
      const reader = new FileReader();
      reader.onload = () => {
        if (fieldName === 'image') {
          this.imagePreview = reader.result as string;
        } else if (fieldName === 'coverImage') {
          this.coverImagePreview = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  

  isFileSelected(fieldName: string): boolean {
    const value = this.storeForm.get(fieldName)?.value;
    return value instanceof File;
  }
  

  onSubmit(): void {
    if (this.storeForm.valid && !this.isSubmitting && this.storeId) {
      this.isSubmitting = true;
      
      const formData = new FormData();
      const formValue = this.storeForm.value;
  
      formData.append('storeName', formValue.storeName?.trim());
      formData.append('description', formValue.description?.trim());
      formData.append('category', formValue.category);
      formData.append('address', formValue.address?.trim());
      formData.append('status', String(formValue.status));
      formData.append('featured', String(formValue.featured));
  
      if (formValue.image instanceof File) {
        formData.append('image', formValue.image);
      }
      if (formValue.coverImage instanceof File) {
        formData.append('coverImage', formValue.coverImage);
      }
  
      this.storeService.update(this.storeId, formData).subscribe({
        next: (response) => {
          this.snackBar.open('Store updated successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/dashboard/stores']);
        },
        error: (error) => {
          console.error('Error updating store:', error);
          this.snackBar.open(error.message || 'Error updating store', 'Close', {
            duration: 5000
          });
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.storeForm.controls).forEach(key => {
        const control = this.storeForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    if (this.storeId) {
      this.loadStore(this.storeId);
    }
    
    this.snackBar.open('Form has been reset', 'Close', {
      duration: 3000
    });
    
    // Navigate back to the list
    this.router.navigate(['/dashboard/stores/details', this.storeId]);
  }

  getFullImageUrl(fileName: string): string {
    return this.IMAGE_BASE_URL + fileName;
  }
}
