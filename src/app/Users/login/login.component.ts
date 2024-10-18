import { Component, ElementRef, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
})
export class LoginComponent implements OnInit {
  employeeCode: string = '';
  password: string = '';
  captchaCode: string = '';  // Changed to public for template binding
  errorMessage: string = ''; // For displaying error messages
  typingTimeout: any;

  @ViewChild('employeeCodeInput') employeeCodeInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('captchaCodeInput') captchaCodeInput!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.createCaptcha();
  }

  createCaptcha(): void {
    if (isPlatformBrowser(this.platformId)) {
          // Clear the contents of the captcha div first
    document.getElementById('captcha')!.innerHTML = '';

    const charsArray = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ@@#$';
    const lengthOtp = 5; // Ensuring CAPTCHA length is 5
    const captcha = [];

    while (captcha.length < lengthOtp) {
      const index = Math.floor(Math.random() * charsArray.length); // Get the next character from the array
      if (captcha.indexOf(charsArray[index]) === -1) {
        captcha.push(charsArray[index]);
      }
    }

    const canv = document.createElement('canvas');
    canv.id = 'captcha';
    canv.width = 100;
    canv.height = 50;
    const ctx = canv.getContext('2d');
    if (ctx) {
      ctx.font = '25px Georgia';
      ctx.strokeText(captcha.join(''), 0, 30);
    }
    this.captchaCode = captcha.join('');
    document.getElementById('captcha')!.appendChild(canv);
  }
  }

  validateCaptcha(): boolean {
    const enteredCaptcha = (document.getElementById('captchaCode') as HTMLInputElement).value; // Update here
    return enteredCaptcha === this.captchaCode;
  }
  onLogin(): void {
    this.errorMessage = ''; // Clear previous error message

    const x = this.employeeCode;
    if (x === '') {
      alert('Enter Employee Code');
      this.employeeCodeInput.nativeElement.focus();
      return;
    }

    const y = this.password;
    if (y === '') {
      alert('Enter Password');
      this.passwordInput.nativeElement.focus();
      return;
    }

    const enteredCaptcha = (document.getElementById('captchaCode') as HTMLInputElement).value; // Updated ID
    if (enteredCaptcha == '') {
      alert('Please enter CAPTCHA');
      this.captchaCodeInput.nativeElement.focus();
      return; // Stop execution
    }

    if (!this.validateCaptcha()) {
      alert('Invalid CAPTCHA. Please try again.');
      (document.getElementById('captchaCode') as HTMLInputElement).value = ""; // Updated ID
      this.captchaCodeInput.nativeElement.focus();
      this.createCaptcha(); // Regenerate CAPTCHA for user to try again
      return; // Stop execution
    }
    const apiUrl = '/api/users/UserLogin';  // Note the relative path
    const body = { EmployeeCode: this.employeeCode, Password: this.password };
    this.http.post<any>(apiUrl, body).subscribe(
      (response: any) => {
        console.log('Response:', response); // Log the complete response
        if (response.status === true) {
          const userName = response.data[0].userName;
          sessionStorage.setItem('userName', userName); // Store userName in sessionStorage
          this.router.navigate(['/layout/dashboard']);
        } else {
          this.errorMessage = response.message; // Set error message for incorrect username/password
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
        if (error.error) {
          console.error('Error body:', error.error); // Log the error body
        }
        this.errorMessage = 'An error occurred during login. Please try again.'; // Handle error
      }
    );
  }
}
