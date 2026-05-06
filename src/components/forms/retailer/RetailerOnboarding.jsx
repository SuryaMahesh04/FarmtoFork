import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Store, MapPin, FileText, CheckCircle, Lock, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StepWizard from '../StepWizard';
import FormInput from '../../ui/FormInput';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import LocationPickerModal from '../../ui/LocationPickerModal';
import { indiaStates } from '../../../data/indiaGeoData';
import { api, authHelpers } from '../../../utils/api';

const RetailerOnboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMapOpen, setIsMapOpen] = useState(false);
    
    const { register, handleSubmit, formState: { errors }, trigger, watch, setValue } = useForm({ mode: 'onChange' });

    const onLocationConfirm = (locationData) => {
        const { coordinates, address } = locationData;
        if (address) {
            // Find state match from our indiaStates data
            const stateMatch = indiaStates.find(s => 
                s.label.toLowerCase() === address.state.toLowerCase() ||
                s.value.toLowerCase() === address.state.toLowerCase()
            );

            if (stateMatch) {
                setValue('state', stateMatch.value);
            }
            
            setValue('city', address.city || address.district || '');
            setValue('pincode', address.pincode);
            setValue('address', address.formattedAddress);
            
            // Store coordinates for profile update
            setFormData(prev => ({ 
                ...prev, 
                coordinates: coordinates,
                addressObject: address 
            }));
        }
    };

    const steps = [
        { title: 'Account Setup', icon: Lock },
        { title: 'Store Details', icon: Store },
        { title: 'Location', icon: MapPin },
        { title: 'Compliance', icon: FileText },
        { title: 'Review', icon: CheckCircle },
    ];

    const handleNext = async () => {
        const isStepValid = await trigger();
        if (isStepValid) {
            setFormData(prev => ({ ...prev, ...watch() }));
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            // 1. Register User
            const regRes = await api.auth.register({
                email: formData.email,
                password: formData.password,
                role: 'retailer'
            });

            if (regRes.success) {
                // 2. Save Session
                authHelpers.saveToken(regRes.data.token);
                authHelpers.saveUser(regRes.data.user);

                // 3. Update Profile
                await api.auth.updateProfile({
                    fullName: data.ownerName,
                    mobile: data.mobile,
                    storeName: data.storeName,
                    storeType: data.storeType,
                    state: data.state,
                    city: data.city,
                    storeAddress: data.address,
                    gstNumber: data.gst,
                    fssaiLicense: data.fssai,
                    ownerName: data.ownerName,
                    address: {
                        formattedAddress: data.address,
                        city: data.city,
                        state: data.state,
                        coordinates: formData.coordinates || null
                    }
                });

                // 4. Redirect
                navigate('/retailer');
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
            setCurrentStep(0); // Error usually in account setup
        } finally {
            setLoading(false);
        }
    };

    const storeTypes = [
        { value: 'supermarket', label: 'Supermarket / Hypermarket' },
        { value: 'grocery', label: 'Kirana Store / Grocery' },
        { value: 'online', label: 'Online Grocery / E-commerce' },
        { value: 'organic_specialty', label: 'Organic Specialty Store' },
    ];

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Create your account</h2>
                        <FormInput
                            label="Email Address"
                            name="email"
                            type="email"
                            register={register}
                            required="Email is required"
                            error={errors.email}
                            placeholder="retailer@example.com"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="Password"
                                name="password"
                                type="password"
                                register={register}
                                required="Password is required"
                                error={errors.password}
                            />
                            <FormInput
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                register={register}
                                required="Confirm Password is required"
                                error={errors.confirmPassword}
                                validate={(val) => val === watch('password') || 'Passwords do not match'}
                            />
                        </div>
                    </motion.div>
                );
            case 1:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Store Information</h2>
                        <FormInput label="Store Name" name="storeName" register={register} required="Store Name is required" error={errors.storeName} icon={Store} />
                        <Select label="Store Type" name="storeType" options={storeTypes} register={register} required="Store Type is required" error={errors.storeType} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Owner Name" name="ownerName" register={register} required="Owner Name is required" error={errors.ownerName} icon={User} />
                            <FormInput label="Mobile" name="mobile" register={register} required="Mobile is required" error={errors.mobile} />
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-display font-semibold text-slate-700">Store Location</h2>
                            <button 
                                type="button"
                                onClick={() => setIsMapOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all shadow-sm"
                            >
                                <MapPin size={14} />
                                Choose from Map
                            </button>
                        </div>
                        <Select label="State" name="state" options={indiaStates} register={register} required="State is required" error={errors.state} icon={MapPin} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="City" name="city" register={register} required="City is required" error={errors.city} />
                            <FormInput label="Pincode" name="pincode" type="number" register={register} required="Pincode is required" error={errors.pincode} />
                        </div>
                        <FormInput label="Full Address" name="address" register={register} required="Address is required" error={errors.address} />
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Compliance</h2>
                        <p className="text-xs text-slate-500 mb-4">Providing these details helps in verification and building trust.</p>
                        <FormInput label="GST Number" name="gst" register={register} placeholder="Optional" />
                        <FormInput label="FSSAI License" name="fssai" register={register} placeholder="Optional" />
                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 mt-4">
                            <p className="text-xs text-purple-600">By registering, you agree to participate in the transparent pricing mechanism for consumers.</p>
                        </div>
                    </motion.div>
                );
            case 4:
                const data = watch();
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Review Details</h2>
                        <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 space-y-4">
                            <ReviewRow label="Email" value={data.email} />
                            <ReviewRow label="Store Name" value={data.storeName} />
                            <ReviewRow label="Owner" value={data.ownerName} />
                            <ReviewRow label="Type" value={storeTypes.find(t => t.value === data.storeType)?.label} />
                            <div className="h-px bg-purple-200/50 my-2"></div>
                            <ReviewRow label="Location" value={`${data.city}, ${data.state}`} />
                            <ReviewRow label="Address" value={data.address} />
                        </div>
                        <p className="text-xs text-slate-500 text-center">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden glass-panel border border-white/60">
                <div className="bg-purple-600 p-6 text-white text-center relative">
                    <h1 className="text-2xl font-display font-bold">Retailer Registration</h1>
                    <p className="text-purple-100 text-sm">Connect with distributors and farmers directly</p>
                </div>
                <div className="p-8">
                    <StepWizard steps={steps} currentStep={currentStep} />
                    <form className="mt-8 min-h-[350px] flex flex-col justify-between">
                        <div>
                            {renderStep()}
                            {error && currentStep === steps.length - 1 && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mt-4">
                                    {error}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                            <Button variant="ghost" type="button" onClick={handleBack} disabled={currentStep === 0 || loading} className={currentStep === 0 ? 'invisible' : 'text-purple-600 hover:bg-purple-50'}>Back</Button>
                            {currentStep === steps.length - 1 ? (
                                <Button onClick={handleSubmit(onSubmit)} disabled={loading} className="w-32 bg-purple-600 hover:bg-purple-700 border-purple-700">
                                    {loading ? 'Submitting...' : 'Submit'}
                                </Button>
                            ) : (
                                <Button type="button" onClick={handleNext} className="w-32 bg-purple-600 hover:bg-purple-700 border-purple-700">Next</Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <LocationPickerModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onConfirm={onLocationConfirm}
            />
        </div>
    );
};

const ReviewRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-700">{value || '-'}</span>
    </div>
);

export default RetailerOnboarding;
