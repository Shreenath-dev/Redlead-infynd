import React, { useState, useRef, useEffect, useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";

import { GoogleGenAI } from "@google/genai";

import {
  Mic,
  Send,
  Paperclip,
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
  Check,
  Sparkles,
  ChevronDown,
  X,
  Volume2,
} from "lucide-react";

// ⭐ FIX: Importing the newly created placeholder file

import SequencePage from "./Sequence";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const DESIRED_VOICE_NAME = "Google UK English Female";

// --------------------

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
  { id: "1", email: "shreenath@infynd.com", provider: "Google" },

  { id: "2", email: "sales@infynd.com", provider: "Outlook" },

  { id: "3", email: "outreach@infynd.com", provider: "SMTP" },

  { id: "4", email: "info@infynd.com", provider: "Google" },

  { id: "5", email: "shreenath@n2b.com", provider: "Google" },

  { id: "6", email: "sales@n2b.com", provider: "Outlook" },

  { id: "7", email: "outreach@n2b.com", provider: "SMTP" },

  { id: "8", email: "info@n2b.com", provider: "Google" },

  { id: "9", email: "shreenath@mk360.com", provider: "Google" },

  { id: "10", email: "sales@mk360.com", provider: "Outlook" },

  { id: "11", email: "outreach@mk360.com", provider: "SMTP" },

  { id: "12", email: "info@mk360.com", provider: "Google" },
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

// --- TOKENIZED INPUT CONSTANTS ---

const PROMPT_TOKENS = [
  {
    key: "targetRole",

    placeholder: "[Target Role]",

    label: "Target Role",

    value: null,
  },

  {
    key: "industry",

    placeholder: "[Industry]",

    label: "Industry",

    value: null,
  },

  {
    key: "location",

    placeholder: "[Location]",

    label: "Location",

    value: null,
  },

  { key: "goal", placeholder: "[100 leads/month]", label: "Goal", value: null },

  { key: "url", placeholder: "[Your URL]", label: "Website", value: null },

  {
    key: "dataSource",

    placeholder: "[CSV/Salesforce]",

    label: "Data Source",

    value: null,
  },

  {
    key: "email",

    placeholder: "[Select Emails]",

    label: "Sender Email",

    value: null,
  },
];

const MAGIC_PROMPT_TEMPLATE_V2 = `I want to launch a campaign targeting {targetRole} in {industry} for {location}. My goal is to generate {goal}. My website is {url}. Leads are currently stored in {dataSource}. Please create a 5-step sequence using Email, Phone & LinkedIn, sending from {email}.`;

// --- GEMINI CAMPAIGN PROMPT TEMPLATE (Pulled out for correction logic) ---

const GEMINI_PROMPT_TEMPLATE = `You are an expert Campaign Architect. Your goal is to parse the user's input and generate the JSON response using the following workflow and rules:



**CONTEXT & AMBIGUITY RULES:**

- This is a sales outreach tool. If you see 'SME'/'sme', assume it means 'Subject Matter Expert' job role  understand the context and extract.

- If you see any term that could be a sales metric (e.g., 'leaves', 'lets', 'leeds'), assume the user means **leads** (sales prospects).

- If you see 'in front dot com' or similar phrases, assume the user meant 'infynd.com' (since it is visible in the chat history, assume this company is relevant).

- Normalize industries (e.g., 'health care' -> 'Healthcare', 'financial' -> 'Financial Services').



**STRICT WORKFLOW:**



1. **ICP:** Required parameters (target job role, location, industry, goal). If anything is missing, ask for it. Calculate required leads internally (Goal / 0.01).

  // MANDATORY: If the user provides data for a field in the prompt (e.g., role, industry, goal, location), you MUST return the 'icp' object in the JSON with the extracted data dont repeat the questions that are proviously asked.



2. **Company:** Ask URL. **ACTION:** If URL given, strict rule: GENERATE Value Prop & Pain Points within 1-2 lines.



3. **Data Source:** **DO NOT ASK FOR SOURCE. Assume CSV upload and proceed to step 4 if URL is present.** - Calculate Required leads (Goal / 0.01).

  - Assume Uploaded = 150000.

  - COMPARE: If Uploaded < Required, WARN the user.

  - If Uploaded >= Required, suggest Touchpoints.



4. Touchpoints & Cadence:** ask channels first(provide quick action) with your suggestion based on the icp lead size , company profile, then generate steps with day wise based on the touchpoint, industry and goal.every time personalise email is initial step().



5. **Mailbox:** Ask user to select sender accounts(if user has multiple domain mailid make them as cluster by grouping similar domain and ask which cluster to select and show only that specified mailbox).

    // CRITICAL FIX: The quick action should be a specific instruction like "Select all infynd.com emails" based on the clustered list provided in the context.



6. **Launch:** Only when Mailbox is selected, ask for confirmation.



**RULES:**

- Content must be **1-2 lines max**.

- **CRITICAL: You MUST return 3 'suggested_actions'. These actions MUST be direct, single-click examples of the missing values, not questions.**

  - **CONCATENATION MODE:** If two or more key ICP parameters (Location, Goal) are missing, combine them into single, complete action strings (e.g., "USA and 100 leads/month").

  - **SINGLE MODE:** If only one key ICP parameter is missing, provide 3 simple examples relevant only to that key (e.g., "USA", "UK", "100 leads/month").

  - Prioritize missing ICP fields. Only suggest "Provide company URL" if the ICP is 100% complete.

  -Don't skip touchpoints and cadence step and mailbox step.

  -The quick action should be relavant to the current step.

  -Strictly follow mailbox logic.

  -Dont haulcinate and repeat the questions

**OUTPUT:** JSON Schema only.

`;

// -------------------------------------------------------------------

// --- CAMPAIGN SCHEMA ---

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

      properties: { channels: { type: "string" }, steps: { type: "string" } },
    },

    mailbox_selection: {
      type: "array",

      items: { type: "string" },

      description:
        "List of emails or domains (e.g., 'infynd.com') the user selected/confirmed to use",
    },

    launch_ready: { type: "boolean" },
  },

  required: ["ai_response", "suggested_actions"],
};

// --- MAILBOX PICKER OVERLAY COMPONENT (remains the same) ---

const MailboxPickerOverlay = ({
  isOpen,

  onClose,

  onSave,

  initialSelection,
}) => {
  // initialSelection is an array of email strings

  const [selectedEmails, setSelectedEmails] = useState(initialSelection);

  useEffect(() => {
    setSelectedEmails(initialSelection);
  }, [initialSelection]);

  if (!isOpen) return null;

  const toggleEmail = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleSave = () => {
    onSave(selectedEmails);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
      <Card className="w-full max-w-md bg-white p-6 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5">
        <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
          <CardTitle className="text-xl font-bold">
            Select Sender Mailboxes
          </CardTitle>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-0 space-y-3 max-h-80 overflow-y-auto custom-scrollbar-red-600">
          {AVAILABLE_EMAILS.map((mail) => (
            <div
              key={mail.id}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors

                ${
                  selectedEmails.includes(mail.email)
                    ? "bg-red-50 border-red-200"
                    : "bg-white border-gray-100 hover:bg-gray-50"
                }`}
              onClick={() => toggleEmail(mail.email)}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedEmails.includes(mail.email)}
                  // Read-only click handler to allow div click to function

                  onCheckedChange={() => {}}
                  className="data-[state=checked]:bg-[#e63946] data-[state=checked]:border-[#e63946]" // ⭐ FIX: Correctly applies red styling
                />

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {mail.email}
                  </p>

                  <span className="text-xs text-gray-400">{mail.provider}</span>
                </div>
              </div>

              {selectedEmails.includes(mail.email) && (
                <CheckCircle className="h-4 w-4 text-[#e63946]" />
              )}
            </div>
          ))}
        </CardContent>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700"
            disabled={selectedEmails.length === 0}
          >
            Save Selection ({selectedEmails.length})
          </Button>
        </div>
      </Card>
    </div>
  );
};

// --- CAMPAIGN BUILDER COMPONENT ---

export default function CampaignBuilder() {
  const [appView, setAppView] = useState("builder");

  const [view, setView] = useState("initial");

  const [chat, setChat] = useState([
    {
      role: "ai",

      text: `Hello! I'm your AI Campaign Architect. You can start by describing your goals, e.g., **"I need to target CFOs in Financial Services in the UK to generate 100 meetings this quarter. My website is example.com, leads are in HubSpot."**`,
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

  // console.log("eeeeeeee", editor); // Disabled console.log for cleaner output

  const [dynamicQuickActions, setDynamicQuickActions] = useState([]);

  const editorRef = useRef(editor);

  const chatEndRef = useRef(null);

  const fileInputRef = useRef(null);

  const inputRef = useRef(null);

  const chatRef = useRef(chat); // ⭐ FIX: Create a ref for the chat state

  // --- VOICE STATES & REFS ---

  const [isListening, setIsListening] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);

  // -------------------------

  const [promptTokens, setPromptTokens] = useState(PROMPT_TOKENS);

  const [tokenizedMode, setTokenizedMode] = useState(false);

  const [editingTokenKey, setEditingTokenKey] = useState(PROMPT_TOKENS[0].key);

  const [isMailboxPickerOpen, setIsMailboxPickerOpen] = useState(false);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // ⭐ FIX: Update the chat ref whenever chat state changes

  useEffect(() => {
    chatRef.current = chat;
  }, [chat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  const calculateNeeds = (goalStr) => {
    const match = String(goalStr).match(/(\d+)/);

    const goal = match ? parseInt(match[1], 10) : 0;

    return Math.ceil(goal / 0.01);
  };

  const compileMagicPrompt = (tokens = promptTokens) => {
    let compiled = MAGIC_PROMPT_TEMPLATE_V2;

    tokens.forEach((t) => {
      const value = t.value || t.placeholder;

      compiled = compiled.replace(`{${t.key}}`, value);
    });

    return compiled;
  };

  const areAllTokensFilled = useMemo(() => {
    return promptTokens.every((t) => t.value !== null);
  }, [promptTokens]);

  // ⭐ NEW HELPER: Function to cluster available emails by domain

  const clusterEmailsByDomain = (emails) => {
    // Map domains to a list of emails for that domain

    const domainClusters = emails.reduce((acc, mail) => {
      const domain = mail.email.split("@")[1];

      if (!acc[domain]) {
        acc[domain] = [];
      }

      acc[domain].push(mail.email);

      return acc;
    }, {});

    // Format for the AI

    return Object.entries(domainClusters)
      .map(
        ([domain, emailList], index) =>
          `Domain ${index + 1}: **${domain}** (Emails: ${emailList.join(", ")})`
      )
      .join("\n");
  };

  // --- TTS/STT FUNCTIONS ---

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      setIsSpeaking(false);
    }
  };

  // ⭐ TTS VOICE CHANGE IMPLEMENTED HERE

  const speakAiResponse = (text) => {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech Synthesis not supported in this browser.");

      return;
    }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();

    const desiredVoice = voices.find((v) => v.name === DESIRED_VOICE_NAME);

    if (desiredVoice) {
      utterance.voice = desiredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);

    utterance.onend = () => setIsSpeaking(false);

    utterance.onerror = (event) => {
      console.error("TTS error:", event);

      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // ⭐ STT STABILITY AND ERROR HANDLING FIXES

  const startSpeechToText = () => {
    stopSpeech();

    if (!("webkitSpeechRecognition" in window)) {
      alert(
        "Your browser doesn't support the Web Speech API. Please use Chrome/Edge for this feature."
      );

      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      const recognition = new SpeechRecognition();

      recognition.continuous = false;

      recognition.interimResults = false;

      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);

        setInput("Listening... Speak clearly.");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;

        setInput(transcript);

        setTimeout(() => {
          // CRITICAL: Send the transcribed text and set the voice flag to true

          sendMessage(transcript, transcript, true);
        }, 100);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);

        let errorMessage = "Recognition failed. Please try again.";

        if (event.error === "network") {
          errorMessage =
            "Network/Service error. Please check internet connection or try speaking closer to the mic.";
        } else if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          errorMessage =
            "Mic access blocked or denied. Check browser permissions.";
        } else if (event.error === "no-speech") {
          errorMessage = "No speech detected. Please try again.";
        }

        setInput(errorMessage);

        recognition.stop();
      };

      recognition.onend = () => {
        setIsListening(false);

        if (!isLoading && input === "Listening... Speak clearly.") {
          setInput("");
        }
      };

      recognitionRef.current = recognition;
    }

    if (!isListening) {
      recognitionRef.current.start();
    }
  };

  // -------------------------

  const processMessage = async (userText, isVoiceInput = false) => {
    if (!ai) {
      setChat((prev) => [
        ...prev,

        {
          role: "ai",

          text: "Error: AI client is not initialized. Check configuration.",
        },
      ]);

      setIsLoading(false);

      return;
    }

    setIsLoading(true);

    stopSpeech();

    if (view === "initial") setView("dual");

    // CRITICAL FIX: Construct the full history for the model

    // Map the current chat state to the format required by the Gemini SDK

    const historyForGemini = chatRef.current.map((msg) => ({
      // Gemini roles: 'user' for user, 'model' for AI response

      role: msg.role === "ai" ? "model" : "user",

      parts: [{ text: msg.text }],
    }));

    let systemPrompt = GEMINI_PROMPT_TEMPLATE;

    // ⭐ NEW FIX: Mailbox Clustering Context for Step 5

    const clusteredMailboxes = clusterEmailsByDomain(AVAILABLE_EMAILS);

    const MailboxContext = `

        **CURRENT MAILBOX STATUS (CRITICAL):**

        You have access to the following clustered sender mailboxes. Use the domain names for suggestions in Step 5:

        ${clusteredMailboxes}

        

        **MAILBOX LOGIC:** When the workflow reaches step 5, you MUST suggest quick actions like: 'Select all infynd.com emails', 'Select the n2b.com emails', etc., based on these clusters.

    `;

    systemPrompt = MailboxContext + "\n" + systemPrompt;

    if (isVoiceInput) {
      // STT correction logic remains, but applies to the updated system prompt

      const CorrectionContext = `

            **STT CORRECTION RULES (CRITICAL):**

            1. The following input is from a microphone, which may contain errors. Fix any misspellings, proper nouns, and campaign-specific terms.

            2. If you see 'leaves', 'leafs', 'leeds', or 'lets', assume the sales term 'leads'.

            3. If you see 'in front dot com' or similar phrases, assume the user meant 'infynd.com' (based on available mailboxes).

            4. Normalize industries (e.g., 'health care' -> 'Healthcare', 'financial' -> 'Financial Services').

            5. ONLY use the corrected, clean input when evaluating the core campaign architecture goal below.

            

            **ORIGINAL USER INPUT (to be corrected):** "${userText}"

            

            **INSTRUCTIONS:** First, internally correct the user's input. Then, proceed with the campaign workflow below using the corrected input.

        `;

      systemPrompt = CorrectionContext + `\n` + systemPrompt; // Append the rest of the system prompt
    }

    const chatSession = ai.chats.create({
      model: "gemini-2.5-flash",

      // History now contains ALL previous turns + the system prompt before the first message.

      history: [
        // The system prompt is prepended to the history as a 'user' instruction to set the model's behavior.

        { role: "user", parts: [{ text: systemPrompt }] },

        // All conversation messages follow

        ...historyForGemini,
      ],
    });

    try {
      const result = await chatSession.sendMessage({
        // The last user message is sent via the message parameter for this turn

        message: userText,

        config: {
          responseMimeType: "application/json",

          responseSchema: CAMPAIGN_SCHEMA,
        },
      });

      const response = JSON.parse(result.text.trim());

      handleAiStateUpdate(response, userText, isVoiceInput);
    } catch (error) {
      console.error("Gemini API Error:", error);

      setChat((prev) => [
        ...prev,

        { role: "ai", text: "System error. Please retry." },
      ]);

      if (isListening && recognitionRef.current) recognitionRef.current.stop();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiStateUpdate = (response, userText, isVoiceInput) => {
    const {
      ai_response,

      suggested_actions,

      icp,

      company,

      cadence,

      mailbox_selection,

      launch_ready,
    } = response;

    let nextEditor = { ...editorRef.current };

    let finalResponse = ai_response;

    let nextActions = suggested_actions || [];

    // 1. ICP Update (Smart Merge Logic - FIXES STATE LOSS)

    if (icp) {
      const currentIcp = nextEditor.icp;

      nextEditor.icp = {
        role: icp.role || currentIcp.role || null,

        industry: icp.industry || currentIcp.industry || null,

        location: icp.location || currentIcp.location || null,

        goal: icp.goal || currentIcp.goal || null,
      };

      if (nextEditor.icp.goal) {
        const match = String(nextEditor.icp.goal).match(/(\d+)/);

        const goalValue = match ? parseInt(match[1], 10) : 0;

        const req = Math.ceil(goalValue / 0.01);

        nextEditor.calculations = { ...nextEditor.calculations, required: req };
      }
    }

    // 2. Company/URL Update

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

    // 3. Data Source HARDCODE (Only if ICP and Company URL are set)

    if (
      nextEditor.icp.goal &&
      nextEditor.company.url &&
      !nextEditor.dataSource.source_type
    ) {
      const simulatedUpload = 150000;

      const req = nextEditor.calculations.required;

      nextEditor.dataSource = {
        source_type: "CSV Upload", // Hardcoded source type

        status: "Processed",

        uploaded: simulatedUpload,

        dummyData: DUMMY_LEADS,
      };

      if (
        simulatedUpload < req &&
        !ai_response.toLowerCase().includes("proceed")
      ) {
        finalResponse = `I've processed your CSV. ⚠️ **Gap Detected:** You need **${req.toLocaleString()}** leads, but this source has **${simulatedUpload.toLocaleString()}**. Enrich data or proceed?`;
      } else {
        // If data is sufficient, force prompt to move to next step (Cadence)

        finalResponse =
          finalResponse ||
          `Data uploaded successfully. I recommend a 5-step sequence using Email and LinkedIn.`;
      }
    }

    // 4. Cadence Update

    if (cadence) nextEditor.cadence = { ...nextEditor.cadence, ...cadence };

    // 5. Mailbox Update

    if (mailbox_selection && mailbox_selection.length > 0) {
      // ⭐ CRITICAL FIX: Match the AI's selection strings (emails or domains) against the full AVAILABLE_EMAILS.

      const matchedIds = AVAILABLE_EMAILS.filter((e) =>
        mailbox_selection.some(
          (s) =>
            e.email.toLowerCase().includes(s.toLowerCase()) || // full email or partial match
            s.toLowerCase().includes(e.email.toLowerCase()) ||
            e.email.split("@")[1].toLowerCase() ===
              s.toLowerCase().replace("select all ", "").replace(" emails", "") // Match domain (e.g., 'infynd.com')
        )
      ).map((e) => e.id);

      // Use the matched IDs as the new selection, replacing the current ones if the AI provided a selection.

      nextEditor.mailbox.selected = matchedIds;
    }

    // 6. Launch Update

    if (launch_ready) {
      nextEditor.launch.status = "Ready";

      finalResponse = "Campaign configured successfully!";
    }

    // *** FINAL ACTION LOGIC ***

    if (nextActions.length === 0 && !launch_ready) {
      // Default action if the AI returns no suggestions but still needs info

      nextActions = ["Continue Setup", "Review Settings"];
    }

    // ⭐ EDGE CASE: If the AI returns a 'select' action, ensure it's visually distinct and relevant.

    if (mailbox_selection?.length > 0) {
      nextActions = ["Confirm Selection"];
    }

    setEditor(nextEditor);

    setChat((prev) => [...prev, { role: "ai", text: finalResponse }]);

    // ⭐ CONDITIONAL TTS: Only speak if the input was from the mic

    if (isVoiceInput) {
      speakAiResponse(finalResponse);
    }

    setDynamicQuickActions(nextActions);
  };

  const sendMessage = (text, userTextOverride = text, isVoiceInput = false) => {
    if (!text.trim()) return;

    // ⭐ EDGE CASE FIX: Custom logic for Confirm Selection button

    if (text === "Confirm Selection") {
      const selectedEmails = AVAILABLE_EMAILS.filter((e) =>
        editor.mailbox.selected.includes(e.id)
      ).map((e) => e.email);

      const confirmationText = `I confirm using these emails: ${selectedEmails.join(
        ", "
      )}`;

      // Send the structured confirmation to the AI

      setChat((prev) => [...prev, { role: "user", text: confirmationText }]);

      processMessage(confirmationText, isVoiceInput);

      return;
    }

    if (view === "initial") setView("dual");

    // Add user message to chat state BEFORE processing

    setChat((prev) => [...prev, { role: "user", text: userTextOverride }]);

    if (!isVoiceInput) {
      setInput("");
    }

    // Pass the cleaned text for processing

    processMessage(text, isVoiceInput);
  };

  const fillMagicPrompt = () => {
    setTokenizedMode(true);

    setPromptTokens(PROMPT_TOKENS.map((t) => ({ ...t, value: null })));

    setEditingTokenKey(PROMPT_TOKENS[0].key);

    setInput("");

    inputRef.current?.focus();
  };

  const handleTokenInput = (userText) => {
    // ⭐ EDGE CASE FIX: Prevent advancing if text is empty, unless it's the final step

    if (!userText.trim() && !areAllTokensFilled) return;

    const updatedTokens = promptTokens.map((token) =>
      token.key === editingTokenKey ? { ...token, value: userText } : token
    );

    setPromptTokens(updatedTokens);

    setInput("");

    const currentTokenIndex = PROMPT_TOKENS.findIndex(
      (t) => t.key === editingTokenKey
    );

    const nextToken = updatedTokens.find(
      (t, index) => t.value === null && index > currentTokenIndex
    );

    if (nextToken) {
      setEditingTokenKey(nextToken.key);

      inputRef.current?.focus();
    } else {
      const finalPrompt = compileMagicPrompt(updatedTokens);

      setInput(finalPrompt);

      setTokenizedMode(false);

      setEditingTokenKey(null);

      inputRef.current?.focus();
    }
  };

  const handleMailboxSave = (selectedEmails) => {
    const selectedStr = selectedEmails.join(", ");

    const updatedTokens = promptTokens.map((token) =>
      token.key === "email" ? { ...token, value: selectedStr } : token
    );

    setPromptTokens(updatedTokens);

    setIsMailboxPickerOpen(false);

    // ⭐ FIX: Pass the selected string back to the token input handler

    handleTokenInput(selectedStr);
  };

  const handleChipClick = (tokenKey, tokenValue) => {
    if (tokenKey === "email") {
      const initialEmailToken = promptTokens.find((t) => t.key === "email");

      const initialEmailSelection = initialEmailToken?.value
        ? initialEmailToken.value.split(", ")
        : [];

      setEditingTokenKey(tokenKey);

      setIsMailboxPickerOpen(true);

      return;
    }

    if (tokenizedMode || areAllTokensFilled) {
      setEditingTokenKey(tokenKey);

      setInput(tokenValue || "");

      if (areAllTokensFilled) {
        setTokenizedMode(true);
      }

      inputRef.current?.focus();
    }
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
    // ⭐ Reworked to use the single sendMessage path

    sendMessage("Confirm Selection");
  };

  const showICP = !!editor.icp.goal || !!editor.icp.role; // Check for any ICP detail

  const showCompany = showICP && !!editor.company.url;

  const showData = showCompany && !!editor.dataSource.source_type;

  const showCadence = showData && !!editor.cadence.steps;

  const showMailbox = showCadence;

  const showLaunch = showMailbox && editor.mailbox.selected.length > 0;

  if (appView === "editor" && editor.cadence.steps) {
    return (
      <SequencePage
        initialCadenceSteps={editor.cadence.steps}
        onBack={() => setAppView("builder")}
      />
    );
  }

  if (view === "initial") {
    const focusedToken = promptTokens.find((t) => t.key === editingTokenKey);

    const exampleText =
      focusedToken?.key === "goal"
        ? "(e.g., 50 leads/month)"
        : focusedToken?.key === "url"
        ? "(e.g., infynd.com)"
        : "(e.g., VP Sales)";

    const currentPlaceholder = tokenizedMode
      ? focusedToken?.key === "email"
        ? "Click the chip above to select mailboxes..."
        : `Enter ${focusedToken?.label || "details"} ${exampleText}...`
      : "Target CTOs in US SaaS companies to generate 150 leads/month. My site is example.com.";

    const initialEmailToken = promptTokens.find((t) => t.key === "email");

    const initialEmailSelection = initialEmailToken?.value
      ? initialEmailToken.value.split(", ")
      : [];

    return (
      <div className="flex flex-col items-center p-12 h-[85vh] relative justify-center">
        <MailboxPickerOverlay
          isOpen={isMailboxPickerOpen}
          onClose={() => setIsMailboxPickerOpen(false)}
          onSave={handleMailboxSave}
          initialSelection={initialEmailSelection}
        />
        
        <div
          className="flex flex-col items-center mb-8 max-w-2xl 
                animate-in fade-in slide-in-from-top-10 duration-1000"
        >
          <h2
            className="text-5xl font-bold text-[#e63946] mb-1 text-center tracking-tight 
                   shadow-text-sm leading-snug"
          >
            Hello, <span className="text-gray-800">Shreenath</span>
          </h2>
          
        </div>
        {/* --- MAIN INTERACTION AREA --- */}
        <div className="w-full max-w-4xl custom-scrollbar-grey relative mb-20 group">

          {tokenizedMode && (
            <Card className="w-full p-6 border-2 border-dashed border-purple-300 rounded-2xl shadow-xl mb-4 bg-white">
              <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600" />
                Campaign Blueprint: Fill in the Blanks
              </h3>

              <div className="flex flex-wrap gap-3">
                {promptTokens.map((token) => (
                  <div
                    key={token.key}
                    onClick={() => handleChipClick(token.key, token.value)}
                    className={`

                    flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all duration-200 cursor-pointer 

                    shadow-md 

                    ${
                      token.value
                        ? "bg-blue-600 text-white font-medium hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:border-blue-400"
                    }

                    ${
                      editingTokenKey === token.key
                        ? "ring-4 ring-offset-2 ring-blue-300 shadow-2xl scale-[1.05] z-10"
                        : "z-0"
                    }

                    `}
                  >
                    {/* Placeholder Chip Label */}

                    <span className="font-medium opacity-80">
                      {token.label}:
                    </span>

                    {/* Value Display */}

                    <span className="font-semibold truncate max-w-[200px]">
                      {/* Show first email + count if multiple are selected */}

                      {token.key === "email" && token.value
                        ? token.value.split(", ").length > 1
                          ? `${token.value.split(", ")[0]} +${
                              token.value.split(", ").length - 1
                            }`
                          : token.value
                        : token.value || (
                            <span className="text-gray-400 font-normal">
                              {token.placeholder}
                            </span>
                          )}
                    </span>

                    {/* Dropdown/Check Icon */}

                    {token.key === "email" ? (
                      <ChevronDown
                        className={`h-4 w-4 ${
                          token.value ? "text-white" : "text-gray-500"
                        }`}
                      />
                    ) : token.value ? (
                      <CheckCircle className="h-4 w-4 ml-1 text-green-300" />
                    ) : (
                      <Edit className="h-4 w-4 ml-1 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* --- END CONFIGURATION BOX --- */}

          {/* --- 2. ACTION BOX (INPUT) --- */}

          <div
            className={`relative bg-white w-[100vh] h-[16vh] shadow-2xl rounded-2xl transition-all duration-300

              ${
                tokenizedMode
                  ? "border-2 border-blue-400"
                  : "border-2 border-gray-200 hover:border-gray-400"
              }`}
          >
            <textarea
              ref={inputRef}
              className="w-full min-h-[140px] p-6 pb-20 text-lg text-gray-800 border-none focus:ring-0 resize-none placeholder:text-gray-400 bg-transparent outline-none leading-relaxed rounded-2xl"
              placeholder={currentPlaceholder}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);

                e.target.style.height = "auto";

                e.target.style.height =
                  Math.min(e.target.scrollHeight, 300) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();

                  if (tokenizedMode && !areAllTokensFilled) {
                    if (editingTokenKey === "email") {
                      handleChipClick("email", null);
                    } else {
                      handleTokenInput(input);
                    }
                  } else {
                    sendMessage(input);
                  }
                }
              }}
              disabled={tokenizedMode && editingTokenKey === "email"}
            />

            {/* Bottom Actions Bar (Pinned Inside) - Re-styled for clarity */}

            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between bg-white/80 backdrop-blur-sm pt-2 border-t border-gray-100">
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
                  className="rounded-full h-10 w-10 text-gray-500 hover:text-red-500 hover:bg-red-50"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`rounded-full h-10 w-10 text-gray-500 hover:text-red-500 hover:bg-red-50 ${
                    isListening ? "bg-red-100 text-red-600 animate-pulse" : ""
                  }`}
                  onClick={startSpeechToText}
                  disabled={isLoading || isListening}
                >
                  {isListening ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {/* Send Button */}

              <Button
                type="button"
                size="icon"
                className="bg-[#e63946] text-white rounded-full h-12 w-12 hover:bg-red-700 shadow-xl transition-transform active:scale-95"
                onClick={() => {
                  if (tokenizedMode && !areAllTokensFilled) {
                    if (editingTokenKey === "email") {
                      handleChipClick("email", null);
                    } else {
                      handleTokenInput(input);
                    }
                  } else {
                    sendMessage(input);
                  }
                }}
                style={
                  tokenizedMode && editingTokenKey === "email"
                    ? {
                        backgroundColor: "#2563eb",

                        boxShadow: "0 4px 10px rgba(37, 99, 235, 0.4)",
                      }
                    : {}
                }
              >
                {tokenizedMode && editingTokenKey === "email" ? (
                  <Mail className="h-6 w-6" />
                ) : (
                  <Send className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* --- END ACTION BOX --- */}

          {/* Helper text */}

          {tokenizedMode && !areAllTokensFilled && focusedToken && (
            <p className="text-sm text-blue-600 mt-3 ml-2 animate-pulse font-medium flex items-center gap-2">
              {editingTokenKey === "email" ? (
                <>
                  <Mail className="h-4 w-4" /> Click the **Sender Email** chip
                  or the blue mail icon to select mailboxes.
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" /> Enter the value for **
                  {focusedToken.label}** and press Enter, or click a chip to
                  edit it.
                </>
              )}
            </p>
          )}

          {!tokenizedMode && areAllTokensFilled && (
            <p className="text-sm text-green-600 mt-3 ml-2 font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> **Ready!** Review the compiled
              prompt and click Send to generate your campaign.
            </p>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER: DUAL VIEW ---

  return (
    <div className="flex h-[95vh] w-full bg-white overflow-hidden custom-scrollbar-red-600">
      <div className="flex-[6] relative flex flex-col items-center bg-white border-r border-[#eaeaea] min-w-[500px] max-w-[60%]">
        <div className="w-full flex items-center gap-2 p-4 border-b border-[#f3f4f9]">
          <div className="h-8 w-8 rounded-full bg-[#e63946] flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>

          <span className="font-semibold text-base text-[#23272f]">
            AI Campaign Assistant
          </span>

          {/* TTS Status/Stop Button */}

          {isSpeaking ? (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-xs text-red-600 bg-red-100 hover:bg-red-200"
              onClick={stopSpeech}
            >
              <Volume2 className="h-4 w-4 mr-1 animate-pulse" /> Stop Speaking
            </Button>
          ) : (
            <span className="ml-auto text-xs text-green-600">AI Active</span>
          )}
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

          {/* VITAL FIX: Hide "Thinking..." while loading */}

          {isLoading && (
            <div className="mb-4 flex justify-start">
              <div className="bg-[#f6f7fa] rounded-xl px-4 py-2 text-[#23272f] flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
              </div>
            </div>
          )}

          {/* VITAL FIX: Only show quick actions if the array has content AND the page is not loading */}

          {dynamicQuickActions.length > 0 && !isLoading && (
            <div className="flex gap-2 my-2 flex-wrap">
              {dynamicQuickActions.map((action, index) => (
                <button
                  key={index}
                  // ⭐ EDGE CASE: Style the confirm button differently

                  className={`px-4 py-1 rounded-full text-xs font-semibold shadow-sm hover:opacity-80 transition 

                    ${
                      action === "Confirm Selection"
                        ? "bg-green-600 text-white"
                        : "bg-[#e63946] text-white"
                    }`}
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

              {/* STT Button (Mic) */}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`rounded-full ${
                  isListening
                    ? "text-red-600 bg-red-100 animate-pulse"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={startSpeechToText}
                disabled={isLoading || isListening}
              >
                {isListening ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
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

      <div className="flex-[4] px-8 py-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <span className="font-bold text-lg text-[#23272f]">
            Visual Editor
          </span>

          <Button
            className="bg-[#e63946] text-white px-6 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
            disabled={
              !editor.launch?.status || editor.launch?.status !== "Ready"
            }
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
                    Industry
                  </span>

                  {editor.icp.industry}
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
                  onClick={() => setAppView("editor")}
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
            <Card className="rounded-lg  bg-white animate-in fade-in slide-in-from-bottom-2 border-l-4  ">
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

              <div className="h-[40vh] overflow-auto custom-scrollbar-grey">
                <CardContent className="px-4 pb-4 space-y-2">
                  {AVAILABLE_EMAILS.map((mail) => (
                    <div
                      key={mail.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors

                        ${
                          editor.mailbox.selected.includes(mail.id)
                            ? "bg-red-50 border-red-200"
                            : "bg-white border-gray-100"
                        }`}
                      onClick={() => toggleMailbox(mail.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={editor.mailbox.selected.includes(mail.id)}
                          // onClick removed, using div click handler

                          onCheckedChange={() => toggleMailbox(mail.id)}
                          className="data-[state=checked]:bg-[#e63946] data-[state=checked]:border-[#e63946]"
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
              </div>
            </Card>
          )}

          {!showICP && (
            <div className="text-center py-10 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 text-[#e63946] opacity-75" />

              <p>Start chatting to define your Ideal Customer Profile!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
