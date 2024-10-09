import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes'; // Import your routes
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // Required for common directives

@NgModule({
  imports: [
    CommonModule, // Import CommonModule first for common directives and pipes
    FormsModule,  // Import FormsModule for using ngModel and forms-related directives
    RouterModule.forRoot(routes) // Configure the RouterModule with your routes
  ],
  providers: [],
  // Note: No declarations here, since you're using standalone components
})
export class AppModule {}
