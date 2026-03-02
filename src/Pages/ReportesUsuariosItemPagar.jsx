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
import HacerPago from "./HacerPago";
import User from "../Models/User";
import SmallButton from "../Componentes/Elements/SmallButton";

export default ({
  deudas,
  cuandoPaga
}) => {

  const {
    showLoading,
    hideLoading,
    userData,
    showMessage,
    showConfirm,
    showAlert
  } = useContext(SelectedOptionsContext);

  const apiUrl = ModelConfig.get().urlBase;

  const [deudasSeleccionadas, setDeudasSeleccionadas] = useState([])
  const [verPantallaPagos, setVerPantallaPagos] = useState(false)

  const [verListadoChecks, setVerListadoChecks] = useState(false)

  const [total, setTotal] = useState(0)


  const procesarGroupedPayment = (
    montoAPagar,
    metodoPago,
    callbackOk,
    callbackWrong
  ) => {

    let endpoint = `${apiUrl}/Usuarios/PostUsuarioPagarDeudaByIdUsuario`;

    const deudaIds = deudasSeleccionadas.map((deuda) => ({
      idCuentaCorriente: deuda.id + "",
      idCabecera: deuda.idCabecera + "",
      total: deuda.total + "",
    }));

    const requestBody = {
      deudaIds,
      montoPagado: montoAPagar,
      metodoPago: metodoPago,
      idUsuario: userData.codigoUsuario,
      // transferencias: null,
    };


    // console.log("procesarGroupedPayment..data", requestBody)
    EndPoint.sendPost(endpoint, requestBody, callbackOk, callbackWrong)
  }

  return (
    <>
      <SmallButton
        styles={{
          backgroundColor: "#9003b0"
        }}
        textButton={"Pagar"}
        actionButton={() => {
          setVerListadoChecks(true)
        }} />

      <ListMultiselectChecks
        title={"Deudas de " + deudas[0].nombreApellidoOperador}
        openDialog={verListadoChecks}
        setOpenDialog={setVerListadoChecks}
        listInfo={deudas}
        headTable={[
          "Tipo de documento",
          "Folio",
          "Fecha",
          "Monto"
        ]}
        bodyTable={[
          (item) => (item.descripcionComprobante),
          (item) => (item.nroComprobante),
          (item) => (System.formatDateServer(item.fecha)),
          (item) => ("$" + System.formatMonedaLocal(item.total, false)),
        ]}
        onConfirm={(items, total) => {
          // console.log("confirma", items)
          setDeudasSeleccionadas(items)
          setTotal(total)
          setVerPantallaPagos(true)
        }}
      />

      <HacerPago
        openDialog={verPantallaPagos}
        setOpendialog={setVerPantallaPagos}
        monto={total}
        permitePagoParcial={true}
        onConfirm={(totalAPagar, metodoPago) => {
          procesarGroupedPayment(totalAPagar, metodoPago, (responseData, res) => {
            if (res.data.statusCode === 200) {
              cuandoPaga()
              setVerListadoChecks(false)
              showMessage("Pagado correctamente")
              window.location.reload()
            }
          }, showAlert)
        }}
      />

    </>
  );
};

