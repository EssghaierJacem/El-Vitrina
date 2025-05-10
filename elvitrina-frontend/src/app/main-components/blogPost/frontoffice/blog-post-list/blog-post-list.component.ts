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
import { TokenService } from 'src/app/core/services/user/TokenService';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TranslationRequest, TranslationResponse } from 'src/app/core/models/blogPost/traduction.model';

@Component({
  selector: 'app-blog-post-list',
  standalone: true,
  imports: [MatSnackBarModule,
    MatProgressSpinnerModule,
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
  //loggedInUserId: number = 1;
  //loggedInUserName: string = 'Eya JEDDA';
  showCommentInput: { [postId: number]: boolean } = {};
  userId: number | null = null;

  editingCommentId: number | null = null;
  editedContent: string = '';


  constructor(
    private blogPostService: BlogPostService,
    private commentService: CommentService,
    private router: Router,
        private snackBar: MatSnackBar,
    private tokenService: TokenService
    
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
        if (!token) {
          this.snackBar.open('Please log in to create a formation', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.router.navigate(['/authentication/login']);
        } else {
          const decoded = this.tokenService.getDecodedToken();
          this.userId = decoded?.id ?? null;
        }


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
      blogPost: { id: postId } as any,
      user: { id: this.userId } as any,
      createdAt: new Date()
    };
  
    this.commentService.createComment(newComment).subscribe({
      next: () => {
        this.commentInputs[postId] = '';
        this.showCommentInput[postId] = false;
  
        this.commentService.getCommentsByBlogPost(postId).subscribe({
          next: (comments) => {
            // 🔥 Forcer le changement de référence pour déclencher le rafraîchissement
            this.comments[postId] = [...comments];
          },
          error: (err) => console.error('Erreur lors du rechargement des commentaires :', err)
        });
      },
      error: (err) => console.error('Erreur lors de la création du commentaire :', err)
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

  deleteBlogPost(id: number) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogPostService.deleteBlogPost(id).subscribe(() => {
        this.loadBlogPosts();
        this.snackBar.open('Blog post successfully deleted', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      });
    }
  }


  shareOnFacebook(postId: number): void {
    const post = this.blogPosts.find(p => p.id === postId);
    if (!post) return;
  
    const title = post.title;
    const description = post.content;
  
    const shareText = `${title}\n\n${description}`;
  
    // Copie dans le presse-papier
    navigator.clipboard.writeText(shareText).then(() => {
      // Ouvre la page Facebook
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php`;

      window.open(facebookShareUrl, '_blank', 'width=400,height=400');
  
      // Message à l’utilisateur
      alert('Le contenu a été copié. Vous pouvez le coller dans votre publication Facebook.');
    });
  }

  getImageUrl(image: string): string {
    return `/api/images/${image}`;
  }

  deleteComment(commentId: number, postId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.snackBar.open('Comment deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadComments(postId);
        },
        error: (err) => {
          this.snackBar.open('Error deleting comment: ' + (err.error?.message || err.message), 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }




  // Ajoutez ces méthodes à votre classe BlogPostListComponent

startEditingComment(comment: Comment): void {
  this.editingCommentId = comment.id!;
  this.editedContent = comment.content;
}

cancelEditing(): void {
  this.editingCommentId = null;
  this.editedContent = '';
}

saveEditedComment(postId: number, commentToUpdate: Comment): void {
  if (!this.editingCommentId || !this.editedContent.trim()) return;

  const updatedComment: Comment = {
    id: this.editingCommentId,
    content: this.editedContent,
    blogPost: { id: postId } as any,
    user: { id: this.userId } as any}
    ;

  this.commentService.updateComment(this.editingCommentId, updatedComment).subscribe({
    next: () => {
      this.snackBar.open('Comment updated successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.editingCommentId = null;
      this.editedContent = '';
      this.loadComments(postId);
    },
    error: (err) => {
      this.snackBar.open('Error updating comment: ' + (err.error?.message || err.message), 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  });
}

// Dans votre composant
toggleLike(post: BlogPost): void {
  post.isLiked = !post.isLiked;
  post.reactionNumber += post.isLiked ? 1 : -1;
}


traductionRequest : TranslationRequest = {
  text: ''
}
translationResponse: TranslationResponse | null = null;

currentTranslatedCommentId: number | null = null;

async handleTranslationClick(comment: Comment): Promise<void> {
  if (this.currentTranslatedCommentId === comment.id && this.translationResponse) {
    // Hide translation if clicking on same comment
    this.currentTranslatedCommentId = null;
    this.translationResponse = null;
  } else {
    // Show translation for new comment
    this.translationResponse = null;
    this.currentTranslatedCommentId = comment.id!;
  await  this.translate(comment.content);
  }
}

translate(cmntr: string): void {
  this.traductionRequest.text = cmntr;
  console.log("Translate comment: ", cmntr);

  this.blogPostService.translateText(this.traductionRequest).subscribe(
    (response: TranslationResponse) => {
      this.translationResponse = response;
      console.log("Translation response: ", this.translationResponse);
    },
    (error) => {
      console.error("Translation error: ", error);
      this.translationResponse = null;
    }
  );
}



}