import React from 'react';
import { ClipboardCheck, TrendingUp, XCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import ChartCard from '../../components/ui/ChartCard';
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';

const qualityTests = [
    { id: 'QC-001', item: 'Wheat Batch #456', testDate: '2024-12-14', result: 'Passed', score: 95, inspector: 'A. Kumar' },
    { id: 'QC-002', item: 'Tomatoes Batch #789', testDate: '2024-12-14', result: 'Passed', score: 88, inspector: 'R. Sharma' },
    { id: 'QC-003', item: 'Rice Batch #234', testDate: '2024-12-13', result: 'Passed', score: 92, inspector: 'A. Kumar' },
    { id: 'QC-004', item: 'Milk Products #567', testDate: '2024-12-13', result: 'Failed', score: 62, inspector: 'M. Patel' },
    { id: 'QC-005', item: 'Apples Batch #890', testDate: '2024-12-13', result: 'Passed', score: 90, inspector: 'R. Sharma' }
];

const qualityTrendData = [
    { month: 'Jul', passRate: 95 },
    { month: 'Aug', passRate: 96 },
    { month: 'Sep', passRate: 94 },
    { month: 'Oct', passRate: 97 },
    { month: 'Nov', passRate: 98 },
    { month: 'Dec', passRate: 98 }
];

const Quality = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    const columns = [
        { header: 'QC ID', accessor: 'id' },
        { header: 'Item', accessor: 'item' },
        { header: 'Test Date', accessor: 'testDate' },
        { header: 'Score', accessor: 'score', render: (row) => <span className={row.score >= 80 ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>{row.score}%</span> },
        { header: 'Result', accessor: 'result', render: (row) => <StatusBadge status={row.result.toLowerCase() === 'passed' ? 'good' : 'critical'} /> },
        { header: 'Inspector', accessor: 'inspector' },
    ];

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
                        <p className="text-2xl font-bold text-slate-800">127</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <CheckCircle size={18} />
                            <span className="text-xs font-medium">Passed</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">124</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <XCircle size={18} />
                            <span className="text-xs font-medium">Failed</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600">3</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <TrendingUp size={18} />
                            <span className="text-xs font-medium">Pass Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">98%</p>
                    </div>
                </div>

                {/* Quality Trend Chart */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <ChartCard title="Quality Pass Rate Trend" subtitle="Last 6 months performance" height={isMobile ? 220 : 300}>
                        <BarChart data={qualityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="month" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <YAxis {...chartTheme.axis} domain={[0, 100]} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <Tooltip {...chartTheme.tooltip} />
                            <Bar dataKey="passRate" fill={chartTheme.colors.sage[0]} radius={[4, 4, 0, 0]} name="Pass Rate (%)" />
                        </BarChart>
                    </ChartCard>
                </div>

                {/* Recent Tests Table */}
                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100">
                            <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">Recent Quality Tests</h2>
                        </div>
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable columns={columns} data={qualityTests} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Quality;
