import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';

import { FormationCategoryType } from 'src/app/core/models/formation/formationCategoryType';
import { LevelType } from 'src/app/core/models/formation/levelType';
import { Formation } from 'src/app/core/models/formation/formation.model';
import { FormationService } from 'src/app/core/services/formation/formationService';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-formation-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCheckboxModule,
    RouterModule
  ],
  templateUrl: './formation-create.component.html',
  styleUrls: ['./formation-create.component.scss']
})
export class FormationCreateComponent implements OnInit {
  formationForm: FormGroup;
  isSubmitting = false;
  isLoading = false;
  userId: number | null = null;

  categories = Object.values(FormationCategoryType);
  levels = Object.values(LevelType);

  languages = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien'];

  
  constructor(
    private fb: FormBuilder,
    private formationService: FormationService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initForm();
  }

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
  }

  private initForm(): void {
    this.formationForm = this.fb.group({
      courseTitle: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', []],
      formationCategory: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      certificateAvailable: [false],
      language: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      level: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.formationForm.invalid || !this.userId) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.formationForm.value;

    const formation: Formation = {
      ...formValue,
      user: { id: this.userId } as any
    };

    this.formationService.createFormation(formation).subscribe({
      next: () => {
        this.snackBar.open('Formation created successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/dashboard/formations']);
      },
      error: (err) => {
        this.snackBar.open('Error creating formation: ' + (err.error?.message || err.message), 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.formationForm.reset({
      certificateAvailable: false
    });

    this.snackBar.open('Form has been cleared', 'Close', {
      duration: 3000
    });

    this.router.navigate(['/dashboard/formations']);
  }
}
