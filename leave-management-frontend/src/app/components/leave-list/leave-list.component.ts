
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LeaveService, Leave } from '../../services/leave.service';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5>{{getPageTitle()}}</h5>
          <div>
            <button class="btn btn-outline-secondary me-2" (click)="filterStatus = ''" 
                    [class.active]="filterStatus === ''">All</button>
            <button class="btn btn-outline-warning me-2" (click)="filterStatus = 'PENDING'" 
                    [class.active]="filterStatus === 'PENDING'">Pending</button>
            <button class="btn btn-outline-success me-2" (click)="filterStatus = 'APPROVED'" 
                    [class.active]="filterStatus === 'APPROVED'">Approved</button>
            <button class="btn btn-outline-danger" (click)="filterStatus = 'REJECTED'" 
                    [class.active]="filterStatus === 'REJECTED'">Rejected</button>
            <button class="btn btn-primary ms-2" routerLink="/apply-leave" *ngIf="authService.isEmployee()">
              Apply Leave
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th *ngIf="!authService.isEmployee()">Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let leave of getFilteredLeaves()">
                  <td *ngIf="!authService.isEmployee()">{{leave.employee_name || leave.EMPLOYID}}</td>
                  <td>{{leave.TYPEOFLEAVE}}</td>
                  <td>{{leave.DATESTART | date}}</td>
                  <td>{{leave.DATEEND | date}}</td>
                  <td>{{leave.NODAYS}}</td>
                  <td>{{leave.REASON}}</td>
                  <td>
                    <span [class]="getStatusClass(leave.LEAVESTATUS)">
                      {{leave.LEAVESTATUS}}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group" *ngIf="canManageLeave(leave)">
                      <button class="btn btn-sm btn-success" 
                              (click)="updateLeaveStatus(leave.LEAVEID, 'APPROVED')"
                              *ngIf="leave.LEAVESTATUS === 'PENDING'">
                        Approve
                      </button>
                      <button class="btn btn-sm btn-danger" 
                              (click)="updateLeaveStatus(leave.LEAVEID, 'REJECTED')"
                              *ngIf="leave.LEAVESTATUS === 'PENDING'">
                        Reject
                      </button>
                    </div>
                    <small class="text-muted" *ngIf="leave.LEAVESTATUS !== 'PENDING'">
                      {{leave.ADMINREMARKS}}
                    </small>
                  </td>
                </tr>
                <tr *ngIf="getFilteredLeaves().length === 0">
                  <td [attr.colspan]="getColumnCount()" class="text-center text-muted py-4">
                    No leave applications found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LeaveListComponent implements OnInit {
  leaves: Leave[] = [];
  filterStatus = '';

  constructor(
    public authService: AuthService,
    private leaveService: LeaveService
  ) {}

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (this.authService.isEmployee()) {
      this.leaveService.getMyLeaves(user.EMPID).subscribe(leaves => {
        this.leaves = leaves;
      });
    } else {
      this.leaveService.getLeaves().subscribe(leaves => {
        this.leaves = leaves;
      });
    }
  }

  getFilteredLeaves(): Leave[] {
    if (!this.filterStatus) {
      return this.leaves;
    }
    return this.leaves.filter(leave => leave.LEAVESTATUS === this.filterStatus);
  }

  getPageTitle(): string {
    if (this.authService.isEmployee()) {
      return 'My Leave Applications';
    }
    return 'Manage Leave Applications';
  }

  getColumnCount(): number {
    return this.authService.isEmployee() ? 7 : 8;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'badge badge-success';
      case 'PENDING': return 'badge badge-warning';
      case 'REJECTED': return 'badge badge-danger';
      default: return 'badge badge-secondary';
    }
  }

  canManageLeave(leave: Leave): boolean {
    return (this.authService.isAdmin() || this.authService.isHR()) && leave.LEAVESTATUS === 'PENDING';
  }

  updateLeaveStatus(leaveId: number, status: string) {
    const remarks = status === 'APPROVED' ? 'Approved by management' : 'Rejected by management';
    
    this.leaveService.updateLeaveStatus(leaveId, status, remarks).subscribe({
      next: () => {
        this.loadLeaves();
      },
      error: (error) => {
        console.error('Error updating leave status:', error);
      }
    });
  }
}
