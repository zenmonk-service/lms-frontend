import axiosInterceptorInstance from "@/config/axios";
import { SignInInterface } from "./user.slice";

export const getUserOrganizations = (userId: string) => {
  return axiosInterceptorInstance.get(`/users/${userId}/organizations` )
};


export const signIn = (signInfo?: SignInInterface) => {
  return  axiosInterceptorInstance.post("/login" , signInfo)
};

