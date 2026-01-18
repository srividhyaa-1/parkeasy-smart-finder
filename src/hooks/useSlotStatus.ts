import { useState, useEffect, useCallback } from "react";

export interface SlotStatus {
  slot1: "free" | "occupied";
  slot2: "free" | "occupied";
  slot3: "free" | "occupied";
}

// =====================================================
// IMPORTANT: Replace this URL with your ESP32 IP address
// Example: "http://10.66.99.79/"
// =====================================================
const ESP32_URL = "http://10.66.99.79/";

export function useSlotStatus() {
  const [slots, setSlots] = useState<SlotStatus>({
    slot1: "free",
    slot2: "occupied",
    slot3: "free",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const fetchSlotStatus = useCallback(async () => {
    try {
      const response = await fetch(ESP32_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch slot status");
      }

      const data: SlotStatus = await response.json();
      setSlots(data);
      setError(null);
      setIsUsingMockData(false);
    } catch (err) {
      // Use mock data when ESP32 is not available (for demo purposes)
      const mockData: SlotStatus = {
        slot1: Math.random() > 0.5 ? "free" : "occupied",
        slot2: Math.random() > 0.5 ? "free" : "occupied",
        slot3: Math.random() > 0.5 ? "free" : "occupied",
      };
      setSlots(mockData);
      setIsUsingMockData(true);
      setError("Using demo data - ESP32 not connected");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlotStatus();
    
    // Update every 2 seconds
    const interval = setInterval(fetchSlotStatus, 2000);
    
    return () => clearInterval(interval);
  }, [fetchSlotStatus]);

  const freeSlots = Object.values(slots).filter((s) => s === "free").length;
  const totalSlots = Object.values(slots).length;

  return { slots, loading, error, freeSlots, totalSlots, isUsingMockData };
}
