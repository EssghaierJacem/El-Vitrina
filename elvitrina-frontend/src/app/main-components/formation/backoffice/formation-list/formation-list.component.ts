import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { jsPDF } from 'jspdf';  // Import jsPDF
import { Formation } from 'src/app/core/models/formation/formation.model';
import { FormationService } from 'src/app/core/services/formation/formationService';
@Component({
  selector: 'app-formation-list',
  imports : [ MatCardModule,
    MatFormFieldModule,
    RouterModule,
    MatCheckboxModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressSpinnerModule],
  templateUrl: './formation-list.component.html',
  styleUrls: ['./formation-list.component.scss']
})
export class FormationListComponent implements OnInit {
  displayedColumns: string[] = [
    'courseTitle',
    'formationCategory',
    'language',
    'duration',
    'certificateAvailable',
    'actions'
  ];
  dataSource = new MatTableDataSource<Formation>();
  searchText = '';
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formationService: FormationService , private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getFormations();
  }

  getFormations() {
    this.formationService.getAllFormations().subscribe({
      next: (formations) => {
        this.dataSource.data = formations;
        this.isLoading = false;
        console.error(formations);


      },
      error: (error) => {
        console.error('Error fetching formations', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  deleteFormation(id: number) {
    if (confirm('Are you sure you want to delete this formation?')) {
      this.formationService.deleteFormation(id).subscribe(() => {
        this.getFormations();
      this.snackBar.open('Formation successfully deleted', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success'] // optionnel pour custom style
      });
    });
  }
}

exportToPDF() {
  const doc = new jsPDF();

  // Titre du document
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('List of Formations', 14, 20);

  // Marges et positionnement de départ
  const marginTop = 30;
  let yPosition = marginTop;

  this.dataSource.data.forEach((formation, index) => {
    // Title of each formation
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Formation ${index + 1}: ${formation.courseTitle}`, 14, yPosition);
    yPosition += 10;

    // Drawing a line under the title
    doc.setLineWidth(0.5);
    doc.line(14, yPosition, 200, yPosition);
    yPosition += 10;

    // Adding the details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Category: ${formation.formationCategory}`, 14, yPosition);
    yPosition += 8;
    doc.text(`Language: ${formation.language}`, 14, yPosition);
    yPosition += 8;
    doc.text(`Duration: ${formation.duration}`, 14, yPosition);
    yPosition += 8;
    doc.text(`Certificate Available: ${formation.certificateAvailable ? 'Yes' : 'No'}`, 14, yPosition);
    yPosition += 12;

    // Adding a space between formations
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, yPosition, 200, yPosition);
    yPosition += 12;

    // Saut de page si nécessaire
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20; // Revenir à la position de départ
    }
  });

  // Sauvegarde du PDF
  doc.save('formations.pdf');
}
}
