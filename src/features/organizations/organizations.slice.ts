import { createSlice } from "@reduxjs/toolkit";
import {
  getOrganizationsAction,
  createOrganizationAction,
  updateOrganizationAction,
  deleteOrganizationAction,
  getOrganizationById,
  getAllOrganizationsAction,
  activateUserAction,
  deactivateUserAction,
} from "./organizations.action";

export interface Organization {
  id: string;
  uuid: string;
  name: string;
  domain: string;
  description: string;
  roles: any[];
}

interface OrganizationState {
  isLoading: boolean;
  organizations: Organization[];
  currentOrganizationAndUser?: Organization;
  error: string | null;
  total: number;
  currentPage: number;
}

const initialState: OrganizationState = {
  isLoading: false,
  organizations: [],
  currentOrganizationAndUser: undefined,
  error: null,
  total: 100,
  currentPage: 1,
};

export const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    addCurrentOrganization: (state, action) => {
      state.currentOrganizationAndUser = state.organizations.find(
        (org) => org.uuid == action.payload
      );
    },
    addOrganizationRoles: (state, action) => {
      if (state.currentOrganizationAndUser)
        state.currentOrganizationAndUser.roles = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrganizationsAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrganizationsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = action.payload.rows || [];
        state.total = action.payload.total || 0;
        state.currentPage = action.payload.current_page || 0;
      })
      .addCase(getOrganizationsAction.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch organizations";
      })
      .addCase(getAllOrganizationsAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrganizationsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = action.payload.rows || [];
        state.total = action.payload.total || 0;
        state.currentPage = action.payload.current_page || 0;
      })
      .addCase(getAllOrganizationsAction.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch organizations";
      })
      .addCase(getOrganizationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrganizationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrganizationAndUser = action.payload;
      })
      .addCase(getOrganizationById.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch organizations";
      });

    builder
      .addCase(createOrganizationAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrganizationAction.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.organization) {
          state.organizations.push(action.payload.organization);
        }
      })
      .addCase(createOrganizationAction.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to create organization";
      });

    // Update organization
    builder
      .addCase(updateOrganizationAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrganizationAction.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrg = action.payload.organization;
        state.organizations = state.organizations.map((org) =>
          org.id === updatedOrg.id ? updatedOrg : org
        );
      })
      .addCase(updateOrganizationAction.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to update organization";
      });

    // Delete organization
    builder
      .addCase(deleteOrganizationAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteOrganizationAction.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.meta.arg; // because we pass organizationId directly
        state.organizations = state.organizations.filter(
          (org) => org.id !== deletedId
        );
      })
      .addCase(deleteOrganizationAction.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to delete organization";
      });

    builder
      .addCase(activateUserAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateUserAction.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(activateUserAction.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })
      .addCase(deactivateUserAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deactivateUserAction.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deactivateUserAction.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      });
  },
});

export const organizationsReducer = organizationsSlice.reducer;
export const { addCurrentOrganization, addOrganizationRoles } =
  organizationsSlice.actions;
