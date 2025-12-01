import { createRoot } from "react-dom/client";
import "./index.css";
import WssChat from "./App";
// import { lazy } from "react";
// const StoreProvider = lazy(
//   () => import("prehost_app/store/globalStoreProvider")
// );
createRoot(document.getElementById("root")!).render(
  //   <StoreProvider>
  <WssChat />
  //   </StoreProvider>
);
