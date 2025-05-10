import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPostService } from 'src/app/core/services/blogPost/blogPostService';
import { BlogPost } from 'src/app/core/models/blogPost/blogPost.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';  // Pour les formulaires réactifs
import { MatCardModule } from '@angular/material/card';  // Pour mat-card
import { MatFormFieldModule } from '@angular/material/form-field';  // Pour mat-form-field
import { MatInputModule } from '@angular/material/input';  // Pour matInput
import { MatButtonModule } from '@angular/material/button';  // Pour mat-button
import { MatIconModule } from '@angular/material/icon';  // Pour mat-icon
import { MatSnackBarModule } from '@angular/material/snack-bar';  // Pour les notifications Snackbar
import { RouterModule } from '@angular/router'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, NgIf } from '@angular/common';  // Assurez-vous que CommonModule est importé

@Component({
  selector: 'app-edit-blog-post',
  standalone: true,
  imports: [ 
    CommonModule,
    NgIf,
    MatProgressSpinnerModule,
    ReactiveFormsModule,  
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './blog-post-edit.component.html',
  styleUrls: ['./blog-post-edit.component.scss']
})
export class BlogPostEditComponent implements OnInit {
  blogPostId!: number;
  blogPostForm!: FormGroup;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.blogPostId = +this.route.snapshot.paramMap.get('id')!;
    this.loadBlogPost();
  }

  loadBlogPost(): void {
    this.blogPostService.getBlogPostById(this.blogPostId).subscribe({
      next: (post) => {
        this.blogPostForm = this.fb.group({
          title: [post.title, Validators.required],
          content: [post.content, Validators.required],
          tag: [post.tag],
          image: [post.image],
          userName: [{ value: post.user?.firstname , disabled: true }]
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load blog post', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.blogPostForm.invalid) return;

    // On crée l'objet BlogPost à partir du formulaire
    const updatedPost: BlogPost = {
      id: this.blogPostId,
      ...this.blogPostForm.getRawValue(), // Inclut les champs comme userName et autres
    };

    this.blogPostService.updateBlogPost(this.blogPostId, updatedPost).subscribe({
      next: () => {
        this.snackBar.open('Post updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard/blogPosts']);
      },
      error: () => {
        this.snackBar.open('Error updating post', 'Close', { duration: 3000 });
      }
    });
  }
}