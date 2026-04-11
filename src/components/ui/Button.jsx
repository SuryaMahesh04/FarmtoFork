import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    isLoading = false,
    loading = false, // Support both prop names to avoid leakage
    onClick,
    className = '',
    type = 'button',
    ...props
}) => {
    const activeLoading = isLoading || loading;

    const variants = {
        primary: "bg-sage-500 hover:bg-sage-600 text-white shadow-md hover:shadow-lg ring-sage-200",
        secondary: "bg-wheat-200 hover:bg-wheat-300 text-wheat-900 border border-wheat-300 shadow-sm hover:shadow-md",
        outline: "bg-transparent border border-sage-300 text-sage-600 hover:bg-sage-50",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
        danger: "bg-terra-400 hover:bg-terra-500 text-white shadow-md hover:shadow-lg",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            type={type}
            className={`
        relative inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
            onClick={!activeLoading ? onClick : undefined}
            disabled={activeLoading || props.disabled}
            {...props}
        >
            {activeLoading && <Loader2 className="animate-spin w-4 h-4" />}
            {!activeLoading && Icon && <Icon className="w-4 h-4" />}
            {children}
        </motion.button>
    );
};

export default Button;
