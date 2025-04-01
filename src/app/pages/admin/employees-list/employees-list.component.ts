import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { TravelRequestService } from '../../../services/travel-request.service';

@Component({
  standalone: true,
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class EmployeesListComponent implements OnInit {
  allEmployees: any[] = [];
  searchTerm = '';
  sortBy = '';
  isViewing = false;
  isCreating = false;
  selectedEmployee: any = null;
  newEmployee: any = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    department: '',
    manager: '',
    status: 'active'
  };

  constructor(private travelService: TravelRequestService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.travelService.getAdminEmployees().subscribe(data => this.allEmployees = data);
  }

  get filteredEmployees() {
    let filtered = [...this.allEmployees];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(emp =>
        `${emp.id}`.includes(term) ||
        emp.first_name.toLowerCase().includes(term) ||
        emp.last_name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        (emp.department || '').toLowerCase().includes(term)
      );
    }
    if (this.sortBy === 'id') filtered.sort((a, b) => a.id - b.id);
    if (this.sortBy === 'name') filtered.sort((a, b) =>
      `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
    );
    return filtered;
  }

  onView(emp: any) {
    this.selectedEmployee = { ...emp };
    this.isViewing = true;
  }

  closeModal() {
    this.selectedEmployee = null;
    this.isViewing = false;
  }

  saveEmployee() {
    this.travelService.updateAdminEmployee(this.selectedEmployee.id, this.selectedEmployee)
      .subscribe(() => {
        this.loadEmployees();
        this.closeModal();
      });
  }

  onCreateNew() {
    this.newEmployee = {
      first_name: '', last_name: '', email: '', password: '',
      department: '', manager: '', status: 'active'
    };
    this.isCreating = true;
  }

  closeCreateModal() {
    this.isCreating = false;
  }

  submitNewEmployee() {
    this.travelService.createAdminEmployee(this.newEmployee)
      .subscribe(() => {
        this.loadEmployees();
        this.closeCreateModal();
      });
  }
}
