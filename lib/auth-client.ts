import { createAuthClient } from 'better-auth/client'

export const authClient = createAuthClient()

export async function signInEmail(email: string, password: string) {
  return authClient.signIn.email({ email, password })
}

export async function signUpEmail(name: string, email: string, password: string) {
  return authClient.signUp.email({ name, email, password })
}

export async function signOut() {
  return authClient.signOut()
}

export async function getSession() {
  return authClient.getSession()
}
