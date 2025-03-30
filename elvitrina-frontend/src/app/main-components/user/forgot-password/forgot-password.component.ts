import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/user/AuthService';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  message = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;
  
    this.isLoading = true;
    this.errorMessage = '';
    this.message = '';
  
    const email = this.forgotForm.value.email;
  
    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.message = res.message || '✅ A reset link has been sent to your email.';
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || '❌ Unable to send reset link.';
        this.isLoading = false;
      }
    });
  }
}
