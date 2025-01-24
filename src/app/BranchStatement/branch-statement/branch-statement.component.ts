import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule here
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-branch-statement',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './branch-statement.component.html',
  styleUrl: './branch-statement.component.css'
})
export class BranchStatementComponent {
  rentMasterOptions: { RentID: number; LandLordName: string }[] = [];
constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRentMasterOptions();
   
  }
  fetchRentMasterOptions(): void {
    const url = '/api/api/RentAgreeMent/GetDropDownData';
    const body = { Mode: 5 };
  
    this.http.post<any>(url, body).subscribe(
      response => {
        if (response.status == true) {
          this.rentMasterOptions = response.data;
          console.log('Fetched Rent Master Options:', this.rentMasterOptions);  // Log the fetched data
        } else {
          console.error('Failed to fetch rent master options');
        }
      },
      error => {
        console.error('Error fetching rent master options:', error);
      }
    );
  }
}
