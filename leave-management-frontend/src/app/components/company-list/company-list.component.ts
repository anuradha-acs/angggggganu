
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, Company } from '../../services/company.service';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Companies</h2>
        <button class="btn btn-primary" (click)="toggleAddForm()">
          <i class="fas fa-plus"></i> Add Company
        </button>
      </div>

      <div class="card mb-4" *ngIf="showAddForm">
        <div class="card-header">
          <h5>{{editingCompany ? 'Edit Company' : 'Add New Company'}}</h5>
        </div>
        <div class="card-body">
          <form [formGroup]="companyForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Company Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" formControlName="companyName">
                  <div class="invalid-feedback d-block" *ngIf="isFieldInvalid('companyName')">
                    Company name is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Location</label>
                  <input type="text" class="form-control" formControlName="location">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Contact</label>
                  <input type="text" class="form-control" formControlName="contact">
                </div>
              </div>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-primary" [disabled]="companyForm.invalid || loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm mr-2"></span>
                {{editingCompany ? 'Update' : 'Save'}}
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
          <h5>Companies List</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company Name</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let company of companies">
                  <td>{{company.COMPANYID}}</td>
                  <td>{{company.COMPANYNAME}}</td>
                  <td>{{company.COMPANYLOCATION}}</td>
                  <td>{{company.COMPANYCONTACT}}</td>
                  <td>
                    <button class="btn btn-sm btn-info mr-1" (click)="editCompany(company)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="deleteCompany(company.COMPANYID)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="companies.length === 0">
                  <td colspan="5" class="text-center text-muted py-4">
                    No companies found
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
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  companyForm: FormGroup;
  showAddForm = false;
  editingCompany: Company | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService
  ) {
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      location: [''],
      contact: ['']
    });
  }

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe(companies => {
      this.companies = companies;
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.cancelEdit();
    }
  }

  isFieldInvalid(field: string): boolean {
    const fieldControl = this.companyForm.get(field);
    return !!(fieldControl && fieldControl.invalid && (fieldControl.dirty || fieldControl.touched));
  }

  editCompany(company: Company) {
    this.editingCompany = company;
    this.showAddForm = true;
    this.companyForm.patchValue({
      companyName: company.COMPANYNAME,
      location: company.COMPANYLOCATION,
      contact: company.COMPANYCONTACT
    });
  }

  cancelEdit() {
    this.editingCompany = null;
    this.companyForm.reset();
    this.showAddForm = false;
  }

  onSubmit() {
    if (this.companyForm.valid) {
      this.loading = true;
      const formData = this.companyForm.value;

      const companyData = {
        COMPANYNAME: formData.companyName,
        COMPANYLOCATION: formData.location,
        COMPANYCONTACT: formData.contact
      };

      if (this.editingCompany) {
        this.companyService.updateCompany(this.editingCompany.COMPANYID, companyData).subscribe({
          next: () => {
            this.loading = false;
            this.loadCompanies();
            this.cancelEdit();
          },
          error: () => {
            this.loading = false;
          }
        });
      } else {
        this.companyService.createCompany(companyData).subscribe({
          next: () => {
            this.loading = false;
            this.loadCompanies();
            this.cancelEdit();
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    }
  }

  deleteCompany(id: number) {
    if (confirm('Are you sure you want to delete this company?')) {
      this.companyService.deleteCompany(id).subscribe({
        next: () => {
          this.loadCompanies();
        }
      });
    }
  }
}
