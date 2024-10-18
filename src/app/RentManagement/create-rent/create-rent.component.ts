import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RentService } from '../rent.service';
import { RentListComponent } from '../rent-list/rent-list.component';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute

@Component({
  selector: 'app-create-rent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-rent.component.html',
  styleUrls: ['./create-rent.component.css']
})
export class CreateRentComponent implements OnInit {
  banks: { BankCode: number; BankName: string }[] = [];
  states: { stateCode: number; stateName: string }[] = [];
  areas: { areaCode: number; areaName: string }[] = [];
  branches: { branchCode: number; branchName: string }[] = []; // Adjusted to number for branchCode
  showCreateRentAgreement = true;
  showRentDetails = false;
  closeBranch = false;
  fileName: string = '';

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

  constructor(private router: Router, private http: HttpClient,private rentservice:RentService,  private route: ActivatedRoute // Inject ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
    const id = this.route.snapshot.paramMap.get('id'); // Retrieve the ID from the route
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

  this.http.post('/api/RentAgreeMent/SaveRentData', requestData)
    .subscribe(
      (response: any) => {
        if (response.status) {
          console.log('API call successful:', response);
          this.rentservice.triggerRefresh(); // Trigger refresh here
          this.router.navigate(['/layout/rent-list']);
        } else {
          console.error('API call failed:', response.message);
        }
      },
      error => {
        console.error('Error making API call:', error);
      }
    );
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
    const file = event.target.files[0];
    this.fileName = file ? file.name : '';
  }

  /** Upload file and log the filename */
  uploadFile(): void {
    console.log('File uploaded:', this.fileName);
  }

  /** Cancel the rent agreement creation and navigate to rent list */
  onCancel(): void {
    this.showCreateRentAgreement = false;
    this.router.navigate(['/layout/rent-list']);
  }

  /** Close the branch dropdown */
  closeBranchfun(): void {
    this.closeBranch = false;
  }

  /** Open the branch dropdown */
  closeBranchs(): void {
    this.closeBranch = true;
  }

  /** Handle attach button click */
  onAttach(): void {
    console.log('Attach button clicked');
  }

  /** Handle update rent detail */
 
  /** Handle update rent detail */
 

}
