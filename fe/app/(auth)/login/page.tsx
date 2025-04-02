import React from 'react'
import LoginForm from './components/LoginForm'
import Image from 'next/image'
import Logo from '@/public/logo.png'

export default function LoginPage() {
  return (
      <main className=' flex h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 '  >
          <div className=' w-full flex flex-col items-center max-w-md space-y-8' >
              <div className=' flex flex-col items-center gap-8' >
                  <Image src={Logo} alt='Logo' className=' w-[140px] h-auto ' />
                  <h2 className='  text-center text-3xl font-bold tracking-tight text-gray-900' >Sign in to your account</h2>
              </div>
              
              <LoginForm/>
          </div>
        
    </main>
  )
}
