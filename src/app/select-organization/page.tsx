"use client";

import React, { useState } from "react";
import {
  Search,
  Building2,
  Users,
  ChevronRight,
  User,
  Settings,
} from "lucide-react";
import AppBar from "@/components/app-bar";

interface Organization {
  id: string;
  name: string;
  domain: string;
  avatar?: string;
}

const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "TechCorp Industries",
    domain: "techcorp.com",
  },
  {
    id: "2",
    name: "Design Studio Pro",
    domain: "designstudio.io",
  },
];

function App() {
  const handleOrgSelect = (id: string) => {};

  const getOrgInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <AppBar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose your workspace
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the organization you'd like to work in. You can always switch
            between workspaces later.
          </p>
        </div>

        {/* Organizations Grid */}
        <div className="grid gap-4 max-w-2xl mx-auto">
          {mockOrganizations.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No workspaces found matching your search.
              </p>
            </div>
          ) : (
            mockOrganizations.map((org) => (
              <div
                key={org.id}
                onClick={() => handleOrgSelect(org.id)}
                className={`group cursor-pointer bg-white rounded-xl border-2 p-6 transition-all duration-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100 ${"border-gray-200 hover:scale-[1.01]"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Organization Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {getOrgInitials(org.name)}
                    </div>

                    {/* Organization Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-orange-700 transition-colors">
                          {org.name}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <span className="font-medium">@{org.domain}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-4">
            Can't find your workspace?
          </p>
          <span className="text-orange-600 font-medium transition-colors">
            Contact your admin to get access to an organization
          </span>
        </div>
      </main>
    </div>
  );
}

export default App;
