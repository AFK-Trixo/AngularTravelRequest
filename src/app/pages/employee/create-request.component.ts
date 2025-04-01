import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TravelRequestService } from '../../services/travel-request.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent {
  employeeId = '';
  name = '';
  location = '';
  destination = '';
  from = '';
  startDate = '';
  endDate = '';
  travelMode = 'Flight';
  additionalRequests = '';
  lodgingRequired = '';
  purposeOfTravel = '';

  constructor(
    private travelRequestService: TravelRequestService,
    private router: Router
  ) {}

  onSubmit(form: any): void {
    console.log('📤 Form Submission Attempted');
    console.log('✔️ Is Form Valid?', form.valid);
    console.log('📦 Current Form Model:', {
      employeeId: this.employeeId,
      name: this.name,
      location: this.location,
      destination: this.destination,
      from: this.from,
      startDate: this.startDate,
      endDate: this.endDate,
      travelMode: this.travelMode,
      additionalRequests: this.additionalRequests,
      lodgingRequired: this.lodgingRequired,
      purposeOfTravel: this.purposeOfTravel
    });

    if (!form.valid) {
      console.warn('⚠️ Form invalid. Submission aborted.');
      return;
    }

    const payload = {
      employee: Number(this.employeeId),
      manager: 1, // hardcoded for now
      from_date: this.startDate,
      to_date: this.endDate,
      location: this.location,
      destination: this.destination,
      travel_mode: this.travelMode,
      lodging_required: this.lodgingRequired.toLowerCase() === 'yes',
      purpose_of_travel: this.purposeOfTravel,
      additional_requests: this.additionalRequests
    };

    console.log('🚀 Final Payload to Submit:', payload);

    this.travelRequestService.createRequest(payload).subscribe({
      next: () => {
        console.log('✅ Request created successfully');
        this.router.navigate(['/employee/dashboard']);
      },
      error: (err: any) => {
        console.error('❌ Failed to create request:', err);
      }
    });
  }

  onCancel(): void {
    console.log('🚪 Cancel clicked. Navigating to dashboard.');
    this.router.navigate(['/employee/dashboard']);
  }
}
