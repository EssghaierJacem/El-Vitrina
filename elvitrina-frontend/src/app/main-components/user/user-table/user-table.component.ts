import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from 'src/app/core/services/user/UserService';
import { User } from 'src/app/core/models/user/user.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatPaginatorModule,
    RouterModule
  ],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  filteredDataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  displayedColumns = ['user', 'email', 'points', 'status', 'actions'];
  searchText: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.dataSource.data = users;
      this.filteredDataSource = this.dataSource;
      this.filteredDataSource.paginator = this.paginator; 
    });
  }

  getProgressColor(points: number): 'primary' | 'accent' | 'warn' {
    if (points >= 70) return 'primary';
    if (points >= 40) return 'accent';
    return 'warn';
  }

  applyFilter(): void {
    this.filteredDataSource.filter = this.searchText.trim().toLowerCase();
  }

  editUser(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((user) => user.id !== id);
      });
    }
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users.xlsx');
  }
}
