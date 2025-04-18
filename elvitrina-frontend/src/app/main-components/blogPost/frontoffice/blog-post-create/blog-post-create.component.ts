import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

// Services
import { BlogPostService } from 'src/app/core/services/blogPost/blogPostService';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-blog-post-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Angular Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './blog-post-create.component.html',
  styleUrls: ['./blog-post-create.component.scss']
})
export class BlogPostCreateComponent implements OnInit {

  // ==================== Variables ====================
  blogPostForm: FormGroup;
  isSubmitting = false;
  userId: number | null = null;

  selectedImageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  // ==================== Constructeur ====================
  constructor(
    private fb: FormBuilder,
    private blogPostService: BlogPostService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initForm();
  }

  // ==================== Init ====================
  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      this.snackBar.open('Please log in to create a blog post', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/authentication/login']);
    } else {
      const decoded = this.tokenService.getDecodedToken();
      this.userId = decoded?.id ?? null;
    }
  }

  private initForm(): void {
    this.blogPostForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      content: ['', [Validators.required]],
      image: [''],
      tag: ['']
    });
  }

  // ==================== Image Preview ====================
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // ==================== Soumission ====================
  onSubmit(): void {
    if (this.blogPostForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.blogPostForm.get('title')?.value);
    formData.append('content', this.blogPostForm.get('content')?.value);
    formData.append('tag', this.blogPostForm.get('tag')?.value);
    
    if (this.userId !== null) {
      formData.append('userId', this.userId.toString());
    }

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    this.isSubmitting = true;

    this.blogPostService.createBlogPost(formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.resetForm();
        this.snackBar.open('Post created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/blog']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Erreur lors de l’envoi', err);
        this.snackBar.open('Erreur lors de la création du post', 'Fermer', { duration: 3000 });
      }
    });
  }

  // ==================== Reset ====================
  resetForm(): void {
    this.blogPostForm.reset();
    this.selectedImageFile = null;
    this.imagePreview = null;
  }
}
