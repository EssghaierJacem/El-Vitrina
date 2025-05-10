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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import { StoreService } from 'src/app/core/services/store/store.service';
import { StoreCategoryType } from 'src/app/core/models/store/store-category-type.enum';
import { AuthService } from 'src/app/core/services/user/AuthService';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { Store, StoreReqDto } from 'src/app/core/models/store/store.model';
import * as L from 'leaflet';

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
  templateUrl: './store-create.component.html',
  styleUrls: ['./store-create.component.scss']
})
export class StoreCreateComponent implements OnInit, AfterViewInit {

  IMAGE_BASE_URL = '/api/uploads/store-images/';

  storeForm: FormGroup;
  isSubmitting = false;
  isLoading = false;
  currentUser: any;
  userId: number | null = null;
  firstName = '';
  email = '';
  imagePreview: string | undefined;
  coverImagePreview: string | undefined;
  
  categories = Object.values(StoreCategoryType);
  categoryOptions: CategoryOption[] = [];

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
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initCategoryOptions();
    this.initForm();
  }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (!token) {
        this.snackBar.open('Please log in to create a store', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
        });
        this.router.navigate(['/authentication/login']);
    } else {
        this.loadCurrentUser();
    }
  }

  private loadCurrentUser(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.userId = decodedToken.id ?? null;
      this.firstName = decodedToken.firstname || '';
      this.email = decodedToken.email || '';
      
      // For backward compatibility
      this.currentUser = {
        id: this.userId,
        name: this.firstName,
        email: this.email
      };
    }
  }

  private initForm(): void {
    this.storeForm = this.fb.group({
      storeName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      category: ['', Validators.required],
      address: [this.formatCoordinatesAsAddress(this.selectedLocation.lat, this.selectedLocation.lng), Validators.required],
      latitude: [this.selectedLocation.lat, Validators.required],
      longitude: [this.selectedLocation.lng, Validators.required],
      image: [null],
      coverImage: [null],
      status: [true],
      featured: [false]
    });
  }

  private formatCoordinatesAsAddress(lat: number, lng: number): string {
    return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
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

  //onImageSelected(event: Event, field: string): void {
   // const input = event.target as HTMLInputElement;
   // if (input.files && input.files.length > 0) {
   //   const file = input.files[0];
   //   this.storeForm.patchValue({ [field]: file });
   // }
  //}

  onFileSelected(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.storeForm.patchValue({ [field]: file });
      this.storeForm.get(field)?.updateValueAndValidity();

      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        if (field === 'image') {
          this.imagePreview = reader.result as string;
        } else if (field === 'coverImage') {
          this.coverImagePreview = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  private initializeMap() {
    // Initialize the map
    this.map = L.map('map').setView([this.selectedLocation.lat, this.selectedLocation.lng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add initial marker
    this.marker = L.marker([this.selectedLocation.lat, this.selectedLocation.lng], {
      draggable: true
    }).addTo(this.map);

    // Handle marker drag events
    this.marker.on('dragend', (event) => {
      const marker = event.target;
      const position = marker.getLatLng();
      this.updateFormLocation(position.lat, position.lng);
    });

    // Handle map click events
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

  onSubmit(): void {
    if (this.storeForm.invalid) {
      this.snackBar.open('Please fill in all required fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
  
    if (!this.userId) {
      this.snackBar.open('User ID is required', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
  
    this.isLoading = true;
    const formValue = this.storeForm.value;
  
    const storeData: StoreReqDto = {
      userId: this.userId,
      storeName: formValue.storeName.trim(),
      description: formValue.description?.trim() || '',
      category: formValue.category,
      address: formValue.address.trim(),
      latitude: formValue.latitude,
      longitude: formValue.longitude,
      status: formValue.status,
      featured: formValue.featured
    };
  
    console.log('Store data to be sent:', storeData);
  
    const formData = new FormData();
    formData.append('store', new Blob([JSON.stringify(storeData)], { type: 'application/json' }));
  
    if (formValue.image instanceof File) {
      formData.append('image', formValue.image);
    }
    if (formValue.coverImage instanceof File) {
      formData.append('coverImage', formValue.coverImage);
    }
  
    this.storeService.create(formData).subscribe({
      next: (response) => {
        this.snackBar.open('Store created successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/dashboard/stores']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating store:', error);
        this.snackBar.open(error.message || 'Error creating store', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }
  

  resetForm(): void {
    this.storeForm.reset({
      status: true,
      featured: false
    });
    this.imagePreview = undefined;
    this.coverImagePreview = undefined;
    
    this.snackBar.open('Form has been cleared', 'Close', {
      duration: 3000
    });
    
    // Navigate back to the list
    this.router.navigate(['/dashboard/stores']);
  }

}
