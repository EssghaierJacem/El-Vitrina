import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/core/services/store/store.service';
import { Store } from 'src/app/core/models/store/store.model';
import { StoreCategoryType } from 'src/app/core/models/store/store-category-type.enum';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TokenService } from 'src/app/core/services/user/TokenService';
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
    RouterModule,
    MatCheckboxModule
  ],
  templateUrl: './store-edit.component.html',
  styleUrls: ['./store-edit.component.scss']
})
export class StoreEditComponent implements OnInit, AfterViewInit {
  storeForm: FormGroup;
  isLoading = false;
  storeId: number;
  store: Store | null = null;
  imagePreviewUrl: string | null = null;
  coverImagePreviewUrl: string | null = null;

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  selectedLocation = {
    lat: 36.8065,
    lng: 10.1815
  };

  categories = Object.values(StoreCategoryType);
  categoryOptions: CategoryOption[] = [];

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService
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

  private initForm(): void {
    this.storeForm = this.fb.group({
      storeName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1500)]],
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

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = +params['id'];
      if (this.storeId) {
        this.loadStore();
      } else {
        this.snackBar.open('Store ID is missing', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/dashboard/stores']);
      }
    });
  }

  ngAfterViewInit() {
    // Map will be initialized after store data is loaded
  }

  private extractCoordinates(address: string): { lat: number; lng: number } | null {
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
    return null;
  }

  private formatCoordinatesAsAddress(lat: number, lng: number): string {
    return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
  }

  private initializeMap(coordinates: { lat: number; lng: number }) {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([coordinates.lat, coordinates.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([coordinates.lat, coordinates.lng], {
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

  private loadStore(): void {
    this.isLoading = true;
    this.storeService.getById(this.storeId).subscribe({
      next: (store) => {
        this.store = store;
        
        // Extract coordinates from address
        const coordinates = this.extractCoordinates(store.address) || this.selectedLocation;
        this.selectedLocation = coordinates;

        this.storeForm.patchValue({
          storeName: store.storeName,
          description: store.description,
          category: store.category,
          address: store.address,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          status: store.status,
          featured: store.featured
        });

        // Set image previews if they exist
        if (store.image) {
          this.imagePreviewUrl = `/api/stores/store/images/${store.image}`;
        }
        if (store.coverImage) {
          this.coverImagePreviewUrl = `/api/stores/store/images/${store.coverImage}`;
        }

        this.isLoading = false;

        // Initialize map after store data is loaded
        setTimeout(() => this.initializeMap(coordinates), 100);
      },
      error: (error) => {
        console.error('Error loading store:', error);
        this.snackBar.open('Error loading store. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event, field: 'image' | 'coverImage'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.storeForm.patchValue({ [field]: file });
      this.storeForm.get(field)?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (field === 'image') {
          this.imagePreviewUrl = e.target.result;
        } else if (field === 'coverImage') {
          this.coverImagePreviewUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.storeForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const formData = new FormData();
      const formValue = this.storeForm.value;
  
      // Append individual fields directly to FormData
      formData.append('storeName', formValue.storeName?.trim());
      formData.append('description', formValue.description?.trim() || '');
      formData.append('category', formValue.category);
      formData.append('address', formValue.address?.trim());
      formData.append('latitude', String(formValue.latitude));
      formData.append('longitude', String(formValue.longitude));
      formData.append('status', String(formValue.status));
      formData.append('featured', String(formValue.featured));
      formData.append('userId', String(this.tokenService.getDecodedToken()?.id));
  
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
          this.snackBar.open(error.error?.message || 'Error updating store. Please try again.', 'Close', {
            duration: 5000
          });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.storeForm.controls).forEach(key => {
        const control = this.storeForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = '/assets/images/stores/no-image.jpg';
    }
  }

  resetForm(): void {
    if (this.store) {
      this.loadStore();
    }
    this.snackBar.open('Form has been reset', 'Close', {
      duration: 3000
    });
  }
}
