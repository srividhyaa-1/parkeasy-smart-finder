# ESP32 Parking Slots Integration

## Overview
The Parkeasy application now includes a dedicated **3rd page** for viewing real-time parking slot status directly from an ESP32 microcontroller. This page removes the demo mode and only shows actual data from your ESP32 device.

## Features

### SlotsDisplayPage Component
- **Real-time updates**: Fetches slot status every 2 seconds
- **Live connection indicator**: Shows WiFi icon (animated when connected)
- **No demo mode**: Only displays actual data from ESP32
- **Statistics display**: Shows free slots, occupied slots, and total slots
- **Error handling**: Displays connection errors with helpful guidance
- **Responsive design**: Works on mobile and desktop

## Configuration

### 1. Set Your ESP32 URL
The URL is now defined in a single configuration file. Update it once and all components will use the new value.

**File**: `src/lib/config.ts`
```typescript
export const ESP32_URL = "http://10.44.214.79/distance"; // replace with your device IP or mock server
```

You only need to change the address here; every hook/component imports this constant.

### 2. Expected ESP32 Response Format
Your ESP32 endpoint should return JSON in this format:

```json
{
  "slot1": "free",
  "slot2": "occupied",
  "slot3": "free",
  "slot4": "occupied",
  "slot5": "free",
  "slot6": "occupied"
}
```

Each slot value must be either `"free"` or `"occupied"`.

### 3. CORS Configuration
Make sure your ESP32 responds with appropriate CORS headers:
```
Access-Control-Allow-Origin: *
Content-Type: application/json
```

> **Real-time fetching:** The app attempts to fetch slot status from the ESP32 endpoint every 2 seconds. If the fetch fails, an error message is displayed instead of falling back to simulation.## Using the Feature

### From the Welcome Page
1. Click the **"View Parking Slots (ESP32)"** button
2. The app will attempt to connect to your ESP32
3. View real-time slot status with live updates

### What You'll See

#### When Connected ✓
- Green status indicator (animated WiFi icon)
- Statistics cards showing slot counts
- Grid of slots with green (free) or red (occupied) status
- Last update timestamp

#### When Disconnected ✗
- Red WiFi icon
- Error message with the connection details
- "Retry Connection" button to attempt reconnection
- Instructions on how to fix the issue

## Testing with Mock Server

If your ESP32 isn't ready yet, use the included mock server and point the configuration constant to localhost:

### 1. Start the Mock Server
```bash
node esp32-mock-server.js
```

The server will run on `http://localhost:3000/`

### 2. Update the ESP32_URL in the configuration file
```typescript
// src/lib/config.ts
export const ESP32_URL = "http://localhost:3000/";
```

### 3. Run the App
```bash
npm run dev
```

### 4. Test the Feature
- Click "View Parking Slots (ESP32)"
- You should see random slot statuses updating every 2 seconds
If your ESP32 isn't ready yet, use the included mock server and point the config constant to localhost:

1. Start the Mock Server
```bash
node esp32-mock-server.js
```

The server will run on `http://localhost:3000/`

2. Update the ESP32_URL in the configuration file
```typescript
// src/lib/config.ts
export const ESP32_URL = "http://localhost:3000/";
```

3. Run the App
```bash
npm run dev
```
### 3. Run the App
```bash
npm run dev
```

### 4. Test the Feature
- Click "View Parking Slots (ESP32)"
- You should see random slot statuses updating every 2 seconds

## Component Structure

### New Component: `SlotsDisplayPage.tsx`
- Location: `src/components/SlotsDisplayPage.tsx`
- Purpose: Display real-time ESP32 slot data
- Features:
  - Direct ESP32 communication (no demo mode)
  - Automatic refresh (2-second interval)
  - Connection status indicator
  - Error handling with retry
  - Responsive grid layout

### Updated Components:
- **WelcomePage.tsx**: Added "View Parking Slots (ESP32)" button
- **Index.tsx**: Added ESP32 slots navigation route

## API Integration Details

### Fetch Configuration
- **Method**: GET
- **Headers**: `Accept: application/json`
- **Timeout**: Connection errors handled gracefully
- **Refresh Rate**: 2 seconds (configurable)

### Error Handling
The component handles:
- Network timeouts
- Invalid responses
- Missing slot data
- Malformed JSON
- HTTP errors (4xx, 5xx)

## Customization

### Change Update Frequency
In `SlotsDisplayPage.tsx`, modify the interval:
```typescript
const interval = setInterval(fetchSlotStatus, 2000); // 2000ms = 2 seconds
```

### Modify Slot Grid Layout
In `SlotsDisplayPage.tsx`, update the grid classes:
```typescript
className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3"
```

### Customize Colors
- **Free slot color**: `bg-green-100 border-green-500 text-green-700`
- **Occupied slot color**: `bg-red-100 border-red-500 text-red-700`
- **Connected status**: `text-green-300 animate-pulse`
- **Disconnected status**: `text-red-300`

## Troubleshooting

### "Unable to Connect" Error
1. Verify ESP32 IP address is correct
2. Check ESP32 is powered on and running
3. Ensure ESP32 and app are on same network
4. Check firewall settings
5. Verify CORS headers in ESP32 response

### Slots Not Updating
- Check the "Last updated" timestamp
- Verify network connection is stable
- Check ESP32 server logs for errors
- Ensure `/` endpoint is available

### Wrong Slot Data Format
The response must be valid JSON with exact format:
```json
{
  "slotN": "free|occupied"
}
```

## Development Notes

- The component uses no external libraries for HTTP requests (vanilla fetch API)
- Real-time updates handled with `useCallback` and `useEffect`
- TypeScript strict mode enabled
- Responsive design with Tailwind CSS
- Accessible error messages and status indicators

## Next Steps

1. Configure your ESP32 IP address
2. Ensure your ESP32 serves slot data at the configured endpoint
3. Test with the mock server first
4. Deploy to production with your actual ESP32

---

**Last Updated**: January 18, 2026  
**Version**: 1.0.0
