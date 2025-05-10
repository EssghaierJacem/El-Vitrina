import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/core/services/user/UserService';
import { User } from 'src/app/core/models/user/user.model';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressBarModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userId!: number;
  user: User = {} as User;

  selectedFile?: File;
  isImageValid = true;
  localImagePreview?: string;
  isUploading = false;
  readonly IMAGE_BASE_URL = '/api/user-images/';
  
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: () => this.router.navigate(['/dashboard/users'])
    });
  }

  updateUser(): void {
    this.userService.updateUser(this.userId, this.user).subscribe({
      next: () => {
        alert('User updated successfully!');
        this.router.navigate(['/dashboard/users']);
      },
      error: (error) => {
        console.error(error);
        alert('Failed to update user!');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.localImagePreview = reader.result as string;
        this.uploadImage(); 
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage(): void {
    if (this.selectedFile && this.user.id) {
      this.userService.uploadProfileImage(this.user.id, this.selectedFile).subscribe({
        next: (updatedUser) => {
          this.user.image = updatedUser.image;
          this.localImagePreview = undefined; 
          alert('Image uploaded successfully!');
        },
        error: () => alert('Image upload failed!')
      });
    }
  }

  onImageUrlChange(): void {
    this.localImagePreview = undefined; 
  }

  previewImageUrl(): string {
    if (this.localImagePreview) return this.localImagePreview;
  
    if (this.user.image) {
      return this.user.image.startsWith('http') 
        ? this.user.image 
        : this.IMAGE_BASE_URL + this.user.image;
    }
  
    return '/assets/images/default-avatar.png';
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/users']);
  }
}