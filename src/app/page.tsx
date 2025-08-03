"use client";

import { BasculeConnectionButton } from "@/components/bascule-connection-button";
import { BasculeWeightInput } from "@/components/bascule-weight-input";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";

interface FormData {
  grossWeight?: string;
}

export default function BasculeTest() {
  const { control, setValue } = useForm<FormData>({});

  return (
    <Grid container spacing={8} sx={{ mt: 20 }}>
      <Grid
        size={{ xs: 12 }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: 180 }}>
          <BasculeConnectionButton basculeType={1} />
        </Box>
        <Box sx={{ width: 400 }}>
          <BasculeWeightInput
            name="grossWeight"
            label="وزن باسکول توزین (kg)*"
            control={control}
            setValue={setValue}
            basculeType={1}
          />
        </Box>
      </Grid>
      <Grid
        size={{ xs: 12 }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: 180 }}>
          <BasculeConnectionButton basculeType={2} />
        </Box>
        <Box sx={{ width: 400 }}>
          <BasculeWeightInput
            name="grossWeight"
            label="وزن باسکول های تونل انجماد (kg)*"
            control={control}
            setValue={setValue}
            basculeType={2}
          />
        </Box>
      </Grid>
      <Grid
        size={{ xs: 12 }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: 180 }}>
          <BasculeConnectionButton basculeType={3} />
        </Box>
        <Box sx={{ width: 400 }}>
          <BasculeWeightInput
            name="grossWeight"
            label="وزن باسکول سکوی بارگیری (kg)*"
            control={control}
            setValue={setValue}
            basculeType={3}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
