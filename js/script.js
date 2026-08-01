// js/script.js

const colors = {
    green: '#65A30D',
    red: '#DC2626',
    blue: '#2563EB',
    yellow: '#EAB308',
    gray: '#E2E8F0',
    textDark: '#334155',
    orange: '#EA580C',  
    purple: '#9333EA',  
    violet: '#7C3AED',  
    brown: '#92400E', 
    teal: '#0D9488', 
    pink: '#DB2777'
};

const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: function(chart) {
        let width = chart.width,
            height = chart.height,
            ctx = chart.ctx;

        ctx.restore();
        let fontSize = (height / 110).toFixed(2);
        ctx.font = "bold " + fontSize + "em 'Inter', sans-serif";
        ctx.textBaseline = "middle";

        let percent = chart.config.data.datasets[0].data[0];
        let mainColor = chart.config.data.datasets[0].backgroundColor[0];
        
        let text = percent + "%",
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

        ctx.fillStyle = mainColor === colors.gray ? colors.textDark : mainColor;

        ctx.fillText(text, textX, textY);
        ctx.save();
    }
};

// Modificamos la función para que reciba el elemento canvas directamente
function createDonutChart(canvas, percent, color) {
    const ctx = canvas.getContext('2d');
    const activeColor = percent === 0 ? colors.gray : color;
    const remainder = 100 - percent;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [percent, remainder],
                backgroundColor: [activeColor, colors.gray],
                borderWidth: 0,
                hoverOffset: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        },
        plugins: [centerTextPlugin]
    });
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', function() {
    // Busca todos los canvas con la clase 'donut-chart'
    const charts = document.querySelectorAll('.donut-chart');
    
    charts.forEach(canvas => {
        // Lee los atributos data-* del HTML
        const percent = parseInt(canvas.getAttribute('data-percent')) || 0;
        const colorName = canvas.getAttribute('data-color') || 'gray';
        
        // Obtiene el color real del objeto o por defecto usa gris
        const color = colors[colorName] || colors.gray;

        createDonutChart(canvas, percent, color);
    });
});