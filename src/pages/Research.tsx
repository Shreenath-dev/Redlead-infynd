import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    FileSearch, Search, ClipboardList, Eye, Trash2, Import, LocateFixed, Link
} from "lucide-react";

// --- Mock Data (same as before) ---
const mockHistory = [
    {
        id: 1,
        companyName: "TechFlow Solutions",
        url: "https://techflow.com",
        industry: "Technology",
        status: "completed",
        date: "Nov 19, 12:00 PM",
        insights: { valueProps: 3, painPoints: 3, solutions: 3 }
    },
    {
        id: 2,
        companyName: "HealthCare Innovations",
        url: "https://healthcareinnovations.com",
        industry: "Healthcare",
        status: "completed",
        date: "Nov 18, 07:45 PM",
        insights: { valueProps: 3, painPoints: 3, solutions: 3 }
    },
    {
        id: 3,
        companyName: "EcoCommerce Platform",
        url: "https://e-commerce.com",
        industry: "E-commerce",
        status: "completed",
        date: "Nov 17, 04:15 PM",
        insights: { valueProps: 3, painPoints: 3, solutions: 3 }
    },
    { id: 4, companyName: "FinTech Innovations", url: "https://fintech.io", industry: "Finance", status: "completed", date: "Nov 16, 09:00 AM", insights: { valueProps: 4, painPoints: 2, solutions: 3 } },
    { id: 5, companyName: "Auto Manufacturing Inc.", url: "https://autoinc.com", industry: "Manufacturing", status: "completed", date: "Nov 15, 05:30 PM", insights: { valueProps: 2, painPoints: 4, solutions: 1 } },
    { id: 6, companyName: "Higher Ed Consultants", url: "https://highered.com", industry: "Education", status: "completed", date: "Nov 14, 02:00 PM", insights: { valueProps: 3, painPoints: 3, solutions: 3 } },
    { id: 7, companyName: "Global Foods Ltd", url: "https://globalfoods.com", industry: "E-commerce", status: "completed", date: "Nov 13, 11:00 AM", insights: { valueProps: 5, painPoints: 1, solutions: 4 } },
];

const mockAnalyzedData = {
    url: "https://snssquare.com",
    companyName: "SNS Square, Inc.",
    location: "San Francisco, CA",
    domainExpertise: ["SaaS Platform", "AI Automation", "Lead Generation", "Marketing Tech", "Customer Success", "API Integration", "Data Analytics"],
    recentPosts: [
        { summary: "New feature launch: Integrated CRM sync for seamless data flow.", date: "2025-10-25" },
        { summary: "Blog post: How AI can reduce MQL-to-SQL conversion time by 40%.", date: "2025-10-10" },
        { summary: "Case Study: 300% ROI achieved by a mid-market e-commerce client.", date: "2025-09-15" },
        { summary: "Product Update: New dashboard layout for better performance visualization.", date: "2025-09-01" },
        { summary: "Webinar Recap: Mastering B2B outreach in a cookie-less world.", date: "2025-08-20" },
        { summary: "Press Release: SNS Square secures $15M in Series A funding.", date: "2025-08-05" },
        { summary: "Guide: The definitive guide to effective cold emailing in 2025.", date: "2025-07-28" },
    ]
};

// --- History Tag Component ---
const TagButton = ({ label, isActive }) => (
    <Button 
        variant={isActive ? "default" : "secondary"}
        size="sm"
        className={`h-7 px-3 rounded-full text-sm font-medium transition-colors ${
            isActive ? 'bg-primary text-primary-foreground hover:bg-primary-hover' : 'bg-secondary text-text-secondary hover:bg-gray-200'
        }`}
    >
        {label}
    </Button>
);

export default function Research() {
    const statusColor = "text-primary";
    
    return (
        // The main container needs to set the stage for height calculation
        <div className="flex space-x-6 h-[calc(110vh-80px)] p-4"> 
            
            {/* --- Left and Center Content (Scrollable) --- */}
            <div className="flex-grow space-y-6 overflow-y-auto custom-scrollbar-red">
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Research Hub</h1>
                    <p className="text-text-secondary mt-1">AI-powered prospect and company analysis through automated website crawling and content intelligence</p>
                </div>

                {/* 1. AI Research Agent Card */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center space-x-4 p-4 border-b border-divider">
                        <FileSearch className="h-6 w-6 text-primary" />
                        <CardTitle className="text-xl font-semibold text-text-primary">AI Research Agent</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <p className="text-text-secondary">Analyze websites and extract company intelligence</p>
                        
                        {/* Input Row 1: URL */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Company Website URL</label>
                            <div className="flex space-x-2">
                                <Input 
                                    className="flex-grow border-input bg-card placeholder:text-muted-foreground focus:ring-ring focus:ring-2 focus:ring-offset-0"
                                    placeholder="https://snssquare.com" 
                                    defaultValue="https://snssquare.com"
                                />
                                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-6 flex-shrink-0">
                                    <Search className="h-4 w-4 mr-2" />
                                    Analyze
                                </Button>
                            </div>
                        </div>

                        {/* Input Row 2: Company Name and Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-primary">Company Name</label>
                                <Input 
                                    className="border-input bg-card placeholder:text-muted-foreground focus:ring-ring focus:ring-2 focus:ring-offset-0"
                                    placeholder="e.g., Tesla" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-primary">Location (City, State)</label>
                                <Input 
                                    className="border-input bg-card placeholder:text-muted-foreground focus:ring-ring focus:ring-2 focus:ring-offset-0"
                                    placeholder="e.g., San Francisco, CA" 
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Analyzed Website Data Card */}
                <Card className="shadow-sm">
                    <CardContent className="p-4 space-y-4">
                        
                        {/* Internal Scroll for Analyzed Data - custom-scrollbar-red removed! */}
                        <div className="h-[400px] overflow-y-auto space-y-4 pr-2"> 

                            {/* Company Header */}
                            <div className="border-b pb-3 space-y-1 sticky top-0 bg-white z-10">
                                                            
                                <h3 className="text-2xl font-bold text-text-primary mt-1">{mockAnalyzedData.companyName}</h3>
                                <div className="flex items-center space-x-3 text-sm text-text-secondary">
                                    <Link className="h-4 w-4" />
                                    <a href={mockAnalyzedData.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                                        {mockAnalyzedData.url}
                                    </a>
                                    <span className="text-divider">|</span>
                                    <LocateFixed className="h-4 w-4" />
                                    <span>{mockAnalyzedData.location}</span>
                                </div>
                            </div>

                            {/* Domain Expertise */}
                            <div className="pt-2">
                                <p className="text-sm font-semibold text-text-primary mb-2">Domain Expertise</p>
                                <div className="flex flex-wrap gap-2">
                                    {mockAnalyzedData.domainExpertise.map((domain, index) => (
                                        <TagButton key={index} label={domain} isActive={true} />
                                    ))}
                                </div>
                            </div>

                            {/* Recent Post Summary */}
                            <div>
                                <p className="text-sm font-semibold text-text-primary mb-2">Recent Content Summary</p>
                                <div className="space-y-3">
                                    {mockAnalyzedData.recentPosts.map((post, index) => (
                                        <div key={index} className="border-l-4 border-accent p-3 bg-muted/50 rounded-md">
                                            <p className="text-text-primary text-base leading-snug">{post.summary}</p>
                                            <p className="text-xs text-text-secondary mt-1">Posted: {post.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* --- Right Sidebar (Fixed Research History) --- */}
            <Card className="w-80 shadow-sm flex-shrink-0 h-full overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-divider">
                    <div className="flex items-center space-x-2">
                        <ClipboardList className="h-5 w-5 text-text-primary" />
                        <div className="items-center space-x-2">
                        <CardTitle className="text-lg font-semibold text-text-primary">Research History</CardTitle>
                        <span className="text-sm text-text-secondary ml-1">({mockHistory.length} companies analyzed)</span>
                        </div>
                    </div>
                    <Button variant="ghost" className="text-sm text-primary hover:bg-accent px-2">
                        <Import className="h-4 w-4 mr-1" /> Export All
                    </Button>
                </CardHeader>

                {/* CardContent height is full, and its children are flex-col */}
                <CardContent className="p-4 space-y-4 h-[calc(100%-70px)] flex flex-col">
                    {/* Search and Filters (Fixed Top) */}
                    <div className="space-y-3 flex-shrink-0">
                        <Input 
                            className="w-full border-input bg-card placeholder:text-muted-foreground"
                            placeholder="Search companies..."
                        />
                        <div className="flex flex-wrap gap-2">
                            {["All industries", "Technology", "Healthcare", "Finance", "E-commerce", "Manufacturing", "Education"].map((tag, index) => (
                                <TagButton key={index} label={tag} isActive={tag === "All industries"} />
                            ))}
                        </div>
                    </div>

                    {/* History List (Takes remaining height and scrolls with the custom red scrollbar) */}
                    <div className="flex-grow overflow-y-auto custom-scrollbar-red space-y-3 pt-2">
                        {mockHistory.map((item) => (
                            <div key={item.id} className="border border-divider p-3 rounded-lg shadow-sm hover:border-primary transition-colors">
                                <div className="flex items-start justify-between">
                                    <h4 className="font-semibold text-text-primary leading-snug">{item.companyName}</h4>
                                    <div className="flex space-x-1.5 ml-2 flex-shrink-0">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-text-primary">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                
                                <p className="text-xs text-text-secondary mt-0.5">{item.url}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <TagButton label={item.industry} isActive={false} />
                                    <span className={`text-xs font-medium ${statusColor}`}>{item.status}</span>
                                </div>
                                <p className="text-xs text-text-secondary mt-1 border-b border-divider pb-2">
                                    {item.industry} • {item.date}
                                </p>
                                
                                <div className="text-xs text-text-secondary mt-2 grid grid-cols-2 gap-y-1">
                                    <p>Value Props: <span className="font-semibold text-text-primary">{item.insights.valueProps}</span></p>
                                    <p>Pain Points: <span className="font-semibold text-text-primary">{item.insights.painPoints}</span></p>
                                    <p>Solutions: <span className="font-semibold text-text-primary">{item.insights.solutions}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}