/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import { CancelRounded, Check, CheckCircle } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ModalClose1Btn from "../../../components/UI/modals/ModalClose1Btn";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IconScript } from "@tabler/icons-react";
import ModalClose2Btn from "../../../components/UI/modals/ModalClose2btn";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ManageBridge = ({ codeString }:any) => {
  const [copied, setCopied] = useState<boolean>(false);
  
  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  return (
    <Box
      sx={{
        bgcolor: "#172338",
        color: "#c5c5c5",
        p: 2,
        borderRadius: 2,
        fontFamily: "monospace",
        position: "relative",
        width: "100%",
        maxHeight: "500px",
        overflowX: "auto",
      }}
    >
      <Tooltip title="Copy to Clipboard" placement="top">
        {copied ? (
          <Box
            display={"flex"}
            alignItems={"center"}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#fff",
            }}
          >
            <Check />
            <Typography>Copied</Typography>
          </Box>
        ) : (
          <Button
            onClick={copyToClipboard}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#fff",
            }}
            startIcon={<ContentCopyIcon />}
          >
            Copy
          </Button>
        )}
      </Tooltip>
      <Box component="pre" sx={{ whiteSpace: "pre-wrap" }}>
        <SyntaxHighlighter language="javascript" style={dracula}>
          {codeString}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
};

const Integration: React.FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [bridges] = useState(null);
  const [chosenOne, setChosenOne] = useState<string | null>(null);
  const [, setChosenDel] = useState<string | null>(null);
  const [popTitle, setPopTitle] = useState<string>("");


  const handleClose = (): void => {
    setModal(false);
    setChosenOne(null);
  };
  
  const handleDelClose = (): void => {
    setChosenDel(null);
    setDeleteModal(false);
  };
  
  const handleDelSave = async (): Promise<void> => {
  };

  const openPop = (e:any) => {
    setChosenOne(e.script.myScript);
    setPopTitle(e.host);
    setModal(true);
  };

  const openDelPop = (e: string): void => {
    setChosenDel(e);
    setDeleteModal(true);
  };

  return (
    <>
      {bridges ? (
        <TableContainer sx={{ boxShadow: "0px 1px 5px #ccc", borderRadius: "10px" }}>
          <Table>
            <TableHead sx={{ background: "#ddd" }}>
              <TableRow>
                <TableCell>Host</TableCell>
                <TableCell>Added Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {/* @ts-expect-error */}
              {bridges?.map((user, index) => {
                const newDate = user.addedDate.split("T");
                return (
                  <TableRow key={index}>
                    <TableCell>{user.host}</TableCell>
                    <TableCell>{newDate[0]}</TableCell>
                    <TableCell>
                      {user.status ? (
                        <Tooltip title="Active">
                          <CheckCircle color="primary" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Down">
                          <CancelRounded color="error" />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ color: "#fff" }}
                        startIcon={<IconScript />}
                        onClick={() => openPop(user)}
                      >
                        View Script
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ color: "#fff" }}
                        onClick={() => openDelPop(user.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>You currently do not have any integration setup</Typography>
      )}
      <ModalClose1Btn
        open={modal}
        title={popTitle}
        content={<ManageBridge codeString={chosenOne || ""} />}
        contentType="box"
        key={1}
        btn={"Close"}
        handleAction={handleClose}
      />
      <ModalClose2Btn
        open={deleteModal}
        title={popTitle}
        content={<Typography>Are you sure you want to delete this integration?</Typography>}
        contentType="text"
        key={1}
        btn1={"Close"}
        btn2={"Delete"}
        btn1Func={handleDelClose}
        btn2Func={handleDelSave}
      />
    </>
  );
};

export default Integration;