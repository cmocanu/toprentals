import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import SecurityIcon from "@material-ui/icons/Security";
import { Container, Link, Typography, Grid, Button } from "@material-ui/core";
import { User } from "../Backend/Types";
import { SignUpDialog } from "./SignUpDialog";
import { LoginDialog } from "./LoginDialog";
import { logout } from "../Backend/UserApi";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.dark,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

export function NavbarView(props: { user: User | undefined; setUser: (user: User | undefined) => void }) {
  const classes = useStyles();
  const { user, setUser } = props;
  const name = user ? user.name : "Not logged in";

  const handleLogout = async () => {
    const res = await logout();
    if (!(res instanceof Error)) {
      setUser(undefined);
    }
  };

  const loggedIn = (
    <div>
      <Grid container={true} alignItems="center">
        <Grid item={true}>
          <Typography color="inherit">{name}</Typography>
        </Grid>
        <Grid item={true}>
          <Button onClick={handleLogout} color="secondary">
            Logout
          </Button>
        </Grid>
      </Grid>
    </div>
  );

  const authButtons = (
    <div>
      <Grid container={true}>
        <Grid item={true}>
          <SignUpDialog />
        </Grid>
        <Grid item={true}>
          <LoginDialog setUser={setUser} />
        </Grid>
      </Grid>
    </div>
  );

  return (
    <div>
      <AppBar position="static" elevation={0} className={classes.root}>
        <Container maxWidth="xl">
          <Toolbar>
            <SecurityIcon style={{ color: "#f38b31" }} fontSize="large" />
            <Link href="/" variant="h6" className={classes.title} align="left" color="inherit" underline="none">
              TopRentals
            </Link>
            {user ? loggedIn : authButtons}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
