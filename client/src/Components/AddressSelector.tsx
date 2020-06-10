import Geocode from "react-geocode";
import { GOOGLE_KEY, useDebounce } from "../util";
import { useState, useEffect } from "react";
import { FormControlLabel, Switch } from "@material-ui/core";
import { Text, Latitude, Longitude } from "./Inputs";
import React from "react";
import { toNumber } from "lodash-es";

Geocode.setApiKey(GOOGLE_KEY);
Geocode.setRegion("ro");
Geocode.enableDebug();

export const AddressSelector = (props: {
  onChange: (lat: number, lng: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}) => {
  const [address, setAddress] = useState("");
  const debouncedAddress: string = useDebounce(address, 500);
  const [latText, setLatText] = useState(props.initialLatitude?.toString() || "0");
  const [lngText, setLngText] = useState(props.initialLongitude?.toString() || "0");
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const debouncedCoords: {
    lat: number;
    lng: number;
  } = useDebounce(coords, 500);
  const [usingGeocoder, setUsingGeocoder] = useState(false);
  const { onChange } = props;

  const changeCoords = (newCoordsText: { lat?: string; lng?: string }) => {
    if (newCoordsText.lat !== undefined) {
      setLatText(newCoordsText.lat);
    }
    if (newCoordsText.lng !== undefined) {
      setLngText(newCoordsText.lng);
    }
    const newCoords: any = {};
    const latVal = toNumber(newCoordsText.lat);
    if (!isNaN(latVal)) {
      newCoords.lat = latVal;
    }
    const lngVal = toNumber(newCoordsText.lng);
    if (!isNaN(lngVal)) {
      newCoords.lng = lngVal;
    }
    setCoords((oldCoords) => {
      const newState = { ...oldCoords, ...newCoords };
      onChange(newState.lat, newState.lng);
      return newState;
    });
  };

  const changeLat = (lat: string) => {
    changeCoords({ lat });
  };

  const changeLng = (lng: string) => {
    changeCoords({ lng });
  };

  const onChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsingGeocoder(event.target.checked);
  };

  const onChangeAddress = (newAddress: string) => {
    setAddress(newAddress);
  };

  useEffect(() => {
    if (debouncedAddress.length === 0 || usingGeocoder === false) {
      return;
    }
    Geocode.fromAddress(debouncedAddress).then(
      (response: any) => {
        const { lat, lng } = response.results[0].geometry.location;
        changeCoords({ lat, lng });
      },
      (error: any) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line
  }, [debouncedAddress]);

  useEffect(() => {
    if (usingGeocoder === true || debouncedCoords.lat === 0) {
      return;
    }
    Geocode.fromLatLng(debouncedCoords.lat, debouncedCoords.lng).then(
      (response: any) => {
        const address = response.results[0].formatted_address;
        setAddress(address);
      },
      (error: any) => {
        console.error(error);
      }
    );
    // eslint-disable-next-line
  }, [debouncedCoords]);

  return (
    <div>
      <FormControlLabel
        control={<Switch checked={usingGeocoder} onChange={onChangeSwitch} name="usingGeocoder" />}
        label="Find coordinates based on address"
      />
      <Text label="Address" value={address} handleChange={onChangeAddress} disabled={!usingGeocoder} />
      <Latitude label="Latitude" value={latText} handleChange={changeLat} disabled={usingGeocoder} />
      <Longitude label="Longitude" value={lngText} handleChange={changeLng} disabled={usingGeocoder} />
    </div>
  );
};
