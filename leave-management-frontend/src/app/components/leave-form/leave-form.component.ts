
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveService } from '../../services/leave.service';
import { LeaveTypeService, LeaveType } from '../../services/leave-type.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leave-form',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h4>Apply for Leave</h4>
          </div>
          <div class="card-body">
            <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="leaveType" class="form-label">Leave Type *</label>
                    <select class="form-select" id="leaveType" formControlName="TYPEOFLEAVE"
                            [class.is-invalid]="leaveForm.get('TYPEOFLEAVE')?.invalid && leaveForm.get('TYPEOFLEAVE')?.touched">
                      <option value="">Select Leave Type</option>
                      <option *ngFor="let type of leaveTypes" [value]="type.LEAVETYPE">
                        {{type.LEAVETYPE}}
                      </option>
                    </select>
                    <div class="invalid-feedback" *ngIf="leaveForm.get('TYPEOFLEAVE')?.invalid && leaveForm.get('TYPEOFLEAVE')?.touched">
                      Please select a leave type
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="shiftTime" class="form-label">Shift Time *</label>
                    <select class="form-select" id="shiftTime" formControlName="SHIFTTIME"
                            [class.is-invalid]="leaveForm.get('SHIFTTIME')?.invalid && leaveForm.get('SHIFTTIME')?.touched">
                      <option value="">Select Shift Time</option>
                      <option value="Full Day">Full Day</option>
                      <option value="Half Day - Morning">Half Day - Morning</option>
                      <option value="Half Day - Afternoon">Half Day - Afternoon</option>
                    </select>
                    <div class="invalid-feedback" *ngIf="leaveForm.get('SHIFTTIME')?.invalid && leaveForm.get('SHIFTTIME')?.touched">
                      Please select shift time
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="startDate" class="form-label">Start Date *</label>
                    <input type="date" class="form-control" id="startDate" formControlName="DATESTART"
                           [class.is-invalid]="leaveForm.get('DATESTART')?.invalid && leaveForm.get('DATESTART')?.touched">
                    <div class="invalid-feedback" *ngIf="leaveForm.get('DATESTART')?.invalid && leaveForm.get('DATESTART')?.touched">
                      Start date is required
                    </div>
                  </div>
                </div>
                
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="endDate" class="form-label">End Date *</label>
                    <input type="date" class="form-control" id="endDate" formControlName="DATEEND"
                           [class.is-invalid]="leaveForm.get('DATEEND')?.invalid && leaveForm.get('DATEEND')?.touched">
                    <div class="invalid-feedback" *ngIf="leaveForm.get('DATEEND')?.invalid && leaveForm.get('DATEEND')?.touched">
                      End date is required
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="noDays" class="form-label">Number of Days</label>
                    <input type="number" class="form-control" id="noDays" formControlName="NODAYS" 
                           step="0.5" min="0.5" readonly>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="reason" class="form-label">Reason for Leave *</label>
                <textarea class="form-control" id="reason" rows="4" formControlName="REASON"
                          [class.is-invalid]="leaveForm.get('REASON')?.invalid && leaveForm.get('REASON')?.touched"
                          placeholder="Please provide the reason for your leave application"></textarea>
                <div class="invalid-feedback" *ngIf="leaveForm.get('REASON')?.invalid && leaveForm.get('REASON')?.touched">
                  Reason is required
                </div>
              </div>

              <div class="alert alert-danger" *ngIf="errorMessage">
                {{errorMessage}}
              </div>

              <div class="alert alert-success" *ngIf="successMessage">
                {{successMessage}}
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" [disabled]="leaveForm.invalid || loading">
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                  {{loading ? 'Submitting...' : 'Submit Application'}}
                </button>
                <button type="button" class="btn btn-secondary" routerLink="/dashboard">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LeaveFormComponent implements OnInit {
  leaveForm: FormGroup;
  leaveTypes: LeaveType[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private leaveTypeService: LeaveTypeService,
    private authService: AuthService,
    private router: Router
  ) {
    this.leaveForm = this.fb.group({
      TYPEOFLEAVE: ['', Validators.required],
      SHIFTTIME: ['', Validators.required],
      DATESTART: ['', Validators.required],
      DATEEND: ['', Validators.required],
      NODAYS: [{value: 0, disabled: true}],
      REASON: ['', Validators.required]
    });

    // Calculate number of days when dates change
    this.leaveForm.get('DATESTART')?.valueChanges.subscribe(() => this.calculateDays());
    this.leaveForm.get('DATEEND')?.valueChanges.subscribe(() => this.calculateDays());
    this.leaveForm.get('SHIFTTIME')?.valueChanges.subscribe(() => this.calculateDays());
  }

  ngOnInit(): void {
    this.loadLeaveTypes();
  }

  loadLeaveTypes(): void {
    this.leaveTypeService.getAllLeaveTypes().subscribe({
      next: (types) => {
        this.leaveTypes = types;
      },
      error: (error) => {
        console.error('Error loading leave types:', error);
      }
    });
  }

  calculateDays(): void {
    const startDate = this.leaveForm.get('DATESTART')?.value;
    const endDate = this.leaveForm.get('DATEEND')?.value;
    const shiftTime = this.leaveForm.get('SHIFTTIME')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (shiftTime && shiftTime.includes('Half Day')) {
        diffDays = diffDays * 0.5;
      }

      this.leaveForm.patchValue({NODAYS: diffDays});
    }
  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.errorMessage = 'User not authenticated';
        this.loading = false;
        return;
      }

      const leaveRequest = {
        EMPLOYID: currentUser.EMPLOYID,
        DATESTART: this.leaveForm.value.DATESTART,
        DATEEND: this.leaveForm.value.DATEEND,
        NODAYS: this.leaveForm.get('NODAYS')?.value,
        SHIFTTIME: this.leaveForm.value.SHIFTTIME,
        TYPEOFLEAVE: this.leaveForm.value.TYPEOFLEAVE,
        REASON: this.leaveForm.value.REASON
      };

      this.leaveService.createLeave(leaveRequest).subscribe({
        next: (response) => {
          this.successMessage = 'Leave application submitted successfully!';
          this.leaveForm.reset();
          this.loading = false;
          
          setTimeout(() => {
            this.router.navigate(['/my-leaves']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to submit leave application';
          this.loading = false;
        }
      });
    }
  }
}
