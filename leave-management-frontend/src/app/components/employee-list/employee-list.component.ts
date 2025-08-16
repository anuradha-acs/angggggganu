import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';
import { CompanyService, Company } from '../../services/company.service';
import { DepartmentService, Department } from '../../services/department.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Employees</h2>
        <button class="btn btn-primary" (click)="toggleAddForm()">
          <i class="fas fa-plus"></i> Add Employee
        </button>
      </div>

      <div class="card mb-4" *ngIf="showAddForm">
        <div class="card-header">
          <h5>{{editingEmployee ? 'Edit Employee' : 'Add New Employee'}}</h5>
        </div>
        <div class="card-body">
          <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Employee ID <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="empId">
                  <div class="invalid-feedback d-block" *ngIf="isFieldInvalid('empId')">
                    Employee ID is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Position</label>
                  <input type="text" class="form-control" formControlName="position">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label>First Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="firstName">
                  <div class="invalid-feedback d-block" *ngIf="isFieldInvalid('firstName')">
                    First name is required
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>Middle Name</label>
                  <input type="text" class="form-control" formControlName="middleName">
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>Last Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="lastName">
                  <div class="invalid-feedback d-block" *ngIf="isFieldInvalid('lastName')">
                    Last name is required
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label>Company</label>
                  <select class="form-control" formControlName="companyId">
                    <option value="">Select Company</option>
                    <option *ngFor="let company of companies" [value]="company.COMPANYID">
                      {{company.COMPANYNAME}}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>Department</label>
                  <select class="form-control" formControlName="departmentId">
                    <option value="">Select Department</option>
                    <option *ngFor="let dept of departments" [value]="dept.DEPARTMENTID">
                      {{dept.DEPARTMENT}}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>Start Date</label>
                  <input type="date" class="form-control" formControlName="startDate">
                </div>
              </div>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-primary" [disabled]="employeeForm.invalid || loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm mr-2"></span>
                {{editingEmployee ? 'Update' : 'Save'}}
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
          <h5>Employees List</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Department</th>
                  <th>Start Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let employee of employees">
                  <td>{{employee.EMPLOYEEID}}</td>
                  <td>{{employee.EMPID}}</td>
                  <td>{{employee.FNAME}} {{employee.MNAME}} {{employee.LNAME}}</td>
                  <td>{{employee.POSITION}}</td>
                  <td>{{employee.company_name}}</td>
                  <td>{{employee.department_name}}</td>
                  <td>{{employee.DATESTART | date}}</td>
                  <td>
                    <button class="btn btn-sm btn-info mr-1" (click)="editEmployee(employee)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="deleteEmployee(employee.EMPLOYEEID)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="employees.length === 0">
                  <td colspan="8" class="text-center text-muted py-4">
                    No employees found
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
      empId: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      position: [''],
      companyId: [''],
      departmentId: [''],
      startDate: ['']
    });
  }

  ngOnInit() {
    this.loadEmployees();
    this.loadCompanies();
    this.loadDepartments();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe(companies => {
      this.companies = companies;
    });
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
    const fieldControl = this.employeeForm.get(field);
    return !!(fieldControl && fieldControl.invalid && (fieldControl.dirty || fieldControl.touched));
  }

  editEmployee(employee: Employee) {
    this.editingEmployee = employee;
    this.showAddForm = true;
    this.employeeForm.patchValue({
      empId: employee.EMPID,
      firstName: employee.FNAME,
      middleName: employee.MNAME,
      lastName: employee.LNAME,
      position: employee.POSITION,
      companyId: employee.COMPANYID,
      departmentId: employee.DEPARTMENTID,
      startDate: employee.DATESTART
    });
  }

  cancelEdit() {
    this.editingEmployee = null;
    this.employeeForm.reset();
    this.showAddForm = false;
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.loading = true;
      const formData = this.employeeForm.value;

      const employeeData = {
        EMPID: formData.empId,
        FNAME: formData.firstName,
        MNAME: formData.middleName,
        LNAME: formData.lastName,
        POSITION: formData.position,
        COMPANYID: formData.companyId,
        DEPARTMENTID: formData.departmentId,
        DATESTART: formData.startDate
      };

      if (this.editingEmployee) {
        this.employeeService.updateEmployee(this.editingEmployee.EMPLOYEEID, employeeData).subscribe({
          next: () => {
            this.loading = false;
            this.loadEmployees();
            this.cancelEdit();
          },
          error: () => {
            this.loading = false;
          }
        });
      } else {
        this.employeeService.createEmployee(employeeData).subscribe({
          next: () => {
            this.loading = false;
            this.loadEmployees();
            this.cancelEdit();
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    }
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        }
      });
    }
  }
}