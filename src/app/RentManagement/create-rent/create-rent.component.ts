import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ensure this import is present
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-rent',
  standalone: true,
  imports: [CommonModule, FormsModule], // Ensure CommonModule is here
  templateUrl: './create-rent.component.html',
  styleUrls: ['./create-rent.component.css']
})
export class CreateRentComponent {
  constructor(private router: Router,private http: HttpClient) { }
  rentData: any[] = []; // Initialize rentData as an empty array
  ID :number=0;
  // Define form fields (unchanged)
 
  ngOnInit(): void { 
    this.getRentAgreementPopupdataList(); // Fetch rent agreements on component initialization
  }
   
  getRentAgreementPopupdataList(): void {
    const apiUrl = '/api/rent/GetRentDetails';  // Note the relative path
    const body = { id: 1 };
    this.http.post<any>(apiUrl, body).subscribe(
      (response: any) => {
        if (response.status==true) {
          this.rentData = response.data;
               } else {
          console.error('Failed to fetch rent agreement list:', response.message);
        }
      }, error => {
        console.error('Error fetching rent agreement list:', error);
      });
  }

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
