declare var bootstrap: any;
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ensure this import is present
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-create-rent', 
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule], // Ensure CommonModule is here
  templateUrl: './create-rent.component.html',
  styleUrls: ['./create-rent.component.css']
})
export class CreateRentComponent {

  constructor(private sanitizer: DomSanitizer,private http: HttpClient,private router: Router) { }
  
  rentData: any[] = []; // Initialize rentData as an empty array
  ID :number=0;
   showCreateRentAgreement = true; // Flag for the create rent agreement form
  showRentDetails = false;
  closeBranch= false;
   fileName: string = '';
  file: File | null = null;
  fromDate: string | undefined; 
  toDate: string | undefined;  
  rentAmnt: string = '';
  errorMessage: string = '';
  fileURL: SafeResourceUrl | null = null;  // Use SafeResourceUrl type

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


 

 

  

  onAdd(): void {
    this.router.navigate(['/layout/create-rent']);
  }

  onCreate(): void {
    this.showRentDetails = true;
  }

  onFileChange(event: any): void {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.file = selectedFile;
      this.fileName = selectedFile.name;
    }
  }

  uploadFile(): void {
    console.log('File uploaded:', this.fileName);
  }

  removeFile(): void {
    this.file = null; 
    this.fileName = ''; 
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput !== null && fileInput.value !== '') {
      fileInput.value = ''; 
    }
  }

 
  previewFile(event: Event): void {
    event.preventDefault();
    if (this.file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Use sanitizer to create a safe resource URL
        const unsafeUrl = reader.result as string;
        this.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
        
        // Show modal
        const modalElement = document.getElementById('filePreviewModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      };
      reader.readAsDataURL(this.file);  // Read the file as a data URL (Base64)
    }
  }
  
  closeModal(): void {
    const modalElement = document.getElementById('filePreviewModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  onCancel(): void {
    this.showCreateRentAgreement = false;
    this.router.navigate(['/layout/rent-list']);

  }

  closeBranchfun(): void {
    this.closeBranch = false;
  }
  savebranchstatus(): void {
    const apiUrl = '/api/RentAgreeMent/UpdateBranchStatus';  // Note the relative path
    const body = { branch: 1 ,closingDate:'2024-10-18'};
    this.http.post<any>(apiUrl, body).subscribe(
      (response: any) => {
        if (response.status==true) {
          this.closeBranch = false;
               } else {
          console.error('Failed to fetch rent agreement list:', response.message);
        }
      }, error => {
        console.error('Error fetching rent agreement list:', error);
      });
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

  onAddRentDetails(): void {
    this.showRentDetails = true;
  }

  cancelRentDetails(): void {
    this.showRentDetails = false;
  }
  
  btnSaveRentPopupData(): void {
    this.errorMessage = ''; 
    const apiUrl = '/api/RentAgreeMent/SaveRentPopupData'; 
    const body = { rentID: 3, fromDate: this.fromDate, toDate: this.toDate, rentAmnt: this.rentAmnt };
    this.http.post<any>(apiUrl, body).subscribe(
      (response: any) => {
        console.log('Response:', response); 
        if (response.status === true) {
          this.router.navigate(['/layout/dashboard']);
        } else {
          this.errorMessage = response.message; 
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
        if (error.error) {
          console.error('Error body:', error.error);
        }
        this.errorMessage = 'An error occurred. Please try again.';
      }
    );
  }

}
