import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreService } from 'src/app/services/core.service'; // You must have a login method here
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})

export class AppSideLoginComponent {
  constructor(private coreService: CoreService, private router: Router,  private snackBar: MatSnackBar) {}

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  errorMessage: string | null = null;
  loading = false;

  get f() {
    return this.form.controls;
  }

submit() {
  if (this.form.invalid) {
    return;
  }

  const payload = {
    email: this.form.value.username!,
    password: this.form.value.password!,
  };

  this.coreService.loginUser(payload).subscribe({
    next: (res) => {
      // If login is successful, save the token and navigate
      console.log('Login successful, token received:', res.token);
      localStorage.setItem('jwt_token', res.token);
      this.router.navigate(['/sensor-data']);
    },
    error: (err) => {
      console.error('Login failed:', err);

      // Get the error message from backend (always display it)
      const errorMessage =
  err?.error && typeof err.error === 'string'
    ? err.error
    : 'Login failed. Please try again.';


      // Show the error message in a snack bar or an alert
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,  // Duration in milliseconds
      });
    },
  });
}

}
