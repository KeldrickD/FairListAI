import { useState } from 'react'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import Layout from '@/components/Layout'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface MetricCard {
  title: string
  value: string
  change: string
  iconName: string
  color: string
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d')
  
  const metrics: MetricCard[] = [
    {
      title: 'Total Views',
      value: '2,543',
      change: '+12.5%',
      iconName: 'eye',
      color: 'text-blue-500'
    },
    {
      title: 'Active Listings',
      value: '8',
      change: '+2',
      iconName: 'chart',
      color: 'text-green-500'
    },
    {
      title: 'Lead Contacts',
      value: '45',
      change: '+8.2%',
      iconName: 'users',
      color: 'text-purple-500'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8%',
      iconName: 'trending-up',
      color: 'text-orange-500'
    }
  ]

  // Views over time chart data
  const viewsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Views',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: '#2F5DE3',
        tension: 0.4,
      },
    ],
  }

  const viewsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  // Lead sources chart data
  const leadSourcesData = {
    labels: ['Direct', 'Referral', 'Social', 'Email'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          '#2F5DE3',
          '#C7BAF5',
          '#4CAF50',
          '#FF9800',
        ],
        borderWidth: 0,
      },
    ],
  }

  const leadSourcesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <div className="flex items-center space-x-2">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-[#2F5DE3] focus:ring-[#2F5DE3]"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-opacity-10 ${metric.color.replace('text-', 'bg-')}`}>
                  <div className={`h-6 w-6 ${metric.color}`}>{metric.iconName}</div>
                </div>
                <span className="text-sm text-green-500">{metric.change}</span>
              </div>
              <h3 className="text-sm text-gray-500 mb-1">{metric.title}</h3>
              <p className="text-2xl font-semibold">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views Over Time */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
            <div className="h-64">
              <Line options={viewsOptions} data={viewsData} />
            </div>
          </div>

          {/* Top Performing Listings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Listings</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">123 Main Street</h4>
                    <p className="text-sm text-gray-500">1,234 views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">45 leads</p>
                    <p className="text-sm text-green-500">+12%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Lead Sources</h3>
            <div className="h-64">
              <Doughnut options={leadSourcesOptions} data={leadSourcesData} />
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
            <div className="space-y-4">
              {[
                { label: 'Views', value: '2,543', percentage: '100%' },
                { label: 'Contact Form Views', value: '1,234', percentage: '48.5%' },
                { label: 'Form Submissions', value: '45', percentage: '1.8%' },
                { label: 'Scheduled Showings', value: '12', percentage: '0.5%' }
              ].map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-24 text-sm text-gray-500">{step.label}</div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full mx-4">
                    <div 
                      className="h-full bg-[#2F5DE3] rounded-full"
                      style={{ width: step.percentage }}
                    ></div>
                  </div>
                  <div className="w-16 text-right">
                    <div className="text-sm font-medium">{step.value}</div>
                    <div className="text-xs text-gray-500">{step.percentage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 