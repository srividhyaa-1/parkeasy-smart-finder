import { ArrowLeft, MapPin, Search } from "lucide-react";
import { Location, parkingAreasByLocation, ParkingArea } from "@/data/parkingData";
import { ParkingCard } from "./ParkingCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ParkingAreasPageProps {
  location: Location;
  onBack: () => void;
  onSelectArea: (area: ParkingArea) => void;
}

export function ParkingAreasPage({
  location,
  onBack,
  onSelectArea,
}: ParkingAreasPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const areas = parkingAreasByLocation[location] || [];
  
  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simulated distance data (in real app, this would come from Google Distance Matrix API)
  // Note: Replace with actual API call using your Google Maps API key
  const getSimulatedDistance = (areaId: string) => {
    const distances: Record<string, { distance: string; duration: string }> = {
      [areas[0]?.id]: { distance: "1.2 km", duration: "4 min" },
      [areas[1]?.id]: { distance: "2.5 km", duration: "8 min" },
      [areas[2]?.id]: { distance: "3.1 km", duration: "12 min" },
    };
    return distances[areaId] || { distance: "2.0 km", duration: "6 min" };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-display font-bold text-primary-foreground">
              Parking Areas
            </h1>
            <div className="flex items-center gap-1.5 text-primary-foreground/80 text-sm">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search parking areas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg bg-primary-foreground text-foreground placeholder:text-muted-foreground border-0 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </header>

      {/* Content */}
      <main className="p-4 sm:p-6">
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredAreas.length} parking area{filteredAreas.length !== 1 ? "s" : ""} found
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAreas.map((area, index) => {
            const distanceData = getSimulatedDistance(area.id);
            return (
              <div
                key={area.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ParkingCard
                  area={area}
                  distance={distanceData.distance}
                  duration={distanceData.duration}
                  onViewSlots={() => onSelectArea(area)}
                />
              </div>
            );
          })}
        </div>

        {filteredAreas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No parking areas found.</p>
          </div>
        )}

        {/* Distance API Info */}
        <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">📍 Distance Calculation</p>
          <p>
            Distance data shown is simulated. To enable real distance calculation, 
            integrate Google Distance Matrix API with your API key.
          </p>
          <code className="block mt-2 p-2 bg-background rounded text-xs overflow-x-auto">
            {/* =====================================================
                IMPORTANT: Replace YOUR_API_KEY with your Google Maps API Key
                ===================================================== */}
            https://maps.googleapis.com/maps/api/distancematrix/json?origins=USER_LAT,USER_LNG&destinations=DEST_LAT,DEST_LNG&key=YOUR_API_KEY
          </code>
        </div>
      </main>
    </div>
  );
}
