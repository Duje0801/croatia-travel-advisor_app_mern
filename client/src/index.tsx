import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/userContext";
import "./styles/index.css";

const root: ReactDOM.Root = ReactDOM.createRoot(
  document.getElementById("root")!
);
root.render(
  //<React.StrictMode>
  <UserProvider>
    <App />
  </UserProvider>
  //</React.StrictMode>
);
