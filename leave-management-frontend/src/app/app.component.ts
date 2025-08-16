
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="d-flex h-100" *ngIf="authService.isAuthenticated()">
      <!-- Sidebar -->
      <nav class="navbar-nav bg-primary sidebar sidebar-dark accordion" id="accordionSidebar" style="min-width: 250px;">
        <div class="sidebar-brand d-flex align-items-center justify-content-center">
          <div class="sidebar-brand-text mx-3">Leave Management</div>
        </div>

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
      </nav>

      <!-- Content Wrapper -->
      <div id="content-wrapper" class="d-flex flex-column w-100">
        <!-- Topbar -->
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
          <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
            <i class="fa fa-bars"></i>
          </button>

          <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown no-arrow">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" 
                 data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{currentUser?.EMPNAME}}</span>
                <i class="fas fa-user-circle fa-fw"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                <a class="dropdown-item" href="#" routerLink="/profile">
                  <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                  Profile
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" (click)="logout()">
                  <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>

        <!-- Page Content -->
        <div id="content" class="container-fluid">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>

    <!-- Login page (no sidebar/topbar) -->
    <div *ngIf="!authService.isAuthenticated()">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .sidebar {
      min-height: 100vh;
    }
    .sidebar-brand {
      height: 4.375rem;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 800;
      padding: 1.5rem 1rem;
      text-align: center;
      letter-spacing: 0.05rem;
      z-index: 1;
    }
    .nav-link {
      display: block;
      padding: 1rem;
      color: rgba(255, 255, 255, 0.8) !important;
      text-decoration: none;
    }
    .nav-link:hover {
      color: #fff !important;
    }
    .nav-link.active {
      color: #fff !important;
      background-color: rgba(255, 255, 255, 0.1);
    }
    .sidebar-divider {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      margin: 0 1rem 1rem;
    }
    .sidebar-heading {
      font-size: 0.65rem;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.1rem;
      padding: 1.5rem 1rem 0.5rem;
    }
    .topbar {
      height: 4.375rem;
    }
    #content-wrapper {
      overflow-x: hidden;
    }
    #content {
      flex: 1 0 auto;
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Force logout even if API call fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      }
    });
  }
}
