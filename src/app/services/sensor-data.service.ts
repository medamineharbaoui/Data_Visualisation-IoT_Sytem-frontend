import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SensorData } from '../models/sensor-data';

@Injectable({
  providedIn: 'root'
})
export class SensorDataService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/sensor-data';

  getSensorData(deviceName: string): Observable<SensorData[]> {
    return this.http.get<SensorData[]>(`http://localhost:8080/api/sensor-data?deviceName=${deviceName}`);
  }
}