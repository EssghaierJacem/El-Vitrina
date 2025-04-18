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
import { MaterialModule } from 'src/app/material.module';
import { MatButtonModule } from '@angular/material/button';
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
    MaterialModule,
    MatButtonModule,
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

  readonly IMAGE_BASE_URL = 'http://localhost:8080/user-images/';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.dataSource.data = users;
      this.filteredDataSource = this.dataSource;
      this.filteredDataSource.paginator = this.paginator; 
    });
  }

  getUserImage(user: User): string {
    if (!user || !user.image) {
      return '/assets/images/default-avatar.png';
    }
  
    if (user.image.startsWith('http')) {
      return user.image;
    }
  
    return this.IMAGE_BASE_URL + user.image;
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
    this.router.navigate(['/dashboard/users', user.id, 'edit']);
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((user) => user.id !== id);
      });
    }
  }

  exportToExcel(): void {
    const dataWithoutPassword = this.dataSource.data.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithoutPassword);
  
    if (!ws['!ref']) {
      console.error('Sheet reference range is undefined.');
      return;
    }
  
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4CAF50' } }, 
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
      }
    };
  
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = { r: range.s.r, c: col }; 
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      if (!ws[cellRef]) continue;
      ws[cellRef].s = headerStyle;
    }
  
    const dataStyle = {
      font: { color: { rgb: '000000' } },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
      },
    };
  
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = { r: row, c: col };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        if (!ws[cellRef]) continue;
        ws[cellRef].s = dataStyle; 
      }
    }
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
  
    XLSX.writeFile(wb, 'List of Users.xlsx');
  }
  
}
