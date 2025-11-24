import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, CheckSquare, List, Mail, TrendingUp, TrendingDown, Edit, Eye, 
  Play, Trash2, Zap, Pause, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from "lucide-react"; 
import { useNavigate } from "react-router-dom";

// --- UTILITY COMPONENTS (from previous response) ---
const CampaignStatusTag = ({ status, children }) => {
  let bgColor = "bg-gray-200 text-gray-700";
  if (status === "Active") bgColor = "bg-green-100 text-green-700";
  if (status === "Completed") bgColor = "bg-blue-100 text-blue-700";
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${bgColor}`}>
      {children}
    </span>
  );
};

const StatCard = ({ title, value, percentage, isPositive, icon: Icon, iconColorClass }) => {
  const TrendIcon = percentage ? (isPositive ? TrendingUp : TrendingDown) : null;
  const trendColorClass = percentage ? (isPositive ? "text-green-500" : "text-red-500") : "text-gray-500";
  const percentageSign = percentage ? (isPositive ? "+" : "-") : "";

  return (
    <Card className="shadow-sm"> {/* shadow-sm preserved for Stat Cards */}
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
          <div className="text-2xl font-bold mt-1 text-gray-900">{value}</div>
          {percentage && (
            <div className={`flex items-center text-sm mt-1 ${trendColorClass}`}>
              {TrendIcon && <TrendIcon className="w-4 h-4 mr-1" />}
              {percentageSign}{Math.abs(percentage)}% vs last month
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
// --- END UTILITY COMPONENTS ---

export default function Campaigns() {
  const navigate = useNavigate();

  const campaignData = [
    { id: 1, name: "Partnership Outreach", sub: "Business Development", status: "Draft", contacts: 180, contacted: 0, openRate: 0.0, replyRate: 0.0, lastActivity: "Nov 15, 2025" },
    { id: 2, name: "Customer Success Follow-up", sub: "Retention", status: "Active", contacts: 450, contacted: 320, openRate: 52.0, replyRate: 25.0, lastActivity: "Nov 18, 2025" },
    { id: 3, name: "Webinar Invitation Series", sub: "Event Promotion", status: "Completed", contacts: 950, contacted: 950, openRate: 38.0, replyRate: 15.0, lastActivity: "Nov 10, 2025" },
  ];

  const handleViewDetails = (campaignId) => {
    navigate(`/campaigns/${campaignId}/details`); 
  };
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor your outreach campaigns with comprehensive analytics and bulk operations.
          </p>
        </div>
        <Button onClick={() => navigate('/campaign/new')} className="bg-red-500 hover:bg-red-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Campaigns" value="24" percentage={12.5} isPositive={false} icon={List} iconColorClass="bg-blue-500" />
        <StatCard title="Active Campaigns" value="8" percentage={25.0} isPositive={true} icon={Play} iconColorClass="bg-green-500" />
        <StatCard title="Total Contacts" value="15,420" percentage={8.3} isPositive={false} icon={CheckSquare} iconColorClass="bg-purple-500" />
        <StatCard title="Avg. Open Rate" value="36.0%" percentage={4.2} isPositive={false} icon={Mail} iconColorClass="bg-orange-500" />
      </div>
      
      {/* Campaign Management Table */}
      <Card className="shadow-sm"> {/* Subtly reduced shadow here */}
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <CardTitle className="text-xl font-semibold">Campaign Management</CardTitle>
          <div className="flex justify-between items-center space-x-4">
                <input type="search" placeholder="Search campaigns..." className="p-2 border rounded-md flex-grow max-w-sm"/>
                <div className="flex items-center space-x-4">
                    <select className="border rounded-md p-2 text-sm"><option>All Status</option></select>
                    <select className="border rounded-md p-2 text-sm"><option>All Time</option></select>
                    <select className="border rounded-md p-2 text-sm"><option>Newest First</option></select>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Filters & Tabs */}
            
          <div className="p-4 border-b flex space-x-4 text-sm font-medium">
            <span className="cursor-pointer text-blue-600 border-b-2 border-blue-600 pb-2">Active Campaigns</span>
            <span className="cursor-pointer text-gray-500 hover:text-gray-700 pb-2">Paused</span>
            <span className="cursor-pointer text-gray-500 hover:text-gray-700 pb-2">Top Performers</span>
          </div>

          {/* Table (Overflow-x-auto for horizontal scroll) */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"><input type="checkbox" /></th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CAMPAIGN</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CONTACTS</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">OPEN RATE</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">REPLY RATE</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">LAST ACTIVITY</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {campaignData.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap"><input type="checkbox" /></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-red-100 p-2 rounded-full mr-3"><Zap className="h-4 w-4 text-red-500" /></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-xs text-gray-500">{campaign.sub}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CampaignStatusTag status={campaign.status}>
                          {campaign.status === "Draft" ? <Edit className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                          {campaign.status}
                      </CampaignStatusTag>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{campaign.contacts}</div>
                        <div className="text-xs text-gray-500">{campaign.contacted} contacted</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.openRate.toFixed(1)}%
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${campaign.openRate}%` }}></div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.replyRate.toFixed(1)}%
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${campaign.replyRate}%` }}></div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.lastActivity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 text-gray-500">
                            <Button variant="ghost" size="icon" className="hover:text-blue-600" onClick={() => handleViewDetails(campaign.id)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:text-blue-600"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="hover:text-blue-600"><Pause className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 flex justify-between items-center border-t">
              <div className="text-sm text-gray-500">
                  Showing 6 of 24 campaigns
              </div>
              <div className="flex items-center space-x-1">
                  <Button variant="outline" size="icon" className="h-8 w-8 text-gray-500"><ChevronsLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-gray-500"><ChevronLeft className="h-4 w-4" /></Button>
                  <Button className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold">1</Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-gray-500">2</Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-gray-500">3</Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-gray-500"><ChevronRight className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-gray-500"><ChevronsRight className="h-4 w-4" /></Button>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}