import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BlogPostService } from 'src/app/core/services/blogPost/blogPostService';
import { BlogPost } from 'src/app/core/models/blogPost/blogPost.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';  // Importation du module
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blogpost-list',
  imports: [RouterModule,
      FormsModule,
    MatChipsModule  ,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatInputModule,
    MatTableModule,
    MatChipsModule 
  ],
  templateUrl: './blog-post-list.component.html',
  styleUrls: ['./blog-post-list.component.scss']
})
export class BlogPostListComponent implements OnInit {
  displayedColumns: string[] = ['user', 'title', 'content', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<BlogPost>();
  searchText = '';
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private blogPostService: BlogPostService, private snackBar: MatSnackBar) {}

  blogPosts: BlogPost[] = [];  // Déclaration de la propriété blogPosts


  ngOnInit(): void {
    this.getBlogPosts();  // Récupération des posts de blog
  }

  getBlogPosts(): void {
    this.blogPostService.getAllBlogPosts().subscribe({
      next: (data) => {
        this.blogPosts = data; 
        this.isLoading = false; // ✅ On arrête le spinner ici
        // Assignation des données à la propriété blogPosts
        console.log('Posts récupérés :', data);  // Ajoute cette ligne pour vérifier les données

      },
      
      error: (err) => {
        console.error('Erreur de récupération des posts de blog', err);
        this.isLoading = false; // ✅ Même en cas d'erreur, on cache le spinner

      }
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  deleteBlogPost(id: number) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogPostService.deleteBlogPost(id).subscribe(() => {
        this.getBlogPosts();
        this.snackBar.open('Blog post successfully deleted', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      });
    }
  }

  exportToPDF() {
    // Fonction pour exporter en PDF (si nécessaire)
  }
}
