import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Radar, Crosshair } from 'lucide-react';

// FIX FOR LEAFLET MARKER ICONS
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const createPulsingIcon = (risk: string) => {
    const color = risk === 'Critical' ? '#f43f5e' : risk === 'High' ? '#f59e0b' : '#3b82f6';
    return L.divIcon({
        className: 'custom-pulsing-marker',
        html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 35px; height: 35px; background-color: ${color}; border-radius: 50%; animation: pulse-marker 2s infinite; opacity: 0.4;"></div>
                <div style="width: 12px; height: 12px; background-color: ${color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px ${color}80;"></div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
};

export const CityHeatmap = () => {
    const position: [number, number] = [19.0473, 72.8634];
    const [hotspots] = useState([
        { id: 1, pos: [19.0480, 72.8640], label: "BNS §111: Organized Crime Hub", risk: "Critical" },
        { id: 2, pos: [19.0430, 72.8590], label: "BNS §303: Larceny Cluster", risk: "High" },
        { id: 3, pos: [19.0520, 72.8700], label: "BNS §103: Inquiry Zone", risk: "Medium" },
    ]);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Explicit height is CRITICAL for Leaflet
    const mapContainerStyle = {
        height: '550px',
        width: '100%',
        backgroundColor: '#020617'
    };

    if (!isMounted) {
        return <div style={{ height: '550px', width: '100%' }} className="bg-[#020617] animate-pulse rounded-2xl border border-slate-800" />;
    }

    return (
        <div className="w-full relative bg-[#020617] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <MapContainer
                center={position}
                zoom={14}
                style={mapContainerStyle}
                zoomControl={true}
                attributionControl={false}
                scrollWheelZoom={true}
                doubleClickZoom={true}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {hotspots.map(spot => (
                    <Marker
                        key={spot.id}
                        position={spot.pos as [number, number]}
                        icon={createPulsingIcon(spot.risk)}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2 min-w-[150px]">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Target Intelligence</h3>
                                <p className="text-xs font-bold leading-tight text-slate-200">{spot.label}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Overlays */}
            <div className="absolute top-8 left-8 z-[1000] pointer-events-none">
                <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-2xl border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-4">
                        <Radar className="w-6 h-6 text-blue-500 animate-spin-slow" />
                        <div>
                            <span className="text-[10px] font-black tracking-[0.2em] text-slate-200 uppercase text-xs">Live Intelligence Hub</span>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] text-slate-500 font-bold uppercase">Sector: Mumbai-Sion Strategic</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MapEffects />

            <style>{`
                .animate-spin-slow { animation: spin 12s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse-marker {
                    0% { transform: scale(0.5); opacity: 0.8; }
                    100% { transform: scale(2); opacity: 0; }
                }
                .leaflet-container { background: #020617 !important; outline: none; }
                .custom-popup .leaflet-popup-content-wrapper {
                    background: #020617 !important;
                    color: #fff !important;
                    border: 1px solid #1e293b !important;
                    border-radius: 8px;
                }
                .custom-popup .leaflet-popup-tip { background: #1e293b !important; }

                /* Custom Zoom Control Styling */
                .leaflet-control-zoom {
                    border: 1px solid #1e293b !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
                    margin-top: 150px !important; /* Move it down below the overlay */
                    margin-left: 32px !important;
                }
                .leaflet-control-zoom-in, .leaflet-control-zoom-out {
                    background-color: #020617 !important;
                    color: #64748b !important;
                    border: none !important;
                    border-bottom: 1px solid #1e293b !important;
                    transition: all 0.2s ease;
                }
                .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {
                    background-color: #0f172a !important;
                    color: #3b82f6 !important;
                }
                .leaflet-bar { border: none !important; }
            `}</style>
        </div>
    );
};

const MapEffects = () => (
    <div className="absolute inset-0 z-[400] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="w-full h-[1px] bg-blue-500/20 absolute top-0 animate-scanning" />
        <style>{`
            @keyframes animate-scanning {
                0% { top: 0%; opacity: 0; }
                15% { opacity: 1; }
                85% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
            .animate-scanning { animation: animate-scanning 4s linear infinite; }
        `}</style>
    </div>
);
