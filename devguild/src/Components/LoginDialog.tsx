import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useState } from "react";
import { login } from "../Backend/UserApi";
import { Typography } from "@material-ui/core";
import { User } from "../Backend/Types";
import { ValidatorForm } from "react-material-ui-form-validator";
import { Email, Password } from "./Inputs";

export function LoginDialog(props: { setUser: (user: User | undefined) => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setErrorMessage(undefined);
    setOpen(false);
  };

  const handleLogin = async () => {
    const res = await login(email, password);
    if (res instanceof Error) {
      setErrorMessage(res.message);
    } else {
      props.setUser(res);
      handleClose();
    }
  };

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        Login
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText>Welcome to TopRentals! Please login using your email and password.</DialogContentText>
          <ValidatorForm id="loginform" onSubmit={handleLogin}>
            <Email label="Email" value={email} handleChange={setEmail} />
            <Password label="Password" value={password} handleChange={setPassword} />
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          </ValidatorForm>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" type="submit" form="loginform">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
