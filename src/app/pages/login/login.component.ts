import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        const role = localStorage.getItem('role');

        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'manager') {
          this.router.navigate(['/manager/dashboard']);
        } else if (role === 'employee') {
          this.router.navigate(['/employee/dashboard']);
        } else {
          this.error = 'Role not recognized.';
        }
      },
      error: () => {
        this.error = 'Invalid credentials. Please try again.';
      }
    });
  }
}
