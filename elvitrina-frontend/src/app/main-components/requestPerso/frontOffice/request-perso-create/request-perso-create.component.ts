import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequestPersoService } from 'src/app/core/services/requestPerso/request-perso.service';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-request-perso-create',
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
    CommonModule
  ],
  templateUrl: './request-perso-create.component.html',
  styleUrls: ['./request-perso-create.component.scss']
})
export class RequestPersoCreateComponent implements OnInit {
  RequestForm!: FormGroup;
  tags: string[] = [];
  userId: number | null = null;
  currentUser: any;
  firstName = '';
  email = '';
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  today: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private requestPersoService: RequestPersoService,
    private route: ActivatedRoute,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      this.snackBar.open('Please log in to create a store', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      this.router.navigate(['/authentication/login']);
    } else {
      this.loadCurrentUser();
    }

    this.RequestForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(5000)]],
      minPrice: [0, [Validators.required, Validators.min(0)]],
      maxPrice: [0, [Validators.required, Validators.min(0)]],
      deliveryTime: [null, Validators.required],
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  loadCurrentUser(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.userId = decodedToken.id ?? null;
      this.firstName = decodedToken.firstname || '';
      this.email = decodedToken.email || '';
      this.currentUser = { id: this.userId, name: this.firstName, email: this.email };
    }
  }

  add(event: any) {
    const value = (event.value || '').trim();
    if (value) this.tags.push(value);
    if (event.chipInput) event.chipInput.clear();
  }

  remove(tag: string) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) this.tags.splice(index, 1);
  }

  priceIsValid(): boolean {
    const min = this.RequestForm.get('minPrice')?.value;
    const max = this.RequestForm.get('maxPrice')?.value;
    return max > min;
  }

  cancel() {
    this.router.navigate(['/']);
  }

  createRequest() {
    if (!this.selectedFile) {
      this.snackBar.open('Please select an image', 'Close', { duration: 3000 });
      return;
    }

    if (!this.priceIsValid()) {
      this.snackBar.open('Max price must be greater than Min price.', 'Close', { duration: 3000 });
      return;
    }

    const requestData = {
      userId: this.currentUser.id,
      title: this.RequestForm.get('title')?.value,
      description: this.RequestForm.get('description')?.value,
      minPrice: this.RequestForm.get('minPrice')?.value,
      maxPrice: this.RequestForm.get('maxPrice')?.value,
      image: this.previewUrl as string,
      deliveryTime: this.RequestForm.get('deliveryTime')?.value,
      tags: this.tags
    };

    this.requestPersoService.createNewRequestPerso(requestData).subscribe(
      res => {
        this.snackBar.open('Request created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error => {
        this.snackBar.open("Failed to create request. Please try again.", "Close");
      }
    );
  }
}
