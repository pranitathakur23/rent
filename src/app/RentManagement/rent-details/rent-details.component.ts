import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rent-details',
  templateUrl: './rent-details.component.html',
  styleUrls: ['./rent-details.component.css']
})
export class RentDetailsComponent {
  constructor(private router: Router) {}

  onSubmit() {
    // Perform any validation or processing here if needed

    // Navigate to the desired route
    this.router.navigate(['/layout/create-rent']);
  }


  onCancel() {
    // Navigate to /layout/create-rent when the Cancel button is clicked
    this.router.navigate(['/layout/create-rent']);
  }
}
