import { create } from "zustand";

interface SerialPortState {
  port: SerialPort | null;
  currentWeight: string;
  isConnected: boolean;
  setPort: (port: SerialPort | null) => void;
  setCurrentWeight: (weight: string) => void;
  setIsConnected: (connected: boolean) => void;
}

export const useSerialPortStore = create<SerialPortState>((set) => ({
  port: null,
  currentWeight: "",
  isConnected: false,
  setPort: (port) => set({ port }),
  setCurrentWeight: (weight) => set({ currentWeight: weight }),
  setIsConnected: (connected) => set({ isConnected: connected }),
}));
