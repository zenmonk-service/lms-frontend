import { getSession } from "@/app/auth/get-auth.action";
import Dashboard from "@/components/dashboard/dashboard";

async function UserDashBoard({
  params}: {
  params: { organization_uuid: string };
}) 
     

{
   const session = await getSession()
console.log('✌️sessiocccn --->', session);
  return <Dashboard organization_uuid={params.organization_uuid}  email ={session?.user?.email || ""} />;
}

export default UserDashBoard;
