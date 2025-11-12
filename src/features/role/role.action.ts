
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getOrganizationRoles } from "./role.service";
import { listRolePayload } from "./role.type";
import { toast } from "sonner";


export const getOrganizationRolesAction = createAsyncThunk(
  "roles/get",
  async (payload: listRolePayload , thunkAPI ) => {
    try {
      const response = await getOrganizationRoles(payload);
      return response.data;

    } catch (err) {
      toast.error("Something went wrong.");
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
