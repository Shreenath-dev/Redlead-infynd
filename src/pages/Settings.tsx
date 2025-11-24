import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User, Briefcase, Mail, Cpu, Sliders, Code, Database, Settings as SettingsIcon,
  Phone, Server, Zap, Link, CheckCircle, XCircle, Key, ExternalLink,
  Calendar, Upload
} from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
const supabase = {
  from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { name: 'Akash K', role: 'Marketing Lead' }, error: null }) }) }), update: () => ({ eq: async () => ({ error: null }) }) })
};
const useToast = () => ({ toast: ({ title, description, variant }) => console.log(`Toast: ${title} - ${description}`) });

// --- DUMMY DATA ---
const teamMembers = [
  { name: 'Shreenath', email: 'shreenath@example.com', role: 'Admin' },
  { name: 'Jane Doe', email: 'jane.d@example.com', role: 'SDR' },
];

// --- NAVIGATION ITEMS ---
const navItems = [
    { id: 'profile', label: 'Profile & Account', icon: User },
    { id: 'company', label: 'Company Settings', icon: Briefcase },
    { id: 'mailbox', label: 'Email & Communication', icon: Mail },
    { id: 'ai', label: 'AI Settings', icon: Cpu },
    { id: 'crm', label: 'CRM & Integrations', icon: Sliders },
    { id: 'api', label: 'API & Developer', icon: Code },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'team', label: 'Team & Access Control', icon: SettingsIcon },
];

// --- NAV ITEM COMPONENT ---
const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <div
        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
            isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
        }`}
        onClick={onClick}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </div>
);

// ====================================================================
// --- HELPER COMPONENT (Defined outside main components to prevent ReferenceError) ---
// ====================================================================
const IntegrationItem = ({ icon: Icon, label, status, onAction }) => (
    <div className="flex justify-between items-center p-4 border rounded-lg bg-white">
        <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-gray-600" /> 
            <span className="font-medium text-gray-800">{label}</span>
        </div>
        {status === 'Connect' ? (
            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={onAction}>
                {status}
            </Button>
        ) : (
            <Button size="sm" variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50" onClick={onAction}>
                {status}
            </Button>
        )}
    </div>
);

// ====================================================================
// 1. Profile & Account Settings
// ====================================================================
const ProfileAccountSettings = ({ user, profile, setProfile, handleSave, loading }) => (
    <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Profile & Account Settings</h2>
        
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Personal Profile</h3>
            
            <div className="flex items-center space-x-4">
                <img
                    src="https://via.placeholder.com/64"
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 5MB.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email-address">Email Address</Label>
                    <Input id="email-address" value={user?.email || ''} disabled />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={profile.role || 'Marketing Lead'} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={profile.phone_number || '+1 (555) 123-4567'} onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} />
                </div>
            </div>
        </div>

        <Separator />

        <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Preferences</h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifs">Email Notifications</Label>
                    <Switch id="email-notifs" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="whatsapp-notifs">WhatsApp Notifications</Label>
                    <Switch id="whatsapp-notifs" />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="slack-notifs">Slack Notifications</Label>
                    <Switch id="slack-notifs" defaultChecked />
                </div>
            </div>
        </div>

        <Separator />

        <div className="space-y-4">
            <h3 className="text-lg font-medium">Security</h3>
            <div className="space-y-3">
                <a href="#" className="text-sm text-gray-800 hover:text-red-600 block">
                    Change Password
                </a>
                
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-800">Multi-Factor Authentication (MFA)</span>
                    <Button variant="outline" size="sm">Enable MFA</Button>
                </div>

                <a href="#" className="text-sm text-gray-800 hover:text-red-600 block">
                    View Login Activity/Manage Devices
                </a>
            </div>
        </div>
        
        <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={loading} size="lg" className="bg-gray-800 hover:bg-gray-700 text-white">
                {loading ? 'Saving...' : 'Save Profile'}
            </Button>
        </div>
    </div>
);

// ====================================================================
// 2. Company Settings
// ====================================================================
const CompanySettingsContent = ({ profile, setProfile, handleSave, loading }) => (
    <div className="space-y-8 max-w-4xl">
        <h2 className="text-2xl font-semibold">Company Settings</h2>

        <Card className="shadow-sm">
            <CardContent className="pt-6 space-y-6">
                
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input id="company-name" defaultValue="Infynd AI, Inc." onChange={(e) => setProfile({ ...profile, company_name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company-website">Company Website</Label>
                        <Input id="company-website" defaultValue="https://infynd.ai" onChange={(e) => setProfile({ ...profile, website_url: e.target.value })} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company-address">Company Address</Label>
                    <Input id="company-address" defaultValue="123 AI Lane, San Francisco, CA 94105" onChange={(e) => setProfile({ ...profile, company_address: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" defaultValue="Marketing Technology" onChange={(e) => setProfile({ ...profile, industry: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company-size">Company Size</Label>
                        <Input id="company-size" defaultValue="11-50 employees" onChange={(e) => setProfile({ ...profile, company_size: e.target.value })} />
                    </div>
                </div>

                <div className="space-y-2 pt-4">
                    <h3 className="text-lg font-medium">Brand Assets</h3>
                    <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-colors bg-gray-50">
                        <div className="text-center space-y-1">
                            <Upload className="w-6 h-6 mx-auto text-gray-500" />
                            <p className="text-sm text-gray-600">Upload Logo</p>
                            <p className="text-xs text-gray-400">PNG, JPG up to 2MB. Recommended size: 400x100px.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 pt-4">
                    <h3 className="text-lg font-medium">Timezone</h3>
                    <Input id="timezone" defaultValue="America/New_York" onChange={(e) => setProfile({ ...profile, timezone: e.target.value })} />
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={loading} size="lg" className="bg-gray-800 hover:bg-gray-700 text-white">
                {loading ? 'Saving...' : 'Save Company Settings'}
            </Button>
        </div>
    </div>
);

// ====================================================================
// 3. Email & Communication Settings
// ====================================================================
const EmailCommunicationSettings = () => (
    <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Email & Communication Settings</h2>

        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Deliverability & Warmup</CardTitle>
                <CardDescription>Configure advanced settings to maximize email inbox placement.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                
                <div>
                    <h4 className="font-medium mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        DMARC & DNS Records Status
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                        SPF, DKIM, and DMARC records are crucial for verification.
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                        <div className="p-2 border rounded flex justify-between items-center">
                            SPF: <span className="text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Verified</span>
                        </div>
                        <div className="p-2 border rounded flex justify-between items-center">
                            DKIM: <span className="text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Verified</span>
                        </div>
                        <div className="p-2 border rounded flex justify-between items-center">
                            DMARC: <span className="text-red-600 flex items-center"><XCircle className="w-3 h-3 mr-1" /> Unverified</span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium flex items-center">
                            <Server className="w-4 h-4 text-gray-500 mr-2" />
                            Email Warmup Configuration
                        </h4>
                        <Switch id="warmup-toggle" defaultChecked />
                    </div>
                    <p className="text-sm text-gray-600">
                        Automatically send and reply to emails to maintain a healthy sender reputation.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="max-emails">Max Daily Warmup Emails</Label>
                            <Input id="max-emails" type="number" defaultValue={50} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ramp-up">Daily Increase (%)</Label>
                            <Input id="ramp-up" type="number" defaultValue={10} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Mailbox Setup</CardTitle>
                <CardDescription>Connect your email account to send and receive campaigns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md">
                    <span className="text-sm">Connected Mailbox: **akash.k@example.com**</span>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        Disconnect
                    </Button>
                </div>
                <Button className="bg-red-600 hover:bg-red-700">Connect New Mailbox</Button>
            </CardContent>
        </Card>
    </div>
);

// ====================================================================
// 4. CRM & Integrations Settings
// ====================================================================
const CrmIntegrationsSettings = () => (
    <div className="space-y-8">
        <h2 className="text-2xl font-semibold">CRM & Integrations</h2>

        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">CRM</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <IntegrationItem icon={Sliders} label="HubSpot" status="Disconnect" onAction={() => console.log('Disconnect HubSpot')} />
                <IntegrationItem icon={Sliders} label="Salesforce" status="Disconnect" onAction={() => console.log('Disconnect Salesforce')} />
            </CardContent>
        </Card>

        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <IntegrationItem icon={Calendar} label="Google Calendar" status="Disconnect" onAction={() => console.log('Disconnect Google Calendar')} />
                <IntegrationItem icon={Calendar} label="Calendly" status="Connect" onAction={() => console.log('Connect Calendly')} />
            </CardContent>
        </Card>

        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">LeadSource</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <IntegrationItem icon={Zap} label="Apollo.io" status="Connect" onAction={() => console.log('Connect Apollo.io')} />
                <IntegrationItem icon={Link} label="LinkedIn Sales Navigator" status="Disconnect" onAction={() => console.log('Disconnect LinkedIn')} />
            </CardContent>
        </Card>
    </div>
);

// ====================================================================
// 5. API & Developer Settings
// ====================================================================
const ApiDeveloperSettings = () => {
    const hasApiKey = false;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold">API Overview</h2>
            
            <div className="flex justify-end space-x-2">
                <Button variant="outline" asChild>
                    <a href="link-to-docs" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
                        <span>API Docs</span>
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </Button>
                <Button className="bg-red-600 hover:bg-red-700">
                    Generate
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                        <Key className="w-5 h-5 text-gray-600" />
                        <span>API keys</span>
                        <span className="flex-1"></span> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-500 cursor-pointer"><path d="m18 15-6-6-6 6"/></svg>
                    </CardTitle>
                    <CardDescription>Manage your API keys</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6 border-t mt-4">
                    <div className="flex flex-col items-center justify-center p-10 space-y-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <XCircle className="w-6 h-6 text-gray-400" />
                            <div className="p-2 border border-gray-300 rounded-full bg-white">
                                <div className="w-32 h-4 flex items-center justify-center">
                                    <span className="tracking-[0.3em] text-xl text-gray-600">••••••••••</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-2 bg-gray-200 text-gray-700 text-sm rounded-lg">
                            ⓘ You have no API key
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


const TeamAccessControlSettings = () => (
    <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Team & Access Control</h2>
        
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">Team Members</h3>
                <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold">
                    + Invite Member
                </Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROLE</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {teamMembers.map((member, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span className="font-medium">{member.name}</span>
                                    <br/>
                                    <span className="text-gray-500">{member.email}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button variant="link" className="text-red-600 p-0 h-auto">
                                        Manage
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <Separator /> 
        
        <div className="space-y-4 pt-4"> 
            <h3 className="text-lg font-medium text-gray-700">Approval Workflows</h3>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <Label htmlFor="admin-approval" className="text-sm font-normal text-gray-700 cursor-pointer">
                    Require admin approval before launching campaigns
                </Label>
                <Switch id="admin-approval" defaultChecked={false} /> 
            </div>
        </div>
    </div>
);



export default function Settings() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile'); 
    const [profile, setProfile] = useState({
        name: '',
        company_name: '',
        website_url: '',
        industry: '',
        sending_from_name: '',
        sending_from_email: '',
        reply_to_email: '',
        role: '',
        phone_number: '', 
        company_address: '',
        company_size: '',
        timezone: '',
    });

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (error) throw error;
            if (data) {
                setProfile(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update(profile)
                .eq('id', user?.id);

            if (error) throw error;

            toast({ title: 'Settings saved', description: 'Your changes have been updated successfully.', variant: 'default' });
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileAccountSettings user={user} profile={profile} setProfile={setProfile} handleSave={handleSave} loading={loading} />;
            case 'company':
                return <CompanySettingsContent profile={profile} setProfile={setProfile} handleSave={handleSave} loading={loading} />;
            case 'mailbox':
                return <EmailCommunicationSettings />;
            case 'ai':
                return <div className="space-y-8"><h2 className="text-2xl font-semibold">AI Settings</h2><p className="text-gray-600">Configuration for AI Assistants.</p></div>;
            case 'crm':
                return <CrmIntegrationsSettings />;
            case 'api':
                return <ApiDeveloperSettings />;
            case 'data':
                return <div className="space-y-8"><h2 className="text-2xl font-semibold">Data Management</h2><p className="text-gray-600">Manage data import, export, and retention policies.</p></div>;
            case 'team':
                return <TeamAccessControlSettings />;
            default:
                return <ProfileAccountSettings user={user} profile={profile} setProfile={setProfile} handleSave={handleSave} loading={loading} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
           
            {/* Main Content Area */}
            <div className="flex-1 p-10 space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your account, company, and platform configurations.</p>
                </div>

                {/* Settings Navigation and Content Area */}
                <div className="flex space-x-10">
                    {/* Navigation Sidebar */}
                    <div className="w-64 space-y-1 text-sm pt-4"> 
                        {navItems.map((item) => (
                            <NavItem 
                                key={item.id} 
                                icon={item.icon} 
                                label={item.label} 
                                isActive={activeTab === item.id}
                                onClick={() => setActiveTab(item.id)}
                            />
                        ))}
                    </div>

                    {/* Content Card */}
                    <Card className="flex-1 shadow-sm border border-gray-100 p-6">
                        {renderContent()}
                    </Card>
                </div>
            </div>
        </div>
    );
}