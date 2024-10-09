import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']  // Fix typo: styleUrl to styleUrls
})
export class HeaderComponent {
  constructor(private router: Router) { }

  logout() {
    // Clear session storage
    sessionStorage.clear();

    // Navigate to the login page
    this.router.navigate(['/login']);
  }
}
