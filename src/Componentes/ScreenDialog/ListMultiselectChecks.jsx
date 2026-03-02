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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import { width } from "@mui/system";
import System from "../../Helpers/System";


const ListMultiselectChecks = ({
  openDialog,
  setOpenDialog,
  title = "Listado",
  listInfo = [],
  headTable,
  bodyTable,
  idFieldName = "id",
  onConfirm,
  textConfirm = "Confirmar Pago",
  widthTotalAmount = true,
  totalFieldName = "total",
}) => {

  const [totalAmount, setTotalAmount] = useState(0)

  const [selectedIds, setSelectedIds] = useState([]);

  const allSelected = selectedIds.length === listInfo.length;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = listInfo.map((itemInfo) => itemInfo[idFieldName]);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };


  const handleSelectOne = (event, id) => {
    if (event.target.checked) {
      setSelectedIds((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedIds((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
    }
  };

  const getItems = () => {
    var items = []
    listInfo.forEach((infoItem) => {
      if (selectedIds.includes(infoItem[idFieldName])) {
        items.push(infoItem)
      }
    })
    return items
  }

  const calcTotal = () => {
    var ttal = 0
    getItems().forEach((item) => {
      ttal += item[totalFieldName]
    })
    setTotalAmount(ttal)
  }

  useEffect(() => {
    if (!openDialog) return
    // console.log("listoInfo", listInfo)
  }, [openDialog])

  useEffect(() => {
    // console.log("cambio selectedIds", selectedIds)
    calcTotal()
  }, [selectedIds])

  return (
    <Dialog
      open={openDialog}
      fullWidth
      maxWidth="md"
      onClose={() => {
        setOpenDialog(false)
      }}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <Grid container item xs={12} spacing={2} sx={{
          minWidth: "400px",
          marginTop: "0px"
        }}>


          <Grid item xs={12}>


            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedIds.length > 0 &&
                          selectedIds.length < listInfo.length
                        }
                        checked={allSelected}
                        onChange={handleSelectAll}
                      />
                    </TableCell>

                    {headTable && headTable.length > 0 && (headTable.map((it, ix) =>
                      <TableCell key={ix} padding="checkbox">
                        {it}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>

                  {listInfo && listInfo.map((infoItem, ixInf) => (
                    <TableRow key={ixInf}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.includes(infoItem[idFieldName])}
                          onChange={(event) =>
                            handleSelectOne(event, infoItem[idFieldName])
                          }
                        />
                      </TableCell>
                      {bodyTable.length > 0 && (bodyTable.map((fnItem, ix) =>
                        <TableCell key={ix} padding="checkbox">
                          {fnItem(infoItem)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {listInfo && widthTotalAmount && listInfo.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={headTable.length - 1}>
                        {" "}
                      </TableCell>
                      <TableCell sx={{
                        textAlign: "right"
                      }}>
                        Total:
                      </TableCell>
                      <TableCell sx={{
                        padding: 0
                      }}>
                        ${System.formatMonedaLocal(totalAmount, false)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>


          </Grid>



        </Grid>
      </DialogContent>
      <DialogActions>

        <SmallSecondaryButton
          style={{
            width: "inherit"
          }}
          textButton={textConfirm}
          actionButton={() => {
            if (onConfirm) {
              onConfirm(getItems(),totalAmount)
            }
          }}
          isDisabled={selectedIds.length < 1}
        />
        <Button onClick={() => setOpenDialog(false)}>Atras</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ListMultiselectChecks;
