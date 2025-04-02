import { Component, OnInit, ViewChild } from '@angular/core';
import { OfferService } from 'src/app/core/services/offer/OfferService';
import { Router } from '@angular/router';
import { Offer } from 'src/app/core/models/offer/offer.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from 'src/app/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatPaginator,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    RouterModule,
    MatSidenavModule,
    MatMenuModule,
    MatProgressBarModule,
    MatInputModule,
    MatSelectModule,
    MaterialModule,
    DatePipe
  ]
})
export class OfferListComponent implements OnInit {
  offers: Offer[] = [];
  displayedColumns: string[] = ['name', 'offerType', 'endDate','discount', 'actions']; 
  dataSource: MatTableDataSource<Offer> = new MatTableDataSource<Offer>();
  filteredDataSource: MatTableDataSource<Offer> = new MatTableDataSource<Offer>(); 
  searchText: string = ''; 

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private offerService: OfferService, public router: Router) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    console.log('Calling offerService.getAllOffers()');
    this.offerService.getAllOffers().subscribe({
      next: (data) => {
        this.offers = data;
        this.dataSource.data = this.offers; 
        this.filteredDataSource.data = this.offers; 
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Failed to load offers', err);
      }
    });
  }

  deleteOffer(id: number): void {
    this.offerService.deleteOffer(id).subscribe({
      next: () => {
        this.loadOffers(); 
      },
      error: (err) => {
        console.error('Failed to delete offer', err);
      }
    });
  }

  applyFilter(): void {
    this.filteredDataSource.filter = this.searchText.trim().toLowerCase();
  }

  exportToExcel(): void {
    const dataWithoutPassword = this.offers.map(offer => {
      const { ...offerWithoutPassword } = offer;
      return offerWithoutPassword;
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
    XLSX.utils.book_append_sheet(wb, ws, 'Offers');
  
    XLSX.writeFile(wb, 'Offers.xlsx');
  }
}
