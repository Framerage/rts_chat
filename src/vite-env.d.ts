declare module "prehost_app/store/useAuthStore" {
  function useAuthStore(): {
    user: null | string;
  };

  export default useAuthStore;
}
declare module "prehost_app/store/globalStoreProvider" {
  import React from "react";

  type Props = {
    children: React.ReactNode;
  };
  export default function StoreProvider({ children }: Props): JSX.Element;
}
