"use client"
import React from 'react'
import Agent from './Agent'
import { useAuth, useUser } from '@clerk/nextjs'

const page = () => {
  const { userId } = useAuth()
  const { user } = useUser()
  console.log(user)
  return (
    <div>
      <Agent userName={user?.fullName || "User"} type="generate" userId={userId!} imageUrl ={user?.imageUrl!}/>
    </div>
  )
}

export default page
