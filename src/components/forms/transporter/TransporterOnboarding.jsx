import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Truck, Map, FileText, CheckCircle, User, Lock } from 'lucide-react';
import StepWizard from '../StepWizard';
import FormInput from '../../ui/FormInput';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import { indiaStates } from '../../../data/indiaGeoData';

const TransporterOnboarding = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const { register, handleSubmit, formState: { errors }, trigger, watch } = useForm({ mode: 'onChange' });

    const steps = [
        { title: 'Account Setup', icon: Lock },
        { title: 'Company Details', icon: User },
        { title: 'Fleet Info', icon: Truck },
        { title: 'Operating Region', icon: Map },
        { title: 'Documents', icon: FileText },
    ];

    const handleNext = async () => {
        const isStepValid = await trigger();
        if (isStepValid) {
            setFormData(prev => ({ ...prev, ...watch() }));
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const onSubmit = (data) => {
        console.log('Transporter Registered:', data);
        window.location.href = '/transporter';
    };

    const vehicleTypes = [
        { value: 'truck_large', label: 'Large Truck (10+ Ton)' },
        { value: 'truck_small', label: 'Mini Truck / Pickup' },
        { value: 'cold_storage', label: 'Refrigerated Van (Cold Chain)' },
        { value: 'mixed', label: 'Mixed Fleet' },
    ];

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Create your account</h2>
                        <FormInput
                            label="Email Address"
                            name="emailAccount"
                            type="email"
                            register={register}
                            required="Email is required"
                            error={errors.emailAccount}
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
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Company / Owner Details</h2>
                        <FormInput label="Company Name" name="companyName" register={register} required="Company Name is required" error={errors.companyName} icon={User} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Owner Name" name="ownerName" register={register} required="Owner Name is required" error={errors.ownerName} />
                            <FormInput label="Mobile Number" name="mobile" type="tel" register={register} required="Mobile is required" error={errors.mobile} />
                        </div>
                        <FormInput label="Email Address" name="email" type="email" register={register} required="Email is required" error={errors.email} />
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Fleet Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Fleet Size (Number of Vehicles)" name="fleetSize" type="number" register={register} required="Fleet Size is required" error={errors.fleetSize} icon={Truck} />
                            <Select label="Primary Vehicle Type" name="vehicleType" options={vehicleTypes} register={register} required="Vehicle Type is required" error={errors.vehicleType} />
                        </div>
                        <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" {...register('coldChain')} className="w-5 h-5 text-sky-500 rounded focus:ring-sky-400" />
                                <span className="text-sm font-medium text-slate-700">Specialized in Cold Chain Logistics?</span>
                            </label>
                            <p className="text-xs text-slate-500 mt-2 ml-8">Check this if you have refrigerated vehicles for perishable goods.</p>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Operating Regions</h2>
                        <Select label="Primary State of Operation" name="primaryState" options={indiaStates} register={register} required="State is required" error={errors.primaryState} icon={Map} />
                        <FormInput label="Service Hub City" name="hubCity" register={register} required="Hub City is required" error={errors.hubCity} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="GST Number" name="gst" register={register} required="GST is required" error={errors.gst} placeholder="22AAAAA0000A1Z5" />
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Upload Documents</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 border-2 border-dashed border-sage-200 rounded-xl bg-sage-50/50 text-center hover:bg-sage-50 transition-colors cursor-pointer">
                                <div className="text-sage-400 mb-2 mx-auto"><FileText size={32} className="mx-auto" /></div>
                                <p className="text-sm font-medium text-sage-700">Upload GST Certificate</p>
                            </div>
                            <div className="p-6 border-2 border-dashed border-sage-200 rounded-xl bg-sage-50/50 text-center hover:bg-sage-50 transition-colors cursor-pointer">
                                <div className="text-sage-400 mb-2 mx-auto"><FileText size={32} className="mx-auto" /></div>
                                <p className="text-sm font-medium text-sage-700">Upload Driving License (Owner)</p>
                            </div>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden glass-panel border border-white/60">
                <div className="bg-sky-500 p-6 text-white text-center">
                    <h1 className="text-2xl font-display font-bold">Transporter Registration</h1>
                    <p className="text-sky-100 text-sm">Register your fleet for logistics</p>
                </div>
                <div className="p-8">
                    <StepWizard steps={steps} currentStep={currentStep} />
                    <form className="mt-8 min-h-[300px] flex flex-col justify-between">
                        {renderStep()}
                        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0} className={currentStep === 0 ? 'invisible' : ''}>Back</Button>
                            {currentStep === steps.length - 1 ? (
                                <Button onClick={handleSubmit(onSubmit)} className="w-32 bg-sky-500 hover:bg-sky-600">Submit</Button>
                            ) : (
                                <Button onClick={handleNext} className="w-32 bg-sky-500 hover:bg-sky-600">Next</Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TransporterOnboarding;
