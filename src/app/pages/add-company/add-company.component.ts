import { Component } from '@angular/core'
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms'
import { AbstractControlOptions } from '@angular/forms'
import { CompaniesService } from '../../services/companies.service'
import { MessageService } from 'primeng/api'
import { Router } from '@angular/router'
import { User } from '../../models/user.model'
import { CompanyValidator } from '../../models/companyAndUser.model'

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css'
})
export class AddCompanyComponent {
  title = 'User Management'
  companyForm: FormGroup
  adminUser!: User

  confirmPasswordValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('Password')?.value
    const confirmPassword = control.get('ConfirmPassword')?.value
    return password && confirmPassword && password === confirmPassword
      ? null
      : { passwordError: true }
  }

  constructor (
    private fb: FormBuilder,
    private companiesService: CompaniesService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.companyForm = this.fb.group(
      {
        Fname: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^([a-zA-Z]+|[\u10D0-\u10F0]+)$/)
          ]
        ],
        Lname: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.pattern(/^([a-zA-Z]+|[\u10D0-\u10F0]+)$/)
          ]
        ],
        Phone: [
          '',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
            Validators.pattern(/^-?(0|[1-9]\d*)?$/)
          ]
        ],
        Email: ['', [Validators.required, Validators.email]],
        Name: ['', [Validators.required, Validators.minLength(2)]],
        TaxCode: ['', [Validators.required, this.validateTaxCode]],
        Address: this.fb.group({
          street: [''],
          city: [''],
          zip: ['']
        }),
        Username: ['', [Validators.required, Validators.minLength(5)]],
        Password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
            )
          ]
        ],
        ConfirmPassword: ['', [Validators.required]],
        RoleId: ['1']
      },
      { validators: this.confirmPasswordValidator } as AbstractControlOptions
    )
  }

  validateTaxCode (control: AbstractControl): ValidationErrors | null {
    return !(control.value.length === 9 || control.value.length === 11)
      ? { invalidTaxCode: { value: control.value } }
      : null
  }

  addCompany () {
    if (this.companyForm.valid) {
      const companyValidator: CompanyValidator = {
        Name: this.companyForm.get('Name')?.value,
        TaxCode: this.companyForm.get('TaxCode')?.value,
        Address: `${this.companyForm.get('Address.street')?.value}, ${
          this.companyForm.get('Address.city')?.value
        }, ${this.companyForm.get('Address.zip')?.value}`,
        Fname: this.companyForm.get('Fname')?.value,
        Lname: this.companyForm.get('Lname')?.value,
        Phone: this.companyForm.get('Phone')?.value,
        Email: this.companyForm.get('Email')?.value,
        Username: this.companyForm.get('Username')?.value,
        Password: this.companyForm.get('Password')?.value,
        ConfirmPassword: this.companyForm.get('ConfirmPassword')?.value,
        IsActive: true,
        RoleId: 1,
        Role: { Id: 1, Name: 'admin' }
      }

      this.companiesService.addCompany(companyValidator).subscribe({
        next: res => {
          this.messageService.add({
            severity: 'success',
            summary: 'Info',
            detail: 'Company successfully added'
          })
          setTimeout(() => {
            this.router.navigate(['/'])
          }, 3000)
        },
        error: err => {
          console.error('Error response', err.error)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while adding the company'
          })
        }
      })
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form is not valid'
      })
    }
  }
}
