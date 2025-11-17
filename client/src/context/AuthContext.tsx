import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import type { User } from '@/types'
import { supabase } from '@/lib/supabase'

type AuthContextType = {
  user: User | null;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mapUser = (authUser: SupabaseUser | null): User | null => {
  if (!authUser) return null

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    full_name: (authUser.user_metadata?.full_name as string | undefined) ?? '',
    avatar_url: (authUser.user_metadata?.avatar_url as string | undefined) ?? undefined,
    created_at: authUser.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setUser(mapUser(data.session?.user ?? null))
      setLoading(false)
    }

    fetchSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(mapUser(nextSession?.user ?? null))
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error) {
        setSession(data.session)
        setUser(mapUser(data.user ?? null))
      }
      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      // Create a profile for the new user
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
      }

      setUser(mapUser(data.user ?? null))
      setSession(data.session)

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (!error) {
        setUser(null)
        setSession(null)
      }
      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No authenticated user')
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      // Update the user state
      setUser((prevUser) => (prevUser ? { ...prevUser, ...updates } : null))

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
