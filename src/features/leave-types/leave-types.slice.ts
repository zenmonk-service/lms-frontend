import { createSlice } from "@reduxjs/toolkit";


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
    addRoles: (state, action) => {
      console.log('action.payload : ', action.payload );
      state.roles = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    // Get user-specific organizations
  },
});



export const rolesReducer = roleSlice.reducer;
export const { addRoles} = roleSlice.actions 
