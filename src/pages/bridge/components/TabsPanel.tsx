import React, { useEffect, useState } from "react";
import { Box, ToggleButton, Typography, ToggleButtonGroup } from "@mui/material";
import Live from "./Live";
import Integration from "./Integrations";
import Direct from "./Direct";
import { useSearchParams } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TabsPanel = ({ setGenerateBtn }:any) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayMode, setDisplayMode] = useState<string>(searchParams.get('panel') || "Live");
  
  useEffect(() => {
    setGenerateBtn(searchParams.get('panel') || "Live");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDisplayMode = (_event: React.MouseEvent<HTMLElement>, nextValue: string | null): void => {
    if (nextValue !== null) {
      setDisplayMode(nextValue);
      setGenerateBtn(nextValue);
      updateQueryParams(nextValue);
    }
  };

  const updateQueryParams = (tab: string): void => {
    searchParams.set('panel', tab);
    setSearchParams(searchParams);
  };

  return (
    <Box>
      <ToggleButtonGroup
        value={displayMode}
        onChange={handleDisplayMode}
        exclusive
      >
        <ToggleButton value={"Live"} aria-label="list-mode">
          <Typography fontWeight={"bold"}>Live</Typography>
        </ToggleButton>
        <ToggleButton value={"Direct"} aria-label="card-mode">
          <Typography fontWeight={"bold"}>Direct</Typography>
        </ToggleButton>
        <ToggleButton value={"Integration"} aria-label="card-mode">
          <Typography fontWeight={"bold"}>Integration</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
      <Box p={2}>
        {displayMode === "Live" ? (
          <Live />
        ) : displayMode === "Direct" ? (
          <Direct />
        ) : displayMode === "Integration" ? (
          <Integration />
        ) : (
          <div>An issue has occurred</div>
        )}
      </Box>
    </Box>
  );
};

export default TabsPanel;