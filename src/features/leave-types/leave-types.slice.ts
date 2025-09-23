import { createSlice } from "@reduxjs/toolkit";


const initialState: any = {
  isLoading: false,
  leaveTypes: [],
};

export const roleSlice = createSlice({
  name: "leave-type",
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
