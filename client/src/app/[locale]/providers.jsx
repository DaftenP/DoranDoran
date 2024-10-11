// "use client";

// import { Provider } from "react-redux";
// import store from "@/store/store";

// export function ReduxProvider({ children }) {
//   return <Provider store={store}>{children}</Provider>;
// }

"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
}
