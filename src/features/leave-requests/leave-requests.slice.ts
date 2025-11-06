import { createSlice } from "@reduxjs/toolkit";
import {
  createUserLeaveRequestsAction,
  getLeaveRequestsAction,
} from "./leave-requests.action";

const initialState = {
  isLoading: false,
  leaveRequests: {},
};

const leaveRequestSilce = createSlice({
  name: "leave-requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLeaveRequestsAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLeaveRequestsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(getLeaveRequestsAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createUserLeaveRequestsAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUserLeaveRequestsAction.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createUserLeaveRequestsAction.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default leaveRequestSilce.reducer;
