import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';
import Landing from './pages/Landing';
import FarmerOnboarding from './components/forms/farmer/FarmerOnboarding';
import TransporterOnboarding from './components/forms/transporter/TransporterOnboarding';
import DistributorOnboarding from './components/forms/distributor/DistributorOnboarding';
import RetailerOnboarding from './components/forms/retailer/RetailerOnboarding';

import FarmerDashboard from './pages/farmer/FarmerDashboard';
import BatchDetail from './pages/farmer/BatchDetail';
import MyBatches from './pages/farmer/MyBatches';
import CreateBatch from './pages/farmer/CreateBatch';
import GenerateQR from './pages/farmer/GenerateQR';
import Analytics from './pages/farmer/Analytics';
import Settings from './pages/farmer/Settings';

import TransporterDashboard from './pages/transporter/TransporterDashboard';
import DistributorDashboard from './pages/distributor/DistributorDashboard';
import RetailerDashboard from './pages/retailer/RetailerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import TraceProduct from './pages/consumer/TraceProduct';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen relative overflow-hidden">
                <Routes>
                    <Route path="/" element={<Landing />} />

                    {/* Onboarding Routes */}
                    <Route path="/onboarding/farmer" element={<FarmerOnboarding />} />
                    <Route path="/onboarding/transporter" element={<TransporterOnboarding />} />
                    <Route path="/onboarding/distributor" element={<DistributorOnboarding />} />
                    <Route path="/onboarding/retailer" element={<RetailerOnboarding />} />

                    {/* Dashboard Routes */}
                    <Route path="/farmer" element={<FarmerDashboard />} />
                    <Route path="/farmer/create-batch" element={<CreateBatch />} />
                    <Route path="/farmer/batches" element={<MyBatches />} />
                    <Route path="/farmer/scan" element={<GenerateQR />} />
                    <Route path="/farmer/analytics" element={<Analytics />} />
                    <Route path="/farmer/settings" element={<Settings />} />
                    <Route path="/farmer/batch/:batchId" element={<BatchDetail />} />

                    <Route path="/transporter" element={<TransporterDashboard />} />
                    <Route path="/distributor" element={<DistributorDashboard />} />
                    <Route path="/retailer" element={<RetailerDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />

                    {/* Public Trace Route */}
                    <Route path="/trace/:batchId" element={<TraceProduct />} />
                    <Route path="/trace" element={<TraceProduct />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
