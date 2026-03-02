import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Avatar,
  TextField,
  CircularProgress,
  Snackbar,
  Checkbox,
  IconButton,
  Collapse,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SideBar from "../Componentes/NavBar/SideBar";
import axios from "axios";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ModelConfig from "../Models/ModelConfig";
import System from "../Helpers/System";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import Validator from "../Helpers/Validator";
import ListMultiselectChecks from "../Componentes/ScreenDialog/ListMultiselectChecks";
import ButtonClickOpen from "../Componentes/ScreenDialog/ButtonClickOpen";
import EndPoint from "../Models/EndPoint";

export default ({
  monto,
  permitePagoParcial = false,
  openDialog,
  setOpendialog,
  title = "Hacer el pago",
  onConfirm
}) => {

  const {
    showLoading,
    hideLoading,
    userData,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [montoAPagar, setMontoAPagar] = useState(0)
  const [cantidadPagada, setCantidadPagada] = useState(0)
  const [metodoPago, setMetodoPago] = useState("")


  useEffect(() => {
    if (!openDialog) return
    // console.log("monto", monto)
    setMontoAPagar(monto)
    setCantidadPagada(monto)
  }, [openDialog])


  const calcularVuelto = () => {
    return metodoPago === "EFECTIVO" && cantidadPagada > montoAPagar
      ? cantidadPagada - montoAPagar
      : 0;
  };
  return (
    <Dialog open={openDialog} onClose={() => setOpendialog(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} item xs={12} md={6} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <TextField
              sx={{ marginBottom: "5%" }}
              margin="dense"
              label="Monto que debe Pagar"
              variant="outlined"
              // value={getTotalSelected()}
              value={monto}
              fullWidth
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              InputProps={{ readOnly: true }}
            />
            <TextField
              margin="dense"
              fullWidth
              label="Monto que Paga"
              value={cantidadPagada}
              onChange={(e) => {
                if (permitePagoParcial) {
                  const value = e.target.value;
                  if (!value.trim()) {
                    setCantidadPagada(0);
                  } else {
                    setCantidadPagada((value));
                  }
                }
              }}
              disabled={metodoPago !== "EFECTIVO"} // Deshabilitar la edición excepto para el método "EFECTIVO"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 9,
              }}
            />
            <TextField
              margin="dense"
              fullWidth
              type="number"
              label="Restan"
              value={Math.max(0, montoAPagar - cantidadPagada)}
              InputProps={{ readOnly: true }}
            />
            {calcularVuelto() > 0 && (
              <TextField
                margin="dense"
                fullWidth
                type="number"
                label="Vuelto"
                value={calcularVuelto()}
                InputProps={{ readOnly: true }}
              />
            )}
          </Grid>

          <Grid
            container
            spacing={2}
            item
            sm={12}
            md={12}
            lg={12}
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Typography sx={{ marginTop: "7%" }} variant="h6">
              Selecciona Método de Pago:
            </Typography>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                sx={{ height: "100%" }}
                id="efectivo-btn"
                fullWidth
                // disabled={loading} // Deshabilitar si hay una carga en progreso
                variant={metodoPago === "EFECTIVO" ? "contained" : "outlined"}
                onClick={() => {
                  setMetodoPago("EFECTIVO");
                }}
              >
                Efectivo
              </Button>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago}
                // onClick={handlePayment}
                onClick={() => {
                  onConfirm(cantidadPagada, metodoPago)
                  setOpendialog(false)
                }
                }
              >
                Pagar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpendialog(false)}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

