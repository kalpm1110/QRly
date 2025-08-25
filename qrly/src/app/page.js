"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

function Home() {
  return (
    <div>
      <Link href='/dashboard'><Button className="mt-10">Get Started</Button></Link>
    </div>
  )
}

export default Home
