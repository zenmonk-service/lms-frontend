import axiosInterceptorInstance from "@/config/axios";

export const getOrganizationRoles = (org_uuid: string) => {
  return axiosInterceptorInstance.get(`/organizations/roles` ,  {
    headers: {
      org_uuid: org_uuid,
    }
   })
};
