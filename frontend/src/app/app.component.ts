
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <!-- Navigation Bar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" *ngIf="currentUser">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Leave Management System</a>
          
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/leaves" routerLinkActive="active">My Leaves</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/apply-leave" routerLinkActive="active">Apply Leave</a>
              </li>
              <li class="nav-item" *ngIf="authService.isAdmin() || authService.isHR()">
                <a class="nav-link" routerLink="/employees" routerLinkActive="active">Employees</a>
              </li>
              <li class="nav-item" *ngIf="authService.isAdmin()">
                <a class="nav-link" routerLink="/companies" routerLinkActive="active">Companies</a>
              </li>
            </ul>
            
            <ul class="navbar-nav">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  {{currentUser?.EMPNAME}}
                </a>
                <ul class="dropdown-menu">
                  <li><span class="dropdown-item-text">{{currentUser?.EMPPOSITION}}</span></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" (click)="logout()">Logout</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content" [class.with-navbar]="currentUser">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .main-content {
      padding: 20px;
    }
    .main-content.with-navbar {
      margin-top: 56px;
      padding: 20px;
    }
    .app-container {
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
