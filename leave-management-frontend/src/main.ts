
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './app/components/login/login.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { LeaveFormComponent } from './app/components/leave-form/leave-form.component';
import { LeaveListComponent } from './app/components/leave-list/leave-list.component';
import { CompanyListComponent } from './app/components/company-list/company-list.component';
import { DepartmentListComponent } from './app/components/department-list/department-list.component';
import { EmployeeListComponent } from './app/components/employee-list/employee-list.component';
import { LeaveTypeListComponent } from './app/components/leave-type-list/leave-type-list.component';
import { AuthGuard } from './app/guards/auth.guard';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';

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
    importProvidersFrom(
      BrowserModule,
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      HttpClientModule,
      RouterModule.forRoot(routes)
    ),
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
}).catch(err => console.error(err));
