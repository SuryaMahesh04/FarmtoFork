import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, MapPin, CheckCircle, Lock, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StepWizard from '../StepWizard';
import FormInput from '../../ui/FormInput';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import { indiaStates } from '../../../data/indiaGeoData';
import { api, authHelpers } from '../../../utils/api';

const ConsumerOnboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors }, trigger, watch } = useForm({ mode: 'onChange' });

    const selectedState = watch('state');

    const steps = [
        { title: 'Account', icon: Lock },
        { title: 'Profile', icon: User },
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
            const registerResponse = await api.auth.register({
                email: formData.email,
                password: formData.password,
                role: 'consumer'
            });

            if (registerResponse.success) {
                authHelpers.saveToken(registerResponse.data.token);
                authHelpers.saveUser(registerResponse.data.user);

                await api.auth.updateProfile({
                    fullName: data.fullName,
                    mobile: data.mobile,
                    state: data.state,
                    city: data.city,
                });

                navigate('/consumer');
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
            setCurrentStep(0);
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
                            icon={Mail}
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
                                icon={Lock}
                            />
                            <FormInput
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                register={register}
                                required="Please confirm password"
                                error={errors.confirmPassword}
                                icon={Lock}
                            />
                        </div>
                    </motion.div>
                );
            case 1:
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Personal Details</h2>
                        <FormInput 
                            label="Full Name" 
                            name="fullName" 
                            register={register} 
                            required="Name is required" 
                            error={errors.fullName} 
                            icon={User} 
                        />
                        <FormInput 
                            label="Mobile Number" 
                            name="mobile" 
                            type="tel" 
                            register={register} 
                            required="Mobile is required" 
                            error={errors.mobile} 
                            icon={Phone}
                            placeholder="+91 98765 43210" 
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select 
                                label="State" 
                                name="state" 
                                options={indiaStates} 
                                register={register} 
                                required="State is required" 
                                error={errors.state} 
                                icon={MapPin} 
                            />
                            <FormInput 
                                label="City / Town" 
                                name="city" 
                                register={register} 
                                required="City is required" 
                                error={errors.city} 
                                icon={MapPin} 
                            />
                        </div>
                    </motion.div>
                );
            case 2:
                const data = watch();
                return (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                        <h2 className="text-xl font-display font-semibold text-slate-700 mb-4">Review Details</h2>
                        <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100 space-y-4">
                            <ReviewRow label="Email" value={data.email} />
                            <ReviewRow label="Full Name" value={data.fullName} />
                            <ReviewRow label="Mobile" value={data.mobile} />
                            <ReviewRow label="Location" value={`${data.city}, ${data.state}`} />
                        </div>
                        <p className="text-xs text-slate-500 text-center">Join thousands of consumers tracing their food origin.</p>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-teal-600 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-black/5"></div>
                    <h1 className="text-2xl font-display font-bold relative z-10">Consumer Signup</h1>
                    <p className="text-teal-50 text-sm relative z-10 opacity-80">Sync your verification history across devices</p>
                </div>

                <div className="p-8">
                    <StepWizard steps={steps} currentStep={currentStep} />

                    <form className="mt-8 min-h-[300px] flex flex-col justify-between">
                        {renderStep()}

                        {error && (
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
                                    className="w-32 bg-teal-600 hover:bg-teal-700"
                                >
                                    {loading ? 'Registering...' : 'Sign Up'}
                                </Button>
                            ) : (
                                <Button onClick={handleNext} className="w-32 bg-teal-600 hover:bg-teal-700">Next</Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ReviewRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-700">{value || '-'}</span>
    </div>
);

export default ConsumerOnboarding;
