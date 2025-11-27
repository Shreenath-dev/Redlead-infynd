import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Phone, Clock, Trash2, ListOrdered, Plus, Minus } from 'lucide-react';

// --- Infynd Design System Colors ---
const INFIND_RED = "#E63946"; 
const INFIND_BLUE = "#007AFF"; 

export const CallTaskNode = ({ step, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentDelay, setCurrentDelay] = useState(step.delay);

    const defaultNotes = step.notes || "Confirm eligibility, ask about their current pain points...";
    const title = step.action || "Cold Call";

    const updateDelay = (adjustment) => {
        setCurrentDelay(prev => Math.max(0, prev + adjustment));
    };

    // --- Collapsed/Summary View Renderer ---
    const renderCollapsedView = () => {
        const displayDelay = step.delay;
        const timeDisplay = displayDelay === 0 
            ? 'Start immediately' 
            : `Wait for ${displayDelay} Day${displayDelay > 1 ? 's' : ''}`;
        
        return (
            <div 
                className={`flex flex-col w-full max-w-sm cursor-pointer transition-all duration-200 ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                onClick={() => { if (!isExpanded) handleNodeClick(); }}
            >
                {/* Top Row: Wait Time & Icons */}
                <div className="flex justify-between items-center px-4 pt-3 text-sm font-medium text-gray-700 border-b border-gray-100">
                    <span className="flex items-center gap-1 text-gray-700">
                        <Clock className="h-4 w-4 text-gray-500" /> 
                        {timeDisplay}
                    </span>
                    <div className="flex gap-2">
                        <Edit 
                            className="h-4 w-4 hover:text-gray-700" 
                            style={{color: INFIND_BLUE}}
                            onClick={(e) => {e.stopPropagation(); setIsExpanded(true);}} 
                        />
                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" onClick={(e) => {e.stopPropagation(); onDelete(step);}} />
                    </div>
                </div>

                {/* Main Content Summary (Omitted for brevity) */}
            </div>
        );
    };

    // --- Expanded/Edit View Renderer ---
    const renderExpandedView = () => {
        return (
            <div className="p-4 w-full max-w-lg bg-white shadow-xl rounded-lg border border-gray-200">
                
                {/* ➡️ WAIT TIME EDITOR */}
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Task Creation Delay</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 rounded-r-none text-gray-600 hover:bg-gray-100"
                            onClick={() => updateDelay(-1)}
                            disabled={currentDelay === 0}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <input
                            type="number"
                            value={currentDelay}
                            onChange={(e) => setCurrentDelay(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-12 text-center text-sm font-medium border-x border-gray-300 focus:outline-none"
                            min="0"
                        />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 rounded-l-none text-gray-600 hover:bg-gray-100"
                            onClick={() => updateDelay(1)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-gray-500 px-2">days</span>
                    </div>
                </div>

                {/* Call Notes Editor (Omitted for brevity) */}

                {/* Action Footer */}
                <div className="flex justify-end pt-4">
                    <Button 
                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 mr-2"
                        onClick={() => { setIsExpanded(false); setCurrentDelay(step.delay); }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        style={{backgroundColor: INFIND_RED}}
                        className={`text-white hover:bg-red-700`}
                        onClick={() => { 
                            onEdit({...step, notes: defaultNotes, delay: currentDelay}); 
                            setIsExpanded(false); 
                        }}
                    >
                        Save Task
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex justify-center py-2">
            <Card className="shadow-lg">
                <CardContent className="p-0">
                    {isExpanded ? renderExpandedView() : renderCollapsedView()}
                </CardContent>
            </Card>
        </div>
    );
};