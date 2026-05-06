import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, MapPin, Sprout, FileText, CheckCircle, Lock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StepWizard from '../StepWizard';
import FormInput from '../../ui/FormInput';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import { indiaStates, cropTypes, landTypes } from '../../../data/indiaGeoData';
import { api, authHelpers } from '../../../utils/api';
import LocationPickerModal from '../../ui/LocationPickerModal';

const FarmerOnboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isManualVillage, setIsManualVillage] = useState(false);
    const [certificateFile, setCertificateFile] = useState(null);
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
                
                // Try to find matching district
                const searchDistrict = address.district || address.city;
                const districtMatch = stateMatch.districts.find(d => 
                    d.name.toLowerCase().includes(searchDistrict.toLowerCase()) ||
                    searchDistrict.toLowerCase().includes(d.name.toLowerCase())
                );

                if (districtMatch) {
                    setValue('district', districtMatch.name);
                    
                    // Try to find matching village
                    const searchVillage = address.city || address.suburb;
                    const villageMatch = districtMatch.villages.find(v => 
                        v.toLowerCase().includes(searchVillage.toLowerCase()) ||
                        searchVillage.toLowerCase().includes(v.toLowerCase())
                    );

                    if (villageMatch) {
                        setValue('village', villageMatch);
                        setIsManualVillage(false);
                    } else if (searchVillage) {
                        // Fallback to manual entry if village isn't in our static list
                        setIsManualVillage(true);
                        setTimeout(() => setValue('village', searchVillage), 50);
                    }
                }
            }
            
            // Store coordinates and full address object
            setFormData(prev => ({ 
                ...prev, 
                coordinates: coordinates,
                addressObject: address 
            }));
        }
    };

    const selectedState = watch('state');
    const selectedDistrict = watch('district');

    const steps = [
        { title: 'Account Setup', icon: Lock },
        { title: 'Personal Details', icon: User },
        { title: 'Farm Details', icon: Sprout },
        { title: 'Review', icon: CheckCircle },
    ];

    const handleNext = async () => {
        const isStepValid = await trigger();
        if (isStepValid) {
            setFormData(prev => ({ ...prev, ...watch() }));
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            // First, register the user account (Step 0 data)
            const registerResponse = await api.auth.register({
                email: formData.email,
                password: formData.password,
                role: 'farmer'
            });

            if (registerResponse.success) {
                // Save token from registration
                authHelpers.saveToken(registerResponse.data.token);
                authHelpers.saveUser(registerResponse.data.user);

                // Handle organic certificate upload if selected
                let organicCertificateUrl = '';
                if (data.organicCertified === 'yes' && certificateFile) {
                    const formData = new FormData();
                    formData.append('document', certificateFile);
                    const uploadRes = await api.auth.uploadFile(formData);
                    if (uploadRes.success) {
                        organicCertificateUrl = uploadRes.data.url;
                    }
                }

                // Then, update profile with remaining onboarding data
                const updateRes = await api.auth.updateProfile({
                    fullName: data.fullName,
                    mobile: data.mobile,
                    state: data.state,
                    district: data.district,
                    village: data.village,
                    landSize: parseFloat(data.landSize),
                    landType: data.landType,
                    primaryCrop: data.primaryCrop,
                    organicCertified: data.organicCertified === 'yes',
                    organicCertificateUrl,
                    address: {
                        formattedAddress: formData.addressObject?.formattedAddress || `${data.village}, ${data.district}, ${data.state}`,
                        city: data.district,
                        state: data.state,
                        coordinates: formData.coordinates || null
                    }
                });

                if (updateRes.success) {
                    authHelpers.saveUser(updateRes.data);
                }

                // Navigate to farmer dashboard
                navigate('/farmer');
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
            setCurrentStep(0); // Go back to first step on error
        } finally {
            setLoading(false);
        }
    };

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
                            placeholder="name@example.com"
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
                            />
                        </div>
                    </motion.div>
                );
            case 1:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-display font-semibold text-slate-700">Tell us about yourself</h2>
                            <button 
                                type="button"
                                onClick={() => setIsMapOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-sage-600 bg-sage-50 border border-sage-100 hover:bg-sage-100 transition-all shadow-sm"
                            >
                                <MapPin size={14} />
                                Choose from Map
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Full Name" name="fullName" register={register} required="Name is required" error={errors.fullName} icon={User} />
                            <FormInput label="Mobile Number" name="mobile" type="tel" register={register} required="Mobile is required" error={errors.mobile} placeholder="+91 98765 43210" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select label="State" name="state" options={indiaStates} register={register} required="State is required" error={errors.state} icon={MapPin} />
                            <Select
                                label="District"
                                name="district"
                                options={selectedState ? indiaStates.find(s => s.value === selectedState)?.districts.map(d => ({ value: d.name, label: d.name })) : []}
                                register={register}
                                required="District is required"
                                error={errors.district}
                                disabled={!selectedState}
                            />
                        </div>
                        {isManualVillage ? (
                            <div className="space-y-4">
                                <FormInput label="Village / Area (Manual Entry)" name="village" register={register} required="Village is required" error={errors.village} />
                                <button
                                    type="button"
                                    onClick={() => { setIsManualVillage(false); setValue('village', ''); }}
                                    className="text-sm text-sage-600 hover:text-sage-800 underline"
                                >
                                    Select from List
                                </button>
                            </div>
                        ) : (
                            <Select
                                label="Village / Area"
                                name="village"
                                options={selectedState && selectedDistrict ?
                                    [...indiaStates.find(s => s.value === selectedState)?.districts.find(d => d.name === selectedDistrict)?.villages.map(v => ({ value: v, label: v })) || [],]
                                    : []}
                                register={register}
                                required="Village is required"
                                error={errors.village}
                                disabled={!selectedDistrict}
                                onChange={(e) => {
                                    if (e.target.value === 'Other') {
                                        setIsManualVillage(true);
                                        setValue('village', ''); // Clear value for manual entry
                                    }
                                }}
                            />
                        )}
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Farm Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Total Land Size (Acres)" name="landSize" type="number" register={register} required="Land size is required" error={errors.landSize} />
                            <Select label="Land Type" name="landType" options={landTypes} register={register} required="Land type is required" error={errors.landType} />
                        </div>
                        <Select label="Primary Crop" name="primaryCrop" options={cropTypes} register={register} required="Primary crop is required" error={errors.primaryCrop} />
                        <div className="p-4 bg-sage-50 rounded-xl border border-sage-100">
                            <p className="text-sm text-sage-700 mb-2 font-medium">Organic Certification (Optional)</p>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" value="yes" {...register('organicCertified')} className="text-sage-600 focus:ring-sage-500" />
                                    <span className="text-sm text-slate-600">Yes, I am certified</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" value="no" {...register('organicCertified')} className="text-sage-600 focus:ring-sage-500" />
                                    <span className="text-sm text-slate-600">No / In Process</span>
                                </label>
                            </div>

                            {/* Conditional Upload Field */}
                            {watch('organicCertified') === 'yes' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-sage-200">
                                    <p className="text-sm font-medium text-slate-700 mb-2">Upload Certificate</p>
                                    <div className="relative border-2 border-dashed border-sage-300 rounded-xl p-4 text-center hover:bg-sage-50 transition-colors">
                                        <input 
                                            type="file" 
                                            accept=".pdf,.jpg,.jpeg,.png,.docx" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={(e) => setCertificateFile(e.target.files[0])}
                                        />
                                        <div className="flex flex-col items-center gap-2 pointer-events-none relative z-0">
                                            {certificateFile ? (
                                                <>
                                                    <FileText className="text-emerald-500" size={24} />
                                                    <span className="text-sm font-medium text-slate-700 truncate max-w-full px-2">{certificateFile.name}</span>
                                                    <span className="text-xs text-slate-500">Click to change file</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="p-2 bg-sage-100 rounded-full text-sage-600">
                                                        <Plus size={20} />
                                                    </div>
                                                    <span className="text-sm text-slate-600">Click or drag certificate</span>
                                                    <span className="text-xs text-slate-400">PDF, JPG, PNG, DOCX (Max 5MB)</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            case 3:
                const data = watch();
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Review Details</h2>
                        <div className="bg-sage-50/80 p-6 rounded-2xl border border-sage-100 space-y-4">
                            <ReviewRow label="Email" value={data.email} />
                            <ReviewRow label="Full Name" value={data.fullName} />
                            <ReviewRow label="Mobile" value={data.mobile} />
                            <ReviewRow label="Location" value={`${data.village}, ${data.district}, ${data.state}`} />
                            <div className="h-px bg-sage-200/50 my-2"></div>
                            <ReviewRow label="Land Size" value={`${data.landSize} Acres`} />
                            <ReviewRow label="Primary Crop" value={cropTypes.find(c => c.value === data.primaryCrop)?.label} />
                        </div>
                        <p className="text-xs text-slate-500 text-center">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-sage-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden glass-panel border border-white/60">
                <div className="bg-sage-500 p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <h1 className="text-2xl font-display font-bold relative z-10">Farmer Registration</h1>
                    <p className="text-sage-100 text-sm relative z-10">Join the sustainable supply chain network</p>
                </div>

                <div className="p-8">
                    <StepWizard steps={steps} currentStep={currentStep} />

                    <form className="mt-8 min-h-[300px] flex flex-col justify-between">
                        {renderStep()}

                        {error && currentStep === steps.length - 1 && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mt-4">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                disabled={currentStep === 0 || loading}
                                className={currentStep === 0 ? 'invisible' : ''}
                            >
                                Back
                            </Button>

                            {currentStep === steps.length - 1 ? (
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={loading}
                                    className="w-32"
                                >
                                    {loading ? 'Submitting...' : 'Submit'}
                                </Button>
                            ) : (
                                <Button onClick={handleNext} className="w-32">Next</Button>
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

export default FarmerOnboarding;
