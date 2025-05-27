import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  options = this.settings.getOptions();
  loading = false;
  errorMessage: string | null = null;

  constructor(private settings: CoreService, private router: Router, private snackBar: MatSnackBar) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
  this.errorMessage = null;

  if (this.form.invalid) {
    this.errorMessage = 'Please fill out all fields correctly.';
    this.snackBar.open(this.errorMessage, 'Close', { duration: 4000 });
    return;
  }

  this.loading = true;

  const payload = {
    name: this.form.value.uname!,
    email: this.form.value.email!,
    password: this.form.value.password!,
  };

  this.settings.registerUser(payload).subscribe({
    next: (res) => {
      this.loading = false;
      this.snackBar.open('Registration successful! Please check your email to activate your account.', 'Close', {
        duration: 5000,
      });

      this.router.navigate(['/login'], {
        state: {
          registrationSuccess: true,
          email: res?.email || payload.email,
        },
      });
    },
    error: (err) => {
      this.loading = false;

      const message =
        err?.error?.message || err?.error || 'Registration failed. Please try again.';
      this.errorMessage = message;

      this.snackBar.open(message, 'Close', {
        duration: 5000,
      });
    },
  });
}

}
