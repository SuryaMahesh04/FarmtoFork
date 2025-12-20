import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Building2, Package, FileText, CheckCircle, Database, Lock } from 'lucide-react';
import StepWizard from '../StepWizard';
import FormInput from '../../ui/FormInput';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import { indiaStates } from '../../../data/indiaGeoData';

const DistributorOnboarding = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { register, handleSubmit, formState: { errors }, trigger, watch } = useForm({ mode: 'onChange' });

    const steps = [
        { title: 'Account Setup', icon: Lock },
        { title: 'Business Details', icon: Building2 },
        { title: 'Warehouse', icon: Database },
        { title: 'Compliance', icon: FileText },
    ];

    const handleNext = async () => {
        const isStepValid = await trigger();
        if (isStepValid) setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const onSubmit = (data) => {
        console.log('Distributor Registered:', data);
        window.location.href = '/distributor';
    };

    const storageTypes = [
        { value: 'cold_storage', label: 'Cold Storage' },
        { value: 'dry_storage', label: 'Dry Storage' },
        { value: 'grain_silo', label: 'Grain Silos' },
        { value: 'mixed', label: 'Mixed Storage' },
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
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Business Information</h2>
                        <FormInput label="Business Name" name="businessName" register={register} required="Business Name is required" error={errors.businessName} icon={Building2} />
                        <FormInput label="Owner Name" name="ownerName" register={register} required="Owner Name is required" error={errors.ownerName} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Mobile" name="mobile" register={register} required="Mobile is required" error={errors.mobile} />
                            <FormInput label="Email" name="email" type="email" register={register} required="Email is required" error={errors.email} />
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Warehouse & Storage</h2>
                        <Select label="Storage Type" name="storageType" options={storageTypes} register={register} required="Storage Type is required" error={errors.storageType} icon={Database} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Capacity (Tonnes)" name="capacity" type="number" register={register} required="Capacity is required" error={errors.capacity} />
                            <FormInput label="Number of Warehouses" name="numWarehouses" type="number" register={register} required="Count is required" error={errors.numWarehouses} />
                        </div>
                        <Select label="State" name="state" options={indiaStates} register={register} required="State is required" error={errors.state} />
                        <FormInput label="City / Location" name="location" register={register} required="Location is required" error={errors.location} />
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Compliance</h2>
                        <FormInput label="GST Number" name="gst" register={register} required="GST is required" error={errors.gst} placeholder="22AAAAA0000A1Z5" />
                        <FormInput label="FSSAI License Number" name="fssai" register={register} required="FSSAI is required" error={errors.fssai} placeholder="100xxxxxxxxxxx" />
                        <FormInput label="Bank Account Number" name="bankAccount" register={register} required="Bank details required" error={errors.bankAccount} />
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-wheat-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden glass-panel border border-white/60">
                <div className="bg-wheat-400 p-6 text-white text-center">
                    <h1 className="text-2xl font-display font-bold">Distributor Registration</h1>
                    <p className="text-wheat-100 text-sm">Manage inventory and supply chain flow</p>
                </div>
                <div className="p-8">
                    <StepWizard steps={steps} currentStep={currentStep} />
                    <form className="mt-8 min-h-[300px] flex flex-col justify-between">
                        {renderStep()}
                        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0} className={currentStep === 0 ? 'invisible text-wheat-600' : 'text-wheat-600 hover:bg-wheat-50'}>Back</Button>
                            {currentStep === steps.length - 1 ? (
                                <Button onClick={handleSubmit(onSubmit)} className="w-32 bg-wheat-400 hover:bg-wheat-500 border-wheat-500">Submit</Button>
                            ) : (
                                <Button onClick={handleNext} className="w-32 bg-wheat-400 hover:bg-wheat-500 border-wheat-500">Next</Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DistributorOnboarding;
