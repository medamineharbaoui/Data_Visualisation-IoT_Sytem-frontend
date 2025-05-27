# Data Visualization - IoT Fall Detection System - Frontend

## Overview
The frontend of the IoT Fall Detection System is built with **Angular 19**, designed to deliver **real-time data visualization** for IoT devices monitoring environmental and fall-related metrics. The core feature is the **Real-Time Dashboard**, which leverages **Grafana** for dynamic, high-performance visualization of live data streamed via MQTT with dynamic topic switching. The application includes dedicated pages for login, registration, real-time visualization, historical data analysis, and device management, navigated via a responsive sidebar.

## Features

### 1. Real-Time Dashboard
- **Core Feature**: Provides real-time visualization of IoT device data using **Grafana** dashboard components, optimized for low-latency monitoring of critical metrics.
- Displays the following metrics for the fall detection system:
  - Temperature (°C)
  - Humidity (%)
  - Presence (detected/not detected)
  - Motion (detected/not detected)
  - Fall Distance (cm)
  - Fall Status (detected/not detected)
- **Dynamic Device Selection**: Features a dropdown selector to choose a specific IoT device, triggering Grafana to update the MQTT topic (e.g., `<device-name>/esp32`) for seamless real-time data switching.
- **Grafana Integration**:
  - Configured to subscribe to MQTT topics via a broker (e.g., `broker.hivemq.com`).
  - Supports dynamic topic switching based on the selected device, ensuring real-time data reflects the chosen device’s metrics.
  - Provides interactive, customizable panels for each metric, enabling real-time monitoring of critical events like falls.
- Data is streamed from the backend’s sensor-data-service via MQTT, ensuring low-latency updates.

### 2. History Dashboard
- Displays historical data using **Chart.js** graphs for the same metrics as the Real-Time Dashboard.
- Includes filters for customized data views:
  - Select a specific device.
  - Choose a date .
  - Specify a time period (start time and end time).
- Retrieves historical data from the backend’s sensor-data-service, stored in a MySQL database.

### 3. Devices Page
- Manages IoT devices to ensure compatibility with MQTT topics:
  - **Add**: Register a new device, ensuring the device name matches the MQTT topic used by the IoT device (e.g., `<device-name>/esp32`).
  - **Edit**: Update existing device details.
  - **Delete**: Remove devices from the system.
- Communicates with the backend’s user-service via RESTful APIs for device management.

### 4. Login Page
- Authenticates users with credentials, integrating with the backend’s JWT-based user-service.
- Redirects to the registration page for new users.

### 5. Register Page
- Enables account creation with email verification via Google SMTP, handled by the backend’s user-service.
- Validates input fields and redirects to the login page upon successful registration.

### 6. Sidebar
- Provides navigation to the Real-Time Dashboard, History Dashboard, and Devices pages.
- Built with Angular’s component-based architecture and styled with Angular Material for responsive, user-friendly navigation.

## Technologies Used
- **Angular 19**: Framework for building a multi-page application with modular components.
- **Grafana**: Primary tool for real-time data visualization, integrated with MQTT for dynamic topic-based data streaming.
- **Chart.js**: For historical data visualizations with interactive graphs.
- **Angular Material**: For responsive UI components and consistent styling across pages.
- **RESTful APIs**: For communication with the backend’s user-service and sensor-data-service.
- **MQTT**: For real-time data streaming to Grafana, enabling dynamic topic updates based on device selection.


**Link to the Backend Repository**:
   ```bash
   https://github.com/medamineharbaoui/IoT-Fall_Detection-backend.git
   
   ```

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/medamineharbaoui/Data_Visualisation-IoT_Sytem-frontend.git
   cd Data_Visualisation-IoT_Sytem-frontend
   ```

2. **Install Dependencies**:
   - Ensure **Node.js** (v18 or higher) and **Angular CLI** (v19) are installed.
   ```bash
   npm install
   ```

3. **Set Up Grafana**:
   - Install Grafana locally or use a hosted instance (`http://localhost:3000` by default).
   - Configure an MQTT data source:
     - Broker URL: `tcp://broker.hivemq.com:1883` 
     - Topics: Use a wildcard for dynamic device selection (e.g., `$device/esp32/+`).
   - Create a Grafana dashboard with panels for each metric (temperature, humidity, presence, motion, fall distance, fall status).
   - Add a dashboard variable for device names to enable dynamic topic switching (e.g., `$device/esp32`).
   - Embed Grafana panels in the Angular Real-Time Dashboard page using iframes or the Grafana API.

4. **Run the Application**:
   ```bash
   ng serve
   ```
   - The app will be available at `http://localhost:4200`.

5. **Access the Application**:
   - Navigate to `http://localhost:4200` in a browser.
   - Register a new account or log in with existing credentials to access the dashboard pages.

## Usage
- **Login/Register**: Authenticate via the dedicated login or register page to access the system.
- **Real-Time Dashboard**:
  - Select a device from the dropdown to view live metrics in Grafana panels.
  - Grafana dynamically updates the MQTT topic to reflect the selected device’s data.
  - Monitor critical metrics like fall detection in real-time for immediate response.
- **History Dashboard**: Filter by device, date, and time to view historical data in Chart.js graphs.
- **Devices**: Add, edit, or delete devices, ensuring MQTT topic names align with the embedded system.
- **Navigate**: Use the sidebar to switch between the Real-Time Dashboard, History Dashboard, and Devices pages.

## Future Enhancements
- Enhance Grafana dashboards with advanced visualizations (alerts for fall events).
- Implement real-time notifications for fall detection using Grafana’s alerting system.
- Support simultaneous visualization of multiple devices in Grafana panels.
