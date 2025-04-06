import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestPersoService } from 'src/app/core/services/requestPerso/request-perso.service';

@Component({
  selector: 'app-request-perso-list',
  imports: [],
  templateUrl: './request-perso-list.component.html',
  styleUrl: './request-perso-list.component.scss'
})
export class RequestPersoListComponent {

constructor(private requestPersoService: RequestPersoService, private snackBar: MatSnackBar) 
{}
ngOnInit() {
  this.getAllRequestPerso();
}
getAllRequestPerso() {
  this.requestPersoService.getAllRequestPerso().subscribe(
    (response) => {
      console.log('All RequestPerso:', response);
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
