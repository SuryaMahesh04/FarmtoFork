import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Store, MapPin, FileText, CheckCircle } from 'lucide-react';
import StepWizard from '../StepWizard';
import FormInput from '../../ui/FormInput';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import { indiaStates } from '../../../data/indiaGeoData';

const RetailerOnboarding = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { register, handleSubmit, formState: { errors }, trigger } = useForm({ mode: 'onChange' });

    const steps = [
        { title: 'Store Details', icon: Store },
        { title: 'Location', icon: MapPin },
        { title: 'Compliance', icon: FileText },
    ];

    const handleNext = async () => {
        const isStepValid = await trigger();
        if (isStepValid) setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));
    const onSubmit = (data) => {
        console.log('Retailer Registered:', data);
        window.location.href = '/retailer';
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
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Store Information</h2>
                        <FormInput label="Store Name" name="storeName" register={register} required="Store Name is required" error={errors.storeName} icon={Store} />
                        <Select label="Store Type" name="storeType" options={storeTypes} register={register} required="Store Type is required" error={errors.storeType} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Owner Name" name="ownerName" register={register} required="Owner Name is required" error={errors.ownerName} />
                            <FormInput label="Mobile" name="mobile" register={register} required="Mobile is required" error={errors.mobile} />
                        </div>
                    </motion.div>
                );
            case 1:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Store Location</h2>
                        <Select label="State" name="state" options={indiaStates} register={register} required="State is required" error={errors.state} icon={MapPin} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="City" name="city" register={register} required="City is required" error={errors.city} />
                            <FormInput label="Pincode" name="pincode" type="number" register={register} required="Pincode is required" error={errors.pincode} />
                        </div>
                        <FormInput label="Full Address" name="address" register={register} required="Address is required" error={errors.address} />
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Compliance (Optional)</h2>
                        <p className="text-xs text-slate-500 mb-4">Providing these details helps in verification and building trust.</p>
                        <FormInput label="GST Number" name="gst" register={register} placeholder="Optional" />
                        <FormInput label="FSSAI License" name="fssai" register={register} placeholder="Optional" />
                        <div className="p-4 bg-terra-50 rounded-xl border border-terra-100 mt-4">
                            <p className="text-xs text-terra-600">By registering, you agree to participate in the transparent pricing mechanism for consumers.</p>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-terra-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden glass-panel border border-white/60">
                <div className="bg-terra-400 p-6 text-white text-center">
                    <h1 className="text-2xl font-display font-bold">Retailer Registration</h1>
                    <p className="text-terra-100 text-sm">Connect with distributors and farmers directly</p>
                </div>
                <div className="p-8">
                    <StepWizard steps={steps} currentStep={currentStep} />
                    <form className="mt-8 min-h-[300px] flex flex-col justify-between">
                        {renderStep()}
                        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0} className={currentStep === 0 ? 'invisible' : 'text-terra-600 hover:bg-terra-50'}>Back</Button>
                            {currentStep === steps.length - 1 ? (
                                <Button onClick={handleSubmit(onSubmit)} className="w-32 bg-terra-400 hover:bg-terra-500 border-terra-500">Submit</Button>
                            ) : (
                                <Button onClick={handleNext} className="w-32 bg-terra-400 hover:bg-terra-500 border-terra-500">Next</Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RetailerOnboarding;
