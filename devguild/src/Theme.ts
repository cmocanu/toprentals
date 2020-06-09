import { createMuiTheme } from "@material-ui/core/styles";

export const appTheme = createMuiTheme({
  palette: {
    primary: { dark: "#012749", main: "#456a90", light: "##bcc9d7" },
    secondary: { main: "#f38b31" },
    background: { default: "#fafbfc" },
  },
  props: {
    MuiToolbar: {
      variant: "regular",
    },
  },
  typography: {
    h3: {
      fontSize: "2.3rem",
    },
    h4: {
      fontSize: "1.7rem",
    },
    h5: {
      fontSize: "1.3rem",
    },
    h6: {
      fontSize: "1em",
    },
    body1: {
      fontSize: "0.9em",
    },
    body2: {
      fontSize: "0.9em",
    },
    subtitle1: {
      fontSize: "0.9rem",
    },
    subtitle2: {
      fontSize: "0.8rem",
    },
  },
});
