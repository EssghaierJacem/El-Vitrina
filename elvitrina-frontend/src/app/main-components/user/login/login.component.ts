import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/user/AuthService';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const request = this.loginForm.value;

    this.authService.login(request).subscribe({
      next: (res) => {
        this.tokenService.saveToken(res.token);
        const userRole = this.tokenService.getRole();  

        if (userRole === 'ADMIN') {
          this.router.navigate(['/dashboard']); 
        } else {
          this.router.navigate(['/']);  
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid credentials';
        this.isLoading = false;
      }
    });
  }
}
