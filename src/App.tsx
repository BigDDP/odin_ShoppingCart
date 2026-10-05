import { Outlet, useLocation } from "react-router";

import Navigation from "./components/navigation.tsx";
import { useCartState } from "./hooks/use-cart.ts";

const App = () => {
  const cart = useCartState();
  const isHome = useLocation().pathname === "/";

  return (
    <div
      className={`flex flex-col bg-slate-50 ${isHome ? "h-svh" : "min-h-screen"}`}
    >
      <header className="flex justify-center border-b bg-white p-2">
        <Navigation totalCount={cart.totalCount} />
      </header>
      <main
        className={`flex min-h-0 flex-1 justify-center ${isHome ? "" : "pt-8 pb-6 px-3 min-[769px]:px-6"}`}
      >
        <Outlet context={cart} />
      </main>
    </div>
  );
};

export default App;
