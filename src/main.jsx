import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { shadesOfPurple } from "@clerk/themes";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import React from "react";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple,
      }}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <PayPalScriptProvider
        options={{ clientId: import.meta.env.VITE_PUBLIC_PAYPAL_CLIENT_ID }}
      >
        <App />
      </PayPalScriptProvider>
    </ClerkProvider>
  </React.StrictMode>
);
