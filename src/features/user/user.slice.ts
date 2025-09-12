import { createSlice } from "@reduxjs/toolkit";


export interface SignInInterface {
  email: string;
  password: string;
  organization_uuid?: string;
}

const initialState: any = {
  isLoading: false,
  organizations: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addOrganazation: (state, action) => {
      state.organizations = action.payload.organizations || [];
    },
  },
  extraReducers: (builder) => {
    // Get user-specific organizations
  },
});



export const userReducer = userSlice.reducer;
