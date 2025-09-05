import { createSlice } from "@reduxjs/toolkit";
import { signInAction } from "./user.action";


export interface SignInInterface {
  email: string;
  password: string;
  organization_uuid?: string;
}

const initialState : any = {
  isLoading: false,
 

};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(signInAction.rejected, (state, action : any) => {
        state.isLoading = false;
        state.error  = action.payload.message;
      });
  },
});



export const userReducer = userSlice.reducer;
