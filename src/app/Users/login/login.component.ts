import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [RouterModule]  // Add necessary imports here (e.g., CommonModule, ReactiveFormsModule)
})
export class LoginComponent {
  
  constructor(private router: Router) { }


  onLogin() {
    // Logic for login validation can be added here (e.g., checking user credentials)
    
    // Navigate to the layout page after successful login
    this.router.navigate(['/layout/dashboard']);
  }
 }
