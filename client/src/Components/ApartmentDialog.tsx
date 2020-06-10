import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useState } from "react";
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { Apartment, User } from "../Backend/Types";
import { createApartment, editApartment } from "../Backend/ApartmentApi";
import Geocode from "react-geocode";
import { GOOGLE_KEY } from "../util";
import { Text, Number } from "./Inputs";
import { AddressSelector } from "./AddressSelector";
import { ValidatorForm } from "react-material-ui-form-validator";
import EditIcon from "@material-ui/icons/Edit";

Geocode.setApiKey(GOOGLE_KEY);
Geocode.setRegion("ro");
Geocode.enableDebug();

function ApartmentDialog(props: {
  initialData: Partial<Apartment>;
  refresh: () => void;
  realtors: User[];
  renderButton: (onClick: () => void) => JSX.Element;
  endpoint: (apartment: Partial<Apartment>) => Promise<true | Error>;
}) {
  const [open, setOpen] = useState(false);
  const [apt, setApt] = useState(props.initialData);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const { endpoint, renderButton } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setApt(props.initialData);
    setOpen(false);
  };

  const handleAdd = async () => {
    const res = await endpoint(apt);
    if (res instanceof Error) {
      console.log("Setting request failed");
      setErrorMessage(res.message);
    } else {
      setErrorMessage(undefined);
      props.refresh();
      handleClose();
    }
  };

  const onChange = (prop: keyof Apartment) => (val: string) => {
    setApt((oldApt: Partial<Apartment>) => {
      return { ...oldApt, [prop]: val };
    });
  };

  // TODO make it look ok in case of huge number of realtors
  const RealtorSelect = () => {
    const { realtors } = props;
    const handleChange = (e: any) => {
      apt.owner_id = e.target.value;
      setApt((oldApt) => {
        return { ...oldApt, owner_id: e.target.value };
      });
    };

    return (
      <FormControl fullWidth={true}>
        <InputLabel id="realtor-select-label">Realtor</InputLabel>
        <Select
          labelId="realtor-select-label"
          id="realtor-select"
          value={apt.owner_id || ""}
          onChange={handleChange}
          fullWidth={true}
        >
          {realtors.map((realtor) => {
            return (
              <MenuItem key={realtor.id} value={realtor.id}>
                {realtor.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  const onAddressChange = (lat: number, lng: number) => {
    setApt((oldApt: Partial<Apartment>) => {
      return { ...oldApt, latitude: lat, longitude: lng };
    });
  };

  const onChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changeRentalStatus = onChange("rental_status");
    if (event.target.checked) {
      changeRentalStatus("AVAILABLE");
    } else {
      changeRentalStatus("RENTED");
    }
  };

  return (
    <div>
      {renderButton(handleClickOpen)}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Apartment</DialogTitle>
        <DialogContent>
          <DialogContentText>Create or edit apartments</DialogContentText>
          <ValidatorForm id="apartmentform" onSubmit={handleAdd}>
            <Text label="Name" value={apt.name} handleChange={onChange("name")} />
            <Text label="Description" value={apt.description} handleChange={onChange("description")} />
            <Number label="Size" value={apt.size?.toString()} handleChange={onChange("size")} />
            <Number label="Number of rooms" value={apt.room_nr?.toString()} handleChange={onChange("room_nr")} />
            <Number label="Price" value={apt.price?.toString()} handleChange={onChange("price")} />
            <br />
            <br />
            <AddressSelector
              onChange={onAddressChange}
              initialLatitude={apt.latitude}
              initialLongitude={apt.longitude}
            />
            <br />
            <RealtorSelect />
            <br />
            <FormControlLabel
              control={
                <Switch checked={apt.rental_status === "AVAILABLE"} onChange={onChangeSwitch} name="usingGeocoder" />
              }
              label="Is available"
            />
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          </ValidatorForm>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" form="apartmentform" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export function CreateApartmentDialog(props: { refresh: () => void; realtors: User[] }) {
  const renderButton = (onClick: () => void) => {
    return (
      <Button variant="contained" color="secondary" onClick={onClick}>
        Add apartment
      </Button>
    );
  };

  const { refresh, realtors } = props;
  const initialData: Partial<Apartment> = {
    rental_status: "AVAILABLE",
  };

  return (
    <ApartmentDialog
      initialData={initialData}
      refresh={refresh}
      realtors={realtors}
      endpoint={createApartment}
      renderButton={renderButton}
    />
  );
}

export function EditApartmentDialog(props: { initialData: Partial<Apartment>; refresh: () => void; realtors: User[] }) {
  const renderButton = (onClick: () => void) => {
    return (
      <IconButton aria-label="edit" size="small" onClick={onClick}>
        <EditIcon />
      </IconButton>
    );
  };

  const { initialData, refresh, realtors } = props;

  return (
    <ApartmentDialog
      initialData={initialData}
      refresh={refresh}
      realtors={realtors}
      endpoint={editApartment}
      renderButton={renderButton}
    />
  );
}
