import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/user/AuthService';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { RegisterRequest } from 'src/app/core/models/user/register-request.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  flashMessage = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get passwordStrength(): string {
    const value = this.registerForm.get('password')?.value || '';
    if (value.length < 6) return 'weak';
    if (/[A-Z]/.test(value) && /[0-9]/.test(value) && /[!@#$%^&*]/.test(value)) return 'strong';
    if (/[A-Z]/.test(value) || /[0-9]/.test(value)) return 'medium';
    return 'weak';
  }

  get passwordStrengthColor(): string {
    switch (this.passwordStrength) {
      case 'strong': return '#4caf50';
      case 'medium': return '#ff9800';
      default: return '#f44336';
    }
  }

  get passwordStrengthWidth(): string {
    switch (this.passwordStrength) {
      case 'strong': return '100%';
      case 'medium': return '66%';
      default: return '33%';
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    const request: RegisterRequest = this.registerForm.value;

    this.authService.register(request).subscribe({
      next: () => {
        this.flashMessage = 'An email has been sent to verify your account.';
        this.errorMessage = '';
        this.isLoading = false;
        this.registerForm.reset();
        setTimeout(() => this.flashMessage = '', 60000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed';
        this.flashMessage = '';
        this.isLoading = false;
      }
    });
  }
}