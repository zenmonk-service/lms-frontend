import axiosInterceptorInstance from "@/config/axios";
import { SignInInterface } from "./user.slice";


export const signIn = (signInfo?: SignInInterface) => {
  return axiosInterceptorInstance.post("/sign-in" , signInfo)
};

