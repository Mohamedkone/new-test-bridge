import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from "@mui/material";
import Header from "./components/Header";
import TabsPanel from "./components/TabsPanel";
import Integration from './components/Generate/Integreation';
import LiveBridge from './components/Generate/LiveBridge';
import DirectBridge from './components/Generate/DirectBridge';
import ModalBridge from '../../components/UI/modals/ModalBridge';

const Bridge: React.FC = () => {
    const [modal, setModal] = useState<boolean>(false);
    const [generateBtn, setGenerateBtn] = useState<string | number>(1);
    const [bText, setBText] = useState<string>("");

    const handleClose = (): void => {
        setModal(false);
    };

    const handleSave = (): void => {
        handleClose();
    };
    
    const handleOpen = (): void => {
        setModal(true);
    };
    
    useEffect(() => {
        setBText(`Add ${generateBtn}`);
    }, [generateBtn]);

    return (
        <Container maxWidth="lg">
            <Box 
                display={'flex'} 
                flexDirection={'column'}
                alignItems={'center'}
            >
                <Typography textAlign={'center'}>
                    Create and manage your bridges with other users
                </Typography>
                <Typography variant='caption'>
                    *** Bridges allows you to connect with other users ***
                </Typography>
            </Box>
            <Header handleOpen={handleOpen} bText={bText} />
            <TabsPanel setGenerateBtn={setGenerateBtn} />
            {generateBtn === 'Integration' && <ModalBridge
                open={modal}
                title={"New integration bridge"}
                content={<Integration close={handleClose} />}
                contentType='box'
                key={1}
                btn1={"Cancel"}
                btn2={"Generate"}
                btn1Func={handleClose}
                btn2Func={handleSave}
            />}
            {generateBtn === 'Live' && <ModalBridge
                open={modal}
                title={"Generate a live bridge"}
                content={<LiveBridge close={handleClose} />}
                contentType='box'
                key={1}
                btn1Func={handleClose}
            />}
            {generateBtn === 'Direct' && <ModalBridge
                open={modal}
                title={"Generate a bridge"}
                content={<DirectBridge close={handleClose} />}
                contentType='box'
                key={1}
                btn1={"Cancel"}
                btn2={"Generate"}
                btn1Func={handleClose}
                btn2Func={handleSave}
            />}
        </Container>
    );
};

export default Bridge;