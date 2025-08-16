
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService, Department } from '../../services/department.service';

@Component({
  selector: 'app-department-list',
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Departments</h2>
        <button class="btn btn-primary" (click)="toggleAddForm()">
          <i class="fas fa-plus"></i> Add Department
        </button>
      </div>

      <!-- Add/Edit Department Form -->
      <div class="card mb-4" *ngIf="showAddForm">
        <div class="card-header">
          <h5>{{editingDepartment ? 'Edit' : 'Add'}} Department</h5>
        </div>
        <div class="card-body">
          <form [formGroup]="departmentForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="departmentName" class="form-label">Department Name *</label>
                  <input type="text" class="form-control" id="departmentName" 
                         formControlName="DEPARTMENT"
                         [class.is-invalid]="departmentForm.get('DEPARTMENT')?.invalid && departmentForm.get('DEPARTMENT')?.touched">
                  <div class="invalid-feedback" *ngIf="departmentForm.get('DEPARTMENT')?.invalid && departmentForm.get('DEPARTMENT')?.touched">
                    Department name is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="departmentDesc" class="form-label">Description</label>
                  <input type="text" class="form-control" id="departmentDesc" 
                         formControlName="DEPARTMENTDESC">
                </div>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success" [disabled]="departmentForm.invalid || loading">
                <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                {{loading ? 'Saving...' : (editingDepartment ? 'Update' : 'Save')}}
              </button>
              <button type="button" class="btn btn-secondary" (click)="cancelForm()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Departments List -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let department of departments">
                  <td>{{department.DEPARTMENTID}}</td>
                  <td>{{department.DEPARTMENT}}</td>
                  <td>{{department.DEPARTMENTDESC || 'N/A'}}</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" (click)="editDepartment(department)">
                        <i class="fas fa-edit"></i> Edit
                      </button>
                      <button class="btn btn-outline-danger" (click)="deleteDepartment(department.DEPARTMENTID!)">
                        <i class="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="departments.length === 0">
                  <td colspan="4" class="text-center text-muted">No departments found</td>
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
      DEPARTMENT: ['', Validators.required],
      DEPARTMENTDESC: ['']
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.cancelForm();
    }
  }

  editDepartment(department: Department): void {
    this.editingDepartment = department;
    this.showAddForm = true;
    this.departmentForm.patchValue(department);
  }

  onSubmit(): void {
    if (this.departmentForm.valid) {
      this.loading = true;
      const departmentData = this.departmentForm.value;

      if (this.editingDepartment) {
        this.departmentService.updateDepartment(this.editingDepartment.DEPARTMENTID!, departmentData).subscribe({
          next: () => {
            this.loadDepartments();
            this.cancelForm();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating department:', error);
            this.loading = false;
          }
        });
      } else {
        this.departmentService.createDepartment(departmentData).subscribe({
          next: () => {
            this.loadDepartments();
            this.cancelForm();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error creating department:', error);
            this.loading = false;
          }
        });
      }
    }
  }

  deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.loadDepartments();
        },
        error: (error) => {
          console.error('Error deleting department:', error);
        }
      });
    }
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.editingDepartment = null;
    this.departmentForm.reset({
      DEPARTMENT: '',
      DEPARTMENTDESC: ''
    });
  }
}
