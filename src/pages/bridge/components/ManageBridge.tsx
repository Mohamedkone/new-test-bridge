/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Box, Button, FormControl, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";

const ManageBridge = ({ live, info, remove }:any) => {
    const [bridgeStatus, setBridgeStatus] = useState<string>("active");
    
    const handleBStatus = (_e: React.MouseEvent<HTMLElement>, newValue: string | null): void => {
        if (newValue !== null) {
            setBridgeStatus(newValue);
        }
    };
    
    return (
        <Box 
            p={1} 
            maxWidth={"300px"}
            display={"flex"}
            flexDirection={"column"}
            gap={2}
        >
            <TextField 
                value={live ? (info as any).alias : (info as any).target}
                disabled
                fullWidth={true}
                label={live ? "Alias" : "Email"}
            />
            <FormControl>
                <ToggleButtonGroup
                    value={bridgeStatus}
                    exclusive
                    onChange={handleBStatus}
                    aria-label="Bridge Status"
                >
                    <ToggleButton color="primary" value="active">Active</ToggleButton>
                    <ToggleButton color="error" value="suspend">Suspend</ToggleButton>
                </ToggleButtonGroup>
            </FormControl>
            <FormControl>
                <Button
                    onClick={() => remove(info.id)}
                    color="error"
                >
                    Remove Permanently
                </Button>
            </FormControl>
        </Box>
    );
};

export default ManageBridge;