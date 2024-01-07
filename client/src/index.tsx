import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/userContext";
import { DestinationProvider } from "./context/destinationContext";
import "./styles/index.css";

const root: ReactDOM.Root = ReactDOM.createRoot(
  document.getElementById("root")!
);
root.render(
  //<React.StrictMode>
    <UserProvider>
      <DestinationProvider>
        <App />
      </DestinationProvider>
    </UserProvider>
  //</React.StrictMode>
);
