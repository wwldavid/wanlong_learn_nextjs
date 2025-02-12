1. edit /app/ui/dashboard/nav-links.tsx

   obtain current address
   'use client'
   import {usePathname} from 'next/navigation'
   const pathname = usePathname()
