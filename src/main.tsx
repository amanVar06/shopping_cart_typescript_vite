import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { CartProvider } from "./context/CartProvider";
import { ProductsProvider } from "./context/ProductsProvider";

// here we wrap our whole app with the provider
// but we should wrap only that part/ component just wrap the part that needs your context

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ProductsProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ProductsProvider>
  </React.StrictMode>
);
