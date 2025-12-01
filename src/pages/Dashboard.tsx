/*
  ============================================================================
  AI SDR OVERVIEW DASHBOARD - ENHANCED LAYOUT
  ============================================================================
  
  KEY CHANGES:
  1. AI Insights now fixed/floating like a chatbot on all pages
  2. Quick Summary moved to top as a prominent banner
  3. Filters restructured into compact card format with icons
  4. Improved responsive design and visual hierarchy
  5. Better spacing and layout optimization
  6. Added metric selection and time filter to Campaign Performance
*/

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  CheckCircle,
  AlertCircle,
  X,
  Play,
  Pause,
  Eye,
  Target,
  Send,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Filter,
  ChevronDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface KPIMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  icon: React.ReactNode;
}

interface SDRActivityMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  icon: React.ReactNode;
  description: string;
}

interface FilterOptions {
  dateRange: "7d" | "14d" | "30d" | "custom";
  sequenceType: "all" | "inbound" | "cold" | "revival";
  channel: "all" | "email" | "linkedin" | "calls" | "other";
  status: "all" | "active" | "paused" | "completed" | "draft";
}

interface ChartDataPoint {
  date: string;
  touches: number;
  replies: number;
  meetings: number;
  pipeline: number;
}

interface ChannelMetric {
  name: string;
  meetings: number;
  pipeline: number;
  percentage: number;
  color: string;
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  improvement: string;
  dismissed: boolean;
}

interface Sequence {
  id: string;
  name: string;
  channels: string[];
  status: "active" | "paused" | "completed" | "draft";
  touches: number;
  pipeline: number;
  meetings: number;
  startDate: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const THEME_COLOR = "#DE3744";
export const THEME_COLOR_LIGHT = "#FDE8EB";
export const THEME_COLOR_LIGHTER = "#F5D5DC";

export const CARD_STYLES = {
  THEME_COLOR: "#DE3744",
  THEME_COLOR_LIGHT: "#FDE8EB",
  THEME_COLOR_LIGHTER: "#F5D5DC",
  CARD_BORDER: "2px solid #F5D5DC",
  CARD_BORDER_HOVER: "2px solid #DE3744",
  CARD_ROUNDED: "rounded-xl",
  CARD_SHADOW: "shadow-md",
  CARD_SHADOW_HOVER: "hover:shadow-lg",
  PADDING_SM: "p-4",
  PADDING_MD: "p-6",
  PADDING_LG: "p-8",
  GRID_GAP_SM: "gap-2",
  GRID_GAP_MD: "gap-4",
  GRID_GAP_LG: "gap-8",
  HEADING_1: "text-4xl font-bold",
  HEADING_2: "text-2xl font-bold",
  HEADING_3: "text-xl font-bold",
  HEADING_4: "text-lg font-bold",
  TEXT_BASE: "text-base",
  TEXT_SM: "text-sm",
  TEXT_XS: "text-xs",
  TEXT_PRIMARY: "text-gray-900",
  TEXT_SECONDARY: "text-gray-600",
  TEXT_LIGHT: "text-gray-500",
  BUTTON_PRIMARY:
    "px-4 py-2 rounded-lg font-bold text-white transition hover:opacity-90",
  BUTTON_SECONDARY:
    "px-4 py-2 rounded-lg font-bold text-gray-900 bg-gray-100 transition hover:bg-gray-200",
};

// ============================================================================
// MOCK DATA
// ============================================================================

const mockPerformanceData7d: ChartDataPoint[] = [
  { date: "Mon", touches: 420, replies: 24, meetings: 8, pipeline: 24000 },
  { date: "Tue", touches: 380, replies: 22, meetings: 7, pipeline: 21000 },
  { date: "Wed", touches: 520, replies: 32, meetings: 11, pipeline: 32000 },
  { date: "Thu", touches: 480, replies: 28, meetings: 9, pipeline: 27000 },
  { date: "Fri", touches: 350, replies: 18, meetings: 6, pipeline: 18000 },
  { date: "Sat", touches: 220, replies: 12, meetings: 4, pipeline: 12000 },
  { date: "Sun", touches: 280, replies: 14, meetings: 5, pipeline: 15000 },
];

const mockPerformanceData14d: ChartDataPoint[] = [
  { date: "Day 1", touches: 420, replies: 24, meetings: 8, pipeline: 24000 },
  { date: "Day 2", touches: 380, replies: 22, meetings: 7, pipeline: 21000 },
  { date: "Day 3", touches: 520, replies: 32, meetings: 11, pipeline: 32000 },
  { date: "Day 4", touches: 480, replies: 28, meetings: 9, pipeline: 27000 },
  { date: "Day 5", touches: 350, replies: 18, meetings: 6, pipeline: 18000 },
  { date: "Day 6", touches: 420, replies: 24, meetings: 8, pipeline: 24000 },
  { date: "Day 7", touches: 450, replies: 26, meetings: 9, pipeline: 27000 },
  { date: "Day 8", touches: 510, replies: 30, meetings: 10, pipeline: 30000 },
  { date: "Day 9", touches: 360, replies: 21, meetings: 7, pipeline: 21000 },
  { date: "Day 10", touches: 490, replies: 29, meetings: 10, pipeline: 29000 },
  { date: "Day 11", touches: 420, replies: 24, meetings: 8, pipeline: 24000 },
  { date: "Day 12", touches: 380, replies: 22, meetings: 7, pipeline: 21000 },
  { date: "Day 13", touches: 540, replies: 32, meetings: 11, pipeline: 33000 },
  { date: "Day 14", touches: 580, replies: 35, meetings: 12, pipeline: 36000 },
];

const mockPerformanceData30d: ChartDataPoint[] = [
  {
    date: "Week 1",
    touches: 2940,
    replies: 172,
    meetings: 57,
    pipeline: 171000,
  },
  {
    date: "Week 2",
    touches: 2800,
    replies: 165,
    meetings: 55,
    pipeline: 165000,
  },
  {
    date: "Week 3",
    touches: 3150,
    replies: 189,
    meetings: 63,
    pipeline: 189000,
  },
  {
    date: "Week 4",
    touches: 3020,
    replies: 178,
    meetings: 59,
    pipeline: 177000,
  },
];

const mockChannelData: ChannelMetric[] = [
  {
    name: "Email",
    meetings: 45,
    pipeline: 180000,
    percentage: 38,
    color: "#1F2937",
  },
  {
    name: "LinkedIn",
    meetings: 28,
    pipeline: 112000,
    percentage: 24,
    color: "#0A66C2",
  },
  {
    name: "Cold Calls",
    meetings: 32,
    pipeline: 128000,
    percentage: 27,
    color: "#DE3744",
  },
  {
    name: "LinkedIn InMail",
    meetings: 12,
    pipeline: 48000,
    percentage: 11,
    color: "#00A4EF",
  },
];

const mockSequences: Sequence[] = [
  {
    id: "1",
    name: "ICP – CTO EMEA",
    channels: ["Email", "LinkedIn"],
    status: "active",
    touches: 2400,
    pipeline: 145000,
    meetings: 18,
    startDate: "2024-11-01",
  },
  {
    id: "2",
    name: "VP Sales – UK Tech",
    channels: ["Email", "Cold Calls"],
    status: "active",
    touches: 1800,
    pipeline: 98000,
    meetings: 12,
    startDate: "2024-10-15",
  },
  {
    id: "3",
    name: "Renewal – At-Risk Accounts",
    channels: ["LinkedIn"],
    status: "paused",
    touches: 680,
    pipeline: 45000,
    meetings: 5,
    startDate: "2024-11-05",
  },
  {
    id: "4",
    name: "Product Launch – Warm Leads",
    channels: ["Email", "LinkedIn InMail"],
    status: "completed",
    touches: 3200,
    pipeline: 215000,
    meetings: 28,
    startDate: "2024-10-01",
  },
];

const mockAIInsights: AIInsight[] = [
  {
    id: "insight-1",
    title: 'Increase touch count in "ICP – CTO EMEA"',
    description:
      "Sequence is underperforming vs team benchmark. Adding one more touchpoint could improve reply rate by 12%.",
    priority: "high",
    improvement: "+18% meetings",
    dismissed: false,
  },
  {
    id: "insight-2",
    title: "Optimize sending window for APAC",
    description:
      "Replies are 28% higher when emails sent at 9am local time. Adjust campaign timing.",
    priority: "medium",
    improvement: "+8% reply rate",
    dismissed: false,
  },
  {
    id: "insight-3",
    title: "Pause low-performing sequence",
    description:
      '"Renewal – At-Risk Accounts" has <1% reply rate. Consider refreshing messaging or targeting.',
    priority: "high",
    improvement: "+$50K pipeline",
    dismissed: false,
  },
  {
    id: "insight-4",
    title: "Prioritize warm inbound leads",
    description:
      "5 accounts showing 3+ buying signals but no meeting booked. High conversion potential.",
    priority: "medium",
    improvement: "+12 meetings",
    dismissed: false,
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

// Enhanced KPI Card with Motion
const KpiCard: React.FC<{ metric: KPIMetric; delay?: number }> = ({
  metric,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getChangeColor = () => {
    if (metric.changeType === "increase") return "text-green-600";
    if (metric.changeType === "decrease") return "text-red-600";
    return "text-gray-600";
  };

  const getChangeIcon = () => {
    if (metric.changeType === "increase") return <TrendingUp size={16} />;
    if (metric.changeType === "decrease") return <TrendingDown size={16} />;
    return null;
  };

  return (
    <div
      className="relative p-6 bg-white border-2 rounded-xl transition-all duration-300 cursor-pointer opacity-0 animate-slideInFromLeft group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Background Glow */}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            style={{
              backgroundColor: isHovered ? THEME_COLOR : THEME_COLOR_LIGHT,
              color: THEME_COLOR,
            }}
            className="p-3 rounded-lg transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-lg"
          >
            {metric.icon}
          </div>
          <div
            className={`flex items-center gap-1 text-sm font-bold transition-all duration-300 ${getChangeColor()} ${
              isHovered ? "translate-x-1" : ""
            }`}
          >
            {getChangeIcon()}
            {metric.change > 0 ? "+" : ""}
            {metric.change}%
          </div>
        </div>

        <p className="text-sm text-gray-600 font-medium mb-2">{metric.title}</p>
        <p className="text-gray-900 text-3xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-red-600 transition-all duration-300">
          {metric.value}
        </p>
      </div>

      {/* Border Animation on Hover */}
    </div>
  );
};

// Enhanced SDR Activity Card with Bounce
const SDRActivityCard: React.FC<{
  metric: SDRActivityMetric;
  delay?: number;
}> = ({ metric, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getChangeColor = () => {
    if (metric.changeType === "increase") return "text-green-600";
    if (metric.changeType === "decrease") return "text-red-600";
    return "text-gray-600";
  };

  const getChangeIcon = () => {
    if (metric.changeType === "increase") return <TrendingUp size={14} />;
    if (metric.changeType === "decrease") return <TrendingDown size={14} />;
    return null;
  };

  return (
    <div
      style={{
        borderColor: isHovered ? THEME_COLOR : THEME_COLOR_LIGHTER,
        animationDelay: `${delay}ms`,
      }}
      className="p-4 bg-white border-2 rounded-xl opacity-0 animate-fadeInUp transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          style={{
            backgroundColor: isHovered ? THEME_COLOR : THEME_COLOR_LIGHT,
            color: THEME_COLOR,
          }}
          className="p-2 rounded-lg transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-6"
        >
          {metric.icon}
        </div>
        <div
          className={`flex items-center gap-0.5 text-xs font-bold ${getChangeColor()}`}
        >
          {getChangeIcon()}
          {metric.change > 0 ? "+" : ""}
          {metric.change}%
        </div>
      </div>

      <p className="text-xs text-gray-600 font-semibold mb-1">{metric.title}</p>
      <p className="text-gray-900 text-2xl font-bold mb-2 group-hover:text-red-600 transition-colors duration-300">
        {metric.value}
      </p>
      <p className="text-xs text-gray-700 line-clamp-2">{metric.description}</p>
    </div>
  );
};

// Enhanced Filter Card with Scale Animation
const FilterCard: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}> = ({ label, icon, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => !isOpen && setIsHovered(false)}
        style={{
          borderColor: isHovered || isOpen ? THEME_COLOR : THEME_COLOR_LIGHTER,
        }}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white border-2 rounded-lg hover:shadow-md transition-all duration-300 text-gray-900 font-semibold group"
      >
        <div className="flex items-center gap-2">
          <div
            style={{ color: THEME_COLOR }}
            className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          >
            {icon}
          </div>
          <span className="text-sm">{label}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-all duration-300 ${
            isOpen ? "rotate-180 scale-110" : ""
          }`}
          style={{ color: THEME_COLOR }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border-2 rounded-lg shadow-2xl z-40 overflow-hidden opacity-0 animate-scaleIn"
          style={{ borderColor: THEME_COLOR_LIGHTER }}
        >
          {options.map((opt, idx) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                animationDelay: `${idx * 30}ms`,
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 opacity-0 animate-slideInDown ${
                value === opt.value
                  ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-bold border-l-4"
                  : "text-gray-900 hover:bg-gray-50 hover:translate-x-1"
              }`}
              style={{
                borderLeftColor:
                  value === opt.value ? THEME_COLOR : "transparent",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Quick Summary Banner
const QuickSummaryBanner: React.FC<{ insightCount: number }> = ({
  insightCount,
}) => {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #B82333 100%)`,
      }}
      className="p-6 rounded-2xl shadow-2xl text-white opacity-0 animate-fadeIn mb-8 overflow-hidden relative group"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4 group/item p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300">
          <TrendingUp
            size={24}
            className="text-green-200 flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform duration-300"
          />
          <div>
            <p className="text-xs text-white text-opacity-90 font-medium">
              Pipeline Growth
            </p>
            <p className="text-2xl font-bold mt-1">+$87K</p>
            <p className="text-xs text-white text-opacity-75 mt-1">
              vs last week
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 group/item p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300">
          <Calendar
            size={24}
            className="text-green-200 flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform duration-300"
          />
          <div>
            <p className="text-xs text-white text-opacity-90 font-medium">
              Meetings Booked
            </p>
            <p className="text-2xl font-bold mt-1">+18%</p>
            <p className="text-xs text-white text-opacity-75 mt-1">
              strong momentum
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 group/item p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300">
          <Zap
            size={24}
            className="text-yellow-200 flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform duration-300"
          />
          <div>
            <p className="text-xs text-white text-opacity-90 font-medium">
              AI Insights Ready
            </p>
            <p className="text-2xl font-bold mt-1">{insightCount}</p>
            <p className="text-xs text-white text-opacity-75 mt-1">
              ready to apply
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Performance Chart Card
const PerformanceChartCard: React.FC<{
  activeMetric: "touches" | "replies" | "meetings" | "pipeline";
  onMetricChange: (
    metric: "touches" | "replies" | "meetings" | "pipeline"
  ) => void;
  dateRange: "7d" | "14d" | "30d" | "custom";
  onDateRangeChange: (range: "7d" | "14d" | "30d" | "custom") => void;
  statusFilter: "all" | "active" | "paused" | "completed";
  onStatusFilterChange: (
    status: "all" | "active" | "paused" | "completed"
  ) => void;
}> = ({
  activeMetric,
  onMetricChange,
  dateRange,
  onDateRangeChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const [showMetricDropdown, setShowMetricDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const getMetricLabel = () => {
    const labels = {
      touches: "Touches",
      replies: "Replies",
      meetings: "Meetings",
      pipeline: "Pipeline ($)",
    };
    return labels[activeMetric];
  };

  const getStatusLabel = () => {
    const labels = {
      all: "All Status",
      active: "Active",
      paused: "Paused",
      completed: "Completed",
    };
    return labels[statusFilter];
  };

  const getChartData = () => {
    if (dateRange === "14d") return mockPerformanceData14d;
    if (dateRange === "30d") return mockPerformanceData30d;
    return mockPerformanceData7d;
  };

  const getSubtitle = () => {
    const dateText =
      dateRange === "14d"
        ? "Last 14 days"
        : dateRange === "30d"
        ? "Last 30 days"
        : "Last 7 days";
    return `Outreach performance over the ${dateText}`;
  };

  const dateRangeOptions = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 14 Days", value: "14d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "Custom Range", value: "custom" },
  ];

  return (
    <div
      style={{ borderColor: THEME_COLOR_LIGHTER }}
      className="bg-white border-2 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 opacity-0 animate-fadeInUp group"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-gray-900 text-xl font-bold">
            Campaign Performance
          </h3>
          <p className="text-sm text-gray-600 mt-1">{getSubtitle()}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
          {/* Time Range Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              style={{ borderColor: THEME_COLOR_LIGHTER }}
              className="w-full sm:w-40 flex items-center justify-between px-4 py-2.5 bg-white border-2 rounded-lg hover:shadow-md hover:border-red-400 transition-all duration-300 text-gray-900 font-semibold text-sm group/btn"
            >
              <span>
                {dateRangeOptions.find((opt) => opt.value === dateRange)
                  ?.label || "Select Range"}
              </span>
              <ChevronDown
                size={16}
                className={`transition-all duration-300 ${
                  showDateDropdown ? "rotate-180 scale-110" : ""
                } group-hover/btn:text-red-600`}
                style={{ color: THEME_COLOR }}
              />
            </button>

            {showDateDropdown && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 rounded-lg shadow-2xl z-40 overflow-hidden opacity-0 animate-scaleIn"
                style={{ borderColor: THEME_COLOR_LIGHTER }}
              >
                {dateRangeOptions.map((opt, idx) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onDateRangeChange(
                        opt.value as "7d" | "14d" | "30d" | "custom"
                      );
                      setShowDateDropdown(false);
                    }}
                    style={{
                      animationDelay: `${idx * 30}ms`,
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 opacity-0 animate-slideInDown ${
                      dateRange === opt.value
                        ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-bold"
                        : "text-gray-900 hover:bg-gray-50 hover:translate-x-1"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="opacity-0 animate-fadeIn animation-delay-300">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLOR_LIGHTER} />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: `2px solid ${THEME_COLOR}`,
                borderRadius: "12px",
                padding: "16px",
                color: "#000",
                boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
              }}
              cursor={{ stroke: THEME_COLOR, strokeWidth: 2 }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px", color: "#000" }} />
            <Line
              type="monotone"
              dataKey={activeMetric}
              stroke={THEME_COLOR}
              strokeWidth={3}
              dot={{ fill: THEME_COLOR, r: 5 }}
              activeDot={{ r: 8, fill: THEME_COLOR }}
              name={getMetricLabel()}
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Enhanced Channel Performance Card
const ChannelPerformanceCard: React.FC = () => {
  const totalMeetings = mockChannelData.reduce(
    (sum, ch) => sum + ch.meetings,
    0
  );

  return (
    <div
      style={{ borderColor: THEME_COLOR_LIGHTER }}
      className="bg-white border-2 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 opacity-0 animate-fadeInUp"
    >
      <h3 className="text-gray-900 text-xl font-bold mb-6">
        Channel Performance
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-center justify-center opacity-0 animate-fadeIn animation-delay-200">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={mockChannelData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="meetings"
                label={({ name, percentage }: any) => `${name} ${percentage}%`}
                labelLine={false}
              >
                {mockChannelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: `2px solid ${THEME_COLOR}`,
                  borderRadius: "12px",
                  padding: "12px",
                  color: "#000",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-3">
            {mockChannelData.map((channel, idx) => (
              <div
                key={channel.name}
                style={{
                  animationDelay: `${idx * 60}ms`,
                }}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-105 group opacity-0 animate-slideInFromLeft"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full ring-2 ring-offset-2 transition-all duration-300 group-hover:scale-125"
                    style={{
                      backgroundColor: channel.color,
                      ringColor: channel.color,
                    }}
                  ></div>
                  <span className="text-sm font-semibold text-gray-900">
                    {channel.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {channel.percentage}%
                  </p>
                  <p className="text-xs text-gray-600">
                    {channel.meetings} mtgs
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{ borderTopColor: THEME_COLOR_LIGHTER }}
            className="border-t-2 pt-4 mt-6 opacity-0 animate-fadeIn animation-delay-500"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">
                Total Meetings
              </span>
              <span className="text-gray-900 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
                {totalMeetings}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced AI Insight Card
const AIInsightCard: React.FC<{
  insight: AIInsight;
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
}> = ({ insight, onApply, onDismiss }) => {
  if (insight.dismissed) return null;

  const getPriorityColor = () => {
    if (insight.priority === "high")
      return "bg-red-100 text-red-700 border-red-300";
    if (insight.priority === "medium")
      return "bg-orange-100 text-orange-700 border-orange-300";
    return "bg-yellow-100 text-yellow-700 border-yellow-300";
  };

  const getPriorityBgColor = () => {
    if (insight.priority === "high") return "bg-red-50";
    if (insight.priority === "medium") return "bg-orange-50";
    return "bg-yellow-50";
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 ${getPriorityBgColor()} border-opacity-30 mb-3 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:translate-x-1 cursor-pointer group opacity-0 animate-slideInFromRight`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Zap
              size={16}
              style={{ color: THEME_COLOR }}
              className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
            />
            <h4 className="font-bold text-sm text-gray-900">{insight.title}</h4>
          </div>
          <p className="text-xs text-gray-700">{insight.description}</p>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-bold border whitespace-nowrap ml-2 ${getPriorityColor()}`}
        >
          {insight.priority === "high"
            ? "🔴"
            : insight.priority === "medium"
            ? "🟠"
            : "🟡"}{" "}
          {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-opacity-20 border-gray-300">
        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
          {insight.improvement}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onDismiss(insight.id)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
          >
            Dismiss
          </button>
          <button
            onClick={() => onApply(insight.id)}
            style={{ backgroundColor: THEME_COLOR }}
            className="px-3 py-1.5 text-xs font-bold rounded-lg text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Sequences Table
const SequencesTable: React.FC = () => {
  const getStatusBadgeColor = (status: string) => {
    if (status === "active")
      return "bg-green-100 text-green-700 border-green-300";
    if (status === "paused")
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    if (status === "completed")
      return "bg-blue-100 text-blue-700 border-blue-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getStatusIcon = (status: string) => {
    if (status === "active") return <Play size={14} />;
    if (status === "paused") return <Pause size={14} />;
    return null;
  };

  return (
    <div
      style={{ borderColor: THEME_COLOR_LIGHTER }}
      className="bg-white border-2 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 opacity-0 animate-fadeInUp"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900 text-xl font-bold">Campaign Details</h3>
          <p className="text-sm text-gray-600 mt-1">
            Active and completed sequences
          </p>
        </div>
        <button className="text-sm font-bold hover:underline flex items-center gap-2 text-gray-900 transition-all duration-200 hover:text-red-600 hover:gap-3 group">
          View All
          <Eye
            size={16}
            className="group-hover:scale-110 transition-transform duration-300"
          />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: THEME_COLOR_LIGHT }}>
              <th className="text-left py-4 px-4 font-bold text-gray-900">
                Campaign Name
              </th>
              <th className="text-left py-4 px-4 font-bold text-gray-900">
                Channels
              </th>
              <th className="text-right py-4 px-4 font-bold text-gray-900">
                Touches
              </th>
              <th className="text-right py-4 px-4 font-bold text-gray-900">
                Pipeline ($)
              </th>
              <th className="text-right py-4 px-4 font-bold text-gray-900">
                Meetings
              </th>
              <th className="text-center py-4 px-4 font-bold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {mockSequences.map((sequence, idx) => (
              <tr
                key={sequence.id}
                style={{
                  borderBottomColor: THEME_COLOR_LIGHTER,
                  animationDelay: `${idx * 50}ms`,
                }}
                className="border-b hover:bg-red-50 transition-all duration-200 opacity-0 animate-slideInFromLeft group cursor-pointer"
              >
                <td className="py-4 px-4 text-gray-900 font-semibold group-hover:text-red-600 transition-colors duration-200">
                  {sequence.name}
                </td>
                <td className="py-4 px-4 text-gray-900 text-xs">
                  <div className="flex flex-wrap gap-2">
                    {sequence.channels.map((ch) => (
                      <span
                        key={ch}
                        className="px-3 py-1.5 bg-gray-100 rounded-full text-gray-700 text-xs font-medium transition-all duration-200 group-hover:bg-red-100 group-hover:text-red-700"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900 text-right font-semibold group-hover:text-red-600 transition-colors duration-200">
                  {sequence.touches.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                  ${(sequence.pipeline / 1000).toFixed(0)}K
                </td>
                <td className="py-4 px-4 text-gray-900 text-right font-semibold group-hover:text-red-600 transition-colors duration-200">
                  {sequence.meetings}
                </td>
                <td className="py-4 px-4 text-center">
                  <span
                    className={`px-3 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 border ${getStatusBadgeColor(
                      sequence.status
                    )} group-hover:shadow-md`}
                  >
                    {getStatusIcon(sequence.status)}
                    {sequence.status.charAt(0).toUpperCase() +
                      sequence.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Enhanced Floating AI Insights Panel
const FloatingAIInsights: React.FC<{
  insights: AIInsight[];
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  insightCount: number;
}> = ({ insights, onApply, onDismiss, isOpen, onToggle, insightCount }) => {
  return (
    <>
      {/* Floating Panel */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-32 opacity-0 pointer-events-none"
        }`}
      >
        <div
          style={{ borderColor: THEME_COLOR_LIGHTER }}
          className="bg-white border-2 rounded-2xl shadow-2xl p-5 w-96 max-h-[70vh] flex flex-col backdrop-blur-sm"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between mb-5 pb-4 border-b-2"
            style={{ borderColor: THEME_COLOR_LIGHTER }}
          >
            <h3 className="font-bold flex items-center gap-3 text-gray-900">
              <div
                style={{ backgroundColor: THEME_COLOR }}
                className="p-2.5 rounded-lg shadow-lg"
              >
                <Zap size={20} className="text-white" />
              </div>
              <div>
                <div className="text-base">AI Insights</div>
                {insightCount > 0 && (
                  <div className="text-xs text-gray-600">
                    {insightCount} available
                  </div>
                )}
              </div>
            </h3>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 hover:rotate-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Insights List */}
          <div className="flex-1 overflow-y-auto space-y-3 pb-2">
            {insights.filter((i) => !i.dismissed).length > 0 ? (
              insights
                .filter((i) => !i.dismissed)
                .map((insight, idx) => (
                  <div
                    key={insight.id}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <AIInsightCard
                      insight={insight}
                      onApply={onApply}
                      onDismiss={onDismiss}
                    />
                  </div>
                ))
            ) : (
              <div className="p-8 text-center">
                <CheckCircle
                  size={32}
                  className="mx-auto mb-3 text-green-500 animate-bounce"
                />
                <p className="text-gray-600 text-sm font-medium">
                  All insights reviewed!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating FAB Button */}
      <button
        onClick={onToggle}
        style={{ backgroundColor: THEME_COLOR }}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-300 z-30 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        } hover:scale-110 group`}
        title="AI Insights"
      >
        <Zap
          size={28}
          className="group-hover:rotate-12 transition-transform duration-300"
        />
        {insightCount > 0 && (
          <span
            style={{ backgroundColor: THEME_COLOR }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-lg animate-bounce"
          >
            {insightCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-20 transition-opacity duration-300"
          onClick={onToggle}
        />
      )}
    </>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: "7d",
    sequenceType: "all",
    channel: "all",
    status: "all",
  });

  const [activeMetric, setActiveMetric] = useState<
    "touches" | "replies" | "meetings" | "pipeline"
  >("meetings");
  const [chartDateRange, setChartDateRange] = useState<
    "7d" | "14d" | "30d" | "custom"
  >("7d");
  const [chartStatusFilter, setChartStatusFilter] = useState<
    "all" | "active" | "paused" | "completed"
  >("active");
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(mockAIInsights);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value as never }));
  };

  const handleApplyInsight = (id: string) => {
    console.log(`Applied insight: ${id}`);
    setAiInsights((prev) =>
      prev.map((insight) =>
        insight.id === id ? { ...insight, dismissed: true } : insight
      )
    );
  };

  const handleDismissInsight = (id: string) => {
    setAiInsights((prev) =>
      prev.map((insight) =>
        insight.id === id ? { ...insight, dismissed: true } : insight
      )
    );
  };

  const activeInsightCount = aiInsights.filter((i) => !i.dismissed).length;

  const kpiMetrics: KPIMetric[] = [
    {
      id: "1",
      title: "Total Reach",
      value: "8,420",
      change: 12.5,
      changeType: "increase",
      icon: <Send size={24} />,
    },
    {
      id: "2",
      title: "Engagement Rate",
      value: "6.8%",
      change: 2.3,
      changeType: "increase",
      icon: <MessageSquare size={24} />,
    },
    {
      id: "3",
      title: "Active Campaigns",
      value: "8",
      change: 8.1,
      changeType: "increase",
      icon: <Target size={24} />,
    },
    {
      id: "4",
      title: "Conversion Rate",
      value: "15.2%",
      change: 3.7,
      changeType: "increase",
      icon: <TrendingUp size={24} />,
    },
  ];

  return (
    <div
      
      className="min-h-screen pb-24"
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slideInFromLeft {
          animation: slideInFromLeft 0.6s ease-out forwards;
        }

        .animate-slideInFromRight {
          animation: slideInFromRight 0.5s ease-out forwards;
        }

        .animate-slideInDown {
          animation: slideInDown 0.4s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #de3744;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #b82333;
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Page Header */}
        <div className="mb-8 opacity-0 animate-fadeIn">
          <h1 className="text-gray-900 text-4xl md:text-5xl font-bold mb-2 leading-tight">
            Overall Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Pipeline, engagement, and AI insights for outbound SDR programs
          </p>
        </div>

        {/* Quick Summary Banner */}
        {/* <QuickSummaryBanner insightCount={activeInsightCount} /> */}

        {/* KPI Grid - 4 Cards with Stagger */}
        <section className="mb-12">
          <h2 className="text-gray-900 text-2xl font-bold mb-6 opacity-0 animate-fadeIn">
            Key Performance Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiMetrics.map((metric, idx) => (
              <KpiCard key={metric.id} metric={metric} delay={idx * 80} />
            ))}
          </div>
        </section>

        {/* Performance Charts */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PerformanceChartCard
              activeMetric={activeMetric}
              onMetricChange={setActiveMetric}
              dateRange={chartDateRange}
              onDateRangeChange={setChartDateRange}
              statusFilter={chartStatusFilter}
              onStatusFilterChange={setChartStatusFilter}
            />
            <ChannelPerformanceCard />
          </div>
        </section>

        {/* Sequences Table */}
        <section>
          <SequencesTable />
        </section>
      </div>

      {/* Floating AI Insights Panel */}
      <FloatingAIInsights
        insights={aiInsights}
        onApply={handleApplyInsight}
        onDismiss={handleDismissInsight}
        isOpen={showAIInsights}
        onToggle={() => setShowAIInsights(!showAIInsights)}
        insightCount={activeInsightCount}
      />
    </div>
  );
};

export default Dashboard;
