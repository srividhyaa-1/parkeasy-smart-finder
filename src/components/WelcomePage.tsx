import { useState } from "react";
import { MapPin, Car, Navigation, ChevronDown } from "lucide-react";
import { locations, Location } from "@/data/parkingData";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WelcomePageProps {
  onFindParking: (location: Location) => void;
}

export function WelcomePage({ onFindParking }: WelcomePageProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | "">("");

  const handleFindParking = () => {
    if (selectedLocation) {
      onFindParking(selectedLocation as Location);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-primary-foreground">
            Parkeasy
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Icon Animation */}
          <div className="relative flex justify-center">
            <div className="absolute h-24 w-24 rounded-full bg-primary-foreground/10 animate-pulse-ring" />
            <div className="h-24 w-24 rounded-full bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
              <Navigation className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary-foreground">
              Welcome to Parkeasy
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Smart Parking • Real-Time Availability
            </p>
          </div>

          {/* Location Selector */}
          <div className="space-y-4">
            <div className="relative">
              <Select
                value={selectedLocation}
                onValueChange={(value) => setSelectedLocation(value as Location)}
              >
                <SelectTrigger className="w-full h-14 bg-primary-foreground text-foreground rounded-xl border-0 shadow-lg text-base pl-12">
                  <MapPin className="absolute left-4 h-5 w-5 text-muted-foreground" />
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-xl shadow-xl max-h-64 overflow-y-auto z-50">
                  {locations.map((location) => (
                    <SelectItem
                      key={location}
                      value={location}
                      className="py-3 px-4 cursor-pointer hover:bg-muted focus:bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-secondary" />
                        <span>{location}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Find Parking Button */}
            <Button
              onClick={handleFindParking}
              disabled={!selectedLocation}
              className="w-full h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl text-lg font-semibold button-shadow transition-all duration-300 disabled:opacity-50"
            >
              Find Parking
              <ChevronDown className="ml-2 h-5 w-5 rotate-[-90deg]" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            {[
              { icon: "🅿️", label: "Easy Booking" },
              { icon: "📍", label: "Live Tracking" },
              { icon: "💳", label: "Quick Payment" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="text-center p-3 rounded-lg bg-primary-foreground/10 backdrop-blur-sm"
              >
                <div className="text-2xl mb-1">{feature.icon}</div>
                <div className="text-xs text-primary-foreground/80">
                  {feature.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-primary-foreground/60 text-sm">
        © 2024 Parkeasy. Smart Parking Solutions.
      </footer>
    </div>
  );
}
