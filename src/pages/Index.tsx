import { useState } from "react";
import { WelcomePage } from "@/components/WelcomePage";
import { ParkingAreasPage } from "@/components/ParkingAreasPage";
import { SlotBookingPage } from "@/components/SlotBookingPage";
import { Location, ParkingArea } from "@/data/parkingData";

type Page = "welcome" | "areas" | "slots";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>("welcome");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedArea, setSelectedArea] = useState<ParkingArea | null>(null);

  const handleFindParking = (location: Location) => {
    setSelectedLocation(location);
    setCurrentPage("areas");
  };

  const handleSelectArea = (area: ParkingArea) => {
    setSelectedArea(area);
    setCurrentPage("slots");
  };

  const handleBackToWelcome = () => {
    setCurrentPage("welcome");
    setSelectedLocation(null);
    setSelectedArea(null);
  };

  const handleBackToAreas = () => {
    setCurrentPage("areas");
    setSelectedArea(null);
  };

  return (
    <>
      {currentPage === "welcome" && (
        <WelcomePage onFindParking={handleFindParking} />
      )}
      {currentPage === "areas" && selectedLocation && (
        <ParkingAreasPage
          location={selectedLocation}
          onBack={handleBackToWelcome}
          onSelectArea={handleSelectArea}
        />
      )}
      {currentPage === "slots" && selectedArea && (
        <SlotBookingPage area={selectedArea} onBack={handleBackToAreas} />
      )}
    </>
  );
};

export default Index;
