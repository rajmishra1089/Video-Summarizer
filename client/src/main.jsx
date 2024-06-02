import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from '@auth0/auth0-react';
import App from "./App.jsx";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-xlsspqpic73yp4ko.us.auth0.com"
    clientId="ZXSnG8bxIJb1OrCjKAXtepfEY89ea8CO"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
  
);
