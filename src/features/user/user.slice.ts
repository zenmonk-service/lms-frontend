import { createSlice } from "@reduxjs/toolkit";
import { listUserAction, updateUserAction } from "./user.action";

export interface SignInInterface {
  email: string;
  password: string;
  organization_uuid?: string;
}
export interface UserInterface {
  user_id: string;
  name: string;
  email: string;
  role: {
    id: string;
    uuid: string;
    name: string;
    description: string;
  };
  created_at: string;
}

type UserState = {
  isLoading: boolean;
  organizations: any[];
  currentOrganizationUuid: string | null;
  users: UserInterface[];
  total: number;
  currentPage: number;
  error?: string | null;
};

const initialState: UserState = {
  isLoading: false,
  organizations: [],
  currentOrganizationUuid: null,
  users: [],
  total: 0,
  currentPage: 0,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addOrganizations: (state, action) => {
      state.currentOrganizationUuid = action.payload || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listUserAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listUserAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.rows || [];
        state.total = action.payload.count || 0;
        state.currentPage = action.payload.current_page || 0;
      })
      .addCase(listUserAction.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch User";
      })
      .addCase(updateUserAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAction.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateUserAction.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update user";
      });
  },
});

export const userReducer = userSlice.reducer;
export const { addOrganizations } = userSlice.actions;
