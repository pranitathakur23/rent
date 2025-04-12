declare var bootstrap: any;
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RentService } from '../rent.service';
import { RentListComponent } from '../rent-list/rent-list.component';
import { ActivatedRoute } from '@angular/router';
import { Component, Inject, PLATFORM_ID, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface CustomFile {
  id?: number;
  name: string;
  url: string;
  file?: File;
}

@Component({
  selector: 'app-create-rent',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-rent.component.html',
  styleUrls: ['./create-rent.component.css']
})

export class CreateRentComponent implements OnInit {
  @ViewChild('dateInput', { static: false }) dateInput!: ElementRef;
  @ViewChild('fdate', { static: false }) fdate!: ElementRef;
  @ViewChild('tdate', { static: false }) tdate!: ElementRef;
  @ViewChild('bankField', { static: false }) bankField!: ElementRef;
  @ViewChild('stateField', { static: false }) stateField!: ElementRef;
  @ViewChild('areaField', { static: false }) areaField!: ElementRef;
  @ViewChild('branchField', { static: false }) branchField!: ElementRef;
  @ViewChild('landLoardNameField', { static: false }) landLoardNameField!: ElementRef;
  @ViewChild('landLordEmailField', { static: false }) landLordEmailField!: ElementRef;
  @ViewChild('accountNoField', { static: false }) accountNoField!: ElementRef;
  @ViewChild('cnfAccountNoField', { static: false }) cnfAccountNoField!: ElementRef;
  @ViewChild('landLoardMobileNoField', { static: false }) landLoardMobileNoField!: ElementRef;
  @ViewChild('ifscCodeField', { static: false }) ifscCodeField!: ElementRef;
  @ViewChild('depositeAmntField', { static: false }) depositeAmntField!: ElementRef;
  @ViewChild('utrNoField', { static: false }) utrNoField!: ElementRef;
  @ViewChild('datedeposite', { static: false }) datedeposite!: ElementRef;
  @ViewChild('remarkField', { static: false }) remarkField!: ElementRef;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient, private router: Router, private rentservice: RentService, private route: ActivatedRoute) { }
  banks: { BankCode: number; BankName: string }[] = [];
  states: { stateCode: number; stateName: string }[] = [];
  areas: { areaCode: number; areaName: string }[] = [];
  branches: { branchCode: number; branchName: string }[] = [];
  showCreateRentAgreement = true;
  showRentDetails = false;
  closeBranch: boolean = false;
  newFiles: File[] = [];
  fileName: string = '';
  rentData: any[] = [];
  ID: number = 0;
  file: File | null = null;
  fromDate: string | undefined;
  closingDate: string | undefined;
  toDate: string | undefined;
  isButtonVisible = false;
  isButtonVisibleAddrent = false;
  isButtonVisiblecreate = true;
  iscloseButton = false;
  totalRentAmount: string = '';
  rentAmnt: string = '';
  errorMessage: string = '';
  fileURL: SafeResourceUrl | null = null;
  rentpopupID: number = 0;
  files: File[] = [];
  fileNames: string[] = [];
  employeecode: string | undefined;
  rentid: number = 0;
  isUpdate: boolean = false;
  rentMasterData: any = {};
  status: string | undefined;
  isDisabled: boolean = false;
  filearray: CustomFile[] = [];
  showClosingDate: boolean = false;
  showRecoveryFields: boolean = false;
  showPendingFields: boolean = false;
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
    closingDate: ''
  };

  modelfields: any = {
    recoveryStatus: 0, 
    closingDate: null,
    closingDateAdditional: null,
    amountRecovered: null,
    transferReferenceNumber: null,
    remarks: null
  };

  ngOnInit(): void {
    this.rentid = Number(this.route.snapshot.paramMap.get('id'));
    if (this.rentid != 0) {
      this.isButtonVisible = true;
      this.isButtonVisiblecreate = false;
      this.getRentAgreementEditData();
      if (this.rentMasterData.makerid != this.employeecode) {
        this.isButtonVisibleAddrent = false;
      }
      else {
        this.isButtonVisibleAddrent = true;
      }
    }
    this.getRentAgreementPopupdataList();
    this.getRentAgrrementFilesList();
    this.loadInitialData();
    this.employeecode = sessionStorage.getItem('userName') || '';
    this.onRecoveryStatusChange();
  }

  checkFormFieldsState(): void {
    if (this.rentMasterData.makerid != this.employeecode) {
      if (this.rentMasterData.rentstatus == 'Pending') {
        this.bankField.nativeElement.disabled = true;
        this.stateField.nativeElement.disabled = true;
        this.areaField.nativeElement.disabled = true;
        this.branchField.nativeElement.disabled = true;
        this.landLordEmailField.nativeElement.disabled = true;
        this.landLoardMobileNoField.nativeElement.disabled = true;
        this.depositeAmntField.nativeElement.disabled = true;
        this.utrNoField.nativeElement.disabled = true;
        this.datedeposite.nativeElement.disabled = true;
        this.remarkField.nativeElement.disabled = true;
      } else {
        this.isDisabled = true;
      }
    } else {
      if (this.rentMasterData.rentstatus == 'Rejected') {
        this.isDisabled = false;
      } else if (this.rentMasterData.rentstatus == 'Completed') {
        this.bankField.nativeElement.disabled = true;
        this.stateField.nativeElement.disabled = true;
        this.areaField.nativeElement.disabled = true;
        this.branchField.nativeElement.disabled = true;
        this.landLoardNameField.nativeElement.disabled = true;
        this.landLordEmailField.nativeElement.disabled = true;
        this.accountNoField.nativeElement.disabled = true;
        this.cnfAccountNoField.nativeElement.disabled = true;
        this.landLoardMobileNoField.nativeElement.disabled = true;
        this.ifscCodeField.nativeElement.disabled = true;
        this.datedeposite.nativeElement.disabled = true;
        this.remarkField.nativeElement.disabled = true;
      } else {
        this.isDisabled = true;
      }
    }
  }

  getRentAgreementPopupdataList(): void {
    const apiUrl = '/api/api/rent/GetRentDetails';
    const body = { id: this.rentid };
    this.http.post<any>(apiUrl, body).subscribe(
      (response: any) => {
        if (response.status == true) {
          this.rentData = response.data;
        } else {
          console.error('Failed to fetch rent agreement list:', response.message);
        }
      }, error => {
        console.error('Error fetching rent agreement list:', error);
      });
  }

  getRentAgreementEditData(): void {
    const apiUrl = '/api/api/RentAgreeMent/GetRenatMasterDataID';
    const body = { id: this.rentid };
    this.http.post<any>(apiUrl, body).subscribe(
      (response: any) => {
        if (response.status == true) {
          this.rentMasterData = response.data[0];
          this.checkFormFieldsState();
          // if (this.rentMasterData.makerid != this.employeecode) {
          //   this.isButtonVisibleAddrent = false;
          // }
          // else {
          //   this.isButtonVisibleAddrent = true;
          // }
          this.isButtonVisibleAddrent = true;
          if (response.data[0].rentstatus == "Completed") {
            this.formFields['landlordName'] = response.data[0].landLordName;
            this.formFields['accountNo'] = response.data[0].landLordAccNo;
            this.formFields['confirmAccountNo'] = response.data[0].landLordAccNo;
            this.formFields['ifscCode'] = response.data[0].LandLordIFSC;
          }
          this.formFields['bank'] = response.data[0].bank;
          this.formFields['state'] = response.data[0].state;
          this.formFields['district'] = response.data[0].area;
          this.formFields['branch'] = response.data[0].branch;
          this.formFields['landlordEmail'] = response.data[0].landlordemail;
          this.formFields['landlordMobile'] = response.data[0].landLordMobileNo;
          this.formFields['depositAmount'] = response.data[0].depositeAmnt;
          this.formFields['utrReferenceNo'] = response.data[0].depositeAmntRefernceid;
          this.formFields['depositDate'] = response.data[0].depositeDate;
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
    if (!this.filearray || this.filearray.length == 0) {
      alert('Please upload a file');
      this.focusField('fileUpload');
      return;
    }
    const formData = new FormData();
    formData.append('rentMasterID', this.rentid.toString());
    for (let i = 0; i < this.filearray.length; i++) {
      const fileObj = this.filearray[i];
      if (fileObj.file) {
        formData.append('files', fileObj.file, fileObj.name);
      }
    }
    this.http.post('/api/api/rent/SaveRentAgreementFiles', formData)
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
    this.http.post('/api/api/RentAgreeMent/SaveRentData', requestData).subscribe(
      (response: any) => {
        if (response.status) {
          this.isButtonVisible = true;
          this.isButtonVisibleAddrent = true;
          this.isButtonVisiblecreate = false;
          this.rentid = response.data[0].id;
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
    if (this.newFiles.length > 0) {
      const formData = new FormData();
      formData.append('rentMasterID', this.rentid.toString());
      for (let i = 0; i < this.newFiles.length; i++) {
        formData.append('files', this.newFiles[i]);
      }
      this.http.post('/api/api/rent/SaveRentAgreementFiles', formData).subscribe(
        (response: any) => {
          if (response.status === true) {
            this.UpdateRentDetails();
            this.newFiles = [];
          } else {
            console.error('API call failed:', response.message);
          }
        },
        error => {
          console.error('Error making API call:', error);
        }
      );
    } else {
      this.UpdateRentDetails();
    }
  }

  UpdateRentDetails(): void {
    if (this.rentMasterData.makerid != this.employeecode) {
      if (!this.formFields['landlordName']) {
        alert('Please enter Landlord Name');
        this.focusField('landlordName');
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
      if (!this.formFields['ifscCode']) {
        alert('Please enter IFSC Code');
        this.focusField('ifscCode');
        return;
      }
      if (
        this.rentMasterData.landLordName == this.formFields['landlordName'] &&
        this.rentMasterData.landLordAccNo == this.formFields['accountNo'] &&
        this.rentMasterData.LandLordIFSC == this.formFields['ifscCode']
      ) {
        this.status = 'Completed';
      } else {
        this.status = 'Rejected';
      }
    } else {
      this.status = 'Pending';
      this.employeecode = '';
    }
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
      checkerid: this.employeecode,
      status: this.status
    };
    console.log('Request Data:', requestData);
    this.http.post('/api/api/rent/UpdateRentMasterDetailsForMaker', requestData).subscribe(
      (response: any) => {
        if (response.status) {
          this.isButtonVisible = true;
          this.isButtonVisiblecreate = false;
          this.files = [];
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
    this.http.post('/api/api/RentAgreeMent/GetDropDownData', { Mode: 1 })
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
    this.http.post('/api/api/RentAgreeMent/GetDropDownData', { Mode: 2 })
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
    this.http.post('/api/api/RentAgreeMent/GetDropDownData', { Mode: 3, ID: stateCode })
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
    this.http.post('/api/api/RentAgreeMent/GetDropDownData', { Mode: 4, ID: areaCode }) // Use areaCode instead of hardcoded value
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
    this.fileNames = [];
    this.files = [];
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        this.fileNames.push(selectedFiles[i].name);
        this.files.push(selectedFiles[i]);
      }
    }
  }

  getRentAgrrementFilesList(): void {
    const apiUrl = '/api/api/rent/getFileDetails';
    const body = { id: this.rentid };
    this.http.post<any>(apiUrl, body).subscribe(
      (response: any) => {
        if (response.status === true) {
          const apiFiles: CustomFile[] = response.data.map((file: any) => ({
            id: file.ID,
            name: file.filepath.split('/').pop(),
            url: file.filepath.replace(/\\/g, '/')
          }));

          this.filearray = [...this.filearray, ...apiFiles];
        } else {
          console.error('Failed to fetch rent agreement list:', response.message);
        }
      },
      error => {
        console.error('Error fetching rent agreement list:', error);
      }
    );
  }

  previewFile(index: number, event: Event): void {
    event.preventDefault();
    const file = this.filearray[index];
    if (file.url) {
      this.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(file.url);
    } else if (file.file) {
      const reader = new FileReader();
      reader.onload = () => {
        const unsafeUrl = reader.result as string;
        this.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
      };
      reader.readAsDataURL(file.file);
    }
    const modalElement = document.getElementById('filePreviewModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  removeFile(index: number): void {
    const file = this.filearray[index];
    if (file.id) {
      this.deleteFile(file.id);
    }
    this.filearray.splice(index, 1);
    if (this.filearray.length == 0) {
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput !== null && fileInput.value !== '') {
        fileInput.value = '';
      }
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

  deleteFile(id: number): void {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const apiUrl = '/api/api/rent/DeleteFilePath';
      const body = { deletedID: id };

      this.http.post<any>(apiUrl, body).subscribe(
        (response) => {
          if (response.status === true) {
            console.log('File deleted successfully');
          } else {
            console.error('Failed to delete rent file:', response.message);
          }
        },
        (error) => {
          console.error('Error deleting rent file:', error);
        }
      );
    }
  }

  onFileChangetabel(event: any): void {
    const selectedFiles: FileList = event.target.files;
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileURL = URL.createObjectURL(file); 
        this.newFiles.push(file); 
        this.filearray.push({
          name: file.name,
          url: fileURL, 
          file: file
        });
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

  

  closeBranchs(): void {
    this.closeBranch = true;
    this.formFields['closingDate'] = '';
  }

  onAddRentDetails(): void {
    this.isUpdate = false;
    this.formFields['fromDate'] = '';
    this.formFields['toDate'] = '';
    this.formFields['rentAmnt'] = '';
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
    const apiUrl = '/api/api/RentAgreeMent/SaveRentPopupData';
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
          this.getRentAgrrementFilesList();
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

  onRecoveryStatusChange() {
    const status = this.modelfields.recoveryStatus;
    if (status === 0) {
      this.modelfields.remarks = '';
      this.showRecoveryFields = true; 
      this.showPendingFields = false; 
    } else if (status === 1) {
      this.showRecoveryFields = false;
      this.showPendingFields = true;
    }

    this.showClosingDate = true;
  }

  saveBranchStatus() {
    const payload: any = {
      rentmasterid: this.rentid,
      IsAmntRecoverd: this.modelfields.recoveryStatus,  // 0 or 1
      closingDate: this.modelfields.closingDate || this.modelfields.closingDateAdditional,
    };
    if (this.modelfields.recoveryStatus === 0) {
      payload.Amntrecoverd = this.modelfields.amountRecovered;
      payload.TrfRefNo = this.modelfields.transferReferenceNumber;
      payload.remark='';
      payload.IsAmntRecoverd= true
    } else if (this.modelfields.recoveryStatus === 1) {
      payload.remark = this.modelfields.remarks;
      payload.IsAmntRecoverd= false
    }
    this.http.post('/api/api/RentAgreeMent/UpdateBranchStatus', payload).subscribe(
      (response: any) => {
        if (response.status) {
          this.router.navigate(['/layout/rent-list']);
        } else {
          console.error('Failed to update branch status:', response.message);
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

}