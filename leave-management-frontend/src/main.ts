import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/components/login/login.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { LeaveFormComponent } from './app/components/leave-form/leave-form.component';
import { LeaveListComponent } from './app/components/leave-list/leave-list.component';
import { CompanyListComponent } from './app/components/company-list/company-list.component';
import { DepartmentListComponent } from './app/components/department-list/department-list.component';
import { EmployeeListComponent } from './app/components/employee-list/employee-list.component';
import { LeaveTypeListComponent } from './app/components/leave-type-list/leave-type-list.component';
import { AuthGuard } from './app/guards/auth.guard';

const routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'apply-leave', component: LeaveFormComponent, canActivate: [AuthGuard] },
  { path: 'my-leaves', component: LeaveListComponent, canActivate: [AuthGuard] },
  { path: 'manage-leaves', component: LeaveListComponent, canActivate: [AuthGuard] },
  { path: 'companies', component: CompanyListComponent, canActivate: [AuthGuard] },
  { path: 'departments', component: DepartmentListComponent, canActivate: [AuthGuard] },
  { path: 'employees', component: EmployeeListComponent, canActivate: [AuthGuard] },
  { path: 'leave-types', component: LeaveTypeListComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(ReactiveFormsModule, FormsModule)
  ]
}).catch(err => console.error(err));