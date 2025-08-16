
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService, Department } from '../../services/department.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Departments</h2>
        <button class="btn btn-primary" (click)="toggleAddForm()">
          <i class="fas fa-plus"></i> Add Department
        </button>
      </div>

      <div class="card mb-4" *ngIf="showAddForm">
        <div class="card-header">
          <h5>{{editingDepartment ? 'Edit Department' : 'Add New Department'}}</h5>
        </div>
        <div class="card-body">
          <form [formGroup]="departmentForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Department Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="departmentName">
                  <div class="invalid-feedback d-block" *ngIf="isFieldInvalid('departmentName')">
                    Department name is required
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-primary" [disabled]="departmentForm.invalid || loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm mr-2"></span>
                {{editingDepartment ? 'Update' : 'Save'}}
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
          <h5>Departments List</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let department of departments">
                  <td>{{department.DEPARTMENTID}}</td>
                  <td>{{department.DEPARTMENT}}</td>
                  <td>
                    <button class="btn btn-sm btn-info mr-1" (click)="editDepartment(department)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="deleteDepartment(department.DEPARTMENTID)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="departments.length === 0">
                  <td colspan="3" class="text-center text-muted py-4">
                    No departments found
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
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  departmentForm: FormGroup;
  showAddForm = false;
  editingDepartment: Department | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.cancelEdit();
    }
  }

  isFieldInvalid(field: string): boolean {
    const fieldControl = this.departmentForm.get(field);
    return !!(fieldControl && fieldControl.invalid && (fieldControl.dirty || fieldControl.touched));
  }

  editDepartment(department: Department) {
    this.editingDepartment = department;
    this.showAddForm = true;
    this.departmentForm.patchValue({
      departmentName: department.DEPARTMENT
    });
  }

  cancelEdit() {
    this.editingDepartment = null;
    this.departmentForm.reset();
    this.showAddForm = false;
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      this.loading = true;
      const departmentData = {
        DEPARTMENT: this.departmentForm.value.departmentName
      };

      if (this.editingDepartment) {
        this.departmentService.updateDepartment(this.editingDepartment.DEPARTMENTID, departmentData).subscribe({
          next: () => {
            this.loading = false;
            this.loadDepartments();
            this.cancelEdit();
          },
          error: () => {
            this.loading = false;
          }
        });
      } else {
        this.departmentService.createDepartment(departmentData).subscribe({
          next: () => {
            this.loading = false;
            this.loadDepartments();
            this.cancelEdit();
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    }
  }

  deleteDepartment(id: number) {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.loadDepartments();
        }
      });
    }
  }
}
