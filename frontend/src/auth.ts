import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "@neondatabase/serverless"
//import { saltAndHashPassword } from "@/utils/password"

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // Create a `Pool` inside the request handler.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return {
    adapter: PostgresAdapter(pool),
    providers: [
      Google,
      Credentials({
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials) => {
          let user = null
          // logic to salt and hash password
          // logic to salt and hash password
          //const pwHash = saltAndHashPassword(credentials.password)
          // logic to verify if the user exists
          user = await pool.query("SELECT * FROM users WHERE email = $1",[credentials.email])
          if (!user) {
            throw new Error("User not found.")
          }
          return user
          // logic to compare the password

        }
      })
    ],
  }
})