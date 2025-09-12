import { createSlice } from "@reduxjs/toolkit";
import {
  getOrganizationsAction,
  createOrganizationAction,
  updateOrganizationAction,
  deleteOrganizationAction,
} from "./organizations.action";


export interface Organization {
  id?: string;
  name: string;
  domain: string;
  description: string
}

interface OrganizationState {
  isLoading: boolean;
  organizations: Organization[];
  error: string | null;
  total: number;
  currentPage: number;
}

const mockOrgs = [
  {
    id: "1",
    name: "ZenMonk Technologies",
    domain: "zenmonk.com",
    website: "https://zenmonk.com",
    description: "Building mindful software experiences.",
    logoUrl: "/logo.svg",
    members: [
      {
        id: "m1",
        name: "Vinod Kumar",
        email: "vinod@zenmonk.com",
        role: "Owner",
      },
      {
        id: "m2",
        name: "Aarav Sharma",
        email: "aarav@zenmonk.com",
        role: "Admin",
      },
      {
        id: "m3",
        name: "Neha Patel",
        email: "neha@zenmonk.com",
        role: "Member",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "CloudCore Systems",
    domain: "cloudcore.io",
    website: "https://cloudcore.io",
    description: "Cloud-native solutions for enterprises.",
    members: [
      {
        id: "m1",
        name: "Ravi Gupta",
        email: "ravi@cloudcore.io",
        role: "Owner",
      },
      {
        id: "m2",
        name: "Sonia Iyer",
        email: "sonia@cloudcore.io",
        role: "Member",
      },
      {
        id: "m3",
        name: "Karan Mehta",
        email: "karan@cloudcore.io",
        role: "Member",
      },
      {
        id: "m4",
        name: "Priya Reddy",
        email: "priya@cloudcore.io",
        role: "Admin",
      },
      {
        id: "m5",
        name: "Aditya Verma",
        email: "aditya@cloudcore.io",
        role: "Member",
      },
      {
        id: "m6",
        name: "Ishaan Nair",
        email: "ishaan@cloudcore.io",
        role: "Member",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "CloudCore Systems",
    domain: "cloudcore.io",
    website: "https://cloudcore.io",
    description: "Cloud-native solutions for enterprises.",
    members: [
      {
        id: "m1",
        name: "Ravi Gupta",
        email: "ravi@cloudcore.io",
        role: "Owner",
      },
      {
        id: "m2",
        name: "Sonia Iyer",
        email: "sonia@cloudcore.io",
        role: "Member",
      },
      {
        id: "m3",
        name: "Karan Mehta",
        email: "karan@cloudcore.io",
        role: "Member",
      },
      {
        id: "m4",
        name: "Priya Reddy",
        email: "priya@cloudcore.io",
        role: "Admin",
      },
      {
        id: "m5",
        name: "Aditya Verma",
        email: "aditya@cloudcore.io",
        role: "Member",
      },
      {
        id: "m6",
        name: "Ishaan Nair",
        email: "ishaan@cloudcore.io",
        role: "Member",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "CloudCore Systems",
    domain: "cloudcore.io",
    website: "https://cloudcore.io",
    description: "Cloud-native solutions for enterprises.",
    members: [
      {
        id: "m1",
        name: "Ravi Gupta",
        email: "ravi@cloudcore.io",
        role: "Owner",
      },
      {
        id: "m2",
        name: "Sonia Iyer",
        email: "sonia@cloudcore.io",
        role: "Member",
      },
      {
        id: "m3",
        name: "Karan Mehta",
        email: "karan@cloudcore.io",
        role: "Member",
      },
      {
        id: "m4",
        name: "Priya Reddy",
        email: "priya@cloudcore.io",
        role: "Admin",
      },
      {
        id: "m5",
        name: "Aditya Verma",
        email: "aditya@cloudcore.io",
        role: "Member",
      },
      {
        id: "m6",
        name: "Ishaan Nair",
        email: "ishaan@cloudcore.io",
        role: "Member",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "CloudCore Systems",
    domain: "cloudcore.io",
    website: "https://cloudcore.io",
    description: "Cloud-native solutions for enterprises.",
    members: [
      {
        id: "m1",
        name: "Ravi Gupta",
        email: "ravi@cloudcore.io",
        role: "Owner",
      },
      {
        id: "m2",
        name: "Sonia Iyer",
        email: "sonia@cloudcore.io",
        role: "Member",
      },
      {
        id: "m3",
        name: "Karan Mehta",
        email: "karan@cloudcore.io",
        role: "Member",
      },
      {
        id: "m4",
        name: "Priya Reddy",
        email: "priya@cloudcore.io",
        role: "Admin",
      },
      {
        id: "m5",
        name: "Aditya Verma",
        email: "aditya@cloudcore.io",
        role: "Member",
      },
      {
        id: "m6",
        name: "Ishaan Nair",
        email: "ishaan@cloudcore.io",
        role: "Member",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "CloudCore Systems",
    domain: "cloudcore.io",
    website: "https://cloudcore.io",
    description: "Cloud-native solutions for enterprises.",
    members: [
      {
        id: "m1",
        name: "Ravi Gupta",
        email: "ravi@cloudcore.io",
        role: "Owner",
      },
      {
        id: "m2",
        name: "Sonia Iyer",
        email: "sonia@cloudcore.io",
        role: "Member",
      },
      {
        id: "m3",
        name: "Karan Mehta",
        email: "karan@cloudcore.io",
        role: "Member",
      },
      {
        id: "m4",
        name: "Priya Reddy",
        email: "priya@cloudcore.io",
        role: "Admin",
      },
      {
        id: "m5",
        name: "Aditya Verma",
        email: "aditya@cloudcore.io",
        role: "Member",
      },
      {
        id: "m6",
        name: "Ishaan Nair",
        email: "ishaan@cloudcore.io",
        role: "Member",
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

const initialState: OrganizationState = {
  isLoading: false,
  organizations: mockOrgs as any,
  error: null,
  total: 100,
  currentPage: 1,
};

export const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get all organizations
    builder
      .addCase(getOrganizationsAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrganizationsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = action.payload.organizations || [];
        state.total = action.payload.total || 0;
      })
      .addCase(getOrganizationsAction.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch organizations";
      });


    // Create organization
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
        state.error = action.payload?.message || "Failed to create organization";
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
        state.error = action.payload?.message || "Failed to update organization";
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
        state.error = action.payload?.message || "Failed to delete organization";
      });
  },
});



export const organizationsReducer = organizationsSlice.reducer;
