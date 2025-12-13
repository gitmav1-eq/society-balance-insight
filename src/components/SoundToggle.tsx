import { Volume2, VolumeX } from "lucide-react";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SoundToggle = () => {
  const { isEnabled, toggle } = useAmbientSound();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label={isEnabled ? "Mute ambient sounds" : "Enable ambient sounds"}
          >
            {isEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{isEnabled ? "Mute sounds" : "Enable ambient sounds"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SoundToggle;
