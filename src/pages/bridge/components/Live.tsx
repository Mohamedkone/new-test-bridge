/* eslint-disable @typescript-eslint/ban-ts-comment */
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
  Typography,
} from "@mui/material";
import { CancelRounded, CheckCircle } from "@mui/icons-material";
import ModalClose2Btn from "../../../components/UI/modals/ModalClose2btn";
import ManageBridge from "./ManageBridge";
import { Link } from "react-router-dom";

const Live: React.FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [info, setInfo] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [live] = useState<any>([]);

  const handleClose = (): void => {
    setModal(false);
    setInfo(null);
  };

  const handleOpen = (e: React.SetStateAction<null>): void => {
    setModal(true);
    setInfo(e);
  };
  
  const handleSave = (): void => {
    handleClose();
  };

  
  return (
    <>
      <TableContainer
        sx={{ boxShadow: "0px 1px 5px #ccc", borderRadius: "10px" }}
      >
        <Table>
          <TableHead sx={{ background: "#ddd" }}>
            <TableRow>
              <TableCell>Alias</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Security</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Access</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
{/*  @ts-expect-error  */}
            
            {live.map((user, index) => (
                <TableRow key={index}>
                <TableCell>{user?.alias}</TableCell>
                <TableCell>
                  {/*  @ts-expect-error  */}
                  <Link target="_blank" to={`${dropLink}/?key=${user.link}`}>
                    {user.link}
                  </Link>
                </TableCell>
                <TableCell>
                  {user.security === 1 && <Typography>Gold</Typography>}
                  {user.security === 2 && <Typography>Diamond</Typography>}
                </TableCell>
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
                  {user.access === 1 && <Typography>Public</Typography>}
                  {user.access === 2 && <Typography>Private</Typography>}
                  {user.access === 3 && <Typography>Controlled</Typography>}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ color: "#fff" }}
                    onClick={() => handleOpen(user)}
                    >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalClose2Btn open={modal} title={"Manage bridge"}content={<ManageBridge live={true} info={info} />}
        contentType="box"
        key={1}
        btn1={"Cancel"}
        btn2={"Save"}
        btn1Func={handleClose}
        btn2Func={handleSave}
        />
    </>
  );
};

export default Live;