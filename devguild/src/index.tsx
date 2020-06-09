import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { appTheme } from "./Theme";

const appNode = (
  <ThemeProvider theme={appTheme}>
    <App />
  </ThemeProvider>
);

ReactDOM.render(appNode, document.getElementById("root") as HTMLElement);
registerServiceWorker();
