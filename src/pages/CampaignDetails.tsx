import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Edit,
  Pause,
  Upload,
  Users,
  Clock,
  Send,
  Eye as EyeIcon,
  MessageCircle,
  MousePointerClick,
  AlertTriangle,
  UserX,
  ChevronDown,
  Download,
  Mail,
  Play,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  List,
  Play as PlayIcon,
  CheckSquare,
  Zap,
} from "lucide-react";

import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useParams } from "react-router-dom";

// Register Chart.js components

ChartJS.register(
  CategoryScale,

  LinearScale,

  PointElement,

  LineElement,

  Title,

  Tooltip,

  Legend
);

// --- UTILITY COMPONENTS ---

const StatusBadge = ({ type, children }) => {
  let bgColor = "bg-gray-100 text-gray-700";

  if (type === "active") bgColor = "bg-green-100 text-green-700 font-semibold";

  if (type === "open") bgColor = "bg-blue-100 text-blue-700";

  if (type === "sent") bgColor = "bg-red-100 text-red-700";

  if (type === "replied") bgColor = "bg-green-100 text-green-700";

  if (type === "bounced") bgColor = "bg-red-100 text-red-700";

  if (type === "unsubscribed") bgColor = "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-1 text-xs ${bgColor}`}
    >
      {children}
    </span>
  );
};

const MetricCard = ({
  title,

  value,

  percentage,

  isPositive,

  icon: Icon,

  iconBgColor,

  iconTextColor,
}) => {
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const trendColorClass = isPositive ? "text-green-600" : "text-red-600";

  // const percentageColorClass = isPositive ? "text-green-600" : "text-red-600"; // not used, keeping trendColorClass

  return (
    <Card className="shadow-sm  hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center justify-between">
        {/* Left Side: Value and Trend */}

        <div className="flex flex-col space-y-1">
          <CardTitle className="text-sm font-normal text-gray-600 mb-2">
            {title}
          </CardTitle>

          <div className="text-2xl font-bold mt-1 text-gray-900">{value}</div>

          {percentage !== null && (
            <div
              className={`flex items-center text-sm mt-1 ${trendColorClass}`}
            >
              {TrendIcon && <TrendIcon className="w-4 h-4 mr-1" />}
              {percentage}% vs last month
            </div>
          )}
        </div>

        {/* Right Side: Large Icon */}

        <div className={`p-3 rounded-xl ${iconBgColor} ${iconTextColor}`}>
          <Icon className="h-7 w-7" />
        </div>
      </CardContent>
    </Card>
  );
};

// --- MAIN COMPONENT ---

export default function CampaignDetails() {
  const { id } = useParams();

  // --- HARDCODED DATA ---

  const campaignDetailsData = {
    id: id,

    name: "Lead Generation Campaign",

    status: "Active",

    contacts: 1247,

    created: "Nov 1, 2024",

    lastUpdated: "2 hours ago",

    metrics: {
      totalSent: 2847,

      openRate: { value: 34.2, change: 2.3, isPositive: true },

      replyRate: { value: 8.7, change: 0.8, isPositive: false },

      clickRate: { value: 12.4, change: 1.5, isPositive: true },

      bounceRate: { value: 2.1, change: null, isPositive: false },

      unsubscribes: { value: 15, change: null, isPositive: false },
    },

    overview: {
      campaignType: "Lead Generation",

      sequenceSteps: "5 steps",

      targetAudience: "Enterprise Sales Leaders",

      sendSchedule: "Mon-Fri, 9 AM - 5 PM",

      timeZone: "EST (UTC-5)",
    },
  };

  const contactsProgressData = [
    {
      id: 1,

      name: "Sarah Johnson",

      email: "sarah.johnson@techcorp.com",

      company: "TechCorp Solutions",

      role: "VP of Sales",

      currentStep: "Step 2",

      stepName: "Follow-up Email",

      status: "Opened",

      statusType: "open",

      lastActivity: "Email Opened",

      timeAgo: "2 hours ago",
    },

    {
      id: 2,

      name: "Michael Chen",

      email: "m.chen@innovatetech.com",

      company: "InnovateTech",

      role: "Sales Director",

      currentStep: "Step 1",

      stepName: "Initial Outreach",

      status: "Sent",

      statusType: "sent",

      lastActivity: "Email Sent",

      timeAgo: "4 hours ago",
    },

    {
      id: 3,

      name: "Emily Rodriguez",

      email: "emily.rodriguez@globalventures.com",

      company: "Global Ventures",

      role: "Business Development Manager",

      currentStep: "Step 3",

      stepName: "Value Proposition",

      status: "Replied",

      statusType: "replied",

      lastActivity: "Email Reply",

      timeAgo: "1 day ago",
    },

    {
      id: 4,

      name: "David Thompson",

      email: "d.thompson@startupinc.com",

      company: "StartupInc",

      role: "CEO",

      currentStep: "Step 1",

      stepName: "Initial Outreach",

      status: "Bounced",

      statusType: "bounced",

      lastActivity: "Email Bounced",

      timeAgo: "3 days ago",
    },

    {
      id: 5,

      name: "Lisa Wang",

      email: "lisa.wang@enterprisesolutions.com",

      company: "Enterprise Solutions",

      role: "Head of Operations",

      currentStep: "Step 4",

      stepName: "Final Follow-up",

      status: "Unsubscribed",

      statusType: "unsubscribed",

      lastActivity: "Unsubscribed",

      timeAgo: "5 days ago",
    },

    // Added more contacts to justify pagination

    {
      id: 6,

      name: "John Doe",

      email: "john.doe@company.com",

      company: "Acme Corp",

      role: "Manager",

      currentStep: "Step 1",

      stepName: "Initial Outreach",

      status: "Opened",

      statusType: "open",

      lastActivity: "Email Opened",

      timeAgo: "1 hour ago",
    },

    {
      id: 7,

      name: "Jane Smith",

      email: "jane.smith@otherco.com",

      company: "Beta Solutions",

      role: "Analyst",

      currentStep: "Step 2",

      stepName: "Follow-up Email",

      status: "Sent",

      statusType: "sent",

      lastActivity: "Email Sent",

      timeAgo: "3 hours ago",
    },
  ];

  // Added more activity logs to justify scrollbar on the right

  const activityLogData = [
    {
      id: 1,

      activity: "Email Sent",

      contact: "Sarah Johnson",

      contactEmail: "sarah.johnson@techcorp.com",

      subject: "Quick question about your sales process",

      timestamp: "Nov 18, 2024 10:30 AM",

      details: "Initial outreach email sent successfully",
    },

    {
      id: 2,

      activity: "Email Opened",

      contact: "Sarah Johnson",

      contactEmail: "sarah.johnson@techcorp.com",

      subject: "Quick question about your sales process",

      timestamp: "Nov 18, 2024 10:32 AM",

      details: "Contact opened the email",
    },

    {
      id: 3,

      activity: "Reply Received",

      contact: "Emily Rodriguez",

      contactEmail: "emily.rodriguez@globalventures.com",

      subject: "Re: Following up on our recent chat",

      timestamp: "Nov 17, 2024 09:15 AM",

      details: "Contact replied to the email",
    },

    {
      id: 4,

      activity: "Email Sent",

      contact: "John Doe",

      contactEmail: "john.doe@company.com",

      subject: "Introductory Email",

      timestamp: "Nov 18, 2024 11:00 AM",

      details: "Initial outreach sent",
    },

    {
      id: 5,

      activity: "Email Bounced",

      contact: "David Thompson",

      contactEmail: "d.thompson@startupinc.com",

      subject: "Initial Outreach",

      timestamp: "Nov 16, 2024 09:00 AM",

      details: "Hard bounce error",
    },

    {
      id: 6,

      activity: "Email Sent",

      contact: "Jane Smith",

      contactEmail: "jane.smith@otherco.com",

      subject: "Follow-up",

      timestamp: "Nov 18, 2024 11:30 AM",

      details: "Follow-up email sent successfully",
    },

    {
      id: 7,

      activity: "Email Opened",

      contact: "John Doe",

      contactEmail: "john.doe@company.com",

      subject: "Introductory Email",

      timestamp: "Nov 18, 2024 12:00 PM",

      details: "Contact opened the email",
    },

    {
      id: 8,

      activity: "Unsubscribed",

      contact: "Lisa Wang",

      contactEmail: "lisa.wang@enterprisesolutions.com",

      subject: "Final Follow-up",

      timestamp: "Nov 13, 2024 02:00 PM",

      details: "Contact opted out",
    },
  ];

  // Hardcoded data matching the image's example cards for a clean demo:

  const imageMetricData = [
    {
      title: "Total Campaigns",

      value: "24",

      percentage: 12.5,

      isPositive: false,

      icon: List,

      iconBgColor: "bg-blue-500/10",

      iconTextColor: "text-blue-500",
    },

    {
      title: "Active Campaigns",

      value: "8",

      percentage: 25.0,

      isPositive: true,

      icon: PlayIcon,

      iconBgColor: "bg-green-500/10",

      iconTextColor: "text-green-500",
    },

    {
      title: "Total Contacts",

      value: "15,420",

      percentage: 8.5,

      isPositive: false,

      icon: CheckSquare,

      iconBgColor: "bg-purple-500/10",

      iconTextColor: "text-purple-500",
    },

    {
      title: "Avg. Open Rate",

      value: "36.0%",

      percentage: 4.2,

      isPositive: false,

      icon: Mail,

      iconBgColor: "bg-orange-500/10",

      iconTextColor: "text-orange-500",
    },
  ];

  const chartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Campaign Performance Over Time" },
    },

    scales: {
      x: { grid: { display: false } },

      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } },
    },
  };

  const chartDataFinal = {
    labels: [
      "Nov 12",

      "Nov 13",

      "Nov 14",

      "Nov 15",

      "Nov 16",

      "Nov 17",

      "Nov 18",
    ],

    datasets: [
      {
        label: "Open Rate (%)",

        data: [40, 42, 38, 50, 45, 55, 42],

        borderColor: "rgb(255, 99, 132)",

        tension: 0.3,

        pointRadius: 4,

        pointBackgroundColor: "white",
      },

      {
        label: "Reply Rate (%)",

        data: [20, 22, 15, 28, 20, 18, 12],

        borderColor: "rgb(53, 162, 235)",

        tension: 0.3,

        pointRadius: 4,

        pointBackgroundColor: "white",
      },

      {
        label: "Click Rate (%)",

        data: [30, 32, 28, 40, 35, 30, 25],

        borderColor: "rgb(75, 192, 192)",

        tension: 0.3,

        pointRadius: 4,

        pointBackgroundColor: "white",
      },

      {
        label: "Bounce Rate (%)",

        data: [10, 8, 12, 5, 10, 15, 8],

        borderColor: "rgb(255, 159, 64)",

        tension: 0.3,

        pointRadius: 4,

        pointBackgroundColor: "white",
      },
    ],
  };

  // --- COMPONENT RENDER ---

  return (
    <div className="p-6 space-y-6">
      {/* Top Header Section */}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            {campaignDetailsData.name}
            <StatusBadge type="active" className="ml-4">
              <Play className="h-3 w-3 mr-1" /> Active
            </StatusBadge>
          </h1>

          <div className="flex items-center text-gray-500 text-sm mt-2 space-x-6">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" /> {campaignDetailsData.contacts}
              contacts
            </span>

            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Created
              {campaignDetailsData.created}
            </span>

            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Last updated
              {campaignDetailsData.lastUpdated}
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="text-gray-700 hover:bg-gray-50 border-gray-300"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Sequence
          </Button>

          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Pause className="mr-2 h-4 w-4" /> Pause Campaign
          </Button>

          <Button
            variant="outline"
            className="text-gray-700 hover:bg-gray-50 border-gray-300"
          >
            <Upload className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {imageMetricData.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            percentage={metric.percentage}
            isPositive={metric.isPositive}
            icon={metric.icon}
            iconBgColor={metric.iconBgColor}
            iconTextColor={metric.iconTextColor}
          />
        ))}
      </div>

      {/* Performance Chart Card (Full Width) */}

      {/* <Card className="shadow-sm">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Performance Trend
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 h-96">
          <Line data={chartDataFinal} options={chartOptions} />
        </CardContent>
      </Card> */}

      {/* ⭐ START: NEW TWO-COLUMN LAYOUT SECTION ⭐ */}

      <div className="grid grid-cols-3 gap-6">
        {/* 1. Contact Sequence Progress Table (Larger, Col-span-2) */}

        <div className="col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Contact Sequence Progress
              </CardTitle>

              <div className="flex items-center space-x-3">
                <input
                  type="search"
                  placeholder="Search contacts..."
                  className="p-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                />

                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 hover:bg-gray-100"
                >
                  All Statuses <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        CONTACT
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        COMPANY
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        CURRENT STEP
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        STATUS
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        LAST ACTIVITY
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-100">
                    {contactsProgressData.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold text-sm mr-3 flex-shrink-0">
                              {contact.name

                                .split(" ")

                                .map((n) => n[0])

                                .join("")}
                            </div>

                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {contact.name}
                              </div>

                              <div className="text-xs text-gray-500">
                                {contact.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.company}
                          </div>

                          <div className="text-xs text-gray-500">
                            {contact.role}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.currentStep}
                          </div>

                          <div className="text-xs text-gray-500">
                            {contact.stepName}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge type={contact.statusType}>
                            {contact.status}
                          </StatusBadge>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.lastActivity}
                          </div>

                          <div className="text-xs text-gray-500">
                            {contact.timeAgo}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                          >
                            View <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}

              <div className="p-4 flex justify-between items-center border-t">
                <div className="text-sm text-gray-500">
                  Showing {contactsProgressData.length} of 45 contacts
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-gray-500"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-gray-500"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white font-semibold">
                    1
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-gray-500"
                  >
                    2
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-gray-500"
                  >
                    3
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-gray-500"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-gray-500"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Campaign Activity Log (Smaller, Col-span-1, Internal Scroll) */}

        <div className="col-span-1 h-screen]">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Activity Log
              </CardTitle>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-red-600"
              >
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>


            <CardContent className="p-0 h-[600px] overflow-y-auto custom-scrollbar-red">
              <div className="divide-y divide-gray-100">
                {activityLogData.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-2 mb-1">
                      <Zap className="h-4 w-4 text-red-600 flex-shrink-0" />

                      <span className="text-sm font-semibold text-gray-900">
                        {log.activity}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 truncate">
                      Contact:{" "}
                      <span className="font-medium">{log.contact}</span>
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {log.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ⭐ END: NEW TWO-COLUMN LAYOUT SECTION ⭐ */}
    </div>
  );
}
