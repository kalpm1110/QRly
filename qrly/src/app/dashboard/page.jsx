"use client"
import { useUser } from '@clerk/nextjs'
import React from 'react'

function DashBoard() {
  const {user,isSignedIn}=useUser();
  if(!user || !isSignedIn) return <div>Loading,..</div>
  console.log(user);
  return (
    <div>
      <h1>Welcome,{user.firstName}!</h1>
    </div>
  )
}

export default DashBoard
