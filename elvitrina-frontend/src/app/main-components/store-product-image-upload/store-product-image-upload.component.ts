import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StoreService } from 'src/app/core/services/store/store.service';
import { ProductService } from 'src/app/core/services/product/product.service';

@Component({
  selector: 'app-store-product-image-upload',
  templateUrl: './store-product-image-upload.component.html',
  styleUrls: ['./store-product-image-upload.component.scss']
})
export class StoreProductImageUploadComponent {
  @Input() entityId!: number;
  @Input() entityType!: 'store' | 'product';
  @Output() imageUpdated = new EventEmitter<string>();

  selectedFile?: File;
  imagePreview?: string;
  uploadedImageUrl?: string;

  constructor(
    private storeService: StoreService,
    private productService: ProductService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  upload(): void {
    if (this.selectedFile && this.entityId) {
      const uploadService = this.entityType === 'store' ? this.storeService : this.productService;
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      // uploadService.uploadImage(this.entityId, formData).subscribe({
/*************  ✨ Windsurf Command 🌟  *************/
      //   next: (uploadedImageUrl: string) => {
      //     alert('Image uploaded successfully!');
      //     this.uploadedImageUrl = uploadedImageUrl;
      //     this.imageUpdated.emit(uploadedImageUrl);
      //   },
/*******  56697e62-6705-4d62-a764-77639c685056  *******/
      //   error: () => alert('Upload failed!')
      // });
    } else {
      alert('Please select a file before uploading.');
    }
  }
}
