import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EmployeeDashboardComponent } from './pages/employee/employee-dashboard/employee-dashboard.component';
import { ManagerDashboardComponent } from './pages/manager/manager-dashboard.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateRequestComponent } from './pages/employee/create-request.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'employee/dashboard', component: EmployeeDashboardComponent, canActivate: [AuthGuard] },
  { path: 'manager/dashboard', component: ManagerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'employee/create', component: CreateRequestComponent, canActivate: [AuthGuard] },
  {
    path: 'admin/employees',
    loadComponent: () => import('./pages/admin/employees-list/employees-list.component').then(m => m.EmployeesListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/managers',
    loadComponent: () => import('./pages/admin/managers-list/managers-list.component').then(m => m.ManagersListComponent),
    canActivate: [AuthGuard]
  }
  // Add manager and admin dashboards later
];
