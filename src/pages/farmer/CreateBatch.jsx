import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, MapPin, ShieldCheck, Check, X, Sprout } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import FormInput from '../../components/ui/FormInput';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { api } from '../../utils/api';

const CreateBatch = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [isConfiguring, setIsConfiguring] = useState(false);
    const [profile, setProfile] = useState(null);
    const [locationInfo, setLocationInfo] = useState({
        state: '',
        district: '',
        village: '',
        coordinates: { lat: null, lng: null },
        formattedAddress: ''
    });
    const [error, setError] = useState('');

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.auth.getMe();
                if (res.success) {
                    const farmProfile = res.data.profile;
                    setProfile(farmProfile);
                    // Pre-fill with profile location if exists
                    if (farmProfile?.address?.coordinates?.lat) {
                        setLocationInfo({
                            state: farmProfile.state || 'N/A',
                            district: farmProfile.district || 'N/A',
                            village: farmProfile.village || 'N/A',
                            coordinates: farmProfile.address.coordinates,
                            formattedAddress: farmProfile.address.formattedAddress || 'Profile Location'
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            }
        };
        fetchProfile();
    }, []);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsConfiguring(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
                    const data = await response.json();

                    if (data && data.address) {
                        const addr = data.address;
                        const detectedLocation = {
                            state: addr.state || 'N/A',
                            district: addr.state_district || addr.county || addr.district || 'N/A',
                            village: addr.village || addr.suburb || addr.town || addr.city || addr.hamlet || 'N/A',
                            formattedAddress: data.display_name,
                            coordinates: { lat, lng }
                        };
                        setLocationInfo(detectedLocation);
                    } else {
                        throw new Error('Could not resolve address details');
                    }
                } catch (error) {
                    console.error('Location detection error:', error);
                    alert('Failed to detect address details. Continuing with coordinates only.');
                    setLocationInfo(prev => ({
                        ...prev,
                        formattedAddress: `Lat: ${lat}, Lng: ${lng}`,
                        coordinates: { lat, lng }
                    }));
                } finally {
                    setIsConfiguring(false);
                }
            },
            (error) => {
                console.error('Geolocation permission error:', error);
                alert('Location access denied. Please allow access to use this feature.');
                setIsConfiguring(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError('');

            const res = await api.farmer.createBatch({
                crop: data.crop,
                variety: data.variety,
                quantity: parseFloat(data.quantity),
                unit: data.unit || 'kg',
                harvestDate: data.harvestDate,
                pricePerUnit: parseFloat(data.pricePerUnit || 0),
                qualityScore: parseFloat(data.qualityScore || 0),
                organicCertified: profile?.organicCertified || false,
                location: {
                    state: locationInfo.state,
                    district: locationInfo.district,
                    village: locationInfo.village,
                    gpsCoordinates: locationInfo.coordinates
                },
                notes: data.notes
            });

            if (res.success) {
                // Navigate to batch detail to show the generated QR code
                navigate(`/farmer/batches/${res.data._id}`);
            } else {
                setError(res.message || 'Failed to create batch');
            }
        } catch (err) {
            console.error('Create error:', err);
            setError(err.message || 'Failed to create batch. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="farmer">
            <div className="max-w-3xl mx-auto animate-in">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/farmer/batches')}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-900">Create New Batch</h1>
                        <p className="text-slate-600">Register a new crop batch for tracking</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                    {/* Crop Information */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Crop Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Crop Name <span className="text-red-500">*</span></label>
                                <select
                                    {...register("crop", { required: "Crop name is required" })}
                                    className="w-full px-4 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
                                >
                                    <option value="">Select Crop</option>
                                    <option value="Wheat">Wheat</option>
                                    <option value="Rice">Rice</option>
                                    <option value="Pulses">Pulses</option>
                                    <option value="Cotton">Cotton</option>
                                    <option value="Sugarcane">Sugarcane</option>
                                    <option value="Maize">Maize</option>
                                    <option value="Barley">Barley</option>
                                </select>
                                {errors.crop && <p className="text-xs text-red-500">{errors.crop.message}</p>}
                            </div>

                            <FormInput
                                label="Variety"
                                name="variety"
                                register={register}
                                required="Variety is required"
                                error={errors.variety}
                                placeholder="e.g., Basmati, IR64"
                            />
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quantity Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="Quantity"
                                name="quantity"
                                type="number"
                                step="0.01"
                                register={register}
                                required="Quantity is required"
                                error={errors.quantity}
                                placeholder="500"
                            />
                            <Select
                                label="Unit"
                                name="unit"
                                register={register}
                                required="Unit is required"
                                error={errors.unit}
                                options={[
                                    { value: 'kg', label: 'Kilograms (kg)' },
                                    { value: 'quintal', label: 'Quintals' },
                                    { value: 'ton', label: 'Tons' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Harvest & Pricing */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Harvest & Pricing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormInput
                                label="Harvest Date"
                                name="harvestDate"
                                type="date"
                                register={register}
                                required="Harvest date is required"
                                error={errors.harvestDate}
                            />
                            <FormInput
                                label="Price per Unit (₹)"
                                name="pricePerUnit"
                                type="number"
                                step="0.01"
                                register={register}
                                error={errors.pricePerUnit}
                                placeholder="Optional"
                            />
                            <FormInput
                                label="Quality Score (0-100)"
                                name="qualityScore"
                                type="number"
                                min="0"
                                max="100"
                                register={register}
                                error={errors.qualityScore}
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    {/* Location Details */}
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">Location Details</h2>
                            <Button
                                type="button"
                                variant="secondary"
                                icon={MapPin}
                                size="sm"
                                onClick={handleDetectLocation}
                                loading={isConfiguring}
                                disabled={isConfiguring}
                            >
                                {isConfiguring ? 'Detecting...' : 'Detect My Location'}
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">State</div>
                                <div className="font-medium text-slate-800 text-sm truncate">{locationInfo.state || 'Detecting...'}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">District</div>
                                <div className="font-medium text-slate-800 text-sm truncate">{locationInfo.district || 'Detecting...'}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Village</div>
                                <div className="font-medium text-slate-800 text-sm truncate">{locationInfo.village || 'Detecting...'}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Coordinates</div>
                                <div className="font-medium text-slate-800 text-sm truncate">
                                    {locationInfo.coordinates.lat ? `${locationInfo.coordinates.lat.toFixed(4)}, ${locationInfo.coordinates.lng.toFixed(4)}` : 'Detecting...'}
                                </div>
                            </div>
                        </div>

                        {locationInfo.formattedAddress && (
                            <div className="flex items-start gap-2 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 mb-6">
                                <ShieldCheck className="text-emerald-500 mt-0.5" size={16} />
                                <span className="text-xs text-emerald-800 leading-relaxed font-medium">
                                    {locationInfo.formattedAddress}
                                </span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 font-bold">
                                Notes (Optional)
                            </label>
                            <textarea
                                {...register('notes')}
                                rows={3}
                                className="block w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-500 transition-all"
                                placeholder="Any additional notes about this batch..."
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/farmer/batches')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            icon={Save}
                            disabled={loading}
                            className="flex-1 md:flex-none"
                        >
                            {loading ? 'Creating Batch...' : 'Create Batch'}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateBatch;
