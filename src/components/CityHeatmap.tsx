import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Radar, Crosshair, MapPin, Zap, Activity, Shield, Target, AlertTriangle, Maximize, Minimize } from 'lucide-react';
import { MapLayerSelector } from './MapLayerSelector';
import Loader from './Loader';

// FIX FOR LEAFLET MARKER ICONS - USING CDN TO BYPASS BUILD ERRORS
const markerIcon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const markerShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- ADVANCED TACTICAL MARKERS ---

// 1. PREDICTIVE RISK (Orion Lime) - "The Minority Report" Style
const createPredictiveIcon = (label: string) => {
    const color = '#00ffc2';
    return L.divIcon({
        className: 'predictive-container',
        html: `
            <div class="predictive-marker-v2">
                <!-- Corner Brackets -->
                <div class="bracket top-left"></div>
                <div class="bracket top-right"></div>
                <div class="bracket bottom-left"></div>
                <div class="bracket bottom-right"></div>
                
                <!-- Rotating Crosshair -->
                <div class="radar-circle"></div>
                <div class="crosshair-center">
                    <div class="cross-v"></div>
                    <div class="cross-h"></div>
                </div>
                
                <!-- Data Tag -->
                <div class="data-tag">
                    <span class="tag-title">PREDICTIVE NODE</span>
                    <span class="tag-value">${label.split(':')[0]}</span>
                </div>
                
                <!-- Scanning Effect -->
                <div class="scanning-vertical"></div>
            </div>
        `,
        iconSize: [80, 80],
        iconAnchor: [40, 40]
    });
};

// 2. CRIME HOTSPOTS (Cygnus Magenta) - "Strategic Conflict" Style
const createHotspotIcon = (risk: string) => {
    const color = risk === 'Critical' ? '#e900ff' : '#f59e0b';
    return L.divIcon({
        className: 'hotspot-container',
        html: `
            <div class="hotspot-marker-v2">
                <div class="core-hexagon" style="background-color: ${color};">
                    <div class="glitch-layer"></div>
                </div>
                <div class="surge-ring" style="border-color: ${color};"></div>
                <div class="surge-ring-outer" style="border-color: ${color}40;"></div>
            </div>
        `,
        iconSize: [50, 50],
        iconAnchor: [25, 25]
    });
};

// 3. CRIME LOCATIONS (Helios Blue) - "Active Incident" Style
const createLocationIcon = () => {
    const color = '#00a6ff';
    return L.divIcon({
        className: 'location-container',
        html: `
            <div class="location-marker-v2">
                <div class="pulse-dot" style="background-color: ${color};"></div>
                <div class="dot-base" style="background-color: ${color};"></div>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

import { fetchHotspots, fetchPredictiveZones } from '../lib/api';

interface CityHeatmapProps {
    darkMode?: boolean;
}

export const CityHeatmap = ({ darkMode = true }: CityHeatmapProps) => {
    const position: [number, number] = [19.0473, 72.8634];
    const [activeLayer, setActiveLayer] = useState('hotspots');
    const [hotspots, setHotspots] = useState<any[]>([]);
    const [predictiveZones, setPredictiveZones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [map, setMap] = useState<L.Map | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleZoomIn = () => map?.zoomIn();
    const handleZoomOut = () => map?.zoomOut();
    const handleResetView = () => map?.setView(position, 14);

    useEffect(() => {
        const loadMapData = async () => {
            try {
                const [hotspotData, zoneData] = await Promise.all([
                    fetchHotspots(),
                    fetchPredictiveZones()
                ]);

                // Map Hotspots
                const mappedHotspots = hotspotData.map((d: any, i: number) => ({
                    id: i,
                    pos: [d.Latitude, d.Longitude],
                    label: `Risk Node: ${d.Risk_Score}`,
                    risk: d.Risk_Score > 7.0 ? 'Critical' : d.Risk_Score > 4.0 ? 'High' : 'Medium',
                    score: d.Risk_Score
                }));
                setHotspots(mappedHotspots);

                // Map Predictive Zones
                setPredictiveZones(zoneData);
            } catch (error) {
                console.error("Error loading map data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMapData();
    }, []);

    const [locations] = useState([
        { id: 101, pos: [18.9221, 72.8337], label: "BNS §379: Theft Report" },
        { id: 102, pos: [19.2550, 72.8650], label: "BNS §323: Assault Report" },
        { id: 104, pos: [19.0750, 72.8650], label: "BNS §354: Molestation" },
    ]);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const mapContainerStyle = {
        height: isFullscreen ? '100vh' : '600px',
        width: '100%',
        backgroundColor: darkMode ? '#000000' : '#f8fafc'
    };

    if (!isMounted || loading) {
        return (
            <div style={{ height: '620px', width: '100%' }} className="bg-app-background flex items-center justify-center rounded-2xl border border-app-border">
                <Loader />
            </div>
        );
    }

    const tileUrl = darkMode
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png";

    return (
        <div ref={containerRef} className={`relative w-full rounded-2xl overflow-hidden border border-app-border bg-app-card transition-all duration-500 ${isFullscreen ? "fixed inset-0 z-[9999] rounded-none" : "h-[600px]"
            }`}>
            <MapContainer
                key={darkMode ? `dark-map-${isFullscreen}` : `light-map-${isFullscreen}`}
                center={position}
                zoom={14}
                style={mapContainerStyle}
                zoomControl={false}
                attributionControl={false}
                scrollWheelZoom={true}
                ref={setMap}
            >
                <TileLayer
                    key={darkMode ? 'dark-layer' : 'light-layer'}
                    url={tileUrl}
                />

                {/* Layer 1: Crime Locations */}
                {activeLayer === 'locations' && locations.map(loc => (
                    <Marker key={loc.id} position={loc.pos as [number, number]} icon={createLocationIcon()}>
                        <Popup className="custom-popup-v2">
                            <div className="popup-terminal">
                                <div className="terminal-header" style={{ borderColor: '#00a6ff' }}>
                                    <Activity className="w-3 h-3 text-[#00a6ff]" />
                                    <span>INCIDENT FEED</span>
                                </div>
                                <p className="terminal-content">{loc.label}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Layer 2: Crime Hotspots */}
                {activeLayer === 'hotspots' && hotspots.map(spot => (
                    <Marker key={spot.id} position={spot.pos as [number, number]} icon={createHotspotIcon(spot.risk)}>
                        <Popup className="custom-popup-v2">
                            <div className="popup-terminal">
                                <div className="terminal-header" style={{ borderColor: '#e900ff' }}>
                                    <Shield className="w-3 h-3 text-[#e900ff]" />
                                    <span>THREAT DETECTED</span>
                                </div>
                                <h2 className="terminal-title">{spot.label}</h2>
                                <div className="terminal-meta">
                                    <span className="risk-tag" style={{ backgroundColor: '#e900ff20', color: '#e900ff' }}>STATUS: CRITICAL</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Layer 3: Predictive Risk - COMPLETELY REFINED */}
                {activeLayer === 'predictive' && predictiveZones.map(zone => (
                    <React.Fragment key={zone.id}>
                        {/* Static Influence Circle */}
                        <Circle
                            center={zone.pos as [number, number]}
                            radius={zone.radius}
                            pathOptions={{
                                fillColor: '#00ffc2',
                                fillOpacity: 0.05,
                                color: '#00ffc2',
                                weight: 1,
                                dashArray: '4, 8'
                            }}
                        />
                        {/* Animated Pulse Circle */}
                        <Circle
                            center={zone.pos as [number, number]}
                            radius={zone.radius * 0.7}
                            pathOptions={{
                                fillColor: '#00ffc2',
                                fillOpacity: 0.1,
                                color: '#00ffc2',
                                weight: 2,
                                className: 'animated-circle'
                            }}
                        />
                        <Marker position={zone.pos as [number, number]} icon={createPredictiveIcon(zone.label)}>
                            <Popup className="custom-popup-v2">
                                <div className="popup-terminal predictive">
                                    <div className="terminal-header">
                                        <Zap className="w-3 h-3 text-[#00ffc2]" />
                                        <span>AI PREDICTIVE ANALYSIS</span>
                                    </div>
                                    <div className="terminal-body">
                                        <h2 className="terminal-title">{zone.label}</h2>
                                        <p className="terminal-desc">{zone.details}</p>
                                        <div className="terminal-stats">
                                            <div className="stat-item">
                                                <span className="label">PRECISION</span>
                                                <span className="value">98.2%</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="label">UPLINK</span>
                                                <span className="value">ACTIVE</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="terminal-footer">
                                        SECURE_UPLINK_ESTABLISHED_...
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    </React.Fragment>
                ))}
            </MapContainer>

            {/* Tactical Overlays */}
            <div className="absolute top-8 right-8 z-[1000]">
                <MapLayerSelector activeLayer={activeLayer} onChange={setActiveLayer} />
            </div>

            <div className="absolute top-8 left-8 z-[1000] pointer-events-none">
                <div className="bg-app-background/95 backdrop-blur-3xl border border-app-border p-6 rounded-2xl shadow-2xl border-l-[6px] border-l-app-primary flex flex-col gap-2 min-w-[240px]">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Radar className="w-8 h-8 text-app-primary animate-spin-slow" />
                            <div className="absolute inset-0 bg-app-primary/20 blur-lg rounded-full animate-pulse" />
                        </div>
                        <div>
                            <span className="text-[12px] font-black tracking-[0.3em] text-app-text uppercase">TACTICAL NODE 07</span>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                                <span className="text-[10px] text-app-text-dim font-black uppercase tracking-widest">{activeLayer} MONITORING</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Tactical Zoom */}
            <div className="absolute bottom-8 left-8 z-[1000] flex flex-col gap-3">
                <button
                    onClick={handleResetView}
                    className="w-12 h-12 bg-app-card/80 backdrop-blur-xl border border-app-border rounded-xl flex items-center justify-center text-app-text hover:bg-app-primary hover:text-white transition-all shadow-2xl group/zoom"
                    title="Reset View"
                >
                    <Target className="w-5 h-5 group-hover/zoom:scale-110 transition-transform" />
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="w-12 h-12 bg-app-card/80 backdrop-blur-xl border border-app-border rounded-xl flex items-center justify-center text-app-text hover:bg-app-primary hover:text-white transition-all shadow-2xl group/zoom"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {isFullscreen ? (
                        <Minimize className="w-5 h-5 group-hover/zoom:scale-110 transition-transform" />
                    ) : (
                        <Maximize className="w-5 h-5 group-hover/zoom:scale-110 transition-transform" />
                    )}
                </button>
                <div className="flex flex-col bg-app-card/80 backdrop-blur-xl border border-app-border rounded-xl overflow-hidden shadow-2xl">
                    <button
                        onClick={handleZoomIn}
                        className="w-12 h-12 flex items-center justify-center text-xl font-black text-app-text-dim hover:bg-app-primary hover:text-white transition-all border-b border-app-border"
                    >
                        +
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="w-12 h-12 flex items-center justify-center text-xl font-black text-app-text-dim hover:bg-app-primary hover:text-white transition-all"
                    >
                        -
                    </button>
                </div>
            </div>

            <style>{`
                /* --- PREDICTIVE RISK MARKER (COMPLETELY REFINED) --- */
                .predictive-marker-v2 {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .bracket {
                    position: absolute;
                    width: 15px;
                    height: 15px;
                    border: 2.5px solid #00ffc2;
                    opacity: 0.8;
                }
                .top-left { top: 10px; left: 10px; border-right: 0; border-bottom: 0; }
                .top-right { top: 10px; right: 10px; border-left: 0; border-bottom: 0; }
                .bottom-left { bottom: 10px; left: 10px; border-right: 0; border-top: 0; }
                .bottom-right { bottom: 10px; right: 10px; border-left: 0; border-top: 0; }

                .radar-circle {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border: 1px dashed #00ffc2;
                    border-radius: 50%;
                    animation: orbit-spin 4s infinite linear;
                    opacity: 0.4;
                }

                .crosshair-center {
                    position: relative;
                    width: 12px;
                    height: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .cross-v, .cross-h {
                    position: absolute;
                    background-color: #00ffc2;
                    box-shadow: 0 0 10px #00ffc2;
                }
                .cross-v { width: 2px; height: 100%; }
                .cross-h { width: 100%; height: 2px; }

                .data-tag {
                    position: absolute;
                    top: -25px;
                    background: rgba(0, 255, 194, 0.1);
                    border: 1px solid #00ffc2;
                    padding: 2px 6px;
                    border-radius: 4px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    backdrop-filter: blur(4px);
                    animation: float-y 3s infinite ease-in-out;
                }
                .tag-title { font-size: 6px; font-weight: 900; color: #00ffc2; opacity: 0.7; }
                .tag-value { font-size: 8px; font-weight: 900; color: white; white-space: nowrap; }

                .scanning-vertical {
                    position: absolute;
                    width: 50px;
                    height: 2px;
                    background: linear-gradient(to right, transparent, #00ffc2, transparent);
                    opacity: 0.3;
                    animation: scan-vertical 2s infinite linear;
                }

                /* --- HOTSPOT MARKER --- */
                .core-hexagon {
                    width: 16px;
                    height: 16px;
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                    position: relative;
                    z-index: 10;
                }
                .surge-ring {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    border: 2px solid;
                    border-radius: 50%;
                    animation: pulse-expand 2s infinite cubic-bezier(0, 0, 0.2, 1);
                }

                /* --- LOCATION MARKER (HELIOS BLUE) --- */
                .location-marker-v2 {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                .pulse-dot {
                    position: absolute;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    opacity: 0;
                    animation: pulse-expand 1.5s infinite;
                }
                .dot-base {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    z-index: 2;
                    position: relative;
                    border: 1.5px solid white;
                    box-shadow: 0 0 10px rgba(0, 166, 255, 0.5);
                }

                /* --- TERMINAL POPUPS --- */
                .popup-terminal {
                    background: #0a0a0a;
                    padding: 0;
                    border: 1px solid var(--app-border);
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.8);
                }
                .terminal-header {
                    padding: 8px 12px;
                    background: rgba(255,255,255,0.03);
                    border-bottom: 2px solid;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .terminal-header span { font-size: 9px; font-weight: 900; color: white; letter-spacing: 0.15em; }
                
                .terminal-body { padding: 12px; }
                .terminal-title { font-size: 14px; font-weight: 900; color: white; margin-bottom: 6px; }
                .terminal-desc { font-size: 10px; color: #94a3b8; line-height: 1.5; margin-bottom: 12px; }
                
                .terminal-stats { display: flex; gap: 12px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px; }
                .stat-item { display: flex; flex-direction: column; }
                .stat-item .label { font-size: 7px; color: #64748b; font-weight: 900; }
                .stat-item .value { font-size: 10px; color: white; font-weight: 900; }
                
                .terminal-footer { font-size: 8px; color: #475569; padding: 4px 12px; font-family: monospace; }
                
                .predictive .terminal-header { border-color: #00ffc2; }
                
                /* ANIMATIONS */
                @keyframes orbit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes scan-vertical {
                    0% { transform: translateY(-25px); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: translateY(25px); opacity: 0; }
                }
                @keyframes float-y {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0); }
                }
                @keyframes pulse-expand {
                    0% { transform: scale(0.5); opacity: 0.9; }
                    100% { transform: scale(2); opacity: 0; }
                }
                .animated-circle { animation: dash-move 20s linear infinite; }
                @keyframes dash-move {
                    0% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: 1000; }
                }

                .leaflet-container { background: ${darkMode ? '#000000' : '#f8fafc'} !important; outline: none; }
                .custom-popup-v2 .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; padding: 0 !important; }
                .custom-popup-v2 .leaflet-popup-content { margin: 0 !important; width: 220px !important; }
                .custom-popup-v2 .leaflet-popup-tip { display: none; }
                .custom-popup-v2 { margin-bottom: 20px !important; }
            `}</style>
        </div>
    );
};
