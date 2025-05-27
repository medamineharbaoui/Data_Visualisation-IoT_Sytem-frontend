import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { CoreService } from '../services/core.service';
import { Device } from '../models/device';
import { MatSnackBar } from '@angular/material/snack-bar';  // ✅ Import snackbar

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ]
})
export class DeviceComponent implements OnInit {
  devices: Device[] = [];
  showAddForm = false;

  newDevice: Device = {
    name: '',
    description: ''
  };

  constructor(
    private coreService: CoreService,
    private snackBar: MatSnackBar  // ✅ Inject snackbar
  ) { }

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.coreService.getDevices().subscribe({
      next: (devices) => (this.devices = devices),
      error: (err) => this.showSnackBar(err, true),
    });
  }

  // Validate the device name to ensure it contains only alphanumeric characters (no special chars or spaces)
  private isValidDeviceName(name: string): boolean {
    const regex = /^[a-zA-Z0-9]+$/; // Only alphanumeric characters allowed
    return regex.test(name);
  }

  addDevice(): void {
    if (this.newDevice.name && this.newDevice.description) {
      if (this.isValidDeviceName(this.newDevice.name)) {
        this.coreService.addDevice(this.newDevice).subscribe({
          next: (createdDevice) => {
            this.loadDevices(); // ✅ Reload full list instead of just push
            this.newDevice = { name: '', description: '' };
            this.showAddForm = false;
            this.showSnackBar('Device added successfully!');
          },
          error: (err) => this.showSnackBar(err, true),
        });
      } else {
        this.showSnackBar('Device name should only contain alphanumeric characters.', true);
      }
    } else {
      this.showSnackBar('Name and description are required', true);
    }
  }

  editDevice(device: Device): void {
    device.editing = true;
  }

  saveDevice(device: Device): void {
    if (device.name && device.description && device.id) {
      if (this.isValidDeviceName(device.name)) {
        this.coreService.editDevice(device.id, {
          name: device.name,
          description: device.description,
        }).subscribe({
          next: (updatedDevice) => {
            this.loadDevices(); // ✅ Reload instead of manual update
            device.editing = false;
            this.showSnackBar('Device updated successfully!');
          },
          error: (err) => this.showSnackBar(err, true),
        });
      } else {
        this.showSnackBar('Device name should only contain alphanumeric characters.', true);
      }
    } else {
      this.showSnackBar('Name, description, and ID are required.', true);
    }
  }

  deleteDevice(deviceId: number): void {
    if (confirm('Are you sure you want to delete this device?')) {
      this.coreService.deleteDevice(deviceId).subscribe({
        next: () => {
          this.loadDevices(); // ✅ Refresh list after deletion
          this.showSnackBar('Device deleted successfully!');
        },
        error: (err) => this.showSnackBar(`Error deleting device: ${err.message}`, true),
      });
    }
  }

  private showSnackBar(errorOrMessage: any, isError = false): void {
    const message =
      errorOrMessage?.error?.error && typeof errorOrMessage.error.error === 'string'
        ? errorOrMessage.error.error
        : typeof errorOrMessage === 'string'
          ? errorOrMessage
          : 'An unexpected error occurred.';

    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? 'snackbar-error' : 'snackbar-success'
    });
  }
}
