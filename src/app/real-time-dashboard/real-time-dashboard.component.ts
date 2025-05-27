import { Component, OnInit, inject } from '@angular/core';
import { CoreService } from '../services/core.service';
import { Device } from '../models/device';
import { MaterialModule } from '../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-real-time-dashboard',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './real-time-dashboard.component.html',
  styleUrls: ['./real-time-dashboard.component.scss'] // fix typo styleUrls
})
export class RealTimeDashboardComponent implements OnInit {
  private readonly coreService = inject(CoreService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly sanitizer = inject(DomSanitizer);

  devices: Device[] = [];
  selectedDevice: string = '';
  
  // Changed to array for slice usage
  iframeUrls: SafeResourceUrl[] = [];

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.coreService.getDevices().subscribe({
      next: (devices) => {
        this.devices = devices;
        if (devices.length > 0) {
          this.selectedDevice = devices[0].name;
          this.onDeviceChange(); // Populate iframe URLs
        } else {
          this.snackBar.open('No devices found.', 'Dismiss', {
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
    const base = 'http://localhost:3000/d-solo/aeksfe57bc5xce/esp32-sensor-dashboard?orgId=1&from=1747487655404&to=1747487955404&timezone=browser&var-deviceName=&var-query0=&var-device=';
    const suffix = '&editIndex=0&tab=transformations&theme=light&__feature.dashboardSceneSolo';

    const panelIds = [3, 7, 10, 9, 11, 8]; // order must match your template titles

    this.iframeUrls = panelIds.map(panelId => {
      const fullUrl = `${base}${encodeURIComponent(this.selectedDevice)}${suffix}&panelId=${panelId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    });
  }
}
