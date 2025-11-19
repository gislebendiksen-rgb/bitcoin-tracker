let priceChart = null;

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Update gauge needle position based on Fear & Greed value
function updateGaugeNeedle(value) {
    // Value ranges from 0-100, we need to map it to the gauge arc
    // The arc goes from 0 degrees (left) to 180 degrees (right)
    const angle = (value / 100) * 180;
    const radian = (angle - 90) * (Math.PI / 180);
    
    const cx = 100 + 80 * Math.cos(radian);
    const cy = 100 + 80 * Math.sin(radian);
    
    const needle = document.getElementById('gauge-needle');
    needle.setAttribute('cx', cx);
    needle.setAttribute('cy', cy);
}

// Update the UI with Bitcoin data
function updateUI(data) {
    const content = document.getElementById('content');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    // Hide loading state
    loading.style.display = 'none';
    error.style.display = 'none';

    // Update current price
    document.getElementById('current-price').textContent = formatCurrency(data.currentPrice);
    document.getElementById('last-update').textContent = new Date().toLocaleTimeString();

    // Update Fear & Greed Index
    const fgValue = data.fearGreedIndex.value;
    document.getElementById('fear-greed-value').textContent = fgValue;
    document.getElementById('fear-greed-classification').textContent = data.fearGreedIndex.classification;
    updateGaugeNeedle(fgValue);

    // Update technical indicators
    document.getElementById('rsi-value').textContent = data.rsi ? data.rsi : 'N/A';
    document.getElementById('ma50-value').textContent = data.ma50 ? formatCurrency(data.ma50) : 'N/A';
    document.getElementById('ma200-value').textContent = data.ma200 ? formatCurrency(data.ma200) : 'N/A';

    // Update trading signals
    const buySignalCard = document.getElementById('buy-signal-card');
    const sellSignalCard = document.getElementById('sell-signal-card');
    const noSignalCard = document.getElementById('no-signal-card');

    if (data.buySignal) {
        buySignalCard.style.display = 'block';
        sellSignalCard.style.display = 'none';
        noSignalCard.style.display = 'none';
        document.getElementById('buy-signal-time').textContent = new Date().toLocaleTimeString();
    } else if (data.sellSignal) {
        buySignalCard.style.display = 'none';
        sellSignalCard.style.display = 'block';
        noSignalCard.style.display = 'none';
        document.getElementById('sell-signal-time').textContent = new Date().toLocaleTimeString();
    } else {
        buySignalCard.style.display = 'none';
        sellSignalCard.style.display = 'none';
        noSignalCard.style.display = 'block';
    }

    // Update chart
    updateChart(data.historicalData);

    // Show content
    content.style.display = 'block';
}

// Update the price chart
function updateChart(historicalData) {
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;

    const labels = historicalData.map(d => d.date);
    const prices = historicalData.map(d => d.price);

    if (priceChart) {
        priceChart.destroy();
    }

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bitcoin Price (USD)',
                data: prices,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString('en-US', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            });
                        },
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        color: '#666',
                        maxTicksLimit: 10
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Show error message
function showError(message) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const content = document.getElementById('content');

    loading.style.display = 'none';
    content.style.display = 'none';
    error.style.display = 'block';
    document.getElementById('error-message').textContent = message;
}

// Fetch Bitcoin data from the server
async function fetchBitcoinData() {
    try {
        const response = await fetch('/api/bitcoin-data');
        if (!response.ok) {
            throw new Error('Failed to fetch Bitcoin data');
        }
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load Bitcoin data. Please try again later.');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    fetchBitcoinData();

    // Refresh data every 60 seconds
    setInterval(fetchBitcoinData, 60000);
});
