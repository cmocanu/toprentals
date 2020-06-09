import {
  Container,
  makeStyles,
  Typography,
  Box,
  Link,
  Card,
  CardContent,
  Grid,
  Theme,
  createStyles,
  IconButton,
  CardMedia,
  CardActions,
  Grow,
} from "@material-ui/core";
import * as React from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const companyCardStyles = makeStyles({
  card: {
    backgroundColor: "inherit",
    maxWidth: 345,
    minWidth: 250,
  },
  cardHeader: {
    marginTop: "10px",
    paddingBottom: 10,
  },
  text: {
    color: "#445d6e",
  },
});

function QuestionCard(props: { question: string; answer: string }) {
  const classes = companyCardStyles();

  return (
    <Card className={classes.card} elevation={0}>
      <CardContent>
        <Typography className={classes.cardHeader} align="left" variant="h5" component="h2">
          {props.question}
        </Typography>
        <Typography className={classes.text} align="left" variant="h6" component="p">
          {props.answer}
        </Typography>
      </CardContent>
    </Card>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 250,
      minHeight: 330,
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    title: {
      fontWeight: 500,
    },
    icon: {
      fill: theme.palette.secondary.main,
    },
    button: {
      padding: 0,
    },
    cardActions: {
      height: 100,
    },
  })
);

function RecipeReviewCard() {
  const classes = useStyles();

  return (
    <Grow in={true} timeout={800}>
      <Card className={classes.root} elevation={2}>
        <CardMedia
          className={classes.media}
          image={process.env.PUBLIC_URL + "/images/bucharest.jpeg"}
          title="Paella dish"
        />
        <CardContent>
          <Typography className={classes.title} variant="h5" color="textPrimary" component="p">
            Bucharest
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            Romania's largest city
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Box m="auto">
            <Link href="/apartments" underline="hover">
              <Grid container={true} alignItems="center">
                <Typography align="center">View apartments</Typography>
                <IconButton className={classes.button} color="secondary">
                  <ChevronRightIcon className={classes.icon} />
                </IconButton>
              </Grid>
            </Link>
          </Box>
        </CardActions>
      </Card>
    </Grow>
  );
}

const heroStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(6, 4, 6),
  },
  heroText: {
    color: theme.palette.primary.contrastText,
  },
}));

const gridStyles = makeStyles((theme) => ({
  gridContainer: {
    background: "#f7f7ff",
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr) )",
    gridColumnGap: "25px",
    gridRowGap: "25px",
    padding: theme.spacing(8, 4, 8),
  },
  image: {
    height: "200px",
    objectFit: "cover",
    borderRadius: "30%",
    [theme.breakpoints.only("xs")]: {
      height: "150px",
    },
  },
}));

export function LandingPageRoute() {
  const classes = heroStyles();
  const gridClasses = gridStyles();

  return (
    <div>
      <div className={classes.heroContent}>
        <Container maxWidth="md" disableGutters={true}>
          <Typography className={classes.heroText} variant="h3" component="h1" gutterBottom={true} align="left">
            Welcome to TopRentals!
          </Typography>
          <Typography className={classes.heroText} variant="h5" component="h2" gutterBottom={true} align="left">
            Find the apartment that is right for you by getting accurate location, size, number of rooms and a poignant
            description!
          </Typography>
          {/* <Grid container={true}>
            <Grid item={true}>
              <SignUpDialog />
            </Grid>
            <Grid item={true}>
              <LoginDialog />
            </Grid>
          </Grid> */}
        </Container>
      </div>
      <Container maxWidth="md" disableGutters={true}>
        <div className={gridClasses.cardGrid}>
          <QuestionCard
            question="Find apartments"
            answer="Our service integrates Google Maps to help you find the real, precise location of any apartment."
          />
          <QuestionCard
            question="Rent your apartment"
            answer="Sign up as a realtor to find great renters for your apartments."
          />
        </div>
      </Container>
      <Container maxWidth="md" disableGutters={true}>
        <Typography variant="h4" align="center">
          Currently available in
        </Typography>
        <div className={gridClasses.cardGrid}>
          <Grid container={true} direction="column" justify="center" alignItems="center">
            <RecipeReviewCard />
          </Grid>
        </div>
      </Container>
    </div>
  );
}
