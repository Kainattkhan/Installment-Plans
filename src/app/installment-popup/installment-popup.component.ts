import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface InstallmentDetail {
  installmentNumber: number;
  dueDate: string;
  amount: number;
}

@Component({
  selector: 'app-installment-popup',
  templateUrl: './installment-popup.component.html',
  styleUrls: ['./installment-popup.component.css']
})
export class InstallmentPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: InstallmentDetail) {}

}
