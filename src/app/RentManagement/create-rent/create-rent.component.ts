declare var bootstrap: any;
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RentService } from '../rent.service';
import { RentListComponent } from '../rent-list/rent-list.component';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { Component, Inject, PLATFORM_ID,OnInit, ViewChild, ElementRef } from '@angular/core';
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
    @ViewChild('dateInput', { static: false }) dateInput!: ElementRef;
    @ViewChild('datedeposite', { static: false }) datedeposite!: ElementRef;
    @ViewChild('fdate', { static: false }) fdate!: ElementRef;
    @ViewChild('tdate', { static: false }) tdate!: ElementRef;
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
  closingDate: string | undefined;
  toDate: string | undefined;
  isButtonVisible = false;
  isButtonVisiblecreate = true;
  iscloseButton = false;
  totalRentAmount:string='';
  rentAmnt: string = '';
  errorMessage: string = '';
  fileURL: SafeResourceUrl | null = null;  // Use SafeResourceUrl type
  rentpopupID: number = 0;
  files: File[] = [];  // To hold the selected files
  fileNames: string[] = [];
  employeecode: string | undefined;
  rentid: number = 0;
  isUpdate: boolean = false;

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
    remark: '',
    closingDate:''
  };

   ngOnInit(): void { 
    this.rentid = Number(this.route.snapshot.paramMap.get('id'));
    if(this.rentid !=0){
      this.isButtonVisible = true;
      this.isButtonVisiblecreate = false;
      this.getRentAgreementEditData();
    }

    this.getRentAgreementPopupdataList(); // Fetch rent agreements on component initialization
    this.loadInitialData();
    this.employeecode = sessionStorage.getItem('userName') || ''; // Default to 'Guest' if not found
  }

  getRentAgreementPopupdataList(): void {
    const apiUrl = '/api/rent/GetRentDetails';  // Note the relative path
    const body = { id: this.rentid };
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

  getRentAgreementEditData(): void {
    const apiUrl = '/api/RentAgreeMent/GetRenatMasterDataID';  // Note the relative path
    const body = { id: this.rentid };
    this.http.post<any>(apiUrl, body).subscribe(
      (response: any) => {
        if (response.status==true) {
          this.formFields['bank'] = response.data[0].bank;
          this.formFields['state'] = response.data[0].state;
          this.formFields['district'] = response.data[0].area;
          this.formFields['branch'] = response.data[0].branch;
          this.formFields['landlordEmail'] = response.data[0].landlordemail;
          this.formFields['landlordMobile'] = response.data[0].landLordMobileNo;
          this.formFields['depositAmount'] = response.data[0].depositeAmnt;
          this.formFields['utrReferenceNo'] = response.data[0].depositeAmntRefernceid;
          this.formFields['depositDate']=   response.data[0].depositeDate;
          this.formFields['remark'] = response.data[0].remark;
          this.fetchAreas(response.data[0].state);
          this.fetchBranches(response.data[0].area);
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

 onDropdownChange(fieldName: string, selectedValue: string): void {
  console.log(`${fieldName} selected:`, selectedValue);
}

onCreate(): void {
    if (!this.formFields['bank']) {
      alert('Please select a Bank');
      this.focusField('bank');
      return;
    }
    if (!this.formFields['state']) {
      alert('Please select a State');
      this.focusField('state');
      return;
    }
    if (!this.formFields['district']) {
      alert('Please select a District');
      this.focusField('area');
      return;
    }
    if (!this.formFields['branch']) {
      alert('Please select a Branch');
      this.focusField('branch');
      return;
    }
    if (!this.formFields['landlordName']) {
      alert('Please enter Landlord Name');
      this.focusField('landlordName');
      return;
    }
    if (!this.formFields['landlordEmail']) {
      alert('Please enter Landlord Email');
      this.focusField('landlordEmail');
      return;
    }
    if (!this.formFields['accountNo']) {
      alert('Please enter Landlord Account No');
      this.focusField('accountNo');
      return;
    }
    if (!this.formFields['confirmAccountNo']) {
      alert('Please enter Confirm Account No');
      this.focusField('confirmAccountNo');
      return;
    }
    if (this.formFields['accountNo'] !== this.formFields['confirmAccountNo']) {
      alert('Landlord Account No and Confirm Account No do not match');
      this.focusField('accountNo');
      return;
    }
    if (!this.formFields['landlordMobile']) {
      alert('Please enter Landlord Mobile No');
      this.focusField('landlordMobile');
      return;
    }
    if (!this.formFields['ifscCode']) {
      alert('Please enter IFSC Code');
      this.focusField('ifscCode');
      return;
    }
    if (!this.formFields['depositAmount']) {
      alert('Please enter Deposit Amount');
      this.focusField('depositAmount');
      return;
    }
    if (!this.formFields['utrReferenceNo']) {
      alert('Please enter Deposit Amt UTR Reference No');
      this.focusField('utrReferenceNo');
      return;
    }
    if (!this.formFields['depositDate']) {
      alert('Please select Deposit Date');
      this.datedeposite.nativeElement.focus();
      return;
    }
    if (!this.formFields['filepath']) {
      alert('Please upload a file');
      this.focusField('fileUpload');
      return;
    }
    const formData = new FormData();
    formData.append('rentMasterID', this.rentid.toString());
    for (let i = 0; i < this.files.length; i++) {
      formData.append('files', this.files[i]);
    }
    debugger
    this.http.post('/api/rent/SaveRentAgreementFiles', formData)
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            this.SaveRentDetails();
          } else {
            console.error('API call failed:', response.message);
          }
        },
        error => {
          console.error('Error making API call:', error);
        }
      );
  }

SaveRentDetails(): void {
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
    makerid: this.employeecode,
    };
    console.log('Request Data:', requestData);
    this.http.post('/api/RentAgreeMent/SaveRentData', requestData).subscribe(
      (response: any) => {
        if (response.status) {
          this.isButtonVisible = true;
          this.isButtonVisiblecreate = false;
          this.rentid=response.data[0].id;
          this.showRentDetails = true;
          this.files = [];
        } else {
          console.error('API call failed:', response.message);
        }
      },
      error => {
        console.error('Error making API call:', error);
      }
    );
  }

  onUpdate(): void {
    const formData = new FormData();
    formData.append('rentMasterID', this.rentid.toString());
    for (let i = 0; i < this.files.length; i++) {
      formData.append('files', this.files[i]);
    }
    this.http.post('/api/rent/SaveRentAgreementFiles', formData)
      .subscribe(
        (response: any) => {
          if (response.status == true) {
            this.UpdateRentDetails();
          } else {
            console.error('API call failed:', response.message);
          }
        },
        error => {
          console.error('Error making API call:', error);
        }
      );
  }

  UpdateRentDetails(): void {
    const requestData = {
      id: this.rentid,
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
      makerid: this.employeecode,
    };
    console.log('Request Data:', requestData);
    this.http.post('/api/rent/UpdateRentMasterDetailsForMaker', requestData).subscribe(
      (response: any) => {
        if (response.status) {
          this.isButtonVisible = true;
          this.isButtonVisiblecreate = false;
          this.showRentDetails = true;
          this.files = []; 
        } else {
          console.error('API call failed:', response.message);
        }
      },
      error => {
        console.error('Error making API call:', error);
      }
    );
  }

  focusField(fieldId: string): void {
    setTimeout(() => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.focus();
      }
    }, 0);
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
    // Clear previous selections
    this.fileNames = [];
    this.files = [];
  
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      // Store file names and file objects for further processing
      for (let i = 0; i < selectedFiles.length; i++) {
        this.fileNames.push(selectedFiles[i].name);
        this.files.push(selectedFiles[i]);
      }
    }
  }

  /** Upload file and log the filename */
  uploadFile(): void {
    console.log('File uploaded:', this.fileName);
  }

  removeFile(index: number): void {
    // Remove the file and the name from the arrays
    this.fileNames.splice(index, 1);
    this.files.splice(index, 1);
  
    // Check if there are no more files remaining
    if (this.fileNames.length == 0) {
      // Reset the file input only when no files are left
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput !== null && fileInput.value !== '') {
        fileInput.value = '';
      }
    }
  }
  
  previewFile(index: number, event: Event): void {
    event.preventDefault();
    const file = this.files[index];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const unsafeUrl = reader.result as string;
        this.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
        // Show modal
        const modalElement = document.getElementById('filePreviewModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      };
      reader.readAsDataURL(file);  // Read the selected file
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

  closeBranchfun(): void {
    this.closeBranch = false;
  }

  savebranchstatus(): void {
    if (!this.formFields['closingDate']) {
      alert('Please select a closingDate');
      this.dateInput.nativeElement.focus();
      return;
    }
    if (!this.formFields['branch']) {
      alert('Please select a Branch');
      this.focusField('branch');
      return;
    }
    const Test = {
      Branch: Number(this.formFields['branch']),
      closingDate: this.formFields['closingDate']
    };
    const apiUrl = '/api/RentAgreeMent/UpdateBranchStatus';  // Note the relative path
    this.http.post<any>(apiUrl, Test).subscribe(
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
    this.formFields['closingDate'] = '';

  }

  onAddRentDetails(): void {
    this.isUpdate = false;
    this.formFields['fromDate'] = '';
    this.formFields['toDate']='';
    this.formFields['rentAmnt']='';
    this.showRentDetails = true;
  }

  onUpdateRentDetails(item: any): void {
    this.showRentDetails = true;
    this.isUpdate = true;
    const formatDate = (dateString: string) => {
      const [day, month, year] = dateString.split('.');
      return `${year}-${month}-${day}`;
    };
    this.formFields['fromDate'] = formatDate(item.FromDate);
    this.formFields['toDate'] = formatDate(item.ToDate);
    this.formFields['rentAmnt'] = item.rentAmnt;
    this.rentpopupID = item.id;
  }

  btnSaveRentPopupData(): void {
    if (!this.formFields['fromDate']) {
      alert('Please select a fromDate');
      this.fdate.nativeElement.focus();
      return;
    }
    if (!this.formFields['toDate']) {
      alert('Please select a toDate');
      this.tdate.nativeElement.focus();
      return;
    }
    if (!this.formFields['rentAmnt']) {
      alert('Please select a totalRentAmount');
      this.focusField('rentAmnt');
      return;
    }
    const apiUrl = '/api/RentAgreeMent/SaveRentPopupData';
    const body = {
      rentID: this.rentid,
      rentpopupID: this.isUpdate ? this.rentpopupID : 0,
      fromDate: this.formFields['fromDate'],
      toDate: this.formFields['toDate'],
      rentAmnt: this.formFields['rentAmnt']
    };
    this.http.post<any>(apiUrl, body).subscribe(
      (response: any) => {
        if (response.status === true) {
          this.showRentDetails = false;
          this.getRentAgreementPopupdataList();
        } else {
          this.errorMessage = response.message;
        }
      },
      (error: any) => {
        console.error('Error:', error);
        this.errorMessage = 'An error occurred. Please try again.';
      }
    );
  }

}