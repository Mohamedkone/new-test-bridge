/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, ButtonGroup, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useState } from 'react'

function LiveBridge({ close }:any) {
    const storageTypeMap = {
        drive: "api",
        dropbox: "api",
        onedrive: "api",
        vault: "vault",
        s3: "s3",
        aws: "s3",
        gcp: "s3",
        azure: "s3",
    };
    const [alias, setAlias] = useState("");
    const [storage, setStorage] = useState(""); // Default to empty string
    const [storageList] = useState([]);
    const [exp, setExp] = useState(""); // Default to empty string
    const [access, setAccess] = useState(""); // Default to empty string
    const [security, setSecurity] = useState(""); // Default to empty string
    const [, setStorageType] = useState(""); // Default to empty string


    const genLive = () => {
    };

    const handleStorageSelect = (e) =>{
        setStorage(e)
        for(let x of storageList){
            if (x.id === e) setStorageType(()=>x.platform||x.type)
        }
    }
    return (
        <Box
            p={1}
            display="flex"
            flexDirection="column"
            gap={2}
            maxWidth="400px"
        >
            <FormControl fullWidth>
                <TextField
                    label="Alias"
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Storage</InputLabel>
                <Select
                    value={storage}
                    label="Storage"
                    onChange={(e) => handleStorageSelect(e.target.value)}
                >
                    {storageList.length > 0 ? (
                        storageList.map((x, i) => {
                            return(
                            <MenuItem value={x.id} key={i}>
                                {x.alias==='Vault'?`${x.alias} (default)`:x.alias}
                            </MenuItem>
                        )})
                    ) : (
                        <MenuItem value="">No storage available</MenuItem>
                    )}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    value={exp}
                    onChange={(e) => setExp(e.target.value)}
                    placeholder="Expiration date"
                    type="date"
                />
                <FormHelperText>
                    *The Bridge will be deleted on the set day.
                </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Access</InputLabel>
                <Select
                    value={access}
                    label="Access"
                    onChange={(e) => setAccess(e.target.value)}
                >
                    <MenuItem value={1}>Public</MenuItem>
                    <MenuItem value={2}>Private</MenuItem>
                    <MenuItem value={3}>Controlled Access</MenuItem>
                </Select>
                <FormHelperText>
                        *Public: Allows anyone with the link to send you data
                        <br />*Private: Allows any verified users with the link to send you data
                        <br />*Controlled Access: Allows access to only the users you have given access to
                </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Data security level</InputLabel>
                <Select
                    value={security}
                    label="Data security level"
                    onChange={(e) => setSecurity(e.target.value)}
                >
                    <MenuItem value={1}>Gold (simpler, faster, server-side)</MenuItem>
                    <MenuItem value={2}>Diamond (More secure, client-side)</MenuItem>
                </Select>
                <FormHelperText>
                        *Gold: Encrypt your data in transit and on the server using server keys
                        <br />*Diamond: Encrypt your data before it leaves the sender's device using client keys (End-to-End encryption)
                </FormHelperText>
            </FormControl>
            <ButtonGroup fullWidth sx={{ gap: "20px" }}>
                <Button
                    color="error"
                    variant="contained"
                    onClick={close}
                    sx={{
                        color: "#fff",
                        background: "#721",
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={genLive}
                    color="success"
                    sx={{
                        color: "#fff",
                        background: "#061",
                    }}
                >
                    Generate
                </Button>
            </ButtonGroup>
        </Box>
    );
}

export default LiveBridge;
