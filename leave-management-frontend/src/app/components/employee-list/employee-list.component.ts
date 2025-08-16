
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';
import { CompanyService, Company } from '../../services/company.service';
import { DepartmentService, Department } from '../../services/department.service';

@Component({
  selector: 'app-employee-list',
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Employees</h2>
        <button class="btn btn-primary" (click)="toggleAddForm()">
          <i class="fas fa-plus"></i> Add Employee
        </button>
      </div>

      <!-- Add/Edit Employee Form -->
      <div class="card mb-4" *ngIf="showAddForm">
        <div class="card-header">
          <h5>{{editingEmployee ? 'Edit' : 'Add'}} Employee</h5>
        </div>
        <div class="card-body">
          <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="empName" class="form-label">Employee Name *</label>
                  <input type="text" class="form-control" id="empName" 
                         formControlName="EMPNAME"
                         [class.is-invalid]="employeeForm.get('EMPNAME')?.invalid && employeeForm.get('EMPNAME')?.touched">
                  <div class="invalid-feedback" *ngIf="employeeForm.get('EMPNAME')?.invalid && employeeForm.get('EMPNAME')?.touched">
                    Employee name is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="employId" class="form-label">Employee ID *</label>
                  <input type="text" class="form-control" id="employId" 
                         formControlName="EMPLOYID"
                         [class.is-invalid]="employeeForm.get('EMPLOYID')?.invalid && employeeForm.get('EMPLOYID')?.touched">
                  <div class="invalid-feedback" *ngIf="employeeForm.get('EMPLOYID')?.invalid && employeeForm.get('EMPLOYID')?.touched">
                    Employee ID is required
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="username" class="form-label">Username *</label>
                  <input type="text" class="form-control" id="username" 
                         formControlName="USERNAME"
                         [class.is-invalid]="employeeForm.get('USERNAME')?.invalid && employeeForm.get('USERNAME')?.touched">
                  <div class="invalid-feedback" *ngIf="employeeForm.get('USERNAME')?.invalid && employeeForm.get('USERNAME')?.touched">
                    Username is required
                  </div>
                </div>
              </div>
              <div class="col-md-6" *ngIf="!editingEmployee">
                <div class="mb-3">
                  <label for="password" class="form-label">Password *</label>
                  <input type="password" class="form-control" id="password" 
                         formControlName="password"
                         [class.is-invalid]="employeeForm.get('password')?.invalid && employeeForm.get('password')?.touched">
                  <div class="invalid-feedback" *ngIf="employeeForm.get('password')?.invalid && employeeForm.get('password')?.touched">
                    Password is required
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="empPosition" class="form-label">Position *</label>
                  <select class="form-select" id="empPosition" formControlName="EMPPOSITION"
                          [class.is-invalid]="employeeForm.get('EMPPOSITION')?.invalid && employeeForm.get('EMPPOSITION')?.touched">
                    <option value="">Select Position</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Manager user">Manager user</option>
                    <option value="Supervisor user">Supervisor user</option>
                    <option value="Normal user">Normal user</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="employeeForm.get('EMPPOSITION')?.invalid && employeeForm.get('EMPPOSITION')?.touched">
                    Position is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="empSex" class="form-label">Gender *</label>
                  <select class="form-select" id="empSex" formControlName="EMPSEX"
                          [class.is-invalid]="employeeForm.get('EMPSEX')?.invalid && employeeForm.get('EMPSEX')?.touched">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="employeeForm.get('EMPSEX')?.invalid && employeeForm.get('EMPSEX')?.touched">
                    Gender is required
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="company" class="form-label">Company *</label>
                  <select class="form-select" id="company" formControlName="COMPANY"
                          [class.is-invalid]="employeeForm.get('COMPANY')?.invalid && employeeForm.get('COMPANY')?.touched">
                    <option value="">Select Company</option>
                    <option *ngFor="let company of companies" [value]="company.COMPANY">
                      {{company.COMPANY}}
                    </option>
                  </select>
                  <div class="invalid-feedback" *ngIf="employeeForm.get('COMPANY')?.invalid && employeeForm.get('COMPANY')?.touched">
                    Company is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="department" class="form-label">Department *</label>
                  <select class="form-select" id="department" formControlName="DEPARTMENT"
                          [class.is-invalid]="employeeForm.get('DEPARTMENT')?.invalid && employeeForm.get('DEPARTMENT')?.touched">
                    <option value="">Select Department</option>
                    <option *ngFor="let department of departments" [value]="department.DEPARTMENT">
                      {{department.DEPARTMENT}}
                    </option>
                  </select>
                  <div class="invalid-feedback" *ngIf="employeeForm.get('DEPARTMENT')?.invalid && employeeForm.get('DEPARTMENT')?.touched">
                    Department is required
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="aveLeave" class="form-label">Available Leave (Days)</label>
                  <input type="number" class="form-control" id="aveLeave" 
                         formControlName="AVELEAVE" min="0" max="365">
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="accStatus" class="form-label">Account Status</label>
                  <select class="form-select" id="accStatus" formControlName="ACCSTATUS">
                    <option value="YES">Active</option>
                    <option value="NO">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success" [disabled]="employeeForm.invalid || loading">
                <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                {{loading ? 'Saving...' : (editingEmployee ? 'Update' : 'Save')}}
              </button>
              <button type="button" class="btn btn-secondary" (click)="cancelForm()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Employees List -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Department</th>
                  <th>Available Leave</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let employee of employees">
                  <td>{{employee.EMPLOYID}}</td>
                  <td>{{employee.EMPNAME}}</td>
                  <td>{{employee.EMPPOSITION}}</td>
                  <td>{{employee.COMPANY}}</td>
                  <td>{{employee.DEPARTMENT}}</td>
                  <td>{{employee.AVELEAVE}} days</td>
                  <td>
                    <span class="badge" 
                          [class.bg-success]="employee.ACCSTATUS === 'YES'"
                          [class.bg-danger]="employee.ACCSTATUS === 'NO'">
                      {{employee.ACCSTATUS === 'YES' ? 'Active' : 'Inactive'}}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" (click)="editEmployee(employee)">
                        <i class="fas fa-edit"></i> Edit
                      </button>
                      <button class="btn btn-outline-danger" (click)="deleteEmployee(employee.EMPID!)">
                        <i class="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="employees.length === 0">
                  <td colspan="8" class="text-center text-muted">No employees found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  companies: Company[] = [];
  departments: Department[] = [];
  employeeForm: FormGroup;
  showAddForm = false;
  editingEmployee: Employee | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private departmentService: DepartmentService
  ) {
    this.employeeForm = this.fb.group({
      EMPNAME: ['', Validators.required],
      EMPLOYID: ['', Validators.required],
      USERNAME: ['', Validators.required],
      password: ['', Validators.required],
      EMPPOSITION: ['', Validators.required],
      EMPSEX: ['', Validators.required],
      COMPANY: ['', Validators.required],
      DEPARTMENT: ['', Validators.required],
      AVELEAVE: [18, [Validators.min(0), Validators.max(365)]],
      ACCSTATUS: ['YES']
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadCompanies();
    this.loadDepartments();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
      }
    });
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

  editEmployee(employee: Employee): void {
    this.editingEmployee = employee;
    this.showAddForm = true;
    
    // Remove password requirement for editing
    this.employeeForm.get('password')?.clearValidators();
    this.employeeForm.get('password')?.updateValueAndValidity();
    
    this.employeeForm.patchValue(employee);
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.loading = true;
      const employeeData = this.employeeForm.value;

      if (this.editingEmployee) {
        // Remove password from update if not provided
        if (!employeeData.password) {
          delete employeeData.password;
        }
        
        this.employeeService.updateEmployee(this.editingEmployee.EMPID!, employeeData).subscribe({
          next: () => {
            this.loadEmployees();
            this.cancelForm();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.loading = false;
          }
        });
      } else {
        this.employeeService.createEmployee(employeeData).subscribe({
          next: () => {
            this.loadEmployees();
            this.cancelForm();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error creating employee:', error);
            this.loading = false;
          }
        });
      }
    }
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
        }
      });
    }
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.editingEmployee = null;
    
    // Reset password validation
    this.employeeForm.get('password')?.setValidators([Validators.required]);
    this.employeeForm.get('password')?.updateValueAndValidity();
    
    this.employeeForm.reset({
      EMPNAME: '',
      EMPLOYID: '',
      USERNAME: '',
      password: '',
      EMPPOSITION: '',
      EMPSEX: '',
      COMPANY: '',
      DEPARTMENT: '',
      AVELEAVE: 18,
      ACCSTATUS: 'YES'
    });
  }
}
