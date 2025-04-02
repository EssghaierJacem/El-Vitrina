import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user/UserService';
import { TokenService } from 'src/app/core/services/user/TokenService';
import { User } from 'src/app/core/models/user/user.model'; 
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class EditProfileComponent implements OnInit {

  user: User = {} as User; 

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.tokenService.getDecodedToken()?.id; 

    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.user = user; 
        },
        error: () => {
          alert('Failed to fetch user data!');
          this.router.navigate(['/login']); 
        }
      });
    } else {
      alert('No user ID found');
      this.router.navigate(['/login']); 
    }
  }

  saveChanges(): void {
    const userId = this.tokenService.getDecodedToken()?.id; 

    if (userId) {
      this.userService.updateUser(userId, this.user).subscribe({
        next: () => {
          alert('Profile updated successfully');
          this.router.navigate(['/dashboard']); 
        },
        error: () => {
          alert('Failed to update profile');
        }
      });
    } else {
      alert('User ID is not available');
    }
  }
}
