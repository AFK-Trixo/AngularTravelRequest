import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule] // 👈 Needed for *ngIf
})
export class NavbarComponent {
  @Input() showCreateRequest: boolean = true;
  @Input() navbarMode: 'admin' | 'employee' | 'manager' = 'employee';

  dropdownOpen = false;
  userName = 'User';

  constructor(private router: Router) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  onSettings() {
    alert('Settings coming soon!');
  }

  onNavigate(destination: 'employees' | 'managers') {
    if (this.navbarMode === 'admin') {
      this.router.navigate([`/admin/${destination}`]);
    }
  }

  onCreateNewRequest() {
    if (this.navbarMode === 'employee') {
      this.router.navigate(['/employee/create']);
    }
  }
}
