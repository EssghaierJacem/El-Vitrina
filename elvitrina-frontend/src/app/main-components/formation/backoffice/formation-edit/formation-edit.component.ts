import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { LevelType } from 'src/app/core/models/formation/levelType';
import { FormationCategoryType } from 'src/app/core/models/formation/formationCategoryType';
import { FormationService } from 'src/app/core/services/formation/formationService';

@Component({
  selector: 'app-formation-edit',
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
    RouterModule
  ],
  templateUrl: './formation-edit.component.html',
  styleUrls: ['./formation-edit.component.scss']
})
export class FormationEditComponent implements OnInit {
  formationForm: FormGroup;
  isSubmitting = false;
  formationId: number | null = null;
  categoryOptions = Object.values(FormationCategoryType);
  levelOptions = Object.values(LevelType);

  constructor(
    private fb: FormBuilder,
    private formationService: FormationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

    ngOnInit(): void {
      this.formationId = Number(this.route.snapshot.paramMap.get('id'));
      if (this.formationId) {
        this.loadFormation(this.formationId);
      } else {
        console.error("Formation ID is not available.");
      }
    }

  private initForm(): void {
    this.formationForm = this.fb.group({
      courseTitle: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      formationCategory: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      certificateAvailable: [false],
      language: ['', [Validators.required, Validators.maxLength(50)]],
      price: [0, [Validators.required, Validators.min(0)]],
      level: ['', Validators.required]
    });
  }

  loadFormation(id: number): void {
    this.formationService.getFormationById(id).subscribe({
      next: (formation) => {
        this.formationForm.patchValue(formation);  // Remplir le formulaire avec les données de la formation.
      },
      error: (error) => {
        console.error('Error loading formation:', error);
        this.snackBar.open('Error loading formation', 'Close', {
          duration: 5000
        });
        this.router.navigate(['../']);
      }
    });
  }

  onSubmit(): void {
    if (this.formationForm.valid && !this.isSubmitting && this.formationId) {
      this.isSubmitting = true;  // Démarrer l'icône de chargement
      const formationData = this.formationForm.value;
  
      this.formationService.updateFormation(this.formationId, formationData).subscribe({
        next: (response) => {
          console.log('Formation updated successfully:', response);
          this.snackBar.open('Formation updated successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/dashboard/formations']);
        },
        error: (error) => {
          console.error('Error updating formation:', error);
          this.snackBar.open(error.message || 'Error updating formation', 'Close', {
            duration: 5000
          });
          this.isSubmitting = false;  // Arrêter l'icône de chargement en cas d'erreur
        },
        complete: () => {
          this.isSubmitting = false;  // Arrêter l'icône de chargement après la requête
        }
      });
    } else {
      Object.keys(this.formationForm.controls).forEach(key => {
        const control = this.formationForm.get(key);
        if (control?.errors) {
          console.log(`Validation errors for ${key}:`, control.errors);
        }
        control?.markAsTouched();
      });
    }
  }
  

  resetForm(): void {
    if (this.formationId) {
      this.loadFormation(this.formationId);
    }
    
    this.snackBar.open('Form has been reset', 'Close', {
      duration: 3000
    });
    
    // Navigate back to the list
    this.router.navigate(['/dashboard/formations']);
  }
}
