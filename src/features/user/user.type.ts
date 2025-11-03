export const userSignInType = "user/signIn";



export interface CreateUserPayload{
     name : string ;
     email :string;
     password : string ;
     role  : string ;
     org_uuid :string  
}