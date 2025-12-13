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
            <div className="relative">
                <select
                    id={name}
                    className={`
            block px-4 pb-2.5 pt-5 w-full text-sm text-slate-800 bg-white/50 border rounded-xl appearance-none focus:outline-none focus:ring-0 peer transition-colors cursor-pointer
            ${error
                            ? 'border-terra-300 focus:border-terra-500'
                            : 'border-sage-200 focus:border-sage-500 hover:border-sage-300'}
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

                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-sage-500 transition-colors">
                        <Icon size={18} />
                    </div>
                )}

                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronDown size={16} />
                </div>

                <label
                    htmlFor={name}
                    className={`
            absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
            ${Icon ? 'left-10' : 'left-4'}
            scale-75 -translate-y-4
            ${error ? 'text-terra-500' : 'text-slate-500 peer-focus:text-sage-600'}
          `}
                >
                    {label} {required && <span className="text-terra-400">*</span>}
                </label>
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
