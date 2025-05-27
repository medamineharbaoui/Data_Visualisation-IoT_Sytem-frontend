import { Component, OnInit, inject } from '@angular/core';
import { SensorDataService } from '../services/sensor-data.service';
import { SensorData } from '../models/sensor-data';
import { ChartDataset, ChartOptions } from 'chart.js';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { BaseChartDirective } from 'ng2-charts';
import { format, subDays } from 'date-fns';

import { CoreService } from '../services/core.service';
import { Device } from '../models/device';

// ✅ New Import
import { MatSnackBar } from '@angular/material/snack-bar';

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, CategoryScale, Tooltip, Legend);

@Component({
  selector: 'app-sensor-data',
  standalone: true,
  imports: [BaseChartDirective, CommonModule, FormsModule, MaterialModule],
  templateUrl: './sensor-data.component.html',
})
export class SensorDataComponent implements OnInit {
  private readonly sensorDataService = inject(SensorDataService);
  private readonly coreService = inject(CoreService);
  private readonly snackBar = inject(MatSnackBar); // ✅ Inject snackbar

  sensorData: SensorData[] = [];
  selectedDate: Date = subDays(new Date(), 1);
  startTime: string = '00:00';
  endTime: string = '23:59';

  devices: Device[] = [];
  selectedDevice: string = '';

  charts: { type: string; data: ChartDataset[]; options: ChartOptions }[] = [];

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.coreService.getDevices().subscribe({
      next: (devices) => {
        this.devices = devices;

        if (devices.length > 0) {
          this.selectedDevice = devices[0].name;
          this.loadSensorData();
        } else {
          this.snackBar.open('You have no registered devices.', 'Dismiss', {
            duration: 5000,
            verticalPosition: 'top',
          });
        }
      },
      error: (err) => {
        console.error('Error loading devices:', err);
        this.snackBar.open(err.error || 'Error loading devices.', 'Dismiss', {
          duration: 5000,
          verticalPosition: 'top',
        });
      },
    });
  }

  onDeviceChange(): void {
    this.loadSensorData();
  }

  onDateChange(event: any): void {
    const dateValue = event.target.value;
    if (dateValue) {
      const newDate = new Date(dateValue);
      if (!isNaN(newDate.getTime())) {
        this.selectedDate = newDate;
        this.prepareChartData();
      } else {
        console.warn('Invalid date selected:', dateValue);
        this.selectedDate = subDays(new Date(), 1);
        event.target.value = format(this.selectedDate, 'yyyy-MM-dd');
      }
    } else {
      this.selectedDate = subDays(new Date(), 1);
      event.target.value = format(this.selectedDate, 'yyyy-MM-dd');
    }
  }

  onTimeChange(): void {
    this.prepareChartData();
  }

  loadSensorData(): void {
    if (!this.selectedDevice) return;

    this.sensorDataService.getSensorData(this.selectedDevice).subscribe({
      next: (data) => {
        this.sensorData = data;
        this.prepareChartData();
      },
      error: (error) => {
        console.error('Error fetching sensor data:', error);
        this.snackBar.open(error.error || 'Error fetching sensor data.', 'Dismiss', {
          duration: 5000,
          verticalPosition: 'top',
        });
      },
    });
  }

  prepareChartData(): void {
    if (!this.selectedDate || !this.startTime || !this.endTime) return;

    const start = new Date(`${format(this.selectedDate, 'yyyy-MM-dd')}T${this.startTime}`);
    const end = new Date(`${format(this.selectedDate, 'yyyy-MM-dd')}T${this.endTime}`);

    const filteredData = this.sensorData.filter((item) => {
      const timestamp = new Date(item.timestamp);
      return timestamp >= start && timestamp <= end;
    });

    const sensorTypes = [...new Set(filteredData.map((item) => item.sensorType))];
    const colors = ['rgba(99, 91, 255, 1)', 'rgba(255, 102, 146, 1)'];

    this.charts = sensorTypes.map((type, index) => {
      const sensorEntries = filteredData.filter((item) => item.sensorType === type);

      return {
        type,
        data: [
          {
            data: sensorEntries.map((item) => ({
              x: new Date(item.timestamp).getTime(),
              y: parseFloat(item.value),
            })),
            label: type,
            fill: false,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length],
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              type: 'time',
              min: start.toISOString(),
              max: end.toISOString(),
              time: {
                displayFormats: {
                  hour: 'HH:mm',
                  minute: 'HH:mm',
                },
              },
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                color: '#adb0bb',
                font: { size: 13, weight: 'normal' },
              },
              title: {
                display: true,
                text: 'Time',
                color: '#adb0bb',
                font: { size: 13, weight: 'normal' },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                color: '#adb0bb',
                font: { size: 13, weight: 'normal' },
              },
              title: {
                display: true,
                text: 'Sensor Value',
                color: '#adb0bb',
                font: { size: 13, weight: '400' },
              },
            },
          },
        },
      };
    });
  }
}
