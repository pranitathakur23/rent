declare var bootstrap: any;
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RentService } from '../rent.service';
import { RentListComponent } from '../rent-list/rent-list.component';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Component, Inject, PLATFORM_ID,OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-create-rent', 
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule], // Ensure CommonModule is here
  templateUrl: './create-rent.component.html',
  styleUrls: ['./create-rent.component.css']
})



  export class CreateRentComponent implements OnInit {


  constructor(private sanitizer: DomSanitizer, private http: HttpClient, private router: Router,private rentservice:RentService,  private route: ActivatedRoute) { }  
 
  banks: { BankCode: number; BankName: string }[] = [];
  states: { stateCode: number; stateName: string }[] = [];
  areas: { areaCode: number; areaName: string }[] = [];
  branches: { branchCode: number; branchName: string }[] = []; // Adjusted to number for branchCode
  showCreateRentAgreement = true;
  showRentDetails = false;
  closeBranch = false;
  fileName: string = '';
  rentData: any[] = []; // Initialize rentData as an empty array
  ID :number=0;
  file: File | null = null;
  fromDate: string | undefined; 
  toDate: string | undefined;  
  isButtonVisible = false;
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
    this.loadInitialData();
    const id = this.route.snapshot.paramMap.get('id'); // Retrieve the ID from the route
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

  /** Load initial data for banks and states */
  loadInitialData(): void {
    this.fetchBankData();
    this.fetchStates();
  }

 /** Handle dropdown change event to log selected value */
 onDropdownChange(fieldName: string, selectedValue: string): void {
  console.log(`${fieldName} selected:`, selectedValue);
}

onCreate(): void {
    const requestData = {
    bank: Number(this.formFields['bank']),
    State: Number(this.formFields['state']),
    area: Number(this.formFields['district']),
    Branch: Number(this.formFields['branch']),
    landLordName: this.formFields['landlordName'],
    landLordEmail: this.formFields['landlordEmail'],
    landLordMobileNo: this.formFields['landlordMobile'],
    landLordAccNo: this.formFields['accountNo'],
    depositeAmnt: this.formFields['depositAmount'],
    depositeAmntRefernceid: this.formFields['utrReferenceNo'],
    depositeDate: this.formFields['depositDate'],
    remark: this.formFields['remark'],
    LandLordIFSC: this.formFields['ifscCode'],
    filepath: 's3bucket',
    makerid: 'AB203'
  };

  // this.http.post('/api/RentAgreeMent/SaveRentData', requestData)
  //   .subscribe(
  //     (response: any) => {
  //       if (response.status) {
  //         console.log('API call successful:', response);
  //         this.rentservice.triggerRefresh(); // Trigger refresh here
  //         this.router.navigate(['/layout/rent-list']);
  //         this.isButtonVisible = true;
  //       } else {
  //         console.error('API call failed:', response.message);
  //       }
  //     },
  //     error => {
  //       console.error('Error making API call:', error);
  //     }
  //   );
}

  /** Fetch bank data from the API */
  fetchBankData(): void {
    this.http.post('/api/RentAgreeMent/GetDropDownData', { Mode: 1 })
      .subscribe((response: any) => {
        if (response.status) {
          this.banks = response.data;
        } else {
          console.error('Failed to fetch bank data:', response.message);
        }
      }, error => {
        console.error('Error fetching bank data:', error);
      });
  }

  /** Fetch states from the API */
  fetchStates(): void {
    this.http.post('/api/RentAgreeMent/GetDropDownData', { Mode: 2 })
      .subscribe((response: any) => {
        if (response.status) {
          this.states = response.data;
        } else {
          console.error('Failed to fetch states:', response.message);
        }
      }, error => {
        console.error('Error fetching states:', error);
      });
  }

  /** Handle state change event to fetch areas */
  onStateChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      const stateCode = Number(selectElement.value);
      this.fetchAreas(stateCode); // Fetch areas based on the selected state code
    }
  }

  /** Fetch areas based on selected state code */
  fetchAreas(stateCode: number): void {
    this.http.post('/api/RentAgreeMent/GetDropDownData', { Mode: 3, ID: stateCode })
      .subscribe((response: any) => {
        if (response.status) {
          this.areas = response.data;
        } else {
          console.error('Failed to fetch areas:', response.message);
        }
      }, error => {
        console.error('Error fetching areas:', error);
      });
  }

/** Fetch branches from the API */
  fetchBranches(areaCode: number): void {
  this.http.post('/api/RentAgreeMent/GetDropDownData', { Mode: 4, ID: areaCode }) // Use areaCode instead of hardcoded value
    .subscribe((response: any) => {
      if (response.status) {
        this.branches = response.data; // Store the branch data
      } else {
        console.error('Failed to fetch branches:', response.message);
      }
    }, error => {
      console.error('Error fetching branches:', error);
    });
  }
 /** Handle area change event to fetch branches */
  onAreaChange(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  if (selectElement) {
    const areaCode = Number(selectElement.value);
    this.fetchBranches(areaCode); // Fetch branches based on the selected area code
  }
  }
  /** Navigate to create rent page */
  onAdd(): void {
    this.router.navigate(['/layout/create-rent']);
  }

  /** Cancel the rent details view */
  cancelRentDetails(): void {
    this.showRentDetails = false;
  }

  /** Handle file selection */

  onFileChange(event: any): void {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.file = selectedFile;
      this.fileName = selectedFile.name;
    }
  }

  /** Upload file and log the filename */
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

  onAttach(): void {
    console.log('Attach button clicked');
  }
  /** Close the branch dropdown */
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

  closeBranchs(): void {
    this.closeBranch = true;
  }

  onUpdate(rentDetail: any): void {
    console.log('Edit Rent Detail:', rentDetail);
  }

  onAddRentDetails(): void {
    this.showRentDetails = true;
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