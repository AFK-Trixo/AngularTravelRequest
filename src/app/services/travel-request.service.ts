import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export interface TravelRequest {
  id: number;
  employee: {
    id: number;
    first_name: string;
    last_name: string;
  };
  from_date: string;
  to_date: string;
  location: string;
  destination: string;
  travel_mode: string;
  lodging_required: boolean;
  purpose_of_travel: string;
  status: string;
  manager_note?: string;
  admin_note?: string;
  further_information?: string | null;
  resubmission_count: number;
  is_closed: boolean;
  created_at: string;
  manager: number;
  processed_by?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class TravelRequestService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Token ${token}`
    });
  }

  // ================================
  // ✅ EMPLOYEE ENDPOINTS
  // ================================

  getEmployeeRequests(): Observable<TravelRequest[]> {
    return this.http.get<TravelRequest[]>(`${this.baseUrl}/employee/requests/`, {
      headers: this.getAuthHeaders()
    });
  }

  createRequest(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employee/requests/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateRequest(id: number, data: Partial<TravelRequest>): Observable<TravelRequest> {
    return this.http.put<TravelRequest>(`${this.baseUrl}/employee/requests/${id}/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteRequest(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employee/requests/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  // ================================
  // ✅ MANAGER ENDPOINTS
  // ================================

  getManagerRequests(): Observable<TravelRequest[]> {
    return this.http.get<TravelRequest[]>(`${this.baseUrl}/manager/requests/`, {
      headers: this.getAuthHeaders()
    });
  }

  getManagerRequestById(id: number): Observable<TravelRequest> {
    return this.http.get<TravelRequest>(`${this.baseUrl}/manager/requests/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  approveRequestByManager(id: number, note: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/manager/requests/${id}/approve/`, 
      { manager_note: note },
      { headers: this.getAuthHeaders() }
    );
  }

  rejectRequestByManager(id: number, note: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/manager/requests/${id}/reject/`, 
      { manager_note: note },
      { headers: this.getAuthHeaders() }
    );
  }

  requestInfoByManager(id: number, note: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/manager/requests/${id}/fi_request/`, 
      { manager_note: note },
      { headers: this.getAuthHeaders() }
    );
  }

  updateManagerRequest(id: number, data: Partial<TravelRequest>): Observable<TravelRequest> {
    return this.http.put<TravelRequest>(`${this.baseUrl}/manager/requests/${id}/update/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // ================================
  // ✅ ADMIN ENDPOINTS
  // ================================

  getAdminRequests(): Observable<TravelRequest[]> {
    return this.http.get<TravelRequest[]>(`${this.baseUrl}/myadmin/requests/`, {
      headers: this.getAuthHeaders()
    });
  }

  getAdminRequestById(id: number): Observable<TravelRequest> {
    return this.http.get<TravelRequest>(`${this.baseUrl}/myadmin/requests/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  adminRequestUpdate(id: number, data: Partial<TravelRequest>): Observable<TravelRequest> {
    return this.http.put<TravelRequest>(`${this.baseUrl}/myadmin/requests/${id}/update/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  closeRequestByAdmin(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/myadmin/requests/${id}/close/`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin EMPLOYEE
getAdminEmployees(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/myadmin/employees/`, {
    headers: this.getAuthHeaders()
  });
}

createAdminEmployee(data: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/myadmin/employees/`, data, {
    headers: this.getAuthHeaders()
  });
}

updateAdminEmployee(id: number, data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/myadmin/employees/${id}/`, data, {
    headers: this.getAuthHeaders()
  });
}

// Admin MANAGER
getAdminManagers(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/myadmin/managers/`, {
    headers: this.getAuthHeaders()
  });
}

createAdminManager(data: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/myadmin/managers/`, data, {
    headers: this.getAuthHeaders()
  });
}

updateAdminManager(id: number, data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/myadmin/managers/${id}/`, data, {
    headers: this.getAuthHeaders()
  });
}


}
