import { Component, OnInit } from '@angular/core';
import { BlogPost } from 'src/app/core/models/blogPost/blogPost.model';
import { Comment } from 'src/app/core/models/comment/comment.model';
import { BlogPostService } from 'src/app/core/services/blogPost/blogPostService';
import { CommentService } from 'src/app/core/services/comment/commentService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-blog-post-list',
  standalone: true,
  imports: [MatProgressSpinnerModule,
    MatChipsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatCardModule,
    MatInputModule
  ],
  templateUrl: './blog-post-list.component.html',
  styleUrls: ['./blog-post-list.component.scss']
})
export class BlogPostListComponent implements OnInit {
  blogPosts: BlogPost[] = [];
  comments: { [postId: number]: Comment[] } = {};
  commentInputs: { [postId: number]: string } = {};
  isLoading: boolean = true;
  loggedInUserId: number = 1;
  loggedInUserName: string = 'Eya JEDDA';
  showCommentInput: { [postId: number]: boolean } = {};

  constructor(
    private blogPostService: BlogPostService,
    private commentService: CommentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  loadBlogPosts(): void {
    this.isLoading = true;
    this.blogPostService.getAllBlogPosts().subscribe({
      next: (posts) => {
        this.blogPosts = posts.sort((a, b) => 
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
        this.isLoading = false;
        posts.forEach(post => this.loadComments(post.id!));
      },
      error: () => this.isLoading = false
    });
  }

  loadComments(postId: number): void {
    this.commentService.getCommentsByBlogPost(postId).subscribe({
      next: (comments) => this.comments[postId] = comments,
      error: (err) => console.error(err)
    });
  }

  toggleCommentInput(postId: number): void {
    this.showCommentInput[postId] = !this.showCommentInput[postId];
  }

  addComment(postId: number): void {
    const content = this.commentInputs[postId]?.trim();
    if (!content) return;

    const newComment: Comment = {
      content,
      user: { id: this.loggedInUserId, name: this.loggedInUserName } as any,
      blogPost: { id: postId } as any,
      createdAt: new Date().toISOString()
    };

    this.commentService.createComment(newComment).subscribe({
      next: () => {
        this.commentInputs[postId] = '';
        this.showCommentInput[postId] = false;
        this.loadComments(postId);
      },
      error: (err) => console.error(err)
    });
  }

  formatDate(date: string): string {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    
    return postDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  navigateToEdit(postId: number): void {
    this.router.navigate(['/blog/edit', postId]);
  }
}