import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { TravelRequestService } from '../../../services/travel-request.service';

@Component({
  standalone: true,
  selector: 'app-managers-list',
  templateUrl: './managers-list.component.html',
  styleUrls: ['./managers-list.component.scss'],
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class ManagersListComponent implements OnInit {
  allManagers: any[] = [];
  searchTerm: string = '';
  sortBy: string = '';
  isViewing: boolean = false;
  isCreating: boolean = false;

  selectedManager: any = null;
  newManager: any = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    department: '',
    status: 'active'
  };

  constructor(private travelService: TravelRequestService) {}

  ngOnInit(): void {
    this.loadManagers();
  }

  loadManagers() {
    this.travelService.getAdminManagers().subscribe(data => {
      this.allManagers = data;
    });
  }

  get filteredManagers() {
    let filtered = [...this.allManagers];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(mgr =>
        `${mgr.id}`.includes(term) ||
        mgr.first_name.toLowerCase().includes(term) ||
        mgr.last_name.toLowerCase().includes(term) ||
        (mgr.department || '').toLowerCase().includes(term) ||
        mgr.email.toLowerCase().includes(term)
      );
    }

    if (this.sortBy === 'id') {
      filtered.sort((a, b) => a.id - b.id);
    } else if (this.sortBy === 'name') {
      filtered.sort((a, b) =>
        `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
      );
    }

    return filtered;
  }

  onView(mgr: any) {
    this.selectedManager = { ...mgr };
    this.isViewing = true;
  }

  closeModal() {
    this.selectedManager = null;
    this.isViewing = false;
  }

  saveManager() {
    this.travelService.updateAdminManager(this.selectedManager.id, this.selectedManager)
      .subscribe(() => {
        this.loadManagers();
        this.closeModal();
      });
  }

  onCreateNew() {
    this.newManager = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      department: '',
      status: 'active'
    };
    this.isCreating = true;
  }

  closeCreateModal() {
    this.isCreating = false;
  }

  submitNewManager() {
    this.travelService.createAdminManager(this.newManager)
      .subscribe(() => {
        this.loadManagers();
        this.closeCreateModal();
      });
  }
}
