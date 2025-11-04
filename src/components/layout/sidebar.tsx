"use client";

import { useState } from "react";
import { Home, Users, Calendar, ClipboardList, Plane, ChevronDown } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({uuid} : {uuid :string}) {

  const items = [
  {
    title: "Home",
    url: `/${uuid}/dashboard`,
    icon: Home,
  },
  {
    title: "User Management",
    url: `/organizations/${uuid}`,
    icon: Users,
  },
  {
    title: "Leave Management",
    icon: Calendar,
    items: [
      {
        title: "Leave Types",
        url: `/${uuid}/leave-types`,
        icon: ClipboardList,
      },
      {
        title: "My Leaves",
        url: `/${uuid}/my-leaves`,
        icon: Plane,
      },
    ],
  },
];

function SidebarNestedItem({ item }: { item: any }) {
  const [open, setOpen] = useState(false);

  if (item.items) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          onClick={() => setOpen((prev) => !prev)}
          className="flex justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <item.icon className="w-4 h-4" />
            <span>{item.title}</span>
            <ChevronDown
              className={`ml-auto w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
        </SidebarMenuButton>

        {/* Collapsible children */}
        <div
          className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            open ? "max-h-40" : "max-h-0"
          }`}
        >
          <SidebarMenu className="ml-4">
            {item.items.map((child: any) => (
              <SidebarMenuItem key={child.title}>
                <SidebarMenuButton asChild>
                  <a href={child.url}>
                    <child.icon className="w-4 h-4" />
                    <span>{child.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a href={item.url}>
          <item.icon className="w-4 h-4" />
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-8">
              {items.map((item) => (
                <SidebarNestedItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}



