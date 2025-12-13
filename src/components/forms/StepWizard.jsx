import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const StepWizard = ({ steps, currentStep, onStepClick }) => {
    return (
        <div className="w-full mb-8">
            <div className="flex justify-between relative px-4">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-sage-100 -translate-y-1/2 -z-10 rounded-full mx-4"></div>

                {/* Active Progress Bar */}
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-sage-400 -translate-y-1/2 -z-10 rounded-full mx-4 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
                ></motion.div>

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center gap-2 relative group cursor-pointer" onClick={() => onStepClick && isCompleted ? onStepClick(index) : null}>
                            <motion.div
                                initial={false}
                                animate={{
                                    backgroundColor: isCompleted || isActive ? '#9dc88d' : '#f4f9f2',
                                    borderColor: isCompleted || isActive ? '#9dc88d' : '#c8e0bf',
                                    scale: isActive ? 1.1 : 1,
                                }}
                                className={`
                  w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-300
                  ${isCompleted || isActive ? 'text-white shadow-md' : 'text-sage-300'}
                `}
                            >
                                {isCompleted ? <Check size={20} /> : <span>{index + 1}</span>}
                            </motion.div>

                            <span className={`
                absolute top-12 text-xs font-semibold whitespace-nowrap transition-colors duration-300
                ${isActive ? 'text-sage-700' : 'text-slate-400'}
              `}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepWizard;
