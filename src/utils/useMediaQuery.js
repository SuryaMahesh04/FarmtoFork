import { useState, useEffect } from 'react';

/**
 * Custom hook to detect screen size and return boolean for mobile/desktop
 * @param {string} query - Media query string (default: '(max-width: 768px)')
 * @returns {boolean} - True if media query matches
 */
const useMediaQuery = (query = '(max-width: 768px)') => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Check if window is defined (for SSR compatibility)
        if (typeof window === 'undefined') return;

        const media = window.matchMedia(query);

        // Set initial value
        setMatches(media.matches);

        // Create event listener
        const listener = (e) => setMatches(e.matches);

        // Add listener (use newer API if available, fallback to deprecated one)
        if (media.addEventListener) {
            media.addEventListener('change', listener);
        } else {
            media.addListener(listener);
        }

        // Cleanup
        return () => {
            if (media.removeEventListener) {
                media.removeEventListener('change', listener);
            } else {
                media.removeListener(listener);
            }
        };
    }, [query]);

    return matches;
};

export default useMediaQuery;
