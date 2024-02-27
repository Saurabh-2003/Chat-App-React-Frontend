import { Loader, Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <main className='h-screen w-full grid place-items-center'>
      <Loader2 size={50} className=' text-bg-primary animate-spin'/>
    </main>
  )
}

export default Loading