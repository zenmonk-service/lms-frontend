export const userSignInType = "user/signIn";



export interface CreateUserPayload{
     name : string ;
     email :string;
     password : string ;
     roleUUID  : string ;
     org_uuid :string  
}