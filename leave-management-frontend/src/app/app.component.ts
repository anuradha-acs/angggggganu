
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div id="wrapper" *ngIf="authService.isLoggedIn(); else loginView">
      <!-- Sidebar -->
      <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
          <div class="sidebar-brand-icon rotate-n-15">
            <i class="fas fa-calendar"></i>
          </div>
          <div class="sidebar-brand-text mx-3">Leave Manager</div>
        </a>

        <hr class="sidebar-divider my-0">

        <li class="nav-item">
          <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
            <i class="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </a>
        </li>

        <hr class="sidebar-divider">

        <div class="sidebar-heading">Leave Management</div>

        <li class="nav-item" *ngIf="authService.isEmployee()">
          <a class="nav-link" routerLink="/apply-leave" routerLinkActive="active">
            <i class="fas fa-fw fa-plus"></i>
            <span>Apply Leave</span>
          </a>
        </li>

        <li class="nav-item">
          <a class="nav-link" routerLink="/my-leaves" routerLinkActive="active">
            <i class="fas fa-fw fa-list"></i>
            <span>My Leaves</span>
          </a>
        </li>

        <li class="nav-item" *ngIf="authService.isAdmin() || authService.isHR()">
          <a class="nav-link" routerLink="/manage-leaves" routerLinkActive="active">
            <i class="fas fa-fw fa-tasks"></i>
            <span>Manage Leaves</span>
          </a>
        </li>

        <hr class="sidebar-divider" *ngIf="authService.isAdmin()">

        <div class="sidebar-heading" *ngIf="authService.isAdmin()">Administration</div>

        <li class="nav-item" *ngIf="authService.isAdmin()">
          <a class="nav-link" routerLink="/employees" routerLinkActive="active">
            <i class="fas fa-fw fa-users"></i>
            <span>Employees</span>
          </a>
        </li>

        <li class="nav-item" *ngIf="authService.isAdmin()">
          <a class="nav-link" routerLink="/companies" routerLinkActive="active">
            <i class="fas fa-fw fa-building"></i>
            <span>Companies</span>
          </a>
        </li>

        <li class="nav-item" *ngIf="authService.isAdmin()">
          <a class="nav-link" routerLink="/departments" routerLinkActive="active">
            <i class="fas fa-fw fa-sitemap"></i>
            <span>Departments</span>
          </a>
        </li>

        <li class="nav-item" *ngIf="authService.isAdmin()">
          <a class="nav-link" routerLink="/leave-types" routerLinkActive="active">
            <i class="fas fa-fw fa-calendar-alt"></i>
            <span>Leave Types</span>
          </a>
        </li>

        <hr class="sidebar-divider d-none d-md-block">

        <div class="text-center d-none d-md-inline">
          <button class="rounded-circle border-0" id="sidebarToggle"></button>
        </div>
      </ul>

      <!-- Content Wrapper -->
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <!-- Topbar -->
          <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
              <i class="fa fa-bars"></i>
            </button>

            <ul class="navbar-nav ml-auto">
              <div class="topbar-divider d-none d-sm-block"></div>
              <li class="nav-item dropdown no-arrow">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" 
                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{authService.getCurrentUser()?.username}}</span>
                  <img class="img-profile rounded-circle" src="https://via.placeholder.com/60x60">
                </a>
                <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                  <a class="dropdown-item" href="#" (click)="logout()">
                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Logout
                  </a>
                </div>
              </li>
            </ul>
          </nav>

          <!-- Page Content -->
          <div class="container-fluid">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loginView>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    .sidebar {
      width: 14rem;
    }
    .img-profile {
      height: 2rem;
      width: 2rem;
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
