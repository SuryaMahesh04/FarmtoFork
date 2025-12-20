import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Sprout, Truck, Store, Database, Shield, LogIn } from 'lucide-react';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import { useForm } from 'react-hook-form';
import { api, authHelpers } from '../utils/api';
import logo from '../assets/logo2.png';

const LoginPage = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [selectedRole, setSelectedRole] = useState('farmer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const roles = [
        { id: 'farmer', label: 'Farmer', icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        { id: 'distributor', label: 'Distributor', icon: Database, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
        { id: 'transporter', label: 'Transporter', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
        { id: 'retailer', label: 'Retailer', icon: Store, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
        { id: 'admin', label: 'Admin', icon: Shield, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' }
    ];

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            const response = await api.auth.login({
                email: data.email,
                password: data.password,
                role: selectedRole
            });

            if (response.success) {
                // Save token and user data
                authHelpers.saveToken(response.data.token);
                authHelpers.saveUser(response.data.user);

                // Navigate to role-specific dashboard
                navigate(`/${selectedRole}`);
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-slate-50 flex overflow-hidden">
            {/* Left Side - Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-br from-emerald-500/30 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 -right-1/4 w-full h-full bg-gradient-to-tl from-blue-500/30 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 p-12 text-white max-w-lg">
                    <Link to="/" className="inline-flex items-center gap-3 mb-8">
                        <img src={logo} alt="Farm2Fork" className="h-16 w-auto" />
                        <span className="font-display font-bold text-3xl tracking-tight">
                            Farm<span className="text-emerald-400">2</span>Fork
                        </span>
                    </Link>
                    <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
                        Welcome back to the <span className="text-emerald-400">Future of Agriculture</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Log in to access your dashboard, track shipments, manage inventory, and participate in the transparent food economy.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md max-h-screen overflow-y-auto px-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full"
                    >
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Sign In</h2>
                            <p className="text-slate-600">Enter your credentials to access your account</p>
                        </div>

                        {/* Role Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Select your role</label>
                            <div className="grid grid-cols-5 gap-2">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`
                                            flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200
                                            ${selectedRole === role.id
                                                ? `${role.bg} ${role.border} ring-2 ring-emerald-500/20 shadow-sm transform scale-105`
                                                : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-400'}
                                        `}
                                        title={role.label}
                                    >
                                        <role.icon size={20} className={`mb-1 ${selectedRole === role.id ? role.color : ''}`} />
                                        <span className={`text-[10px] font-medium truncate w-full text-center ${selectedRole === role.id ? 'text-slate-700' : ''}`}>
                                            {role.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <FormInput
                                label="Email Address"
                                name="email"
                                type="email"
                                register={register}
                                required="Email is required"
                                error={errors.email}
                                icon={User}
                                placeholder="name@example.com"
                            />

                            <div>
                                <FormInput
                                    label="Password"
                                    name="password"
                                    type="password"
                                    register={register}
                                    required="Password is required"
                                    error={errors.password}
                                    icon={Lock}
                                />
                                <div className="text-right mt-1">
                                    <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-900/10"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight size={18} />}
                                </span>
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-slate-50 text-slate-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700">Google</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700">Facebook</span>
                                </button>
                            </div>
                        </div>

                        <p className="mt-6 text-center text-sm text-slate-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700">
                                Sign up here
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
