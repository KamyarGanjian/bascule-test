import { Box, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { PiPlugs, PiPlugsConnected } from "react-icons/pi";
import { useSerialPortStore } from "../serial-port-store";

interface ScaleSettings {
  baudRate:
    | 300
    | 600
    | 1200
    | 2400
    | 4800
    | 9600
    | 14400
    | 19200
    | 38400
    | 57600
    | 115200
    | 230400
    | 460800
    | 921600;
  dataBits?: 7 | 8;
  stopBits?: 1 | 2;
  parity?: "none" | "even" | "odd";
  flowControl?: "none" | "hardware";
}

interface BasculeConnectionButtonProps {
  onConnect?: (port: SerialPort | null) => void; // Callback when connection changes
  disabled?: boolean;
  receivedSettings?: ScaleSettings;
  basculeType: 1 | 2 | 3;
}

export const BasculeConnectionButton = ({
  onConnect,
  disabled = false,
  basculeType,
}: BasculeConnectionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { port, setPort, isConnected, setIsConnected } = useSerialPortStore();

  const getScaleSettings = (): ScaleSettings => {
    switch (basculeType) {
      case 1:
        return {
          baudRate: 115200,
          dataBits: 8,
          stopBits: 2,
          parity: "even",
          flowControl: "none",
        };
      case 2:
        return {
          baudRate: 9600,
          dataBits: 8,
          stopBits: 2,
          parity: "even",
          flowControl: "none",
        };
      case 3:
        return {
          baudRate: 9600,
          dataBits: 8,
          stopBits: 1,
          parity: "even",
          flowControl: "none",
        };
      default:
        throw new Error("Invalid bascule type");
    }
  };

  const handleDisconnect = async () => {
    try {
      await port?.close();
      setPort(null);
      setIsConnected(false);
      onConnect?.(null);
      console.log("bascule disconnected");
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  };

  const handleClick = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    try {
      if (isConnected) {
        await handleDisconnect();
      } else {
        const newPort = await navigator.serial.requestPort();
        const settings = getScaleSettings();

        await newPort.open(settings);
        setPort(newPort);
        setIsConnected(true);
        onConnect?.(newPort);
      }
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes jumpAnimation {
          0% { transform: translateY(1px); }
          12.5% { transform: translateY(-2px); }
          25% { transform: translateY(1px); }
          37.5% { transform: translateY(-2px); }
          50% { transform: translateY(0); }
          100% { transform: translateY(0); }
        }
      `}</style>

      <Button
        variant="contained"
        onClick={handleClick}
        disabled={isConnected}
        sx={{ width: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: 16,
          }}
        >
          {isLoading ? (
            <>
              در حال اتصال...
              <CircularProgress size={16} color="inherit" />
            </>
          ) : isConnected ? (
            <>
              متصل به باسکول
              <PiPlugsConnected size={20} />
            </>
          ) : (
            <>
              اتصال به باسکول
              <PiPlugs
                size={20}
                style={{
                  animation: "jumpAnimation 2s ease-in-out infinite",
                }}
              />
            </>
          )}
        </Box>
      </Button>
    </>
  );
};
