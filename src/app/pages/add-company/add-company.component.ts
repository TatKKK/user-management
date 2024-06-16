import { Component } from '@angular/core'
import {
  FormGroup,
  FormControl,
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
import { Company } from '../../models/company.model'
import { isReactive } from '@angular/core/primitives/signals'
import { Registration } from '../../models/companyAndUser.model'


@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css'
})
export class AddCompanyComponent {
  title = 'User Management'
  companyForm: FormGroup

  adminUser!:User
  

  confirmPasswordValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('Password')?.value;
    const confirmPassword = control.get('ConfirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword //ese tu ar chavwer dirty-ze errors agdebs
      ? null
      : { passwordError: true };
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
        Email: [
          '',
          [
            Validators.required,            
            Validators.email
          ]
        ],
        Name: ['', [Validators.required, Validators.minLength(2)]],
        TaxCode: [
          '',
          [
            Validators.required,
          this.validateTaxCode
          ]
        ],
        Adress: this.fb.group({
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
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/)
          ]
        ],
        ConfirmPassword: [
          '',
          [Validators.required]
        ],
        RoleId: ['1']
      },
      { validators: this.confirmPasswordValidator } as AbstractControlOptions
    );

  }

  validateTaxCode(control:AbstractControl):ValidationErrors | null {
    return !(control.value.length === 9 || control.value.length === 11)?{invalidTaxCode:{value:control.value}}:null;
  }

  addCompany() {
    if (this.companyForm.valid) {
        const registration = new Registration();
        registration.Company = new Company();
        registration.Company.Name = this.companyForm.get('Name')?.value;
        registration.Company.TaxCode = this.companyForm.get('TaxCode')?.value;
        registration.Company.Adress = `${this.companyForm.get('Adress.street')?.value}, ${this.companyForm.get('Adress.city')?.value}, ${this.companyForm.get('Adress.zip')?.value}`;

        registration.AdminUser = new User();
        registration.AdminUser.Fname = this.companyForm.get('Fname')?.value;
        registration.AdminUser.Lname = this.companyForm.get('Lname')?.value;
        registration.AdminUser.Phone = this.companyForm.get('Phone')?.value;
        registration.AdminUser.Email = this.companyForm.get('Email')?.value;
        registration.AdminUser.Username = this.companyForm.get('Username')?.value;
        registration.AdminUser.Password = this.companyForm.get('Password')?.value;
        registration.AdminUser.IsActive = true;
        registration.AdminUser.RoleId = 1;
        registration.AdminUser.Role = { Id: 1, Name: 'admin' };

        console.log(registration);
        

        this.companiesService.addCompany(registration).subscribe({
            next: res => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Info',
                    detail: 'Company successfully added'
                });
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 3000);
            },
            error: err => {
                console.error('Error response', err.error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'An error occurred while adding the company'
                });
            }
        });
    } else {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Form is not valid'
        });
    }
}

}
