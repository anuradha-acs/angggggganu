
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, Company } from '../../services/company.service';

@Component({
  selector: 'app-company-list',
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Companies</h2>
        <button class="btn btn-primary" (click)="toggleAddForm()">
          <i class="fas fa-plus"></i> Add Company
        </button>
      </div>

      <!-- Add/Edit Company Form -->
      <div class="card mb-4" *ngIf="showAddForm">
        <div class="card-header">
          <h5>{{editingCompany ? 'Edit' : 'Add'}} Company</h5>
        </div>
        <div class="card-body">
          <form [formGroup]="companyForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="companyName" class="form-label">Company Name *</label>
                  <input type="text" class="form-control" id="companyName" 
                         formControlName="COMPANY"
                         [class.is-invalid]="companyForm.get('COMPANY')?.invalid && companyForm.get('COMPANY')?.touched">
                  <div class="invalid-feedback" *ngIf="companyForm.get('COMPANY')?.invalid && companyForm.get('COMPANY')?.touched">
                    Company name is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="companyAddress" class="form-label">Company Address</label>
                  <input type="text" class="form-control" id="companyAddress" 
                         formControlName="COMPANYADDRESS">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="companyStatus" class="form-label">Status</label>
                  <select class="form-select" id="companyStatus" formControlName="COMPANYSTATUS">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success" [disabled]="companyForm.invalid || loading">
                <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                {{loading ? 'Saving...' : (editingCompany ? 'Update' : 'Save')}}
              </button>
              <button type="button" class="btn btn-secondary" (click)="cancelForm()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Companies List -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company Name</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let company of companies">
                  <td>{{company.COMPANYID}}</td>
                  <td>{{company.COMPANY}}</td>
                  <td>{{company.COMPANYADDRESS || 'N/A'}}</td>
                  <td>
                    <span class="badge" 
                          [class.bg-success]="company.COMPANYSTATUS === 'Active'"
                          [class.bg-secondary]="company.COMPANYSTATUS === 'Inactive'">
                      {{company.COMPANYSTATUS}}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" (click)="editCompany(company)">
                        <i class="fas fa-edit"></i> Edit
                      </button>
                      <button class="btn btn-outline-danger" (click)="deleteCompany(company.COMPANYID!)">
                        <i class="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="companies.length === 0">
                  <td colspan="5" class="text-center text-muted">No companies found</td>
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
      COMPANY: ['', Validators.required],
      COMPANYADDRESS: [''],
      COMPANYSTATUS: ['Active']
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
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

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.cancelForm();
    }
  }

  editCompany(company: Company): void {
    this.editingCompany = company;
    this.showAddForm = true;
    this.companyForm.patchValue(company);
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      this.loading = true;
      const companyData = this.companyForm.value;

      if (this.editingCompany) {
        this.companyService.updateCompany(this.editingCompany.COMPANYID!, companyData).subscribe({
          next: () => {
            this.loadCompanies();
            this.cancelForm();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating company:', error);
            this.loading = false;
          }
        });
      } else {
        this.companyService.createCompany(companyData).subscribe({
          next: () => {
            this.loadCompanies();
            this.cancelForm();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error creating company:', error);
            this.loading = false;
          }
        });
      }
    }
  }

  deleteCompany(id: number): void {
    if (confirm('Are you sure you want to delete this company?')) {
      this.companyService.deleteCompany(id).subscribe({
        next: () => {
          this.loadCompanies();
        },
        error: (error) => {
          console.error('Error deleting company:', error);
        }
      });
    }
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.editingCompany = null;
    this.companyForm.reset({
      COMPANY: '',
      COMPANYADDRESS: '',
      COMPANYSTATUS: 'Active'
    });
  }
}
