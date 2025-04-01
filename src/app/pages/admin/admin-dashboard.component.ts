import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TravelRequestService, TravelRequest } from '../../services/travel-request.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class AdminDashboardComponent implements OnInit {
  searchTerm = '';
  startDate = '';
  endDate = '';
  selectedStatus = '';
  sortBy = '';

  allRequests: TravelRequest[] = [];

  selectedRequest: TravelRequest | null = null;
  isViewing = false;

  requestingInfo = false;
  infoMessage = '';

  approvingRequest = false;
  approveMessage = '';

  rejectingRequest = false;
  rejectMessage = '';

  constructor(private travelService: TravelRequestService, private router: Router) {}

  ngOnInit(): void {
    this.travelService.getAdminRequests().subscribe((data) => {
      this.allRequests = data;
    });
  }

  get filteredRequests(): TravelRequest[] {
    let filtered = [...this.allRequests];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter((req) =>
        `${req.employee.id}`.includes(term) ||
        `${req.employee.first_name} ${req.employee.last_name}`.toLowerCase().includes(term) ||
        req.location.toLowerCase().includes(term)
      );
    }
    if (this.startDate) filtered = filtered.filter((req) => req.from_date >= this.startDate);
    if (this.endDate) filtered = filtered.filter((req) => req.to_date <= this.endDate);
    if (this.selectedStatus) filtered = filtered.filter((req) => req.status === this.selectedStatus);
    if (this.sortBy === 'id') filtered.sort((a, b) => a.employee.id - b.employee.id);
    else if (this.sortBy === 'name') filtered.sort((a, b) =>
      `${a.employee.first_name} ${a.employee.last_name}`.localeCompare(`${b.employee.first_name} ${b.employee.last_name}`));
    else if (this.sortBy === 'from_date') filtered.sort((a, b) => a.from_date.localeCompare(b.from_date));
    else if (this.sortBy === 'to_date') filtered.sort((a, b) => a.to_date.localeCompare(b.to_date));
    return filtered;
  }

  onView(req: TravelRequest) {
    this.selectedRequest = req;
    this.isViewing = true;
  }

  closeModal() {
    this.isViewing = false;
    this.selectedRequest = null;
  }

  onRequestInfo(req: TravelRequest) {
    this.selectedRequest = req;
    this.requestingInfo = true;
    this.isViewing = false;
    this.infoMessage = '';
  }

  submitInfoRequest() {
    if (!this.selectedRequest) return;
    this.travelService.adminRequestUpdate(this.selectedRequest.id, {
      status: 'FI_required',
      admin_note: this.infoMessage
    }).subscribe(() => {
      this.selectedRequest!.status = 'FI_required';
      this.selectedRequest!.admin_note = this.infoMessage;
      this.closeInfoModal();
    });
  }

  closeInfoModal() {
    this.selectedRequest = null;
    this.requestingInfo = false;
    this.infoMessage = '';
  }

  onApproveClick(req: TravelRequest) {
    this.selectedRequest = req;
    this.isViewing = false;
    this.approvingRequest = true;
    this.approveMessage = '';
  }

  submitApproveRequest() {
    if (!this.selectedRequest) return;
    this.travelService.adminRequestUpdate(this.selectedRequest.id, {
      status: 'approved',
      admin_note: this.approveMessage
    }).subscribe(() => {
      this.selectedRequest!.status = 'approved';
      this.selectedRequest!.admin_note = this.approveMessage;
      this.closeApproveModal();
    });
  }

  closeApproveModal() {
    this.selectedRequest = null;
    this.approvingRequest = false;
    this.approveMessage = '';
  }

  onRejectClick(req: TravelRequest) {
    this.selectedRequest = req;
    this.isViewing = false;
    this.rejectingRequest = true;
    this.rejectMessage = '';
  }

  submitRejectRequest() {
    if (!this.selectedRequest) return;
    this.travelService.adminRequestUpdate(this.selectedRequest.id, {
      status: 'rejected',
      admin_note: this.rejectMessage
    }).subscribe(() => {
      this.selectedRequest!.status = 'rejected';
      this.selectedRequest!.admin_note = this.rejectMessage;
      this.closeRejectModal();
    });
  }

  closeRejectModal() {
    this.selectedRequest = null;
    this.rejectingRequest = false;
    this.rejectMessage = '';
  }
}
