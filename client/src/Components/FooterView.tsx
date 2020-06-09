import * as React from "react";

import { Typography, Container, Grid, Link, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const MESSAGE = "Find the best apartments to rent. Guaranteed.";

const footerStyles = makeStyles({
  container: {
    background: "#f8f8f8",
    paddingTop: "32px",
    paddingBottom: "32px",
    textAlign: "left",
  },
  leftContainer: {
    height: "100%",
  },
});

export function FooterView() {
  const classes = footerStyles();

  const renderLink = (text: string, link: string) => {
    return (
      <Link href={link} color="textPrimary">
        <Typography variant="body2" gutterBottom={true}>
          {text}
        </Typography>
      </Link>
    );
  };

  return (
    <Box className={classes.container} display={{ xs: "none", sm: "block" }}>
      <Container maxWidth="md">
        <Grid container={true} direction="row" justify="space-around">
          <Grid item={true} xs={6}>
            <Grid container={true} direction="column" justify="center" className={classes.leftContainer}>
              <Grid item={true}>
                <Typography variant="body2">{MESSAGE}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item={true} xs={3}>
            <Grid container={true} direction="column" justify="space-between">
              <Grid item={true}>{renderLink("Apartments in Bucharest", "/apartments")}</Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
