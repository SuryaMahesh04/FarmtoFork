import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FormInput = ({
    label,
    error,
    icon: Icon,
    type = 'text',
    register,
    name,
    required,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    return (
        <div className="relative group">
            {/* Label above the input */}
            <label
                htmlFor={name}
                className={`block text-sm font-medium mb-2 ${error ? 'text-terra-500' : 'text-slate-700'
                    }`}
            >
                {label} {required && <span className="text-terra-400">*</span>}
            </label>

            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 focus-within:text-sage-500 transition-colors">
                        <Icon size={18} />
                    </div>
                )}

                <input
                    type={inputType}
                    id={name}
                    className={`
                        block w-full px-4 py-3 text-sm text-slate-800 bg-white/50 border rounded-xl 
                        focus:outline-none focus:ring-2 transition-all
                        ${error
                            ? 'border-terra-300 focus:border-terra-500 focus:ring-terra-200'
                            : 'border-sage-200 focus:border-sage-500 focus:ring-sage-200 hover:border-sage-300'}
                        ${Icon ? 'pl-10' : ''}
                        ${isPasswordField ? 'pr-10' : ''}
                    `}
                    {...(register ? register(name, { required }) : {})}
                    {...props}
                />

                {/* Password toggle button */}
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-1 text-xs text-terra-500 flex items-center gap-1 animate-in">
                    {error.message || `${label} is required`}
                </p>
            )}
        </div>
    );
};

export default FormInput;
