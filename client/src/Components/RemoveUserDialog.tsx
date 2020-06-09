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
import { removeUser } from "../Backend/UserApi";
import { User } from "../Backend/Types";

export function RemoveUserDialog(props: { user: User; onRemove: () => void }) {
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
    const success = await removeUser(props.user);
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
        <DialogTitle id="form-dialog-title">Remove user</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to remove user {props.user.email}?</DialogContentText>
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
