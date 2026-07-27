import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  IndianRupee,
  Car,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { ESP32_URL } from "@/lib/config";
import { ParkingArea } from "@/data/parkingData";
import { useSlotStatus, SlotStatus } from "@/hooks/useSlotStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SlotBookingPageProps {
  area: ParkingArea;
  onBack: () => void;
}

interface BookingFormData {
  name: string;
  phone: string;
  slotsToBook: number;
}

interface BookingConfirmation {
  parkingArea: string;
  slotsBooked: number;
  totalPrice: number;
  userName: string;
  userPhone: string;
}

export function SlotBookingPage({ area, onBack }: SlotBookingPageProps) {
  const { slots, loading, freeSlots, totalSlots } =
    useSlotStatus();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    phone: "",
    slotsToBook: 1,
  });
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(
    null
  );

  const toggleSlotSelection = (slotKey: string) => {
    const slotStatus = slots[slotKey as keyof SlotStatus];
    if (slotStatus === "occupied") return;

    setSelectedSlots((prev) =>
      prev.includes(slotKey)
        ? prev.filter((s) => s !== slotKey)
        : [...prev, slotKey]
    );
  };

  const handleBookSlots = () => {
    if (selectedSlots.length > 0) {
      setFormData((prev) => ({ ...prev, slotsToBook: selectedSlots.length }));
      setShowBookingForm(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = selectedSlots.length * area.pricePerSlot;
    setConfirmation({
      parkingArea: area.name,
      slotsBooked: selectedSlots.length,
      totalPrice,
      userName: formData.name,
      userPhone: formData.phone,
    });
    setShowBookingForm(false);
    setSelectedSlots([]);
    setFormData({ name: "", phone: "", slotsToBook: 1 });
  };

  const slotEntries = Object.entries(slots) as [keyof SlotStatus, string][];
  const totalPrice = selectedSlots.length * area.pricePerSlot;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary px-4 py-4 sm:px-6">
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
            <h1 className="text-xl font-display font-bold text-primary-foreground truncate">
              {area.name}
            </h1>
            <div className="flex items-center gap-3 text-primary-foreground/80 text-sm mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{area.address}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 sm:p-6 max-w-2xl mx-auto">
        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-xl p-4 card-shadow border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Clock className="h-4 w-4" />
              <span>Operating Hours</span>
            </div>
            <p className="font-semibold text-card-foreground">
              {area.operatingHours}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 card-shadow border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <IndianRupee className="h-4 w-4" />
              <span>Price per Slot</span>
            </div>
            <p className="font-semibold text-card-foreground">
              ₹{area.pricePerSlot}
            </p>
          </div>
        </div>

        {/* Status Indicator (not shown) */}

        {/* Availability Summary */}
        <div className="bg-card rounded-xl p-5 card-shadow border border-border/50 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">
              Slot Availability
            </h2>
            <div className="flex items-center gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-bold text-success">{freeSlots}</span>
                  <span className="text-muted-foreground">/ {totalSlots}</span>
                  <span className="text-muted-foreground">available</span>
                </div>
              )}
            </div>
          </div>

          {/* Slot Grid */}
          <div className="grid grid-cols-3 gap-3">
            {slotEntries.map(([key, status], index) => {
              const isFree = status === "free";
              const isSelected = selectedSlots.includes(key);
              const slotNumber = index + 1;

              return (
                <button
                  key={key}
                  onClick={() => toggleSlotSelection(key)}
                  disabled={!isFree}
                  className={`
                    relative p-4 rounded-xl transition-all duration-300 border-2
                    ${
                      isFree
                        ? isSelected
                          ? "bg-success/20 border-success"
                          : "bg-success/10 border-success/30 hover:border-success"
                        : "bg-destructive/10 border-destructive/30 cursor-not-allowed"
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`
                        h-12 w-12 rounded-lg flex items-center justify-center
                        ${isFree ? "bg-success" : "bg-destructive"}
                      `}
                    >
                      <Car
                        className={`h-6 w-6 ${
                          isFree
                            ? "text-success-foreground"
                            : "text-destructive-foreground"
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">Slot {slotNumber}</p>
                      <p
                        className={`text-xs ${
                          isFree ? "text-success" : "text-destructive"
                        }`}
                      >
                        {isFree ? "Available" : "Occupied"}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span className="text-muted-foreground">Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Occupied</span>
            </div>
          </div>
        </div>

        {/* Book Button */}
        {selectedSlots.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border animate-slide-in">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {selectedSlots.length} slot
                    {selectedSlots.length > 1 ? "s" : ""} selected
                  </p>
                  <p className="font-bold text-lg">Total: ₹{totalPrice}</p>
                </div>
                <Button
                  onClick={handleBookSlots}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 h-12 font-semibold button-shadow"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ESP32 Info */}
        <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">🔌 ESP32 Integration</p>
          <p>
            Real-time slot status is fetched from ESP32 at 2-second intervals.
          </p>
          <code className="block mt-2 p-2 bg-background rounded text-xs">
            ESP32 URL: {ESP32_URL}
          </code>
        </div>
      </main>

      {/* Booking Form Dialog */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Book Parking Slot</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
                pattern="[0-9]{10}"
                className="h-11"
              />
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Slots Selected</span>
                <span className="font-medium">{selectedSlots.length}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Price per Slot</span>
                <span className="font-medium">₹{area.pricePerSlot}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold text-lg text-secondary">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 font-semibold"
            >
              Confirm Booking
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmation !== null}
        onOpenChange={() => setConfirmation(null)}
      >
        <DialogContent className="bg-card border-border sm:max-w-md">
          <div className="text-center py-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <DialogTitle className="font-display text-2xl mb-2">
              Booking Confirmed!
            </DialogTitle>
            <p className="text-muted-foreground">
              Your parking slot has been reserved
            </p>
          </div>
          {confirmation && (
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Parking Area</span>
                <span className="font-medium text-right max-w-[60%] truncate">
                  {confirmation.parkingArea}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slots Booked</span>
                <span className="font-medium">{confirmation.slotsBooked}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Customer Name</span>
                <span className="font-medium">{confirmation.userName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{confirmation.userPhone}</span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Paid</span>
                  <span className="font-bold text-lg text-success">
                    ₹{confirmation.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          )}
          <Button
            onClick={() => setConfirmation(null)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
