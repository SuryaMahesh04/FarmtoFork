/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sage: {
                    50: '#f4f9f2',
                    100: '#e4f0df',
                    200: '#c8e0bf',
                    300: '#9dc88d', // Planned Primary
                    400: '#7bb068',
                    500: '#5c9449',
                    600: '#487638',
                    700: '#3a602c',
                    800: '#2c4a22',
                    900: '#1f3518',
                },
                wheat: {
                    50: '#fdfbf6',
                    100: '#fbf5e6',
                    200: '#f5deb3', // Planned Secondary
                    300: '#ecbd70',
                    400: '#e5a545',
                    500: '#d9932b',
                    600: '#b0731a',
                },
                sky: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#b4d7e8', // Planned Accent
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                },
                mint: {
                    50: '#f0fff4', // Planned background
                },
                terra: {
                    400: '#e07a5f', // Planned Accent
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                }
            }
        },
    },
    plugins: [],
}
