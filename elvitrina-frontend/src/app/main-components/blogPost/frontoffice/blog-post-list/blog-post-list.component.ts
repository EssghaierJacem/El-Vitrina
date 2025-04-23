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
      createdAt: new Date() // Ajout de la date actuelle
          
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


  // Dans votre composant TypeScript
currentEditComment: any = null;
editMode: boolean = false;

editComment(comment: any) {
  // Si on clique sur le même commentaire en mode édition, on annule
  if (this.currentEditComment === comment && this.editMode) {
    this.cancelEdit();
    return;
  }

  // Activer le mode édition
  this.editMode = true;
  this.currentEditComment = comment;
  
  // Vous pouvez aussi initialiser un formControl si vous utilisez ReactiveForms
  // this.commentForm.patchValue({ content: comment.content });
}

// Fonction pour sauvegarder les modifications
saveComment() {
  if (!this.currentEditComment) return;

  // Appel au service pour mettre à jour le commentaire
  this.commentService.updateComment(
    this.currentEditComment.id, 
    this.currentEditComment.content
  ).subscribe({
    next: (updatedComment) => {
      // Mettre à jour le commentaire dans le tableau
      const index = this.comments[this.currentEditComment.postId].findIndex(
        c => c.id === this.currentEditComment.id
      );
      if (index !== -1) {
        this.comments[this.currentEditComment.postId][index] = updatedComment;
      }
      
      this.cancelEdit();
      // Optionnel: Afficher un message de succès
      this.snackBar.open('Commentaire modifié', 'Fermer', { duration: 3000 });
    },
    error: (err) => {
      console.error('Erreur lors de la modification', err);
      // Gérer l'erreur
    }
  });
}

// Fonction pour annuler l'édition
cancelEdit() {
  this.editMode = false;
  this.currentEditComment = null;
  // this.commentForm.reset(); // Si vous utilisez ReactiveForms
}


getImageUrl(image: string): string {
  return `http://localhost:8080/images/${image}`;
}





  
  }
  
  
  


  