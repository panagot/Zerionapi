import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

export const chartColors = {
  primary: 'rgb(99, 102, 241)',
  secondary: 'rgb(139, 92, 246)',
  success: 'rgb(16, 185, 129)',
  warning: 'rgb(245, 158, 11)',
  danger: 'rgb(239, 68, 68)',
  info: 'rgb(59, 130, 246)',
  light: 'rgb(148, 163, 184)',
  dark: 'rgb(15, 23, 42)'
};

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#ffffff',
        font: {
          size: 12
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#ffffff'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    y: {
      ticks: {
        color: '#ffffff'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
};

export const createLineChart = (ctx: CanvasRenderingContext2D, data: number[], labels: string[], label: string, color: string = chartColors.primary) => {
  try {
    console.log('Creating line chart:', { data, labels, label, color });
    // Destroy any existing chart bound to this canvas to avoid "Canvas is already in use"
    // @ts-ignore Chart.getChart exists in v4
    const existing = (Chart as any).getChart?.(ctx.canvas);
    if (existing) existing.destroy();
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data,
          borderColor: color,
          backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: chartOptions
    });
  } catch (error) {
    console.error('Error creating line chart:', error);
    throw error;
  }
};

export const createDoughnutChart = (ctx: CanvasRenderingContext2D, data: number[], labels: string[], label: string) => {
  try {
    console.log('Creating doughnut chart:', { data, labels, label });
    // @ts-ignore
    const existing = (Chart as any).getChart?.(ctx.canvas);
    if (existing) existing.destroy();
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label,
          data,
          backgroundColor: [
            chartColors.primary,
            chartColors.warning,
            chartColors.success,
            chartColors.secondary,
            chartColors.info,
            chartColors.danger
          ],
          borderWidth: 0
        }]
      },
      options: {
        ...chartOptions,
        plugins: {
          ...chartOptions.plugins,
          legend: {
            position: 'bottom',
            labels: {
              color: '#ffffff',
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating doughnut chart:', error);
    throw error;
  }
};

export const createScatterChart = (ctx: CanvasRenderingContext2D, data: {x: number, y: number, v: number}[], label: string) => {
  try {
    console.log('Creating scatter chart:', { data, label });
    // @ts-ignore
    const existing = (Chart as any).getChart?.(ctx.canvas);
    if (existing) existing.destroy();
    return new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label,
          data,
          backgroundColor: data.map(d => {
            const intensity = d.v / 100;
            return `rgba(16, 185, 129, ${intensity})`;
          }),
          borderColor: 'rgba(16, 185, 129, 0.8)',
          borderWidth: 1
        }]
      },
      options: {
        ...chartOptions,
        plugins: {
          ...chartOptions.plugins,
          legend: {
            display: false
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating scatter chart:', error);
    throw error;
  }
};

export const createBarChart = (ctx: CanvasRenderingContext2D, data: number[], labels: string[], label: string, color: string = chartColors.primary) => {
  try {
    // @ts-ignore
    const existing = (Chart as any).getChart?.(ctx.canvas);
    if (existing) existing.destroy();
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label,
          data,
          backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.8)'),
          borderColor: color,
          borderWidth: 1
        }]
      },
      options: chartOptions
    });
  } catch (error) {
    console.error('Error creating bar chart:', error);
    throw error;
  }
};
