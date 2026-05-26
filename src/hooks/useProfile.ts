'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store'

export function useProfile() {
  const { profile, setProfile } = useAppStore()
  const supabase = createClient()

  useEffect(() => {
    if (profile) return
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('*').eq('id', user.id).single()
        .then(({ data }) => { if (data) setProfile(data) })
    })
  }, [])

  const updateProfile = async (updates: Record<string, any>) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single()
    if (data) setProfile(data)
  }

  return { profile, updateProfile }
}
