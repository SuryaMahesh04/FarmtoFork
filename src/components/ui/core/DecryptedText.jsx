import React, { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

const DecryptedText = ({ text, className = "" }) => {
    const [displayText, setDisplayText] = useState('');
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

    useEffect(() => {
        if (!isInView) return;

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(prev => 
                text.split('')
                    .map((char, index) => {
                        if (index < iteration) return text[index];
                        if (char === ' ') return ' ';
                        return characters[Math.floor(Math.random() * characters.length)];
                    })
                    .join('')
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);

        return () => clearInterval(interval);
    }, [isInView, text]);

    return (
        <span ref={ref} className={className}>
            {displayText || text.split('').map(() => ' ')}
        </span>
    );
};

export default DecryptedText;
