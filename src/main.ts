import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';  // Use your custom routing

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  // Provide HttpClient globally
    provideRouter(routes),  // Use your routes from app.routes.ts
  ],
}).catch(err => console.error(err));
