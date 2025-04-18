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
import { BlogPost } from 'src/app/core/models/blogPost/blogPost.model';

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
  imagePreview: string | null = null;
  formData: FormData = new FormData();
  userId: number | null = null; // Stocker l'ID de l'utilisateur

  constructor(
    private fb: FormBuilder,
    private blogPostService: BlogPostService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Initialisation du formulaire réactif
    this.blogPostForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tag: ['']
    });
  }

  ngOnInit(): void {
    // Récupérer le token et en extraire l'ID de l'utilisateur
    const token = this.tokenService.getToken();
    if (token) {
      const decoded = this.tokenService.getDecodedToken();
      this.userId = decoded?.id ?? null;
    } else {
      this.snackBar.open('You must be logged in to create a blog post.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/login']); // Rediriger vers la page de login si l'utilisateur n'est pas authentifié
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagePreview = URL.createObjectURL(file); // Prévisualisation de l'image
      this.formData.append('image', file, file.name); // Ajouter l'image au FormData
    }
  }

  onSubmit() {
    if (this.blogPostForm.valid && this.userId) {
      this.isSubmitting = true;
      const formValue = this.blogPostForm.value;
      
      // Ajouter les autres champs au FormData
      this.formData.append('title', formValue.title);
      this.formData.append('content', formValue.content);
      this.formData.append('tag', formValue.tag);
      this.formData.append('userId', this.userId.toString()); 


      // Ajouter l'ID de l'utilisateur au FormData
      this.formData.append('userId', this.userId.toString());

      // Appel au service pour créer le blog post
      this.blogPostService.createBlogPost(this.formData).subscribe(
        (response) => {
          // Réponse du serveur après succès
          this.isSubmitting = false;
          this.snackBar.open('Blog post created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard/blogPosts']);
        },
        (error) => {
          // Gestion des erreurs
          this.isSubmitting = false;
          this.snackBar.open('Error creating blog post: ' + (error.error?.message || error.message), 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      );
    } else {
      this.snackBar.open('Please fill in all fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  resetForm() {
    this.blogPostForm.reset();
    this.imagePreview = null;
    this.snackBar.open('Form has been cleared', 'Close', {
      duration: 3000
    });
  }
}
