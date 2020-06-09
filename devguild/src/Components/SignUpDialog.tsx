import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useState } from "react";
import { signUp, editUser } from "../Backend/UserApi";
import { Typography, Box, IconButton, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";
import { Text, Email, Password, OptionalPassword } from "./Inputs";
import { User } from "../Backend/Types";
import EditIcon from "@material-ui/icons/Edit";

function UserDialog(props: {
  initialData: Partial<User>;
  onSuccess?: () => void;
  renderButton: (onClick: () => void) => JSX.Element;
  endpoint: (user: Partial<User>) => Promise<true | Error>;
  passwordRequired: boolean;
}) {
  const { initialData, onSuccess, renderButton, endpoint, passwordRequired } = props;
  const [open, setOpen] = useState(false);
  const { id } = initialData;
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<"CLIENT" | "REALTOR" | "ADMIN">(initialData.type || "CLIENT");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setName(initialData.name || "");
    setEmail(initialData.email || "");
    setPassword("");
    setErrorMessage(undefined);
    setOpen(false);
  };

  const handleSignUp = async () => {
    const res = await endpoint({ id, name, email, password, type });
    if (res instanceof Error) {
      setErrorMessage(res.message);
    } else {
      onSuccess?.();
      handleClose();
    }
  };

  const UserTypeSelect = () => {
    const handleChange = (e: any) => {
      setType(e.target.value);
    };

    return (
      <FormControl fullWidth={true}>
        <InputLabel id="realtor-select-label">User type</InputLabel>
        <Select
          labelId="realtor-select-label"
          id="realtor-select"
          value={type}
          onChange={handleChange}
          fullWidth={true}
        >
          <MenuItem key={1} value={"CLIENT"}>
            Client
          </MenuItem>
          <MenuItem key={1} value={"REALTOR"}>
            Realtor
          </MenuItem>
          <MenuItem key={1} value={"ADMIN"}>
            Admin
          </MenuItem>
        </Select>
      </FormControl>
    );
  };

  return (
    <div>
      {renderButton(handleClickOpen)}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Sign up</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Welcome to TopRentals! Please sign up to find the best apartments to rent.
          </DialogContentText>
          <ValidatorForm id="signupform" onSubmit={handleSignUp}>
            <Text label="Name" value={name} handleChange={setName} />
            <br />
            <Email label="Email" value={email} handleChange={setEmail} />
            <br />
            {passwordRequired ? (
              <Password label="Password" value={password} handleChange={setPassword} />
            ) : (
              <OptionalPassword label="Password" value={password} handleChange={setPassword} />
            )}
            <br />
            <br />
            <UserTypeSelect />
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          </ValidatorForm>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" type="submit" form="signupform">
            Sign up
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export function SignUpDialog(props: { onSuccess?: () => void }) {
  const { onSuccess } = props;

  const renderButton = (onClick: () => void) => {
    return (
      <Box mr={3}>
        <Button variant="outlined" color="secondary" onClick={onClick}>
          Sign up
        </Button>
      </Box>
    );
  };

  return (
    <UserDialog
      initialData={{}}
      renderButton={renderButton}
      onSuccess={onSuccess}
      endpoint={signUp}
      passwordRequired={true}
    />
  );
}

export function CreateUserDialog(props: { onSuccess?: () => void }) {
  const { onSuccess } = props;

  const renderButton = (onClick: () => void) => {
    return (
      <Box>
        <Button variant="contained" color="secondary" onClick={onClick}>
          Create user
        </Button>
      </Box>
    );
  };

  return (
    <UserDialog
      initialData={{}}
      renderButton={renderButton}
      onSuccess={onSuccess}
      endpoint={signUp}
      passwordRequired={true}
    />
  );
}

export function EditUserDialog(props: { user: Partial<User>; onSuccess?: () => void }) {
  const { user, onSuccess } = props;
  console.log("editing");
  console.log(user);

  const renderButton = (onClick: () => void) => {
    return (
      <IconButton aria-label="edit" size="small" onClick={onClick}>
        <EditIcon />
      </IconButton>
    );
  };

  return (
    <UserDialog
      initialData={user}
      renderButton={renderButton}
      onSuccess={onSuccess}
      endpoint={editUser}
      passwordRequired={false}
    />
  );
}
