import { MapPin, Clock, Navigation2, IndianRupee } from "lucide-react";
import { ParkingArea } from "@/data/parkingData";
import { Button } from "@/components/ui/button";

interface ParkingCardProps {
  area: ParkingArea;
  distance?: string;
  duration?: string;
  onViewSlots: () => void;
}

export function ParkingCard({
  area,
  distance,
  duration,
  onViewSlots,
}: ParkingCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in border border-border/50">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg text-card-foreground truncate">
              {area.name}
            </h3>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{area.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-secondary/10 text-secondary px-2.5 py-1 rounded-full text-sm font-medium">
            <IndianRupee className="h-3.5 w-3.5" />
            {area.pricePerSlot}/slot
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{area.operatingHours}</span>
          </div>
          {distance && duration && (
            <div className="flex items-center gap-2 text-sm">
              <Navigation2 className="h-4 w-4 text-accent" />
              <span className="text-accent font-medium">
                {distance} ({duration})
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={onViewSlots}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-11 font-medium transition-all duration-200"
        >
          View Slots
        </Button>
      </div>
    </div>
  );
}
