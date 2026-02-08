import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FarmerOnboarding from './components/forms/farmer/FarmerOnboarding';
import TransporterOnboarding from './components/forms/transporter/TransporterOnboarding';
import DistributorOnboarding from './components/forms/distributor/DistributorOnboarding';
import RetailerOnboarding from './components/forms/retailer/RetailerOnboarding';

import FarmerDashboard from './pages/farmer/FarmerDashboard';
import BatchDetail from './pages/farmer/BatchDetail';
import MyBatches from './pages/farmer/MyBatches';
import MyFarm from './pages/farmer/MyFarm';
import CreateBatch from './pages/farmer/CreateBatch';
import GenerateQR from './pages/farmer/GenerateQR';
import Analytics from './pages/farmer/Analytics';
import Settings from './pages/farmer/Settings';
import CreateShipment from './pages/farmer/CreateShipment';
import Shipments from './pages/farmer/Shipments';

import TransporterDashboard from './pages/transporter/TransporterDashboard';
import TransporterShipments from './pages/transporter/Shipments';
import ShipmentRequests from './pages/transporter/ShipmentRequests';
import TransporterDrivers from './pages/transporter/Drivers';
import TransporterRoutes from './pages/transporter/Routes';
import TransporterVehicles from './pages/transporter/Vehicles';
import TransporterAssistant from './pages/transporter/AssistantHelp';
import TransporterSettings from './pages/transporter/Settings';
import TransporterAnalytics from './pages/transporter/Analytics';
import ShipmentDetail from './pages/transporter/ShipmentDetail';
import DistributorDashboard from './pages/distributor/DistributorDashboard';
import DistributorShipments from './pages/distributor/Shipments';
import DistributorInventory from './pages/distributor/Inventory';
import DistributorIncoming from './pages/distributor/Incoming';
import DistributorQuality from './pages/distributor/Quality';
import DistributorSettings from './pages/distributor/Settings';
import RetailerDashboard from './pages/retailer/RetailerDashboard';
import RetailerProducts from './pages/retailer/Products';
import RetailerSales from './pages/retailer/Sales';
import RetailerSettings from './pages/retailer/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminApprovals from './pages/admin/Approvals';
import AdminPlatformStats from './pages/admin/PlatformStats';
import AdminSettings from './pages/admin/Settings';
import TraceProduct from './pages/consumer/TraceProduct';
import Notifications from './pages/Notifications';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverVehicle from './pages/driver/DriverVehicle';
import DriverShipments from './pages/driver/DriverShipments';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen relative overflow-hidden">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/notifications" element={<Notifications />} />

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
                    <Route path="/farmer/batches/:batchId" element={<BatchDetail />} />
                    <Route path="/farmer/create-shipment" element={<CreateShipment />} />
                    <Route path="/farmer/shipments" element={<Shipments />} />
                    <Route path="/farmer/my-farm" element={<MyFarm />} />
                    <Route path="/farmer/shipment/:shipmentId" element={<ShipmentDetail role="farmer" />} />

                    <Route path="/transporter" element={<TransporterDashboard />} />
                    <Route path="/transporter/requests" element={<ShipmentRequests />} />
                    <Route path="/transporter/vehicles" element={<TransporterVehicles />} />
                    <Route path="/transporter/shipments" element={<TransporterShipments />} />
                    <Route path="/transporter/drivers" element={<TransporterDrivers />} />
                    <Route path="/transporter/routes" element={<TransporterRoutes />} />
                    <Route path="/transporter/assistant" element={<TransporterAssistant />} />
                    <Route path="/transporter/settings" element={<TransporterSettings />} />
                    <Route path="/transporter/analytics" element={<TransporterAnalytics />} />
                    <Route path="/transporter/shipment/:shipmentId" element={<ShipmentDetail role="transporter" />} />

                    {/* Driver Routes */}
                    <Route path="/driver" element={<DriverDashboard />} />
                    <Route path="/driver/vehicle" element={<DriverVehicle />} />
                    <Route path="/driver/shipments" element={<DriverShipments />} />

                    <Route path="/distributor" element={<DistributorDashboard />} />
                    <Route path="/distributor/shipments" element={<DistributorShipments />} />
                    <Route path="/distributor/inventory" element={<DistributorInventory />} />
                    <Route path="/distributor/incoming" element={<DistributorIncoming />} />
                    <Route path="/distributor/quality" element={<DistributorQuality />} />
                    <Route path="/distributor/settings" element={<DistributorSettings />} />
                    <Route path="/distributor/shipment/:shipmentId" element={<ShipmentDetail role="distributor" />} />

                    <Route path="/retailer" element={<RetailerDashboard />} />
                    <Route path="/retailer/products" element={<RetailerProducts />} />
                    <Route path="/retailer/sales" element={<RetailerSales />} />
                    <Route path="/retailer/settings" element={<RetailerSettings />} />

                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/approvals" element={<AdminApprovals />} />
                    <Route path="/admin/stats" element={<AdminPlatformStats />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />

                    {/* Public Trace Route */}
                    <Route path="/trace/:batchId" element={<TraceProduct />} />
                    <Route path="/trace" element={<TraceProduct />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
