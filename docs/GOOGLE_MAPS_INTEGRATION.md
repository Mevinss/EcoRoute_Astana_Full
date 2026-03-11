# Google Maps API Integration Guide

## Overview
This guide explains how to integrate Google Maps API into the EcoRoute Astana application to display the map of Astana with eco-friendly routes.

## Prerequisites
You need to obtain a Google Maps API key from Google Cloud Console.

## Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API** (required for displaying the map)
   - **Directions API** (required for route navigation)
   - **Geocoding API** (optional, for address search)
4. Navigate to **APIs & Services > Credentials**
5. Click **Create Credentials > API Key**
6. Copy your API key

### Restrict Your API Key (Recommended)
For security, restrict your API key:
- **Application restrictions**: HTTP referrers
- **Add referrers**:
  - `http://localhost:3000/*` (for development)
  - `https://yourdomain.com/*` (for production)
- **API restrictions**: Restrict to enabled APIs only

## Step 2: Add API Key to Environment Variables

### Frontend Configuration

1. Create or update `.env.local` in the `frontend` directory:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

2. Update `frontend/next.config.js` to allow Google Maps domains:
```javascript
const nextConfig = {
  // ... existing config
  images: {
    domains: ['maps.googleapis.com', 'maps.gstatic.com'],
  },
};
```

## Step 3: Install Google Maps Library

In the frontend directory, install the Google Maps React library:
```bash
cd frontend
npm install @react-google-maps/api
```

## Step 4: Update Map Component

Replace the MapLibre implementation in `frontend/src/app/map/page.tsx`:

### Old Implementation (MapLibre):
```typescript
const maplibregl = typeof window !== 'undefined' ? require('maplibre-gl') : null;
import 'maplibre-gl/dist/maplibre-gl.css';
```

### New Implementation (Google Maps):
```typescript
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 51.1605,
  lng: 71.4306,
};

const mapOptions = {
  zoom: 12,
  mapTypeId: 'roadmap',
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  fullscreenControl: true,
};
```

### Update the Map Rendering:
```typescript
<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
  <GoogleMap
    mapContainerStyle={mapContainerStyle}
    center={center}
    zoom={12}
    options={mapOptions}
    onLoad={(map) => {
      mapRef.current = map;
      setMapLoaded(true);
    }}
  >
    {/* Add markers for routes and POIs */}
    {routesData?.routes?.map((route: any) => (
      <Marker
        key={route.id}
        position={{ lat: route.start_lat, lng: route.start_lng }}
        title={route.name_kz}
      />
    ))}
    
    {/* Add polylines for routes */}
    {selectedRoute?.geojson && (
      <Polyline
        path={selectedRoute.geojson.coordinates.map((coord: [number, number]) => ({
          lat: coord[1],
          lng: coord[0],
        }))}
        options={{
          strokeColor: '#22C55E',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        }}
      />
    )}
  </GoogleMap>
</LoadScript>
```

## Step 5: Update Route Navigation

For the navigation feature (`/api/navigate`), you have two options:

### Option A: Keep OSRM (Current)
Continue using OpenStreetMap Routing Machine for eco-friendly routes (free, no API key needed).

### Option B: Use Google Directions API
Update `backend/src/routes/navigate.routes.ts`:

```typescript
// Add to .env
GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE

// In navigate.routes.ts
const GOOGLE_DIRECTIONS_API = 'https://maps.googleapis.com/maps/api/directions/json';

router.get('/', async (req, res) => {
  const { from_lat, from_lng, to_lat, to_lng, mode = 'walking' } = req.query;
  
  const travelMode = mode === 'cycling' ? 'bicycling' : 'walking';
  const url = `${GOOGLE_DIRECTIONS_API}?origin=${from_lat},${from_lng}&destination=${to_lat},${to_lng}&mode=${travelMode}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  // Process and return route data
});
```

## Step 6: Test the Integration

1. Start the development servers:
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

2. Navigate to http://localhost:3000/map
3. Verify that:
   - Map displays Astana correctly
   - Routes are shown on the map
   - Navigation works between points

## Cost Considerations

**Note**: Pricing information below is historical (2024). Please verify current rates at [Google Cloud Pricing](https://cloud.google.com/maps-platform/pricing).

Google Maps API pricing (historical reference):
- **Maps JavaScript API**: $7 per 1000 loads (first 28,000 free per month)
- **Directions API**: $5 per 1000 requests (first 40,000 free per month)

For development and small-scale use, you'll likely stay within the free tier.

## Alternative: Keep MapLibre (Current Setup)

If you want to avoid Google Maps costs, the current MapLibre GL implementation works well:
- **Advantages**: Free, open-source, good performance
- **Disadvantages**: Requires tile server configuration, less familiar to users
- **Current provider**: CartoDB (free tier available)

## Troubleshooting

### Map not displaying
- Check browser console for API key errors
- Verify API key restrictions allow your domain
- Ensure Maps JavaScript API is enabled

### Routes not showing
- Check that GeoJSON coordinates are in correct format [lng, lat]
- Google Maps expects {lat, lng} format, not [lng, lat]

### Performance issues
- Implement map clustering for many markers
- Lazy load route data
- Use map bounds to load only visible routes

## Support

For issues specific to Google Maps integration, refer to:
- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [@react-google-maps/api Documentation](https://react-google-maps-api-docs.netlify.app/)

## Current Setup (No API Key Needed)

The application currently uses MapLibre GL with CartoDB tiles, which doesn't require an API key and works out of the box. This is suitable for development and production use without additional costs.
