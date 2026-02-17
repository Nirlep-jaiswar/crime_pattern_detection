import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { BNSIntelligenceHub } from './components/BNSIntelligenceHub';
import { PredictiveRiskCalculator } from './components/PredictiveRiskCalculator';
import { CrimeCalendar } from './components/CrimeCalendar';
import { CityHeatmap } from './components/CityHeatmap';
import { AnalyticsPage } from './components/AnalyticsPage';
import { ResourcesPage } from './components/ResourcesPage';
import { Shield, Users, MapPin, Activity, Bell, AlertTriangle } from 'lucide-react';
import { cn } from './lib/utils';

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
                <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-8">
                    <AlertTriangle className="w-16 h-16 text-rose-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">System Collision Detected</h1>
                    <p className="text-slate-400 mb-6 text-center max-w-md italic">
                        "Reliability is the foundation of security." - KAVACH Kernel Error
                    </p>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 font-mono text-[10px] text-rose-400 overflow-auto max-w-full">
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
    const [activeTab, setActiveTab] = useState('COMMAND');

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-xl px-8 flex items-center justify-between z-20 shrink-0">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('COMMAND')}>
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-sm font-black tracking-[0.2em] text-slate-100 uppercase italic">KAVACH 4.0</h2>
                        </div>

                        <nav className="flex gap-2">
                            {[
                                { id: 'COMMAND', label: 'COMMAND' },
                                { id: 'ANALYTICS', label: 'ANALYTICS' },
                                { id: 'RESOURCES', label: 'RESOURCES' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full transition-all border",
                                        activeTab === tab.id
                                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10"
                                            : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-900"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex flex-col text-right">
                            <div className="text-[10px] font-black text-slate-200 tracking-wider">DIG VIKRAM SINGH</div>
                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Commanding Officer · Zone 4</div>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-slate-800 overflow-hidden bg-slate-900 flex items-center justify-center">
                            <Users className="w-5 h-5 text-slate-600" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-[#020617]">
                    {activeTab === 'COMMAND' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* GIS Heatmap Overlay */}
                            <div className="w-full">
                                <CityHeatmap />
                            </div>

                            {/* Quick Stats */}
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

                                    <div className="glass-card p-6 bg-gradient-to-br from-blue-600/5 to-transparent border-slate-800/80">
                                        <h3 className="text-[10px] font-black mb-6 flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                                            <Bell className="w-4 h-4 text-blue-500" />
                                            System Operations
                                        </h3>
                                        <div className="space-y-5">
                                            <HealthBar label="Satellite Link (NAV-7)" percent={94} color="bg-emerald-500" />
                                            <HealthBar label="AI Inference Engine" percent={82} color="bg-blue-500" />
                                            <HealthBar label="Cloud Sync Latency" percent={12} color="bg-emerald-500" />
                                        </div>
                                        <button className="w-full mt-8 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors">
                                            VIEW SYSTEM LOGS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'SIGNAL' && <BNSIntelligenceHub />}
                    {activeTab === 'RISK' && <PredictiveRiskCalculator />}
                    {activeTab === 'ANALYTICS' && <AnalyticsPage />}
                    {activeTab === 'RESOURCES' && <ResourcesPage />}
                </div>
            </main>


            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
                .glass-card { 
                    background: rgba(15, 23, 42, 0.4); 
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(30, 41, 59, 0.7);
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
            <div className={cn("p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 group-hover:border-slate-700 group-hover:bg-slate-900 transition-all", color)}>
                <Icon className="w-5 h-5" />
            </div>
            <div className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border bg-black/20",
                trend.startsWith('+') ? 'text-emerald-500 border-emerald-500/20' : 'text-blue-500 border-blue-500/20')}>
                {trend}
            </div>
        </div>
        <div className="text-3xl font-black tracking-tight text-slate-100 italic">{value}</div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">{label}</div>
    </div>
);

const HealthBar = ({ label, percent, color }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
            <span>{label}</span>
            <span className="text-slate-300">{percent}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
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
