"use client";

import { use, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Calendar,
  ClipboardList,
  Plane,
  ChevronDown,
  BookCheck,
  Loader,
} from "lucide-react";

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
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { listRolePermissionsAction } from "@/features/permissions/permission.action";
import { hasPermissions } from "@/libs/haspermissios";
import { useSession } from "next-auth/react";

export function AppSidebar({ uuid }: { uuid: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.userSlice);
  const { currentUserRolePermissions } = useAppSelector(
    (state) => state.permissionSlice
  );
  function hasPagePermission(tag: string) {
    return currentUserRolePermissions.some((perm) => perm.tag === tag);
  }
  const { data, update } = useSession();

  const filterItemsByPermission = (items: any[]) => {
    return items
      .filter((item) => {
        if (item.tag) {
          if (item.title === "Approvals") {
            return (
              hasPagePermission(item.tag) &&
              hasPermissions(
                "leave_request_management",
                "approval",
                currentUserRolePermissions,
                currentUser?.email
              )
            );
          }
          return hasPagePermission(item.tag);
        }
        return true;
      })
      .map((item) => {
        if (item.items) {
          const filteredChildren: any = filterItemsByPermission(item.items);
          return filteredChildren.length > 0
            ? { ...item, items: filteredChildren }
            : null;
        }
        return item;
      })
      .filter(Boolean);
  };

  const items = filterItemsByPermission([
    {
      title: "Home",
      url: `/${uuid}/dashboard`,
      icon: Home,
    },
    {
      tag: "user_management",
      title: "User Management",
      url: `/${uuid}/user-management`,
      icon: Users,
    },
    {
      tag: "role_management",
      title: "Role Management",
      url: `/${uuid}/role-management`,
      icon: Users,
    },
    {
      title: "Leave Management",
      icon: Calendar,
      items: [
        {
          tag: "leave_type_management",
          title: "Leave Types",
          url: `/${uuid}/leave-types`,
          icon: ClipboardList,
        },
        {
          tag: "leave_request_management",
          title: "My Leaves",
          url: `/${uuid}/my-leaves`,
          icon: Plane,
        },
        {
          tag: "leave_request_management",
          title: "Approvals",
          url: `/${uuid}/approvals`,
          icon: BookCheck,
        },
      ],
    },
  ]);

  function SidebarNestedItem({ item }: { item: any }) {
    const [open, setOpen] = useState(item.title === "Leave Management");

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
                className={`ml-auto w-4 h-4 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
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
              {item?.items?.map((child: any) => (
                <SidebarMenuItem key={child.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={child.url}
                      className={
                        pathname === child.url
                          ? "bg-orange-100 text-orange-600 font-semibold rounded-md hover:!text-orange-600 hover:!bg-orange-100"
                          : ""
                      }
                    >
                      <child.icon className="w-4 h-4" />
                      <span>{child.title}</span>
                    </Link>
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
          <Link
            href={item.url}
            className={
              pathname === item.url
                ? "bg-orange-100 text-orange-600 font-semibold rounded-md"
                : ""
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  useEffect(() => {
    if (currentUser?.role.uuid) {
      dispatch(
        listRolePermissionsAction({
          org_uuid: uuid,
          role_uuid: currentUser.role.uuid,
          isCurrentUserRolePermissions: true,
        })
      );
    }
  }, [currentUser, uuid]);

  useEffect(() => {
    if (data?.user.email && currentUserRolePermissions?.length > 0) {
      update({
        ...data,
        user: {
          ...data.user,
          permissions: currentUserRolePermissions,
        },
      });
    }
  }, [currentUserRolePermissions]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-8">
              {items?.map((item: any) => (
                <SidebarNestedItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
