
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LeaveService, Leave } from '../../services/leave.service';
import { CompanyService, Company } from '../../services/company.service';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
    </div>

    <div class="row">
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-primary shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  Total Leaves
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{stats.totalLeaves}}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-calendar fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Approved Leaves
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{stats.approvedLeaves}}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-check fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-info shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                  Pending Leaves
                </div>
                <div class="row no-gutters align-items-center">
                  <div class="col-auto">
                    <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">{{stats.pendingLeaves}}</div>
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-clock fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4" *ngIf="authService.isAdmin()">
        <div class="card border-left-warning shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  Total Employees
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{stats.totalEmployees}}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-users fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6 mb-4">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Recent Leave Applications</h6>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-bordered" *ngIf="recentLeaves.length > 0; else noData">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let leave of recentLeaves">
                    <td>{{leave.TYPEOFLEAVE}}</td>
                    <td>{{leave.DATESTART | date}}</td>
                    <td>
                      <span [class]="getStatusClass(leave.LEAVESTATUS)">
                        {{leave.LEAVESTATUS}}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <ng-template #noData>
                <p class="text-center text-muted">No recent leave applications</p>
              </ng-template>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6 mb-4">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Quick Actions</h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-6 mb-3" *ngIf="authService.isEmployee()">
                <a routerLink="/apply-leave" class="btn btn-primary btn-block">
                  <i class="fas fa-plus"></i> Apply Leave
                </a>
              </div>
              <div class="col-6 mb-3">
                <a routerLink="/my-leaves" class="btn btn-info btn-block">
                  <i class="fas fa-list"></i> My Leaves
                </a>
              </div>
              <div class="col-6 mb-3" *ngIf="authService.isAdmin() || authService.isHR()">
                <a routerLink="/manage-leaves" class="btn btn-warning btn-block">
                  <i class="fas fa-tasks"></i> Manage Leaves
                </a>
              </div>
              <div class="col-6 mb-3" *ngIf="authService.isAdmin()">
                <a routerLink="/employees" class="btn btn-success btn-block">
                  <i class="fas fa-users"></i> Employees
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats = {
    totalLeaves: 0,
    approvedLeaves: 0,
    pendingLeaves: 0,
    totalEmployees: 0
  };
  recentLeaves: Leave[] = [];

  constructor(
    public authService: AuthService,
    private leaveService: LeaveService,
    private companyService: CompanyService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (this.authService.isEmployee()) {
      this.leaveService.getMyLeaves(user.EMPID).subscribe(leaves => {
        this.processLeaveStats(leaves);
        this.recentLeaves = leaves.slice(0, 5);
      });
    } else {
      this.leaveService.getLeaves().subscribe(leaves => {
        this.processLeaveStats(leaves);
        this.recentLeaves = leaves.slice(0, 5);
      });
    }

    if (this.authService.isAdmin()) {
      this.employeeService.getEmployees().subscribe(employees => {
        this.stats.totalEmployees = employees.length;
      });
    }
  }

  processLeaveStats(leaves: Leave[]) {
    this.stats.totalLeaves = leaves.length;
    this.stats.approvedLeaves = leaves.filter(l => l.LEAVESTATUS === 'APPROVED').length;
    this.stats.pendingLeaves = leaves.filter(l => l.LEAVESTATUS === 'PENDING').length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'badge badge-success';
      case 'PENDING': return 'badge badge-warning';
      case 'REJECTED': return 'badge badge-danger';
      default: return 'badge badge-secondary';
    }
  }
}
