import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Nécessaire pour ngModel
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// Services
import { BlogPostService } from 'src/app/core/services/blogPost/blogPostService';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { SpeechRecognitionService } from 'src/app/core/services/blogPost/SpeechRecognitionService';

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-blog-post-create',
  standalone: true,
  imports: [MatSelectModule,
    MatOptionModule,
    MatProgressBarModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Angular Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './blog-post-create.component.html',
  styleUrls: ['./blog-post-create.component.scss']
})
export class BlogPostCreateComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  blogPostForm: FormGroup;
  isSubmitting = false;
  userId: number | null = null;
  selectedImageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isCameraOpen = false;
  stream: MediaStream | null = null;
  isFileUploaded = false;

  constructor(
    private fb: FormBuilder,
    private blogPostService: BlogPostService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private router: Router ,
    private speechRecognition: SpeechRecognitionService, 
    private cdr: ChangeDetectorRef 


  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      this.snackBar.open('Please log in to create a blog post', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/authentication/login']);
    } else {
      const decoded = this.tokenService.getDecodedToken();
      this.userId = decoded?.id ?? null;
    }
  }

  private initForm(): void {
    this.blogPostForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      content: ['', [Validators.required]],
      image: [''],
      tag: ['']
    });
  }

  // ==================== Camera Functions ====================
  startCamera(): void {
    this.isCameraOpen = true;
    this.isFileUploaded = false;

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        if (this.videoElement && this.videoElement.nativeElement) {
          this.videoElement.nativeElement.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing camera: ", err);
        this.snackBar.open('Could not access camera: ' + err.message, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      });
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isCameraOpen = false;
  }

  takePhoto(): void {
    if (this.canvasElement && this.videoElement) {
      const canvas = this.canvasElement.nativeElement;
      const video = this.videoElement.nativeElement;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to Blob and create File
        canvas.toBlob(blob => {
          if (blob) {
            const fileName = 'capture_' + new Date().getTime() + '.jpg';
            this.selectedImageFile = new File([blob], fileName, { type: 'image/jpeg' });
            
            // Create preview
            const reader = new FileReader();
              reader.onload = () => {
                this.imagePreview = reader.result;
                this.cdr.detectChanges(); 
            };
            reader.readAsDataURL(blob);
          }
        }, 'image/jpeg', 0.95);
        
        this.stopCamera();
      }
    }
  }

  // ==================== Image Upload ====================
  onFileSelected(event: any): void {
    this.isFileUploaded = true;
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // ==================== Form Submission ====================
  onSubmit(): void {
    if (this.blogPostForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.blogPostForm.get('title')?.value);
    formData.append('content', this.blogPostForm.get('content')?.value);
    formData.append('tag', this.blogPostForm.get('tag')?.value);
   
    if (this.userId !== null) {
      formData.append('userId', this.userId.toString());
    }

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    this.isSubmitting = true;

    this.blogPostService.createBlogPost(formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.resetForm();
        this.snackBar.open('Post created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/blog']);
      }
    });
  }

  // ==================== Reset Form ====================
  resetForm(): void {
    this.blogPostForm.reset();
    this.selectedImageFile = null;
    this.imagePreview = null;
    this.stopCamera();
  }




  
  isListening = false;
  toggleVoiceInput() {
    if (this.isListening) {
      this.stopVoiceInput();
    } else {
      this.startVoiceInput();
    }
  }

  startVoiceInput() {
    this.isListening = true;
    this.speechRecognition.startListening().subscribe({
      next: (transcript) => {
        const currentContent = this.blogPostForm.get('content')?.value || '';
        this.blogPostForm.get('content')?.setValue(`${currentContent} ${transcript}`.trim());
      },
      complete: () => this.stopVoiceInput()
    });
  }

  stopVoiceInput() {
    this.isListening = false;
    this.speechRecognition.stopListening();
  }
}