import React from "react";
import { useState, useEffect } from "react";
import { Apartment, User } from "../Backend/Types";
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import { GOOGLE_KEY } from "../util";
import { ApartmentCard } from "./ApartmentComponent";

const containerStyle = {
  width: "100%",
  height: 500,
};

const infoWindowStyle = {
  background: `white`,
  border: `1px solid #ccc`,
  padding: 15,
};

const PIATA_UNIVERSITATII = {
  lat: 44.4349137,
  lng: 26.1011553,
};

const coords = (apt: Apartment) => {
  return {
    lat: apt.latitude,
    lng: apt.longitude,
  };
};

const infoCoords = (apt: Apartment) => {
  return {
    lat: apt.latitude + 0.01,
    lng: apt.longitude,
  };
};

export function Map(props: { apartments: Apartment[]; refresh: () => void; realtors: User[] | undefined }) {
  const { apartments, refresh, realtors } = props;
  const [visibleApartment, setVisibleApartment] = useState<Apartment | undefined>(undefined);

  useEffect(() => {
    if (visibleApartment && apartments.indexOf(visibleApartment) === -1) {
      setVisibleApartment(undefined);
    }
  }, [apartments, visibleApartment]);

  const apartmentMarker = (apt: Apartment) => {
    const onClick = () => {
      if (!visibleApartment) {
        setVisibleApartment(apt);
      }
    };
    return <Marker key={apt.id} position={coords(apt)} onClick={onClick} />;
  };

  const apartmentInfo = (apt: Apartment) => {
    const onClose = () => {
      setVisibleApartment(undefined);
    };
    return (
      <InfoWindow key={apt.id} position={infoCoords(apt)} onCloseClick={onClose}>
        <ApartmentCard apartment={apt} refresh={refresh} realtors={realtors} embedded={true} />
        {/* <div style={infoWindowStyle}>
          <div>{apt.name}</div>
        </div> */}
      </InfoWindow>
    );
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={PIATA_UNIVERSITATII} zoom={12}>
        {apartments.map(apartmentMarker)}
        {visibleApartment && apartmentInfo(visibleApartment)}
      </GoogleMap>
    </LoadScript>
  );
}
