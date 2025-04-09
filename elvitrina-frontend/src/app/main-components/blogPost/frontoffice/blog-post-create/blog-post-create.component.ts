import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { BlogPostService } from 'src/app/core/services/blogPost/blogPostService';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-blog-post-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './blog-post-create.component.html',
  styleUrls: ['./blog-post-create.component.scss']
})
export class BlogPostCreateComponent implements OnInit {
  blogPostForm: FormGroup;
  isSubmitting = false;
  userId: number | null = null;
    imageUrl: string | ArrayBuffer | null = null;


  constructor(
    private fb: FormBuilder,
    private blogPostService: BlogPostService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initForm();
  }

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
      image: [''],  // Image URL will be stored here
      tag: ['']
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        // Ideally, upload the file to the server/cloud and get the URL back
        // This would be the URL you would save in the database
        this.blogPostForm.controls['image'].setValue(this.imageUrl);  // store the image URL
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.blogPostForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.blogPostForm.value;

    this.blogPostService.createBlogPost(formValue).subscribe({
      next: () => {
        this.snackBar.open('Blog post created successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/dashboard/blogPosts']);
      },
      error: (err) => {
        this.snackBar.open('Error creating blog post: ' + (err.error?.message || err.message), 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.blogPostForm.reset();
    this.snackBar.open('Form has been cleared', 'Close', {
      duration: 3000
    });
    this.router.navigate(['/dashboard/blog-posts']);
  }

}