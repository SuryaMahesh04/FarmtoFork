import React, { useState, useEffect } from 'react';
import { ClipboardCheck, TrendingUp, XCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import ChartCard from '../../components/ui/ChartCard';
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';
import Loader from '../../components/ui/Loader';

const Quality = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [qualityTests, setQualityTests] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        passed: 0,
        failed: 0,
        passRate: 0
    });

    useEffect(() => {
        fetchQualityData();
    }, []);

    const fetchQualityData = async () => {
        try {
            setLoading(true);
            const [invRes, anaRes] = await Promise.all([
                api.distributor.getInventory(),
                api.distributor.getAnalytics()
            ]);

            if (invRes.success) {
                setQualityTests(invRes.data);
                
                // Calculate stats from inventory
                const total = invRes.data.length;
                const passed = invRes.data.filter(i => i.quality >= 80).length;
                const failed = total - passed;
                const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
                
                setStats({ total, passed, failed, passRate });
            }

            if (anaRes.success) {
                setAnalytics(anaRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch quality data:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'QC ID', accessor: 'id', render: (row) => <span className="font-mono text-xs text-slate-500 uppercase">{row.id?.slice(-8) || 'N/A'}</span> },
        { header: 'Item', accessor: 'item' },
        { header: 'Test Date', accessor: 'expiry', render: (row) => row.expiry ? new Date(row.expiry).toLocaleDateString() : 'N/A' }, // Using expiry as proxy or adding date later
        { header: 'Score', accessor: 'quality', render: (row) => <span className={row.quality >= 80 ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>{row.quality}%</span> },
        { header: 'Result', accessor: 'status', render: (row) => <StatusBadge status={row.quality >= 80 ? 'good' : 'critical'} /> },
        { header: 'Inspector', accessor: 'inspector', render: () => 'A. Verified' },
    ];

    if (loading) {
        return (
            <DashboardLayout role="distributor">
                <Loader text="Analyzing quality reports..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="distributor">
            <div className="space-y-6">
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Quality Control</h1>
                    <p className="text-sm md:text-base text-slate-500">Monitor quality tests and compliance</p>
                </div>

                {/* Stats Cards */}
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <ClipboardCheck size={18} />
                            <span className="text-xs font-medium">Total Tests</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <CheckCircle size={18} />
                            <span className="text-xs font-medium">Passed</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">{stats.passed}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <XCircle size={18} />
                            <span className="text-xs font-medium">Failed</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <TrendingUp size={18} />
                            <span className="text-xs font-medium">Pass Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">{stats.passRate}%</p>
                    </div>
                </div>

                {/* Quality Trend Chart */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <ChartCard title="Quality Score by Category" subtitle="Assessment of different crop types" height={isMobile ? 220 : 300}>
                        <BarChart data={analytics?.qualityMetrics || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="category" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <Tooltip {...chartTheme.tooltip} />
                            <Bar dataKey="passed" fill={chartTheme.colors.sage[0]} radius={[4, 4, 0, 0]} name="Passed" />
                            <Bar dataKey="failed" fill={chartTheme.colors.terra[0]} radius={[4, 4, 0, 0]} name="Failed" />
                        </BarChart>
                    </ChartCard>
                </div>

                {/* Recent Tests Table */}
                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100">
                            <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">Recent Quality Assessments</h2>
                        </div>
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            {qualityTests.length > 0 ? (
                                <DataTable columns={columns} data={qualityTests} />
                            ) : (
                                <div className="p-12 text-center text-slate-400">
                                    No quality assessment records found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Quality;
