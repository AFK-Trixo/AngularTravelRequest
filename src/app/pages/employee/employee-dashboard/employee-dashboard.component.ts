import { Component, OnInit } from '@angular/core';
import { TravelRequestService } from '../../../services/travel-request.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  requests: any[] = [];
  filterStatus: string = '';
  selectedRequest: any = null;
  isResubmit: boolean = false;
  userName: string = 'User'; // default fallback

  constructor(private travelRequestService: TravelRequestService) {}

  ngOnInit(): void {
    this.fetchRequests();
    this.loadUserName();
  }

  loadUserName(): void {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      this.userName = storedUser;
    }
  }

  fetchRequests(): void {
    this.travelRequestService.getEmployeeRequests().subscribe({
      next: (res) => this.requests = res,
      error: (err) => console.error('Error fetching requests:', err)
    });
  }

  filteredRequests() {
    return this.requests.filter(req => !this.filterStatus || req.status === this.filterStatus);
  }

  viewRequest(req: any): void {
    this.selectedRequest = { ...req };
    this.isResubmit = false;
  }

  resubmitRequest(req: any): void {
    this.selectedRequest = { ...req };
    this.isResubmit = true;
  }

  closeModal(): void {
    this.selectedRequest = null;
    this.isResubmit = false;
  }

  deleteRequest(req: any): void {
    this.travelRequestService.deleteRequest(req.id).subscribe({
      next: () => this.fetchRequests(),
      error: (err) => console.error('Error deleting request:', err)
    });
  }

  confirmResubmit(): void {
    this.travelRequestService.updateRequest(this.selectedRequest.id, this.selectedRequest).subscribe({
      next: () => {
        this.closeModal();
        this.fetchRequests();
      },
      error: (err) => console.error('Error resubmitting request:', err)
    });
  }

  statusClass(status: string): string {
    return status.replace(/\s/g, '');
  }
}
