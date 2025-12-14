import React, { useState } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import ChartCard from '../../components/ui/ChartCard';
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';

const salesByCategory = [
    { category: 'Grains', revenue: 45000 },
    { category: 'Vegetables', revenue: 28000 },
    { category: 'Fruits', revenue: 22000 },
    { category: 'Dairy', revenue: 18000 },
    { category: 'Others', revenue: 12000 }
];

const revenueData = [
    { month: 'Jul', revenue: 98000 },
    { month: 'Aug', revenue: 105000 },
    { month: 'Sep', revenue: 112000 },
    { month: 'Oct', revenue: 125000 },
    { month: 'Nov', revenue: 118000 },
    { month: 'Dec', revenue: 135000 }
];

const recentTransactions = [
    { id: 'TXN-001', product: 'Basmati Rice 5kg', quantity: 2, amount: '₹900', date: '2024-12-14 10:30 AM', customer: 'Rahul S.' },
    { id: 'TXN-002', product: 'Organic Honey', quantity: 1, amount: '₹650', date: '2024-12-14 10:15 AM', customer: 'Priya K.' },
    { id: 'TXN-003', product: 'Fresh Tomatoes', quantity: 5, amount: '₹300', date: '2024-12-14 09:45 AM', customer: 'Amit P.' },
    { id: 'TXN-004', product: 'Wheat Flour 10kg', quantity: 1, amount: '₹380', date: '2024-12-14 09:20 AM', customer: 'Sneha R.' },
    { id: 'TXN-005', product: 'Apples (Kashmiri)', quantity: 3, amount: '₹540', date: '2024-12-14 08:55 AM', customer: 'Vijay M.' }
];

const Sales = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [period, setPeriod] = useState('month');

    const columns = [
        { header: 'Transaction ID', accessor: 'id' },
        { header: 'Product', accessor: 'product' },
        { header: 'Qty', accessor: 'quantity' },
        { header: 'Amount', accessor: 'amount' },
        { header: 'Date & Time', accessor: 'date' },
        { header: 'Customer', accessor: 'customer' },
    ];

    return (
        <DashboardLayout role="retailer">
            <div className="space-y-6">
                <div className="flex justify-between items-start md:items-center gap-4 animate-in flex-col md:flex-row">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Sales Analytics</h1>
                        <p className="text-sm md:text-base text-slate-500">Track revenue and transaction insights</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPeriod('week')}
                            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${period === 'week' ? 'bg-green-100 text-green-800' : 'bg-white text-slate-600 border border-slate-200'}`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setPeriod('month')}
                            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${period === 'month' ? 'bg-green-100 text-green-800' : 'bg-white text-slate-600 border border-slate-200'}`}
                        >
                            Month
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <DollarSign size={18} />
                            <span className="text-xs font-medium">Total Revenue</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">₹135K</p>
                        <p className="text-xs text-emerald-600 mt-1">+14% from last month</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <ShoppingBag size={18} />
                            <span className="text-xs font-medium">Transactions</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">846</p>
                        <p className="text-xs text-emerald-600 mt-1">+8% from last month</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Package size={18} />
                            <span className="text-xs font-medium">Avg Order Value</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">₹159</p>
                        <p className="text-xs text-emerald-600 mt-1">+5% from last month</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <TrendingUp size={18} />
                            <span className="text-xs font-medium">Growth Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">14%</p>
                        <p className="text-xs text-slate-500 mt-1">Month over month</p>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <ChartCard title="Revenue Trend" subtitle="Last 6 months performance" height={isMobile ? 220 : 300}>
                        <LineChart data={revenueData} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
                            <XAxis dataKey="month" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <Tooltip {...chartTheme.tooltip} />
                            <Line type="monotone" dataKey="revenue" stroke={chartTheme.colors.sage[0]} strokeWidth={3} dot={{ r: 5 }} name="Revenue (₹)" />
                        </LineChart>
                    </ChartCard>
                </div>

                {/* Sales by Category */}
                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <ChartCard title="Sales by Category" subtitle="Revenue breakdown" height={isMobile ? 200 : 250}>
                        <BarChart data={salesByCategory} layout="vertical" margin={{ top: 10, right: 10, left: isMobile ? -20 : 0, bottom: 0 }}>
                            <XAxis type="number" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <YAxis type="category" dataKey="category" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 70 : 90} />
                            <Tooltip {...chartTheme.tooltip} />
                            <Bar dataKey="revenue" fill={chartTheme.colors.sage[0]} radius={[0, 4, 4, 0]} name="Revenue (₹)" />
                        </BarChart>
                    </ChartCard>
                </div>

                {/* Recent Transactions */}
                <div className="animate-in" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100">
                            <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">Recent Transactions</h2>
                        </div>
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable columns={columns} data={recentTransactions} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Sales;
