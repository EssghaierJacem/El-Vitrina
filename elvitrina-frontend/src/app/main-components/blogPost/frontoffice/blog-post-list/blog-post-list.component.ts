import { Component, OnInit } from '@angular/core';
import { BlogPost } from 'src/app/core/models/blogPost/blogPost.model';
import { Comment } from 'src/app/core/models/comment/comment.model';
import { BlogPostService } from 'src/app/core/services/blogPost/blogPostService';
import { CommentService } from 'src/app/core/services/comment/commentService';
import { FormsModule } from '@angular/forms'; // ✅ Import ici
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-blog-post-list',
  imports: [CommonModule,
    RouterModule,
    FormsModule , 
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './blog-post-list.component.html',
  styleUrl: './blog-post-list.component.scss'
})
export class BlogPostListComponent {

  blogPosts: BlogPost[] = [];
  comments: { [postId: number]: Comment[] } = {};
  commentInputs: { [postId: number]: string } = {};
  isLoading: boolean = true;
  loggedInUserId: number = 1; // à adapter selon ton système de token

  constructor(
    private blogPostService: BlogPostService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  loadBlogPosts(): void {
    this.isLoading = true;
    this.blogPostService.getAllBlogPosts().subscribe({
      next: (posts) => {
        this.blogPosts = posts;
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

  addComment(postId: number): void {
    const content = this.commentInputs[postId]?.trim();
    if (!content) return;

    const newComment: Comment = {
      content,
      user: { id: this.loggedInUserId } as any,
      blogPost: { id: postId } as any
    };

    this.commentService.createComment(newComment).subscribe({
      next: () => {
        this.commentInputs[postId] = '';
        this.loadComments(postId);
      },
      error: (err) => console.error(err)
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}


