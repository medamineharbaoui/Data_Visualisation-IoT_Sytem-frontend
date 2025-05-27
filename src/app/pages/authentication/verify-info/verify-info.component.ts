import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-info',
  templateUrl: './verify-info.component.html',
  styleUrls: ['./verify-info.component.css']
})
export class VerifyInfoComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/authentication/login']);
  }
}
