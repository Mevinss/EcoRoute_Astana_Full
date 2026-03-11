'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';

const maplibregl = typeof window !== 'undefined' ? require('maplibre-gl') : null;
import 'maplibre-gl/dist/maplibre-gl.css';

const ROUTE_TYPES = [
  { key: 'all', label: 'Барлығы', icon: '🌍', color: '#22C55E' },
  { key: 'walking', label: 'Жаяу', icon: '🚶', color: '#38BDF8' },
  { key: 'cycling', label: 'Велосипед', icon: '🚴', color: '#FBBF24' },
  { key: 'mixed', label: 'Аралас', icon: '🔄', color: '#A78BFA' },
];

// Average car emission factor: ~170 g CO₂ per km (used to calculate CO₂ savings vs driving)
const CO2_G_PER_KM = 170;

const DIFFICULTY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: 'Оңай', color: '#22C55E', bg: '#DCFCE7' },
  medium: { label: 'Орташа', color: '#FBBF24', bg: '#FEF3C7' },
  hard: { label: 'Қиын', color: '#FB7185', bg: '#FFE4E6' },
};

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const fromMarkerRef = useRef<any>(null);
  const toMarkerRef = useRef<any>(null);
  const [activeType, setActiveType] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showRoutesList, setShowRoutesList] = useState(false);
  const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);

  // ── Route Planner state ──────────────────────────────────────
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [planStep, setPlanStep] = useState<'from' | 'to'>('from');
  const [fromPoint, setFromPoint] = useState<[number, number] | null>(null);
  const [toPoint, setToPoint] = useState<[number, number] | null>(null);
  const [navMode, setNavMode] = useState<'walking' | 'cycling'>('walking');
  const [navRoute, setNavRoute] = useState<any>(null);
  const [navStats, setNavStats] = useState<{ distance_m: number; duration_s: number } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navError, setNavError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [selectedPredefinedRoute, setSelectedPredefinedRoute] = useState<any>(null);

  const { data: routesData, isLoading } = useQuery({
    queryKey: ['routes', activeType],
    queryFn: async () => {
      const params = activeType !== 'all' ? `?type=${activeType}` : '';
      const res = await api.get(`/routes${params}`);
      return res.data;
    },
  });

  // Query for cycling routes only (for predefined route selection)
  const { data: cyclingRoutesData } = useQuery({
    queryKey: ['cycling-routes'],
    queryFn: async () => {
      const res = await api.get('/routes?type=cycling');
      return res.data;
    },
    enabled: navMode === 'cycling' && plannerOpen,
  });

  const { data: poisData } = useQuery({
    queryKey: ['pois'],
    queryFn: async () => {
      const res = await api.get('/pois');
      return res.data;
    },
  });

  useEffect(() => {
    if (map.current || !mapContainer.current || !maplibregl) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [71.4306, 51.1605],
      zoom: 12,
      attributionControl: false,
    });
    map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      'bottom-right'
    );
    map.current.on('load', () => setMapLoaded(true));
    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded || !routesData?.routes) return;
    if (map.current.getSource('routes')) {
      map.current.removeLayer('routes-layer');
      map.current.removeLayer('routes-glow');
      map.current.removeSource('routes');
    }
    const features = routesData.routes
      .filter((r: any) => r.geojson)
      .map((r: any) => {
        let geometry = r.geojson;
        if (typeof geometry === 'string') geometry = JSON.parse(geometry);
        return {
          type: 'Feature' as const,
          properties: {
            id: r.id,
            name: r.name_kz,
            type: r.type,
            color:
              r.type === 'walking'
                ? '#38BDF8'
                : r.type === 'cycling'
                  ? '#FBBF24'
                  : r.type === 'mixed'
                    ? '#A78BFA'
                    : '#22C55E',
          },
          geometry,
        };
      });
    if (features.length === 0) return;

    map.current.addSource('routes', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features },
    });
    map.current.addLayer({
      id: 'routes-glow',
      type: 'line',
      source: 'routes',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 10,
        'line-opacity': 0.25,
        'line-blur': 4,
      },
    });
    map.current.addLayer({
      id: 'routes-layer',
      type: 'line',
      source: 'routes',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 4,
        'line-opacity': 0.95,
      },
    });
  }, [routesData, mapLoaded]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !poisData?.pois || !maplibregl) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    poisData.pois.forEach((poi: any) => {
      const el = document.createElement('div');
      el.innerHTML = poi.icon || '📍';
      el.style.cssText =
        'font-size:22px;cursor:pointer;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));transition:all 0.2s;';
      el.onmouseenter = () => {
        el.style.transform = 'scale(1.3) translateY(-2px)';
      };
      el.onmouseleave = () => {
        el.style.transform = 'scale(1)';
      };
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
      }).setHTML(
        '<div style="padding:14px 18px;font-family:Inter,system-ui;background:#FFFFFF;border-radius:12px;">' +
          '<strong style="font-size:15px;color:#14532D;font-weight:700;">' +
          (poi.name_kz || poi.name) +
          '</strong>' +
          '<p style="margin:8px 0 0;font-size:13px;color:#6B7280;line-height:1.4;">' +
          (poi.description || '') +
          '</p>' +
          (poi.eco_certified
            ? '<div style="margin-top:10px;font-size:12px;color:#22C55E;font-weight:600;background:#DCFCE7;padding:6px 10px;border-radius:8px;display:inline-block;">✓ Eco certified</div>'
            : '') +
          '</div>'
      );
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([poi.lng, poi.lat])
        .setPopup(popup)
        .addTo(map.current!);
      markersRef.current.push(marker);
    });
  }, [poisData, mapLoaded]);

  const handleSelectRoute = (route: any) => {
    setSelectedRoute(route);
    setShowRoutesList(false);
    if (map.current && route.geojson) {
      let geom = route.geojson;
      if (typeof geom === 'string') geom = JSON.parse(geom);
      if (geom.coordinates?.length > 0) {
        map.current.flyTo({
          center: geom.coordinates[Math.floor(geom.coordinates.length / 2)],
          zoom: 14,
          duration: 1200,
        });
      }
    }
  };

  // ── Route Planner: map click handler ──────────────────────────
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const onClick = (e: any) => {
      if (!plannerOpen) return;
      // Don't allow point selection if predefined route is selected
      if (selectedPredefinedRoute) return;
      const { lng, lat } = e.lngLat;
      if (planStep === 'from') {
        setFromPoint([lng, lat]);
        setPlanStep('to');
      } else {
        setToPoint([lng, lat]);
      }
    };
    map.current.on('click', onClick);
    return () => { map.current?.off('click', onClick); };
  }, [mapLoaded, plannerOpen, planStep, selectedPredefinedRoute]);

  // ── Route Planner: place markers when points change ───────────
  useEffect(() => {
    if (!map.current || !maplibregl) return;
    fromMarkerRef.current?.remove();
    if (fromPoint) {
      const el = document.createElement('div');
      el.innerHTML = '🟢';
      el.style.cssText = 'font-size:26px;cursor:pointer;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5));';
      fromMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat(fromPoint)
        .setPopup(new maplibregl.Popup({ closeButton: false }).setText('Бастапқы нүкте'))
        .addTo(map.current);
    }
  }, [fromPoint, mapLoaded]);

  useEffect(() => {
    if (!map.current || !maplibregl) return;
    toMarkerRef.current?.remove();
    if (toPoint) {
      const el = document.createElement('div');
      el.innerHTML = '🔴';
      el.style.cssText = 'font-size:26px;cursor:pointer;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5));';
      toMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat(toPoint)
        .setPopup(new maplibregl.Popup({ closeButton: false }).setText('Соңғы нүкте'))
        .addTo(map.current);
    }
  }, [toPoint, mapLoaded]);

  // ── Route Planner: display calculated route on map ────────────
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    if (map.current.getSource('nav-route')) {
      map.current.removeLayer('nav-route-outline');
      map.current.removeLayer('nav-route-line');
      map.current.removeSource('nav-route');
    }
    if (!navRoute) return;
    map.current.addSource('nav-route', {
      type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry: navRoute },
    });
    map.current.addLayer({
      id: 'nav-route-outline',
      type: 'line',
      source: 'nav-route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#FFFFFF',
        'line-width': 10,
        'line-opacity': 0.5,
      },
    });
    map.current.addLayer({
      id: 'nav-route-line',
      type: 'line',
      source: 'nav-route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': navMode === 'cycling' ? '#FBBF24' : '#38BDF8',
        'line-width': 5,
        'line-opacity': 0.95,
      },
    });

    // Zoom to fit the route
    if (navRoute.coordinates?.length) {
      const lngs = navRoute.coordinates.map((c: number[]) => c[0]);
      const lats = navRoute.coordinates.map((c: number[]) => c[1]);
      map.current.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        { padding: 60, duration: 1200 }
      );
    }
  }, [navRoute, mapLoaded, navMode]);

  // ── Route Planner: get user's current GPS location ────────────
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
        setFromPoint([longitude, latitude]);
        setPlanStep('to');
        setGeoLoading(false);
        map.current?.flyTo({ center: [longitude, latitude], zoom: 15, duration: 1000 });
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // ── Route Planner: call backend navigate API ──────────────────
  const handleNavigate = useCallback(async () => {
    if (!fromPoint || !toPoint) return;
    setIsNavigating(true);
    setNavError(null);
    setNavRoute(null);
    setNavStats(null);
    try {
      const res = await api.get('/navigate', {
        params: {
          from_lat: fromPoint[1],
          from_lng: fromPoint[0],
          to_lat: toPoint[1],
          to_lng: toPoint[0],
          mode: navMode,
        },
      });
      setNavRoute(res.data.geojson);
      setNavStats({ distance_m: res.data.distance_m, duration_s: res.data.duration_s });
    } catch (err: any) {
      setNavError(err?.response?.data?.error || 'Маршрут алу кезінде қате орын алды');
    } finally {
      setIsNavigating(false);
    }
  }, [fromPoint, toPoint, navMode]);

  // ── Route Planner: reset everything ──────────────────────────
  const resetPlanner = useCallback(() => {
    setFromPoint(null);
    setToPoint(null);
    setNavRoute(null);
    setNavStats(null);
    setNavError(null);
    setSelectedPredefinedRoute(null);
    setPlanStep('from');
    fromMarkerRef.current?.remove();
    toMarkerRef.current?.remove();
    fromMarkerRef.current = null;
    toMarkerRef.current = null;
    if (map.current?.getSource('nav-route')) {
      map.current.removeLayer('nav-route-outline');
      map.current.removeLayer('nav-route-line');
      map.current.removeSource('nav-route');
    }
  }, []);

  // ── Handle predefined cycling route selection ─────────────────
  const handleSelectPredefinedRoute = useCallback((route: any) => {
    setSelectedPredefinedRoute(route);
    setNavRoute(route.geojson);
    setNavStats({
      distance_m: route.distance_km * 1000,
      duration_s: route.duration_min * 60,
    });
    setFromPoint(null);
    setToPoint(null);
    setNavError(null);
  }, []);

  const togglePlanner = useCallback(() => {
    if (plannerOpen) {
      resetPlanner();
    }
    setPlannerOpen((v) => !v);
  }, [plannerOpen, resetPlanner]);

  const handleModeChange = useCallback((mode: 'walking' | 'cycling') => {
    setNavMode(mode);
    setNavRoute(null);
    setNavStats(null);
    setSelectedPredefinedRoute(null);
  }, []);

  const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h} сағ ${m} мин` : `${m} мин`;
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} км` : `${meters} м`;
  };

  const totalCO2 =
    routesData?.routes?.reduce(
      (s: number, r: any) => s + (r.co2_saved_g || 0),
      0
    ) || 0;

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 50%, #FFFFFF 100%)',
        color: '#14532D',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* SIDEBAR */}
      <div
        className="flex flex-col w-[340px] transition-all duration-300"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)',
          borderRight: '2px solid #BBF7D0',
          boxShadow: '4px 0 24px rgba(34, 197, 94, 0.08)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 24px 20px',
            borderBottom: '2px solid #DCFCE7',
            background: 'linear-gradient(135deg, #DCFCE7 0%, #ECFDF5 100%)',
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 20,
                boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
                textDecoration: 'none',
              }}
            >
              🌿
            </Link>
            <div>
              <h1
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                  letterSpacing: -0.5,
                  margin: 0,
                  lineHeight: 1,
                  color: '#14532D',
                }}
              >
                Eco<span style={{ color: '#22C55E' }}>Route</span>
              </h1>
              <p
                style={{
                  fontSize: 10,
                  color: '#16A34A',
                  margin: '3px 0 0',
                  letterSpacing: 0.5,
                  fontWeight: 600,
                }}
              >
                АСТАНА • ҚАЗАҚСТАН
              </p>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {ROUTE_TYPES.map((t) => {
              const active = activeType === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveType(t.key)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 24,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    border: active ? 'none' : '2px solid #BBF7D0',
                    background: active
                      ? `linear-gradient(135deg, ${t.color}, ${t.color}dd)`
                      : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#16A34A',
                    boxShadow: active
                      ? `0 4px 16px ${t.color}40`
                      : '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  {t.icon} {t.label}
                </button>
              );
            })}
          </div>

          {/* Plan Route toggle */}
          <button
            onClick={togglePlanner}
            style={{
              marginTop: 12,
              width: '100%',
              padding: '12px 20px',
              borderRadius: 16,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.25s',
              border: 'none',
              background: plannerOpen
                ? 'linear-gradient(135deg, #16A34A, #15803D)'
                : 'linear-gradient(135deg, #22C55E, #16A34A)',
              color: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(34, 197, 94, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {plannerOpen ? '✕ Жоспарлауды жабу' : '🗺️ Маршрут жоспарлау'}
          </button>
        </div>

        {/* ── ROUTE PLANNER PANEL ── */}
        {plannerOpen && (
          <div
            style={{
              padding: '16px',
              borderBottom: '2px solid #DCFCE7',
              background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)',
            }}
          >
            {/* Mode selector */}
            <div className="flex gap-2 mb-4">
              {[
                { key: 'walking', label: 'Жаяу', icon: '🚶' },
                { key: 'cycling', label: 'Велосипед', icon: '🚴' },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => handleModeChange(m.key as 'walking' | 'cycling')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: navMode === m.key ? 'none' : '2px solid #BBF7D0',
                    background: navMode === m.key
                      ? (m.key === 'cycling' ? 'linear-gradient(135deg, #FBBF24, #F59E0B)' : 'linear-gradient(135deg, #38BDF8, #0EA5E9)')
                      : '#FFFFFF',
                    color: navMode === m.key ? '#FFFFFF' : '#16A34A',
                    boxShadow: navMode === m.key ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  }}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* Cycling mode: Predefined routes selector */}
            {navMode === 'cycling' && cyclingRoutesData?.routes && (
              <div
                style={{
                  marginBottom: 16,
                  padding: '12px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #FEF3C7, #FEF9C3)',
                  border: '2px solid #FCD34D',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#78350F', marginBottom: 10 }}>
                  🚴 Дайын велосипед маршруттары
                </div>
                <div className="flex flex-col gap-2">
                  {cyclingRoutesData.routes
                    .filter((r: any) => r.name_kz.includes('Велосипед:') || r.name_ru.includes('Велосипед:'))
                    .map((route: any) => (
                      <button
                        key={route.id}
                        onClick={() => handleSelectPredefinedRoute(route)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: selectedPredefinedRoute?.id === route.id ? '2px solid #F59E0B' : '2px solid #FDE047',
                          background: selectedPredefinedRoute?.id === route.id ? '#FEF3C7' : '#FFFFFF',
                          color: '#78350F',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{route.name_kz}</div>
                        <div style={{ fontSize: 10, color: '#92400E' }}>
                          {route.distance_km} км • {route.duration_min} мин
                        </div>
                      </button>
                    ))}
                </div>
                <div style={{ fontSize: 10, color: '#92400E', marginTop: 8, textAlign: 'center' }}>
                  немесе картада өзіңіз нүктелерді таңдаңыз ⬇️
                </div>
              </div>
            )}

            {/* Walking mode hint */}
            {navMode === 'walking' && (
              <div
                style={{
                  marginBottom: 12,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  fontSize: 11,
                  color: '#1E40AF',
                  textAlign: 'center',
                }}
              >
                🚶 Жаяу режимде кез келген екі нүктеге маршрут құрыңыз
              </div>
            )}

            {/* Start point row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
                padding: '10px 14px',
                borderRadius: 12,
                background: planStep === 'from' && !fromPoint ? 'rgba(34,197,94,0.08)' : '#FFFFFF',
                border: planStep === 'from' && !fromPoint ? '2px solid #22C55E' : '2px solid #E5E7EB',
              }}
            >
              <span style={{ fontSize: 20 }}>🟢</span>
              <span style={{ flex: 1, fontSize: 13, color: fromPoint ? '#14532D' : '#9CA3AF', fontWeight: fromPoint ? 600 : 400 }}>
                {fromPoint ? `${fromPoint[1].toFixed(5)}, ${fromPoint[0].toFixed(5)}` : 'Картаны басып бастапқы нүкте таңдаңыз'}
              </span>
              <button
                onClick={getUserLocation}
                disabled={geoLoading}
                title="Менің орналасуымды пайдалану"
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: geoLoading ? 'default' : 'pointer',
                  border: 'none',
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  color: '#FFFFFF',
                  opacity: geoLoading ? 0.7 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {geoLoading ? '⏳' : '📍 Менің орным'}
              </button>
            </div>

            {/* End point row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
                padding: '10px 14px',
                borderRadius: 12,
                background: planStep === 'to' && !toPoint ? 'rgba(239,68,68,0.06)' : '#FFFFFF',
                border: planStep === 'to' && !toPoint ? '2px solid #EF4444' : '2px solid #E5E7EB',
              }}
            >
              <span style={{ fontSize: 20 }}>🔴</span>
              <span style={{ flex: 1, fontSize: 13, color: toPoint ? '#14532D' : '#9CA3AF', fontWeight: toPoint ? 600 : 400 }}>
                {toPoint ? `${toPoint[1].toFixed(5)}, ${toPoint[0].toFixed(5)}` : 'Картаны басып соңғы нүкте таңдаңыз'}
              </span>
              {toPoint && (
                <button
                  onClick={() => { setToPoint(null); setPlanStep('to'); setNavRoute(null); setNavStats(null); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 16 }}
                >✕</button>
              )}
            </div>

            {/* Build route button */}
            <button
              onClick={handleNavigate}
              disabled={!fromPoint || !toPoint || isNavigating}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 800,
                cursor: (!fromPoint || !toPoint || isNavigating) ? 'default' : 'pointer',
                border: 'none',
                background: (!fromPoint || !toPoint || isNavigating)
                  ? '#E5E7EB'
                  : 'linear-gradient(135deg, #22C55E, #16A34A)',
                color: (!fromPoint || !toPoint || isNavigating) ? '#9CA3AF' : '#FFFFFF',
                boxShadow: (!fromPoint || !toPoint || isNavigating) ? 'none' : '0 4px 16px rgba(34,197,94,0.35)',
                transition: 'all 0.2s',
              }}
            >
              {isNavigating ? '⏳ Маршрут есептелуде...' : '🗺️ Маршрутты есептеу'}
            </button>

            {/* Error */}
            {navError && (
              <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: '#FEE2E2', color: '#DC2626', fontSize: 13, fontWeight: 600 }}>
                ⚠️ {navError}
              </div>
            )}

            {/* Route stats */}
            {navStats && (
              <div
                style={{
                  marginTop: 12,
                  padding: '14px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #DCFCE7, #ECFDF5)',
                  border: '2px solid #86EFAC',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: '#14532D', marginBottom: 10 }}>
                  ✅ Маршрут табылды
                </div>
                <div className="flex gap-3">
                  {[
                    ['📏', formatDistance(navStats.distance_m), 'Қашықтық'],
                    ['⏱', formatDuration(navStats.duration_s), 'Уақыт'],
                    ['🌿', `${((navStats.distance_m / 1000) * CO2_G_PER_KM / 1000).toFixed(2)} kg`, 'CO₂ үнемі'],
                  ].map(([icon, val, label]) => (
                    <div key={String(label)} style={{ flex: 1, textAlign: 'center', padding: '10px 4px', background: '#FFFFFF', borderRadius: 10, border: '1px solid #BBF7D0' }}>
                      <div style={{ fontSize: 18 }}>{icon}</div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: '#14532D' }}>{val}</div>
                      <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hint */}
            {!navStats && !navError && (
              <p style={{ marginTop: 10, fontSize: 11, color: '#9CA3AF', textAlign: 'center' }}>
                {planStep === 'from' ? '👆 Картаны басып бастапқы нүкте таңдаңыз' : '👆 Картаны басып соңғы нүкте таңдаңыз'}
              </p>
            )}
          </div>
        )}

        {/* Routes List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <div className="flex items-center justify-between px-2 mb-4">
            <span style={{ fontSize: 13, color: '#16A34A', fontWeight: 600 }}>
              {isLoading ? '⏳ Жүктелуде...' : `📍 ${routesData?.total || 0} маршрут`}
            </span>
            <span
              style={{
                fontSize: 12,
                color: '#FFFFFF',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                padding: '6px 12px',
                borderRadius: 20,
              }}
            >
              🌱 {(totalCO2 / 1000).toFixed(1)} kg CO₂
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {routesData?.routes?.map((route: any, i: number) => {
              const active = selectedRoute?.id === route.id;
              const isHovered = hoveredRoute === route.id;
              const diff = DIFFICULTY_MAP[route.difficulty] || DIFFICULTY_MAP.easy;
              return (
                <div
                  key={route.id}
                  onClick={() => handleSelectRoute(route)}
                  onMouseEnter={() => setHoveredRoute(route.id)}
                  onMouseLeave={() => setHoveredRoute(null)}
                  style={{
                    padding: '18px',
                    borderRadius: 20,
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    background: active || isHovered
                      ? 'linear-gradient(135deg, #DCFCE7, #ECFDF5)'
                      : '#FFFFFF',
                    border: active
                      ? '2px solid #22C55E'
                      : isHovered
                        ? '2px solid #86EFAC'
                        : '2px solid #E5E7EB',
                    boxShadow: active || isHovered
                      ? '0 8px 32px rgba(34, 197, 94, 0.2)'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                >
                  {/* Title row */}
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div>
                      <h3
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          lineHeight: 1.3,
                          margin: 0,
                          color: '#14532D',
                        }}
                      >
                        {route.name_kz}
                      </h3>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0' }}>
                        {route.name_ru}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        background: route.is_free
                          ? 'linear-gradient(135deg, #DCFCE7, #BBF7D0)'
                          : 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                        color: route.is_free ? '#16A34A' : '#D97706',
                        border: route.is_free ? '1px solid #86EFAC' : '1px solid #FCD34D',
                      }}
                    >
                      {route.is_free ? '✓ Тегін' : `${route.price_tenge}₸`}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 flex-wrap" style={{ fontSize: 13, color: '#6B7280' }}>
                    <span style={{ background: '#F3F4F6', padding: '4px 10px', borderRadius: 8 }}>
                      📏 {route.distance_km} km
                    </span>
                    <span style={{ background: '#F3F4F6', padding: '4px 10px', borderRadius: 8 }}>
                      ⏱ {route.duration_min} мин
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: diff.bg,
                        color: diff.color,
                        fontWeight: 700,
                      }}
                    >
                      {diff.label}
                    </span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: 13,
                        background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                        padding: '4px 12px',
                        borderRadius: 10,
                      }}
                    >
                      +{route.eco_bonus_pts}
                    </span>
                  </div>
                </div>
              );
            })}

            {(!routesData?.routes || routesData.routes.length === 0) && !isLoading && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
                <p style={{ color: '#6B7280', fontSize: 14 }}>Маршруттар табылмады</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div
          style={{
            padding: '18px 20px',
            borderTop: '2px solid #DCFCE7',
            background: 'linear-gradient(135deg, #DCFCE7, #ECFDF5)',
          }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              ['🗺️', routesData?.total || 0, 'Маршрут'],
              ['📍', poisData?.pois?.length || 0, 'POI нүкте'],
              ['🌿', `${(totalCO2 / 1000).toFixed(1)}kg`, 'CO₂ үнемі'],
            ].map(([icon, val, label]) => (
              <div
                key={String(label)}
                style={{
                  padding: 14,
                  borderRadius: 16,
                  background: '#FFFFFF',
                  border: '2px solid #BBF7D0',
                  boxShadow: '0 2px 12px rgba(34, 197, 94, 0.1)',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
                <div style={{ color: '#16A34A', fontWeight: 800, fontSize: 22 }}>{val}</div>
                <div style={{ color: '#6B7280', fontSize: 11, fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAP */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Location badge */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 10,
            padding: '12px 20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #FFFFFF, #F0FDF4)',
            backdropFilter: 'blur(16px)',
            border: '2px solid #BBF7D0',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 4px 24px rgba(34, 197, 94, 0.12)',
            color: '#14532D',
          }}
        >
          <span style={{ color: '#22C55E', marginRight: 8 }}>📍</span>
          Астана, Қазақстан
          <span style={{ marginLeft: 10, fontSize: 12, color: '#6B7280' }}>
            • {new Date().toLocaleDateString('kk-KZ')}
          </span>
        </div>

        {/* Eco Stats Badge */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 10,
            padding: '14px 20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            boxShadow: '0 4px 24px rgba(34, 197, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 24 }}>🌱</span>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 18 }}>
              {(totalCO2 / 1000).toFixed(1)} kg
            </div>
            <div style={{ color: '#BBF7D0', fontSize: 11, fontWeight: 600 }}>CO₂ SAVED</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: 20,
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <button
            onClick={() => {
              if (map.current) {
                map.current.flyTo({ center: [71.4306, 51.1605], zoom: 12, duration: 1500 });
              }
            }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #FFFFFF, #F0FDF4)',
              border: '2px solid #BBF7D0',
              color: '#22C55E',
              fontSize: 20,
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
              transition: 'all 0.2s',
            }}
            title="Астанаға оралу"
          >
            🏠
          </button>
        </div>

        {/* Selected route panel */}
        {selectedRoute && (
          <div
            style={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 520,
              maxWidth: 'calc(100% - 48px)',
              padding: 28,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid #86EFAC',
              boxShadow: '0 24px 48px rgba(34, 197, 94, 0.15), 0 0 60px rgba(34, 197, 94, 0.08)',
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      background: selectedRoute.is_free ? '#DCFCE7' : '#FEF3C7',
                      color: selectedRoute.is_free ? '#16A34A' : '#D97706',
                    }}
                  >
                    {selectedRoute.is_free ? '✓ Тегін' : `${selectedRoute.price_tenge}₸`}
                  </span>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      background: DIFFICULTY_MAP[selectedRoute.difficulty]?.bg || '#DCFCE7',
                      color: DIFFICULTY_MAP[selectedRoute.difficulty]?.color || '#22C55E',
                    }}
                  >
                    {DIFFICULTY_MAP[selectedRoute.difficulty]?.label || 'Оңай'}
                  </span>
                </div>
                <p style={{ fontWeight: 800, fontSize: 20, margin: 0, color: '#14532D', lineHeight: 1.2 }}>
                  {selectedRoute.name_kz}
                </p>
                <p style={{ color: '#6B7280', fontSize: 13, margin: '6px 0 0' }}>
                  {selectedRoute.name_ru}
                </p>
              </div>
              <button
                onClick={() => setSelectedRoute(null)}
                style={{
                  background: '#F3F4F6',
                  border: '2px solid #E5E7EB',
                  color: '#6B7280',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: 18,
                  display: 'grid',
                  placeItems: 'center',
                  transition: 'all 0.2s',
                }}
              >
                ✕
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                ['📏', `${selectedRoute.distance_km}`, 'km'],
                ['⏱', `${selectedRoute.duration_min}`, 'мин'],
                ['🌿', `${(selectedRoute.co2_saved_g / 1000).toFixed(1)}`, 'kg CO₂'],
                ['⭐', `+${selectedRoute.eco_bonus_pts}`, 'балл'],
              ].map(([icon, value, label]) => (
                <div
                  key={String(label)}
                  style={{
                    background: 'linear-gradient(135deg, #ECFDF5, #DCFCE7)',
                    borderRadius: 16,
                    padding: '14px 10px',
                    textAlign: 'center',
                    border: '2px solid #BBF7D0',
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
                  <div style={{ color: '#14532D', fontWeight: 800, fontSize: 18 }}>{value}</div>
                  <div style={{ color: '#6B7280', fontSize: 11, fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Action */}
            <div className="flex gap-3">
              <Link
                href={`/routes/${selectedRoute.id}`}
                style={{
                  flex: 1,
                  padding: '16px 28px',
                  borderRadius: 16,
                  border: 'none',
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)',
                  letterSpacing: 0.5,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                🗺️ Маршрутты бастау
              </Link>
              <button
                onClick={() => setSelectedRoute(null)}
                style={{
                  padding: '16px 24px',
                  borderRadius: 16,
                  border: '2px solid #E5E7EB',
                  background: '#FFFFFF',
                  color: '#6B7280',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Жабу
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                margin: '0 auto 16px',
                animation: 'pulse 2s infinite',
              }}
            >
              🌿
            </div>
            <p style={{ color: '#14532D', fontWeight: 600 }}>Маршруттар жүктелуде...</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
