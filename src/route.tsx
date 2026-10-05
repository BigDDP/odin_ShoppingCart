import type { RouteObject } from "react-router";
import App from "./App.tsx";
import Home from "./pages/index.tsx";
import Shop from "./pages/shop.tsx";
import Cart from "./pages/cart.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "cart", element: <Cart /> },
    ],
  },
];

export default routes;
