import { organizationsReducer } from "@/features/organizations/organizations.slice";
import { rolesReducer } from "@/features/role/role.slice";
import { userReducer } from "@/features/user/user.slice";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import leaveTypeReducer from "@/features/leave-types/leave-types.slice";
import leaveRequestReducer from "@/features/leave-requests/leave-requests.slice";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import persistReducer from "redux-persist/es/persistReducer";
import createWebStorage from "redux-persist/es/storage/createWebStorage";

const storage = createWebStorage("local");

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["currentOrganizationUuid"],
};

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    "userSlice",
    "organizationsSlice",
    "rolesSlice",
    "leaveTypeSlice",
    "leaveRequestSlice",
  ],
};

const combinedReducer = combineSlices({
  userSlice: persistReducer(userPersistConfig, userReducer),
  organizationsSlice: organizationsReducer,
  rolesSlice: rolesReducer,
  leaveTypeSlice: leaveTypeReducer,
  leaveRequestSlice: leaveRequestReducer,
});

const rootReducer = (
  state: ReturnType<typeof combinedReducer> | undefined,
  action: Action
) => {
  return combinedReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};
export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
