import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings, defaults } from '../config';
import { Observable } from 'rxjs';
import { Device } from '../models/device';



@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private optionsSignal = signal<AppSettings>(defaults);

  private userBaseUrl = 'http://localhost:8080/users';
  private deviceBaseUrl = 'http://localhost:8080/users/devices'; // ✅ Your device endpoint

  constructor(private http: HttpClient) {}

  getOptions() {
    return this.optionsSignal();
  }

  setOptions(options: Partial<AppSettings>) {
    this.optionsSignal.update((current) => ({
      ...current,
      ...options,
    }));
  }

  // === User methods ===
  loginUser(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.userBaseUrl}/login`, payload);
  }

  registerUser(payload: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.userBaseUrl}/register`, payload);
  }

  // === ✅ Device methods ===
  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.deviceBaseUrl);
  }

  addDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(this.deviceBaseUrl, device);
  }


  // Edit device
editDevice(id: number, deviceData: any): Observable<any> {
  return this.http.put(`${this.deviceBaseUrl}/${id}`, deviceData, {
  });
}

// Delete device
deleteDevice(id: number): Observable<any> {
  return this.http.delete(`${this.deviceBaseUrl}/${id}`, {
  });
}

}
