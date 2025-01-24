import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { debug } from 'console';
@Component({
  selector: 'app-utr-upload',
  standalone: true,
  imports: [CommonModule], // Import CommonModule here
  templateUrl: './utr-upload.component.html',
  styleUrls: ['./utr-upload.component.css']
})
export class UtrUploadComponent {
  constructor(private http: HttpClient) {}
  fileName: string = '';
  totalItems: number = 100; // Example total items for pagination
  itemsPerPage: number = 10; // Number of items per page
  currentPage: number = 1; // Current page
  selectedFile: File | null = null; // To hold the selected file

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      const validFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!validFileTypes.includes(file.type)) {
        alert('Please select a valid Excel file (.xlsx or .xls).');
        input.value = ''; // Reset the input
        this.selectedFile = null;
        this.fileName = '';
        return;
      }

      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  // Uploads the selected file
  uploadFile(): void {
    if (!this.selectedFile) {
      alert('No file selected.');
      return;
    }
    const url = '/api/api/rent/Link';
    const formData = new FormData();
    formData.append('file', this.selectedFile); // Append the file to FormData

    this.http.post<any>(url, formData).subscribe(
      response => {
        if (response.status) {
          alert('File uploaded successfully.');
          this.fileName = '';
          this.selectedFile = null;
        } else {
          console.error('Failed to upload file:', response.message);
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error uploading file:', error.message);
      }
    );
  }

  
}
