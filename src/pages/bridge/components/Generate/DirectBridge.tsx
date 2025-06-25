/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useContext, useEffect, useState } from 'react'
import { useTheme } from '@emotion/react'
import { Box, Button, ButtonGroup, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import axios from 'axios'

function DirectBridge({close}:any) {
    const theme = useTheme()
    const [storage, setStorage ] = useState("")
    const [storageList ] = useState("")
    const [target, setTarget ] = useState("")
    const [security, setSecurity ] = useState(1)
    const [exp, setExp ] = useState("")
    const [, setStorageType] = useState(""); // Default to empty string


   

    const genDirect = () => {
       
    }
    const handleStorageSelect = (e: SetStateAction<string>) =>{
        setStorage(e)
        for(let x of storageList){
            if (x.id === e) setStorageType(()=>x.platform)
        }
    }
    return (
        <Box 
            p={1} 
            display={'flex'}
            flexDirection={'column'}
            gap={2}
            maxWidth={'400px'}
        >
            <FormControl fullWidth>
                <TextField 
                    placeholder='Target' 
                    type='email'
                    value={target}
                    onChange={(e)=>setTarget(e.target.value)}
                />
                <FormHelperText>
                    <Typography>
                        *The email of the receiver, this person will also be able to send you files.
                    </Typography>
                </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
                <TextField 
                    placeholder='Expiration data' 
                    type='date'
                    value={exp}
                    onChange={(e)=>setExp(e.target.value)}
                />
                <FormHelperText>
                    <Typography>
                        *The Bridge will be deleted on the set day.
                    </Typography>
                </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Data security level</InputLabel>
                <Select
                    value={security}
                    label="Data security level"
                    onChange={(e)=>setSecurity(e.target.value)}
                >
                    <MenuItem value={1}>Gold (simpler, faster, server side)</MenuItem>
                    <MenuItem value={2}>Diamond (More secure, client side)</MenuItem>
                </Select>
                <FormHelperText>
                    <Typography>
                        *Gold: Encrypt your data in transit and on the server using server keys (make encryption and decryption simpler for sender and receiver)
                    </Typography>
                    <Typography>
                        *Diamond: Encrypt your data before it leaves the senders device using client keys (make encryption and decryption more secure, this End to end encryption)
                    </Typography>
                </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Storage</InputLabel>
                <Select
                    value={storage}
                    label="Storage"
                    onChange={(e) => handleStorageSelect(e.target.value)}
                >
                    {storageList.length > 0 ? (
                        storageList.map((x: { id: string | number | readonly string[] | undefined; alias: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, i: Key | null | undefined) => (
                            <MenuItem value={x.id} key={i}>
                                {x.alias}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem value="">No storage available</MenuItem>
                    )}
                </Select>
                
            </FormControl>
            <ButtonGroup fullWidth sx={{ gap: "20px" }}>
                <Button 
                    color='error' 
                    variant='contained' 
                    onClick={close}
                    sx={{
                        color:"#fff",
                        background: theme.palette.error.dark 
                    }}
                    >
                    Cancel
                </Button>
                <Button 
                    variant='contained' 
                    onClick={genDirect}
                    color='success'
                    sx={{
                        color:"#fff",
                        background: theme.palette.success.dark 
                    }}
                >
                        Generate
                    </Button>
            </ButtonGroup>
        </Box>
    )
}

export default DirectBridge
