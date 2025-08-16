
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTypeService, LeaveType } from '../../services/leave-type.service';

@Component({
  selector: 'app-leave-type-list',
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Leave Types</h2>
        <button class="btn btn-primary" (click)="toggleAddForm()">
          <i class="fas fa-plus"></i> Add Leave Type
        </button>
      </div>

      <!-- Add/Edit Leave Type Form -->
      <div class="card mb-4" *ngIf="showAddForm">
        <div class="card-header">
          <h5>{{editingLeaveType ? 'Edit' : 'Add'}} Leave Type</h5>
        </div>
        <div class="card-body">
          <form [formGroup]="leaveTypeForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="leaveType" class="form-label">Leave Type *</label>
                  <input type="text" class="form-control" id="leaveType" 
                         formControlName="LEAVETYPE"
                         [class.is-invalid]="leaveTypeForm.get('LEAVETYPE')?.invalid && leaveTypeForm.get('LEAVETYPE')?.touched">
                  <div class="invalid-feedback" *ngIf="leaveTypeForm.get('LEAVETYPE')?.invalid && leaveTypeForm.get('LEAVETYPE')?.touched">
                    Leave type is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <input type="text" class="form-control" id="description" 
                         formControlName="DESCRIPTION">
                </div>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success" [disabled]="leaveTypeForm.invalid || loading">
                <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                {{loading ? 'Saving...' : (editingLeaveType ? 'Update' : 'Save')}}
              </button>
              <button type="button" class="btn btn-secondary" (click)="cancelForm()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Leave Types List -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Leave Type</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let leaveType of leaveTypes">
                  <td>{{leaveType.LEAVETYPEID}}</td>
                  <td>{{leaveType.LEAVETYPE}}</td>
                  <td>{{leaveType.DESCRIPTION || 'N/A'}}</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" (click)="editLeaveType(leaveType)">
                        <i class="fas fa-edit"></i> Edit
                      </button>
                      <button class="btn btn-outline-danger" (click)="deleteLeaveType(leaveType.LEAVETYPEID!)">
                        <i class="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="leaveTypes.length === 0">
                  <td colspan="4" class="text-center text-muted">No leave types found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LeaveTypeListComponent implements OnInit {
  leaveTypes: LeaveType[] = [];
  leaveTypeForm: FormGroup;
  showAddForm = false;
  editingLeaveType: LeaveType | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private leaveTypeService: LeaveTypeService
  ) {
    this.leaveTypeForm = this.fb.group({
      LEAVETYPE: ['', Validators.required],
      DESCRIPTION: ['']
    });
  }

  ngOnInit(): void {
    this.loadLeaveTypes();
  }

  loadLeaveTypes(): void {
    this.leaveTypeService.getAllLeaveTypes().subscribe({
      next: (leaveTypes) => {
        this.leaveTypes = leaveTypes;
      },
      error: (error) => {
        console.error('Error loading leave types:', error);
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.cancelForm();
    }
  }

  editLeaveType(leaveType: LeaveType): void {
    this.editingLeaveType = leaveType;
    this.showAddForm = true;
    this.leaveTypeForm.patchValue(leaveType);
  }

  onSubmit(): void {
    if (this.leaveTypeForm.valid) {
      this.loading = true;
      const leaveTypeData = this.leaveTypeForm.value;

      if (this.editingLeaveType) {
        this.leaveTypeService.updateLeaveType(this.editingLeaveType.LEAVETYPEID!, leaveTypeData).subscribe({
          next: () => {
            this.loadLeaveTypes();
            this.cancelForm();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating leave type:', error);
            this.loading = false;
          }
        });
      } else {
        this.leaveTypeService.createLeaveType(leaveTypeData).subscribe({
          next: () => {
            this.loadLeaveTypes();
            this.cancelForm();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error creating leave type:', error);
            this.loading = false;
          }
        });
      }
    }
  }

  deleteLeaveType(id: number): void {
    if (confirm('Are you sure you want to delete this leave type?')) {
      this.leaveTypeService.deleteLeaveType(id).subscribe({
        next: () => {
          this.loadLeaveTypes();
        },
        error: (error) => {
          console.error('Error deleting leave type:', error);
        }
      });
    }
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.editingLeaveType = null;
    this.leaveTypeForm.reset({
      LEAVETYPE: '',
      DESCRIPTION: ''
    });
  }
}
