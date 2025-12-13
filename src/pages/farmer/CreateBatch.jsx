import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';

const CreateBatch = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate('/farmer/batches');
        }, 1500);
    };

    return (
        <DashboardLayout role="farmer">
            <div className="max-w-2xl mx-auto space-y-6 animate-in">
                <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(-1)}>
                    Back
                </Button>

                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-800">Create New Batch</h1>
                    <p className="text-slate-500">Register a new crop batch for tracking</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-sage-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Crop Type</label>
                                <select className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 bg-white">
                                    <option>Select Crop</option>
                                    <option>Wheat</option>
                                    <option>Rice</option>
                                    <option>Pulses</option>
                                    <option>Cotton</option>
                                    <option>Sugarcane</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Variety</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none"
                                    placeholder="e.g. Sharbati"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Quantity (kg)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none"
                                    placeholder="e.g. 1000"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Sowing Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Initial Notes</label>
                            <textarea
                                className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none h-32 resize-none"
                                placeholder="Add any specific details about this batch..."
                            ></textarea>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancel</Button>
                            <Button type="submit" icon={Save} disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Batch'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateBatch;
