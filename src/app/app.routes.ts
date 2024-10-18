import { Routes } from '@angular/router';
import { LoginComponent } from './Users/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { RentListComponent } from './RentManagement/rent-list/rent-list.component';
import { UtrUploadComponent } from './UTR/utr-upload/utr-upload.component';
import { CreateRentComponent } from './RentManagement/create-rent/create-rent.component';
import { RentDetailsComponent } from './RentManagement/rent-details/rent-details.component';
import { MonthlyRentReportComponent } from './MonthlyRentReport/monthly-rent-report/monthly-rent-report.component';
import { BranchActionsComponent } from './RentOptions/branch-actions/branch-actions.component';
import { BranchStatementComponent } from './BranchStatement/branch-statement/branch-statement.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'layout/create-rent/:id', // Accepts an ID
    component: CreateRentComponent 
  },
  // Layout route with child dashboard
  {
    path: 'layout',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'rent-list', component: RentListComponent },
      { path: 'utr-upload', component: UtrUploadComponent },
      { path: 'create-rent', component: CreateRentComponent },
      { path: 'rent-details', component: RentDetailsComponent },
      { path: 'monthly-rent-report', component: MonthlyRentReportComponent },
      { path: 'branch-actions', component: BranchActionsComponent },
      { path: 'branch-statement', component: BranchStatementComponent }
    ]
  },
  // Redirect default route to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Redirect unknown routes to login
  { path: '**', redirectTo: '/login' }
];

