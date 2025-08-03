import { useState } from "react";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import {
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { MdOutlineScale } from "react-icons/md";
import { useSerialPortStore } from "../serial-port-store";

interface FormData {
  weight?: string;
  grossWeight?: string;  // add this field
  // add other fields here as needed
}

interface BasculeWeightInputProps {
  name: keyof FormData;
  label: string;
  control: Control<FormData>;
  setValue: UseFormSetValue<FormData>;
  basculeType: 1 | 2 | 3;
}

export const BasculeWeightInput = ({
  name,
  label,
  control,
  setValue,
  basculeType,
}: BasculeWeightInputProps) => {
  console.log("BasculeWeightInput rendered with props:", {
    name,
    label,
    basculeType,
  });
  const { port, isConnected } = useSerialPortStore();
  console.log("Serial port connection status:", { isConnected, port });

  const [lastSubmittedWeight, setLastSubmittedWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log("Component state:", { lastSubmittedWeight, isLoading });

  const parseWeight = (raw: string): string => {
    console.log("Raw weight input:", raw);
    const cleaned = raw.replace(/[^\d.+-]/g, ""); // Remove p, newlines, etc.
    console.log("Cleaned weight string:", cleaned);

    switch (basculeType) {
      case 1:
      case 3: {
        // Match all valid weight patterns like +0000.0 or -012.3 or 12.5
        const matches = [...cleaned.matchAll(/[-+]?\d{1,4}(?:\.\d{1,2})?/g)];
        console.log("Type 1/3 matches:", matches);

        if (matches.length > 0) {
          const last = matches[matches.length - 1][0];
          console.log("Last match:", last);

          // Normalize it: remove leading + and strip unnecessary zeros
          const normalized = last.replace(/^\+/, ""); // remove leading "+"
          const [intPart, decPart = "0"] = normalized.split(".");
          console.log("Normalized parts:", { intPart, decPart });

          const cleanedInt = intPart.replace(/^0+(?=\d)/, "") || "0"; // avoid empty
          const cleanedDec = decPart.replace(/0+$/, "") || "0"; // trim trailing zeros but leave at least 1
          const result = `${cleanedInt}.${cleanedDec}`;
          console.log("Final parsed weight:", result);

          return result;
        }

        console.log("No matches found, returning default 0.0");
        return "0.0"; // fallback if no match
      }

      case 2: {
        console.log("Processing type 2 bascule");
        const match = raw.match(/W:([0-9]*\.?[0-9]+)/);
        if (match) {
          console.log("Found W value:", match[1]);
          return match[1];
        }
        console.log("No W value found for type 2, returning default 0.0");
        return "0.0";
      }

      default:
        console.log("Unknown bascule type, returning cleaned value or 0");
        return cleaned || "0";
    }
  };

  const handleReadWeight = async () => {
    console.log("handleReadWeight triggered");
    if (!port?.readable || !isConnected) {
      console.log("Port not readable or not connected, returning");
      return;
    }

    setIsLoading(true);
    setLastSubmittedWeight("");
    setValue(name, "", { shouldValidate: true });
    console.log("Reset values and set loading state");

    try {
      const reader = port.readable.getReader();
      console.log("Obtained reader");
      try {
        const { value } = await reader.read();
        console.log("Read value from port:", value);
        const textDecoder = new TextDecoder();
        const rawValue = textDecoder.decode(value).trim();
        console.log("Decoded raw value:", rawValue);
        const parsedWeight = parseWeight(rawValue);
        console.log("Parsed weight:", parsedWeight);

        if (parsedWeight) {
          console.log("Setting parsed weight:", parsedWeight);
          setLastSubmittedWeight(parsedWeight);
          setValue(name, parsedWeight, { shouldValidate: true });
        }
      } finally {
        reader.releaseLock();
        console.log("Reader lock released");
      }
    } catch (error) {
      console.error("Error reading weight:", error);
      setLastSubmittedWeight("");
      setValue(name, "", { shouldValidate: true });
    } finally {
      setIsLoading(false);
      console.log("Loading complete");
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        console.log("Controller render with field:", field);
        return (
          <TextField
            {...field}
            disabled
            fullWidth
            size="medium"
            label={label}
            variant="outlined"
            value={isLoading ? "" : lastSubmittedWeight}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 0 }}>
                  <Tooltip
                    title={
                      isConnected
                        ? "خواندن از باسکول"
                        : "ابتدا به باسکول متصل شوید"
                    }
                  >
                    <span>
                      <IconButton
                        edge="end"
                        color={isConnected ? "warning" : "default"}
                        onClick={handleReadWeight}
                        size="small"
                        disabled={!isConnected || isLoading}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <MdOutlineScale size={24} />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "&:hover fieldset": { borderColor: "#085938" },
                "&.Mui-focused fieldset": { borderColor: "#085938" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#085938" },
            }}
          />
        );
      }}
    />
  );
};
