import { makeStyles, Grid, Card, CardMedia, CardContent, Typography } from "@material-ui/core";
import { Apartment, User } from "../Backend/Types";
import { RemoveDialog } from "./RemoveDialog";
import React, { CSSProperties } from "react";
import { EditApartmentDialog } from "./ApartmentDialog";

const APARTMENT_PHOTOS = [
  "https://www.inchirieriapartamentenoi.ro/wp-content/uploads/2018/09/1-Bright-new-apartment-for-rent-Parliament.jpg",
  "https://www.inchirieriapartamentenoi.ro/wp-content/uploads/2017/08/1-Exclusiv-Apartament-nou-2-camere-Unirii-Piata-Constitutiei-prima-inchiriere.jpg",
  "https://www.inchirieriapartamentenoi.ro/wp-content/uploads/2016/10/1-Baneasa-Park-Residences-apartament-nou-3-camere-de-inchiriat.jpg",
  "https://www.inchirieriapartamentenoi.ro/wp-content/uploads/2016/09/1-De-inchiriat-apartament-3-camere-Ten-Blocks.jpg",
  "https://www.inchirieriapartamentenoi.ro/wp-content/uploads/2019/10/de-inchiriat-2-camere-Berceni-1.jpg",
  "https://www.inchirieriapartamentenoi.ro/wp-content/uploads/2016/09/1-De-inchiriat-apartament-3-camere-Ten-Blocks.jpg",
  "https://www.inchirieriapartamentenoi.ro/wp-content/uploads/2013/02/1-Inchiriere-apartament-nou-2-camere-Marasesti.jpg",
];

const useStyles = makeStyles((theme) => ({
  root: (props: any) => ({
    display: "flex",
    height: 200,
    width: "100%",
    [theme.breakpoints.only("xs")]: {
      minWidth: props.embedded ? 400 : 0,
    },
  }),
  cover: (props: any) => ({
    width: "50%",
    height: "auto",
    [theme.breakpoints.only("xs")]: {
      display: props.embedded ? "none" : "inherit",
    },
  }),
  content: {
    width: "100%",
    padding: 16,
  },
  contentGrid: {
    height: "100%",
  },
  detailsContainer: {
    marginTop: 16,
  },
}));

export const LocalApartmentCard = (props: {
  apartment: Apartment;
  refresh: () => void;
  realtors: User[] | undefined;
  embedded?: boolean;
}) => {
  const { apartment, refresh, realtors, embedded } = props;
  const styleProps = { embedded };
  const classes = useStyles(styleProps);

  const userType = localStorage.getItem("userType");
  const isPrivileged = userType === "REALTOR" || userType === "ADMIN";

  const renderTitle = () => {
    return (
      <Typography variant="h5" color="textPrimary" gutterBottom>
        {apartment.name}
      </Typography>
    );
  };

  const renderToolbar = () => {
    return (
      <Grid container={true} justify="space-between">
        <Grid item={true}>{renderTitle()}</Grid>
        <Grid item={true}>
          <Grid container={true}>
            <Grid item={true}>
              {realtors && <EditApartmentDialog initialData={apartment} refresh={refresh} realtors={realtors} />}
            </Grid>
            <Grid item={true}>{realtors && <RemoveDialog apartment={apartment} onRemove={onRemove} />}</Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderRentalStatus = () => {
    const color = apartment.rental_status === "AVAILABLE" ? "green" : "red";
    const text = apartment.rental_status === "AVAILABLE" ? "Available" : "Not available";
    const validityStyle: CSSProperties = {
      color,
    };
    return <span style={validityStyle}>{text}</span>;
  };

  const onRemove = () => {
    refresh();
  };

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.cover}
        image={APARTMENT_PHOTOS[apartment.id % APARTMENT_PHOTOS.length]}
        title="Apartament doua camere"
      />
      <CardContent className={classes.content}>
        <Grid container={true} direction="column" justify="space-around" wrap="nowrap" className={classes.contentGrid}>
          <Grid item={true}>
            {isPrivileged ? renderToolbar() : renderTitle()}
            <Typography color="textPrimary" gutterBottom>
              {apartment.description}
            </Typography>
          </Grid>
          <Grid item={true}>
            <Grid container={true} justify="space-between" alignItems="center" className={classes.detailsContainer}>
              <Grid item={true}>
                <Grid container={true} direction="column">
                  <Grid item={true}>
                    <Typography>{apartment.size} sqm</Typography>
                  </Grid>
                  <Grid item={true}>
                    <Typography>{apartment.room_nr} rooms</Typography>
                  </Grid>
                  <Grid item={true}>
                    <Typography>€{apartment.price} per month</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={true}>{renderRentalStatus()}</Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const ApartmentCard = React.memo(LocalApartmentCard);
