import { useState, useEffect, useCallback } from "react";
import { ESP32_URL } from "@/lib/config";

export interface SlotStatus {
  slot1: "free" | "occupied";
  slot2: "free" | "occupied";
  slot3: "free" | "occupied";
}

export function useSlotStatus() {
  const [slots, setSlots] = useState<SlotStatus>({
    slot1: "free",
    slot2: "free",
    slot3: "free",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlotStatus = useCallback(async () => {
    console.log("Attempting to fetch from", ESP32_URL);
    try {
      const response = await fetch(ESP32_URL, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const rawData: any = await response.json();
      console.log("Raw data received", rawData);

      const data: SlotStatus = {
        slot1: (rawData.slot1 || "FREE").toLowerCase() as "free" | "occupied",
        slot2: (rawData.slot2 || "FREE").toLowerCase() as "free" | "occupied",
        slot3: (rawData.slot3 || "FREE").toLowerCase() as "free" | "occupied",
      };

      console.log("Parsed data", data);
      setSlots(data);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Connection error";
      console.log("Fetch failed", errorMsg);
      setError(errorMsg);
      // No simulation fallback - show error instead
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlotStatus();
    const interval = setInterval(fetchSlotStatus, 2000);
    return () => clearInterval(interval);
  }, [fetchSlotStatus]);

  const freeSlots = Object.values(slots).filter((s) => s === "free").length;
  const totalSlots = Object.values(slots).length;

  return { slots, loading, error, freeSlots, totalSlots };
}


