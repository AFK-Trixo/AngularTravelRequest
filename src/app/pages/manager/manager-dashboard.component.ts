import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TravelRequestService } from '../../services/travel-request.service';

@Component({
  standalone: true,
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss'],
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class ManagerDashboardComponent implements OnInit {
  searchTerm = '';
  startDate = '';
  endDate = '';
  selectedStatus = '';
  sortBy = '';

  allRequests: any[] = [];

  selectedRequest: any = null;
  isViewing = false;

  requestingInfo = false;
  approvingRequest = false;
  rejectingRequest = false;

  infoMessage = '';
  approveMessage = '';
  rejectMessage = '';

  constructor(
    private travelRequestService: TravelRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.travelRequestService.getManagerRequests().subscribe((data: any) => {
      this.allRequests = data;
    });
  }

  get filteredRequests(): any[] {
    let filtered = [...this.allRequests];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter((req) =>
        `${req.employee.id}`.includes(term) ||
        `${req.employee.first_name} ${req.employee.last_name}`.toLowerCase().includes(term) ||
        req.location.toLowerCase().includes(term)
      );
    }

    if (this.startDate.trim()) {
      filtered = filtered.filter((req) => req.from_date >= this.startDate);
    }

    if (this.endDate.trim()) {
      filtered = filtered.filter((req) => req.to_date <= this.endDate);
    }

    if (this.selectedStatus.trim()) {
      filtered = filtered.filter((req) => req.status.toLowerCase() === this.selectedStatus.toLowerCase());
    }

    // Optional sorting
    if (this.sortBy === 'id') {
      filtered.sort((a, b) => a.employee.id - b.employee.id);
    } else if (this.sortBy === 'name') {
      filtered.sort((a, b) =>
        (`${a.employee.first_name} ${a.employee.last_name}`).localeCompare(`${b.employee.first_name} ${b.employee.last_name}`)
      );
    } else if (this.sortBy === 'startDate') {
      filtered.sort((a, b) => a.from_date.localeCompare(b.from_date));
    } else if (this.sortBy === 'endDate') {
      filtered.sort((a, b) => a.to_date.localeCompare(b.to_date));
    }

    return filtered;
  }

  onView(req: any) {
    this.selectedRequest = req;
    this.isViewing = true;
  }

  closeModal() {
    this.selectedRequest = null;
    this.isViewing = false;
  }

  onApproveClick(req: any) {
    this.selectedRequest = req;
    this.isViewing = false;
    this.approvingRequest = true;
    this.approveMessage = '';
  }

  submitApproveRequest() {
    if (!this.selectedRequest) return;
    this.travelRequestService.approveRequestByManager(this.selectedRequest.id, this.approveMessage).subscribe(() => {
      this.selectedRequest.status = 'approved';
      this.selectedRequest.manager_note = this.approveMessage;
      this.closeApproveModal();
    });
  }

  closeApproveModal() {
    this.selectedRequest = null;
    this.approvingRequest = false;
    this.approveMessage = '';
  }

  onRejectClick(req: any) {
    this.selectedRequest = req;
    this.isViewing = false;
    this.rejectingRequest = true;
    this.rejectMessage = '';
  }

  submitRejectRequest() {
    if (!this.selectedRequest) return;
    this.travelRequestService.rejectRequestByManager(this.selectedRequest.id, this.rejectMessage).subscribe(() => {
      this.selectedRequest.status = 'rejected';
      this.selectedRequest.manager_note = this.rejectMessage;
      this.closeRejectModal();
    });
  }

  closeRejectModal() {
    this.selectedRequest = null;
    this.rejectingRequest = false;
    this.rejectMessage = '';
  }

  onRequestInfo(req: any) {
    this.selectedRequest = req;
    this.isViewing = false;
    this.requestingInfo = true;
    this.infoMessage = '';
  }

  submitInfoRequest() {
    if (!this.selectedRequest) return;
    this.travelRequestService.requestInfoByManager(this.selectedRequest.id, this.infoMessage).subscribe(() => {
      this.selectedRequest.status = 'FI_required';
      this.selectedRequest.manager_note = this.infoMessage;
      this.closeInfoModal();
    });
  }

  closeInfoModal() {
    this.selectedRequest = null;
    this.requestingInfo = false;
    this.infoMessage = '';
  }
}
