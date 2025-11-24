import { useState, useMemo, useEffect } from 'react';

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { 

    Users, Search, Filter, Plus, ArrowUpDown, FileText, Globe, Database, HardDrive, Zap, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,

    ListPlus, Lightbulb, Send, Pencil, MoreHorizontal, Trash2, Phone, Mail, Link, CheckCheck, Upload, Loader2, Check, ExternalLink, X, RotateCw, Cloud

} from "lucide-react"; 



import {

    Table,

    TableBody,

    TableCell,

    TableHead,

    TableHeader,

    TableRow,

} from "@/components/ui/table";

import {

    Dialog,

    DialogContent,

    DialogHeader,

    DialogTitle,

    DialogDescription,

    DialogFooter,

} from "@/components/ui/dialog";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Progress } from "@/components/ui/progress";

import { ScrollArea } from "@/components/ui/scroll-area";



const mockContacts = [

    { id: 1, fullName: "Charles Tenot", firstName: "Charles", lastName: "Tenot", email: "shreenathsubramani28...", company: "lemlist", jobTitle: "Chief Executive Officer", jobDescription: "" },

    { id: 2, fullName: "Jieun Jang", firstName: "Jieun", lastName: "Jang", email: "jieun.jang@hyundai.com", company: "Hyundai Motor...", jobTitle: "Project Manager", jobDescription: "" },

    { id: 3, fullName: "Biswa Singh", firstName: "Biswa", lastName: "Singh", email: "b.singh@hpe.com", company: "Hewlett Packard...", jobTitle: "Principal Cloud Developer", jobDescription: "Architecting, designing..." },

    { id: 4, fullName: "Magdy Masry", firstName: "Magdy", lastName: "Masry", email: "magdy_masry@litebite.co", company: "Lite Bite", jobTitle: "General Accountant", jobDescription: "<p class=\"show-more-l..." },

    { id: 5, fullName: "Nithesh K", firstName: "Nithesh", lastName: "K", email: "No email found", company: "AI Builder", jobTitle: "Software Developer / Agentic AI Builder / GenAI Engineer", jobDescription: "" },

    { id: 6, fullName: "Kaviya Sri", firstName: "Kaviya", lastName: "Sri", email: "kaviyasrimks@gmail.com", company: "", jobTitle: "", jobDescription: "includes designing, codi..." },

    { id: 7, fullName: "Alex Johnson", firstName: "Alex", lastName: "Johnson", email: "alex.j@example.com", company: "Tech Solutions", jobTitle: "Sales Manager", jobDescription: "" },

    { id: 8, fullName: "Maria Lee", firstName: "Maria", lastName: "Lee", email: "maria.l@data.net", company: "Data Corp", jobTitle: "Data Scientist", jobDescription: "" },

    { id: 9, fullName: "Sam Wilson", firstName: "Sam", lastName: "Wilson", email: "sam.w@cloud.org", company: "Cloud Services", jobTitle: "DevOps Engineer", jobDescription: "" },

    { id: 10, fullName: "Tina Roy", firstName: "Tina", lastName: "Roy", email: "tina.r@fintech.io", company: "FinTech Hub", jobTitle: "Product Owner", jobDescription: "" },

    { id: 11, fullName: "Zoe Chen", firstName: "Zoe", lastName: "Chen", email: "zoe.c@media.com", company: "Global Media", jobTitle: "Marketing Specialist", jobDescription: "" },

];



const mockCampaigns = [

    { id: 1, name: "SaaS Cold Outreach Q4" },

    { id: 2, name: "Webinar Follow-up Dec" },

    { id: 3, name: "Partnership Prospecting" },

];



const mockCrmIntegrations = [

    { id: 1, name: "Salesforce", icon: Cloud, isConnected: true },

    { id: 2, name: "HubSpot", icon: Cloud, isConnected: false },

    { id: 3, name: "Pipedrive", icon: Cloud, isConnected: true },

    { id: 4, name: "Zoho CRM", icon: Cloud, isConnected: false },

];



const mockImportData = [

    { key: 1, FullName: "John Doe", Email: "john.d@new.com", JobTitle: "Engineer", isSelected: true },

    { key: 2, FullName: "Jane Smith", Email: "jane.s@new.com", JobTitle: "Designer", isSelected: true },

    { key: 3, FullName: "Peter Jones", Email: "peter.j@new.com", JobTitle: "Manager", isSelected: false },

];



const ContactTableHead = ({ children }) => (

    <div className="flex items-center space-x-1 cursor-pointer hover:text-primary">

        <span>{children}</span>

        <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />

    </div>

);



const renderAvatar = (name) => (

    <div className="flex items-center space-x-3">

        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">

            {name ? name[0] : 'U'}

        </div>

    </div>

);



const generatePageNumbers = (currentPage, totalPages, maxVisiblePages = 5) => {

    if (totalPages <= maxVisiblePages) {

        return Array.from({ length: totalPages }, (_, i) => i + 1);

    }

    const half = Math.floor(maxVisiblePages / 2);

    let start = currentPage - half;

    let end = currentPage + half;

    if (start < 1) { start = 1; end = maxVisiblePages; }

    if (end > totalPages) { end = totalPages; start = totalPages - maxVisiblePages + 1; }

    start = Math.max(1, start);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);

};



const EnrichmentContent = ({ count, onEnrichmentAction }) => (

    <div className="p-2 space-y-1">

        <div className="text-sm font-semibold p-1">Enrich {count} selected contact(s)</div>

        <button 

            onClick={() => onEnrichmentAction("Find phone number")} 

            className="flex items-center w-full space-x-2 cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"

        >

            <Phone className="h-4 w-4 text-blue-500" />

            <span>Find phone number</span>

        </button>

        <button 

            onClick={() => onEnrichmentAction("Find verified email")} 

            className="flex items-center w-full space-x-2 cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"

        >

            <Mail className="h-4 w-4 text-green-500" />

            <span>Find verified email</span>

        </button>

        <button 

            onClick={() => onEnrichmentAction("Find LinkedIn profile and enrich data")} 

            className="flex items-center w-full space-x-2 cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"

        >

            <Link className="h-4 w-4 text-indigo-500" />

            <span>Find LinkedIn profile and enrich data</span>

        </button>

        <button 

            onClick={() => onEnrichmentAction("Verify primary email")} 

            className="flex items-center w-full space-x-2 cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"

        >

            <CheckCheck className="h-4 w-4 text-yellow-500" />

            <span>Verify primary email</span>

        </button>

    </div>

);



const CrmIntegrationCard = ({ name, Icon, isConnected, onConnect, onFetch }) => (

    <Card className="p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow">

        <Icon className="h-10 w-10 text-gray-700 mb-3" />

        <h3 className="font-semibold text-base mb-2">{name}</h3>

        {isConnected ? (

            <Button onClick={onFetch} size="sm" className="w-full bg-green-600 hover:bg-green-700">

                <RotateCw className="h-4 w-4 mr-2" /> Fetch Data

            </Button>

        ) : (

            <Button onClick={onConnect} size="sm" variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">

                <ExternalLink className="h-4 w-4 mr-2" /> Connect

            </Button>

        )}

    </Card>

);



const ImportModalContent = ({ step, onSetStep, onClose }) => {

    const [previewData, setPreviewData] = useState([]);

    const [importing, setImporting] = useState(false);

    const [progress, setProgress] = useState(0);



    const initializePreviewData = () => {

        setPreviewData(mockImportData);

    };



    useEffect(() => {

        if (step === 'preview') {

            initializePreviewData();

        }

    }, [step]); 



    const handleFileUpload = () => {

        console.log("Simulating opening file explorer...");

        setTimeout(() => {

            alert("CSV file uploaded successfully. Proceeding to data preview.");

            onSetStep('preview');

        }, 500);

    };



    const handleSelectRow = (key, checked) => {

        setPreviewData(prev => prev.map(row => 

            row.key === key ? { ...row, isSelected: checked } : row

        ));

    };



    const handleSelectAll = (checked) => {

        setPreviewData(prev => prev.map(row => ({ ...row, isSelected: checked })));

    };



    const handleImportData = () => {

        const selectedCount = previewData.filter(d => d.isSelected).length;

        if (selectedCount === 0) {

            alert("Please select at least one contact to import.");

            return;

        }



        setImporting(true);

        setProgress(0);

        

        const interval = setInterval(() => {

            setProgress(prev => {

                if (prev >= 100) {

                    clearInterval(interval);

                    setImporting(false);

                    alert(`Successfully imported ${selectedCount} contacts!`);

                    onClose();

                    return 100;

                }

                return prev + 20;

            });

        }, 500);

    };



    if (step === 'options') {

        const ImportOptionCard = ({ Icon, title, description, onClick }) => (

            <Card onClick={onClick} className="flex items-center p-4 cursor-pointer hover:shadow-md transition-shadow">

                <Icon className="h-6 w-6 text-red-600 mr-4 flex-shrink-0" />

                <div>

                    <h4 className="font-semibold">{title}</h4>

                    <p className="text-sm text-muted-foreground">{description}</p>

                </div>

                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />

            </Card>

        );



        return (

            <div className="space-y-4">

                <ImportOptionCard

                    Icon={Upload}

                    title="Upload CSV / Excel"

                    description="Manually import contacts from a file."

                    onClick={handleFileUpload}

                />

                <ImportOptionCard

                    Icon={Database}

                    title="CRM Integration"

                    description="Pull contacts directly from your CRM."

                    onClick={() => onSetStep('crm-list')}

                />

                <ImportOptionCard

                    Icon={Globe}

                    title="Website Visitors"

                    description="Import contacts captured from your website."

                    onClick={() => alert("Simulating import from Website Visitors...")}

                />

                <ImportOptionCard

                    Icon={HardDrive}

                    title="Infynd Data"

                    description="Import enriched contacts from your Infynd database."

                    onClick={() => alert("Simulating import from Infynd Data...")}

                />

            </div>

        );

    }



    if (step === 'crm-list') {

        return (

            <div className="space-y-4">

                <Button variant="outline" onClick={() => onSetStep('options')} className="mb-4">

                    <ChevronLeft className="h-4 w-4 mr-2" /> Back to options

                </Button>

                <div className="grid grid-cols-2 gap-4">

                    {mockCrmIntegrations.map(crm => (

                        <CrmIntegrationCard

                            key={crm.id}

                            name={crm.name}

                            Icon={crm.icon}

                            isConnected={crm.isConnected}

                            onConnect={() => alert(`Connecting to ${crm.name}...`)}

                            onFetch={() => onSetStep('preview')}

                        />

                    ))}

                </div>

            </div>

        );

    }



    if (step === 'preview') {

        const allSelected = previewData.length > 0 && previewData.every(d => d.isSelected);

        const selectedCount = previewData.filter(d => d.isSelected).length;

        const columns = previewData.length > 0 ? Object.keys(previewData[0]).filter(k => k !== 'key' && k !== 'isSelected') : [];



        if (importing) {

            return (

                <div className="flex flex-col items-center justify-center p-8">

                    <Loader2 className="h-8 w-8 text-red-600 animate-spin mb-4" />

                    <h3 className="text-lg font-semibold mb-2">Importing {selectedCount} contacts...</h3>

                    <p className="text-sm text-muted-foreground">This may take a moment.</p>

                    <Progress value={progress} className="w-full mt-4 h-2" />

                </div>

            );

        }



        return (

            <div className="space-y-4">

                <div className="flex items-center justify-between">

                    <Button variant="outline" onClick={() => onSetStep('options')}>

                        <ChevronLeft className="h-4 w-4 mr-2" /> Back to Options

                    </Button>

                    <div className="text-sm font-medium">

                        {selectedCount} / {previewData.length} rows selected for import

                    </div>

                </div>



                <ScrollArea className="h-[400px] w-full border rounded-md">

                    <Table>

                        <TableHeader>

                            <TableRow>

                                <TableHead className="w-[30px]">

                                    <Input 

                                        type="checkbox" 

                                        className="h-4 w-4"

                                        checked={allSelected}

                                        onChange={(e) => handleSelectAll(e.target.checked)}

                                    />

                                </TableHead>

                                {columns.map(col => (

                                    <TableHead key={col}><div className="font-semibold">{col}</div></TableHead>

                                ))}

                            </TableRow>

                        </TableHeader>

                        <TableBody>

                            {previewData.map((row) => (

                                <TableRow key={row.key} className={row.isSelected ? 'bg-blue-50/50' : ''}>

                                    <TableCell>

                                        <Input

                                            type="checkbox"

                                            className="h-4 w-4"

                                            checked={row.isSelected}

                                            onChange={(e) => handleSelectRow(row.key, e.target.checked)}

                                        />

                                    </TableCell>

                                    {columns.map(col => (

                                        <TableCell key={col} className="text-sm">{row[col]}</TableCell>

                                    ))}

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

                </ScrollArea>

                

                <DialogFooter className="mt-4">

                    <Button variant="outline" onClick={onClose} disabled={importing}>Cancel</Button>

                    <Button onClick={handleImportData} className="bg-red-600 hover:bg-red-700" disabled={selectedCount === 0 || importing}>

                        <Check className="h-4 w-4 mr-2" /> Import {selectedCount} Contacts

                    </Button>

                </DialogFooter>

            </div>

        );

    }

    

    return null;

};



export default function Contacts() {

    const [contacts] = useState(mockContacts);

    const [selectedContacts, setSelectedContacts] = useState([]);

    

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const [currentImportStep, setCurrentImportStep] = useState('options'); 

    

    const contactsPerPage = 5;

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(contacts.length / contactsPerPage);

    const startIndex = (currentPage - 1) * contactsPerPage;

    const endIndex = startIndex + contactsPerPage;

    const currentContacts = contacts.slice(startIndex, endIndex);



    const goToPage = (pageNumber) => {

        if (pageNumber >= 1 && pageNumber <= totalPages) {

            setCurrentPage(pageNumber);

        }

    };

    const goToFirstPage = () => goToPage(1);

    const goToLastPage = () => goToPage(totalPages);

    const goToNextPage = () => goToPage(currentPage + 1);

    const goToPrevPage = () => goToPage(currentPage - 1);

    const visiblePageNumbers = generatePageNumbers(currentPage, totalPages, 5);



    const isAllOnPageSelected = currentContacts.every(contact => 

        selectedContacts.includes(contact.id)

    );



    const handleSelectAllOnPage = (checked) => {

        const currentPageIds = currentContacts.map(c => c.id);

        if (checked) {

            setSelectedContacts(prev => [...new Set([...prev, ...currentPageIds])]);

        } else {

            setSelectedContacts(prev => prev.filter(id => !currentPageIds.includes(id)));

        }

    };



    const handleSelectContact = (contactId, checked) => {

        if (checked) {

            setSelectedContacts(prev => [...prev, contactId]);

        } else {

            setSelectedContacts(prev => prev.filter(id => id !== contactId));

        }

    };



    const handleEnrichmentAction = (action) => {

        console.log(`Executing enrichment: "${action}" for contacts: ${selectedContacts.join(', ')}`);

        alert(`Successfully initiated "${action}" for ${selectedContacts.length} contacts.`);

    };



    const handleAddToCampaign = (campaignId) => {

        const campaign = mockCampaigns.find(c => c.id === campaignId);

        console.log(`Pushing contacts to campaign: ${campaign?.name}`);

        alert(`Pushed ${selectedContacts.length} contacts to campaign: ${campaign?.name}`);

        setSelectedContacts([]);

    };

    

    const handleCreateCampaign = () => {

        alert("Opening modal to create a new campaign... (Placeholder)");

        setSelectedContacts([]);

    };



    const handleDeleteContacts = () => {

        if (window.confirm(`Are you sure you want to delete ${selectedContacts.length} contacts?`)) {

            console.log(`Deleting contacts: ${selectedContacts.join(', ')}`);

            alert(`Deleted ${selectedContacts.length} contacts. (Placeholder)`);

            setSelectedContacts([]);

        }

    };



    const closeImportModal = () => {

        setIsImportModalOpen(false);

        setCurrentImportStep('options');

    };



    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-text-primary">Contacts</h1>

                    <p className="text-text-secondary mt-1">Manage your contact database</p>

                </div>

                <Button 

                    className="bg-red-600 hover:bg-red-700 text-white"

                    onClick={() => setIsImportModalOpen(true)}

                >

                    <Plus className="mr-2 h-4 w-4" />

                    Import new contacts

                </Button>

            </div>

            

            <Card className="shadow-sm overflow-hidden relative"> 

                {selectedContacts.length > 0 && (

                    <div className="absolute top-0 left-0 right-0 z-10 p-2 bg-white border-b shadow-md flex items-center space-x-2">

                        <span className="text-sm font-medium ml-2">

                            {selectedContacts.length} contact(s) selected

                        </span>



                        <Button variant="outline" size="sm"><ListPlus className="mr-2 h-4 w-4" /> Add to list</Button>



                        <Popover>

                            <PopoverTrigger asChild>

                                <Button variant="outline" size="sm">

                                    <Lightbulb className="mr-2 h-4 w-4" /> Enrichment

                                </Button>

                            </PopoverTrigger>

                            <PopoverContent className="w-64 p-0" align="start">

                                <EnrichmentContent count={selectedContacts.length} onEnrichmentAction={handleEnrichmentAction} />

                            </PopoverContent>

                        </Popover>



                        <DropdownMenu>

                            <DropdownMenuTrigger asChild>

                                <Button variant="outline" size="sm">

                                    <Send className="mr-2 h-4 w-4" /> Add to campaign

                                </Button>

                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56">

                                <DropdownMenuItem onClick={handleCreateCampaign} className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">

                                    <Plus className="mr-2 h-4 w-4" /> Create new campaign

                                </DropdownMenuItem>

                                <hr className="my-1" />

                                <div className="px-2 py-1 text-xs font-medium text-gray-500">Push to existing campaign:</div>

                                {mockCampaigns.map(campaign => (

                                    <DropdownMenuItem key={campaign.id} onClick={() => handleAddToCampaign(campaign.id)} className="cursor-pointer">

                                        {campaign.name}

                                    </DropdownMenuItem>

                                ))}

                            </DropdownMenuContent>

                        </DropdownMenu>



                        <Button variant="outline" size="sm"><Pencil className="mr-2 h-4 w-4" /> Edit field</Button>



                        <DropdownMenu>

                            <DropdownMenuTrigger asChild>

                                <Button variant="outline" size="sm" className="px-3">

                                    <MoreHorizontal className="h-4 w-4" /> More

                                </Button>

                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-40">

                                <DropdownMenuItem onClick={handleDeleteContacts} className="text-red-600 hover:text-red-700 cursor-pointer">

                                    <Trash2 className="mr-2 h-4 w-4" /> Delete

                                </DropdownMenuItem>

                            </DropdownMenuContent>

                        </DropdownMenu>

                    </div>

                )}

                

                <CardContent className="p-0">

                    <div className={`p-4 border-b ${selectedContacts.length > 0 ? 'mt-16' : ''}`}>

                        <div className="flex items-center justify-between space-x-4">

                            <div className="relative flex-grow max-w-sm">

                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                <Input

                                    placeholder="Search name, phone, etc"

                                    className="pl-8 w-full"

                                />

                            </div>



                            <div className="flex items-center space-x-4">

                                <div className="flex items-center text-sm font-medium">

                                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />

                                    All contacts ({contacts.length})

                                </div>

                                

                                <Button variant="outline" size="sm" className="space-x-1">

                                    <Filter className="h-4 w-4" />

                                    <span>Filters</span>

                                    <div className="ml-2 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">0</div>

                                </Button>

                            </div>

                        </div>

                    </div>



                    <div className="overflow-x-auto">

                        <Table>

                            <TableHeader>

                                <TableRow>

                                    <TableHead className="w-[30px]">

                                        <Input 

                                            type="checkbox" 

                                            className="h-4 w-4"

                                            checked={currentContacts.length > 0 && isAllOnPageSelected}

                                            onChange={(e) => handleSelectAllOnPage(e.target.checked)}

                                        />

                                    </TableHead>

                                    <TableHead className="w-[200px]"><ContactTableHead>Full name</ContactTableHead></TableHead>

                                    <TableHead className="w-[120px]"><ContactTableHead>First name</ContactTableHead></TableHead>

                                    <TableHead className="w-[120px]"><ContactTableHead>Last name</ContactTableHead></TableHead>

                                    <TableHead className="w-[250px]"><ContactTableHead>Email</ContactTableHead></TableHead>

                                    <TableHead className="w-[200px]"><ContactTableHead>Company name</ContactTableHead></TableHead>

                                    <TableHead className="w-[250px]"><ContactTableHead>Job title</ContactTableHead></TableHead>

                                    <TableHead className="w-[250px]"><ContactTableHead>Job description</ContactTableHead></TableHead>

                                    <TableHead className="w-[150px] text-right">Campaign list</TableHead>

                                </TableRow>

                            </TableHeader>

                            <TableBody>

                                {currentContacts.map((contact) => (

                                    <TableRow key={contact.id} className={selectedContacts.includes(contact.id) ? 'bg-blue-50/50' : ''}>

                                        <TableCell className="font-medium">

                                            <Input 

                                                type="checkbox" 

                                                className="h-4 w-4"

                                                checked={selectedContacts.includes(contact.id)}

                                                onChange={(e) => handleSelectContact(contact.id, e.target.checked)}

                                            />

                                        </TableCell>

                                        <TableCell>

                                            <div className="flex items-center space-x-2">

                                                {renderAvatar(contact.fullName)}

                                                <span className="font-medium text-text-primary">{contact.fullName}</span>

                                            </div>

                                        </TableCell>

                                        <TableCell>{contact.firstName}</TableCell>

                                        <TableCell>{contact.lastName}</TableCell>

                                        <TableCell className="text-sm text-blue-600 hover:underline cursor-pointer">

                                            {contact.email || <span className="text-gray-500">No email found</span>}

                                        </TableCell>

                                        <TableCell>

                                            <div className="flex items-center space-x-2">

                                                {contact.company && <div className="h-4 w-4 rounded bg-gray-200"></div>}

                                                <span className="text-sm">{contact.company}</span>

                                            </div>

                                        </TableCell>

                                        <TableCell className="text-sm">{contact.jobTitle}</TableCell>

                                        <TableCell className="text-sm text-muted-foreground max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">

                                            {contact.jobDescription || "-"}

                                        </TableCell>

                                        <TableCell className="text-right">

                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">

                                                <Plus className="h-3 w-3 mr-1" />

                                                Add to campaign

                                            </Button>

                                        </TableCell>

                                    </TableRow>

                                ))}

                            </TableBody>

                        </Table>

                    </div>



                    {totalPages > 1 && (

                        <div className="p-4 flex items-center justify-between border-t">

                            <div className="text-sm text-muted-foreground">

                                Showing {startIndex + 1} to {Math.min(endIndex, contacts.length)} of {contacts.length} contacts

                            </div>

                            <div className="flex items-center space-x-1">

                                <Button variant="outline" size="icon" onClick={goToFirstPage} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>

                                <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>

                                {visiblePageNumbers.map((page) => (

                                    <Button key={page} variant={page === currentPage ? "default" : "outline"} size="icon" onClick={() => goToPage(page)} className={page === currentPage ? "bg-red-600 hover:bg-red-700 text-white" : ""}>

                                        {page}

                                    </Button>

                                ))}

                                <Button variant="outline" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>

                                <Button variant="outline" size="icon" onClick={goToLastPage} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>

                            </div>

                        </div>

                    )}

                </CardContent>

            </Card>



            <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>

                <DialogContent className={currentImportStep === 'preview' ? "sm:max-w-4xl" : "sm:max-w-lg"}>

                    <DialogHeader>

                        <DialogTitle>

                            {currentImportStep === 'options' && 'Import New Contacts'}

                            {currentImportStep === 'crm-list' && 'Integrate with CRM'}

                            {currentImportStep === 'preview' && 'Import Data Preview'}

                        </DialogTitle>

                        <DialogDescription>

                            {currentImportStep === 'options' && 'Choose the source from where you want to import contacts.'}

                            {currentImportStep === 'crm-list' && 'Connect or fetch contacts from your integrated CRM platforms.'}

                            {currentImportStep === 'preview' && 'Review the data before adding it to your contact list.'}

                        </DialogDescription>

                    </DialogHeader>

                    

                    <ImportModalContent 

                        step={currentImportStep} 

                        onSetStep={setCurrentImportStep} 

                        onClose={closeImportModal} 

                    />



                    {currentImportStep !== 'preview' && (

                        <DialogFooter>

                            <Button variant="outline" onClick={closeImportModal}>Close</Button>

                        </DialogFooter>

                    )}

                </DialogContent>

            </Dialog>

        </div>

    );

}