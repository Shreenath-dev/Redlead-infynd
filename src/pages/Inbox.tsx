import React, { useState, useMemo } from 'react';
import { 
    Search, Filter, Inbox, Mail, Send, MessageSquare, Tag, Clock, User, Star, FileText,
    Calendar, List, ChevronDown, CornerUpLeft, Plus, Users, LayoutDashboard,
    ThumbsUp as PositiveIcon, ThumbsDown as NegativeIcon, Zap as NeutralIcon, Bell,
    Bold, Italic, Link, List as ListIcon, // Added for Rich Text Editor
    ChevronLeft, ChevronRight // Added for profile collapse toggle
} from "lucide-react";

// --- MOCK COMPONENTS (required for self-contained file) ---

// Mock implementation of shadcn/ui components (Card)
const Card = ({ className, children }) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>{children}</div>
);
const CardHeader = ({ className, children }) => (
    <div className={`p-5 flex flex-col space-y-1.5 ${className}`}>{children}</div>
);
const CardTitle = ({ className, children }) => (
    <h3 className={`text-lg font-semibold tracking-tight text-gray-900 ${className}`}>{children}</h3>
);
const CardContent = ({ className, children }) => (
    <div className={`p-5 pt-0 ${className}`}>{children}</div>
);

// Mock Button component (using red as primary color based on design images)
const Button = ({ variant = 'default', size = 'default', className, children, onClick, disabled }) => {
    let baseStyle = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    let sizeStyle = "h-10 px-4 py-2";

    if (size === 'sm') sizeStyle = "h-9 px-3";
    if (size === 'icon') sizeStyle = "h-10 w-10";

    switch (variant) {
        case 'outline':
            baseStyle += " border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50";
            break;
        case 'ghost':
            baseStyle += " text-gray-600 hover:bg-gray-100";
            break;
        case 'link':
            baseStyle += " text-red-600 underline-offset-4 hover:underline";
            sizeStyle = "h-auto px-0 py-0";
            break;
        case 'default':
        default:
            baseStyle += " bg-red-600 text-white shadow-md hover:bg-red-700";
            break;
    }

    return (
        <button className={`${baseStyle} ${sizeStyle} ${className}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

// --- UTILITY COMPONENTS ---

const SentimentBadge = ({ type }) => {
    let bgColor = "bg-gray-200 text-gray-700";
    let icon = <NeutralIcon className="h-3 w-3 mr-1" />;
    
    if (type === "Positive") {
        bgColor = "bg-green-100 text-green-700";
        icon = <PositiveIcon className="h-3 w-3 mr-1" />;
    } else if (type === "Negative") {
        bgColor = "bg-red-100 text-red-700";
        icon = <NegativeIcon className="h-3 w-3 mr-1" />;
    }
    
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${bgColor}`}>
            {icon}
            {type}
        </span>
    );
};

const FilterDropdown = ({ icon: Icon, label, options }) => (
    <div className="relative flex-grow min-w-0">
        <select 
            className="flex items-center w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white hover:border-red-500 focus:outline-none focus:ring-red-500 focus:border-red-500 pr-8"
            defaultValue={label}
        >
            <option disabled hidden>{label}</option>
            {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
    </div>
);

// --- NEW: RICH TEXT EDITOR COMPONENT ---
const RichTextEditor = () => {
    // Function to apply formatting using execCommand
    const applyFormat = (command, value = null) => {
        document.execCommand(command, false, value);
        // Regain focus on the editable div after applying format
        document.getElementById('reply-input').focus();
    };

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm">
            {/* Toolbar */}
            <div className="flex space-x-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-700 hover:bg-gray-200"
                    onClick={() => applyFormat('bold')}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-700 hover:bg-gray-200"
                    onClick={() => applyFormat('italic')}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-700 hover:bg-gray-200"
                    onClick={() => {
                        const url = prompt("Enter the link URL:");
                        if (url) applyFormat('createLink', url);
                    }}
                    title="Insert Link"
                >
                    <Link className="h-4 w-4" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-700 hover:bg-gray-200"
                    onClick={() => applyFormat('insertUnorderedList')}
                    title="Bulleted List"
                >
                    <ListIcon className="h-4 w-4" />
                </Button>
                {/* Placeholder for font/size dropdowns */}
            </div>
            {/* Input Area */}
            <div
                id="reply-input"
                contentEditable
                className="w-full p-3 min-h-[100px] max-h-[200px] overflow-y-auto text-sm resize-y focus:outline-none focus:ring-1 focus:ring-red-500 rounded-b-lg"
                placeholder="Type your reply or use Primebox AI..."
                // Basic styling for the contentEditable div
                style={{ caretColor: '#ef4444' }} // Custom cursor color
            >
                {/* Initial content can go here, e.g., threadData.replyDraft */}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export default function App() {
    const [selectedMessageId, setSelectedMessageId] = useState(1);
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false); 
    const [isContextOpen, setIsContextOpen] = useState(true); // NEW STATE for profile panel
    
    // Dynamic widths for conversation and context panels
    const contextWidthClass = isContextOpen ? "w-1/4" : "w-12";
    const threadWidthClass = isContextOpen ? "w-3/4" : "w-full";
    const threadBorderStyle = isContextOpen ? "border-r border-gray-100" : "";
    
    // --- STATE FOR FILTERING & SEARCH ---
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSentiment, setActiveSentiment] = useState('All'); 

    // Placeholder Data
    const allMessages = [
        { id: 1, campaign: "Q4 Enterprise Outreach", sender: "Michael Chen", subject: "Re: Quick question about...", sentiment: "Positive", channel: "Email", time: "2m ago" },
        { id: 2, campaign: "Partner Follow-up", sender: "Lisa Wang", subject: "Unsubscribe", sentiment: "Negative", channel: "Email", time: "1h ago" },
        { id: 3, campaign: "Webinar Invite", sender: "David Thompson", subject: "RE: Got your invite", sentiment: "Neutral", channel: "LinkedIn", time: "3h ago" },
        { id: 4, campaign: "Q4 Enterprise Outreach", sender: "Emily Rodriguez", subject: "Looking to book a demo", sentiment: "Positive", channel: "Email", time: "5h ago" },
        { id: 5, campaign: "Partner Follow-up", sender: "Sarah Johnson", subject: "No thank you", sentiment: "Negative", channel: "LinkedIn", time: "1d ago" },
    ];

    const threadData = {
        name: "Michael Chen",
        company: "InnovateTech",
        role: "Sales Director",
        campaign: "Q4 Enterprise Outreach",
        history: [
            { id: 101, type: 'sent', body: 'Hi Michael, hope this email finds you well. Checking if you are available for a chat.', date: 'Nov 17, 2025' },
            { id: 102, type: 'received', body: "HI, I'm interested in learning more about your service. When's a good time to connect?", date: 'Nov 19, 2025' }
        ],
        context: {
            pipelineStage: "Lead - New",
            tags: ["High Value", "Interested"],
            lastActivity: "Email Opened 10m ago",
        }
    };
    
    const dateOptions = ["Last 7 Days", "Last 30 Days", "This Month", "Custom Range"];
    const statusOptions = ["All Replies", "Positive", "Negative", "Neutral", "Unread", "Follow-up Needed"];
    const campaignOptions = ["All Campaigns", "Q4 Enterprise Outreach", "Partner Follow-up", "Webinar Invite"];

    // --- MAIN FILTERING LOGIC ---
    const filteredMessages = useMemo(() => {
        let messages = allMessages;
        const lowerCaseSearch = searchTerm.toLowerCase();

        // 1. Sentiment Filtering (from sidebar)
        if (activeSentiment !== 'All') {
            messages = messages.filter(msg => msg.sentiment === activeSentiment);
        }

        // 2. Search Term Filtering
        if (lowerCaseSearch) {
            messages = messages.filter(msg =>
                msg.sender.toLowerCase().includes(lowerCaseSearch) ||
                msg.subject.toLowerCase().includes(lowerCaseSearch) ||
                msg.campaign.toLowerCase().includes(lowerCaseSearch)
            );
        }

        return messages;
    }, [searchTerm, activeSentiment]);
    
    const positiveCount = allMessages.filter(m => m.sentiment === 'Positive').length;
    const negativeCount = allMessages.filter(m => m.sentiment === 'Negative').length;
    
    const handleSelectMessage = (id) => {
        setSelectedMessageId(id);
    };

    return (
        // Full Page Layout
        <div className="flex w-full h-full min-h-[85vh] bg-white overflow-hidden"> 
            {/* Custom Scrollbar Style */}
            <style jsx="true">{`
                .custom-scrollbar-red::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar-red::-webkit-scrollbar-thumb {
                    background-color: #fca5a5; /* Red-300 */
                    border-radius: 4px;
                }
                .custom-scrollbar-red::-webkit-scrollbar-track {
                    background-color: #fef2f2; /* Red-50 */
                }
            `}</style>
            
            {/* 1. Sidebar / Filters (20%) */}
            <div className="w-1/5 border-r border-gray-200 bg-white p-4 space-y-4 flex flex-col flex-shrink-0">
                
                {/* Add/Create Option Menu */}
                <div className="flex items-center justify-between relative">
                    <h2 className="text-md font-semibold text-gray-900 uppercase"><span className="text-md font-bold text-red-600 uppercase">In</span>box</h2>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-500 hover:bg-gray-100"
                        onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                    >
                        <Plus className="h-5 w-5 text-red-600" />
                    </Button>
                    {isAddMenuOpen && ( 
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20 p-1">
                            <div className="text-sm hover:bg-gray-50 p-2 rounded-md cursor-pointer flex items-center text-gray-700"><Users className="h-4 w-4 mr-2" /> Add New Contact</div>
                            <div className="text-sm hover:bg-gray-50 p-2 rounded-md cursor-pointer flex items-center text-gray-700"><LayoutDashboard className="h-4 w-4 mr-2" /> Create Campaign</div>
                            <div className="text-sm hover:bg-gray-50 p-2 rounded-md cursor-pointer flex items-center text-gray-700"><Bell className="h-4 w-4 mr-2" /> Set Task/Reminder</div>
                        </div>
                    )}
                </div>
                
                {/* Sentiment Filters (Functional) */}
                <div className="space-y-1 text-sm">
                    {/* All Replies */}
                    <div 
                        className={`flex items-center justify-between p-2 rounded-md font-semibold cursor-pointer ${activeSentiment === 'All' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100 text-gray-700'}`}
                        onClick={() => setActiveSentiment('All')}
                    >
                        <span className="flex items-center"><Inbox className="h-4 w-4 mr-2" /> All Replies</span>
                        <span>{allMessages.length}</span>
                    </div>
                    {/* Positive Sentiment */}
                    <div 
                        className={`flex items-center justify-between p-2 rounded-md font-semibold cursor-pointer ${activeSentiment === 'Positive' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100 text-gray-700'}`}
                        onClick={() => setActiveSentiment('Positive')}
                    >
                        <span className="flex items-center"><PositiveIcon className="h-4 w-4 mr-2" /> Positive Sentiment</span>
                        <span>{positiveCount}</span>
                    </div>
                    {/* Negative Sentiment */}
                    <div 
                        className={`flex items-center justify-between p-2 rounded-md font-semibold cursor-pointer ${activeSentiment === 'Negative' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100 text-gray-700'}`}
                        onClick={() => setActiveSentiment('Negative')}
                    >
                        <span className="flex items-center"><NegativeIcon className="h-4 w-4 mr-2" /> Negative Sentiment</span>
                        <span>{negativeCount}</span>
                    </div>
                    
                    {/* Other Static Filters */}
                    <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700">
                        <span className="flex items-center"><Star className="h-4 w-4 mr-2" /> Follow-up Needed</span>
                        <span>5</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700">
                        <span className="flex items-center"><Bell className="h-4 w-4 mr-2" /> Reminders</span>
                        <span>1</span>
                    </div>
                </div>
                
                <div className="space-y-1 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                        Campaigns <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
                    </h3>
                    <div className="p-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer text-gray-700 truncate">Q4 Enterprise Outreach</div>
                    <div className="p-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer text-gray-700 truncate">Partner Follow-up</div>
                </div>
            </div>

            {/* 2. Reply List (30%) - Functional Search & Filters + Custom Scroll */}
            <div className="w-1/4 border-r border-gray-200 bg-white overflow-y-auto custom-scrollbar-red flex-shrink-0">
                
                <div className="p-3 border-b sticky top-0 bg-white z-10 space-y-3">
                    
                    {/* Search Bar and Filter Icon Container */}
                    <div className="flex items-center space-x-2">
                        {/* Search Bar (Tied to searchTerm state) */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search replies..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filter Icon Button (Toggles filter panel) */}
                        <Button
                            variant="outline"
                            size="icon"
                            className={`h-10 w-10 text-gray-500 border-gray-300 hover:bg-gray-100 ${isFilterPanelOpen ? 'bg-red-50 border-red-500 text-red-600' : ''}`}
                            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)} 
                        >
                            <Filter className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Filter Dropdowns (Conditional Display) */}
                    {isFilterPanelOpen && (
                        <div className="flex space-x-2 transition-all duration-300 ease-in-out">
                            <FilterDropdown label="Date Wise" icon={Calendar} options={dateOptions} />
                            <FilterDropdown label="Status" icon={PositiveIcon} options={statusOptions} />
                            <FilterDropdown label="Campaign" icon={List} options={campaignOptions} />
                        </div>
                    )}
                </div>
                
                {/* Message List */}
                {filteredMessages.map((msg) => ( 
                    <div
                        key={msg.id}
                        className={`p-3 border-b cursor-pointer transition duration-150 ease-in-out ${
                            selectedMessageId === msg.id 
                            ? 'bg-gray-50 border-l-4 border-red-600'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleSelectMessage(msg.id)}
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 truncate">{msg.sender}</h4>
                            <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        <p className="text-sm text-gray-700 truncate mt-1">{msg.subject}</p>
                        <div className="mt-2 flex items-center justify-between">
                            <SentimentBadge type={msg.sentiment} />
                            <span className="text-xs text-gray-500 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {msg.campaign}
                            </span>
                        </div>
                    </div>
                ))}

                {/* No Results Message */}
                {filteredMessages.length === 0 && (
                    <div className="p-4 text-center text-gray-500">No replies match your criteria.</div>
                )}
            </div>

            {/* 3. Conversation View & Reply Command Center (50%) */}
            <div className="w-1/2 bg-white flex flex-col flex-grow">
                {/* Conversation Header */}
                <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Thread with {threadData.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="text-gray-700 hover:bg-gray-100 border-gray-300">View Contact</Button>
                        <Button variant="outline" size="sm" className="text-gray-700 hover:bg-gray-100 border-gray-300">Set Reminder</Button>
                    </div>
                </div>

                {/* Conversation Body & Context (Dynamic Widths) */}
                <div className="flex flex-grow overflow-hidden">
                    {/* Conversation Thread (Scrollable) */}
                    <div className={`${threadWidthClass} p-6 overflow-y-auto custom-scrollbar-red transition-all duration-300 ease-in-out ${threadBorderStyle}`}>
                        {threadData.history.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'} mb-4`}>
                                <div className={`max-w-[75%] p-3 rounded-xl shadow-sm ${
                                    msg.type === 'sent' 
                                    ? 'bg-red-50 text-gray-900 rounded-br-none'
                                    : 'bg-white border border-gray-300 text-gray-900 rounded-bl-none'
                                }`}>
                                    <p className="text-sm">{msg.body}</p>
                                    <span className={`block text-xs mt-1 text-gray-500 text-right`}>{msg.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Lead Context Sidebar (w-1/4 or w-12) */}
                    <div className={`transition-all duration-300 ease-in-out ${contextWidthClass} p-4 space-y-4 flex-shrink-0`}>
                        {/* Header of the context panel to handle the collapse button */}
                        <div className="flex items-center justify-between min-h-6">
                            {isContextOpen && <h4 className="font-semibold text-gray-700">Contact Profile</h4>}
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`ml-auto ${isContextOpen ? 'text-gray-500' : 'text-red-600'}`}
                                onClick={() => setIsContextOpen(!isContextOpen)}
                                title={isContextOpen ? "Collapse Profile" : "Expand Profile"}
                            >
                                {isContextOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            </Button>
                        </div>

                        {/* Profile Content (Conditional Rendering) */}
                        {isContextOpen && (
                            <>
                                <div className="shadow-none border border-gray-200 p-3 space-y-2 rounded-lg">
                                    <div className="font-bold text-gray-900 flex items-center"><User className="h-4 w-4 mr-1 text-red-500" /> {threadData.name}</div>
                                    <p className="text-sm text-gray-700">{threadData.role} at **{threadData.company}**</p>
                                    <p className="text-xs text-gray-500 flex items-center"><Clock className="h-3 w-3 mr-1" /> Campaign: {threadData.campaign}</p>
                                </div>
                                
                                <div className="space-y-1 text-sm pt-2 border-t border-gray-100">
                                    <h4 className="font-semibold text-gray-700">Status</h4>
                                    <p className="text-gray-500">Pipeline Stage: <span className="font-medium text-red-600">{threadData.context.pipelineStage}</span></p>
                                    <p className="text-gray-500">Last Activity: <span className="font-medium text-gray-900">{threadData.context.lastActivity}</span></p>
                                </div>

                                <div className="space-y-1 pt-2 border-t border-gray-100">
                                    <h4 className="font-semibold text-gray-700">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {threadData.context.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Reply Command Center (Sticky Bottom) */}
                <div className="p-4 border-t flex-shrink-0">
                    <div className="flex justify-between mb-2">
                        <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 border-gray-300" onClick={() => {}} disabled={false}>
                                    <NeutralIcon className="h-4 w-4 mr-2" /> AI Suggest
                                </Button>
                                <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-100" onClick={() => {}} disabled={false}>
                                    <FileText className="h-4 w-4 mr-2" /> Templates
                                </Button>
                            </div>
                        <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-100">
                            <CornerUpLeft className="h-4 w-4 mr-2" /> Reply
                        </Button>
                    </div>
                    
                    {/* Rich Text Editor is now integrated here */}
                    <RichTextEditor />

                    <div className="flex justify-end mt-2">
                        <Button className="bg-red-600 hover:bg-red-700 text-white">
                            <Send className="h-4 w-4 mr-2" /> Send Reply
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}