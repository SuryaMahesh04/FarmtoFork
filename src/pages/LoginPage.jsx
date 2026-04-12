import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import { useForm } from 'react-hook-form';
import { api, authHelpers } from '../utils/api';
import logo from '../assets/logo2.png';

const LoginPage = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check for existing session
    React.useEffect(() => {
        if (authHelpers.isAuthenticated()) {
            const user = authHelpers.getUser();
            if (user && user.role) {
                navigate(`/${user.role}`);
            }
        }
    }, [navigate]);

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            const response = await api.auth.login({
                email: data.email,
                password: data.password
            });

            if (response.success) {
                // Save token and user data
                authHelpers.saveToken(response.data.token);
                authHelpers.saveUser(response.data.user);

                // Navigate to role-specific dashboard
                navigate(`/${response.data.user.role}`);
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

                        {/* Role Selector Removed */}

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

                        <p className="mt-8 text-center text-sm text-slate-600">
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
