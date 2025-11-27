let dailyMAChart = null;
let weeklyMAChart = null;

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
    // SVG arc: M 20 100 A 80 80 0 0 1 180 100
    // Upward semicircle with center at (100, 100) and radius 80
    // Value 0 (fear) = 180 degrees (left), Value 100 (greed) = 0 degrees (right)
    
    const cx = 100;  // center x
    const cy = 100;  // center y
    const radius = 80;  // arc radius
    
    // Map value 0-100 to angle 180-0 degrees
    const angleDegrees = 180 - (value / 100) * 180;
    const angleRadians = (angleDegrees * Math.PI / 180);
    
    // Calculate point on the arc (upward semicircle, so subtract sine)
    const x2 = cx + radius * Math.cos(angleRadians);
    const y2 = cy - radius * Math.sin(angleRadians);
    
    const needleLine = document.getElementById('gauge-needle-line');
    needleLine.setAttribute('x2', x2);
    needleLine.setAttribute('y2', y2);
}

// Calculate moving average
// If we don't have enough data for the full period, use all available data
function calculateMA(prices, period) {
    if (prices.length === 0) return null;
    const dataToUse = Math.min(prices.length, period);
    const sum = prices.slice(-dataToUse).reduce((a, b) => a + b, 0);
    return sum / dataToUse;
}

// Find crossover dates
function findCrossovers(historicalData) {
    if (!historicalData || historicalData.length < 200) {
        return {
            daily: 'Insufficient data',
            weekly50: 'Insufficient data',
            weekly200: 'Insufficient data'
        };
    }

    const prices = historicalData.map(d => d.price);
    const dates = historicalData.map(d => d.date);
    
    let dailyCrossover = 'No crossover detected';
    let weekly50Crossover = 'No crossover detected';
    let weekly200Crossover = 'No crossover detected';

    // Find last 50/200 day MA crossover
    for (let i = prices.length - 1; i > 200; i--) {
        const ma50_prev = calculateMA(prices.slice(0, i - 1), 50);
        const ma200_prev = calculateMA(prices.slice(0, i - 1), 200);
        const ma50_curr = calculateMA(prices.slice(0, i), 50);
        const ma200_curr = calculateMA(prices.slice(0, i), 200);

        if (ma50_prev && ma200_prev && ma50_curr && ma200_curr) {
            const crossedAbove = ma50_prev < ma200_prev && ma50_curr > ma200_curr;
            const crossedBelow = ma50_prev > ma200_prev && ma50_curr < ma200_curr;
            
            if (crossedAbove || crossedBelow) {
                const direction = crossedAbove ? 'above' : 'below';
                dailyCrossover = `${direction.charAt(0).toUpperCase() + direction.slice(1)} on ${dates[i]}`;
                break;
            }
        }
    }

    // Convert daily data to weekly data for weekly crossover detection
    const weeklyData = [];
    let currentWeek = [];
    let currentDate = null;

    for (let i = 0; i < historicalData.length; i++) {
        const date = new Date(historicalData[i].date);
        const dayOfWeek = date.getDay();

        if (dayOfWeek === 5 || i === historicalData.length - 1) {
            currentWeek.push(historicalData[i].price);
            const avgPrice = currentWeek.reduce((a, b) => a + b, 0) / currentWeek.length;
            weeklyData.push({
                date: historicalData[i].date,
                price: avgPrice
            });
            currentWeek = [];
        } else if (dayOfWeek === 0 && i > 0) {
            if (currentWeek.length > 0) {
                const avgPrice = currentWeek.reduce((a, b) => a + b, 0) / currentWeek.length;
                weeklyData.push({
                    date: currentDate,
                    price: avgPrice
                });
            }
            currentWeek = [historicalData[i].price];
            currentDate = historicalData[i].date;
        } else {
            currentWeek.push(historicalData[i].price);
        }
    }

    // Find last price/50-week MA crossover
    if (weeklyData.length > 50) {
        for (let i = weeklyData.length - 1; i > 50; i--) {
            const price_prev = weeklyData[i - 1].price;
            const price_curr = weeklyData[i].price;
            const ma50w_prev = calculateMA(weeklyData.slice(0, i - 1).map(d => d.price), 50);
            const ma50w_curr = calculateMA(weeklyData.slice(0, i).map(d => d.price), 50);

            if (ma50w_prev && ma50w_curr) {
                const crossedAbove = price_prev < ma50w_prev && price_curr > ma50w_curr;
                const crossedBelow = price_prev > ma50w_prev && price_curr < ma50w_curr;
                
                if (crossedAbove || crossedBelow) {
                    const direction = crossedAbove ? 'above' : 'below';
                    weekly50Crossover = `${direction.charAt(0).toUpperCase() + direction.slice(1)} on ${weeklyData[i].date}`;
                    break;
                }
            }
        }
    }

    // Find last price/200-week MA crossover
    if (weeklyData.length > 200) {
        for (let i = weeklyData.length - 1; i > 200; i--) {
            const price_prev = weeklyData[i - 1].price;
            const price_curr = weeklyData[i].price;
            const ma200w_prev = calculateMA(weeklyData.slice(0, i - 1).map(d => d.price), 200);
            const ma200w_curr = calculateMA(weeklyData.slice(0, i).map(d => d.price), 200);

            if (ma200w_prev && ma200w_curr) {
                const crossedAbove = price_prev < ma200w_prev && price_curr > ma200w_curr;
                const crossedBelow = price_prev > ma200w_prev && price_curr < ma200w_curr;
                
                if (crossedAbove || crossedBelow) {
                    const direction = crossedAbove ? 'above' : 'below';
                    weekly200Crossover = `${direction.charAt(0).toUpperCase() + direction.slice(1)} on ${weeklyData[i].date}`;
                    break;
                }
            }
        }
    }

    return {
        daily: dailyCrossover,
        weekly50: weekly50Crossover,
        weekly200: weekly200Crossover
    };
}

// Generate signal explanation
function generateSignalExplanation(data) {
    const fgValue = data.fearGreedIndex.value;
    const rsiValue = parseFloat(data.rsi);
    
    let explanation = '';
    
    if (fgValue < 20 && rsiValue < 30) {
        explanation = '🟢 BUY conditions met: Fear & Greed < 20 AND RSI < 30';
    } else if (fgValue > 80 && rsiValue > 70) {
        explanation = '🔴 SELL conditions met: Fear & Greed > 80 AND RSI > 70';
    } else {
        explanation = `Waiting for trading signals:\n`;
        explanation += `• BUY: Fear & Greed < 20 (currently ${fgValue}) AND RSI < 30 (currently ${rsiValue.toFixed(2)})\n`;
        explanation += `• SELL: Fear & Greed > 80 (currently ${fgValue}) AND RSI > 70 (currently ${rsiValue.toFixed(2)})`;
    }
    
    return explanation;
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
        document.getElementById('no-signal-explanation').textContent = generateSignalExplanation(data);
    }

    // Update crossover tracking
    const crossovers = findCrossovers(data.historicalData);
    document.getElementById('crossover-daily-text').textContent = crossovers.daily;
    document.getElementById('crossover-weekly-50-text').textContent = crossovers.weekly50;
    document.getElementById('crossover-weekly-200-text').textContent = crossovers.weekly200;

    // Update charts
    updateDailyMAChart(data.historicalData);
    updateWeeklyMAChart(data.historicalData);

    // Show content
    content.style.display = 'block';
}

// Update the daily MA chart
function updateDailyMAChart(historicalData) {
    const ctx = document.getElementById('dailyMAChart');
    if (!ctx) return;

    const prices = historicalData.map(d => d.price);
    const dates = historicalData.map(d => d.date);
    
    const ma50 = [];
    const ma200 = [];
    
    for (let i = 0; i < prices.length; i++) {
        ma50.push(calculateMA(prices.slice(0, i + 1), 50));
        ma200.push(calculateMA(prices.slice(0, i + 1), 200));
    }

    if (dailyMAChart) {
        dailyMAChart.destroy();
    }

    dailyMAChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Bitcoin Price (USD)',
                    data: prices,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    yAxisID: 'y'
                },
                {
                    label: '50-Day MA',
                    data: ma50,
                    borderColor: '#ff9800',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    yAxisID: 'y'
                },
                {
                    label: '200-Day MA',
                    data: ma200,
                    borderColor: '#f44336',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
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

// Update the weekly MA chart
function updateWeeklyMAChart(historicalData) {
    const ctx = document.getElementById('weeklyMAChart');
    if (!ctx) return;

    // Convert daily data to weekly data
    // Group prices by calendar week (Monday to Sunday)
    const weeklyData = [];
    let weekPrices = [];
    let weekStartDate = null;
    let lastWeekStart = null;

    for (let i = 0; i < historicalData.length; i++) {
        const date = new Date(historicalData[i].date);
        const dayOfWeek = date.getDay();
        
        // Calculate the start of the current week (Monday = 1)
        const currentDate = new Date(date);
        const daysToMonday = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - daysToMonday);
        const weekStartStr = weekStart.toISOString().split('T')[0];
        
        // If we've moved to a new week, save the previous week's data
        if (lastWeekStart !== null && weekStartStr !== lastWeekStart) {
            if (weekPrices.length > 0) {
                const avgPrice = weekPrices.reduce((a, b) => a + b, 0) / weekPrices.length;
                weeklyData.push({
                    date: weekStartDate,
                    price: avgPrice
                });
            }
            weekPrices = [];
        }
        
        // Add current price to week
        if (weekPrices.length === 0) {
            weekStartDate = historicalData[i].date;
        }
        weekPrices.push(historicalData[i].price);
        lastWeekStart = weekStartStr;
    }
    
    // Don't forget the last week
    if (weekPrices.length > 0) {
        const avgPrice = weekPrices.reduce((a, b) => a + b, 0) / weekPrices.length;
        weeklyData.push({
            date: weekStartDate,
            price: avgPrice
        });
    }

    const prices = weeklyData.map(d => d.price);
    const dates = weeklyData.map(d => d.date);
    
    const ma50w = [];
    const ma200w = [];
    
    // Calculate MAs for all weeks, starting from the beginning
    for (let i = 0; i < prices.length; i++) {
        const ma50 = calculateMA(prices.slice(0, i + 1), 50);
        const ma200 = calculateMA(prices.slice(0, i + 1), 200);
        ma50w.push(ma50);
        ma200w.push(ma200);
    }

    if (weeklyMAChart) {
        weeklyMAChart.destroy();
    }

    weeklyMAChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Bitcoin Price (USD)',
                    data: prices,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    yAxisID: 'y'
                },
                {
                    label: '50-Week MA',
                    data: ma50w,
                    borderColor: '#4caf50',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    yAxisID: 'y'
                },
                {
                    label: '200-Week MA',
                    data: ma200w,
                    borderColor: '#2196f3',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
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
