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
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private requestPersoService : RequestPersoService, // Inject the service here
      private route: ActivatedRoute,
      private tokenService: TokenService,
  ) {}

  ngOnInit(): void {


      const id = Number(this.route.snapshot.paramMap.get('id'));
     console.log(id);
     const token = this.tokenService.getToken();

     if (!token) {
      this.snackBar.open('Please log in to create a store', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
      });
      this.router.navigate(['/authentication/login']);

  } 
else {
        this.loadCurrentUser();
    }


    console.log(token);
    this.RequestForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(5000)]],
      minPrice: [0, [Validators.required, Validators.min(0)]],
      maxPrice: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      deliveryTime: [null, Validators.required],
    });
  }
  private loadCurrentUser(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.userId = decodedToken.id ?? null;
      console.log(this.userId);
      this.firstName = decodedToken.firstname || '';
      this.email = decodedToken.email || '';
      
      // For backward compatibility
      this.currentUser = {
        id: this.userId,
        name: this.firstName,
        email: this.email
      };
    }
  }
  add(event: any) {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    // Clear the input value
    if (event.chipInput) {
      event.chipInput.clear();
    }
  }

  remove(tag: string) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  createRequest() {
    const formValues = this.RequestForm.value;
  
    const requestData = {
      userId: this.currentUser.id, // Send only the user's ID
      title: formValues.title,
      description: formValues.description,
      minPrice: formValues.minPrice,
      maxPrice: formValues.maxPrice,
      image: formValues.image,
      deliveryTime: formValues.deliveryTime,
      viewCount: 0,
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
