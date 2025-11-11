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
  is_active: boolean;
  created_at: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  search: string;
}

type UserState = {
  isLoading: boolean;
  organizations: any[];
  currentOrganizationUuid: string;
  users: UserInterface[];
  pagination: PaginationState;
  total: number;
  currentPage: number;
  error?: string | null;
};

const initialState: UserState = {
  isLoading: false,
  organizations: [],
  currentOrganizationUuid: "",
  users: [],
  total: 0,
  currentPage: 0,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    search: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentOrganizationUuid: (state, action) => {
      state.currentOrganizationUuid = action.payload || "";
    },
    setPagination: (state, action) => {
      state.pagination = action.payload || initialState.pagination;
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
export const { setCurrentOrganizationUuid, setPagination } = userSlice.actions;
