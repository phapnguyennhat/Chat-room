
import 'server-only'
import { cookies } from "next/headers";

export default async function getAuthCookies() {
  const cookieStore = await cookies();
  const Authentication =  cookieStore.get('Authentication');
  const Refresh = cookieStore.get('Refresh');
 
  if(Authentication?.value && Refresh?.value){
    return `${Authentication.name}=${Authentication.value}; ${Refresh.name}=${Refresh.value}`;
  }else{
    return ''
  }
}

