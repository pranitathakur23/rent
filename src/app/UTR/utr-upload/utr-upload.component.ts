import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-utr-upload',
  standalone: true,
  imports: [CommonModule], // Import CommonModule here
  templateUrl: './utr-upload.component.html',
  styleUrls: ['./utr-upload.component.css']
})
export class UtrUploadComponent {
  fileName: string = '';
  totalItems: number = 100; // Example total items for pagination
  itemsPerPage: number = 10; // Number of items per page
  currentPage: number = 1; // Current page

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.fileName = file ? file.name : '';
  }

  uploadFile(): void {
    // Your upload logic here
    console.log('File uploaded:', this.fileName);
  }

  
}
