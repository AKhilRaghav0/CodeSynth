import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ContributionGraphProps {
  submissions: {
    date: string;
    count: number;
  }[];
  platform: string;
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({ submissions, platform }) => {
  const platformColor = platform === 'codeforces' 
    ? { primary: 'rgb(255, 99, 132)', secondary: 'rgba(255, 99, 132, 0.5)' }
    : { primary: 'rgb(75, 192, 192)', secondary: 'rgba(75, 192, 192, 0.5)' };

  const data = {
    labels: submissions.map(s => {
      const date = new Date(s.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Submissions',
        data: submissions.map(s => s.count),
        borderColor: platformColor.primary,
        backgroundColor: platformColor.secondary,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Submissions Over Time`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (items: any[]) => {
            const idx = items[0].dataIndex;
            const date = new Date(submissions[idx].date);
            return date.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          },
          label: (item: any) => {
            return `${item.raw} submission${item.raw !== 1 ? 's' : ''}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="w-full h-[400px] bg-base-300 rounded-lg p-6">
      <Line options={options} data={data} />
    </div>
  );
};

export default ContributionGraph; 