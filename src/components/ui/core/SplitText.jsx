import React from 'react';
import { motion } from 'framer-motion';

const SplitText = ({ text, className = "" }) => {
    // Split by words first to prevent awkward word-wrapping mid-animation
    const words = text.split(" ");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
        }),
    };

    const wordVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.02 },
        },
    };

    const letterVariants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", damping: 15, stiffness: 150 },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: { type: "spring", damping: 15, stiffness: 150 },
        },
    };

    return (
        <motion.span
            className={`inline-flex flex-wrap justify-center ${className}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {words.map((word, wordIndex) => (
                <motion.span 
                    key={wordIndex} 
                    variants={wordVariants}
                    className="inline-block whitespace-nowrap mr-[0.2em] last:mr-0"
                >
                    {word.split("").map((letter, letterIndex) => (
                        <motion.span 
                            variants={letterVariants} 
                            key={letterIndex} 
                            className="inline-block"
                        >
                            {letter}
                        </motion.span>
                    ))}
                </motion.span>
            ))}
        </motion.span>
    );
};

export default SplitText;
