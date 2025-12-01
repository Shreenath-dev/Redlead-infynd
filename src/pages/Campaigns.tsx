import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Plus,
  CheckSquare,
  List,
  Mail,
  TrendingUp,
  TrendingDown,
  Edit,
  Eye,
  Play,
  Trash2,
  Zap,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  XCircle,
  Calendar, // Added Calendar icon
} from "lucide-react";

import { useNavigate } from "react-router-dom";

// --- UTILITY COMPONENTS (from previous response) ---

const CampaignStatusTag = ({ status, children }) => {
  let bgColor = "bg-gray-200 text-gray-700";

  if (status === "Active") bgColor = "bg-green-100 text-green-700";

  if (status === "Completed") bgColor = "bg-blue-100 text-blue-700";

  if (status === "Draft") bgColor = "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${bgColor}`}
    >
      {children}
    </span>
  );
};

const StatCard = ({
  title,
  value,
  percentage,
  isPositive,
  icon: Icon,
  iconColorClass,
}) => {
  const TrendIcon = percentage
    ? isPositive
      ? TrendingUp
      : TrendingDown
    : null;

  const trendColorClass = percentage
    ? isPositive
      ? "text-green-500"
      : "text-red-500"
    : "text-gray-500";

  const percentageSign = percentage ? (isPositive ? "+" : "-") : "";

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-medium text-gray-500">
            {title}
          </CardTitle>

          <div className="text-2xl font-bold mt-1 text-gray-900">{value}</div>

          {percentage && (
            <div
              className={`flex items-center text-sm mt-1 ${trendColorClass}`}
            >
              {TrendIcon && <TrendIcon className="w-4 h-4 mr-1" />}
              {percentageSign}
              {Math.abs(percentage)}% vs last month
            </div>
          )}
        </div>

        <div className={`p-3 rounded-xl ${iconColorClass}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </CardContent>
    </Card>
  );
};

const SortableHeader = ({ title, currentSort, columnKey, onClick }) => {
  const isCurrent = currentSort.key === columnKey;

  const SortIcon = isCurrent
    ? currentSort.direction === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUp;

  return (
    <th
      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
      onClick={() => onClick(columnKey)}
    >
      <div className="flex items-center">
        {title}

        <SortIcon
          className={`ml-2 h-3 w-3 ${
            isCurrent ? "text-gray-800" : "text-gray-400 opacity-50"
          }`}
        />
      </div>
    </th>
  );
};

// --- END UTILITY COMPONENTS ---

// --- MAIN CAMPAIGNS COMPONENT ---

export default function Campaigns() {
  const navigate = useNavigate();

  const [sortConfig, setSortConfig] = React.useState({
    key: "lastActivity",
    direction: "desc",
  });

  // ⭐ UPDATED: State for Filtering

  const [filters, setFilters] = React.useState({
    status: "All",

    search: "",

    dateRange: "Last 30 Days", // ⭐ NEW: Simulated date range filter
  });

  const campaignData = [
    {
      id: 1,
      name: "Partnership Outreach",
      sub: "Business Development",
      status: "Draft",
      contacts: 180,
      contacted: 0,
      openRate: 0.0,
      replyRate: 0.0,
      lastActivity: "Nov 15, 2025",
    },

    {
      id: 2,
      name: "Customer Success Follow-up",
      sub: "Retention",
      status: "Active",
      contacts: 450,
      contacted: 320,
      openRate: 52.0,
      replyRate: 25.0,
      lastActivity: "Nov 18, 2025",
    },

    {
      id: 3,
      name: "Webinar Invitation Series",
      sub: "Event Promotion",
      status: "Completed",
      contacts: 950,
      contacted: 950,
      openRate: 38.0,
      replyRate: 15.0,
      lastActivity: "Nov 10, 2025",
    },

    {
      id: 4,
      name: "Q4 Lead Generation",
      sub: "Sales",
      status: "Active",
      contacts: 1200,
      contacted: 800,
      openRate: 45.0,
      replyRate: 18.0,
      lastActivity: "Nov 22, 2025",
    },

    {
      id: 5,
      name: "Post-Event Follow-up",
      sub: "Marketing",
      status: "Draft",
      contacts: 220,
      contacted: 0,
      openRate: 0.0,
      replyRate: 0.0,
      lastActivity: "Nov 25, 2025",
    },

    {
      id: 6,
      name: "Cold Outreach - Tech CEO",
      sub: "Sales",
      status: "Completed",
      contacts: 50,
      contacted: 50,
      openRate: 60.0,
      replyRate: 30.0,
      lastActivity: "Nov 01, 2025",
    },
  ];

  // --- Filter Logic ---

  const filteredCampaigns = React.useMemo(() => {
    return campaignData.filter((campaign) => {
      // 1. Status Filter

      const statusMatch =
        filters.status === "All" || campaign.status === filters.status;

      // 2. Search Filter

      const searchLower = filters.search.toLowerCase();

      const searchMatch =
        campaign.name.toLowerCase().includes(searchLower) ||
        campaign.sub.toLowerCase().includes(searchLower);

      // 3. Date Filter (Simulated: The campaignData is small, so we don't apply actual date filtering,

      // but the presence of the filter state allows the UI to reflect a choice.)

      const dateMatch =
        filters.dateRange === "Last 30 Days" ||
        filters.dateRange === "All Time";

      return statusMatch && searchMatch && dateMatch;
    });
  }, [campaignData, filters]);

  // Simulated sorting function

  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  // Combine Filter and Sort Logic

  const sortedCampaigns = React.useMemo(() => {
    let sortableItems = [...filteredCampaigns];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];

        let bValue = b[sortConfig.key];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();

          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }

        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }

        return 0;
      });
    }

    return sortableItems;
  }, [filteredCampaigns, sortConfig]);

  const handleViewDetails = (campaignId) => {
    navigate(`/campaigns/${campaignId}/details`);
  };

  const allStatuses = ["All", "Active", "Draft", "Completed"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>

          <p className="text-gray-500 mt-1">
            Manage and monitor your outreach campaigns with comprehensive
            analytics and bulk operations.
          </p>
        </div>

        <Button
          onClick={() => navigate("/campaign/new")}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Campaigns"
          value="24"
          percentage={12.5}
          isPositive={false}
          icon={List}
          iconColorClass="bg-blue-500"
        />

        <StatCard
          title="Active Campaigns"
          value="8"
          percentage={25.0}
          isPositive={true}
          icon={Play}
          iconColorClass="bg-green-500"
        />

        <StatCard
          title="Total Contacts"
          value="15,420"
          percentage={8.3}
          isPositive={false}
          icon={CheckSquare}
          iconColorClass="bg-purple-500"
        />

        <StatCard
          title="Avg. Open Rate"
          value="36.0%"
          percentage={4.2}
          isPositive={false}
          icon={Mail}
          iconColorClass="bg-orange-500"
        />
      </div>
      {/* Campaign Management Table */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b">
          <CardTitle className="text-xl font-semibold mb-3 sm:mb-0">
            Campaign List ({sortedCampaigns.length})
          </CardTitle>

          {/* --- ENHANCED FILTER/SEARCH BAR WITH STATUS DROPDOWN & CALENDAR --- */}

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Search Input */}

            <div className="relative flex-grow">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                placeholder="Search campaigns..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            {/* Status Filter Dropdown */}

            <select
              className="border border-gray-300 rounded-lg p-2 text-sm h-10 w-32 focus:border-red-500 focus:ring-red-500"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              {allStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* ⭐ NEW: Date Range Filter Button (Simulated) */}

            <Button
              variant="outline"
              className={`h-10 text-gray-600 border-gray-300 hover:bg-gray-50 ${
                filters.dateRange !== "Last 30 Days"
                  ? "ring-2 ring-red-300 border-red-400"
                  : ""
              }`}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange:
                    prev.dateRange === "Last 30 Days"
                      ? "All Time"
                      : "Last 30 Days",
                }))
              } // Dummy toggle logic
            >
              <Calendar className="mr-2 h-4 w-4" />

              {filters.dateRange}
            </Button>
          </div>

          {/* ----------------------------------- */}
        </CardHeader>

        {/* --- Active Filter Tags (Visual Feedback) --- */}

        {(filters.status !== "All" ||
          filters.search ||
          filters.dateRange !== "Last 30 Days") && (
          <div className="p-4 pt-0 flex flex-wrap gap-2 border-b">
            <span className="text-sm text-gray-600 font-medium mr-2">
              Active Filters:
            </span>

            {filters.status !== "All" && (
              <span className="flex items-center bg-red-50 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full border border-red-200">
                Status: {filters.status}
                <XCircle
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, status: "All" }))
                  }
                />
              </span>
            )}

            {filters.search && (
              <span className="flex items-center bg-red-50 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full border border-red-200">
                Search: "{filters.search}"
                <XCircle
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, search: "" }))
                  }
                />
              </span>
            )}

            {filters.dateRange !== "Last 30 Days" && (
              <span className="flex items-center bg-red-50 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full border border-red-200">
                Date: {filters.dateRange}
                <XCircle
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: "Last 30 Days",
                    }))
                  }
                />
              </span>
            )}
          </div>
        )}

        {/* ------------------------------------------ */}

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                  </th>

                  {/* --- SORTABLE HEADERS --- */}

                  <SortableHeader
                    title="CAMPAIGN"
                    columnKey="name"
                    currentSort={sortConfig}
                    onClick={handleSort}
                  />

                  <SortableHeader
                    title="STATUS"
                    columnKey="status"
                    currentSort={sortConfig}
                    onClick={handleSort}
                  />

                  <SortableHeader
                    title="CONTACTS"
                    columnKey="contacts"
                    currentSort={sortConfig}
                    onClick={handleSort}
                  />

                  <SortableHeader
                    title="OPEN RATE"
                    columnKey="openRate"
                    currentSort={sortConfig}
                    onClick={handleSort}
                  />

                  <SortableHeader
                    title="REPLY RATE"
                    columnKey="replyRate"
                    currentSort={sortConfig}
                    onClick={handleSort}
                  />

                  <SortableHeader
                    title="LAST ACTIVITY"
                    columnKey="lastActivity"
                    currentSort={sortConfig}
                    onClick={handleSort}
                  />

                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {sortedCampaigns.length > 0 ? (
                  sortedCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded text-red-600 focus:ring-red-500"
                        />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-red-100 p-2 rounded-full mr-3">
                            <Zap className="h-4 w-4 text-red-500" />
                          </div>

                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {campaign.name}
                            </div>

                            <div className="text-xs text-gray-500">
                              {campaign.sub}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <CampaignStatusTag status={campaign.status}>
                          {campaign.status === "Draft" ? (
                            <Edit className="h-3 w-3 mr-1" />
                          ) : campaign.status === "Active" ? (
                            <Play className="h-3 w-3 mr-1" />
                          ) : (
                            <CheckSquare className="h-3 w-3 mr-1" />
                          )}

                          {campaign.status}
                        </CampaignStatusTag>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.contacts}
                        </div>

                        <div className="text-xs text-gray-500">
                          {campaign.contacted} contacted
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.openRate.toFixed(1)}%
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${campaign.openRate}%` }}
                          ></div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.replyRate.toFixed(1)}%
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-green-600 h-1.5 rounded-full"
                            style={{ width: `${campaign.replyRate}%` }}
                          ></div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.lastActivity}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 text-gray-500">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-blue-600"
                            onClick={() => handleViewDetails(campaign.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className={`

                                  ${
                                    campaign.status === "Active"
                                      ? "text-red-500 hover:bg-red-50"
                                      : "hover:text-green-600"
                                  }

                                `}
                          >
                            {campaign.status === "Active" ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-10 text-center text-gray-500 text-sm"
                    >
                      No campaigns match the current filters or search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          <div className="p-4 flex justify-between items-center border-t">
            <div className="text-sm text-gray-500">
              Showing **{sortedCampaigns.length}** of 24 campaigns
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

              <Button className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
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
  );
}
