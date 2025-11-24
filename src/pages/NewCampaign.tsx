import React, { useState, useRef, useEffect, useMemo } from "react";

import { GoogleGenAI } from "@google/genai";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";

import {
  Mic,
  Send,
  Paperclip,
  Target,
  Users,
  TrendingUp,
  Edit,
  CheckCircle,
  Zap,
  Mail,
  Calendar,
  Loader2,
  Plus,
  Database,
  AlertCircle,
  Check,
  Sparkles,
} from "lucide-react";

// --- CONFIGURATION ---

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// --- STATIC DATA ---

const CAMPAIGN_TYPES = [
  {
    title: "Book Meetings",
    description: "Optimize sequence for calendar bookings.",
    icon: Calendar,
  },

  {
    title: "Product Selling",
    description: "Run direct campaigns for product conversion.",
    icon: Zap,
  },

  {
    title: "Goal: 100 leads/Month",
    description: "Consistent lead flow targeting.",
    icon: TrendingUp,
  },

  {
    title: "Goal: 200 Prospects",
    description: "High volume aggressive outreach.",
    icon: TrendingUp,
  },
];

const AVAILABLE_EMAILS = [
  { id: "1", email: "shreenath.py@gmail.com", provider: "Google" },

  { id: "2", email: "sales@infynd.com", provider: "Outlook" },

  { id: "3", email: "outreach@infynd.com", provider: "SMTP" },
];

const DUMMY_LEADS = [
  {
    name: "Sarah Miller",
    email: "sarah@tech.com",
    job: "CTO",
    company: "TechFlow",
  },

  {
    name: "David Chen",
    email: "d.chen@saas.io",
    job: "VP Eng",
    company: "SaaSify",
  },

  {
    name: "Amanda Lo",
    email: "amanda@fin.co",
    job: "Head of IT",
    company: "FinCorp",
  },
];

const MAGIC_PROMPT_TEMPLATE = `I want to launch a campaign targeting [Target Role] in [Industry] for [Location]. My goal is to generate [100] leads/month with the objective of [Booking Meetings]. My website is [Your URL]. Leads are currently stored in [CSV/Salesforce]. Please create a 5-step sequence using Email, Phone & LinkedIn, sending from [Your Email Address].`;

const CAMPAIGN_SCHEMA = {
  type: "object",

  properties: {
    ai_response: { type: "string", description: "Concise 1-2 line response." },

    suggested_actions: { type: "array", items: { type: "string" } },

    icp: {
      type: "object",

      properties: {
        role: { type: "string" },

        industry: { type: "string" },

        location: { type: "string" },

        goal: { type: "string" },

        objective: { type: "string" },
      },
    },

    company: {
      type: "object",

      properties: {
        url: { type: "string" },

        value_prop: { type: "string" },

        pain_points: { type: "string" },
      },
    },

    data_source: {
      type: "object",

      properties: {
        source_type: { type: "string" },

        status: { type: "string" },
      },
    },

    cadence: {
      type: "object",

      properties: {
        channels: { type: "string" },

        steps: { type: "string" },
      },
    },

    mailbox_selection: {
      type: "array",

      items: { type: "string" },

      description: "List of emails user mentioned to use",
    },

    launch_ready: { type: "boolean" },
  },

  required: ["ai_response", "suggested_actions"],
};

export default function CampaignBuilder() {
  const [view, setView] = useState("initial");

  const [chat, setChat] = useState([
    {
      role: "ai",
      text: "Hello! I'm your AI campaign architect. Select a goal or describe your campaign to start.",
    },
  ]);

  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [editor, setEditor] = useState({
    icp: {},

    calculations: { required: 0, uploaded: 0 },

    company: {},

    dataSource: {},

    cadence: {},

    mailbox: { selected: [] },

    launch: { status: "Draft" },
  });

  const [dynamicQuickActions, setDynamicQuickActions] = useState([]);

  const editorRef = useRef(editor);

  const chatEndRef = useRef(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  const calculateNeeds = (goalStr) => {
    const match = String(goalStr).match(/(\d+)/);

    const goal = match ? parseInt(match[1], 10) : 0;

    return Math.ceil(goal / 0.01);
  };

  const processMessage = async (userText) => {
    setIsLoading(true);

    const context = {
      ...editorRef.current,

      mailbox_context: {
        available: AVAILABLE_EMAILS.map((e) => e.email),

        currently_selected: editorRef.current.mailbox.selected,
      },
    };

    const prompt = `

      You are an expert Campaign Architect.

      **Current State:** ${JSON.stringify(context)}



      **STRICT WORKFLOW:**

      1. **ICP:** Required parameters (target job role, location, industry, goal, objective). If anything is missing, ask for it. Calculate required leads internally (Goal / 0.01).

      2. **Company:** Ask URL. **ACTION:** If URL given, GENERATE Value Prop & Pain Points within 1-2 lines.

      3. **Data Source:** Ask for source (CSV/CRM). 

         - If they upload a source, assume "Uploaded" = 1500.

         - COMPARE: If Uploaded < Required (${
           editorRef.current.calculations.required
         }), WARN the user.

         - If Uploaded >= Required, suggest Touchpoints.

      4. **Touchpoints & Cadence:** Suggest channels first, then generate steps.

      5. **Mailbox:** Ask user to select sender accounts.

      6. **Launch:** Only when Mailbox is selected, ask for confirmation.



      **RULES:**

      - Content must be **1-2 lines max**.

      - Always provide 3 relevant 'suggested_actions'.



      **OUTPUT:** JSON Schema only.

    `;

    const chatSession = ai.chats.create({
      model: "gemini-2.5-flash",

      history: [
        { role: "user", parts: [{ text: prompt }] },

        ...chat
          .slice(1)
          .map((m) => ({
            role: m.role === "ai" ? "model" : "user",
            parts: [{ text: m.text }],
          })),
      ],
    });

    try {
      const result = await chatSession.sendMessage({
        message: userText,

        config: {
          responseMimeType: "application/json",
          responseSchema: CAMPAIGN_SCHEMA,
        },
      });

      const response = JSON.parse(result.text.trim());

      handleAiStateUpdate(response, userText);
    } catch (error) {
      console.error(error);

      setChat((prev) => [
        ...prev,
        { role: "ai", text: "System error. Please retry." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiStateUpdate = (response, userText) => {
    const {
      ai_response,
      suggested_actions,
      icp,
      company,
      data_source,
      cadence,
      mailbox_selection,
      launch_ready,
    } = response;

    let nextEditor = { ...editorRef.current };

    let finalResponse = ai_response;

    let nextActions = suggested_actions || [];

    if (icp) {
      nextEditor.icp = { ...nextEditor.icp, ...icp };

      if (icp.goal) {
        const req = calculateNeeds(icp.goal);

        nextEditor.calculations = { ...nextEditor.calculations, required: req };
      }
    }

    if (company) {
      const valProp =
        !company.value_prop || company.value_prop === "string"
          ? `AI-Generated Value Prop for ${company.url || userText}`
          : company.value_prop;

      const painPoints =
        !company.pain_points || company.pain_points === "string"
          ? "Inefficient workflows, Data silos, Low conversion rates"
          : company.pain_points;

      nextEditor.company = {
        ...nextEditor.company,
        ...company,
        value_prop: valProp,
        pain_points: painPoints,
      };
    }

    if (data_source && data_source.source_type) {
      const simulatedUpload = 1500;

      nextEditor.dataSource = {
        ...nextEditor.dataSource,

        ...data_source,

        uploaded: simulatedUpload,

        dummyData: DUMMY_LEADS,
      };

      const req = nextEditor.calculations.required;

      if (
        simulatedUpload < req &&
        !ai_response.toLowerCase().includes("proceed")
      ) {
        finalResponse = `I've processed your source. ⚠️ **Gap Detected:** You need **${req.toLocaleString()}** leads, but this source has **${simulatedUpload.toLocaleString()}**. Enrich data or proceed?`;

        nextActions = ["Enrich Data", "Proceed anyway", "Add another source"];
      }
    }

    if (cadence) nextEditor.cadence = { ...nextEditor.cadence, ...cadence };

    if (mailbox_selection && mailbox_selection.length > 0) {
      const matchedEmails = AVAILABLE_EMAILS.filter((e) =>
        mailbox_selection.some(
          (s) => e.email.includes(s) || s.includes(e.email)
        )
      ).map((e) => e.id);

      const newSelection = [
        ...new Set([...nextEditor.mailbox.selected, ...matchedEmails]),
      ];

      nextEditor.mailbox.selected = newSelection;
    }

    if (launch_ready) {
      nextEditor.launch.status = "Ready";

      finalResponse = "Campaign configured successfully! Ready to launch?";

      nextActions = ["Launch Campaign", "Review Settings"];
    }

    if (nextActions.length === 0) {
      if (!nextEditor.icp.goal)
        nextActions = ["100 leads/month", "Book Meetings", "SaaS in UK"];
      else if (!nextEditor.company.url)
        nextActions = ["infynd.com", "I don't have a site"];
      else if (!nextEditor.dataSource.source_type)
        nextActions = ["Salesforce CRM", "Upload CSV", "HubSpot"];
      else if (!nextEditor.cadence.steps)
        nextActions = ["Generate 5-step sequence", "Email & Phone"];
      else if (!nextEditor.mailbox.selected.length)
        nextActions = ["Select all emails", "shreenath.py@gmail.com"];
      else nextActions = ["Launch Campaign"];
    }

    setEditor(nextEditor);

    setChat((prev) => [...prev, { role: "ai", text: finalResponse }]);

    setDynamicQuickActions(nextActions);
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    if (view === "initial") setView("dual");

    setChat((prev) => [...prev, { role: "user", text: text }]);

    setInput("");

    processMessage(text);
  };

  const fillMagicPrompt = () => {
    setInput(MAGIC_PROMPT_TEMPLATE);

    // Focus text area logic can go here if using a ref
  };

  const toggleMailbox = (id) => {
    setEditor((prev) => {
      const current = prev.mailbox.selected;

      const updated = current.includes(id)
        ? current.filter((i) => i !== id)
        : [...current, id];

      return { ...prev, mailbox: { ...prev.mailbox, selected: updated } };
    });
  };

  const confirmMailboxSelection = () => {
    const selectedEmails = AVAILABLE_EMAILS.filter((e) =>
      editor.mailbox.selected.includes(e.id)
    ).map((e) => e.email);

    if (selectedEmails.length > 0) {
      sendMessage(`I confirm using these emails: ${selectedEmails.join(", ")}`);
    }
  };

  const showICP = !!editor.icp.goal;

  const showCompany = showICP && !!editor.company.url;

  const showData = showCompany && !!editor.dataSource.source_type;

  const showCadence = showData && !!editor.cadence.steps;

  const showMailbox = showCadence;

  const showLaunch = showMailbox && editor.mailbox.selected.length > 0;

  // --- RENDER: INITIAL VIEW ---

  if (view === "initial") {
    return (
      <div className="flex flex-col items-center p-12 bg-white h-[85vh] relative">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-4xl font-bold text-[#23272f] mb-2 text-center">
            Create Your Campaign
          </h1>

          <p className="text-[#6b778c] text-center text-lg mb-6">
            Choose a campaign type or describe what you want to achieve
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full max-w-4xl mb-16">
          {CAMPAIGN_TYPES.map((type) => (
            <Card
              key={type.title}
              className="cursor-pointer shadow-md hover:shadow-lg transition-shadow border border-[#eaeaea] hover:border-[#e63946] group rounded-xl"
              onClick={() => sendMessage(`${type.title} for CTOs in SaaS UK`)}
            >
              <CardHeader className="p-4">
                <div className="h-10 w-10 rounded-full bg-[#f3f4f9] flex items-center justify-center mb-3 group-hover:bg-[#e63946] transition-colors">
                  <type.icon className="h-5 w-5 text-[#e63946] group-hover:text-white" />
                </div>

                <CardTitle className="text-base font-bold text-[#23272f]">
                  {type.title}
                </CardTitle>

                <CardDescription className="text-sm text-[#6b778c]">
                  {type.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* --- FIXED HERO INPUT AREA --- */}

        <div className="w-full max-w-3xl custom-scrollbar-grey relative group mb-20">
          {/* Magic Prompt Button (OUTSIDE Top-Right) */}

          <div className="flex justify-end mb-2">
            <Button
              type="button"
              variant="ghost"
              className="text-xs h-8 gap-2 bg-purple-50 border border-purple-100 text-purple-600 hover:bg-purple-100 hover:text-purple-700 transition-all shadow-sm rounded-full"
              onClick={fillMagicPrompt}
            >
              <Sparkles className="h-3 w-3 fill-purple-600" />
              Use Magic Prompt
            </Button>
          </div>

          {/* Input Box Container */}

          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#e63946] focus-within:border-transparent transition-all overflow-hidden">
            <textarea
              className="w-full min-h-[120px] p-6 pb-16 text-lg text-gray-700 border-none focus:ring-0 resize-none placeholder:text-gray-400 bg-transparent outline-none leading-relaxed"
              placeholder="Describe your campaign goals here..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);

                // Auto-grow

                e.target.style.height = "auto";

                e.target.style.height =
                  Math.min(e.target.scrollHeight, 300) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();

                  sendMessage(input);
                }
              }}
            />

            {/* Bottom Actions Bar (Pinned Inside) */}

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between bg-white/80 backdrop-blur-sm pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>

              <Button
                type="button"
                size="icon"
                className="bg-[#e63946] text-white rounded-full h-10 w-10 hover:bg-red-700 shadow-md transition-transform active:scale-95"
                onClick={() => sendMessage(input)}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Helper text if Magic Prompt is used */}

          {input === MAGIC_PROMPT_TEMPLATE && (
            <p className="text-xs text-purple-600 mt-2 ml-2 animate-pulse font-medium">
              * Pro Tip: Fill in the [bracketed text] with your specific details
              for best results.
            </p>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER: DUAL VIEW ---

  return (
    <div className="flex h-[95vh] w-full bg-white overflow-hidden custom-scrollbar-red-600">
      {/* LEFT: CHAT */}

      <div className="flex-[6] relative flex flex-col items-center bg-white border-r border-[#eaeaea] min-w-[500px] max-w-[60%]">
        <div className="w-full flex items-center gap-2 p-4 border-b border-[#f3f4f9]">
          <div className="h-8 w-8 rounded-full bg-[#e63946] flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>

          <span className="font-semibold text-base text-[#23272f]">
            AI Campaign Assistant
          </span>

          <span className="ml-auto text-xs text-green-600">AI Active</span>
        </div>

        <div className="flex-1 w-full flex flex-col overflow-y-auto px-6 pt-4">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 flex ${
                msg.role === "ai" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`rounded-xl px-4 py-2 max-w-[80%] whitespace-pre-wrap shadow-sm ${
                  msg.role === "ai"
                    ? "bg-[#f6f7fa] text-[#23272f]"
                    : "bg-[#e63946] text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="mb-4 flex justify-start">
              <div className="bg-[#f6f7fa] rounded-xl px-4 py-2 text-[#23272f] flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
              </div>
            </div>
          )}

          {dynamicQuickActions.length > 0 && (
            <div className="flex gap-2 my-2 flex-wrap">
              {dynamicQuickActions.map((action, index) => (
                <button
                  key={index}
                  className="px-4 py-1 rounded-full text-xs font-semibold shadow-sm hover:opacity-80 transition bg-[#e63946] text-white"
                  onClick={() => sendMessage(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* FIXED DUAL VIEW INPUT */}

        <div className="w-full px-6 py-4 border-t border-[#f3f4f9] bg-white">
          <div className="relative">
            <Input
              className="h-12 rounded-full pl-6 pr-32 border-gray-200 bg-gray-50 focus-visible:ring-[#e63946]"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            />

            <div className="absolute right-1 top-1 flex items-center gap-1 h-10">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-400 hover:text-gray-600"
                onClick={() => fileInputRef.current.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-400 hover:text-gray-600"
              >
                <Mic className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                className="bg-[#e63946] text-white rounded-full h-9 w-9 hover:bg-red-700"
                onClick={() => sendMessage(input)}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: VISUAL EDITOR */}

      <div className="flex-[4] px-8 py-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <span className="font-bold text-lg text-[#23272f]">
            Visual Editor
          </span>

          <Button
            className="bg-[#e63946] text-white px-6 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
            disabled={!editor.launch?.status}
          >
            Launch Campaign
          </Button>
        </div>

        <div className="space-y-6">
          {showICP && (
            <Card className="rounded-lg shadow border border-[#eaeaea] bg-white animate-in fade-in slide-in-from-bottom-2">
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#e63946]" />
                  <CardTitle className="text-base font-semibold text-[#23272f]">
                    Ideal Customer Profile
                  </CardTitle>
                </div>

                <Button
                  variant="ghost"
                  className="text-xs px-2 h-7 text-[#e63946]"
                >
                  <Edit className="h-3 w-3 mr-1" /> Edit
                </Button>
              </CardHeader>

              <CardContent className="px-4 pb-4 grid grid-cols-2 gap-4 text-sm text-[#23272f]">
                <div>
                  <span className="font-medium block text-xs text-[#6b778c]">
                    Goal
                  </span>
                  {editor.icp.goal}
                </div>

                <div>
                  <span className="font-medium block text-xs text-[#6b778c]">
                    Role
                  </span>
                  {editor.icp.role}
                </div>

                <div>
                  <span className="font-medium block text-xs text-[#6b778c]">
                    Objective
                  </span>
                  {editor.icp.objective || "Not defined"}
                </div>

                <div>
                  <span className="font-medium block text-xs text-[#6b778c]">
                    Location
                  </span>
                  {editor.icp.location}
                </div>
              </CardContent>
            </Card>
          )}

          {showCompany && (
            <Card className="rounded-lg shadow border border-[#eaeaea] bg-white animate-in fade-in slide-in-from-bottom-2">
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-[#e63946]" />
                  <CardTitle className="text-base font-semibold text-[#23272f]">
                    Company Profile
                  </CardTitle>
                </div>

                <Button
                  variant="ghost"
                  className="text-xs px-2 h-7 text-[#e63946]"
                >
                  <Edit className="h-3 w-3 mr-1" /> Edit
                </Button>
              </CardHeader>

              <CardContent className="px-4 pb-4 space-y-3 text-sm text-[#23272f]">
                <div>
                  <span className="font-medium block text-xs text-[#6b778c]">
                    Website
                  </span>
                  {editor.company.url}
                </div>

                <div>
                  <span className="font-medium block text-xs text-[#6b778c]">
                    Value Proposition
                  </span>
                  {editor.company.value_prop}
                </div>

                <div>
                  <span className="font-medium block text-xs text-[#6b778c]">
                    Pain Points
                  </span>
                  {editor.company.pain_points}
                </div>
              </CardContent>
            </Card>
          )}

          {showData && (
            <Card className="rounded-lg shadow border border-[#eaeaea] bg-white animate-in fade-in slide-in-from-bottom-2">
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-[#e63946]" />
                  <CardTitle className="text-base font-semibold text-[#23272f]">
                    Data Source: {editor.dataSource.source_type}
                  </CardTitle>
                </div>

                <Button
                  variant="ghost"
                  className="text-xs px-2 h-7 text-[#e63946]"
                >
                  <Edit className="h-3 w-3 mr-1" /> Edit
                </Button>
              </CardHeader>

              <CardContent className="px-4 pb-4 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 p-2 bg-gray-50 rounded text-center border">
                    <span className="text-xs text-gray-500 block">
                      Required
                    </span>

                    <span className="text-lg font-bold text-gray-900">
                      {editor.calculations.required?.toLocaleString()}
                    </span>
                  </div>

                  <div
                    className={`flex-1 p-2 rounded text-center border ${
                      editor.dataSource.uploaded < editor.calculations.required
                        ? "bg-red-50 border-red-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <span className="text-xs text-gray-500 block">
                      Uploaded
                    </span>

                    <span
                      className={`text-lg font-bold ${
                        editor.dataSource.uploaded <
                        editor.calculations.required
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {editor.dataSource.uploaded?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Job</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {editor.dataSource.dummyData?.map((lead, i) => (
                        <tr key={i}>
                          <td className="p-2">{lead.name}</td>
                          <td className="p-2">{lead.job}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="p-2 bg-gray-50 border-t text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-7 gap-1"
                    >
                      <Zap className="h-3 w-3" /> Enrich Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {showCadence && (
            <Card className="rounded-lg shadow border border-[#eaeaea] bg-white animate-in fade-in slide-in-from-bottom-2">
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#e63946]" />
                  <CardTitle className="text-base font-semibold text-[#23272f]">
                    Sales Cadence
                  </CardTitle>
                </div>

                <Button
                  variant="ghost"
                  className="text-xs px-2 h-7 text-[#e63946]"
                >
                  <Edit className="h-3 w-3 mr-1" /> Edit
                </Button>
              </CardHeader>

              <CardContent className="px-4 pb-4 space-y-3">
                <div className="flex gap-2">
                  {editor.cadence.channels?.split(",").map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="pl-4 border-l-2 border-gray-100 space-y-2">
                  <p className="text-sm text-gray-800 whitespace-pre-line">
                    {editor.cadence.steps}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {showMailbox && (
            <Card className="rounded-lg shadow border border-[#eaeaea] bg-white animate-in fade-in slide-in-from-bottom-2 border-l-4 border-l-[#e63946]">
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#e63946]" />
                  <CardTitle className="text-base font-semibold text-[#23272f]">
                    Mailbox Setup
                  </CardTitle>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="h-6 text-xs">
                    <Plus className="h-3 w-3 mr-1" /> Add New
                  </Button>

                  <Button
                    size="sm"
                    className="h-7 bg-green-600 hover:bg-green-700 text-white"
                    onClick={confirmMailboxSelection}
                    disabled={editor.mailbox.selected.length === 0}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="px-4 pb-4 space-y-2">
                {AVAILABLE_EMAILS.map((mail) => (
                  <div
                    key={mail.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      editor.mailbox.selected.includes(mail.id)
                        ? "bg-red-50 border-red-200"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={editor.mailbox.selected.includes(mail.id)}
                        onCheckedChange={() => toggleMailbox(mail.id)}
                      />

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {mail.email}
                        </p>
                        <span className="text-xs text-gray-400">
                          {mail.provider}
                        </span>
                      </div>
                    </div>

                    {editor.mailbox.selected.includes(mail.id) && (
                      <CheckCircle className="h-4 w-4 text-[#e63946]" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {!showICP && (
            <div className="text-center py-10 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 text-[#e63946] opacity-75" />

              <p>Start chatting to define your **Ideal Customer Profile**!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
