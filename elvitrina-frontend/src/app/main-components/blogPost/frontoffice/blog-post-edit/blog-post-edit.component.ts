import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogPostService } from 'src/app/core/services/blogPost/blogPostService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms'; // Pour le formGroup
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-post-edit',
  imports: [MatCardModule, RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    ReactiveFormsModule],
  templateUrl: './blog-post-edit.component.html',
  styleUrl: './blog-post-edit.component.scss'
})
export class BlogPostEditComponent {
  blogPostForm: FormGroup;
  isSubmitting = false;
  postId: number;

  constructor(
    private fb: FormBuilder,
    private blogPostService: BlogPostService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.blogPostForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      content: ['', [Validators.required]],
      image: [''],
      tag: ['']
    });
  }

  ngOnInit(): void {
    // Get the post ID from the route parameters
    this.postId = +this.route.snapshot.paramMap.get('id')!;

    // Fetch the blog post data
    this.blogPostService.getBlogPostById(this.postId).subscribe(post => {
      this.blogPostForm.patchValue(post);
    });
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
    const updatedPost = this.blogPostForm.value;

    this.blogPostService.updateBlogPost(this.postId, updatedPost).subscribe({
      next: () => {
        this.snackBar.open('Blog post updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/blog']);
      },
      error: (err) => {
        this.snackBar.open('Error updating blog post: ' + (err.error?.message || err.message), 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isSubmitting = false;
      }
    });
  }
}

