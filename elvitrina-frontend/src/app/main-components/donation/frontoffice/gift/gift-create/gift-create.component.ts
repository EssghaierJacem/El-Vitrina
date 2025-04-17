import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DonorReward } from 'src/app/core/models/donation/donor-reward.model';
import { CommonModule } from '@angular/common';
import { GiftRequestDTO } from 'src/app/core/models/donation/gift.model';

@Component({
  selector: 'app-gift-create',
  templateUrl: './gift-create.component.html',
  styleUrls: ['./gift-create.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GiftCreateComponent {
  gift: GiftRequestDTO;
  campaignEndDate: string;

  constructor(
    public dialogRef: MatDialogRef<GiftCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { gift: GiftRequestDTO;}
  ) {
    this.gift = data.gift;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}