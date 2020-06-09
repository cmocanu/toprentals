import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DeleteIcon from "@material-ui/icons/Delete";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useState } from "react";
import { Typography, IconButton } from "@material-ui/core";
import { Apartment } from "../Backend/Types";
import { removeApartment } from "../Backend/ApartmentApi";

export function RemoveDialog(props: { apartment: Apartment; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setRequestFailed(false);
    setOpen(false);
  };

  const handleRemove = async () => {
    const success = await removeApartment(props.apartment);
    if (success) {
      props.onRemove();
      handleClose();
    } else {
      setRequestFailed(true);
    }
  };

  return (
    <div>
      <IconButton aria-label="delete" size="small" onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Remove apartment</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to remove apartment {props.apartment.name}?</DialogContentText>
          {requestFailed && <Typography color="error">Something went wrong. Please try again.</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemove} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
