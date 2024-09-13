import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { ChevronUp, ChevronDown } from "lucide-react"

export const UpDownButton = ({ index, onClick }) => {
  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">

        <div className="flex flex-col">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-8"
                aria-label="move-up"
                name="up"
                onClick={() => onClick(index, 'up')}
              >
                <ChevronUp className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Move Up</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="h-4 w-8"
                aria-label="move-down"
                onClick={() => onClick(index, 'down')}
              >
                <ChevronDown className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Move Down</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}



