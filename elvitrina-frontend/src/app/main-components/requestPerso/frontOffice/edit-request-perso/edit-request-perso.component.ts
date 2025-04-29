import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequestPersoService } from 'src/app/core/services/requestPerso/request-perso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-request-perso',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatChipsModule,
    CommonModule,
    MatGridListModule
  ],
  templateUrl: './edit-request-perso.component.html',
  styleUrls: ['./edit-request-perso.component.scss']
})
export class EditRequestPersoComponent implements OnInit {
  editForm!: FormGroup;
  requestId!: number;
  selectedRequest: any;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestPersoService: RequestPersoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.requestId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadRequest();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      minPrice: [0, [Validators.required, Validators.min(0)]],
      maxPrice: [0, [Validators.required, Validators.min(0)]],
      deliveryTime: ['', Validators.required],
      tags: [[], Validators.required]
    });
  }

  loadRequest(): void {
    this.requestPersoService.getRequestPersoById(this.requestId).subscribe({
      next: (request) => {
        this.selectedRequest = request;
        const formattedDate = request.deliveryTime 
          ? new Date(request.deliveryTime).toISOString().substring(0, 10)
          : '';

        this.editForm.patchValue({
          title: request.title,
          description: request.description,
          minPrice: request.minPrice,
          maxPrice: request.maxPrice,
          deliveryTime: formattedDate,
          tags: request.tags || []
        });
      },
      error: (err) => {
        console.error('Error loading request:', err);
        this.snackBar.open('Failed to load request', 'Close', { duration: 3000 });
        this.router.navigate(['/requestperso/getAllRequestPerso']);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        this.snackBar.open('Only image files are allowed', 'Close', { duration: 3000 });
        return;
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Image must be less than 5MB', 'Close', { duration: 3000 });
        return;
      }

      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  getImageUrl(filename: string): string {
    return filename ? `${environment.apiUrl}/images/${filename}` : '';
  }

  onSubmitUpdateForm(event: Event): void {
    event.preventDefault();

    if (this.editForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    
    // Convert form values to JSON
    const requestData = {
      title: this.editForm.value.title,
      description: this.editForm.value.description,
      minPrice: this.editForm.value.minPrice,
      maxPrice: this.editForm.value.maxPrice,
      deliveryTime: this.editForm.value.deliveryTime,
      tags: this.editForm.value.tags,
      // Preserve existing values
      viewCount: this.selectedRequest.viewCount,
      userId: this.selectedRequest.user.id,
      status: this.selectedRequest.status
    };

    // Append JSON data
    formData.append('request', new Blob([JSON.stringify(requestData)], {
      type: 'application/json'
    }));

    // Append image file if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.requestPersoService.updateRequestPerso(this.requestId, formData).subscribe({
      next: (updated) => {
        this.snackBar.open('Request updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/requestperso/getAllRequestPerso']);
      },
      error: (err) => {
        console.error('Error updating request:', err);
        this.snackBar.open('Failed to update request', 'Close', { duration: 3000 });
      }
    });
  }
}