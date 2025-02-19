import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { User } from "./app/lib/definitions";
import bcrypt from "bcryptjs";

async function getUser(email: string) {
 try {
   const users = await sql<User>`SELECT * FROM users WHERE email = ${email}`
   console.log('Found user:', users.rows[0] ? 'Yes' : 'No')
   return users.rows[0]
 } catch (error) {
   console.error('obtain user information failed', error)
   throw new Error('obtain user information failed')
 }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers:[
    Credentials({
      async authorize(credentials){
        const parsedCredentials = z.object({
          email: z.string().email(),
          password: z.string().min(6)
        }).safeParse(credentials)
        if(parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)
          console.log('User lookup:', user ? 'Found' : 'Not found') 
          if (!user) return null
          const passwordsMatch = await bcrypt.compare(password, user.password)
          console.log('Password match:', passwordsMatch ? 'Yes' : 'No') 
          if(passwordsMatch) return user
        }
         console.log('user authentication failed')
         return null
      }
    })
  ]
})