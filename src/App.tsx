import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { BNSIntelligenceHub } from './components/BNSIntelligenceHub';
import { PredictiveRiskCalculator } from './components/PredictiveRiskCalculator';
import { CrimeCalendar } from './components/CrimeCalendar';
import { CityHeatmap } from './components/CityHeatmap';
import { AnalyticsPage } from './components/AnalyticsPage';
import { ResourcesPage } from './components/ResourcesPage';
import ThemeSwitch from './components/ThemeSwitch';
import { Shield, Users, MapPin, Activity, Bell, AlertTriangle } from 'lucide-react';
import { cn } from './lib/utils';
import PillNav from './components/PillNav';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Simple Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-neutral-200 p-8">
                    <AlertTriangle className="w-16 h-16 text-rose-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">System Collision Detected</h1>
                    <p className="text-neutral-400 mb-6 text-center max-w-md italic">
                        "Reliability is the foundation of security." - KAVACH Kernel Error
                    </p>
                    <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 font-mono text-[10px] text-rose-400 overflow-auto max-w-full">
                        {this.state.error?.message}
                        <br /><br />
                        STACK TRACE:<br />
                        {this.state.error?.stack?.slice(0, 200)}...
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);

    const activeTab = location.pathname.split('/')[1]?.toUpperCase() || 'COMMAND';

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (darkMode) {
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }
    };

    const navItems = [
        { label: 'COMMAND', href: '/command' },
        { label: 'SIGNAL', href: '/signal' },
        { label: 'RISK', href: '/risk' },
        { label: 'ANALYTICS', href: '/analytics' },
        { label: 'RESOURCES', href: '/resources' }
    ];

    return (
        <div className="flex h-screen bg-app-background text-app-text overflow-hidden font-sans selection:bg-blue-500/30">
            <Sidebar activeTab={activeTab} setActiveTab={(tab) => navigate(`/${tab.toLowerCase()}`)} />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header with PillNav */}
                <header className="h-20 border-b border-app-border bg-app-background/80 backdrop-blur-xl px-8 flex items-center justify-between z-20 shrink-0">
                    <div className="flex items-center gap-8">
                        <PillNav
                            logo="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                            items={navItems}
                            activeHref={location.pathname}
                            baseColor={darkMode ? '#1e293b' : '#ffffff'}
                            pillColor={darkMode ? '#0f172a' : '#f1f5f9'}
                            pillTextColor={darkMode ? '#94a3b8' : '#475569'}
                            hoveredPillTextColor={darkMode ? '#ffffff' : '#2563eb'}
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <ThemeSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                        <div className="hidden lg:flex flex-col text-right">
                            <div className="text-[10px] font-black text-app-text tracking-wider">DIG VIKRAM SINGH</div>
                            <div className="text-[9px] text-app-text-dim font-bold uppercase tracking-tighter">Commanding Officer · Zone 4</div>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-app-border overflow-hidden bg-app-card flex items-center justify-center">
                            <Users className="w-5 h-5 text-app-text-dim" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-app-background">
                    <Routes>
                        <Route path="/" element={<Navigate to="/command" replace />} />
                        <Route path="/command" element={
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="w-full">
                                    <CityHeatmap darkMode={darkMode} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard icon={Shield} label="BNS Sections Tracked" value="482" trend="+12" color="text-blue-500" />
                                    <StatCard icon={Activity} label="Active Inquiries" value="1,240" trend="+5.2%" color="text-amber-500" />
                                    <StatCard icon={Users} label="Personnel On-Duty" value="842" trend="98%" color="text-emerald-500" />
                                    <StatCard icon={MapPin} label="High-Risk Zones" value="14" trend="+2" color="text-rose-500" />
                                </div>
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-8">
                                    <div className="xl:col-span-2 space-y-8">
                                        <BNSIntelligenceHub />
                                        <CrimeCalendar />
                                    </div>
                                    <div className="space-y-8">
                                        <PredictiveRiskCalculator />
                                        <div className="glass-card p-6 bg-gradient-to-br from-blue-600/5 to-transparent border-app-border">
                                            <h3 className="text-[10px] font-black mb-6 flex items-center gap-2 text-app-text-dim uppercase tracking-widest">
                                                <Bell className="w-4 h-4 text-app-primary" />
                                                System Operations
                                            </h3>
                                            <div className="space-y-5">
                                                <HealthBar label="Satellite Link (NAV-7)" percent={94} color="bg-emerald-500" />
                                                <HealthBar label="AI Inference Engine" percent={82} color="bg-blue-500" />
                                                <HealthBar label="Cloud Sync Latency" percent={12} color="bg-emerald-500" />
                                            </div>
                                            <button className="w-full mt-8 py-2.5 bg-app-card border border-app-border rounded-lg text-[9px] font-black uppercase tracking-[0.2em] hover:bg-app-background transition-colors text-app-text">
                                                VIEW SYSTEM LOGS
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        } />
                        <Route path="/signal" element={<BNSIntelligenceHub />} />
                        <Route path="/risk" element={<PredictiveRiskCalculator />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="/resources" element={<ResourcesPage />} />
                    </Routes>
                </div>
            </main>


            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { filter: brightness(1.2); }
                .glass-card { 
                    background: var(--card); 
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--border);
                    border-radius: 1rem;
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                }
            `}</style>
        </div>
    );
}

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
    <div className="glass-card p-6 group hover:translate-y-[-2px] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
            <div className={cn("p-2.5 rounded-xl bg-app-background border border-app-border group-hover:bg-app-card transition-all", color)}>
                <Icon className="w-5 h-5" />
            </div>
            <div className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border bg-app-background",
                trend.startsWith('+') ? 'text-emerald-500 border-emerald-500/20' : 'text-blue-500 border-blue-500/20')}>
                {trend}
            </div>
        </div>
        <div className="text-3xl font-black tracking-tight text-app-text italic">{value}</div>
        <div className="text-[10px] text-app-text-dim font-bold uppercase tracking-widest mt-1.5">{label}</div>
    </div>
);

const HealthBar = ({ label, percent, color }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-app-text-dim">
            <span>{label}</span>
            <span className="text-app-text">{percent}%</span>
        </div>
        <div className="h-1.5 w-full bg-app-background rounded-full overflow-hidden border border-app-border">
            <div
                className={cn("h-full rounded-full transition-all duration-1000", color)}
                style={{ width: `${percent}%` }}
            />
        </div>
    </div>
);

export default function WrappedApp() {
    return (
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
}
