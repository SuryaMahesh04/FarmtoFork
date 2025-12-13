import React from 'react';

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
    return (
        <div className="relative group">
            <div className="relative">
                <input
                    type={type}
                    id={name}
                    className={`
            block px-4 pb-2.5 pt-5 w-full text-sm text-slate-800 bg-white/50 border rounded-xl appearance-none focus:outline-none focus:ring-0 peer transition-colors
            ${error
                            ? 'border-terra-300 focus:border-terra-500'
                            : 'border-sage-200 focus:border-sage-500 hover:border-sage-300'}
            ${Icon ? 'pl-10' : ''}
          `}
                    placeholder=" "
                    {...(register ? register(name, { required }) : {})}
                    {...props}
                />

                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-sage-500 transition-colors">
                        <Icon size={18} />
                    </div>
                )}

                <label
                    htmlFor={name}
                    className={`
            absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] 
            ${Icon ? 'left-10' : 'left-4'}
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
            peer-focus:scale-75 peer-focus:-translate-y-4
            ${error ? 'text-terra-500' : 'text-slate-500 peer-focus:text-sage-600'}
          `}
                >
                    {label} {required && <span className="text-terra-400">*</span>}
                </label>
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
