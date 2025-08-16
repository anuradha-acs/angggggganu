
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LeaveService } from '../../services/leave.service';
import { LeaveTypeService, LeaveType } from '../../services/leave-type.service';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Apply for Leave</h6>
      </div>
      <div class="card-body">
        <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>Leave Type <span class="text-danger">*</span></label>
                <select class="form-control" formControlName="leaveType">
                  <option value="">Select Leave Type</option>
                  <option *ngFor="let type of leaveTypes" [value]="type.LEAVETYPE">
                    {{type.LEAVETYPE}}
                  </option>
                </select>
                <div class="invalid-feedback d-block" *ngIf="isFieldInvalid('leaveType')">
                  Leave type is required
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>Shift Time <span class="text-danger">*</span></label>
                <select class="form-control" formControlName="shiftTime">
                  <option value="">Select Shift</option>
                  <option value="All Day">All Day</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
                <div class="invalid-feedback d-block" *ngIf="isFieldInvalid('shiftTime')">
                  Shift time is required
                </div>
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>Start Date <span class="text-danger">*</span></label>
                <input type="date" class="form-control" formControlName="startDate"
                       (change)="calculateDays()">
                <div class="invalid-feedback d-block" *ngIf="isFieldInvalid('startDate')">
                  Start date is required
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>End Date <span class="text-danger">*</span></label>
                <input type="date" class="form-control" formControlName="endDate"
                       (change)="calculateDays()">
                <div class="invalid-feedback d-block" *ngIf="isFieldInvalid('endDate')">
                  End date is required
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>Number of Days</label>
                <input type="number" class="form-control" formControlName="noDays" readonly>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Reason <span class="text-danger">*</span></label>
            <textarea class="form-control" rows="4" formControlName="reason" 
                      placeholder="Please provide reason for leave"></textarea>
            <div class="invalid-feedback d-block" *ngIf="isFieldInvalid('reason')">
              Reason is required
            </div>
          </div>

          <div class="form-group">
            <button type="submit" class="btn btn-primary" [disabled]="leaveForm.invalid || loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm mr-2"></span>
              Submit Leave Request
            </button>
            <button type="button" class="btn btn-secondary ml-2" (click)="goBack()">
              Cancel
            </button>
          </div>
        </form>

        <div class="alert alert-success mt-3" *ngIf="successMessage">
          {{successMessage}}
        </div>
        <div class="alert alert-danger mt-3" *ngIf="errorMessage">
          {{errorMessage}}
        </div>
      </div>
    </div>
  `
})
export class LeaveFormComponent implements OnInit {
  leaveForm: FormGroup;
  leaveTypes: LeaveType[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private leaveService: LeaveService,
    private leaveTypeService: LeaveTypeService,
    private router: Router
  ) {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      shiftTime: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      noDays: [0],
      reason: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadLeaveTypes();
  }

  loadLeaveTypes() {
    this.leaveTypeService.getLeaveTypes().subscribe(types => {
      this.leaveTypes = types;
    });
  }

  isFieldInvalid(field: string): boolean {
    const fieldControl = this.leaveForm.get(field);
    return !!(fieldControl && fieldControl.invalid && (fieldControl.dirty || fieldControl.touched));
  }

  calculateDays() {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;
    const shiftTime = this.leaveForm.get('shiftTime')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (shiftTime === 'AM' || shiftTime === 'PM') {
        diffDays = diffDays * 0.5;
      }

      this.leaveForm.patchValue({ noDays: diffDays });
    }
  }

  onSubmit() {
    if (this.leaveForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const user = this.authService.getCurrentUser();
      if (!user) {
        this.errorMessage = 'User not found';
        this.loading = false;
        return;
      }

      const formData = this.leaveForm.value;
      const leaveRequest = {
        employeeId: user.EMPID,
        startDate: formData.startDate,
        endDate: formData.endDate,
        leaveType: formData.leaveType,
        reason: formData.reason,
        shiftTime: formData.shiftTime,
        noDays: formData.noDays
      };

      this.leaveService.createLeave(leaveRequest).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = 'Leave request submitted successfully!';
          setTimeout(() => {
            this.router.navigate(['/my-leaves']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to submit leave request. Please try again.';
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
