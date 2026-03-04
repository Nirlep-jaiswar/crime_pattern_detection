import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchFIRs } from '../lib/api';
import Loader from './Loader';
import DownloadButton from './DownloadButton';

const sectionsMapping: Record<string, string> = {
    '111': 'Organized Crime',
    '303': 'Theft',
    '115': 'Assault',
    '126': 'Public Nuisance',
    '70': 'Sexual Offenses',
    '103': 'Murder',
    '310': 'Robbery',
    '320': 'Mischief'
};

export const BNSIntelligenceHub = () => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [bnsData, setBnsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFIRs = async () => {
            try {
                const data = await fetchFIRs();
                setBnsData(data);
            } catch (error) {
                console.error("Error loading FIRs:", error);
            } finally {
                setLoading(false);
            }
        };
        loadFIRs();
    }, []);

    const filteredData = bnsData.filter(item => {
        const category = sectionsMapping[item.BNS_Section.toString()] || 'Other';
        const matchesSearch =
            item.FIR_UID.toLowerCase().includes(search.toLowerCase()) ||
            item.BNS_Section.toString().includes(search.toLowerCase()) ||
            category.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || category === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="glass-card flex flex-col h-[600px]">
            <div className="p-4 border-b border-app-border flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-dim" />
                        <input
                            type="text"
                            placeholder="Search FIR, Section or Category..."
                            className="w-full bg-app-background border border-app-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-app-primary/50 text-app-text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-app-background border border-app-border rounded-lg px-3 py-2 text-sm outline-none cursor-pointer text-app-text-dim"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        {Object.values(sectionsMapping).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 bg-app-card hover:bg-app-card/80 rounded-lg transition-colors text-app-text-dim h-10 w-10 flex items-center justify-center">
                        <Filter className="w-4 h-4" />
                    </button>
                    <DownloadButton text="Export" completedText="Done" />
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-app-card/30 text-app-text-dim text-[10px] uppercase tracking-wider font-bold">
                            <th className="px-6 py-4">FIR Number</th>
                            <th className="px-6 py-4">BNS Section</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Current Status</th>
                            <th className="px-6 py-4">Risk Factor</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-app-border">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center">
                                    <Loader />
                                </td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center text-app-text-dim text-sm">
                                    No records found matching criteria.
                                </td>
                            </tr>
                        ) : filteredData.map((item: any) => (
                            <tr key={item.FIR_UID} className="hover:bg-app-primary/5 transition-colors group">
                                <td className="px-6 py-4 text-sm font-medium text-app-text">{item.FIR_UID}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-app-card rounded text-[11px] font-mono text-app-primary">§ {item.BNS_Section}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-app-text-dim">
                                    {sectionsMapping[item.BNS_Section.toString()] || 'Uncategorized'}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={cn(
                                        "flex items-center gap-1.5",
                                        item.Status === 'Arrested' ? 'text-emerald-500' : 'text-amber-500'
                                    )}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", item.Status === 'Arrested' ? 'bg-emerald-500' : 'bg-amber-500')} />
                                        {item.Status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge risk={item.Risk} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="p-1 hover:bg-app-card rounded transition-colors text-app-text-dim">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Badge = ({ risk }: { risk: string }) => {
    const colors: Record<string, string> = {
        'Critical': 'bg-app-danger/10 text-app-danger border-app-danger/20',
        'High': 'bg-app-accent/10 text-app-accent border-app-accent/20',
        'Medium': 'bg-app-primary/10 text-app-primary border-app-primary/20',
        'Low': 'bg-app-text-dim/10 text-app-text-dim border-app-text-dim/20',
    };

    return (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit", colors[risk] || colors.Low)}>
            {risk === 'Critical' && <AlertCircle className="w-3 h-3" />}
            {risk}
        </span>
    );
};
