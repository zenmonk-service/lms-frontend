import { createSlice } from "@reduxjs/toolkit";
import { getOrganizationRoles } from "./role.service";
import { getOrganizationRolesAction } from "./role.action";


export interface SignInInterface {
  email: string;
  password: string;
  organization_uuid?: string;
}

const initialState: any = {
  isLoading: false,
  roles: [],
};

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
  builder.addCase(getOrganizationRolesAction.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(getOrganizationRolesAction.fulfilled, (state, action) => {
          state.isLoading = false;
          state.roles = action.payload ||  [];
         
        })
        .addCase(getOrganizationRolesAction.rejected, (state, action: any) => {
          state.isLoading = false;
          state.error =
            action.payload?.message || "Failed to fetch organizations";
        })
  },
});



export const rolesReducer = roleSlice.reducer;
export const {  } = roleSlice.actions