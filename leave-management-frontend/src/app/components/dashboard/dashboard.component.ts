
import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { LeaveService, Leave } from '../../services/leave.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="row">
      <div class="col-12">
        <h2>Welcome, {{currentUser?.EMPNAME}}!</h2>
        <p class="text-muted">{{currentUser?.EMPPOSITION}} - {{currentUser?.COMPANY}}</p>
      </div>
    </div>

    <div class="row mt-4">
      <!-- Employee Stats -->
      <div class="col-lg-3 col-md-6 mb-4" *ngIf="authService.isEmployee()">
        <div class="card bg-primary text-white h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <div class="text-white-50 small">Available Leave</div>
                <div class="text-lg">{{currentUser?.AVELEAVE || 0}} days</div>
              </div>
              <div><i class="fas fa-calendar-check fa-2x text-white-50"></i></div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card bg-warning text-white h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <div class="text-white-50 small">Pending Applications</div>
                <div class="text-lg">{{pendingLeaves.length}}</div>
              </div>
              <div><i class="fas fa-clock fa-2x text-white-50"></i></div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card bg-success text-white h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <div class="text-white-50 small">Approved Applications</div>
                <div class="text-lg">{{approvedLeaves.length}}</div>
              </div>
              <div><i class="fas fa-check fa-2x text-white-50"></i></div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card bg-danger text-white h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <div class="text-white-50 small">Rejected Applications</div>
                <div class="text-lg">{{rejectedLeaves.length}}</div>
              </div>
              <div><i class="fas fa-times fa-2x text-white-50"></i></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5>Quick Actions</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3 mb-2" *ngIf="authService.isEmployee()">
                <button class="btn btn-primary w-100" routerLink="/apply-leave">
                  <i class="fas fa-plus"></i> Apply for Leave
                </button>
              </div>
              <div class="col-md-3 mb-2">
                <button class="btn btn-info w-100" routerLink="/my-leaves">
                  <i class="fas fa-list"></i> View My Leaves
                </button>
              </div>
              <div class="col-md-3 mb-2" *ngIf="authService.isAdmin() || authService.isHR()">
                <button class="btn btn-warning w-100" routerLink="/manage-leaves">
                  <i class="fas fa-tasks"></i> Manage Leaves
                </button>
              </div>
              <div class="col-md-3 mb-2" *ngIf="authService.isAdmin()">
                <button class="btn btn-success w-100" routerLink="/employees">
                  <i class="fas fa-users"></i> Manage Employees
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Applications -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5>Recent Applications</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let leave of recentLeaves">
                    <td>{{leave.EMPNAME}}</td>
                    <td>{{leave.TYPEOFLEAVE}}</td>
                    <td>{{leave.DATESTART | date}}</td>
                    <td>{{leave.NODAYS}}</td>
                    <td>
                      <span class="badge" 
                            [class.bg-warning]="leave.LEAVESTATUS === 'PENDING'"
                            [class.bg-success]="leave.LEAVESTATUS === 'APPROVED'"
                            [class.bg-danger]="leave.LEAVESTATUS === 'REJECTED'">
                        {{leave.LEAVESTATUS}}
                      </span>
                    </td>
                    <td>{{leave.DATEPOSTED | date}}</td>
                  </tr>
                  <tr *ngIf="recentLeaves.length === 0">
                    <td colspan="6" class="text-center text-muted">No recent applications</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  pendingLeaves: Leave[] = [];
  approvedLeaves: Leave[] = [];
  rejectedLeaves: Leave[] = [];
  recentLeaves: Leave[] = [];

  constructor(
    public authService: AuthService,
    private leaveService: LeaveService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    if (this.authService.isEmployee()) {
      this.leaveService.getMyLeaves().subscribe(leaves => {
        this.categorizeLeaves(leaves);
        this.recentLeaves = leaves.slice(0, 5);
      });
    } else {
      this.leaveService.getAllLeaves().subscribe(leaves => {
        this.categorizeLeaves(leaves);
        this.recentLeaves = leaves.slice(0, 10);
      });
    }
  }

  private categorizeLeaves(leaves: Leave[]): void {
    this.pendingLeaves = leaves.filter(leave => leave.LEAVESTATUS === 'PENDING');
    this.approvedLeaves = leaves.filter(leave => leave.LEAVESTATUS === 'APPROVED');
    this.rejectedLeaves = leaves.filter(leave => leave.LEAVESTATUS === 'REJECTED');
  }
}
