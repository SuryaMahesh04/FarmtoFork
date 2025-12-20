import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
    label,
    options = [],
    error,
    icon: Icon,
    register,
    name,
    required,
    placeholder = "Select option",
    ...props
}) => {
    return (
        <div className="relative group">
            {/* Label above the select */}
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

                <select
                    id={name}
                    className={`
                        block w-full px-4 py-3 pr-10 text-sm text-slate-800 bg-white/50 border rounded-xl 
                        focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer
                        ${error
                            ? 'border-terra-300 focus:border-terra-500 focus:ring-terra-200'
                            : 'border-sage-200 focus:border-sage-500 focus:ring-sage-200 hover:border-sage-300'}
                        ${Icon ? 'pl-10' : ''}
                    `}
                    {...(register ? register(name, { required }) : {})}
                    {...props}
                    defaultValue=""
                >
                    <option value="" disabled className="text-slate-400">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronDown size={16} />
                </div>
            </div>

            {error && (
                <p className="mt-1 text-xs text-terra-500 animate-in">
                    {error.message || "Please select an option"}
                </p>
            )}
        </div>
    );
};

export default Select;
