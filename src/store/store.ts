import { organizationsReducer } from "@/features/organizations/organizations.slice";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";

const combinedReducer = combineSlices({
  organizationsSlice: organizationsReducer,
});

const rootReducer = (
  state: ReturnType<typeof combinedReducer> | undefined,
  action: Action
) => {
  return combinedReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
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
