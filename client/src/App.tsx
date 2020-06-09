import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ApartmentRoute } from "./Routes/ApartmentRoute";
import { LandingPageRoute } from "./Routes/LandingPageRoute";
import { FooterView } from "./Components/FooterView";
import ScopedCssBaseline from "@material-ui/core/ScopedCssBaseline";
import { NavbarView } from "./Components/NavbarView";
import { User } from "./Backend/Types";
import { UserRoute } from "./Routes/UsersRoute";

export const App = () => {
  const [user, setUser] = React.useState<User | undefined>(undefined);

  if (!user) {
    const id = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const type = localStorage.getItem("userType") as any;

    if (id && name && email && type) {
      setUser({
        id: parseInt(id),
        name,
        email,
        type,
      });
    }
  }

  return (
    <BrowserRouter>
      <ScopedCssBaseline>
        <div className="App">
          <NavbarView user={user} setUser={setUser} />
          <div style={{ background: "#fafbfc" } as any}>
            <Switch>
              <Route exact={true} path="/" render={() => <LandingPageRoute />} />
              <Route exact={true} path="/apartments" component={ApartmentRoute} />
              <Route exact={true} path="/users" component={UserRoute} />
            </Switch>
          </div>
          <FooterView />
        </div>
      </ScopedCssBaseline>
    </BrowserRouter>
  );
};

export default App;
