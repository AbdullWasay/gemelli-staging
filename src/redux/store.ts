/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from "@reduxjs/toolkit";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  createTransform,
} from "redux-persist";
import authReducer from "./features/auth/authSlice";
import currencyReducer from "./reducers/currencySlice";
import { baseApi } from "./api/baseApi";
import productFormReducer from "./features/products/productSlice";
import userReducer from "./features/user/userSlice";

const createNoopStorage = () => {
  return {
    getItem(_key: string): Promise<null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any): Promise<any> {
      return Promise.resolve(value);
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// ADDED: Transform to handle the token correctly
// This prevents double stringification
const authTransform = createTransform(
  // Transform state on the way to being serialized and persisted
  (inboundState: any) => {
    return {
      ...inboundState,
      // Don't double-stringify - redux-persist will handle serialization
      access_token: inboundState.access_token,
      refresh_token: inboundState.refresh_token,
      user: inboundState.user,
    };
  },
  // Transform state being rehydrated
  (outboundState: any) => {
    return {
      ...outboundState,
      // Parse if it's a string, otherwise use as-is
      access_token: outboundState.access_token,
      refresh_token: outboundState.refresh_token,
      user: outboundState.user,
    };
  },
  { whitelist: ['auth'] }
);

const persistAuthConfig = {
  key: "auth",
  storage,
  transforms: [authTransform],
};

const persistCurrencyConfig = {
  key: "currency",
  storage,
};

const persistUserConfig = {
  key: "user",
  storage,
};

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer);
const persistedCurrencyReducer = persistReducer(
  persistCurrencyConfig,
  currencyReducer
);
const persistedUserReducer = persistReducer(persistUserConfig, userReducer);

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: persistedAuthReducer,
      productForm: productFormReducer,
      currency: persistedCurrencyReducer,
      user: persistedUserReducer,
    },
    middleware: (getDefaultMiddlewares) =>
      getDefaultMiddlewares({
        serializableCheck: {
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            "productForm/setProductImages",
          ],
          ignoredActionPaths: ["payload.file", "meta.arg.file", "meta.baseQueryMeta.request"],
          ignoredPaths: ["productForm.productImages"],
        },
      }).concat(baseApi.middleware),
  });
};

export const store = makeStore();
export const persistor = persistStore(store);



// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];