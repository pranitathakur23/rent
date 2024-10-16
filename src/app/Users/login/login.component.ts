import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [RouterModule]  // Add necessary imports here (e.g., CommonModule, ReactiveFormsModule)
})
export class LoginComponent implements OnInit {
  private captchaCode: string = '';

  constructor(private router: Router,@Inject(PLATFORM_ID) private platformId: object) { }

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
  onLogin() {
    // Logic for login validation can be added here (e.g., checking user credentials)
    
    // Navigate to the layout page after successful login
    this.router.navigate(['/layout/dashboard']);
  }
 }
