import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ProposalPersoService } from 'src/app/core/services/proposalPerso/proposal-perso.service';
import { RequestPersoService } from 'src/app/core/services/requestPerso/request-perso.service';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-view-request-perso',
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
  templateUrl: './view-request-perso.component.html',
  styleUrl: './view-request-perso.component.scss'
})
export class ViewRequestPersoComponent {
  userId: number | null = null;
  currentUser: any;
  firstName = '';
  email = '';
requestId= this.route.snapshot.params['id'];
requestData: any;
ProposalRequests:any;

proposalForm! :FormGroup;

constructor(private requestPersoService: RequestPersoService, private snackBar: MatSnackBar,  private tokenService: TokenService, private route: ActivatedRoute,private router: Router, private fb: FormBuilder,private proposalPersoService: ProposalPersoService) { }
ngOnInit(): void {
 console.log(this.requestId);   
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


 this.proposalForm = this.fb.group({
 //requestPersoId: ['', Validators.required],
  //title: ['', Validators.required],
  description: ['', Validators.required],
  price: ['', [Validators.required, Validators.min(0)]]
 // image: [''],
 // deliveryTime: ['', Validators.required]
});

}



private loadCurrentUser(): void {
  const decodedToken = this.tokenService.getDecodedToken();
  if (decodedToken) {
    this.userId = decodedToken.id ?? null;
    //console.log(this.userId);
    this.firstName = decodedToken.firstname || '';
    this.email = decodedToken.email || '';
    
    // For backward compatibility
    this.currentUser = {
      id: this.userId,
      name: this.firstName,
      email: this.email
    };
  }

  this.getRequestPersoById();
}

getProposalRequestsByProposalPerso(){
  this.proposalPersoService.getAllProposalPersoByRequestPerso(this.requestId).subscribe(
    (response) => {
      this.ProposalRequests = response;
      console.log(this.ProposalRequests);
    },
    (error) => {
      console.error('Error fetching proposal data:', error);
      this.snackBar.open('Error fetching proposal data', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  );
}


getRequestPersoById() {
  this.requestPersoService.getRequestPersoById(this.requestId).subscribe(
    (response) => {
      this.requestData = response;
      console.log(this.requestData);
      this.getProposalRequestsByProposalPerso();
    },
    (error) => {
      console.error('Error fetching request data:', error);
      this.snackBar.open('Error fetching request data', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  );
}



createProposal() {
  const formValues = this.proposalForm.value;
  const proposalData = {
    requestPersoId: this.requestId,
  //  title: formValues.title,
    description: formValues.description,
    price: formValues.price,
   // image: formValues.image,
    date: new Date().toISOString() // Current date in ISO format
  };

  this.proposalPersoService.createNewProposalPerso(proposalData).subscribe(
    res => {
      this.snackBar.open('Proposal created successfully!', 'Close', { duration: 3000 });
      //this.router.navigate(['/']);
      this.proposalPersoService.getAllProposalPersoByRequestPerso(this.requestId); // Refresh the proposal list after creation
    },
    error => {
      this.snackBar.open("Failed to create proposal. Please try again.", "Close");
    }
  );
}




}
