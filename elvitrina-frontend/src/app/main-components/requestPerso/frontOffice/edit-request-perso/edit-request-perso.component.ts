import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequestPersoService } from 'src/app/core/services/requestPerso/request-perso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-edit-request-perso',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatChipsModule,
    CommonModule,
    MatGridListModule
  ],
  templateUrl: './edit-request-perso.component.html',
  styleUrls: ['./edit-request-perso.component.scss']
})
export class EditRequestPersoComponent implements OnInit {
  editForm!: FormGroup;
  requestId!: number;
  selectedRequest: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestPersoService: RequestPersoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.requestId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadRequest();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      title: [''],
      description: [''],
      minPrice: [0],
      maxPrice: [0],
      image: [''],
      deliveryTime: [''],
      tags: [[]]
    });
  }

  loadRequest(): void {
    this.requestPersoService.getRequestPersoById(this.requestId).subscribe(request => {
      this.selectedRequest = request; // Store the selected request
      
      const formattedDate = request.deliveryTime
        ? new Date(request.deliveryTime).toISOString().substring(0, 10)
        : '';

      this.editForm.patchValue({
        title: request.title,
        description: request.description,
        minPrice: request.minPrice,
        maxPrice: request.maxPrice,
        image: request.image,
        deliveryTime: formattedDate,
        tags: request.tags
      });
    });
  }

  onSubmitUpdateForm(event: Event): void {
    event.preventDefault(); // Prevent default form submission behavior

    if (!this.selectedRequest || !this.selectedRequest.id) return;

    const updatedData = {
      title: this.editForm.value.title,
      description: this.editForm.value.description,
      minPrice: this.editForm.value.minPrice,
      maxPrice: this.editForm.value.maxPrice,
      deliveryTime: this.editForm.value.deliveryTime,
      image: this.editForm.value.image,
      tags: this.editForm.value.tags,
      viewCount: this.selectedRequest.viewCount,
      user: this.selectedRequest.user,
      date: this.selectedRequest.date
    };

    this.requestPersoService.updateRequestPerso(this.selectedRequest.id, updatedData).subscribe({
      next: updated => {
        this.snackBar.open('Request updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/somewhere']);
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Failed to update request', 'Close', { duration: 3000 });
      }
    });
  }
}