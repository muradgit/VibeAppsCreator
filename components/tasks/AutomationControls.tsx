"use client";

import { useProjectStore } from "@/store/project.store";
import { Button } from "@/components/ui/button";
import { Play, Pause, FastForward, Settings2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function AutomationControls() {
    const { automationMode, setAutomationMode, isRunning, startAutomation, pauseAutomation } = useProjectStore();

    return (
        <div className="flex items-center justify-between p-4 bg-slate-900 border-t border-slate-800">
            <div className="flex items-center gap-2">
                <Button 
                    size="sm"
                    className={isRunning ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"}
                    onClick={isRunning ? pauseAutomation : startAutomation}
                >
                    {isRunning ? <><Pause className="mr-2 h-3 w-3" /> Stop</> : <><Play className="mr-2 h-3 w-3" /> Resume</>}
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <FastForward className="h-4 w-4" />
                </Button>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-slate-400">
                        <Settings2 className="mr-2 h-4 w-4" />
                        <span className="capitalize text-xs">{automationMode}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border-slate-800 text-white">
                    <DropdownMenuLabel className="text-[10px] uppercase text-slate-500">Execution Strategy</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem onClick={() => setAutomationMode('manual')} className="text-xs hover:bg-slate-800">Manual (User Directed)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAutomationMode('semi')} className="text-xs hover:bg-slate-800">Semi-Auto (Approval Required)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAutomationMode('full')} className="text-xs hover:bg-slate-800">Full-Auto (Continuous)</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
