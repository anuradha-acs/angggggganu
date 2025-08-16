
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Leave {
  LEAVEID: string;
  EMPID: string;
  LEAVETYPEID: string;
  LEAVEDATE: string;
  LEAVEDAYSFROM: string;
  LEAVEDAYSTO: string;
  REASON: string;
  STATUS: string;
  REMARKS?: string;
  EMPNAME?: string;
  LEAVETYPE?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:5000/backend/api';

  constructor(private http: HttpClient) { }

  getLeaves(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaves.php`);
  }

  getMyLeaves(empId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaves.php?action=my-leaves&empId=${empId}`);
  }

  createLeave(leaveData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leaves.php`, leaveData);
  }

  updateLeaveStatus(leaveId: string, status: string, remarks: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/leaves.php`, {
      leaveId,
      status,
      remarks
    });
  }
}
