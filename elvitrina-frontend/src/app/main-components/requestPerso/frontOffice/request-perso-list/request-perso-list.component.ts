import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequestPersoService } from 'src/app/core/services/requestPerso/request-perso.service';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-request-perso-list',
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
  templateUrl: './request-perso-list.component.html',
  styleUrl: './request-perso-list.component.scss'
})
export class RequestPersoListComponent {
  allrequests:any;
  userId: number | null = null;
  currentUser: any;
  firstName = '';
  email = '';
constructor(private requestPersoService: RequestPersoService, private snackBar: MatSnackBar,  private tokenService: TokenService, private route: ActivatedRoute,private router: Router) 
{}
ngOnInit():void {
  this.getAllRequestPerso();
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
getAllRequestPerso() {
  this.requestPersoService.getAllRequestPerso().subscribe(
    (response) => {
      console.log('All RequestPerso:', response);
      this.allrequests = response; // Assuming the response is an array of RequestPerso objects
      // Handle the response as needed
    },
    (error) => {
      console.error('Error fetching all RequestPerso:', error);
      this.snackBar.open('Error fetching all RequestPerso', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  );
}}
