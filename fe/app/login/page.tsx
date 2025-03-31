import React from 'react'
import LoginForm from './components/LoginForm'

export default function LoginPage() {
  return (
      <main className=' flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 '  >
          <div className=' w-full flex flex-col items-center max-w-md space-y-8' >
              <div className=' flex flex-col items-center gap-8' >
                  logo
                  <h2 className=' mt-6 text-center text-3xl font-bold tracking-tight text-gray-900' >Sign in to your account</h2>
              </div>
              
              <LoginForm/>
          </div>
        
    </main>
  )
}
