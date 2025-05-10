import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/user/AuthService';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RecaptchaModule } from 'ng-recaptcha';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    RecaptchaModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  recaptchaToken: string = '';
  hidePassword = true;
  rememberDevice = false;
  selectedFile!: File;
  isFaceLoginLoading = false;
  isCameraOn = false;
  videoElement!: HTMLVideoElement;
  canvasElement!: HTMLCanvasElement;
  year = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recaptcha: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.tokenService.getToken()) {
      const userRole = this.tokenService.getRole();
      this.router.navigate([userRole === 'ADMIN' ? '/dashboard' : '/']);
    }

    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginForm.get('email')?.setValue(rememberedEmail);
      this.loginForm.get('rememberMe')?.setValue(true);
      this.rememberDevice = true;
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid || !this.recaptchaToken) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, rememberMe } = this.loginForm.value;

    // Handle remember me functionality
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    const request = {
      email,
      password,
      recaptchaToken: this.recaptchaToken
    };

    this.authService.login(request)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.tokenService.saveToken(res.token);
          const userRole = this.tokenService.getRole();
          
          this.snackBar.open('Login successful!', 'Close', { 
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          
          this.router.navigate([userRole === 'ADMIN' ? '/dashboard' : '/']);
        },
        error: (err) => {
          if (err.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
          } else if (err.status === 401) {
            this.errorMessage = 'Invalid email or password.';
          } else if (err.status === 403) {
            this.errorMessage = 'Your account has been locked. Please contact support.';
          } else {
            this.errorMessage = err.error?.message || 'An error occurred during login. Please try again.';
          }
          
          this.resetCaptcha();
        }
      });
  }

  onCaptchaResolved(token: string | null): void {
    if (token) {
      this.recaptchaToken = token;
      this.loginForm.get('recaptcha')?.setValue(token);
    } else {
      this.resetCaptcha();
    }
  }

  onCaptchaExpired(): void {
    this.resetCaptcha();
  }

  resetCaptcha(): void {
    this.recaptchaToken = '';
    this.loginForm.get('recaptcha')?.reset();
  }

  signInWithGoogle() {
    window.location.href = '/api/oauth2/authorization/google';
  }
  
  signInWithFacebook() {
    window.location.href = '/api/oauth2/authorization/facebook';
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  // Method to get form control for template
  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onFaceFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }
  
  onFaceLogin(): void {
    if (!this.selectedFile) {
      this.snackBar.open('Please select a face image first.', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
      return;
    }
  
    this.isFaceLoginLoading = true;
  
    this.authService.faceLogin(this.selectedFile)
      .pipe(finalize(() => this.isFaceLoginLoading = false))
      .subscribe({
        next: (res) => {
          this.tokenService.saveToken(res.token);
          const userRole = this.tokenService.getRole();
          
          this.snackBar.open('Face login successful!', 'Close', { 
            duration: 3000,
            panelClass: 'success-snackbar'
          });
  
          this.router.navigate([userRole === 'ADMIN' ? '/dashboard' : '/']);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Face not recognized. Please try again.', 'Close', { 
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        }
      });
  }

  startCamera(): void {
    this.isCameraOn = true;
    
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.videoElement = document.querySelector('video')!;
        this.videoElement.srcObject = stream;
        this.videoElement.play();
      })
      .catch((err) => {
        console.error('Error accessing camera', err);
        this.snackBar.open('Cannot access camera. Please allow permissions.', 'Close', { duration: 3000 });
      });
  }
  
  captureAndLogin(): void {
    this.canvasElement = document.createElement('canvas');
    this.canvasElement.width = this.videoElement.videoWidth;
    this.canvasElement.height = this.videoElement.videoHeight;
  
    const context = this.canvasElement.getContext('2d');
    if (context) {
      context.drawImage(this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);
  
      this.canvasElement.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'face_capture.jpg', { type: 'image/jpeg' });
  
          this.isFaceLoginLoading = true;
          this.authService.faceLogin(file)
            .pipe(finalize(() => this.isFaceLoginLoading = false))
            .subscribe({
              next: (res) => {
                this.tokenService.saveToken(res.token);
                const userRole = this.tokenService.getRole();
                
                this.snackBar.open('Face login successful!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
  
                this.router.navigate([userRole === 'ADMIN' ? '/dashboard' : '/']);
              },
              error: (err) => {
                console.error(err);
                this.snackBar.open('Face not recognized. Please try again.', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
              }
            });
        }
      }, 'image/jpeg');
    }
  }
  
  stopCamera(): void {
    this.isCameraOn = false;
    const video = document.querySelector('video');
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  }
  
}
