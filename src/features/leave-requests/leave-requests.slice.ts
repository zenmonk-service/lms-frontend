import { createSlice } from "@reduxjs/toolkit";
import {
  createUserLeaveRequestsAction,
  getUserLeaveRequestsAction,
  getLeaveRequestsAction, // <- add this
} from "./leave-requests.action";
import { LeaveRequestStatus } from "./leave-requests.types";

interface Row {
  uuid: string;
  start_date: string;
  end_date: string;
  type: string;
  range: string;
  leave_duration: string;
  reason: string;
  status: LeaveRequestStatus;
  leave_type: {
    name: string;
    uuid: string;
  };
  managers: {
    remarks: string;
    user: {
      user_id: string;
      name: string;
      email: string;
    };
  }[];
}
interface LeaveRequest {
  count: number;
  rows: Row[];
}

interface LeaveRequestState {
  isLoading: boolean;
  userLeaveRequests: LeaveRequest;
}

const initialState: LeaveRequestState = {
  isLoading: false,
  userLeaveRequests: { rows: [], count: 0 },
};

const leaveRequestSlice = createSlice({
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
        state.userLeaveRequests = action.payload ?? { rows: [], count: 0 };
      })
      .addCase(getLeaveRequestsAction.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getUserLeaveRequestsAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserLeaveRequestsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userLeaveRequests = action.payload;
      })
      .addCase(getUserLeaveRequestsAction.rejected, (state) => {
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

export default leaveRequestSlice.reducer;
