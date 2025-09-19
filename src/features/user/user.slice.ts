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
  },
  extraReducers: (builder) => {
  
  },
});



export const userReducer = userSlice.reducer;
export const { addOrganizations} = userSlice.actions 
