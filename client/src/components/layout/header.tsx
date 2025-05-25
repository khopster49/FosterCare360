import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import swiisLogo from "@/assets/swiis-foster-care-logo.png";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src={swiisLogo} 
            alt="Swiis Foster Care Logo" 
            className="h-12 mr-4" 
          />
          <h1 className="text-2xl font-bold text-[#f26522]">Swiis Foster Care</h1>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="text-primary hover:text-blue-700 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Help</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Need assistance? Contact HRTeam@swiis.com</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}