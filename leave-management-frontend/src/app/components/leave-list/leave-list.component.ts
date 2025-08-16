
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveService, Leave } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leave-list',
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
                  <th>Remarks</th>
                  <th *ngIf="canManageLeaves()">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let leave of getFilteredLeaves()">
                  <td *ngIf="!authService.isEmployee()">{{ leave.EMPNAME }}</td>
                  <td>{{ leave.TYPEOFLEAVE }}</td>
                  <td>{{ leave.DATESTART | date }}</td>
                  <td>{{ leave.DATEEND | date }}</td>
                  <td>{{ leave.NODAYS }}</td>
                  <td>{{ leave.REASON }}</td>
                  <td>
                    <span class="badge" 
                          [class.bg-warning]="leave.LEAVESTATUS === 'PENDING'"
                          [class.bg-success]="leave.LEAVESTATUS === 'APPROVED'"
                          [class.bg-danger]="leave.LEAVESTATUS === 'REJECTED'">
                      {{ leave.LEAVESTATUS }}
                    </span>
                  </td>
                  <td>{{ leave.ADMINREMARKS }}</td>
                  <td *ngIf="canManageLeaves()">
                    <div class="btn-group btn-group-sm" *ngIf="leave.LEAVESTATUS === 'PENDING'">
                      <button class="btn btn-success" (click)="updateLeaveStatus(leave.LEAVEID!, 'APPROVED')">
                        Approve
                      </button>
                      <button class="btn btn-danger" (click)="updateLeaveStatus(leave.LEAVEID!, 'REJECTED')">
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

    <!-- Action Modal -->
    <div class="modal fade" id="actionModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{actionType}} Leave Application</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="remarks" class="form-label">Remarks</label>
              <textarea class="form-control" id="remarks" rows="3" 
                        [(ngModel)]="actionRemarks" 
                        [placeholder]="'Enter remarks for ' + actionType.toLowerCase()"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn" 
                    [class.btn-success]="actionType === 'Approve'"
                    [class.btn-danger]="actionType === 'Reject'"
                    (click)="confirmLeaveAction()">
              {{actionType}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LeaveListComponent implements OnInit {
  leaves: Leave[] = [];
  filterStatus = '';
  actionType = '';
  actionLeaveId: number | null = null;
  actionRemarks = '';

  constructor(
    public authService: AuthService,
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    const currentRoute = this.router.url;
    
    if (currentRoute.includes('my-leaves') || this.authService.isEmployee()) {
      this.leaveService.getMyLeaves().subscribe(leaves => {
        this.leaves = leaves;
      });
    } else {
      this.leaveService.getAllLeaves().subscribe(leaves => {
        this.leaves = leaves;
      });
    }
  }

  getPageTitle(): string {
    const currentRoute = this.router.url;
    if (currentRoute.includes('my-leaves')) {
      return 'My Leave Applications';
    }
    return 'Manage Leave Applications';
  }

  getFilteredLeaves(): Leave[] {
    if (!this.filterStatus) {
      return this.leaves;
    }
    return this.leaves.filter(leave => leave.LEAVESTATUS === this.filterStatus);
  }

  getColumnCount(): number {
    return this.authService.isEmployee() ? 7 : (this.canManageLeaves() ? 9 : 8);
  }

  canManageLeaves(): boolean {
    return (this.authService.isAdmin() || this.authService.isHR()) && 
           !this.router.url.includes('my-leaves');
  }

  updateLeaveStatus(leaveId: number, status: string) {
    this.actionType = status === 'APPROVED' ? 'Approve' : 'Reject';
    this.actionLeaveId = leaveId;
    this.actionRemarks = '';
    
    // Show modal (you would need to implement modal trigger here)
    // For now, we'll call the API directly
    this.confirmLeaveAction();
  }

  confirmLeaveAction() {
    if (this.actionLeaveId) {
      const status = this.actionType === 'Approve' ? 'APPROVED' : 'REJECTED';
      const remarks = this.actionRemarks || (status === 'APPROVED' ? 'Approved' : 'Rejected');

      this.leaveService.updateLeaveStatus(this.actionLeaveId, status, remarks).subscribe({
        next: () => {
          this.loadLeaves();
          // Close modal (if using Bootstrap modal)
          this.resetActionData();
        },
        error: (error) => {
          console.error('Error updating leave status:', error);
        }
      });
    }
  }

  private resetActionData() {
    this.actionType = '';
    this.actionLeaveId = null;
    this.actionRemarks = '';
  }
}
