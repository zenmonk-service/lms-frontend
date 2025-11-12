import { createSlice } from "@reduxjs/toolkit";
import {
  isUserExistAction,
  listUserAction,
  updateUserAction,
} from "./user.action";
import { set } from "date-fns";

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
  isUserExist: boolean;
  currentUser: UserInterface | null;
};

const initialState: UserState = {
  isLoading: false,
  organizations: [],
  isUserExist: false,
  currentOrganizationUuid: "",
  currentUser: null,
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
    setIsUserExist: (state, action) => {
      state.isUserExist = action.payload || false;
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
        if (action.payload.isCurrentUser && action.payload.email) {
          action.payload?.rows?.map((user: UserInterface) => {
            if (user.email === action.payload.email) {
              state.currentUser = user;
            }
          });
        } else {
          state.users = action.payload.rows || [];
          state.total = action.payload.count || 0;
          state.currentPage = action.payload.current_page || 0;
        }
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
      })
      .addCase(isUserExistAction.pending, (state) => {
        state.error = null;
      })
      .addCase(isUserExistAction.fulfilled, (state, action) => {
        state.isUserExist = action.payload;
      })
      .addCase(isUserExistAction.rejected, (state, action: any) => {
        state.error =
          action.payload?.message || "Failed to check user existence";
      });
  },
});

export const userReducer = userSlice.reducer;
export const { setCurrentOrganizationUuid, setPagination, setIsUserExist } =
  userSlice.actions;
