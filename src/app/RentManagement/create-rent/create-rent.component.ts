import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ensure this import is present
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-rent',
  standalone: true,
  imports: [CommonModule, FormsModule], // Ensure CommonModule is here
  templateUrl: './create-rent.component.html',
  styleUrls: ['./create-rent.component.css']
})
export class CreateRentComponent {
  constructor(private router: Router) { }

  showCreateRentAgreement = true; // Flag for the create rent agreement form
  showRentDetails = false;
  closeBranch= false;
  fileName: string = '';

  // Define form fields with default values
  formFields: { [key: string]: string } = {
    bank: '',
    state: '',
    district: '',
    branch: '',
    landlordName: '',
    landlordEmail: '',
    accountNo: '',
    confirmAccountNo: '',
    landlordMobile: '',
    ifscCode: '',
    depositAmount: '',
    utrReferenceNo: '',
    depositDate: '',
    remark: ''
  };

  onAdd(): void {
    this.router.navigate(['/layout/create-rent']);
  }

  onCreate(): void {
    this.showRentDetails = true;
  }
  cancelRentDetails(): void {
    this.showRentDetails = false;

  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.fileName = file ? file.name : '';
  }

  uploadFile(): void {
    console.log('File uploaded:', this.fileName);
  }

  onCancel(): void {
    this.showCreateRentAgreement = false;
    this.router.navigate(['/layout/rent-list']);

  }

  closeBranchfun(): void {
    this.closeBranch = false;
  }
  closeBranchs(): void{
    this.closeBranch = true;

  }
  onAttach(): void {
    console.log('Attach button clicked');
  }

  onUpdate(rentDetail: any): void {
    console.log('Edit Rent Detail:', rentDetail);
  }
}
