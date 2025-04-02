import { getProfile } from "@/API/user/query";
import Button from "@/components/button";
import { redirect } from "next/navigation";


export default async function  Home() {
  

  const profile = await getProfile()
  if (!profile) {
    redirect('/login')
  }
  return (
    <div>
      haha
    </div>
  );
}
