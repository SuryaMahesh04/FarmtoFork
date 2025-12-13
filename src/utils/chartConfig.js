export const chartTheme = {
    colors: {
        sage: ['#9dc88d', '#7bb068', '#5c9449', '#487638'],
        wheat: ['#f5deb3', '#ecbd70', '#e5a545', '#d48806'],
        sky: ['#b4d7e8', '#90c2db', '#6faecd', '#5199bf'],
        terra: ['#e07a5f', '#d06346', '#c04c30', '#b0351a'],
        mixed: ['#9dc88d', '#f5deb3', '#b4d7e8', '#e07a5f'],
    },
    axis: {
        stroke: '#cbd5e1', // slate-300
        fontSize: 12,
        tickLine: false,
        axisLine: false,
    },
    grid: {
        strokeDasharray: '3 3',
        vertical: false,
        stroke: '#e2e8f0', // slate-200
    },
    tooltip: {
        contentStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '8px 12px',
        },
        itemStyle: {
            color: '#475569', // slate-600
            fontSize: '12px',
            fontWeight: 500,
        },
        labelStyle: {
            color: '#64748b', // slate-500
            fontSize: '10px',
            marginBottom: '4px',
        }
    }
};
