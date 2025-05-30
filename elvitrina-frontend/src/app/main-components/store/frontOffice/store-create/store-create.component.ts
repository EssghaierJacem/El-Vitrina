import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { StoreService } from '../../../../core/services/store/store.service';
import { StoreCategoryType } from '../../../../core/models/store/store-category-type.enum';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { TokenService } from 'src/app/core/services/user/TokenService';
import * as L from 'leaflet';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// Interface for category display
interface CategoryOption {
  value: StoreCategoryType;
  displayName: string;
}

@Component({
  selector: 'app-store-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './store-create.component.html',
  styleUrls: ['./store-create.component.scss']
})
export class StoreCreateComponent implements OnInit, AfterViewInit {
  role: string = '';  
  storeForm: FormGroup;
  loading = false;
  categories = Object.values(StoreCategoryType);
  categoryOptions: CategoryOption[] = [];
  canCreateStore: boolean = false;

  imagePreviewUrl: string | null = null;
  coverImagePreviewUrl: string | null = null;
  uploadedFile: File | null = null;
  uploadedCoverFile: File | null = null;

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  selectedLocation = {
    lat: 36.8065,  // Default to Tunisia center
    lng: 10.1815
  };

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private authService: AuthService,
    private tokenService: TokenService,
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

  private initForm(): void {
    this.storeForm = this.fb.group({
      storeName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1500)]],
      category: ['', Validators.required],
      address: [this.formatCoordinatesAsAddress(this.selectedLocation.lat, this.selectedLocation.lng), Validators.required],
      latitude: [this.selectedLocation.lat, Validators.required],
      longitude: [this.selectedLocation.lng, Validators.required],
      image: [null],
      coverImage: [null]
    });
  }

  private formatCoordinatesAsAddress(lat: number, lng: number): string {
    return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      const decodedToken = this.tokenService.getDecodedToken();
      if (decodedToken) {
        this.role = decodedToken?.role ?? 'USER';  
        if (this.role === 'SELLER') {
          this.canCreateStore = true;
        } else {
          this.snackBar.open('You must be a seller to create a store', 'Close', { duration: 3000 });
          this.router.navigate(['/']);
        }
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.initializeMap(), 100);
  }

  private initializeMap() {
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
          this.uploadedFile = file;
        } else if (field === 'coverImage') {
          this.coverImagePreviewUrl = e.target.result;
          this.uploadedCoverFile = file;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage(field: 'image' | 'coverImage'): void {
    if (field === 'image') {
      this.imagePreviewUrl = null;
      this.uploadedFile = null;
    } else if (field === 'coverImage') {
      this.coverImagePreviewUrl = null;
      this.uploadedCoverFile = null;
    }
    this.storeForm.patchValue({ [field]: null });
    this.storeForm.get(field)?.updateValueAndValidity();
  }

  resetForm(): void {
    this.storeForm.reset({
      latitude: this.selectedLocation.lat,
      longitude: this.selectedLocation.lng,
      address: this.formatCoordinatesAsAddress(this.selectedLocation.lat, this.selectedLocation.lng),
    });
    this.imagePreviewUrl = null;
    this.coverImagePreviewUrl = null;
    this.uploadedFile = null;
    this.uploadedCoverFile = null;
    
    if (this.map && this.marker) {
      this.updateMarkerPosition(this.selectedLocation.lat, this.selectedLocation.lng);
    }

    this.snackBar.open('Form has been cleared', 'Close', { duration: 3000 });
  }

  onSubmit(): void {
    if (this.storeForm.valid && !this.loading && this.canCreateStore) {
      this.loading = true;
  
      const formValue = this.storeForm.value;
      
      const storeDto = {
        storeName: formValue.storeName?.trim(),
        description: formValue.description?.trim() || '',
        category: formValue.category,
        address: formValue.address?.trim(),
        latitude: formValue.latitude,
        longitude: formValue.longitude,
        status: true,
        featured: false,
        userId: this.tokenService.getDecodedToken()?.id 
      };
  
      const formData = new FormData();
      formData.append('store', new Blob([JSON.stringify(storeDto)], { type: 'application/json' }));
  
      if (formValue.image) {
        formData.append('image', formValue.image);
      }
      if (formValue.coverImage) {
        formData.append('coverImage', formValue.coverImage);
      }
  
      this.storeService.create(formData).subscribe({
        next: (response) => {
          this.snackBar.open('Store created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/stores']);
        },
        error: (error) => {
          console.error('Error creating store:', error);
          this.snackBar.open(error.error?.message || 'Error creating store. Please try again.', 'Close', { duration: 3000 });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
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

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }
}
