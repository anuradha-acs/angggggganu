
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTypeService, LeaveType } from '../../services/leave-type.service';

@Component({
  selector: 'app-leave-type-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Leave Types</h2>
        <button class="btn btn-primary" (click)="toggleAddForm()">
          <i class="fas fa-plus"></i> Add Leave Type
        </button>
      </div>

      <div class="card mb-4" *ngIf="showAddForm">
        <div class="card-header">
          <h5>{{editingLeaveType ? 'Edit Leave Type' : 'Add New Leave Type'}}</h5>
        </div>
        <div class="card-body">
          <form [formGroup]="leaveTypeForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Leave Type Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="leaveType">
                  <div class="invalid-feedback d-block" *ngIf="isFieldInvalid('leaveType')">
                    Leave type name is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Description</label>
                  <textarea class="form-control" rows="3" formControlName="description"></textarea>
                </div>
              </div>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-primary" [disabled]="leaveTypeForm.invalid || loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm mr-2"></span>
                {{editingLeaveType ? 'Update' : 'Save'}}
              </button>
              <button type="button" class="btn btn-secondary ml-2" (click)="cancelEdit()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5>Leave Types List</h5>
        </div>
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
                  <td>{{leaveType.DESCRIPTION}}</td>
                  <td>
                    <button class="btn btn-sm btn-info mr-1" (click)="editLeaveType(leaveType)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="deleteLeaveType(leaveType.LEAVETYPEID)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="leaveTypes.length === 0">
                  <td colspan="4" class="text-center text-muted py-4">
                    No leave types found
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
      leaveType: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadLeaveTypes();
  }

  loadLeaveTypes() {
    this.leaveTypeService.getLeaveTypes().subscribe(leaveTypes => {
      this.leaveTypes = leaveTypes;
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.cancelEdit();
    }
  }

  isFieldInvalid(field: string): boolean {
    const fieldControl = this.leaveTypeForm.get(field);
    return !!(fieldControl && fieldControl.invalid && (fieldControl.dirty || fieldControl.touched));
  }

  editLeaveType(leaveType: LeaveType) {
    this.editingLeaveType = leaveType;
    this.showAddForm = true;
    this.leaveTypeForm.patchValue({
      leaveType: leaveType.LEAVETYPE,
      description: leaveType.DESCRIPTION
    });
  }

  cancelEdit() {
    this.editingLeaveType = null;
    this.leaveTypeForm.reset();
    this.showAddForm = false;
  }

  onSubmit() {
    if (this.leaveTypeForm.valid) {
      this.loading = true;
      const leaveTypeData = {
        LEAVETYPE: this.leaveTypeForm.value.leaveType,
        DESCRIPTION: this.leaveTypeForm.value.description
      };

      if (this.editingLeaveType) {
        this.leaveTypeService.updateLeaveType(this.editingLeaveType.LEAVETYPEID, leaveTypeData).subscribe({
          next: () => {
            this.loading = false;
            this.loadLeaveTypes();
            this.cancelEdit();
          },
          error: () => {
            this.loading = false;
          }
        });
      } else {
        this.leaveTypeService.createLeaveType(leaveTypeData).subscribe({
          next: () => {
            this.loading = false;
            this.loadLeaveTypes();
            this.cancelEdit();
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    }
  }

  deleteLeaveType(id: number) {
    if (confirm('Are you sure you want to delete this leave type?')) {
      this.leaveTypeService.deleteLeaveType(id).subscribe({
        next: () => {
          this.loadLeaveTypes();
        }
      });
    }
  }
}
