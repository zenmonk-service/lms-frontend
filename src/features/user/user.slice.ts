import { createSlice } from "@reduxjs/toolkit";


export interface SignInInterface {
  email: string;
  password: string;
  organization_uuid?: string;
}

const initialState: any = {
  isLoading: false,
  organizations: [],
  currentOrganizationUuid: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addOrganizations: (state, action) => {
      state.organizations = action.payload.organizations || [];
    },

    addCurrentOrganization: (state, action)=> {
      state.currentOrganizationUuid = action
    }
  },
  extraReducers: (builder) => {
    // Get user-specific organizations
  },
});



export const userReducer = userSlice.reducer;
export const {addCurrentOrganization, addOrganizations} = userSlice.actions 
