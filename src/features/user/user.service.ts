import axiosInterceptorInstance from "@/config/axios";
import { SignInInterface } from "./user.slice";
import { CreateUserPayload } from "./user.type";

export const getUserOrganizations = (userId: string) => {
  return axiosInterceptorInstance.get(`/users/${userId}/organizations`);
};

export const signIn = (signInfo?: SignInInterface) => {
  return axiosInterceptorInstance.post("/login", signInfo);
};

export const createUser = (user?: CreateUserPayload) => {
  return axiosInterceptorInstance.post("/users", user);
};

export const listUser = (
  filters: { page: number; limit: number },
  org_uuid: string
) => {
  return axiosInterceptorInstance.get(`/users/${org_uuid}`, {
    params: filters,
  });
};
