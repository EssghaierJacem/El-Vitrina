import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/core/services/user/UserService';
import { User } from 'src/app/core/models/user/user.model';

@Component({
  selector: 'app-user-image-upload',
  templateUrl: './user-image-upload.component.html',
  imports: [CommonModule],
  standalone: true
})
export class UserImageUploadComponent {
  @Input() userId!: number;
  @Output() userImageUpdated = new EventEmitter<User>();

  selectedFile?: File;
  imagePreview?: string;
  uploadedImageUrl?: string;

  constructor(private userService: UserService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  upload(): void {
    if (this.selectedFile && this.userId) {
      this.userService.uploadProfileImage(this.userId, this.selectedFile)
        .subscribe({
          next: (updatedUser) => {
            alert('Image uploaded successfully!');
            this.uploadedImageUrl = `/api/users/images/${updatedUser.image}`;
            this.userImageUpdated.emit(updatedUser);
          },
          error: () => alert('Upload failed!')
        });
    }
  }
}
