import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Send, MailOpen, MessageSquare, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Sends", value: "0", icon: Send, trend: "" },
    { label: "Opens", value: "0%", icon: MailOpen, trend: "" },
    { label: "Replies", value: "0%", icon: MessageSquare, trend: "" },
    { label: "Bounces", value: "0%", icon: AlertCircle, trend: "" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">Welcome to RedLead Campaign Orchestrator</p>
        </div>
        <Button onClick={() => navigate('/campaign/new')} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.trend && (
                <p className="text-xs text-text-secondary mt-1">{stat.trend}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Campaigns */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No active campaigns yet</h3>
            <p className="text-text-secondary mb-4">
              Create your first campaign to start reaching out to prospects
            </p>
            <Button onClick={() => navigate('/campaign/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
