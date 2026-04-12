import React, { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

const RollingNumber = ({ value, duration = 1500, className = "" }) => {
    const [count, setCount] = useState(0);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    
    useEffect(() => {
        if (!isInView) return;

        let startTimestamp = null;
        const target = parseFloat(value.toString().replace(/,/g, ''));
        const isDecimal = value.toString().includes('.');

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const currentCount = progress * target;
            
            if (isDecimal) {
                setCount(currentCount.toFixed(1));
            } else {
                setCount(Math.floor(currentCount));
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(value); // Final value with formatting if any
            }
        };

        window.requestAnimationFrame(step);
    }, [isInView, value, duration]);

    return (
        <span ref={ref} className={className}>
            {count}
        </span>
    );
};

export default RollingNumber;
