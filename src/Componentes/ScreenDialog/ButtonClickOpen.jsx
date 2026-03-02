import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
  DialogTitle,
  Tabs,
  Tab,
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";


const ButtonClickOpen = ({
  textButton,
  onOpen,
  onClose,
  styles = {},
}) => {



  const [open, setOpen] = useState(false)
  const [contentChildren, setContentChildren] = useState(null)

  useEffect(() => {
    if (open) {
      setContentChildren(onOpen(open, setOpen))
    } else {
      setContentChildren(onClose(open, setOpen))
    }
  }, [open])

  return (
    <>
      <SmallButton
        style={styles}
        textButton={textButton}
        actionButton={() => {
          setOpen(!open)
        }} />
      {contentChildren}
    </>
  );
};

export default ButtonClickOpen;
