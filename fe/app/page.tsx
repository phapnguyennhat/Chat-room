import { getProfile } from '@/API/user/query'
import { redirect } from 'next/navigation'

export default async function HomePage() {
    const profile = await getProfile()

    if (!profile) {
        redirect('/login')
    } else {
        
        redirect('/message')
    }
    
    return (
    <div>
      
    </div>
  )
}
